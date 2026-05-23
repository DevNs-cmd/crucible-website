-- Keep the production duplicate application fields compatible while the app
-- writes the canonical API contract. This is intentionally additive: it does
-- not drop legacy columns or weaken RLS.

alter table public.applications
  add column if not exists founder_name text,
  add column if not exists startup_name text,
  add column if not exists stage text,
  add column if not exists fit_score integer;

update public.applications
set
  founder = coalesce(
    nullif(btrim(founder), ''),
    nullif(btrim(founder_name), ''),
    'Unknown Founder'
  ),
  founder_name = coalesce(
    nullif(btrim(founder_name), ''),
    nullif(btrim(founder), ''),
    'Unknown Founder'
  ),
  name = coalesce(
    nullif(btrim(name), ''),
    nullif(btrim(startup_name), ''),
    nullif(btrim(project), ''),
    'Untitled Application'
  ),
  startup_name = coalesce(
    nullif(btrim(startup_name), ''),
    nullif(btrim(name), ''),
    nullif(btrim(project), ''),
    'Untitled Application'
  ),
  project = coalesce(
    nullif(btrim(project), ''),
    nullif(btrim(startup_name), ''),
    nullif(btrim(name), ''),
    'Untitled Application'
  ),
  score = greatest(0, least(100, coalesce(score, fit_score, 80))),
  fit_score = greatest(0, least(100, coalesce(fit_score, score, 80)));

create or replace function public.sync_application_compatibility_fields()
returns trigger
language plpgsql
as $$
begin
  new.founder := coalesce(
    nullif(btrim(new.founder), ''),
    nullif(btrim(new.founder_name), ''),
    'Unknown Founder'
  );

  new.founder_name := coalesce(
    nullif(btrim(new.founder_name), ''),
    new.founder
  );

  new.name := coalesce(
    nullif(btrim(new.name), ''),
    nullif(btrim(new.startup_name), ''),
    nullif(btrim(new.project), ''),
    'Untitled Application'
  );

  new.startup_name := coalesce(
    nullif(btrim(new.startup_name), ''),
    new.name
  );

  new.project := coalesce(
    nullif(btrim(new.project), ''),
    new.startup_name,
    new.name
  );

  new.score := greatest(0, least(100, coalesce(new.score, new.fit_score, 80)));
  new.fit_score := greatest(0, least(100, coalesce(new.fit_score, new.score, 80)));

  return new;
end;
$$;

drop trigger if exists sync_application_compatibility_fields on public.applications;
create trigger sync_application_compatibility_fields
  before insert or update on public.applications
  for each row
  execute function public.sync_application_compatibility_fields();

do $$
begin
  perform pg_notify('pgrst', 'reload schema');
exception
  when others then null;
end $$;
