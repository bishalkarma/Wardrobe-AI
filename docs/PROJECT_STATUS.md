# Wardrobe AI — Project Status

**As of:** 2026-10-23 · **Current focus:** Phase 2, Stage B — persistence schema review<br>
**Branch/PR:** `arena/b546cfc0-wardrobe-ai` · PR #1 is open and draft · [PR and current Preview deployment](https://github.com/bishalkarma/Wardrobe-AI/pull/1)

**Product goal:** Help someone use the clothes they actually own—from account and wardrobe setup through outfit recommendations and, later, try-on.

## Delivery hierarchy

| Phase / stage | Status | What is done / what remains |
|---|---|---|
| **Phase 0 — Architecture** | Complete | Product boundaries, architecture, security principles, and future AI evaluation plan documented. |
| **Phase 1 — Mock prototype** | Complete | Responsive prototype preserved under `/demo/**`; interactions and sample records are temporary, illustrative, and isolated from accounts. |
| **Phase 2A — Authentication** | Implemented; Preview-tested | Email confirmation, sign-in/out, session refresh, empty authenticated account, and demo separation/navigation were confirmed by the owner. Password recovery currently returns a Supabase rate-limit response and is deferred at the owner's request. |
| **Phase 2B — Persistence** | **Schema draft ready for review; writes gated** | Inventory found no app-owned tables. The owner chose recoverable deletion and record columns for favorite/save/rating state. Exact SQL draft is in `docs/STAGE_B_INITIAL_SCHEMA_DRAFT.sql`; it is not applied. No restorable backup has been created or verified. |
| **Phase 2C — Private photos** | Not started | Later: file validation, private Storage, access policies, replacement, and retryable deletion. No uploads or Storage changes now. |
| **Phase 3 — Real AI and try-on** | Not started | Later: wardrobe-grounded recommendations, provider evaluation, durable jobs, usage controls, and the Garment Fidelity Test. The current stylist/try-on screens remain demo-only. |
| **Later / deferred** | Not started | Payments, commerce, social, weather, advanced analytics, and native apps. |

## Stage 2B work breakdown

1. **B0 — Environment and schema discovery:** Complete. The shared project was selected conditionally; read-only inventory found no app-owned tables. A restorable backup/export has **not** been created or verified.
2. **B1 — Domain model and draft:** Initial owner-scoped model and additive SQL draft prepared at `docs/STAGE_B_INITIAL_SCHEMA_DRAFT.sql`, reflecting the owner's deletion and column-storage choices. Awaiting review of the exact SQL.
3. **B2 — Migrations and RLS:** Not authorized to apply yet. Requires both owner confirmation of a restorable backup/rollback plan and explicit approval of the exact SQL. Do not import or seed `/demo` records.
4. **B3 — Application persistence:** Later connect authenticated profile, wardrobe, and outfit interactions to owner-checked persistence; keep accounts empty until users add their own data.
5. **B4 — Verification and rollout:** Test anonymous access and at least two synthetic users, cross-user relationship rejection, CRUD/deletion/restore, and the deployed Preview before any broader rollout.

## Safety gates and known constraints

- Vercel Preview and Production share the **same Supabase project**. Preview Auth users are shared with Production; Auth rate limits are shared too.
- The owner selected the existing shared Supabase project as the **conditional** Stage B target after review. This is not approval to apply a migration.
- Read-only inventory on 2026-10-20 found no app-owned tables/columns in `public`; the broader listing showed only Supabase-managed schemas (`auth`, `extensions`, `realtime`, `storage`, `vault`). No row data or Vault secrets were queried.
- **No backup has been made or verified. No DDL or data writes have occurred.** The agent has no Supabase dashboard/database access; the owner must create or verify the restorable backup/export.
- Before any database write, the owner must confirm that backup/rollback plan and explicitly approve the exact SQL. RLS does **not** isolate Preview from Production.
- Stage 2B excludes private image uploads/Storage, AI calls, payments, and Production setting changes.

## Current implementation map

- `app/(demo)/demo/**` — Phase 1 screens and mock provider boundary.
- `app/(authenticated)/**` — protected routes and empty account placeholders.
- `app/auth/**`, `proxy.ts`, `lib/auth/**`, `lib/supabase/**` — Stage 2A auth, callbacks, session refresh, and redirect safety.
- `docs/ROADMAP.md`, `docs/DATABASE.md`, `docs/SECURITY.md` — detailed roadmap, proposed data model/safety gates, and safeguards.
