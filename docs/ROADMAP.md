# Roadmap

**Last updated:** 2026-10-23

The approved North Star is a user completing the full real-wardrobe journey: account → full-body photo → several real garments → AI-suggested metadata review → wardrobe → owned-item outfit recommendation → try-on → save/rate.

## Current authorization and status

### Phase 0 — Repository inspection and architecture proposal
**Complete.** Architecture and open decisions are documented in `docs/`.

### Phase 1 — UI/UX prototype with mock data
**Complete and preserved.** The complete illustrative experience remains available under `/demo/**`: onboarding guidance, wardrobe CRUD interactions, simulated garment-photo analysis, stylist recommendations, try-on states, saved outfits, favorites/ratings, and mock preferences. The mock state is in-memory and is not user-owned account data.

### Phase 2, Stage A — Authentication and route separation
**Implementation complete; core Preview flows confirmed by the owner.** `/welcome` is public, `/demo/**` is isolated mock content, and actual application routes require a verified Supabase Auth session. Email confirmation, sign-in/out, session refresh, empty account state, demo navigation/isolation, callback handling, and safe internal redirects are implemented. Password recovery currently returns a Supabase rate-limit response and is deferred at the owner's request. No migrations, app-data persistence, image uploads, Storage buckets, or AI provider are included.

Vercel Preview and Production use the same Supabase project. Preview sign-ups create users in the shared Auth system; this is not environment isolation. Use dedicated synthetic accounts. The code does not alter Supabase or Vercel dashboard settings.

### Phase 2, Stage B — Persistence
**Discovery complete; initial schema draft prepared for review, not applied.** Read-only inventory found no app-owned tables. The owner selected recoverable deletion for clothing items/outfits and record columns for favorite/save/rating state. The additive SQL draft and visual overview are in `docs/`; neither is applied. The owner deferred the backup step because the Supabase Free plan does not provide the desired backup option; no restorable backup/export has been verified. This deferral does not authorize a migration: exact SQL approval and a separate apply instruction are still required, with the no-backup risk reconfirmed before any write. Do not seed mock demo records into accounts. RLS does not isolate Preview from Production.

### Phase 2, Stage C — Private photos
**Not started; requires separate approval.** Add private image selection, validation, upload/retrieval, replacement, and retryable cleanup only after the environment and Storage policy are approved.

### Later AI stages
Provider-neutral job readiness and any real provider implementation/evaluation remain deferred. No provider, AI key, AI call, or generation job is included here.

## Testing and release gates

- Automated checks cover TypeScript, production build, redirect/route helpers, and the server-side identity guard.
- Owner-confirmed Preview checks: sign-up + email confirmation, sign-in/out, session refresh, empty account, and demo separation/navigation.
- Password recovery remains blocked by a Supabase rate-limit response; deferred at the owner's request.
- Before any Stage B migration or data write, reconfirm that the owner has deferred the backup and understands no restorable backup is available; obtain explicit approval of the exact SQL and a separate apply instruction. Then test anonymous access and at least two synthetic users, cross-user relationship rejection, create/update/soft-delete/restore, and account cleanup. Do not treat RLS or a successful Preview deployment as Preview/Production data isolation.
- Track the full hierarchy and current gates in [`docs/PROJECT_STATUS.md`](PROJECT_STATUS.md).

## Explicitly deferred

Payments, subscriptions, shopping/affiliate commerce, social features, weather integration, advanced travel packing, advanced recommendation analytics, complex notifications, and native Android/iOS clients. Architecture may accommodate them later, but they are not current priorities.
