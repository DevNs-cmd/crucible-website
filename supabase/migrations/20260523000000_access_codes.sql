create extension if not exists pgcrypto;

do $$
begin
  create type public.access_code_status as enum (
    'active',
    'revoked',
    'exhausted',
    'expired'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.access_codes (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique,
  code_hint text not null,
  label text not null,
  assigned_email text,
  tier text not null default 'Builder',
  max_redemptions integer not null default 1,
  redemption_count integer not null default 0,
  status public.access_code_status not null default 'active',
  expires_at timestamptz,
  created_by text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint access_codes_label_present check (btrim(label) <> ''),
  constraint access_codes_hash_present check (btrim(code_hash) <> ''),
  constraint access_codes_hint_present check (btrim(code_hint) <> ''),
  constraint access_codes_redemption_limit check (max_redemptions > 0),
  constraint access_codes_redemption_count_range check (
    redemption_count >= 0
    and redemption_count <= max_redemptions
  ),
  constraint access_codes_assigned_email_format check (
    assigned_email is null
    or assigned_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  ),
  constraint access_codes_tier_allowed check (
    tier in (
      'Builder',
      'Maker',
      'Founder',
      'Elite Resident',
      'Incubator',
      'Core Builder',
      'Crucible Studio'
    )
  )
);

create table if not exists public.access_redemptions (
  id uuid primary key default gen_random_uuid(),
  access_code_id uuid not null references public.access_codes(id) on delete cascade,
  email text not null,
  name text,
  session_token_hash text not null unique,
  session_token_hint text not null,
  user_agent text,
  ip_address text,
  redeemed_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '90 days'),
  constraint access_redemptions_email_format check (
    email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  ),
  constraint access_redemptions_session_hash_present check (
    btrim(session_token_hash) <> ''
  ),
  constraint access_redemptions_session_hint_present check (
    btrim(session_token_hint) <> ''
  )
);

create index if not exists access_codes_created_at_idx
  on public.access_codes (created_at desc);

create index if not exists access_codes_status_idx
  on public.access_codes (status);

create index if not exists access_codes_assigned_email_idx
  on public.access_codes (lower(assigned_email));

create index if not exists access_redemptions_code_idx
  on public.access_redemptions (access_code_id, redeemed_at desc);

create index if not exists access_redemptions_email_idx
  on public.access_redemptions (lower(email));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_access_codes_updated_at on public.access_codes;
create trigger set_access_codes_updated_at
  before update on public.access_codes
  for each row
  execute function public.set_updated_at();

create or replace function public.redeem_access_code(
  p_code_hash text,
  p_email text,
  p_name text,
  p_session_token_hash text,
  p_session_token_hint text,
  p_user_agent text default null,
  p_ip_address text default null
)
returns table (
  success boolean,
  error text,
  redemption_id uuid,
  access_code_id uuid,
  label text,
  tier text,
  assigned_email text,
  session_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code public.access_codes%rowtype;
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_name text := nullif(btrim(coalesce(p_name, '')), '');
  v_redemption_id uuid;
  v_session_expires_at timestamptz;
begin
  if p_code_hash is null or btrim(p_code_hash) = '' then
    return query select
      false,
      'Enter a valid access code.',
      null::uuid,
      null::uuid,
      null::text,
      null::text,
      null::text,
      null::timestamptz;
    return;
  end if;

  if v_email = '' or v_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' then
    return query select
      false,
      'Enter a valid email address.',
      null::uuid,
      null::uuid,
      null::text,
      null::text,
      null::text,
      null::timestamptz;
    return;
  end if;

  select *
  into v_code
  from public.access_codes
  where code_hash = p_code_hash
  for update;

  if not found then
    return query select
      false,
      'Invalid or expired access code.',
      null::uuid,
      null::uuid,
      null::text,
      null::text,
      null::text,
      null::timestamptz;
    return;
  end if;

  if v_code.expires_at is not null and v_code.expires_at <= now() then
    update public.access_codes
    set status = 'expired', updated_at = now()
    where id = v_code.id
      and status = 'active';

    return query select
      false,
      'Invalid or expired access code.',
      null::uuid,
      null::uuid,
      null::text,
      null::text,
      null::text,
      null::timestamptz;
    return;
  end if;

  if v_code.status <> 'active' then
    return query select
      false,
      'This access code is no longer active.',
      null::uuid,
      v_code.id,
      v_code.label,
      v_code.tier,
      v_code.assigned_email,
      null::timestamptz;
    return;
  end if;

  if v_code.redemption_count >= v_code.max_redemptions then
    update public.access_codes
    set status = 'exhausted', updated_at = now()
    where id = v_code.id
      and status = 'active';

    return query select
      false,
      'This access code has already been used.',
      null::uuid,
      v_code.id,
      v_code.label,
      v_code.tier,
      v_code.assigned_email,
      null::timestamptz;
    return;
  end if;

  if v_code.assigned_email is not null and lower(v_code.assigned_email) <> v_email then
    return query select
      false,
      'This code is assigned to a different email.',
      null::uuid,
      v_code.id,
      v_code.label,
      v_code.tier,
      v_code.assigned_email,
      null::timestamptz;
    return;
  end if;

  v_session_expires_at := coalesce(v_code.expires_at, now() + interval '90 days');

  insert into public.access_redemptions (
    access_code_id,
    email,
    name,
    session_token_hash,
    session_token_hint,
    user_agent,
    ip_address,
    expires_at
  )
  values (
    v_code.id,
    v_email,
    v_name,
    p_session_token_hash,
    p_session_token_hint,
    nullif(left(coalesce(p_user_agent, ''), 500), ''),
    nullif(left(coalesce(p_ip_address, ''), 120), ''),
    v_session_expires_at
  )
  returning id into v_redemption_id;

  update public.access_codes
  set
    redemption_count = redemption_count + 1,
    status = case
      when redemption_count + 1 >= max_redemptions then 'exhausted'::public.access_code_status
      else status
    end,
    updated_at = now()
  where id = v_code.id;

  return query select
    true,
    null::text,
    v_redemption_id,
    v_code.id,
    v_code.label,
    v_code.tier,
    v_code.assigned_email,
    v_session_expires_at;
end;
$$;

alter table public.access_codes enable row level security;
alter table public.access_redemptions enable row level security;

revoke all on function public.redeem_access_code(
  text,
  text,
  text,
  text,
  text,
  text,
  text
) from public, anon, authenticated;

grant execute on function public.redeem_access_code(
  text,
  text,
  text,
  text,
  text,
  text,
  text
) to service_role;

do $$
begin
  perform pg_notify('pgrst', 'reload schema');
exception
  when others then null;
end $$;
