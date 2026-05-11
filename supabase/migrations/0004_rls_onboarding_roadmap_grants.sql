grant select, insert, update, delete on public.onboarding_profiles to authenticated;
grant select, insert, update, delete on public.career_roadmaps to authenticated;

-- Fix RLS for first-time INSERT into onboarding_profiles / career_roadmaps.
-- Uses (select auth.uid()) so Postgres evaluates uid once per statement (Supabase guidance).
-- Splits ALL into explicit commands so INSERT WITH CHECK is unambiguous.

-- onboarding_profiles
drop policy if exists "owner onboarding access" on public.onboarding_profiles;

create policy "onboarding_profiles_select_own"
on public.onboarding_profiles
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "onboarding_profiles_insert_own"
on public.onboarding_profiles
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "onboarding_profiles_update_own"
on public.onboarding_profiles
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "onboarding_profiles_delete_own"
on public.onboarding_profiles
for delete
to authenticated
using ((select auth.uid()) = user_id);

-- career_roadmaps
drop policy if exists "owner roadmap access" on public.career_roadmaps;

create policy "career_roadmaps_select_own"
on public.career_roadmaps
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "career_roadmaps_insert_own"
on public.career_roadmaps
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "career_roadmaps_update_own"
on public.career_roadmaps
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "career_roadmaps_delete_own"
on public.career_roadmaps
for delete
to authenticated
using ((select auth.uid()) = user_id);
