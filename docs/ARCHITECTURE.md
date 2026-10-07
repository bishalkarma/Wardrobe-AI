# Architecture

**Status:** Approved direction; Phase 1 prototype in progress.  
**Last updated:** 2026-10-07

## Approved principles

- Mobile-first responsive web application, PWA-ready; no native Android/iOS client in the MVP.
- Modular monolith with a server-side application/API layer.
- Supabase + PostgreSQL for MVP authentication, database, RLS, and private object storage unless a concrete blocker is found.
- Provider-neutral, server-side AI integration. Never expose provider or storage credentials to the browser.
- Recommendations must resolve to wardrobe item IDs owned by the requesting user.
- AI generation and image-analysis work is tracked as a job; long-running work must not hold the whole application request open.
- Private user media, strict ownership checks, usage tracking, and account-deletion cleanup are first-class requirements.

## Proposed logical shape

```text
Responsive web UI (Phase 1: mock-only)
        │ same-origin, authenticated HTTP API (future)
        ▼
Modular application layer
  ├── Identity / profile
  ├── Wardrobe / media
  ├── Stylist / outfit selection
  ├── Try-on generation jobs
  └── AI orchestration, limits, usage, validation
        ├── Supabase Auth + PostgreSQL (RLS)
        ├── Supabase private Storage
        └── Replaceable AI / image-provider adapters
```

The UI is a client of the application API, not a client of AI vendors. A future mobile client can consume the same documented HTTP API; the web interface is not intended to own business rules.

## Phase 1 implementation boundary

The prototype uses Next.js App Router, React, TypeScript, custom CSS, and local mock data. It has no database, authentication, API handlers, real upload, provider SDK, AI key, or persistent server state. Local interactions demonstrate the intended experience and may reset on refresh. A simulated generation state is not a real AI result.

## Future module responsibilities

- **Identity/profile:** verify Supabase Auth identity; serve profile and style preferences.
- **Wardrobe:** CRUD, category metadata, image references, favorites, and owner-scoped queries.
- **Media:** validate and store private original/derived images; issue short-lived access where needed; coordinate deletion.
- **Stylist:** retrieve candidate items before asking a text/reasoning provider; validate structured item IDs against the caller's wardrobe.
- **Generation:** create and update durable job records; dispatch work; expose status/results through an authenticated API.
- **AI orchestration:** select adapters, enforce quotas, normalize errors and usage, cache safe/reusable results, and avoid logging raw private media.

## Generation job lifecycle

Use a durable job abstraction with `QUEUED`, `PROCESSING`, `COMPLETED`, `FAILED`, and `CANCELLED` states. A job records its owner, operation, provider/model, input references, timestamps, normalized error category, output-media reference, and available usage/cost metadata. State changes must be idempotent. Client requests should create a job and return its identifier; clients then retrieve status or subscribe through a future API mechanism. The concrete worker/queue and notification mechanism depend on deployment and provider limits and remain open.

## Deployment and API decisions still open

- Hosting/runtime and whether Next.js route handlers alone are sufficient for all future work.
- Durable worker/queue technology for slow provider calls.
- API versioning and any realtime/polling mechanism.
- Backup, regional residency, and retention configuration.

These are not needed for the mock-only Phase 1 and must be revisited before Phase 2/production integration.
