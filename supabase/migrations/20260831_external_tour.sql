-- Step 2 of 2: run this only after 20260831_external_tour_enum.sql has
-- completed successfully in a separate Supabase SQL Editor execution.
-- Trả tua ngoài is separate from retail/package activity, but remains part of
-- the spa's revenue and technician payroll.

-- Reuse each active retail KTV rate for external tours. This preserves special
-- fixed rules (for example triệt) instead of assuming every service is 50%.
insert into public.commission_rules (
  service_id,
  target,
  recipient_profile_id,
  sale_type,
  rate_type,
  rate_value,
  valid_from,
  valid_to,
  active
)
select
  source.service_id,
  source.target,
  null,
  'external_tour'::public.sale_type,
  source.rate_type,
  source.rate_value,
  source.valid_from,
  source.valid_to,
  source.active
from public.commission_rules as source
where source.target = 'technician'
  and source.recipient_profile_id is null
  and source.sale_type = 'retail'
  and source.active
  and not exists (
    select 1
    from public.commission_rules as existing
    where existing.service_id = source.service_id
      and existing.target = 'technician'
      and existing.recipient_profile_id is null
      and existing.sale_type = 'external_tour'
      and existing.valid_from = source.valid_from
  );

-- The August workbook had four rows in sheet “làm trả tua ngoài”: revenue
-- 600,000 VND and KTV payout 300,000 VND. Reclassifying them fires the normal
-- pending-commission trigger so the original payout remains auditable.
update public.revenue_entries as entry
set sale_type = 'external_tour'::public.sale_type
where entry.source_ref like 'excel-t8-2026:tua-ngoai:%'
  and entry.status = 'completed'
  and entry.sale_type <> 'external_tour'::public.sale_type
  and not exists (
    select 1
    from public.commission_ledger as ledger
    where ledger.revenue_entry_id = entry.id
      and ledger.status in ('locked', 'paid')
  );

do $$
declare
  external_count integer;
  external_revenue numeric(14, 0);
  external_technician numeric(14, 0);
begin
  select count(*), coalesce(sum(revenue_amount), 0)
  into external_count, external_revenue
  from public.revenue_entries
  where source_ref like 'excel-t8-2026:tua-ngoai:%'
    and sale_type = 'external_tour'::public.sale_type;

  select coalesce(sum(ledger.amount), 0)
  into external_technician
  from public.commission_ledger as ledger
  join public.revenue_entries as entry on entry.id = ledger.revenue_entry_id
  where entry.source_ref like 'excel-t8-2026:tua-ngoai:%'
    and ledger.target = 'technician';

  if external_count <> 4 or external_revenue <> 600000 or external_technician <> 300000 then
    raise exception 'External-tour audit failed: expected 4 rows / 600,000 revenue / 300,000 KTV, got % / % / %.', external_count, external_revenue, external_technician;
  end if;
end;
$$;
