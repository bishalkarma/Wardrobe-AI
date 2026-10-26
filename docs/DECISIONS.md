# Architecture Decisions

**Last updated:** 2026-10-26

This log records decisions approved for Wardrobe AI and choices that remain open. New architectural choices should be added here before they are treated as production commitments.

## ADR-001 — Mobile-first responsive web, PWA-ready

**Status:** Approved by product owner.
Build a smartphone-first responsive web experience that works well on desktop and can be installed as a PWA. Do not build native Android/iOS applications in the MVP. Keep business rules behind an HTTP API so future native clients can reuse the backend.

## ADR-002 — Supabase and PostgreSQL for MVP

**Status:** Approved, subject to concrete technical blocker.
Use Supabase Auth, PostgreSQL, RLS, and private Storage where appropriate. Do not create custom authentication unless a specific blocker is documented and approved. Keep secrets server-only and enforce both database and application ownership checks.

## ADR-003 — Modular monolith and server-side application boundary

**Status:** Approved.
Use a modular monolith and a server-side API/application layer; avoid microservices for the MVP. The UI must not call AI vendors directly. Future API responses support wardrobe item IDs and durable job status. Hosting and a dedicated worker/queue remain open until provider/runtime constraints are known.

## ADR-004 — Provider-neutral AI, measured try-on quality

**Status:** Approved.
Define replaceable adapters for vision/clothing analysis, stylist/reasoning, image processing, virtual try-on, and moderation. No vendor is selected as the final production provider. Nano Banana is only a candidate for measured evaluation. Maintain a Garment Fidelity Test and do not claim exact identity or clothing preservation without evidence.

## ADR-005 — Private media and deletion lifecycle

**Status:** Approved requirement.
Use private storage, owner-scoped access, short-lived media access, and deletion workflows covering database records and storage objects. Retention, deployment region, consent copy, and provider-side deletion terms must be confirmed before real user images are processed.

## ADR-006 — Phase 1 is mock-only

**Status:** Approved.
Phase 1 covers only the UI/UX prototype. It must not include real authentication, Supabase calls, AI calls, production keys, or actual user-image uploads. Simulated UI states are clearly distinguished from completed real operations.

## ADR-007 — Phase 1 web implementation stack

**Status:** Selected for Phase 1 implementation; not a deployment commitment.
Use Next.js App Router 16.4.2, React 19.3.0, TypeScript 5.9.3, custom CSS, and Lucide React 1.52.0. This provides a responsive React UI and a natural place for future server-side application/API modules without introducing a separate frontend/backend stack during the prototype. The mock screens remain isolated from future persistence/provider adapters. A PWA manifest, theme color, viewport configuration, and app icon are present; offline service-worker caching is not part of Phase 1. A future mobile client must use the shared API rather than importing web UI logic.

## ADR-008 — Stage A Auth and mock-demo separation

**Status:** Approved and implemented; core Preview flows confirmed by the owner. Password recovery remains deferred due to a Supabase rate-limit response.
Keep `/welcome` public, isolate the mock prototype at `/demo/**`, and require server-verified Supabase Auth identity for actual application routes. New authenticated accounts remain empty. The demo provider and mock records are not mounted or rendered in authenticated routes. Stage A includes Auth/session handling only; it does not add application persistence, migrations, uploads, Storage, or AI.

Use same-origin server actions/handlers with Supabase SSR cookies, a Next.js request proxy for refresh, and server-side `getUser()` checks. Validate internal redirect destinations and use explicit email callback URLs.

## ADR-009 — Existing Supabase project shared by Preview and Production

**Status:** Approved by product owner for Stage A, with shared-Auth warning.
Use the existing Supabase project; do not create another project. Vercel Preview and Production currently point to the same project. Preview sign-ups and confirmations create users in the shared Auth system, and project-level Auth settings are shared. Stage A creates no application database records or Storage objects. Use dedicated synthetic test accounts and do not claim Preview is isolated from Production. No Production environment or Supabase dashboard setting is changed by this implementation.

## ADR-010 — Begin Stage B with database discovery and safety review

**Status:** Owner approved Stage B discovery/design on 2026-10-20, selected the existing shared project conditionally, and approved the exact initial schema on 2026-10-26. The migration is staged but not applied because this workspace has no Supabase database access.

The read-only inventory found no app-owned tables. Preview and Production share the same project, so do not assume deployment isolation from RLS alone. The owner waived/deferred backup due to the Free plan. Do not create another Supabase project or alter dashboard settings without separate approval.

## ADR-011 — Initial persistence deletion and state fields

**Status:** Exact SQL approved and build requested by the owner on 2026-10-26; migration is prepared but not applied.

Use recoverable deletion for clothing items and outfits, represented by `deleted_at`; normal application lists must exclude deleted rows, while an owner can restore a row. Store favorite/save/rating state as columns on the records: `clothing_items.is_favorite`, and `outfits.is_favorite`, `outfits.is_saved`, and `outfits.rating`. Do not create separate favorite or rating tables in the initial draft. The draft is `docs/STAGE_B_INITIAL_SCHEMA_DRAFT.sql` and is not applied. Exact SQL approval and a separate apply instruction are still required.

## ADR-012 — Defer the backup step for Stage B

**Status:** Owner waived/deferred the backup requirement on 2026-10-26 because the Supabase Free plan does not provide the desired backup option.

No restorable backup/export has been created or verified. The owner approved the SQL and asked to proceed; the migration is staged in the repository but has not been executed because the agent has no database access.

## ADR-013 — Application builds do not roll back database changes

**Status:** Clarification recorded on 2026-10-26.

A Vercel build number identifies an application deployment. Rolling back that build does not undo SQL migrations or restore database data. Database rollback is a separate operation, and dropping tables after user data has been written can permanently destroy that data.

## Open decisions before production integration

- Hosting/runtime, API versioning, and whether Next.js route handlers meet the selected deployment’s runtime needs.
- Durable worker/queue and polling/realtime strategy for slow AI jobs.
- Supabase project region, retention/backup policy, and exact RLS/storage policies.
- AI provider and model per capability after access, privacy terms, cost, latency, and fidelity testing.
- Garment Fidelity Test pass thresholds, agreed before provider evaluation.
