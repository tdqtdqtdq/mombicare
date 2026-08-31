-- Correct the August external-tour entries: their sheet has no internal
-- employee name, so they must never be allocated to Trang or any staff salary.

alter table public.revenue_entries
  add column if not exists external_payout_amount numeric(14, 0) not null default 0
  check (external_payout_amount >= 0);

-- This update removes the existing pending KTV ledger rows through the normal
-- commission trigger, then stores the 75,000 VND payout for each of the four
-- source rows directly as an external expense.
update public.revenue_entries as entry
set
  technician_id = null,
  consultant_id = null,
  customer_name = 'Khách tua ngoài (không có tên)',
  external_payout_amount = 75000
where entry.source_ref like 'excel-t8-2026:tua-ngoai:%'
  and entry.sale_type = 'external_tour'::public.sale_type
  and entry.status = 'completed';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'external_tour_has_no_internal_employee'
      and conrelid = 'public.revenue_entries'::regclass
  ) then
    alter table public.revenue_entries
      add constraint external_tour_has_no_internal_employee
      check (
        sale_type <> 'external_tour'::public.sale_type
        or (technician_id is null and consultant_id is null)
      );
  end if;
end;
$$;

do $$
declare
  external_count integer;
  external_revenue numeric(14, 0);
  external_payout numeric(14, 0);
  assigned_count integer;
  staff_ledger_count integer;
begin
  select
    count(*),
    coalesce(sum(revenue_amount), 0),
    coalesce(sum(external_payout_amount), 0),
    count(*) filter (where technician_id is not null or consultant_id is not null)
  into external_count, external_revenue, external_payout, assigned_count
  from public.revenue_entries
  where source_ref like 'excel-t8-2026:tua-ngoai:%'
    and sale_type = 'external_tour'::public.sale_type;

  select count(*)
  into staff_ledger_count
  from public.commission_ledger as ledger
  join public.revenue_entries as entry on entry.id = ledger.revenue_entry_id
  where entry.source_ref like 'excel-t8-2026:tua-ngoai:%';

  if external_count <> 4 or external_revenue <> 600000 or external_payout <> 300000 or assigned_count <> 0 or staff_ledger_count <> 0 then
    raise exception 'External-tour correction failed: expected 4 rows / 600,000 revenue / 300,000 external payout / no staff or ledger, got % / % / % / % / %.', external_count, external_revenue, external_payout, assigned_count, staff_ledger_count;
  end if;
end;
$$;
