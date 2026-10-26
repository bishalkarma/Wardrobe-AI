# Roadmap

**Last updated:** 2026-10-26

The approved North Star is a user completing the full real-wardrobe journey: account → full-body photo → several real garments → AI-suggested metadata review → wardrobe → owned-item outfit recommendation → try-on → save/rate.

## Current authorization and status

### Phase 0 — Repository inspection and architecture proposal
**Complete.** Architecture and open decisions are documented in `docs/`.

### Phase 1 — UI/UX prototype with mock data
**Complete and preserved.** The complete illustrative experience remains available under `/demo/**`: onboarding guidance, wardrobe CRUD interactions, simulated garment-photo analysis, stylist recommendations, try-on states, saved outfits, favorites/ratings, and mock preferences. The mock state is in-memory and is not user-owned account data.

### Phase 2, Stage A — Authentication and route separation
**Implementation complete; core Preview flows confirmed by the owner.** `/welcome` is public, `/demo/**` is isolated mock content, and actual application routes require a verified Supabase Auth session. Email confirmation, sign-in/out, session refresh, empty account state, demo navigation/isolation, callback handling, and safe internal redirects are implemented. Password recovery currently returns a Supabase rate-limit response and is deferred at the owner's request. No app-data persistence, image uploads, Storage buckets, or AI provider are included.

Vercel Preview and Production use the same Supabase project. Preview sign-ups create users in the shared Auth system; this is not environment isolation. Use dedicated synthetic accounts. The code does not alter Supabase or Vercel dashboard settings.

### Phase 2, Stage B — Persistence
**Exact schema approved; migration prepared but not applied.** Read-only inventory found no app-owned tables. The owner approved recoverable deletion for clothing items/outfits and record columns for favorite/save/rating, then approved the exact SQL and asked to proceed on 2026-10-26. The migration is versioned at `supabase/migrations/20261026000000_stage_b_initial_schema.sql`. The backup step is waived/deferred by the owner due to the Supabase Free plan; no restorable backup is verified. This workspace has no Supabase database access, so no DDL has been executed. Vercel builds do not execute SQL. Do not seed mock demo records into accounts. RLS does not isolate Preview from Production.

### Phase 2, Stage C — Private photos
**Not started; requires separate approval.** Add private image selection, validation, upload/retrieval, replacement, and retryable cleanup only after the environment and Storage policy are approved.

### Later AI stages
Provider-neutral job readiness and any real provider implementation/evaluation remain deferred. No provider, AI key, AI call, or generation job is included here.

## Testing and release gates

- Automated checks cover TypeScript, production build, redirect/route helpers, and the server-side identity guard.
- Owner-confirmed Preview checks: sign-up + email confirmation, sign-in/out, session refresh, empty account, and demo separation/navigation.
- Password recovery remains blocked by a Supabase rate-limit response; deferred at the owner's request.
- The owner must apply the approved migration through Supabase and verify the seven tables/RLS before app persistence is connected. Then test anonymous access and at least two synthetic users, cross-user relationship rejection, create/update/soft-delete/restore, and account cleanup.
- A Vercel build rollback only affects application code. Database rollback is a separate operation and can destroy data if tables are dropped after records exist. Do not treat a Preview build as a database rollback or as Preview/Production data isolation.
- Track the full hierarchy and current gates in [`docs/PROJECT_STATUS.md`](PROJECT_STATUS.md).

## Explicitly deferred

Payments, subscriptions, shopping/affiliate commerce, social features, weather integration, advanced travel packing, advanced recommendation analytics, complex notifications, and native Android/iOS clients. Architecture may accommodate them later, but they are not current priorities.
