-- Mombi Care Spa: internal revenue and commission management.
-- Run this migration in Supabase SQL Editor before opening /quan-ly.

create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('owner', 'staff');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.sale_type as enum ('retail', 'package_sale', 'package_usage', 'gift');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.commission_target as enum ('technician', 'consultant');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.commission_rate_type as enum ('fixed', 'percentage');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.revenue_entry_status as enum ('completed', 'void');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ledger_status as enum ('pending', 'locked', 'paid');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Nhân viên',
  role public.app_role not null default 'staff',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  default_price numeric(14, 0) not null default 0 check (default_price >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commission_rules (
  id uuid primary key default gen_random_uuid(),
  -- A null service or sale type means the rule applies to every service/type.
  -- This lets a consultant have one personal base rate, with optional overrides later.
  service_id uuid references public.services(id) on delete cascade,
  target public.commission_target not null,
  recipient_profile_id uuid references public.profiles(id) on delete cascade,
  sale_type public.sale_type,
  rate_type public.commission_rate_type not null,
  rate_value numeric(14, 2) not null check (rate_value >= 0),
  valid_from date not null default current_date,
  valid_to date,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (valid_to is null or valid_to >= valid_from)
);

create table if not exists public.revenue_entries (
  id uuid primary key default gen_random_uuid(),
  service_date date not null default current_date,
  customer_name text not null,
  source_ref text,
  service_id uuid not null references public.services(id),
  sale_type public.sale_type not null default 'retail',
  service_name_snapshot text not null,
  price_snapshot numeric(14, 0) not null check (price_snapshot >= 0),
  revenue_amount numeric(14, 0) not null check (revenue_amount >= 0),
  technician_id uuid references public.profiles(id),
  consultant_id uuid references public.profiles(id),
  created_by uuid not null references public.profiles(id),
  notes text,
  status public.revenue_entry_status not null default 'completed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commission_ledger (
  id uuid primary key default gen_random_uuid(),
  revenue_entry_id uuid not null references public.revenue_entries(id) on delete cascade,
  employee_id uuid not null references public.profiles(id),
  target public.commission_target not null,
  amount numeric(14, 0) not null check (amount >= 0),
  rate_type public.commission_rate_type not null,
  rate_value numeric(14, 2) not null,
  service_name_snapshot text not null,
  service_date date not null,
  status public.ledger_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (revenue_entry_id, employee_id, target)
);

create table if not exists public.payroll_periods (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  starts_on date not null,
  ends_on date not null,
  status public.ledger_status not null default 'pending',
  locked_at timestamptz,
  locked_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  check (ends_on >= starts_on)
);

-- Covers projects where this migration was applied before payroll_period_id was added.
alter table public.commission_ledger
  add column if not exists payroll_period_id uuid references public.payroll_periods(id);

create index if not exists revenue_entries_date_idx on public.revenue_entries (service_date desc);
create index if not exists revenue_entries_customer_idx on public.revenue_entries (customer_name, service_date desc);
create unique index if not exists revenue_entries_source_ref_unique_idx on public.revenue_entries (source_ref) where source_ref is not null;
create index if not exists revenue_entries_technician_idx on public.revenue_entries (technician_id, service_date desc);
create index if not exists commission_ledger_employee_idx on public.commission_ledger (employee_id, service_date desc);
create index if not exists commission_rules_lookup_idx on public.commission_rules (service_id, target, sale_type, valid_from desc);
create index if not exists commission_rules_recipient_lookup_idx on public.commission_rules (recipient_profile_id, target, valid_from desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1), 'Nhân viên'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'owner' and is_active
  );
$$;

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
    order by valid_from desc
    limit 1;

    if found then
      commission_base := case when matched_rule.target = 'technician'
        then new.price_snapshot
        else new.revenue_amount
      end;
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
      commission_base := case when matched_rule.target = 'technician'
        then new.price_snapshot
        else new.revenue_amount
      end;
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

