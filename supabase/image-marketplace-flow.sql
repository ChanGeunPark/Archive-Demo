create table if not exists public.marketplace_demo_users (
  id text primary key,
  display_name text not null,
  handle text not null unique,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.marketplace_demo_works (
  id text primary key,
  title text not null,
  description text not null default '',
  image_url text not null,
  image_id text,
  width integer not null default 1000,
  height integer not null default 1000,
  creator_id text not null references public.marketplace_demo_users(id),
  owner_id text not null references public.marketplace_demo_users(id),
  ownership_status text not null check (
    ownership_status in ('OWNED_BY_CREATOR', 'OWNED_BY_COLLECTOR')
  ),
  listing_status text not null check (
    listing_status in ('LISTED', 'NOT_LISTED', 'OFFER_OPEN')
  ),
  asking_price integer,
  last_sale_price integer,
  offer_count integer not null default 0,
  tags text[] not null default '{}',
  usage_rights jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketplace_demo_offers (
  id uuid primary key default gen_random_uuid(),
  work_id text not null references public.marketplace_demo_works(id) on delete cascade,
  bidder_id text not null references public.marketplace_demo_users(id),
  amount integer not null check (amount > 0),
  status text not null default 'PENDING' check (
    status in ('PENDING', 'ACCEPTED', 'DECLINED')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketplace_demo_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (
    event_type in ('WORK_OWNERSHIP_TRANSFERRED', 'OFFER_ACCEPTED')
  ),
  work_id text not null references public.marketplace_demo_works(id) on delete cascade,
  previous_owner_id text references public.marketplace_demo_users(id),
  new_owner_id text not null references public.marketplace_demo_users(id),
  transaction_id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.marketplace_demo_users enable row level security;
alter table public.marketplace_demo_works enable row level security;
alter table public.marketplace_demo_offers enable row level security;
alter table public.marketplace_demo_events enable row level security;

drop policy if exists "public can read marketplace demo users"
on public.marketplace_demo_users;
create policy "public can read marketplace demo users"
on public.marketplace_demo_users
for select
to anon
using (true);

drop policy if exists "public can read marketplace demo works"
on public.marketplace_demo_works;
create policy "public can read marketplace demo works"
on public.marketplace_demo_works
for select
to anon
using (true);

drop policy if exists "public can read marketplace demo offers"
on public.marketplace_demo_offers;
create policy "public can read marketplace demo offers"
on public.marketplace_demo_offers
for select
to anon
using (true);

drop policy if exists "public can read marketplace demo events"
on public.marketplace_demo_events;
create policy "public can read marketplace demo events"
on public.marketplace_demo_events
for select
to anon
using (true);

create index if not exists marketplace_demo_works_owner_id_idx
on public.marketplace_demo_works(owner_id);

create index if not exists marketplace_demo_works_listing_status_idx
on public.marketplace_demo_works(listing_status);

create index if not exists marketplace_demo_offers_work_id_status_idx
on public.marketplace_demo_offers(work_id, status);

create index if not exists marketplace_demo_events_work_id_created_at_idx
on public.marketplace_demo_events(work_id, created_at desc);

create or replace function public.set_marketplace_demo_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_marketplace_demo_works_updated_at
on public.marketplace_demo_works;
create trigger set_marketplace_demo_works_updated_at
before update on public.marketplace_demo_works
for each row
execute function public.set_marketplace_demo_updated_at();

drop trigger if exists set_marketplace_demo_offers_updated_at
on public.marketplace_demo_offers;
create trigger set_marketplace_demo_offers_updated_at
before update on public.marketplace_demo_offers
for each row
execute function public.set_marketplace_demo_updated_at();
