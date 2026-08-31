-- Apply this once after 20260831_management.sql.
-- It makes consultant commission personal to the selected employee.
-- KTV: 50% of price_snapshot (service/package price).
-- Consultant: personal percentage of revenue_amount (actual collected amount).

alter table public.revenue_entries
  add column if not exists customer_name text;

update public.revenue_entries
set customer_name = 'Khách chưa rõ'
where customer_name is null or btrim(customer_name) = '';

alter table public.revenue_entries
  alter column customer_name set not null;

create index if not exists revenue_entries_customer_idx
  on public.revenue_entries (customer_name, service_date desc);

alter table public.revenue_entries
  add column if not exists source_ref text;

create unique index if not exists revenue_entries_source_ref_unique_idx
  on public.revenue_entries (source_ref) where source_ref is not null;

drop policy if exists "Entries: owner deletes unclosed" on public.revenue_entries;
create policy "Entries: owner deletes unclosed" on public.revenue_entries for delete to authenticated using (
  (select public.is_owner())
  and not exists (
    select 1 from public.commission_ledger
    where revenue_entry_id = public.revenue_entries.id and status in ('locked', 'paid')
  )
);

alter table public.commission_rules
  add column if not exists recipient_profile_id uuid references public.profiles(id) on delete cascade;

alter table public.commission_rules
  alter column service_id drop not null,
  alter column sale_type drop not null;

create index if not exists commission_rules_recipient_lookup_idx
  on public.commission_rules (recipient_profile_id, target, valid_from desc);

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
      and recipient_profile_id is null
      and sale_type = new.sale_type
      and active
      and valid_from <= new.service_date
      and (valid_to is null or valid_to >= new.service_date)
    order by valid_from desc, created_at desc
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
    where (service_id = new.service_id or service_id is null)
      and target = 'consultant'
      and recipient_profile_id = new.consultant_id
      and (sale_type = new.sale_type or sale_type is null)
      and active
      and valid_from <= new.service_date
      and (valid_to is null or valid_to >= new.service_date)
    order by (service_id is not null) desc, (sale_type is not null) desc, valid_from desc, created_at desc
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

drop trigger if exists revenue_entries_refresh_commissions on public.revenue_entries;
create trigger revenue_entries_refresh_commissions
  after insert or update of service_date, service_id, sale_type, price_snapshot, revenue_amount, technician_id, consultant_id, service_name_snapshot, status
  on public.revenue_entries
  for each row execute procedure public.refresh_entry_commissions();

-- The initial workbook shows 5% for Hiếu, Xuyến and Trang. Miên's latest
-- (month 8) sheet shows 10%; this is deliberately a personal, editable rule.
-- Existing void, locked and paid revenue is not changed.
delete from public.commission_rules where target = 'consultant';

insert into public.commission_rules (
  service_id,
  target,
  recipient_profile_id,
  sale_type,
  rate_type,
  rate_value,
  valid_from,
  active
)
select
  null,
  'consultant',
  profile.id,
  null,
  'percentage',
  case when profile.display_name = 'Miên' then 10 else 5 end,
  current_date,
  true
from public.profiles as profile
where profile.is_active
  and profile.display_name in ('Hiếu', 'Xuyến', 'Trang', 'Miên');

-- Recalculate only entries that are still pending payroll. This corrects an
-- unclosed entry if it was recorded with the old commission calculation.
update public.revenue_entries as entry
set revenue_amount = entry.revenue_amount
where entry.status = 'completed'
  and not exists (
    select 1
    from public.commission_ledger as ledger
    where ledger.revenue_entry_id = entry.id
      and ledger.status in ('locked', 'paid')
  );
