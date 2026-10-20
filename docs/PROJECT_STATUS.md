# Wardrobe AI — Project Status

**As of:** 2026-10-20 · **Current focus:** Phase 2, Stage B — persistence discovery and design<br>
**Branch/PR:** `arena/b546cfc0-wardrobe-ai` · PR #1 is open and draft · [PR and current Preview deployment](https://github.com/bishalkarma/Wardrobe-AI/pull/1)

**Product goal:** Help someone use the clothes they actually own—from account and wardrobe setup through outfit recommendations and, later, try-on.

## Delivery hierarchy

| Phase / stage | Status | What is done / what remains |
|---|---|---|
| **Phase 0 — Architecture** | Complete | Product boundaries, architecture, security principles, and future AI evaluation plan documented. |
| **Phase 1 — Mock prototype** | Complete | Responsive prototype preserved under `/demo/**`; interactions and sample records are temporary, illustrative, and isolated from accounts. |
| **Phase 2A — Authentication** | Implemented; Preview-tested | Email confirmation, sign-in/out, session refresh, empty authenticated account, and demo separation/navigation were confirmed by the owner. Password recovery currently returns a Supabase rate-limit response and is deferred at the owner's request. |
| **Phase 2B — Persistence** | **Approved to start; discovery/design active** | No application schema, migrations, or persisted wardrobe data yet. Next: confirm a safe database target and inspect its existing schema; finalize user-owned data model and RLS; then build/test migrations and persistence in small increments. |
| **Phase 2C — Private photos** | Not started | Later: file validation, private Storage, access policies, replacement, and retryable deletion. No uploads or Storage changes now. |
| **Phase 3 — Real AI and try-on** | Not started | Later: wardrobe-grounded recommendations, provider evaluation, durable jobs, usage controls, and the Garment Fidelity Test. The current stylist/try-on screens remain demo-only. |
| **Later / deferred** | Not started | Payments, commerce, social, weather, advanced analytics, and native apps. |

## Stage 2B work breakdown

1. **B0 — Environment and schema discovery (current):** shared project chosen conditionally; read-only table listing shows no application tables. Confirm backup/rollback expectations before drafting the exact initial migration for review.
2. **B1 — Domain model:** settle profile/preferences, wardrobes, garments/categories, outfits, and outfit-item relationships, including ownership and deletion behavior.
3. **B2 — Migrations and RLS:** add reviewed migrations and owner-scoped policies/constraints. Do not import or seed `/demo` records.
4. **B3 — Application persistence:** connect authenticated profile, wardrobe, and outfit interactions to server-side, owner-checked persistence; keep accounts empty until users add their own data.
5. **B4 — Verification and rollout:** test anonymous access and at least two synthetic users, cross-user relationship rejection, CRUD/deletion, migration rollback, and the deployed Preview before any broader rollout.

## Safety gates and known constraints

- Vercel Preview and Production share the **same Supabase project**. Preview Auth users are shared with Production; Auth rate limits are shared too.
- The owner selected the existing shared Supabase project as the **conditional** Stage B target after review. This is not approval to apply a migration yet.
- Read-only inventory on 2026-10-20 found no `public` tables/columns and listed only Supabase-managed schemas (`auth`, `extensions`, `realtime`, `storage`, `vault`); no app-owned tables were shown. No row data or Vault secrets were queried.
- Stage B RLS must enforce per-user row ownership; it does **not** isolate Preview from Production. Before any write, agree a backup/rollback plan and get confirmation of the exact migration.
- Stage 2B excludes private image uploads/Storage, AI calls, payments, and production deployment changes.

## Current implementation map

- `app/(demo)/demo/**` — Phase 1 screens and mock provider boundary.
- `app/(authenticated)/**` — protected routes and empty account placeholders.
- `app/auth/**`, `proxy.ts`, `lib/auth/**`, `lib/supabase/**` — Stage 2A auth, callbacks, session refresh, and redirect safety.
- `docs/ROADMAP.md`, `docs/DATABASE.md`, `docs/SECURITY.md` — detailed roadmap, proposed data model, and safeguards.
