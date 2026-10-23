# Wardrobe AI

**Your Clothes. Your Style.**

A mobile-first, PWA-ready wardrobe experience designed around the clothes a person actually owns.

## Current status

**Phase 1 demo preserved; Phase 2 Stage A authentication implemented and core Preview flows confirmed. Stage B persistence discovery/design is active; an initial SQL draft is pending owner review and no migration has been applied. No restorable backup/export has been created or verified.** The mock prototype is isolated under `/demo/**` and uses local in-memory sample data. `/welcome` is public. The real application routes require a verified Supabase Auth session, but authenticated accounts are intentionally empty: wardrobe, preferences, outfits, photo uploads, Storage, and AI are not implemented. Password recovery currently returns a Supabase rate-limit response and is deferred at the owner's request.

Vercel Preview and Production currently use the **same Supabase project**. Preview sign-up and confirmation create users in the shared Supabase Auth system; Preview is not isolated from Production. Use dedicated test accounts and do not use Production user credentials for testing.

## Run locally

Requirements: Node.js 22 or later and npm.

```bash
npm install
```

For real authentication, provide the existing project's public values in an ignored local environment file or your local environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

These values are public client configuration, not authorization controls. Stage A does not require a privileged project key. Do not commit environment files or secrets.

```bash
npm run dev
```

Open the local URL printed by Next.js. `/demo/**` remains available without authentication. For quality checks:

```bash
npm run typecheck
npm test
npm run build
```

## Stage A behavior

- Email/password sign-up requires email confirmation. Sign-in, sign-out, recovery request, recovery completion, and the `/auth/callback` handler use same-origin server actions/handlers with cookie-backed Supabase SSR sessions.
- New accounts see empty authenticated application routes. Mock items, preferences, and outfits exist only in `/demo/**` and are never treated as account records.
- Protected pages are checked in the Next.js request proxy and again in the server-side authenticated layout. Auth identity is verified with Supabase Auth.
- Preview authentication tests write Auth users to the same Supabase project used by Production. No database migrations, application-data persistence, Storage uploads, or AI integrations are part of Stage A.

## Technology

- Next.js App Router 16.4.2, React 19.3.0, and TypeScript 5.9.3.
- Supabase SSR (`@supabase/ssr`) and Supabase JS for cookie-backed Auth.
- Vitest for unit tests of route protection and redirect validation.
- Custom CSS and Lucide React; the existing responsive visual design and local editorial garment imagery remain in the mock demo.

## Project layout

```text
app/                 Public auth routes, isolated /demo routes, protected account routes
components/           Shared UI, auth forms, mock screens, and demo state
lib/                  Auth redirect rules, Supabase server client, mock data, domain types
tests/                 Authentication route/redirect unit tests
public/                Local illustrative imagery and PWA assets
docs/                  Architecture, UX, database, AI, security, decisions, roadmap
```

## Documentation

- [One-page project status and hierarchy](docs/PROJECT_STATUS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [UI/UX](docs/UI_UX.md)
- [Database](docs/DATABASE.md)
- [AI architecture and Garment Fidelity Test](docs/AI_ARCHITECTURE.md)
- [Security and privacy](docs/SECURITY.md)
- [Decisions](docs/DECISIONS.md)
- [Roadmap](docs/ROADMAP.md)

## Stage A boundary

No database schema/migrations, profile or wardrobe persistence, photo upload/Storage bucket, AI provider, payment, or Production setting changes are included. The existing Supabase project's Auth data is shared between Preview and Production; a Preview signup creates a user in that shared Auth system. The mock demo remains illustrative and in-memory only.
