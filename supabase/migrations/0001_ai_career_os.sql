create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  headline text,
  created_at timestamptz not null default now()
);

create table if not exists public.onboarding_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_role text not null,
  desired_role text not null,
  ai_familiarity text not null,
  weekly_time_hours int not null check (weekly_time_hours > 0),
  interests text[] not null default '{}',
  goals text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.career_roadmaps (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  mission text not null,
  milestones jsonb not null default '[]'::jsonb,
  next_action text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  summary text not null,
  tools_used text[] not null default '{}',
  workflow_definition jsonb not null default '{}'::jsonb,
  automation_logic text,
  screenshots text[] not null default '{}',
  documentation text,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolios (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  slug text unique not null,
  bio text,
  linkedin_summary text,
  resume_bullets text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.community_posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  body text not null,
  likes_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.templates (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid references auth.users(id) on delete set null,
  category text not null,
  name text not null,
  description text not null,
  template_json jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.mentor_threads (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.mentor_messages (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid not null references public.mentor_threads(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.onboarding_profiles enable row level security;
alter table public.career_roadmaps enable row level security;
alter table public.projects enable row level security;
alter table public.portfolios enable row level security;
alter table public.community_posts enable row level security;
alter table public.comments enable row level security;
alter table public.templates enable row level security;
alter table public.mentor_threads enable row level security;
alter table public.mentor_messages enable row level security;

create policy "profile owner full access" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "owner onboarding access" on public.onboarding_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner roadmap access" on public.career_roadmaps for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner project access" on public.projects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner portfolio access" on public.portfolios for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "public post read" on public.community_posts for select using (true);
create policy "owner post write" on public.community_posts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "public comments read" on public.comments for select using (true);
create policy "owner comments write" on public.comments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "public template read published" on public.templates for select using (is_published = true or auth.uid() = author_id);
create policy "author template write" on public.templates for all using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "owner mentor thread access" on public.mentor_threads for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner mentor message access" on public.mentor_messages for all using (
  exists(select 1 from public.mentor_threads t where t.id = thread_id and t.user_id = auth.uid())
) with check (
  exists(select 1 from public.mentor_threads t where t.id = thread_id and t.user_id = auth.uid())
);
