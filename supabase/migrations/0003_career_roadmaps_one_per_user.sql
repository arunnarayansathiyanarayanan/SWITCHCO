-- One roadmap row per user (simplifies upserts and avoids maybeSingle/multi-row issues).
-- If this fails due to existing duplicates, run in SQL editor:
--   DELETE FROM public.career_roadmaps a USING public.career_roadmaps b
--   WHERE a.user_id = b.user_id AND a.created_at < b.created_at;
-- then re-run this migration.

create unique index if not exists career_roadmaps_user_id_unique on public.career_roadmaps (user_id);
