# Architecture

**Status:** Phase 1 demo complete; Stage A core Preview flows confirmed; Stage B schema live and authenticated profile/wardrobe/outfit persistence implemented in code. Owner Preview verification next.
**Last updated:** 2026-10-28

## Approved principles

- Mobile-first responsive web application, PWA-ready; no native Android/iOS client in the MVP.
- Modular monolith with a server-side application/API boundary.
- Supabase Auth + PostgreSQL/RLS + private Storage for the MVP unless a concrete blocker is found.
- Provider-neutral, server-side AI integration. Never expose provider or privileged storage credentials to the browser.
- Recommendations must resolve to wardrobe item IDs owned by the requesting user.
- Long-running AI work must be tracked as durable jobs, not held synchronously in a whole application request.
- Private user media, strict ownership checks, usage tracking, and account-deletion cleanup are first-class future requirements.

## Current route and data boundaries

- `/welcome` is public and contains sign-up/sign-in entry points.
- `/demo/**` is public and contains the preserved Phase 1 mock prototype. Its `PrototypeProvider` is mounted only within the demo route layout. Sample garments, outfits, preferences, and temporary changes never enter authenticated account routes.
- `/`, `/profile/**`, `/wardrobe/**`, and `/outfits/**` are authenticated account routes backed by the cookie/session Supabase client. Server Components read current-user data; Server Actions derive identity with `auth.getUser()`, validate inputs, and perform owner-filtered writes under RLS. New accounts start without profile/wardrobe/outfit rows; the dashboard guides first-time setup, and the first garment creates one wardrobe on demand.
- `/stylist` and `/try-on` are authenticated but explicitly not connected to AI or image generation. `/profile/photo` explains that private photo upload is deferred; no Storage bucket or personal images are used.
- `/auth/callback`, `/auth/forgot-password`, and `/auth/reset-password` handle email confirmation and password recovery. Internal continuation paths are allowlisted; external and protocol-relative redirects are rejected.

## Stage A authentication implementation

The web app uses `@supabase/ssr` and `@supabase/supabase-js` with the existing project's `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Those are public configuration values and are not authorization controls. No privileged project key is used for ordinary Auth.

Auth changes are submitted to same-origin server actions/route handlers. The server client reads and writes Supabase SSR cookies; cookies are host-only, `HttpOnly`, `SameSite=Lax`, and `Secure` in production. A Next.js 16 `proxy.ts` refreshes cookies on protected navigations. Protected layouts verify identity with Supabase Auth's server-side `getUser()` rather than trusting browser state or a client-supplied user ID. There is no browser Supabase client because the Stage A forms and sign-out use server actions.

Sign-up and recovery requests pass an explicit callback URL built from the current same-origin request. Supabase's redirect allowlist remains an external control; the app validates the internal `next` path and never accepts an arbitrary external destination. The Production Site URL is not changed by this code.

## Shared Supabase project warning

The owner confirmed that Vercel Preview and Production use the **same Supabase project**. Preview is therefore not isolated from Production: preview sign-ups and confirmations create accounts in the shared Auth system, and Auth configuration is project-wide. Stage A added no application tables or Storage objects, but Auth user records and email activity are shared. Test Preview with dedicated synthetic accounts; do not describe it as a separate database or Auth environment.

The owner-approved initial Stage B migration was applied to the shared Supabase project on 2026-10-28 as `stage_b_initial_schema` (version `20261028162903`). Read-only verification confirmed all seven intended public tables, RLS on each, seven policies, and five static category rows. Authenticated account persistence is implemented in code; no personal profile, wardrobe, or outfit records were seeded by the agent. The owner waived the backup step because of the Supabase Free plan, and no restorable backup was verified before applying the migration. Vercel build rollback affects app code only, not database schema or data. RLS does not separate Preview from Production; any Preview account data the owner saves is in the same project used by Production.

## Phase 1 demo implementation boundary

The mock uses local in-memory state and bundled illustrative editorial images only. It has no database, personal-photo upload, application-data persistence, AI provider, or real try-on result. The prototype is isolated under `/demo/**`; authenticated routes do not import its state provider or screen components.

## Future module responsibilities

- **Identity/profile:** verify Supabase Auth identity; serve profile and style preferences.
- **Wardrobe:** owner-scoped CRUD, category metadata, image references, favorites, and queries.
- **Media:** validate and store private original/derived images; issue short-lived access; coordinate deletion.
- **Stylist:** retrieve candidate items before any reasoning provider; validate IDs against the caller's wardrobe.
- **Generation:** create/update durable jobs, dispatch work, and expose status/results through an authenticated API.
- **AI orchestration:** select approved adapters, enforce quotas, normalize errors/usage, and avoid logging raw private media.

## Future generation-job lifecycle

Use `QUEUED`, `PROCESSING`, `COMPLETED`, `FAILED`, and `CANCELLED` states. A job will record owner, operation, provider/model, inputs, timestamps, normalized error, output-media reference, and available usage/cost metadata. State changes must be idempotent. The concrete worker/queue and notification mechanism remain open. No AI provider or job implementation is included in Stage A.

## Deployment and API decisions still open

- Data-project isolation before onboarding additional test users or enabling private-media/AI workflows. Current Preview account writes use the shared Preview/Production Supabase project; use only owner-controlled test records until isolation is available or explicitly accepted.
- Hosting/runtime and whether Next.js route handlers are sufficient for future work.
- Durable worker/queue for slow provider calls, API versioning, and realtime/polling.
- Database/storage backups, regional residency, retention, and deletion configuration.

These future decisions do not expand the Stage A scope.
