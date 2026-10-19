# Security and Privacy

**Status:** Stage A Auth code implemented; shared-project Preview testing pending. No application database or personal media is connected.
**Last updated:** 2026-10-19

## Data classification

Profile photos, body images, wardrobe photos, generated try-on images, account identifiers, and style preferences are private user data. Treat them as sensitive even when a user chooses to share them with a requested AI operation.

## Stage A controls

- Use Supabase email/password Auth. Email confirmation is required for new accounts.
- Use only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for the SSR client. These values are not authorization controls. Stage A does not read or use `SUPABASE_SERVICE_ROLE_KEY`.
- Store the session in SSR cookies using `@supabase/ssr`. Cookies are host-only, `HttpOnly`, `SameSite=Lax`, and `Secure` in production. The Next.js request proxy refreshes sessions; protected server layouts also verify identity with Auth `getUser()`.
- Keep sign-up, sign-in, recovery, password update, and sign-out operations in same-origin server actions/handlers. Never trust a user ID from a form or browser state as proof of identity.
- Allow only safe internal post-auth destinations. Reject external, protocol-relative, malformed, and unapproved paths. Confirmation/recovery links use the current request origin and must be accepted by the project's exact Auth redirect allowlist.
- Recovery responses do not disclose whether an email address has an account. Passwords, tokens, callback codes, and keys are not logged.
- The public `/demo/**` uses only mock data. The authenticated route tree does not mount the mock provider or render mock wardrobe/outfit records.

## Shared Preview/Production Auth project

The owner confirmed that Vercel Preview and Production point to the **same Supabase project**. This is shared Auth, not environment isolation:

- A Preview sign-up creates a user in the same Auth system used by Production.
- Confirmation and password-recovery email behavior is project-wide; callback allowlist changes apply to both environments.
- Preview testing must use dedicated synthetic test accounts. Do not use real Production users or claim Preview accounts are isolated.
- Stage A creates no application database tables and no Storage objects. Auth user records and email activity are still writes to the shared project.
- The application does not change the project's Site URL or Auth settings. The callback route passes an explicit redirect URL. The existing allowlist and email configuration were confirmed by the owner but were not independently inspected in the dashboard.

Before enabling database writes or personal-photo uploads, prefer using the other existing Supabase project as a non-production environment if one is available. Do not assume row ownership RLS alone separates Preview from Production.

## Required controls for later data/media stages

- Enable PostgreSQL RLS on every user-owned table and enforce owner checks for reads, inserts, updates, and deletes. Derive ownership from a verified session, not a request body.
- Add same-owner relational constraints for outfits, garments, and media references; test with at least two users and anonymous access.
- Use private Storage buckets only. Authorize each object access and issue short-lived access; never expose permanent public image URLs.
- Validate upload MIME type, actual file signature, dimensions, and size; reject unsupported files and rate-limit expensive operations. Keep originals separate from derived/cleaned images.
- Keep privileged project credentials, AI keys, and other secrets on the server in environment/secret management. Never place them in browser bundles or source control.
- Avoid sensitive image content, full prompts, signed URLs, and secrets in logs. Record operational metadata and safe error categories instead.
- Protect future generation endpoints with ownership checks, quotas, idempotency, and timeout/error handling.

## Deletion obligations

Provide deletion workflows for individual clothing items and their original/processed images, profile photos, generated images, and accounts. Account deletion must coordinate database cleanup and private-storage object cleanup, handle retries, and define backup-retention limits. Confirm provider-side retention/deletion implications before sending real media to a model.

## Stage A validation status

Automated tests cover internal redirect validation and the server-side identity guard. They do not exercise real Supabase email delivery. Live Preview testing must confirm sign-up, email confirmation, session refresh, sign-out, and recovery using a synthetic account in the shared Auth system.
