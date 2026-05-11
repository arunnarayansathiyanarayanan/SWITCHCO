# AI CAREER OS

The operating system for becoming AI-native.

## 1) Complete Product Architecture
- **Acquisition Layer:** premium landing page, social proof, testimonials, and conversion CTAs.
- **Identity Layer:** Supabase Auth with email/password and OAuth providers.
- **Transformation Layer:** onboarding + AI roadmap generator + adaptive recommendations.
- **Execution Layer:** builder workspace for workflows, prompts, mini-agents, and project shipping.
- **Proof Layer:** project system, auto-generated portfolio assets, public profile URLs.
- **Reputation Layer:** community feed, comments, likes, and reputation progression.
- **Marketplace Layer:** reusable templates by role and function.

## 2) Folder Structure
`src/app` routes and server actions, `src/components` reusable UI, `src/lib` AI/Supabase services, `src/types` domain types, `supabase/migrations` schema and RLS.

## 3) Database Schema
Implemented in `supabase/migrations/0001_ai_career_os.sql`:
- profiles
- onboarding_profiles
- career_roadmaps
- projects
- portfolios
- community_posts
- comments
- templates
- mentor_threads
- mentor_messages

All tables in `public` use RLS with owner/public read policies aligned to access model.

## 4) Backend Architecture
- Next.js Server Actions for auth and onboarding saves.
- Supabase server client for SSR and route protection.
- Policy-first data model with RLS.
- AI roadmap generation via provider abstraction in `src/lib/ai`.

## 5) Frontend Architecture
- App Router with route-per-domain (`/dashboard`, `/workspace`, `/portfolio`, `/community`, `/templates`).
- Shared shell and UI primitives.
- Loading and error boundaries included.

## 6) AI Architecture
- Prompted structured roadmap generation in `src/lib/ai/roadmap.ts`.
- Zod validation for reliable JSON parsing.
- Fallback deterministic roadmap when API key is missing.

## 7) Design System
- Dark premium theme in `globals.css`.
- Reusable `Button` primitive and glassmorphism surface style.
- Minimal, high-contrast, execution-focused layout language.

## 8) Landing Page Implementation
Implemented in `src/app/page.tsx`: hero, value proposition, first-15-min workflow, core capability cards and CTAs.

## 9) Authentication System
Implemented in `src/app/auth/page.tsx` and `src/app/actions/auth.ts`.
Supabase email/password complete; Google OAuth can be added with one additional server action.

## 10) Onboarding Flow
Implemented in `src/app/onboarding/page.tsx` with multi-input capture and `saveOnboardingAndGenerateRoadmap`.

## 11) Dashboard System
Implemented in `src/app/dashboard/page.tsx` with roadmap summary, momentum metrics, and launch actions.

## 12) Builder Workspace
Implemented foundational workspace in `src/app/workspace/page.tsx`.

## 13) Portfolio Engine
Implemented foundational portfolio UI in `src/app/portfolio/page.tsx`.

## 14) Mentor System
Implemented mentor surface in `src/app/mentor/page.tsx`; DB thread/message schema is ready.

## 15) Community Layer
Implemented public feed surface in `src/app/community/page.tsx` with DB-backed model prepared.

## 16) Template Marketplace
Implemented starter marketplace surface in `src/app/templates/page.tsx`.

## 17) Run and Verify
1. Install dependencies:
   - `npm install`
2. Start local app:
   - `npm run dev`
3. Verify quality gates:
   - `npm run typecheck`
   - `npm run lint`
4. Optional auto-fix:
   - `npm run lint:fix`

## 18) Production Launch Checklist

Use `docs/launch-checklist.md` before each production release.  
It includes environment/secrets setup, Supabase Google OAuth setup, migration + RLS verification, smoke tests, monitoring/alerts, security validation, and rollback steps.
