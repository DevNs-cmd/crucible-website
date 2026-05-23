-- Create user_projects table to persist dashboard code files
create table if not exists public.user_projects (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  repo_name text not null,
  file_path text not null,
  code_content text not null default '',
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_user_project_file unique (email, repo_name, file_path),
  constraint user_projects_repo_name_present check (btrim(repo_name) <> ''),
  constraint user_projects_file_path_present check (btrim(file_path) <> '')
);

-- Index for speedy retrieval by user email
create index if not exists user_projects_email_idx on public.user_projects (lower(email));

-- Set up automated updated_at trigger
drop trigger if exists set_user_projects_updated_at on public.user_projects;
create trigger set_user_projects_updated_at
  before update on public.user_projects
  for each row
  execute function public.set_updated_at();

-- Enable Row Level Security (RLS)
alter table public.user_projects enable row level security;

-- Policy to allow service_role / server client full access
create policy "Allow service_role full access"
  on public.user_projects
  for all
  to service_role
  using (true)
  with check (true);

-- Notify PostgREST to reload schema cache
do $$
begin
  perform pg_notify('pgrst', 'reload schema');
exception
  when others then null;
end $$;
