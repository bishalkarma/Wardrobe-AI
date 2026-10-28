# Security and Privacy

**Status:** Stage A Auth flows confirmed in Preview; Stage B schema applied and initial account persistence implemented. Owner Preview verification and two-user RLS testing remain.
**Last updated:** 2026-10-28

## Data classification

Account identifiers, profile details, style preferences, wardrobe metadata, and outfit history are private user data. Profile photos, body images, wardrobe photos, and generated try-on images would be highly sensitive; they are not collected or processed in the current implementation.

## Authentication and session controls

- Use Supabase email/password Auth. Email confirmation is required for new accounts.
- Use only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for the SSR client. These values are not authorization controls. No service-role key is used for ordinary Auth or account CRUD.
- Store the session in SSR cookies using `@supabase/ssr`. Cookies are host-only, `HttpOnly`, `SameSite=Lax`, and `Secure` in production. The Next.js request proxy refreshes sessions; protected server layouts also verify identity with Auth `getUser()`.
- Keep sign-up, sign-in, recovery, password update, sign-out, and account-data writes in same-origin server actions/handlers. Account actions derive the owner UUID from `auth.getUser()`; never trust a user ID from a form or browser state as proof of identity.
- Allow only safe internal post-auth destinations. Reject external, protocol-relative, malformed, and unapproved paths. Confirmation/recovery links use the current request origin and must be accepted by the project's exact Auth redirect allowlist.
- Recovery responses do not disclose whether an email address has an account. Passwords, tokens, callback codes, and keys are not logged.
- The public `/demo/**` uses only mock data. The authenticated route tree does not mount the mock provider or render mock wardrobe/outfit records.

## Stage B account-data controls

- All seven public tables have RLS enabled. Owner policies compare `user_id` with `auth.uid()`; the static clothing-category table is authenticated read-only.
- Server Components and Server Actions use the cookie-backed Supabase SSR client. Queries also include the verified user's UUID as a defense-in-depth filter.
- The account UI offers visible Delete actions for clothing items and outfits. Deleting multiple wardrobe pieces is supported in one request (up to 500 IDs) after server-side UUID validation and owner checks. Delete sets `deleted_at` and moves records to a recoverable Archive; restore clears it. The application does not issue direct hard deletes. Archiving a clothing item preserves its outfit links; users may remove outfit-item links when editing an outfit.
- Outfit creation validates that selected items are active and belong to the signed-in user; composite foreign keys prevent cross-owner links in the database.
- Form data is validated server-side. Errors shown to users are generic and do not expose raw database responses.
- Automated tests cover form validation, safe redirects, and the server-side identity guard. They do not yet prove actual two-user RLS isolation against the live project.

## Shared Preview/Production Supabase project

The owner confirmed that Vercel Preview and Production point to the **same Supabase project**. Preview is not environment isolation:

- Preview sign-ups create users in the same Auth system used by Production.
- Auth configuration and rate limits are project-wide.
- The Stage B app can now write account rows from Preview; any rows the owner saves there are in the shared database also used by Production.
- The owner waived the backup step before the schema migration; no restorable backup was verified. No personal account rows have been seeded by the agent.
- Do not use real Production users for multi-user isolation tests. Use dedicated synthetic accounts only after confirming the test plan; avoid creating records on behalf of the owner.
- The implementation does not change the project's Site URL, Auth settings, Vercel environment variables, or Supabase dashboard configuration.

Before inviting additional users or enabling personal-media/AI workflows, revisit Preview/Production data isolation and backup/retention options. RLS protects account ownership but does not separate deployments.

## Deferred media and AI controls

Private Storage and AI are not implemented. Before a separately approved Stage C/AI rollout:

- Use private Storage buckets only. Authorize each object access and issue short-lived access; never expose permanent public image URLs.
- Validate upload MIME type, file signature, dimensions, and size; reject unsupported files and rate-limit expensive operations. Keep originals separate from derived/cleaned images.
- Keep privileged project credentials, AI keys, and other secrets on the server in environment/secret management. Never place them in browser bundles or source control.
- Avoid sensitive image content, full prompts, signed URLs, and secrets in logs. Record operational metadata and safe error categories instead.
- Protect generation endpoints with ownership checks, quotas, idempotency, timeout/error handling, and clear user consent.

## Deletion obligations

Individual clothing items and outfits are archived recoverably by the current app. Account deletion remains a hard Auth-to-database cascade. Private Storage cleanup is not implemented and must be designed with retryable deletion and backup-retention limits before personal images are introduced. Confirm provider-side retention/deletion implications before sending real media to a model.

## Validation status and next gate

The owner confirmed Preview sign-up, email confirmation, sign-in/out, session refresh, the authenticated account entry, and demo separation/navigation using an Auth user. Password recovery returned a Supabase rate-limit response and is deferred at the owner's request.

After the account build deploys to Preview, the owner should test profile save, first garment add/edit/favorite/archive/restore, and outfit create/edit/save/rate/archive. Then verify anonymous access and at least two synthetic users, cross-user reads/writes, and cross-owner outfit-link rejection before broader rollout. Any Preview rows are shared with Production. Vercel build rollback does not reverse database schema or data.
