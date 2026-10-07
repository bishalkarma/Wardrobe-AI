# Roadmap

**Last updated:** 2026-10-07

The approved North Star is a user completing the full real-wardrobe journey: account → full-body photo → several real garments → AI-suggested metadata review → wardrobe → owned-item outfit recommendation → try-on → save/rate.

## Current authorization

### Phase 0 — Repository inspection and architecture proposal
**Complete.** The initial repository contained only a title README. The approved architecture and open decisions are documented in `docs/`.

### Phase 1 — UI/UX prototype with mock data
**Authorized now.** Build the full user-facing flow using local fixtures: onboarding, profile-photo guidance, wardrobe CRUD interactions, AI Stylist conversation and sample recommendations, try-on loading/success/failure states, saved outfits, favorites/ratings, and profile/style preferences. No backend, authentication, real image uploads, AI-provider calls, or production credentials.

Phase 1 is complete when the routes are navigable, responsive on phone and desktop, major actions have clear mock feedback, and type/lint/production-build checks pass. Report remaining issues and wait for approval.

### Phase 2 — Supabase foundation and authentication
Only after separate approval: confirm schema and privacy policies, add Supabase Auth/PostgreSQL/RLS/private Storage, account/profile/photo workflows, and deletion lifecycle. Do not start automatically after Phase 1.

### Phase 3 — Wardrobe management
Owner-scoped clothing CRUD, original/derived image handling, search, category filtering, metadata editing, and duplicate/deleted-item behavior.

### Phase 4 — Clothing analysis
Introduce validated image processing/classification providers, user-reviewable suggestions, caching, failure/retry behavior, and cost measurement.

### Phase 5 — AI Stylist
Retrieve relevant user-owned wardrobe candidates; add provider adapter, structured outputs, prompt/request limits, and user preference context.

### Phase 6 — Outfit recommendation engine
Validate every selected wardrobe item ID, store structured outfit combinations, and provide deterministic fallback/clear failure behavior.

### Phase 7 — Virtual try-on
Run provider evaluation including the Garment Fidelity Test; implement jobs and private generated media only after provider access, terms, cost, and quality are approved.

### Phase 8 — Save, favorite, and rate
Persist outfit outcomes and ratings, with user-scoped retrieval and deletion behavior.

### Phase 9 — Testing and security
Exercise upload edge cases, multiple users, cross-user denial, duplicates, deletion, provider failures, slow responses, interruption, and all North Star flows.

### Phase 10 — Performance and cost optimization
Measure cache hit rates, provider use, latency, and spend; tune retrieval, image sizes, limits, and failure/retry policies.

### Phase 11 — Production readiness
Complete deployment, backups, monitoring, incident handling, data retention/deletion, privacy disclosures, and launch review.

## Explicitly deferred

Payments, subscriptions, shopping/affiliate commerce, social features, weather integration, advanced travel packing, advanced recommendation analytics, complex notifications, and native Android/iOS clients. Architecture may accommodate them later, but they are not MVP priorities.
