# Security and Privacy

**Status:** Requirements approved; Phase 1 is mock-only and has no real user data.
**Last updated:** 2026-10-07

## Data classification

Profile photos, body images, wardrobe photos, generated try-on images, account identifiers, and style preferences are private user data. Treat them as sensitive even when a user chooses to share them with a requested AI operation.

## Required controls for real integrations

- Use Supabase Auth; do not implement custom password handling without a documented technical blocker and approval.
- Enforce PostgreSQL RLS and application-level ownership checks. Derive the user identity from the verified session, not a request body.
- Use private storage buckets only. Authorize each object access and issue short-lived access where applicable; never expose storage credentials or permanent public image URLs.
- Validate upload MIME type, actual file signature, dimensions, and size; reject unsupported files and rate-limit expensive operations. Keep original images separate from derived/cleaned images.
- Keep Supabase service-role credentials, AI keys, and other secrets on the server in environment/secret management. Never place them in browser bundles or source control.
- Transmit only the minimum necessary private images/metadata to an AI provider after the user requests the relevant operation. Verify provider retention and training terms before selection.
- Avoid sensitive image content, full prompts, signed URLs, and secrets in logs. Record operational metadata and safe error categories instead.
- Protect generation endpoints with ownership checks, quotas, idempotency, and timeout/error handling.

## Deletion obligations

Provide deletion workflows for individual clothing items and their original/processed images, profile photos, generated images, and accounts. Account deletion must coordinate database cleanup and private-storage object cleanup, handle retries, and define backup-retention limits. Confirm provider-side retention/deletion implications before sending real media to a model.

## Phase 1 safeguards

The current UI uses only local, illustrative mock data and generated editorial assets in the public static bundle. These images are not user media. There is no login, real file upload, remote image bucket, AI request, tracking SDK, secret, or persistent personal information. Mock “delete” and “save” controls only change in-memory prototype state; they are not represented as secure persisted operations.

## Pre-Phase-2 security checklist

1. Approve deployment region, retention, and privacy/consent copy.
2. Configure Supabase Auth, RLS, and private-bucket policies.
3. Test cross-user access denial and anonymous access denial.
4. Test upload validation, ownership, rate limits, and deletion cleanup.
5. Review provider terms and data handling before enabling any AI path.
6. Add automated security tests and operational alerting before production.
