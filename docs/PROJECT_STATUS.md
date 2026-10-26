# Wardrobe AI — Project Status

**As of:** 2026-10-26 · **Current focus:** Phase 2, Stage B — migration handoff<br>
**Branch/PR:** `arena/b546cfc0-wardrobe-ai` · PR #1 is open and draft · [PR and current Preview deployment](https://github.com/bishalkarma/Wardrobe-AI/pull/1)

**Product goal:** Help someone use the clothes they actually own—from account and wardrobe setup through outfit recommendations and, later, try-on.

**Visuals:** [Current migration handoff and next steps](assets/stage-b-migration-handoff.png) · [Earlier field-by-field schema overview](assets/stage-b-schema-overview.png)

## Delivery hierarchy

| Phase / stage | Status | What is done / what remains |
|---|---|---|
| **Phase 0 — Architecture** | Complete | Product boundaries, architecture, security principles, and future AI evaluation plan documented. |
| **Phase 1 — Mock prototype** | Complete | Responsive prototype preserved under `/demo/**`; interactions and sample records are temporary, illustrative, and isolated from accounts. |
| **Phase 2A — Authentication** | Implemented; Preview-tested | Email confirmation, sign-in/out, session refresh, empty authenticated account, and demo separation/navigation were confirmed by the owner. Password recovery currently returns a Supabase rate-limit response and is deferred at the owner's request. |
| **Phase 2B — Persistence** | **Schema approved; migration prepared but not applied** | Owner approved the exact initial SQL and asked to proceed. The migration is versioned under `supabase/migrations/`. The backup step is waived/deferred by the owner; no restorable backup is verified. This workspace cannot access Supabase to execute it. |
| **Phase 2C — Private photos** | Not started | Later: file validation, private Storage, access policies, replacement, and retryable deletion. No uploads or Storage changes now. |
| **Phase 3 — Real AI and try-on** | Not started | Later: wardrobe-grounded recommendations, provider evaluation, durable jobs, usage controls, and the Garment Fidelity Test. The current stylist/try-on screens remain demo-only. |
| **Later / deferred** | Not started | Payments, commerce, social, weather, advanced analytics, and native apps. |

## Stage 2B work breakdown

1. **B0 — Environment and schema discovery:** Complete. Read-only inventory found no app-owned tables. Preview and Production share the selected Supabase project.
2. **B1 — Domain model and review:** Complete. The owner approved recoverable item/outfit deletion and record columns for favorite/save/rating; exact SQL approved on 2026-10-26.
3. **B2 — Migration and RLS:** Migration is versioned at `supabase/migrations/20261026000000_stage_b_initial_schema.sql`, but has not been applied. The owner waived/deferred the backup step. The agent has no Supabase database access; the owner must apply and verify the migration through Supabase before app persistence is connected.
4. **B3 — Application persistence:** Next after migration verification: implement authenticated profile, wardrobe, item, and outfit reads/writes with owner checks; keep `/demo/**` data isolated.
5. **B4 — Verification and rollout:** Test anonymous access, at least two synthetic users, cross-user relationship rejection, CRUD/soft-delete/restore, and account cleanup. RLS does not isolate Preview from Production.

## Safety gates and known constraints

- Vercel Preview and Production share the **same Supabase project**. Preview Auth users are shared with Production; Auth rate limits are shared too.
- The owner explicitly waived/deferred the backup step because of the Supabase Free plan. **No restorable backup has been verified.** No database write has occurred.
- The owner approved the exact SQL and asked to proceed, but this workspace has no Supabase dashboard/database access. The migration is staged as code only; it has not run.
- **Vercel build numbers roll back application deployments only. They do not roll back database schema or data.** Database rollback is separate and may be destructive; dropping tables after users add records would lose those records.
- Stage 2B excludes private image uploads/Storage, AI calls, payments, and Production setting changes.
- For each future build update, include a generated visual summarizing what changed and the next ideas, as requested by the owner. Keep those visuals under `docs/assets/`; do not add build identifiers to the app UI.

## Current implementation map

- `app/(demo)/demo/**` — Phase 1 screens and mock provider boundary.
- `app/(authenticated)/**` — protected routes and empty account placeholders.
- `app/auth/**`, `proxy.ts`, `lib/auth/**`, `lib/supabase/**` — Stage 2A auth, callbacks, session refresh, and redirect safety.
- `docs/ROADMAP.md`, `docs/DATABASE.md`, `docs/SECURITY.md` — detailed roadmap, approved schema and safety boundaries.
