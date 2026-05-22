-- Repair existing Crucible databases that were created before the current
-- application API contract. The base migration uses create table if not exists,
-- which does not add new columns to already-created tables.

create extension if not exists pgcrypto;

do $$
begin
  create type public.application_tier as enum (
    'Elite Resident',
    'Incubator',
    'Core Builder'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.application_status as enum (
    'pending',
    'approved',
    'rejected'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.log_type as enum (
    'info',
    'success',
    'warning',
    'error'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  founder text not null,
  email text not null,
  links text,
  project text not null,
  score integer not null default 80,
  tier public.application_tier not null default 'Core Builder',
  status public.application_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  message text not null,
  type public.log_type not null default 'info',
  created_at timestamptz not null default now()
);

alter table public.waitlist
  add column if not exists id uuid,
  add column if not exists email text,
  add column if not exists created_at timestamptz;

alter table public.waitlist
  alter column id set default gen_random_uuid(),
  alter column created_at set default now();

update public.waitlist
set
  id = coalesce(id, gen_random_uuid()),
  created_at = coalesce(created_at, now());

update public.waitlist
set email = 'missing-waitlist-' || id::text || '@example.invalid'
where email is null
  or btrim(email) = ''
  or email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$';

alter table public.waitlist
  alter column id set not null,
  alter column email set not null,
  alter column created_at set not null;

alter table public.applications
  add column if not exists id uuid,
  add column if not exists name text,
  add column if not exists founder text,
  add column if not exists email text,
  add column if not exists links text,
  add column if not exists project text,
  add column if not exists score integer,
  add column if not exists tier public.application_tier,
  add column if not exists status public.application_status,
  add column if not exists created_at timestamptz,
  add column if not exists updated_at timestamptz;

alter table public.applications
  alter column id set default gen_random_uuid(),
  alter column score set default 80,
  alter column created_at set default now(),
  alter column updated_at set default now();

alter table public.applications
  alter column tier drop default,
  alter column status drop default;

drop policy if exists "Allow public application inserts" on public.applications;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'applications'
      and column_name = 'tier'
      and not (
        data_type = 'USER-DEFINED'
        and udt_schema = 'public'
        and udt_name = 'application_tier'
      )
  ) then
    execute $sql$
      alter table public.applications
        alter column tier type public.application_tier
        using (
          case
            when tier::text in ('Elite Resident', 'Incubator', 'Core Builder')
              then tier::text
            else 'Core Builder'
          end
        )::public.application_tier
    $sql$;
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'applications'
      and column_name = 'status'
      and not (
        data_type = 'USER-DEFINED'
        and udt_schema = 'public'
        and udt_name = 'application_status'
      )
  ) then
    execute $sql$
      alter table public.applications
        alter column status type public.application_status
        using (
          case
            when status::text in ('pending', 'approved', 'rejected')
              then status::text
            else 'pending'
          end
        )::public.application_status
    $sql$;
  end if;
end $$;

alter table public.applications
  alter column tier set default 'Core Builder',
  alter column status set default 'pending';

update public.applications
set
  id = coalesce(id, gen_random_uuid()),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now()),
  score = greatest(0, least(100, coalesce(score, 80))),
  tier = coalesce(tier, 'Core Builder'),
  status = coalesce(status, 'pending');

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'applications'
      and column_name = 'description'
  ) then
    execute $sql$
      update public.applications
      set project = coalesce(
        nullif(btrim(project), ''),
        nullif(btrim(description::text), ''),
        'Application submitted before schema repair.'
      )
      where project is null or btrim(project) = ''
    $sql$;
  else
    update public.applications
    set project = 'Application submitted before schema repair.'
    where project is null or btrim(project) = '';
  end if;
end $$;

update public.applications
set
  name = coalesce(
    nullif(btrim(name), ''),
    nullif(btrim(founder), ''),
    'Untitled Application'
  ),
  founder = coalesce(
    nullif(btrim(founder), ''),
    nullif(btrim(name), ''),
    'Unknown Founder'
  );

