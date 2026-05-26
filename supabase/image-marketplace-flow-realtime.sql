-- Enable Supabase Realtime (postgres_changes) for marketplace demo tables.
-- Run in Supabase SQL Editor if tables are not already in supabase_realtime publication.

alter publication supabase_realtime add table public.marketplace_demo_works;
alter publication supabase_realtime add table public.marketplace_demo_offers;
