# Wardrobe AI — Project Status

**As of:** 2026-10-28 · **Current focus:** Phase 2, Stage B — authenticated account experience<br>
**Branch/PR:** `arena/b546cfc0-wardrobe-ai` · PR #1 is open and draft · [PR](https://github.com/bishalkarma/Wardrobe-AI/pull/1)

**Product goal:** Help someone use the clothes they actually own—from account and wardrobe setup through outfit recommendations and, later, try-on.

**Visuals:** [Recoverable Delete/Restore update](assets/stage-b-recoverable-delete.png) · [Current account build and next steps](assets/stage-b-account-build.png) · [Applied schema and database verification](assets/stage-b-schema-live.png) · [Field-by-field schema overview](assets/stage-b-schema-overview.png)

## Delivery hierarchy

| Phase / stage | Status | What is done / what remains |
|---|---|---|
| **Phase 0 — Architecture** | Complete | Product boundaries, architecture, security principles, and future AI evaluation plan documented. |
| **Phase 1 — Mock prototype** | Complete | Responsive prototype preserved under `/demo/**`; interactions and sample records are temporary, illustrative, and isolated from accounts. |
| **Phase 2A — Authentication** | Implemented; core Preview flows confirmed | Email confirmation, sign-in/out, session refresh, empty-account entry, and demo separation/navigation were confirmed by the owner. Password recovery currently returns a Supabase rate-limit response and is deferred at the owner's request. |
| **Phase 2B — Persistence** | **Initial account experience implemented; owner Preview verification next** | The approved schema is live. Authenticated profile/preferences, wardrobe records, recoverable archive/restore, and outfits built from account-owned items are now implemented in code. No user-data rows were seeded by the agent; the existing Auth user must save their own details and pieces. |
| **Phase 2C — Private photos** | Not started | Later: file validation, private Storage, access policies, replacement, and retryable deletion. No uploads or Storage changes now. |
| **Phase 3 — Real AI and try-on** | Not started | Later: wardrobe-grounded recommendations, provider evaluation, durable jobs, usage controls, and the Garment Fidelity Test. Account stylist/try-on routes remain explicitly unavailable; the illustrative versions stay demo-only. |
| **Later / deferred** | Not started | Payments, commerce, social, weather, advanced analytics, and native apps. |

## Stage 2B work breakdown

1. **B0 — Environment and schema discovery:** Complete. Read-only inventory initially found no app-owned tables. Preview and Production share the selected Supabase project.
2. **B1 — Domain model and review:** Complete. The owner approved recoverable item/outfit deletion and record columns for favorite/save/rating.
3. **B2 — Migration and RLS:** Complete. Migration `stage_b_initial_schema` (`20261028162903`) was applied and verified: all seven public tables exist, RLS is enabled on each, seven policies are present, and only five static categories were inserted. User-data tables had zero rows at verification.
4. **B3 — Application persistence:** Implemented in this branch. The account home reads real counts and recent records; users can save profile/preferences, add/edit/favorite clothing items, use the visible recoverable Delete/Restore flow, and create/edit/save/favorite/rate outfits composed only of their active account items with the same recoverable Delete/Restore flow. `/demo/**` remains isolated.
5. **B4 — Verification and rollout:** Pending owner sign-in on Preview and tests of create/edit/favorite/archive/restore plus outfits. Automated validation tests pass; anonymous and two-user cross-account behavior still needs live verification. RLS does not isolate Preview from Production.

## Safety gates and known constraints

- Vercel Preview and Production share the **same Supabase project**. Preview Auth users and any account rows they save are shared with Production; Auth rate limits are shared too.
- The owner waived the backup step because of the Supabase Free plan. **No restorable backup was verified before the migration.** The migration is applied; no profile, wardrobe, or outfit data has been seeded by the agent.
- **Vercel build numbers roll back application deployments only. They do not roll back database schema or data.** Database rollback is separate and may be destructive.
- Stage 2B excludes private image uploads/Storage, AI calls, payments, and Production setting changes.
- For each future build update, include a generated visual summarizing what changed and what is planned, saved under `docs/assets/`; do not add build identifiers to the app UI.

## Current implementation map

- `app/(demo)/demo/**` — Phase 1 screens and mock provider boundary.
- `app/(authenticated)/**` — account dashboard, profile, wardrobe, and outfits backed by the session-bound Supabase client; stylist, try-on, and personal photos remain deferred.
- `app/actions/**` — server actions derive user identity from `auth.getUser()`, validate submitted fields, and scope data operations to that user; RLS remains the database boundary.
- `lib/data/**`, `lib/supabase/**` — account context, validation, and cookie-backed client.
- `docs/ROADMAP.md`, `docs/DATABASE.md`, `docs/SECURITY.md` — detailed roadmap, applied schema, and safety boundaries.
