# Production Launch Checklist

Use this checklist before promoting a release to production.

## 1) Environment Variables and Secrets

- [ ] Set required environment variables in deployment platform and local `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_APP_URL`
  - `OPENAI_API_KEY` (required if mentor/roadmap OpenAI flows are enabled)
  - `ANTHROPIC_API_KEY` (required when `MENTOR_PROVIDER=anthropic`)
  - `MENTOR_PROVIDER` (`openai` or `anthropic`)
  - `OPENAI_MENTOR_MODEL` and `ANTHROPIC_MENTOR_MODEL` (optional overrides)
- [ ] Store secrets only in server-side secret stores (never in source control).
- [ ] Ensure only safe values use the `NEXT_PUBLIC_` prefix.

## 2) Supabase Auth and Google OAuth

- [ ] In Supabase Dashboard -> Authentication -> Providers, enable Google provider.
- [ ] Configure Google OAuth client credentials and authorized redirect URI:
  - `<APP_URL>/auth/callback`
- [ ] Add production and preview URLs to allowed redirect URLs in Supabase Auth settings.
- [ ] Verify sign-in/sign-out with both email/password and Google OAuth in preview environment.

## 3) Database Migrations and RLS Verification

- [ ] Apply latest migration(s) from `supabase/migrations`.
- [ ] Confirm RLS is enabled on all `public` tables.
- [ ] Verify policy behavior as both authenticated and unauthenticated users:
  - owner can read/write own records
  - unauthorized users are denied writes
  - public-read tables only expose intended data
- [ ] Confirm no privileged `security definer` functions are exposed through public schema.
- [ ] Validate views do not bypass policy intent (prefer `security_invoker` where applicable).

## 4) Smoke Tests for Critical Flows

- [ ] Landing page loads and CTA paths are functional.
- [ ] Sign-up/sign-in flow works (email/password and Google OAuth).
- [ ] Onboarding submits successfully and generates roadmap.
- [ ] Dashboard renders user-specific data.
- [ ] Mentor chat endpoint returns valid responses with configured provider.
- [ ] Workspace, portfolio, community, and templates pages render without runtime errors.

## 5) Monitoring, Logging, and Alerts

- [ ] Capture Next.js server/runtime errors and API route failures (e.g., Vercel logs + error tracking).
- [ ] Enable Supabase project alerts for auth/database anomalies.
- [ ] Add alerting for sustained 5xx rate, auth callback failures, and elevated response latency.
- [ ] Track basic business events (signup completion, onboarding completion, roadmap generation).

## 6) Security Checks

- [ ] Verify no `service_role` key is present in client-side bundles or `NEXT_PUBLIC_` variables.
- [ ] Confirm publishable key only is used by browser clients.
- [ ] Review Auth/RLS assumptions:
  - no authorization decisions based on user-editable metadata
  - policies rely on trusted claims and table ownership checks
- [ ] Ensure API responses do not leak secrets or internal stack details.

## 7) Deployment and Rollback

- [ ] Deploy from a tagged or clearly identified commit.
- [ ] Run post-deploy verification:
  - `npm run typecheck`
  - `npm run lint`
  - manual smoke test of auth/onboarding/dashboard flows
- [ ] Keep prior stable deployment available for rollback.
- [ ] Define rollback trigger thresholds (error rate, auth failures, onboarding failures).
- [ ] If rollback is needed: revert to previous stable deployment, then disable failing feature flags or integrations before reattempting release.
