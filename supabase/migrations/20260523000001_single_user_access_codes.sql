-- Enforce one access code per user. Future codes must be assigned to a
-- specific email and redeem exactly once.

update public.access_codes
set
  max_redemptions = 1,
  updated_at = now()
where max_redemptions <> 1
  and redemption_count <= 1;

update public.access_codes
set
  status = 'revoked',
  notes = concat_ws(
    E'\n',
    nullif(notes, ''),
    'Revoked by migration: shared/unassigned access codes are no longer allowed.'
  ),
  updated_at = now()
where assigned_email is null
   or max_redemptions <> 1;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.access_codes'::regclass
      and conname = 'access_codes_single_user_email_required'
  ) then
    alter table public.access_codes
      add constraint access_codes_single_user_email_required
      check (assigned_email is not null)
      not valid;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.access_codes'::regclass
      and conname = 'access_codes_single_redemption_only'
  ) then
    alter table public.access_codes
      add constraint access_codes_single_redemption_only
      check (max_redemptions = 1)
      not valid;
  end if;
end $$;

do $$
begin
  perform pg_notify('pgrst', 'reload schema');
exception
  when others then null;
end $$;
