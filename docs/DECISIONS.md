# Architecture Decisions

**Last updated:** 2026-10-07

This log records decisions approved for Wardrobe AI and choices that remain open. New architectural choices should be added here before they are treated as production commitments.

## ADR-001 — Mobile-first responsive web, PWA-ready

**Status:** Approved by product owner.
Build a smartphone-first responsive web experience that works well on desktop and can be installed as a PWA. Do not build native Android/iOS applications in the MVP. Keep business rules behind an HTTP API so future native clients can reuse the backend.

## ADR-002 — Supabase and PostgreSQL for MVP

**Status:** Approved, subject to concrete technical blocker.
Use Supabase Auth, PostgreSQL, RLS, and private Storage where appropriate. Do not create custom authentication unless a specific blocker is documented and approved. Keep secrets server-only and enforce both database and application ownership checks.

## ADR-003 — Modular monolith and server-side application boundary

**Status:** Approved.
Use a modular monolith and a server-side API/application layer; avoid microservices for the MVP. The UI must not call AI vendors directly. Future API responses support wardrobe item IDs and durable job status. Hosting and a dedicated worker/queue remain open until provider/runtime constraints are known.

## ADR-004 — Provider-neutral AI, measured try-on quality

**Status:** Approved.
Define replaceable adapters for vision/clothing analysis, stylist/reasoning, image processing, virtual try-on, and moderation. No vendor is selected as the final production provider. Nano Banana is only a candidate for measured evaluation. Maintain a Garment Fidelity Test and do not claim exact identity or clothing preservation without evidence.

## ADR-005 — Private media and deletion lifecycle

**Status:** Approved requirement.
Use private storage, owner-scoped access, short-lived media access, and deletion workflows covering database records and storage objects. Retention, deployment region, consent copy, and provider-side deletion terms must be confirmed before real user images are processed.

## ADR-006 — Phase 1 is mock-only

**Status:** Approved.
Phase 1 covers only the UI/UX prototype. It must not include real authentication, Supabase calls, AI calls, production keys, or actual user-image uploads. Simulated UI states are clearly distinguished from completed real operations.

## ADR-007 — Phase 1 web implementation stack

**Status:** Selected for Phase 1 implementation; not a deployment commitment.
Use Next.js App Router 16.4.0, React 19.3.0, TypeScript 5.9.3, custom CSS, and Lucide React 1.52.0. This provides a responsive React UI and a natural place for future server-side application/API modules without introducing a separate frontend/backend stack during the prototype. The mock screens remain isolated from future persistence/provider adapters. A PWA manifest, theme color, viewport configuration, and app icon are present; offline service-worker caching is not part of Phase 1. A future mobile client must use the shared API rather than importing web UI logic.

## Open decisions before production integration

- Hosting/runtime, API versioning, and whether Next.js route handlers meet the selected deployment’s runtime needs.
- Durable worker/queue and polling/realtime strategy for slow AI jobs.
- Supabase project region, retention/backup policy, and exact RLS/storage policies.
- AI provider and model per capability after access, privacy terms, cost, latency, and fidelity testing.
- Garment Fidelity Test pass thresholds, agreed before provider evaluation.
