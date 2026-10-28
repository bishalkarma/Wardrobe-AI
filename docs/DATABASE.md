# Database

**Status:** Initial Stage B migration applied and verified on 2026-10-28. Authenticated profile, wardrobe, and outfit persistence is implemented in the branch; owner Preview verification is next.
**Last updated:** 2026-10-28

## Platform and ownership model

Use Supabase Auth and PostgreSQL for the MVP. Supabase Auth owns credentials and authenticated identities; application rows reference the auth UUID. Row Level Security (RLS) is enabled for every user-owned table. Never rely on a client-supplied `user_id` as authorization.

Store image bytes in private Supabase Storage, not database rows. Stage C will separately design object keys, media metadata, private access, replacement, and cleanup. No Storage changes are part of the current schema.

## Applied migration and verification

Read-only inventory performed on 2026-10-20 found no app-owned tables or columns in `public`; the broader non-system relation listing contained only Supabase-managed `auth`, `extensions`, `realtime`, `storage`, and `vault` relations. No row data or Vault secret contents were queried during that inventory.

The existing Supabase project is shared by Vercel Preview and Production. The owner approved the exact SQL, waived the backup step because of the Supabase Free plan, and instructed us to proceed. The migration was applied through the Supabase connector on 2026-10-28:

- Migration: `stage_b_initial_schema`
- Supabase migration version: `20261028162903`
- Seven intended `public` tables exist, and RLS is enabled on all seven.
- Seven policies are present: six owner-scoped policies plus authenticated read-only access to active clothing categories.
- Five static category rows were inserted. No demo wardrobe, profile, or outfit records were seeded.
- At post-migration verification, `user_profiles`, `style_preferences`, `wardrobes`, `clothing_items`, `outfits`, and `outfit_items` each had zero rows.
- Authenticated grants match the design: no direct hard-delete grant on clothing items or outfits; deletion is via `deleted_at`. Outfit-item links can be removed by their owner.
- Database and Auth services reported healthy at verification time.

**No restorable backup was verified before the migration; the owner waived that step.** The agent did not insert or modify personal wardrobe/profile/outfit data. Account records are written only when the signed-in user submits the corresponding app form. Preview and Production still share this database.

## Approved schema

- Versioned migration: [`supabase/migrations/20261028162903_stage_b_initial_schema.sql`](../supabase/migrations/20261028162903_stage_b_initial_schema.sql)
- Owner-approved SQL copy: [`STAGE_B_INITIAL_SCHEMA_DRAFT.sql`](STAGE_B_INITIAL_SCHEMA_DRAFT.sql)
- Current account build and next steps: [account persistence visual](assets/stage-b-account-build.png)
- Applied schema status: [database verification visual](assets/stage-b-schema-live.png)
- Field-by-field overview: [schema detail diagram](assets/stage-b-schema-overview.png)

The migration creates seven tables: `user_profiles`, `style_preferences`, `wardrobes`, `clothing_categories`, `clothing_items`, `outfits`, and `outfit_items`.

### Owner-selected behavior

- Clothing items and outfits use recoverable deletion via `deleted_at`. Normal lists exclude deleted rows; restoring sets `deleted_at` back to `NULL`. Soft-deleted items retain their outfit links so a restored item can reappear in those outfits.
- Favorite/save/rating state is stored on records: `clothing_items.is_favorite`, and `outfits.is_favorite`, `outfits.is_saved`, and nullable `outfits.rating` (1–5). There are no separate favorite or rating tables.
- There is one wardrobe per user in this initial model. Profiles, preferences, and wardrobe rows are created on demand; there is no Auth signup trigger.
- Account deletion remains a hard cascade from the Supabase Auth user to that user's database rows. Storage cleanup belongs to the later, separately approved Stage C.

### Application persistence implementation

- Protected Server Components use the SSR Supabase client and query only after verifying the current Auth user. Server Actions derive `user_id` from `auth.getUser()`; they never accept a form-supplied owner ID as authorization.
- Reads and writes use the public anon key with the signed-in session; no service-role key is used. RLS is the database authorization boundary, with explicit `user_id` filters for defense in depth.
- The dashboard reads real per-user counts and recent rows. Profile/preferences save on demand. The first clothing item creates the account's one wardrobe if needed.
- Wardrobe items can be added, edited, favorited, archived, and restored. No image field or demo image is used.
- Outfits can be created from verified active items owned by that user, edited, saved/unsaved, favorited, rated, archived, and restored. Composite foreign keys enforce same-owner outfit/item relationships.
- The outfit plus its link rows are currently written in separate Supabase requests, not one database transaction. If link creation fails, the app attempts to archive the newly created outfit rather than hard-delete it. An RPC/transaction can be considered if live testing shows it is needed.
- The stylist, try-on, photo-upload, Storage, and AI routes remain explicit deferred states.

## Rollback and verification next steps

A Vercel build number identifies an application deployment; rolling back that build does **not** reverse SQL schema changes or restore database data. A database rollback is a separate operation. Dropping these tables after users add records would permanently delete those records; no destructive rollback was run or prepared.

Next: the owner should sign in to the new Preview build using the existing Auth account, save a profile, add a clothing item, then create and update an outfit. Check archive/restore behavior. Before broader rollout, verify anonymous access and at least two synthetic users, cross-user relationship rejection, and that each user sees only their own rows. Preview writes are shared with Production; do not use real Production user records for multi-user tests. Stage C private photos/Storage, real AI, payments, and Production setting changes remain out of scope.
