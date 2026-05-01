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

create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  farm_id uuid references public.farms(id) on delete set null,
  visit_date timestamptz not null default now(),
  visit_type text not null default 'technical',
  purpose text not null,
  summary text,
  recommendations text,
  next_visit_at timestamptz,
  status text not null default 'completed',
  latitude numeric,
  longitude numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint visits_visit_type_check check (
    visit_type in ('technical', 'commercial', 'follow_up', 'post_sale', 'prospecting', 'collection', 'other')
  ),
  constraint visits_status_check check (status in ('scheduled', 'completed', 'canceled'))
);

create index if not exists visits_user_id_idx on public.visits (user_id);
create index if not exists visits_client_id_idx on public.visits (client_id);
create index if not exists visits_farm_id_idx on public.visits (farm_id);
create index if not exists visits_visit_date_idx on public.visits (visit_date);
create index if not exists visits_next_visit_at_idx on public.visits (next_visit_at);
create index if not exists visits_status_idx on public.visits (status);

drop trigger if exists set_visits_updated_at on public.visits;

create trigger set_visits_updated_at
before update on public.visits
for each row
execute function public.set_updated_at();

alter table public.visits enable row level security;

drop policy if exists "Users can select their own visits" on public.visits;
create policy "Users can select their own visits"
on public.visits
for select
using (user_id = auth.uid());

drop policy if exists "Users can insert their own visits" on public.visits;
create policy "Users can insert their own visits"
on public.visits
for insert
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.clients
    where clients.id = visits.client_id
      and clients.user_id = auth.uid()
      and clients.deleted_at is null
  )
  and (
    farm_id is null
    or exists (
      select 1
      from public.farms
      where farms.id = visits.farm_id
        and farms.client_id = visits.client_id
        and farms.user_id = auth.uid()
        and farms.deleted_at is null
    )
  )
);

drop policy if exists "Users can update their own visits" on public.visits;
create policy "Users can update their own visits"
on public.visits
for update
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.clients
    where clients.id = visits.client_id
      and clients.user_id = auth.uid()
      and clients.deleted_at is null
  )
  and (
    farm_id is null
    or exists (
      select 1
      from public.farms
      where farms.id = visits.farm_id
        and farms.client_id = visits.client_id
        and farms.user_id = auth.uid()
        and farms.deleted_at is null
    )
  )
);

drop policy if exists "Users can delete their own visits" on public.visits;
create policy "Users can delete their own visits"
on public.visits
for delete
using (user_id = auth.uid());

create table if not exists public.visit_attachments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  visit_id uuid not null references public.visits(id) on delete cascade,
  file_type text not null,
  storage_path text not null,
  file_name text,
  mime_type text,
  file_size integer,
  caption text,
  created_at timestamptz not null default now(),
  constraint visit_attachments_file_type_check check (
    file_type in ('image', 'video', 'audio', 'document', 'other')
  )
);

create index if not exists visit_attachments_user_id_idx on public.visit_attachments (user_id);
create index if not exists visit_attachments_visit_id_idx on public.visit_attachments (visit_id);
create index if not exists visit_attachments_file_type_idx on public.visit_attachments (file_type);

alter table public.visit_attachments enable row level security;

drop policy if exists "Users can select their own visit attachments" on public.visit_attachments;
create policy "Users can select their own visit attachments"
on public.visit_attachments
for select
using (user_id = auth.uid());

drop policy if exists "Users can insert their own visit attachments" on public.visit_attachments;
create policy "Users can insert their own visit attachments"
on public.visit_attachments
for insert
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.visits
    where visits.id = visit_attachments.visit_id
      and visits.user_id = auth.uid()
      and visits.deleted_at is null
  )
);

drop policy if exists "Users can update their own visit attachments" on public.visit_attachments;
create policy "Users can update their own visit attachments"
on public.visit_attachments
for update
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.visits
    where visits.id = visit_attachments.visit_id
      and visits.user_id = auth.uid()
      and visits.deleted_at is null
  )
);

drop policy if exists "Users can delete their own visit attachments" on public.visit_attachments;
create policy "Users can delete their own visit attachments"
on public.visit_attachments
for delete
using (user_id = auth.uid());

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  related_table text,
  related_id uuid,
  scheduled_for timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on public.notifications (user_id);
