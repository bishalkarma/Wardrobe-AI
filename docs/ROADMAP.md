# Roadmap

**Last updated:** 2026-10-20

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
**Owner-approved to start; discovery/design active.** The live schema and data-write target are not yet verified; no application migrations or persistence have been implemented or applied. First inventory the existing schema and confirm a safe test/rollback target. Then finalize ownership/deletion rules, add migrations and RLS, and implement profile/wardrobe/outfit persistence in small testable sub-stages. Never seed mock demo records into accounts. RLS does not isolate Preview from Production.

### Phase 2, Stage C — Private photos
**Not started; requires separate approval.** Add private image selection, validation, upload/retrieval, replacement, and retryable cleanup only after the environment and Storage policy are approved.

### Later AI stages
Provider-neutral job readiness and any real provider implementation/evaluation remain deferred. No provider, AI key, AI call, or generation job is included here.

## Testing and release gates

- Automated checks cover TypeScript, production build, redirect/route helpers, and the server-side identity guard.
- Owner-confirmed Preview checks: sign-up + email confirmation, sign-in/out, session refresh, empty account, and demo separation/navigation.
- Password recovery remains blocked by a Supabase rate-limit response; deferred at the owner's request.
- Before any Stage B migration or data write, verify the target's existing schema and agree on the test/rollback plan. Do not treat RLS or a successful Preview deployment as Preview/Production data isolation.
- Track the full hierarchy and current gates in [`docs/PROJECT_STATUS.md`](PROJECT_STATUS.md).

## Explicitly deferred

Payments, subscriptions, shopping/affiliate commerce, social features, weather integration, advanced travel packing, advanced recommendation analytics, complex notifications, and native Android/iOS clients. Architecture may accommodate them later, but they are not current priorities.
