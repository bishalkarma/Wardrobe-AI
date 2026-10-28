# Database

**Status:** Initial Stage B migration applied and verified on 2026-10-28. Application persistence is not implemented yet.
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
- `user_profiles`, `style_preferences`, `wardrobes`, `clothing_items`, `outfits`, and `outfit_items` each have zero rows.
- Authenticated grants match the design: no direct hard-delete grant on clothing items or outfits; deletion is via `deleted_at`. Outfit-item links can be removed by their owner.
- Database and Auth services reported healthy at verification time.

**No restorable backup was verified before the migration; the owner waived that step.** No personal wardrobe/profile/outfit data was inserted or changed. The migration is live, but app pages still use placeholders and no application persistence code has been connected.

## Approved schema

- Versioned migration: [`supabase/migrations/20261028162903_stage_b_initial_schema.sql`](../supabase/migrations/20261028162903_stage_b_initial_schema.sql)
- Owner-approved SQL copy: [`STAGE_B_INITIAL_SCHEMA_DRAFT.sql`](STAGE_B_INITIAL_SCHEMA_DRAFT.sql)
- Current status and next steps: [applied schema visual](assets/stage-b-schema-live.png)
- Earlier field-by-field overview: [schema detail diagram](assets/stage-b-schema-overview.png)

The migration creates seven tables: `user_profiles`, `style_preferences`, `wardrobes`, `clothing_categories`, `clothing_items`, `outfits`, and `outfit_items`.

### Owner-selected behavior

- Clothing items and outfits use recoverable deletion via `deleted_at`. Normal lists must exclude deleted rows; restoring sets `deleted_at` back to `NULL`. Soft-deleted items retain their outfit links so a restored item can reappear in those outfits.
- Favorite/save/rating state is stored on records: `clothing_items.is_favorite`, and `outfits.is_favorite`, `outfits.is_saved`, and nullable `outfits.rating` (1–5). There are no separate favorite or rating tables.
- There is one wardrobe per user in this initial model. Profiles, preferences, and wardrobe rows are created on demand; there is no Auth signup trigger.
- Account deletion remains a hard cascade from the Supabase Auth user to that user's database rows. Storage cleanup belongs to the later, separately approved Stage C.

### Security and integrity

- Each owner row references `auth.users` and has a `user_id`; RLS policies compare it with `auth.uid()`.
- Composite foreign keys prevent wardrobe, outfit, and garment links from crossing account ownership.
- The shared category catalogue is authenticated read-only; no demo data is mixed into account tables.
- `updated_at` has a default on insert but no trigger; application updates must set it.

## Rollback and next steps

A Vercel build number identifies an application deployment; rolling back that build does **not** reverse SQL schema changes or restore database data. A database rollback is a separate operation. Dropping these tables after users add records would permanently delete those records; no destructive rollback was run or prepared.

Next, implement authenticated application reads/writes for profiles, wardrobes, clothing items, and outfits. Before broader rollout, test anonymous access and at least two synthetic authenticated users, cross-user relationship rejection, create/update/soft-delete/restore flows, and account cleanup. Stage C private photos/Storage, real AI, payments, and Production setting changes remain out of scope.
