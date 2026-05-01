create extension if not exists pgcrypto with schema extensions;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  document text,
  phone text,
  whatsapp text,
  email text,
  city text,
  state text,
  farm_name text,
  total_area numeric,
  main_crops text[] not null default '{}',
  current_season text,
  status text not null default 'prospect',
  commercial_potential text not null default 'medium',
  origin text,
  tags text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint clients_status_check check (status in ('prospect', 'active', 'inactive', 'lost')),
  constraint clients_commercial_potential_check check (commercial_potential in ('low', 'medium', 'high'))
);

create index if not exists clients_user_id_idx on public.clients (user_id);
create index if not exists clients_user_id_name_idx on public.clients (user_id, name);
create index if not exists clients_user_id_city_idx on public.clients (user_id, city);
create index if not exists clients_user_id_status_idx on public.clients (user_id, status);
create index if not exists clients_user_id_commercial_potential_idx on public.clients (user_id, commercial_potential);
create index if not exists clients_main_crops_gin_idx on public.clients using gin (main_crops);
create index if not exists clients_tags_gin_idx on public.clients using gin (tags);

drop trigger if exists set_clients_updated_at on public.clients;

create trigger set_clients_updated_at
before update on public.clients
for each row
execute function public.set_updated_at();

alter table public.clients enable row level security;

drop policy if exists "Users can select their own clients" on public.clients;
create policy "Users can select their own clients"
on public.clients
for select
using (user_id = auth.uid());

drop policy if exists "Users can insert their own clients" on public.clients;
create policy "Users can insert their own clients"
on public.clients
for insert
with check (user_id = auth.uid());

drop policy if exists "Users can update their own clients" on public.clients;
create policy "Users can update their own clients"
on public.clients
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users can delete their own clients" on public.clients;
create policy "Users can delete their own clients"
on public.clients
for delete
using (user_id = auth.uid());
