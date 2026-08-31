-- Apply this patch after the earlier management migrations.
-- It repairs the customer-name schema, enables permanent deletion of unclosed
-- records, and imports the audited August 2026 workbook rows exactly once.

begin;

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

-- These rules were initially seeded on 2026-08-31, after the August source
-- rows. Move their initial effective date back to the first day of that month
-- so imported pending rows receive the correct KTV and consultant ledgers.
update public.commission_rules
set valid_from = date '2026-08-01'
where active
  and valid_from > date '2026-08-01'
  and (
    (target = 'technician' and recipient_profile_id is null)
    or (target = 'consultant' and recipient_profile_id is not null)
  );

-- For rows whose date was left from a copied sheet, the T8 sequence is
-- normalized into 01-07 August so the monthly report is complete.
with import_rows (
  source_ref, service_date, customer_name, service_name, sale_type,
  price_snapshot, revenue_amount, technician_name, consultant_name, notes
) as (
  values
    ('excel-t8-2026:trang-t8:5',  date '2026-08-02', 'C chị', 'Gội đầu sạch', 'retail'::public.sale_type, 50000, 50000, 'Trang', null, 'Excel T8 · Trang T8 dòng 5'),
    ('excel-t8-2026:trang-t8:6',  date '2026-08-02', 'C Cúc', 'Gội thảo dược', 'package_usage'::public.sale_type, 70000, 0, 'Trang', null, 'Excel T8 · Trang T8 dòng 6 · Gói cũ'),
    ('excel-t8-2026:trang-t8:7',  date '2026-08-02', 'C Cúc', 'Massage body trị liệu 60p', 'retail'::public.sale_type, 300000, 300000, 'Trang', null, 'Excel T8 · Trang T8 dòng 7'),
    ('excel-t8-2026:trang-t8:8',  date '2026-08-02', 'Trung Quốc', 'Massage body trị liệu cao cấp 90p', 'retail'::public.sale_type, 400000, 400000, 'Trang', null, 'Excel T8 · Trang T8 dòng 8'),
    ('excel-t8-2026:trang-t8:9',  date '2026-08-02', 'Khách lẻ (Trang T8 - dòng 9)', 'Gội thảo dược', 'retail'::public.sale_type, 80000, 80000, 'Trang', null, 'Excel T8 · Trang T8 dòng 9'),
    ('excel-t8-2026:trang-t8:10', date '2026-08-03', 'Cô Lương', 'Gội đầu sạch', 'package_usage'::public.sale_type, 50000, 0, 'Trang', null, 'Excel T8 · Trang T8 dòng 10 · Gói cũ'),
    ('excel-t8-2026:trang-t8:11', date '2026-08-03', 'Khách lẻ', 'Gội dưỡng sinh', 'retail'::public.sale_type, 150000, 150000, 'Trang', null, 'Excel T8 · Trang T8 dòng 11'),
    ('excel-t8-2026:trang-t8:12', date '2026-08-03', 'C Sao Mai', 'Massage body trị liệu 60p', 'package_usage'::public.sale_type, 300000, 0, 'Trang', null, 'Excel T8 · Trang T8 dòng 12 · Gói cũ'),
    ('excel-t8-2026:trang-t8:13', date '2026-08-03', 'C Sao Mai', 'Gội thảo dược', 'package_usage'::public.sale_type, 80000, 0, 'Trang', null, 'Excel T8 · Trang T8 dòng 13 · Gói cũ'),
    ('excel-t8-2026:trang-t8:14', date '2026-08-04', 'Mẹ C Thương', 'Chăm sóc da cơ bản', 'package_usage'::public.sale_type, 120000, 0, 'Trang', null, 'Excel T8 · Trang T8 dòng 14 · Gói cũ'),
    ('excel-t8-2026:trang-t8:15', date '2026-08-04', 'Người Trung', 'Massage body trị liệu cao cấp 90p', 'retail'::public.sale_type, 400000, 400000, 'Trang', null, 'Excel T8 · Trang T8 dòng 15'),
    ('excel-t8-2026:trang-t8:16', date '2026-08-04', 'Khách lẻ (Trang T8 - dòng 16)', 'Gội đầu sạch', 'retail'::public.sale_type, 50000, 50000, 'Trang', null, 'Excel T8 · Trang T8 dòng 16'),
    ('excel-t8-2026:trang-t8:17', date '2026-08-05', 'C Hương 270', 'Massage body', 'package_usage'::public.sale_type, 270000, 0, 'Trang', null, 'Excel T8 · Trang T8 dòng 17 · Gói cũ; giá gói theo chi KTV 135.000đ'),
    ('excel-t8-2026:trang-t8:18', date '2026-08-05', 'Khách lẻ (Trang T8 - dòng 18)', 'Ôn ấm', 'retail'::public.sale_type, 100000, 50000, 'Trang', null, 'Excel T8 · Trang T8 dòng 18'),
    ('excel-t8-2026:trang-t8:19', date '2026-08-05', 'C Thương', 'Gội dưỡng sinh', 'package_usage'::public.sale_type, 150000, 0, 'Trang', null, 'Excel T8 · Trang T8 dòng 19'),
    ('excel-t8-2026:trang-t8:20', date '2026-08-06', 'Cô Lương', 'Gội dưỡng sinh', 'package_usage'::public.sale_type, 150000, 0, 'Trang', null, 'Excel T8 · Trang T8 dòng 20 · Gói cũ'),
    ('excel-t8-2026:trang-t8:21', date '2026-08-06', 'Khách lẻ', 'Gội đầu sạch', 'retail'::public.sale_type, 50000, 50000, 'Trang', null, 'Excel T8 · Trang T8 dòng 21'),
    ('excel-t8-2026:trang-t8:22', date '2026-08-06', 'C Hạnh', 'Massage body trị liệu 60p', 'package_usage'::public.sale_type, 300000, 0, 'Trang', null, 'Excel T8 · Trang T8 dòng 22 · Gói cũ'),
    ('excel-t8-2026:trang-t8:23', date '2026-08-07', 'C Linh', 'Gội đầu sạch', 'retail'::public.sale_type, 50000, 50000, 'Trang', null, 'Excel T8 · Trang T8 dòng 23'),

    ('excel-t8-2026:mien-t8:5',  date '2026-08-01', 'C Thương', 'Gội đầu sạch', 'retail'::public.sale_type, 50000, 50000, 'Miên', null, 'Excel T8 · Miên T8 dòng 5'),
    ('excel-t8-2026:mien-t8:6',  date '2026-08-01', 'Khách lẻ', 'Gội đầu sạch', 'retail'::public.sale_type, 50000, 50000, 'Miên', null, 'Excel T8 · Miên T8 dòng 6'),
    ('excel-t8-2026:mien-t8:7',  date '2026-08-01', 'Khách lẻ', 'Gội dưỡng sinh', 'retail'::public.sale_type, 150000, 150000, 'Miên', null, 'Excel T8 · Miên T8 dòng 7'),
    ('excel-t8-2026:mien-t8:8',  date '2026-08-01', 'C Thủy Trang', 'Massage body trị liệu 60p', 'package_usage'::public.sale_type, 300000, 0, 'Miên', null, 'Excel T8 · Miên T8 dòng 8 · Gói cũ'),
    ('excel-t8-2026:mien-t8:9',  date '2026-08-01', 'C Thủy Trang', 'Gội thảo dược', 'package_usage'::public.sale_type, 80000, 0, 'Miên', null, 'Excel T8 · Miên T8 dòng 9 · Gói cũ'),
    ('excel-t8-2026:mien-t8:10', date '2026-08-01', 'Bán chị Chi', 'Gội đầu sạch', 'retail'::public.sale_type, 50000, 50000, 'Miên', null, 'Excel T8 · Miên T8 dòng 10'),
    ('excel-t8-2026:mien-t8:11', date '2026-08-02', 'Cô khách lẻ', 'Gội dưỡng sinh', 'retail'::public.sale_type, 150000, 150000, 'Miên', null, 'Excel T8 · Miên T8 dòng 11; ngày được chuẩn hóa theo T8'),
    ('excel-t8-2026:mien-t8:12', date '2026-08-02', 'Con chị Uyên', 'Gội đầu sạch', 'retail'::public.sale_type, 50000, 50000, 'Miên', null, 'Excel T8 · Miên T8 dòng 12'),
    ('excel-t8-2026:mien-t8:13', date '2026-08-03', 'Anh Mạnh', 'Massage body trị liệu 60p', 'retail'::public.sale_type, 300000, 300000, 'Miên', null, 'Excel T8 · Miên T8 dòng 13; ngày được chuẩn hóa theo T8'),
    ('excel-t8-2026:mien-t8:14', date '2026-08-03', 'C Thủy', 'Chăm sóc da chuyên sâu', 'retail'::public.sale_type, 160000, 150000, 'Miên', null, 'Excel T8 · Miên T8 dòng 14'),
    ('excel-t8-2026:mien-t8:15', date '2026-08-03', 'Chị Hương', 'Gội dưỡng sinh', 'retail'::public.sale_type, 150000, 150000, 'Miên', null, 'Excel T8 · Miên T8 dòng 15'),
    ('excel-t8-2026:mien-t8:16', date '2026-08-04', 'C Loan', 'Massage body trị liệu 60p', 'retail'::public.sale_type, 300000, 300000, 'Miên', null, 'Excel T8 · Miên T8 dòng 16'),
    ('excel-t8-2026:mien-t8:17', date '2026-08-04', 'Mẹ C Thương mua gói', 'Chăm sóc da cơ bản', 'package_sale'::public.sale_type, 120000, 1500000, 'Miên', 'Miên', 'Excel T8 · Miên T8 dòng 17 · Gói 3 buổi'),
    ('excel-t8-2026:mien-t8:18', date '2026-08-04', 'Trung Quốc', 'Massage body trị liệu cao cấp 90p', 'retail'::public.sale_type, 400000, 400000, 'Miên', null, 'Excel T8 · Miên T8 dòng 18'),
    ('excel-t8-2026:mien-t8:19', date '2026-08-04', 'Trung Quốc', 'Gội đầu sạch', 'retail'::public.sale_type, 50000, 50000, 'Miên', null, 'Excel T8 · Miên T8 dòng 19'),
    ('excel-t8-2026:mien-t8:20', date '2026-08-04', 'C Huyền', 'Massage cổ vai gáy trị liệu 45p', 'retail'::public.sale_type, 250000, 250000, 'Miên', null, 'Excel T8 · Miên T8 dòng 20'),
    ('excel-t8-2026:mien-t8:21', date '2026-08-05', 'C Yoga', 'Gội thảo dược', 'retail'::public.sale_type, 80000, 80000, 'Miên', null, 'Excel T8 · Miên T8 dòng 21'),
    ('excel-t8-2026:mien-t8:22', date '2026-08-06', 'Khách lẻ', 'Gội đầu sạch', 'retail'::public.sale_type, 50000, 50000, 'Miên', null, 'Excel T8 · Miên T8 dòng 22; ngày được chuẩn hóa theo T8'),
    ('excel-t8-2026:mien-t8:23', date '2026-08-07', 'C Uyên', 'Cấy serum dưỡng trắng da ngăn ngừa sắc tố', 'retail'::public.sale_type, 200000, 200000, 'Miên', null, 'Excel T8 · Miên T8 dòng 23; Excel thiếu tên dịch vụ, suy ra từ tiền KTV 100.000đ'),
    ('excel-t8-2026:mien-t8:24', date '2026-08-07', 'Nặn mụn', 'Lấy nhân mụn chuyên sâu', 'package_usage'::public.sale_type, 280000, 0, 'Miên', null, 'Excel T8 · Miên T8 dòng 24 · Gói cũ'),

    ('excel-t8-2026:tua-ngoai:5', date '2026-08-02', 'Khách tour ngoài 1', 'Gội dưỡng sinh', 'retail'::public.sale_type, 150000, 150000, 'Trang', null, 'Excel T8 · Làm trả tua ngoài dòng 5'),
    ('excel-t8-2026:tua-ngoai:6', date '2026-08-02', 'Khách tour ngoài 2', 'Gội dưỡng sinh', 'retail'::public.sale_type, 150000, 150000, 'Trang', null, 'Excel T8 · Làm trả tua ngoài dòng 6'),
    ('excel-t8-2026:tua-ngoai:7', date '2026-08-02', 'Khách tour ngoài 3', 'Gội dưỡng sinh', 'retail'::public.sale_type, 150000, 300000, 'Trang', null, 'Excel T8 · Làm trả tua ngoài dòng 7'),
    ('excel-t8-2026:tua-ngoai:8', date '2026-08-02', 'Khách tour ngoài 4', 'Gội dưỡng sinh', 'package_usage'::public.sale_type, 150000, 0, 'Trang', null, 'Excel T8 · Làm trả tua ngoài dòng 8')
)
insert into public.revenue_entries (
  source_ref, service_date, customer_name, service_id, sale_type,
  service_name_snapshot, price_snapshot, revenue_amount, technician_id,
  consultant_id, created_by, notes, status
)
select
  row.source_ref,
  row.service_date,
  row.customer_name,
  service.id,
  row.sale_type,
  service.name,
  row.price_snapshot,
  row.revenue_amount,
  technician.id,
  consultant.id,
  owner.id,
  row.notes,
  'completed'