create index if not exists notifications_read_at_idx on public.notifications (read_at);
create index if not exists notifications_scheduled_for_idx on public.notifications (scheduled_for);
create index if not exists notifications_type_idx on public.notifications (type);
create unique index if not exists notifications_next_visit_reminder_unique_idx
on public.notifications (user_id, type, related_table, related_id)
where type = 'next_visit_reminder' and related_table = 'visits';

alter table public.notifications enable row level security;

drop policy if exists "Users can select their own notifications" on public.notifications;
create policy "Users can select their own notifications"
on public.notifications
for select
using (user_id = auth.uid());

drop policy if exists "Users can insert their own notifications" on public.notifications;
create policy "Users can insert their own notifications"
on public.notifications
for insert
with check (user_id = auth.uid());

drop policy if exists "Users can update their own notifications" on public.notifications;
create policy "Users can update their own notifications"
on public.notifications
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users can delete their own notifications" on public.notifications;
create policy "Users can delete their own notifications"
on public.notifications
for delete
using (user_id = auth.uid());

create or replace function public.sync_next_visit_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.deleted_at is not null or new.next_visit_at is null then
    delete from public.notifications
    where user_id = new.user_id
      and type = 'next_visit_reminder'
      and related_table = 'visits'
      and related_id = new.id;

    return new;
  end if;

  update public.notifications
  set
    title = 'Próxima visita amanhã',
    message = 'Você tem uma visita agendada para amanhã.',
    scheduled_for = new.next_visit_at - interval '24 hours',
    read_at = null
  where user_id = new.user_id
    and type = 'next_visit_reminder'
    and related_table = 'visits'
    and related_id = new.id;

  if not found then
    insert into public.notifications (
      user_id,
      type,
      title,
      message,
      related_table,
      related_id,
      scheduled_for
    )
    values (
      new.user_id,
      'next_visit_reminder',
      'Próxima visita amanhã',
      'Você tem uma visita agendada para amanhã.',
      'visits',
      new.id,
      new.next_visit_at - interval '24 hours'
    );
  end if;

  return new;
end;
$$;

drop trigger if exists sync_next_visit_notification_trigger on public.visits;

create trigger sync_next_visit_notification_trigger
after insert or update of next_visit_at, deleted_at on public.visits
for each row
execute function public.sync_next_visit_notification();

insert into storage.buckets (id, name, public)
values ('visit-attachments', 'visit-attachments', false)
on conflict (id) do update
set public = false;

drop policy if exists "Users can select their own visit files" on storage.objects;
create policy "Users can select their own visit files"
on storage.objects
for select
using (
  bucket_id = 'visit-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
  and (storage.foldername(name))[2] = 'visits'
  and exists (
    select 1
    from public.visits
    where visits.id::text = (storage.foldername(name))[3]
      and visits.user_id = auth.uid()
  )
);

drop policy if exists "Users can insert their own visit files" on storage.objects;
create policy "Users can insert their own visit files"
on storage.objects
for insert
with check (
  bucket_id = 'visit-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
  and (storage.foldername(name))[2] = 'visits'
  and exists (
    select 1
    from public.visits
    where visits.id::text = (storage.foldername(name))[3]
      and visits.user_id = auth.uid()
      and visits.deleted_at is null
  )
);

drop policy if exists "Users can update their own visit files" on storage.objects;
create policy "Users can update their own visit files"
on storage.objects
for update
using (
  bucket_id = 'visit-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
  and (storage.foldername(name))[2] = 'visits'
  and exists (
    select 1
    from public.visits
    where visits.id::text = (storage.foldername(name))[3]
      and visits.user_id = auth.uid()
  )
)
with check (
  bucket_id = 'visit-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
  and (storage.foldername(name))[2] = 'visits'
  and exists (
    select 1
    from public.visits
    where visits.id::text = (storage.foldername(name))[3]
      and visits.user_id = auth.uid()
      and visits.deleted_at is null
  )
);

drop policy if exists "Users can delete their own visit files" on storage.objects;
create policy "Users can delete their own visit files"
on storage.objects
for delete
using (
  bucket_id = 'visit-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
  and (storage.foldername(name))[2] = 'visits'
  and exists (
    select 1
    from public.visits
    where visits.id::text = (storage.foldername(name))[3]
      and visits.user_id = auth.uid()
  )
);
