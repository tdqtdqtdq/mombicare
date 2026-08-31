-- Step 1 of 2: run this query by itself in Supabase SQL Editor.
-- It must commit before the new value can be used by other queries.
alter type public.sale_type add value if not exists 'external_tour';
