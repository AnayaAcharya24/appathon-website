-- Appathon — Supabase schema
-- Run this in the Supabase SQL Editor (or: supabase db push with the CLI).
-- Tables 1-10 from the master prompt, with relationships, unique
-- registration IDs, and Row Level Security. Never put the service-role
-- key in frontend code — it is only for Edge Functions / server code.

create extension if not exists pgcrypto;

-- 10. Admin users (Supabase Auth users with an admin role flag)
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'super_admin', 'judge_coordinator')),
  created_at timestamptz not null default now()
);

-- 1. Participants
create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email citext not null unique,
  phone text not null,
  college text not null,
  department text not null,
  year_of_study text not null,
  city text not null,
  state text not null,
  created_at timestamptz not null default now()
);

-- 2. Teams
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  leader_id uuid references public.participants (id) on delete set null,
  size int not null check (size between 1 and 4),
  created_at timestamptz not null default now()
);

-- 3. Team members
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  participant_id uuid references public.participants (id) on delete set null,
  name text not null,
  email citext not null,
  phone text,
  role text not null default 'Member',
  created_at timestamptz not null default now()
);

-- 4. Registrations (one per participant email — duplicate check is enforced
--    in the app AND by the unique index on participants.email)
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  registration_id text not null unique, -- e.g. APP-2026-1001
  participant_id uuid references public.participants (id) on delete cascade,
  team_id uuid references public.teams (id) on delete set null,
  full_name text not null,
  email citext not null,
  phone text not null,
  college text not null,
  department text not null,
  year_of_study text not null,
  city text not null,
  state text not null,
  participation_type text not null check (participation_type in ('individual', 'team')),
  team_name text,
  team_leader text,
  team_size int not null default 1 check (team_size between 1 and 4),
  project_title text not null,
  category text not null,
  problem_statement text not null,
  project_description text not null,
  innovation text not null,
  technologies text not null,
  development_stage text not null,
  demo_link text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'shortlisted')),
  created_at timestamptz not null default now()
);
create index if not exists registrations_email_idx on public.registrations (email);
create index if not exists registrations_category_idx on public.registrations (category);
create index if not exists registrations_status_idx on public.registrations (status);

-- 5. Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  registration_id text not null references public.registrations (registration_id) on delete cascade,
  title text not null,
  description text not null,
  demo_link text,
  video_link text,
  status text not null default 'submitted'
    check (status in ('submitted', 'under-review', 'shortlisted', 'rejected')),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Project files (metadata only — bytes live in Storage bucket "project-files")
create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  size_bytes bigint not null check (size_bytes <= 10485760), -- 10 MB
  mime_type text,
  uploaded_at timestamptz not null default now()
);

-- 7. Announcements
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  pinned boolean not null default false,
  published_at timestamptz not null default now()
);

-- 8. Judges
create table if not exists public.judges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  expertise text not null,
  email citext not null unique,
  created_at timestamptz not null default now()
);

-- 9. Evaluations (one score per judge per registration; criteria out of 25)
create table if not exists public.evaluations (
  id uuid primary key default gen_random_uuid(),
  registration_id text not null references public.registrations (registration_id) on delete cascade,
  judge_id uuid not null references public.judges (id) on delete cascade,
  innovation int not null check (innovation between 0 and 25),
  technical int not null check (technical between 0 and 25),
  impact int not null check (impact between 0 and 25),
  presentation int not null check (presentation between 0 and 25),
  total int generated always as (innovation + technical + impact + presentation) stored,
  comments text,
  created_at timestamptz not null default now(),
  unique (registration_id, judge_id)
);

-- ---- Storage bucket (create in Dashboard > Storage, or via SQL) ----
-- insert into storage.buckets (id, name, public) values ('project-files', 'project-files', false)
--   on conflict (id) do nothing;
-- File rules: PDF/DOC/PPT/ZIP/PNG/JPG/MP4 only, <= 10 MB — enforced in the
-- app (Submit page) and by a Storage policy (see README).

-- ---- Row Level Security ----
alter table public.participants enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.registrations enable row level security;
alter table public.projects enable row level security;
alter table public.project_files enable row level security;
alter table public.announcements enable row level security;
alter table public.judges enable row level security;
alter table public.evaluations enable row level security;
alter table public.admin_users enable row level security;

-- Public (anon) may: read announcements; insert a registration / project.
-- They may NOT read other people's registrations or evaluations.
create policy "announcements are public" on public.announcements
  for select using (true);
create policy "anyone may register" on public.registrations
  for insert with check (true);
create policy "anyone may create a participant" on public.participants
  for insert with check (true);
create policy "anyone may create a team" on public.teams
  for insert with check (true);
create policy "anyone may add team members" on public.team_members
  for insert with check (true);
create policy "anyone may submit a project" on public.projects
  for insert with check (true);
create policy "anyone may record a project file" on public.project_files
  for insert with check (true);

-- Admins (service-role / authenticated admin_users) get full access.
-- In the Dashboard, add a policy per table like:
--   create policy "admins full access" on public.registrations
--     for all using (exists (select 1 from public.admin_users where auth_user_id = auth.uid()));
-- The frontend Admin demo login must be replaced by Supabase Auth before
-- real registrations open (see README). Service-role key is never used
-- in the browser — only in Edge Functions.