create or replace function public.lock_payroll_period(
  p_label text,
  p_starts_on date,
  p_ends_on date
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_period_id uuid;
begin
  if not public.is_owner() then
    raise exception 'Chỉ chủ spa mới có thể chốt kỳ lương.';
  end if;

  if p_ends_on < p_starts_on then
    raise exception 'Khoảng thời gian chốt không hợp lệ.';
  end if;

  if exists (
    select 1 from public.payroll_periods
    where status in ('locked', 'paid')
      and daterange(starts_on, ends_on, '[]') && daterange(p_starts_on, p_ends_on, '[]')
  ) then
    raise exception 'Khoảng thời gian này đã có kỳ lương được chốt.';
  end if;

  insert into public.payroll_periods (label, starts_on, ends_on, status, locked_at, locked_by)
  values (p_label, p_starts_on, p_ends_on, 'locked', now(), auth.uid())
  returning id into new_period_id;

  update public.commission_ledger
  set status = 'locked', payroll_period_id = new_period_id
  where service_date between p_starts_on and p_ends_on
    and status = 'pending';

  return new_period_id;
end;
$$;

create or replace function public.mark_payroll_period_paid(p_payroll_period_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_owner() then
    raise exception 'Chỉ chủ spa mới có thể xác nhận đã chi hoa hồng.';
  end if;

  update public.commission_ledger
  set status = 'paid'
  where payroll_period_id = p_payroll_period_id and status = 'locked';

  update public.payroll_periods
  set status = 'paid'
  where id = p_payroll_period_id and status = 'locked';
end;
$$;

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at before update on public.services for each row execute procedure public.set_updated_at();
drop trigger if exists rules_set_updated_at on public.commission_rules;
create trigger rules_set_updated_at before update on public.commission_rules for each row execute procedure public.set_updated_at();
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
drop trigger if exists entries_set_updated_at on public.revenue_entries;
create trigger entries_set_updated_at before update on public.revenue_entries for each row execute procedure public.set_updated_at();
drop trigger if exists revenue_entries_refresh_commissions on public.revenue_entries;
create trigger revenue_entries_refresh_commissions
  after insert or update of service_date, service_id, sale_type, price_snapshot, revenue_amount, technician_id, consultant_id, service_name_snapshot, status
  on public.revenue_entries
  for each row execute procedure public.refresh_entry_commissions();

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.commission_rules enable row level security;
alter table public.revenue_entries enable row level security;
alter table public.commission_ledger enable row level security;
alter table public.payroll_periods enable row level security;

revoke all on public.profiles, public.services, public.commission_rules, public.revenue_entries, public.commission_ledger, public.payroll_periods from anon;
grant select, insert, update, delete on public.profiles, public.services, public.commission_rules, public.revenue_entries, public.commission_ledger, public.payroll_periods to authenticated;

create policy "Profiles: own or owner reads" on public.profiles for select to authenticated using (id = (select auth.uid()) or (select public.is_owner()));
create policy "Profiles: owner updates" on public.profiles for update to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));

create policy "Services: staff reads active" on public.services for select to authenticated using (active or (select public.is_owner()));
create policy "Services: owner inserts" on public.services for insert to authenticated with check ((select public.is_owner()));
create policy "Services: owner updates" on public.services for update to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy "Services: owner deletes" on public.services for delete to authenticated using ((select public.is_owner()));

create policy "Rules: owner reads" on public.commission_rules for select to authenticated using ((select public.is_owner()));
create policy "Rules: owner inserts" on public.commission_rules for insert to authenticated with check ((select public.is_owner()));
create policy "Rules: owner updates" on public.commission_rules for update to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy "Rules: owner deletes" on public.commission_rules for delete to authenticated using ((select public.is_owner()));

create policy "Entries: owner or participant reads" on public.revenue_entries for select to authenticated using (
  (select public.is_owner()) or technician_id = (select auth.uid()) or consultant_id = (select auth.uid()) or created_by = (select auth.uid())
);
create policy "Entries: owner or own technician creates" on public.revenue_entries for insert to authenticated with check (
  (select public.is_owner()) or (created_by = (select auth.uid()) and technician_id = (select auth.uid()))
);
create policy "Entries: owner updates" on public.revenue_entries for update to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy "Entries: owner deletes unclosed" on public.revenue_entries for delete to authenticated using (
  (select public.is_owner())
  and not exists (
    select 1 from public.commission_ledger
    where revenue_entry_id = public.revenue_entries.id and status in ('locked', 'paid')
  )
);
-- Revenue is kept as an audit trail. Use status = 'void' before a payroll period is locked.

create policy "Ledger: owner or employee reads" on public.commission_ledger for select to authenticated using (
  (select public.is_owner()) or employee_id = (select auth.uid())
);
create policy "Periods: owner reads" on public.payroll_periods for select to authenticated using ((select public.is_owner()));
create policy "Periods: owner inserts" on public.payroll_periods for insert to authenticated with check ((select public.is_owner()));
create policy "Periods: owner updates" on public.payroll_periods for update to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));

revoke execute on function public.lock_payroll_period(text, date, date) from public, anon;
grant execute on function public.lock_payroll_period(text, date, date) to authenticated;
revoke execute on function public.mark_payroll_period_paid(uuid) from public, anon;
grant execute on function public.mark_payroll_period_paid(uuid) to authenticated;

-- Bootstrap after creating the first user in Authentication > Users:
-- update public.profiles set role = 'owner' where id = (select id from auth.users where email = 'owner@example.com');
