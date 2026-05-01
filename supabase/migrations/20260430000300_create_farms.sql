create extension if not exists pgcrypto with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.farms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  city text,
  state text,
  total_area numeric,
  main_crops text[] not null default '{}',
  current_season text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint farms_total_area_check check (total_area is null or total_area >= 0)
);

create index if not exists farms_user_id_idx on public.farms (user_id);
create index if not exists farms_client_id_idx on public.farms (client_id);
create index if not exists farms_user_client_idx on public.farms (user_id, client_id);
create index if not exists farms_main_crops_gin_idx on public.farms using gin (main_crops);

drop trigger if exists set_farms_updated_at on public.farms;

create trigger set_farms_updated_at
before update on public.farms
for each row
execute function public.set_updated_at();

alter table public.farms enable row level security;

drop policy if exists "Users can select their own farms" on public.farms;
create policy "Users can select their own farms"
on public.farms
for select
using (user_id = auth.uid());

drop policy if exists "Users can insert their own farms" on public.farms;
create policy "Users can insert their own farms"
on public.farms
for insert
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.clients
    where clients.id = farms.client_id
      and clients.user_id = auth.uid()
      and clients.deleted_at is null
  )
);

drop policy if exists "Users can update their own farms" on public.farms;
create policy "Users can update their own farms"
on public.farms
for update
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.clients
    where clients.id = farms.client_id
      and clients.user_id = auth.uid()
      and clients.deleted_at is null
  )
);

drop policy if exists "Users can delete their own farms" on public.farms;
create policy "Users can delete their own farms"
on public.farms
for delete
using (user_id = auth.uid());

insert into public.farms (
  user_id,
  client_id,
  name,
  city,
  state,
  total_area,
  main_crops,
  current_season
)
select
  clients.user_id,
  clients.id,
  clients.farm_name,
  clients.city,
  clients.state,
  clients.total_area,
  clients.main_crops,
  clients.current_season
from public.clients
where clients.farm_name is not null
  and clients.deleted_at is null
  and not exists (
    select 1
    from public.farms
    where farms.client_id = clients.id
      and farms.name = clients.farm_name
      and farms.deleted_at is null
  );