from import_rows as row
join public.services as service on service.name = row.service_name
join public.profiles as technician on technician.display_name = row.technician_name
left join public.profiles as consultant on consultant.display_name = row.consultant_name
cross join lateral (
  select id from public.profiles where role = 'owner' and is_active limit 1
) as owner
on conflict (source_ref) where source_ref is not null do nothing;

do $$
declare
  entry_count integer;
  revenue_total numeric(14, 0);
  technician_total numeric(14, 0);
  consultant_total numeric(14, 0);
begin
  select count(*), coalesce(sum(revenue_amount), 0)
  into entry_count, revenue_total
  from public.revenue_entries
  where source_ref like 'excel-t8-2026:%';

  select
    coalesce(sum(amount) filter (where target = 'technician'), 0),
    coalesce(sum(amount) filter (where target = 'consultant'), 0)
  into technician_total, consultant_total
  from public.commission_ledger as ledger
  join public.revenue_entries as entry on entry.id = ledger.revenue_entry_id
  where entry.source_ref like 'excel-t8-2026:%';

  if entry_count <> 43 or revenue_total <> 6110000 then
    raise exception 'Import T8 failed: expected 43 rows and 6,110,000 VND, got % rows and % VND.', entry_count, revenue_total;
  end if;

  if technician_total <> 3470000 or consultant_total <> 150000 then
    raise exception 'Commission check failed: expected KTV 3,470,000 and consultant 150,000; got KTV % and consultant %.', technician_total, consultant_total;
  end if;
end;
$$;

commit;
