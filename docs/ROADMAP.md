# Roadmap

**Last updated:** 2026-10-28

The approved North Star is a user completing the full real-wardrobe journey: account → full-body photo → several real garments → AI-suggested metadata review → wardrobe → owned-item outfit recommendation → try-on → save/rate.

## Current authorization and status

### Phase 0 — Repository inspection and architecture proposal
**Complete.** Architecture and open decisions are documented in `docs/`.

### Phase 1 — UI/UX prototype with mock data
**Complete and preserved.** The complete illustrative experience remains available under `/demo/**`: onboarding guidance, wardrobe CRUD interactions, simulated garment-photo analysis, stylist recommendations, try-on states, saved outfits, favorites/ratings, and mock preferences. The mock state is in-memory and is not user-owned account data.

### Phase 2, Stage A — Authentication and route separation
**Implementation complete; core Preview flows confirmed by the owner.** `/welcome` is public, `/demo/**` is isolated mock content, and actual application routes require a verified Supabase Auth session. Email confirmation, sign-in/out, session refresh, empty account state, demo navigation/isolation, callback handling, and safe internal redirects are implemented. Password recovery currently returns a Supabase rate-limit response and is deferred at the owner's request. Stage A added no app-data persistence, image uploads, Storage buckets, or AI provider.

Vercel Preview and Production use the same Supabase project. Preview sign-ups create users in the shared Auth system; this is not environment isolation. Use dedicated synthetic accounts. The code does not alter Supabase or Vercel dashboard settings.

### Phase 2, Stage B — Persistence
**Initial schema and archived-only permanent-delete policy applied; account features and Dark Studio Glass revamp implemented; owner Preview testing next.** The owner approved recoverable Delete plus Restore, then selected confirmed Delete Forever for archived clothing and outfits. Migration `stage_b_initial_schema` (`20261028162903`) and migration `archive_permanent_delete` (`20261028181050`) are applied to the shared Supabase project. Seven tables have RLS and 13 policies are present; five static categories were inserted. Permanent-delete RLS requires the owner and a non-null `deleted_at`, so active records cannot be hard-deleted; deleting archived clothing removes its outfit links. The app supports owner-scoped profile/preferences, wardrobe CRUD with long-press bulk soft-delete, archive multi-select for Restore/Delete Forever, and outfits with the same archive actions. The UI supports Dark/Light/Auto appearance, animated confirmation/feedback, and Dark Studio Glass styling across account, demo, welcome, and auth screens; mobile blur and redundant data fetching were reduced after a performance review. No personal rows were seeded or permanently deleted by the agent; no restorable backup was verified because the owner waived it. Vercel build rollback does not roll back Supabase schema/data. Never seed mock demo records into accounts; RLS does not isolate Preview from Production.

### Phase 2, Stage C — Private photos
**Not started; requires separate approval.** Add private image selection, validation, upload/retrieval, replacement, and retryable cleanup only after the Storage policy is approved.

### Later AI stages
Provider-neutral job readiness and any real provider implementation/evaluation remain deferred. No provider, AI key, AI call, or generation job is included here.

## Testing and release gates

- Automated checks cover TypeScript, production build, redirect/route helpers, server-side identity guard, and account-form and bulk-selection validation (37 unit tests total at this update).
- Owner-confirmed Preview checks: sign-up + email confirmation, sign-in/out, session refresh, empty account, and demo separation/navigation.
- Password recovery remains blocked by a Supabase rate-limit response; deferred at the owner's request.
- The applied schema, 13 policies, archived-only DELETE grants, and five static categories were verified. Owner Preview testing remains pending. Next, test create/update/favorite, per-item Delete/Restore, long-press bulk soft-delete, and outfit flows. Use only disposable synthetic records for irreversible Delete Forever checks; verify RLS blocks active-row and cross-user deletes, and confirm the garment-link cascade. Test anonymous access and two synthetic users for cross-user isolation and relationship rejection before broader rollout.
- A Vercel build rollback affects app code only. Database rollback is separate and can destroy data if tables are dropped after records exist. Do not treat a Preview build as a database rollback or as Preview/Production data isolation.
- Track the full hierarchy and current gates in [`docs/PROJECT_STATUS.md`](PROJECT_STATUS.md).

## Explicitly deferred

Payments, subscriptions, shopping/affiliate commerce, social features, weather integration, advanced travel packing, advanced recommendation analytics, complex notifications, and native Android/iOS clients. Architecture may accommodate them later, but they are not current priorities.
