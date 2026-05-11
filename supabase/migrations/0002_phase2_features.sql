alter table public.projects
  add column if not exists slug text unique,
  add column if not exists status text not null default 'draft' check (status in ('draft', 'active', 'completed')),
  add column if not exists progress_percent int not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  add column if not exists template_id uuid references public.templates(id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();

alter table public.mentor_threads
  add column if not exists title text,
  add column if not exists updated_at timestamptz not null default now();

alter table public.mentor_messages
  add column if not exists provider text,
  add column if not exists model text;

create unique index if not exists projects_slug_unique_idx on public.projects(slug);
create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists projects_template_id_idx on public.projects(template_id);
create index if not exists mentor_threads_user_id_idx on public.mentor_threads(user_id);
create index if not exists mentor_messages_thread_id_idx on public.mentor_messages(thread_id);

drop policy if exists "owner project access" on public.projects;
create policy "project owner write" on public.projects
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "public projects read" on public.projects
for select
using (is_public = true or auth.uid() = user_id);