update public.applications
set email = 'missing-application-' || id::text || '@example.invalid'
where email is null
  or btrim(email) = ''
  or email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$';

alter table public.applications
  alter column id set not null,
  alter column name set not null,
  alter column founder set not null,
  alter column email set not null,
  alter column project set not null,
  alter column score set not null,
  alter column tier set not null,
  alter column status set not null,
  alter column created_at set not null,
  alter column updated_at set not null;

alter table public.logs
  add column if not exists id uuid,
  add column if not exists source text,
  add column if not exists message text,
  add column if not exists type public.log_type,
  add column if not exists created_at timestamptz;

alter table public.logs
  alter column id set default gen_random_uuid(),
  alter column created_at set default now();

alter table public.logs
  alter column type drop default;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'logs'
      and column_name = 'type'
      and not (
        data_type = 'USER-DEFINED'
        and udt_schema = 'public'
        and udt_name = 'log_type'
      )
  ) then
    execute $sql$
      alter table public.logs
        alter column type type public.log_type
        using (
          case
            when type::text in ('info', 'success', 'warning', 'error')
              then type::text
            else 'info'
          end
        )::public.log_type
    $sql$;
  end if;
end $$;

alter table public.logs
  alter column type set default 'info';

update public.logs
set
  id = coalesce(id, gen_random_uuid()),
  source = coalesce(nullif(btrim(source), ''), 'SYSTEM'),
  message = coalesce(nullif(btrim(message), ''), 'Legacy log entry repaired.'),
  type = coalesce(type, 'info'),
  created_at = coalesce(created_at, now());

alter table public.logs
  alter column id set not null,
  alter column source set not null,
  alter column message set not null,
  alter column type set not null,
  alter column created_at set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.waitlist'::regclass
      and contype = 'p'
  ) then
    alter table public.waitlist
      add constraint waitlist_pkey primary key (id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.applications'::regclass
      and contype = 'p'
  ) then
    alter table public.applications
      add constraint applications_pkey primary key (id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.logs'::regclass
      and contype = 'p'
  ) then
    alter table public.logs
      add constraint logs_pkey primary key (id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.waitlist'::regclass
      and conname = 'waitlist_email_key'
  ) then
    alter table public.waitlist
      add constraint waitlist_email_key unique (email);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.waitlist'::regclass
      and conname = 'waitlist_email_format'
  ) then
    alter table public.waitlist
      add constraint waitlist_email_format check (
        email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.applications'::regclass
      and conname = 'applications_score_range'
  ) then
    alter table public.applications
      add constraint applications_score_range check (score between 0 and 100);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.applications'::regclass
      and conname = 'applications_email_format'
  ) then
    alter table public.applications
      add constraint applications_email_format check (
        email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
      );
  end if;
end $$;

create index if not exists waitlist_created_at_idx
  on public.waitlist (created_at desc);

create index if not exists applications_created_at_idx
  on public.applications (created_at desc);

create index if not exists applications_status_idx
  on public.applications (status);

create index if not exists logs_created_at_idx
  on public.logs (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_applications_updated_at on public.applications;
create trigger set_applications_updated_at
  before update on public.applications
  for each row
  execute function public.set_updated_at();

alter table public.waitlist enable row level security;
alter table public.applications enable row level security;
alter table public.logs enable row level security;

drop policy if exists "Allow public waitlist inserts" on public.waitlist;
create policy "Allow public waitlist inserts"
  on public.waitlist
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Allow public application inserts" on public.applications;
create policy "Allow public application inserts"
  on public.applications
  for insert
  to anon, authenticated
  with check (status = 'pending');

grant usage on schema public to anon, authenticated;
grant insert on public.waitlist to anon, authenticated;
grant insert on public.applications to anon, authenticated;

do $$
begin
  perform pg_notify('pgrst', 'reload schema');
exception
  when others then null;
end $$;
