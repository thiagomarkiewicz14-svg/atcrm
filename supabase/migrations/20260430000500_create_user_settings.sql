create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  visit_reminder_hours_before integer not null default 24,
  enable_visit_reminders boolean not null default true,
  enable_overdue_visit_alerts boolean not null default true,
  enable_daily_summary boolean not null default false,
  daily_summary_time time not null default '07:00',
  default_visit_status text not null default 'completed',
  default_visit_type text not null default 'technical',
  default_agenda_view text not null default 'week',
  subscription_plan text not null default 'free',
  subscription_status text not null default 'trial',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_settings_visit_reminder_hours_before_check check (
    visit_reminder_hours_before in (1, 3, 6, 12, 24, 48, 72, 168)
  ),
  constraint user_settings_default_visit_status_check check (
    default_visit_status in ('scheduled', 'completed', 'canceled')
  ),
  constraint user_settings_default_visit_type_check check (
    default_visit_type in ('technical', 'commercial', 'follow_up', 'post_sale', 'prospecting', 'collection', 'other')
  ),
  constraint user_settings_default_agenda_view_check check (default_agenda_view in ('week', 'month')),
  constraint user_settings_subscription_plan_check check (subscription_plan in ('free', 'pro', 'premium')),
  constraint user_settings_subscription_status_check check (
    subscription_status in ('trial', 'active', 'past_due', 'canceled')
  )
);

drop trigger if exists set_user_settings_updated_at on public.user_settings;

create trigger set_user_settings_updated_at
before update on public.user_settings
for each row
execute function public.set_updated_at();

alter table public.user_settings enable row level security;

drop policy if exists "Users can select their own settings" on public.user_settings;
create policy "Users can select their own settings"
on public.user_settings
for select
using (user_id = auth.uid());

drop policy if exists "Users can insert their own settings" on public.user_settings;
create policy "Users can insert their own settings"
on public.user_settings
for insert
with check (user_id = auth.uid());

drop policy if exists "Users can update their own settings" on public.user_settings;
create policy "Users can update their own settings"
on public.user_settings
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users can delete their own settings" on public.user_settings;
create policy "Users can delete their own settings"
on public.user_settings
for delete
using (user_id = auth.uid());

insert into public.user_settings (user_id)
select id
from auth.users
on conflict (user_id) do nothing;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function public.sync_next_visit_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  reminder_hours_before integer;
  reminders_enabled boolean;
begin
  select
    coalesce(user_settings.visit_reminder_hours_before, 24),
    coalesce(user_settings.enable_visit_reminders, true)
  into reminder_hours_before, reminders_enabled
  from (select new.user_id as user_id) current_user_settings
  left join public.user_settings
    on user_settings.user_id = current_user_settings.user_id;

  if new.deleted_at is not null or new.next_visit_at is null or reminders_enabled is false then
    delete from public.notifications
    where user_id = new.user_id
      and type = 'next_visit_reminder'
      and related_table = 'visits'
      and related_id = new.id;

    return new;
  end if;

  update public.notifications
  set
    title = 'Próxima visita agendada',
    message = 'Você tem uma visita agendada.',
    scheduled_for = new.next_visit_at - make_interval(hours => reminder_hours_before),
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
      'Próxima visita agendada',
      'Você tem uma visita agendada.',
      'visits',
      new.id,
      new.next_visit_at - make_interval(hours => reminder_hours_before)
    );
  end if;

  return new;
end;
$$;

create or replace function public.sync_user_visit_reminder_settings()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.enable_visit_reminders is false then
    delete from public.notifications
    where user_id = new.user_id
      and type = 'next_visit_reminder'
      and related_table = 'visits';

    return new;
  end if;

  update public.notifications
  set
    title = 'Próxima visita agendada',
    message = 'Você tem uma visita agendada.',
    scheduled_for = visits.next_visit_at - make_interval(hours => new.visit_reminder_hours_before),
    read_at = null
  from public.visits
  where notifications.user_id = new.user_id
    and notifications.type = 'next_visit_reminder'
    and notifications.related_table = 'visits'
    and notifications.related_id = visits.id
    and visits.user_id = new.user_id
    and visits.deleted_at is null
    and visits.next_visit_at is not null;

  insert into public.notifications (
    user_id,
    type,
    title,
    message,
    related_table,
    related_id,
    scheduled_for
  )
  select
    visits.user_id,
    'next_visit_reminder',
    'Próxima visita agendada',
    'Você tem uma visita agendada.',
    'visits',
    visits.id,
    visits.next_visit_at - make_interval(hours => new.visit_reminder_hours_before)
  from public.visits
  where visits.user_id = new.user_id
    and visits.deleted_at is null
    and visits.next_visit_at is not null
    and not exists (
      select 1
      from public.notifications
      where notifications.user_id = visits.user_id
        and notifications.type = 'next_visit_reminder'
        and notifications.related_table = 'visits'
        and notifications.related_id = visits.id
    );

  delete from public.notifications
  where user_id = new.user_id
    and type = 'next_visit_reminder'
    and related_table = 'visits'
    and not exists (
      select 1
      from public.visits
      where visits.id = notifications.related_id
        and visits.user_id = new.user_id
        and visits.deleted_at is null
        and visits.next_visit_at is not null
    );

  return new;
end;
$$;

drop trigger if exists sync_user_visit_reminder_settings_trigger on public.user_settings;

create trigger sync_user_visit_reminder_settings_trigger
after update of visit_reminder_hours_before, enable_visit_reminders on public.user_settings
for each row
when (
  old.visit_reminder_hours_before is distinct from new.visit_reminder_hours_before
  or old.enable_visit_reminders is distinct from new.enable_visit_reminders
)
execute function public.sync_user_visit_reminder_settings();
