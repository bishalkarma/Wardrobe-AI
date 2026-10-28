# Wardrobe AI

**Your Clothes. Your Style.**

A mobile-first, PWA-ready wardrobe experience designed around the clothes a person actually owns.

## Current status

**Phase 1 demo preserved; Stage A authentication is implemented and core Preview flows were confirmed. The approved Stage B schema is live, and the first authenticated account experience is now implemented in code: profile/preferences, real wardrobe CRUD with per-item Delete/Restore and long-press bulk recoverable Delete/Restore, and outfits built from account-owned pieces with the same behavior. The existing Auth user’s records are not seeded; the dashboard guides them to add their own first piece. Owner Preview verification is next. The owner waived the backup step, so no restorable backup/export was verified; a Vercel build rollback does not undo database changes.** `/welcome` remains public, `/demo/**` remains mock-only, and authenticated data never uses demo records. Personal photos/Storage and AI styling/try-on remain deferred. Password-recovery rate-limit troubleshooting remains deferred at the owner’s request.

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

## Stage A behavior (historical)

- Email/password sign-up requires email confirmation. Sign-in, sign-out, recovery request, recovery completion, and the `/auth/callback` handler use same-origin server actions/handlers with cookie-backed Supabase SSR sessions.
- At the Stage A milestone, Auth accounts started without app-data rows. The later Stage B account screens now guide first-time setup; demo items, preferences, and outfits remain isolated under `/demo/**`.
- Protected pages are checked in the Next.js request proxy and again in the server-side authenticated layout. Auth identity is verified with Supabase Auth.
- Preview authentication tests write Auth users to the same Supabase project used by Production. No database migrations, application-data persistence, Storage uploads, or AI integrations are part of Stage A.

## Stage B account experience

- The authenticated dashboard reads real account counts and recent records, then offers a guided empty state when the user has not added anything.
- Save a display name, units, fit/style/color preferences to the signed-in profile.
- Add, edit, and favorite clothing metadata. Press and hold an active piece (or use its context menu) to enter selection mode; then select more pieces or Select all visible and Delete them together. They move to the recoverable Archive, where they can be restored. The first saved piece creates the user's wardrobe container; there are no demo rows or image uploads.
- Create outfits only from active pieces owned by the signed-in account. Edit, save/unsave, favorite, rate, and use the same recoverable Delete/Restore flow.
- Every Preview write uses the existing Supabase project also used by Production. Owner sign-in and CRUD verification is still pending; the agent did not seed personal account rows.

## Technology

- Next.js App Router 16.4.2, React 19.3.0, and TypeScript 5.9.3.
- Supabase SSR (`@supabase/ssr`) and Supabase JS for cookie-backed Auth.
- Vitest for account-form and bulk-selection validation, route protection, and redirect validation.
- Custom CSS and Lucide React; the existing responsive visual design and local editorial garment imagery remain in the mock demo.

## Project layout

```text
app/                 Public auth routes, isolated /demo routes, protected account routes
components/           Shared UI, account forms/records, auth forms, mock screens, and demo state
lib/                  Auth redirect rules, Supabase server client, mock data, domain types
tests/                 Account validation and authentication route/redirect unit tests
public/                Local illustrative imagery and PWA assets
docs/                  Architecture, UX, database, AI, security, decisions, roadmap
```

## Documentation

- [One-page project status and hierarchy](docs/PROJECT_STATUS.md)
- [Stage B schema detail diagram](docs/assets/stage-b-schema-overview.png)
- [Build #10 pre-apply handoff (historical)](docs/assets/stage-b-migration-handoff.png)
- [Current account build and next steps](docs/assets/stage-b-account-build.png)
- [Long-press selection mode and bulk Delete/Restore update](docs/assets/stage-b-longpress-selection.png)
- [Earlier bulk multi-select Delete/Restore update](docs/assets/stage-b-bulk-delete.png)
- [Recoverable Delete/Restore update](docs/assets/stage-b-recoverable-delete.png)
- [Stage B applied-schema status](docs/assets/stage-b-schema-live.png)
- [Architecture](docs/ARCHITECTURE.md)
- [UI/UX](docs/UI_UX.md)
- [Database](docs/DATABASE.md)
- [AI architecture and Garment Fidelity Test](docs/AI_ARCHITECTURE.md)
- [Security and privacy](docs/SECURITY.md)
- [Decisions](docs/DECISIONS.md)
- [Roadmap](docs/ROADMAP.md)

## Stage A boundary (historical)

Stage A itself delivered Auth/session handling only; it did not include database schema changes, profile/wardrobe persistence, photo uploads/Storage, AI providers, payments, or Production setting changes. Stage B now supplies the initial account schema and profile/wardrobe/outfit persistence described above. Personal photos, Storage, AI, and payments remain deferred. The existing Supabase project's Auth and account data are shared between Preview and Production; Preview is not a separate data environment. The mock demo remains illustrative and in-memory only.
