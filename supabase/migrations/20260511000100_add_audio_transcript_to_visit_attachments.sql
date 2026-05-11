do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'visit_attachments'
      and column_name = 'transcript_text'
  ) then
    alter table public.visit_attachments
      add column transcript_text text;
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'visit_attachments'
      and column_name = 'transcript_status'
  ) then
    alter table public.visit_attachments
      add column transcript_status text;
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'visit_attachments'
      and column_name = 'transcript_error'
  ) then
    alter table public.visit_attachments
      add column transcript_error text;
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'visit_attachments'
      and column_name = 'transcript_generated_at'
  ) then
    alter table public.visit_attachments
      add column transcript_generated_at timestamptz;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'visit_attachments_transcript_status_check'
  ) then
    alter table public.visit_attachments
      add constraint visit_attachments_transcript_status_check
      check (
        transcript_status is null
        or transcript_status in ('processing', 'completed', 'failed')
      );
  end if;
end $$;

create index if not exists visit_attachments_transcript_status_idx
on public.visit_attachments (user_id, transcript_status)
where transcript_status is not null;
