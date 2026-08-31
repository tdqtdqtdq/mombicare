-- Apply this once to the existing Supabase project after 20260831_management.sql.
-- Technician percentage is calculated from price_snapshot (the service/package price).
-- Consultant percentage is calculated from revenue_amount (actual collected revenue).

create or replace function public.refresh_entry_commissions()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  matched_rule public.commission_rules%rowtype;
  commission_amount numeric(14, 0);
  commission_base numeric(14, 0);
begin
  if tg_op = 'UPDATE' and exists (
    select 1 from public.commission_ledger
    where revenue_entry_id = new.id and status in ('locked', 'paid')
  ) then
    raise exception 'Không thể sửa doanh thu đã chốt lương.';
  end if;

  delete from public.commission_ledger where revenue_entry_id = new.id and status = 'pending';

  if new.status = 'void' then
    return new;
  end if;

  if new.technician_id is not null then
    select * into matched_rule
    from public.commission_rules
    where service_id = new.service_id
      and target = 'technician'
      and sale_type = new.sale_type
      and active
      and valid_from <= new.service_date
      and (valid_to is null or valid_to >= new.service_date)
    order by valid_from desc
    limit 1;

    if found then
      commission_base := new.price_snapshot;
      commission_amount := case when matched_rule.rate_type = 'percentage'
        then round(commission_base * matched_rule.rate_value / 100)
        else round(matched_rule.rate_value)
      end;
      insert into public.commission_ledger (revenue_entry_id, employee_id, target, amount, rate_type, rate_value, service_name_snapshot, service_date)
      values (new.id, new.technician_id, 'technician', commission_amount, matched_rule.rate_type, matched_rule.rate_value, new.service_name_snapshot, new.service_date);
    end if;
  end if;

  if new.consultant_id is not null then
    select * into matched_rule
    from public.commission_rules
    where service_id = new.service_id
      and target = 'consultant'
      and sale_type = new.sale_type
      and active
      and valid_from <= new.service_date
      and (valid_to is null or valid_to >= new.service_date)
    order by valid_from desc
    limit 1;

    if found then
      commission_base := new.revenue_amount;
      commission_amount := case when matched_rule.rate_type = 'percentage'
        then round(commission_base * matched_rule.rate_value / 100)
        else round(matched_rule.rate_value)
      end;
      insert into public.commission_ledger (revenue_entry_id, employee_id, target, amount, rate_type, rate_value, service_name_snapshot, service_date)
      values (new.id, new.consultant_id, 'consultant', commission_amount, matched_rule.rate_type, matched_rule.rate_value, new.service_name_snapshot, new.service_date);
    end if;
  end if;

  return new;
end;
$$;
