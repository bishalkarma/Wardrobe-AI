# Wardrobe AI — Project Status

**As of:** 2026-10-28 · **Current focus:** Phase 2, Stage B — authenticated persistence<br>
**Branch/PR:** `arena/b546cfc0-wardrobe-ai` · PR #1 is open and draft · [PR and current Preview deployment](https://github.com/bishalkarma/Wardrobe-AI/pull/1)

**Product goal:** Help someone use the clothes they actually own—from account and wardrobe setup through outfit recommendations and, later, try-on.

**Visuals:** [Applied schema and next steps](assets/stage-b-schema-live.png) · [Earlier field-by-field schema overview](assets/stage-b-schema-overview.png)

## Delivery hierarchy

| Phase / stage | Status | What is done / what remains |
|---|---|---|
| **Phase 0 — Architecture** | Complete | Product boundaries, architecture, security principles, and future AI evaluation plan documented. |
| **Phase 1 — Mock prototype** | Complete | Responsive prototype preserved under `/demo/**`; interactions and sample records are temporary, illustrative, and isolated from accounts. |
| **Phase 2A — Authentication** | Implemented; Preview-tested | Email confirmation, sign-in/out, session refresh, empty authenticated account, and demo separation/navigation were confirmed by the owner. Password recovery currently returns a Supabase rate-limit response and is deferred at the owner's request. |
| **Phase 2B — Persistence** | **Schema applied; application persistence next** | The owner-approved migration was applied to the shared Supabase project on 2026-10-28 (migration version `20261028162903`). Seven tables, RLS, seven policies, and five category rows were verified. User-data tables remain empty. |
| **Phase 2C — Private photos** | Not started | Later: file validation, private Storage, access policies, replacement, and retryable deletion. No uploads or Storage changes now. |
| **Phase 3 — Real AI and try-on** | Not started | Later: wardrobe-grounded recommendations, provider evaluation, durable jobs, usage controls, and the Garment Fidelity Test. The current stylist/try-on screens remain demo-only. |
| **Later / deferred** | Not started | Payments, commerce, social, weather, advanced analytics, and native apps. |

## Stage 2B work breakdown

1. **B0 — Environment and schema discovery:** Complete. Read-only inventory initially found no app-owned tables. Preview and Production share the selected Supabase project.
2. **B1 — Domain model and review:** Complete. The owner approved recoverable item/outfit deletion and record columns for favorite/save/rating.
3. **B2 — Migration and RLS:** Complete. Migration `stage_b_initial_schema` (`20261028162903`) was applied and verified: all seven public tables exist, RLS is enabled on each, seven policies are present, and only five static categories were inserted. User-data tables have zero rows.
4. **B3 — Application persistence:** Next: implement authenticated profile, wardrobe, item, and outfit reads/writes with owner checks; keep `/demo/**` data isolated.
5. **B4 — Verification and rollout:** Test anonymous access, at least two synthetic users, cross-user relationship rejection, CRUD/soft-delete/restore, and account cleanup. RLS does not isolate Preview from Production.

## Safety gates and known constraints

- Vercel Preview and Production share the **same Supabase project**. Preview Auth users are shared with Production; Auth rate limits are shared too.
- The owner waived the backup step because of the Supabase Free plan. **No restorable backup was verified before the migration.** The migration has been applied as authorized; user-data tables remain empty.
- Vercel credentials and Supabase project access are verified. The Vercel build does not execute the Supabase migration.
- **Vercel build numbers roll back application deployments only. They do not roll back database schema or data.** Database rollback is separate and may be destructive; dropping tables after users add records would lose those records.
- Stage 2B excludes private image uploads/Storage, AI calls, payments, and Production setting changes.
- For each future build update, include a generated visual summarizing what changed and the next ideas, as requested by the owner. Keep those visuals under `docs/assets/`; do not add build identifiers to the app UI.

## Current implementation map

- `app/(demo)/demo/**` — Phase 1 screens and mock provider boundary.
- `app/(authenticated)/**` — protected routes and empty account placeholders; persistence implementation is the next step.
- `app/auth/**`, `proxy.ts`, `lib/auth/**`, `lib/supabase/**` — Stage 2A auth, callbacks, session refresh, and redirect safety.
- `docs/ROADMAP.md`, `docs/DATABASE.md`, `docs/SECURITY.md` — detailed roadmap, applied schema and safety boundaries.
