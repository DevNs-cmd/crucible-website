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
  email text not null unique,
  created_at timestamptz not null default now(),
  constraint waitlist_email_format check (
    email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  )
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
  updated_at timestamptz not null default now(),
  constraint applications_score_range check (score between 0 and 100),
  constraint applications_email_format check (
    email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  )
);

create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  message text not null,
  type public.log_type not null default 'info',
  created_at timestamptz not null default now()
);

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
