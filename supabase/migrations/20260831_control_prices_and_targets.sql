-- Locks staff-entered amounts to the active service price and adds monthly
-- employee targets. Run after the earlier management migrations.

create table if not exists public.monthly_targets (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  target_month date not null,
  target_amount numeric(14, 0) not null default 0 check (target_amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, target_month),
  check (target_month = date_trunc('month', target_month)::date)
);

create index if not exists monthly_targets_month_idx on public.monthly_targets (target_month, profile_id);
drop trigger if exists monthly_targets_set_updated_at on public.monthly_targets;
create trigger monthly_targets_set_updated_at before update on public.monthly_targets for each row execute procedure public.set_updated_at();

alter table public.monthly_targets enable row level security;
grant select, insert, update, delete on public.monthly_targets to authenticated;

drop policy if exists "Targets: owner reads all" on public.monthly_targets;
create policy "Targets: owner reads all" on public.monthly_targets for select to authenticated using ((select public.is_owner()));
drop policy if exists "Targets: staff reads own" on public.monthly_targets;
create policy "Targets: staff reads own" on public.monthly_targets for select to authenticated using (profile_id = (select auth.uid()));
drop policy if exists "Targets: owner inserts" on public.monthly_targets;
create policy "Targets: owner inserts" on public.monthly_targets for insert to authenticated with check ((select public.is_owner()));
drop policy if exists "Targets: owner updates" on public.monthly_targets;
create policy "Targets: owner updates" on public.monthly_targets for update to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
drop policy if exists "Targets: owner deletes" on public.monthly_targets;
create policy "Targets: owner deletes" on public.monthly_targets for delete to authenticated using ((select public.is_owner()));

-- Initial August goals reproduced from the workbook. Existing user-edited
-- targets are never overwritten.
insert into public.monthly_targets (profile_id, target_month, target_amount)
select id, date '2026-08-01', case display_name when 'Miên' then 30000000 when 'Trang' then 15000000 else 0 end
from public.profiles
where display_name in ('Miên', 'Trang')
on conflict (profile_id, target_month) do nothing;

create or replace function public.enforce_staff_entry_amounts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  listed_price numeric(14, 0);
  expected_revenue numeric(14, 0);
begin
  if public.is_owner() then
    return new;
  end if;

  if new.sale_type = 'external_tour'::public.sale_type then
    raise exception 'Chỉ chủ spa mới có thể ghi nhận trả tua ngoài.';
  end if;

  select default_price into listed_price from public.services where id = new.service_id;
  if listed_price is null then
    raise exception 'Dịch vụ không hợp lệ.';
  end if;

  expected_revenue := case when new.sale_type in ('package_usage'::public.sale_type, 'gift'::public.sale_type) then 0 else listed_price end;
  if new.price_snapshot <> listed_price or new.revenue_amount <> expected_revenue or new.external_payout_amount <> 0 then
    raise exception 'Nhân viên không được thay đổi giá gói, thực thu hoặc khoản chi. Giá do chủ spa thiết lập.';
  end if;
  return new;
end;
$$;

drop trigger if exists revenue_entries_enforce_staff_amounts on public.revenue_entries;
create trigger revenue_entries_enforce_staff_amounts
  before insert or update of service_id, sale_type, price_snapshot, revenue_amount, external_payout_amount
  on public.revenue_entries
  for each row execute procedure public.enforce_staff_entry_amounts();
