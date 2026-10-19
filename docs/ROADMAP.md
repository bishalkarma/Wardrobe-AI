# Roadmap

**Last updated:** 2026-10-19

The approved North Star is a user completing the full real-wardrobe journey: account → full-body photo → several real garments → AI-suggested metadata review → wardrobe → owned-item outfit recommendation → try-on → save/rate.

## Current authorization and status

### Phase 0 — Repository inspection and architecture proposal
**Complete.** Architecture and open decisions are documented in `docs/`.

### Phase 1 — UI/UX prototype with mock data
**Complete and preserved.** The complete illustrative experience remains available under `/demo/**`: onboarding guidance, wardrobe CRUD interactions, simulated garment-photo analysis, stylist recommendations, try-on states, saved outfits, favorites/ratings, and mock preferences. The mock state is in-memory and is not user-owned account data.

### Phase 2, Stage A — Authentication and route separation
**Implementation complete; Preview live testing pending.** `/welcome` is public, `/demo/**` is isolated mock content, and actual application routes require a verified Supabase Auth session. Email/password sign-up requires confirmation; sign-in, sign-out, recovery, callback handling, session refresh, and safe internal redirects are implemented. Authenticated accounts start empty. No migrations, app-data persistence, image uploads, Storage buckets, or AI provider are included.

Vercel Preview and Production use the same Supabase project. Preview sign-ups create users in the shared Auth system; this is not environment isolation. Preview checks must use dedicated synthetic accounts. The code does not alter Supabase or Vercel dashboard settings.

### Phase 2, Stage B — Persistence
**Not implemented; requires separate approval.** Confirm schema and deletion rules, add migrations and RLS, and persist profiles/garments/outfits in small testable sub-stages. Do not seed mock demo records into accounts.

### Phase 2, Stage C — Private photos
**Not implemented; requires separate approval.** Add private image selection, validation, upload/retrieval, replacement, and retryable cleanup only after the environment and Storage policy are approved.

### Later AI stages
Provider-neutral job readiness and any real provider implementation/evaluation remain deferred. No provider, AI key, AI call, or generation job is included here.

## Testing and release gates

- Automated checks cover TypeScript, production build, redirect/route helpers, and the server-side identity guard.
- Real email confirmation and recovery delivery require live testing in the Vercel Preview against the shared Supabase Auth project.
- Do not treat a successful Preview deployment as proof of Preview/Production data isolation.
- Do not proceed to Stage B without explicit owner approval and a verified safe environment for data writes.

## Explicitly deferred

Payments, subscriptions, shopping/affiliate commerce, social features, weather integration, advanced travel packing, advanced recommendation analytics, complex notifications, and native Android/iOS clients. Architecture may accommodate them later, but they are not current priorities.
