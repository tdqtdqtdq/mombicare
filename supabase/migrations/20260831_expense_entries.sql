-- Adds owner-managed operating expenses to the daily cashbook.

do $$ begin
  create type public.expense_category as enum ('materials', 'offering', 'utilities', 'operating', 'other');
exception when duplicate_object then null;
end $$;

create table if not exists public.expense_entries (
  id uuid primary key default gen_random_uuid(),
  expense_date date not null default current_date,
  category public.expense_category not null default 'other',
  description text not null,
  amount numeric(14, 0) not null check (amount > 0),
  notes text,
  status public.revenue_entry_status not null default 'completed',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists expense_entries_date_idx on public.expense_entries (expense_date desc);
drop trigger if exists expense_entries_set_updated_at on public.expense_entries;
create trigger expense_entries_set_updated_at before update on public.expense_entries for each row execute procedure public.set_updated_at();

alter table public.expense_entries enable row level security;
grant select, insert, update, delete on public.expense_entries to authenticated;

drop policy if exists "Expenses: owner reads" on public.expense_entries;
create policy "Expenses: owner reads" on public.expense_entries for select to authenticated using ((select public.is_owner()));
drop policy if exists "Expenses: owner inserts" on public.expense_entries;
create policy "Expenses: owner inserts" on public.expense_entries for insert to authenticated with check ((select public.is_owner()));
drop policy if exists "Expenses: owner updates" on public.expense_entries;
create policy "Expenses: owner updates" on public.expense_entries for update to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
drop policy if exists "Expenses: owner deletes" on public.expense_entries;
create policy "Expenses: owner deletes" on public.expense_entries for delete to authenticated using ((select public.is_owner()));
