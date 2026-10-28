# Database

**Status:** Stage B initial schema and archived-only permanent-delete policy migration applied and verified on 2026-10-28. Authenticated profile, wardrobe, outfit persistence, and Dark Studio Glass UI are implemented in the branch; owner Preview interaction testing is next.
**Last updated:** 2026-10-28

## Platform and ownership model

Use Supabase Auth and PostgreSQL for the MVP. Supabase Auth owns credentials and authenticated identities; application rows reference the auth UUID. Row Level Security (RLS) is enabled for every user-owned table. Never rely on a client-supplied `user_id` as authorization.

Store image bytes in private Supabase Storage, not database rows. Stage C will separately design object keys, media metadata, private access, replacement, and cleanup. No Storage changes are part of the current schema.

## Applied migration and verification

Read-only inventory performed on 2026-10-20 found no app-owned tables or columns in `public`; the broader non-system relation listing contained only Supabase-managed `auth`, `extensions`, `realtime`, `storage`, and `vault` relations. No row data or Vault secret contents were queried during that inventory.

The existing Supabase project is shared by Vercel Preview and Production. The owner approved the exact SQL, waived the backup step because of the Supabase Free plan, and instructed us to proceed. The migration was applied through the Supabase connector on 2026-10-28:

- Initial migration: `stage_b_initial_schema`, version `20261028162903`.
- Archive-delete migration: `archive_permanent_delete`, version `20261028181050`; it replaces the broad item/outfit owner policies with separate SELECT/INSERT/UPDATE policies and DELETE policies limited to the owner’s archived rows.
- Seven intended `public` tables exist, and RLS is enabled on all seven.
- Thirteen policies are present: four each on clothing items and outfits, one on the other five tables, including authenticated read-only access to active clothing categories.
- Five static category rows were inserted. No demo wardrobe, profile, or outfit records were seeded.
- At post-migration verification, `user_profiles`, `style_preferences`, `wardrobes`, `clothing_items`, `outfits`, and `outfit_items` each had zero rows.
- Authenticated `DELETE` is granted on clothing items and outfits, but RLS permits direct deletion only when `user_id = auth.uid()` and `deleted_at IS NOT NULL`. Active records remain hard-delete-protected; outfit-item links can still be removed by their owner.
- Database and Auth services reported healthy at verification time.

**No restorable backup was verified before the migration; the owner waived that step.** The agent did not insert or modify personal wardrobe/profile/outfit data. Account records are written only when the signed-in user submits the corresponding app form. Preview and Production still share this database.

## Approved schema

- Versioned migration: [`supabase/migrations/20261028162903_stage_b_initial_schema.sql`](../supabase/migrations/20261028162903_stage_b_initial_schema.sql)
- Owner-approved SQL copy: [`STAGE_B_INITIAL_SCHEMA_DRAFT.sql`](STAGE_B_INITIAL_SCHEMA_DRAFT.sql)
- Current app visual: [Dark Studio Glass full-app revamp](assets/stage-b-dark-studio-glass-revamp.png) · [long-press selection and bulk Delete/Restore](assets/stage-b-longpress-selection.png) · [earlier bulk multi-select update](assets/stage-b-bulk-delete.png) · [single-item Delete/Restore](assets/stage-b-recoverable-delete.png) · [account persistence visual](assets/stage-b-account-build.png)
- Applied schema status: [database verification visual](assets/stage-b-schema-live.png)
- Field-by-field overview: [schema detail diagram](assets/stage-b-schema-overview.png)

The migration creates seven tables: `user_profiles`, `style_preferences`, `wardrobes`, `clothing_categories`, `clothing_items`, `outfits`, and `outfit_items`.

### Owner-selected behavior

- Normal Delete moves clothing items and outfits into the recoverable Archive via `deleted_at`; Restore clears it. Soft-archived clothing items retain outfit links and reappear in those outfits when restored.
- The Archive also offers user-confirmed **Delete forever** for archived clothing and outfits only. RLS requires ownership and `deleted_at IS NOT NULL` for hard deletes, so active records cannot be permanently deleted through the authenticated API. Permanently deleting a garment cascades only to its outfit-link rows; permanently deleting an outfit removes its own item-link rows. This cannot be undone.
- Favorite/save/rating state is stored on records: `clothing_items.is_favorite`, and `outfits.is_favorite`, `outfits.is_saved`, and nullable `outfits.rating` (1–5). There are no separate favorite or rating tables.
- There is one wardrobe per user in this initial model. Profiles, preferences, and wardrobe rows are created on demand; there is no Auth signup trigger.
- Account deletion remains a hard cascade from the Supabase Auth user to that user's database rows. Storage cleanup belongs to the later, separately approved Stage C.

### Application persistence implementation

- Protected Server Components use the SSR Supabase client and query only after verifying the current Auth user. Server Actions derive `user_id` from `auth.getUser()`; they never accept a form-supplied owner ID as authorization.
- Reads and writes use the public anon key with the signed-in session; no service-role key is used. RLS is the database authorization boundary, with explicit `user_id` filters for defense in depth.
- The dashboard reads real per-user counts and recent rows. Profile/preferences save on demand. The first clothing item creates the account's one wardrobe if needed.
- Wardrobe items can be added, edited, and favorited. Selection controls stay hidden until the user long-presses a piece (or opens its context menu); the user can then select multiple active pieces (up to 500 per request) and soft-delete them in one owner-scoped update. From Archive, each piece can be restored or permanently deleted after an explicit confirmation. No image field or demo image is used.
- Outfits can be created from verified active items owned by that user, edited, saved/unsaved, favorited, rated, archived/restored, and permanently deleted from Archive after confirmation. Composite foreign keys enforce same-owner outfit/item relationships.
- Permanent-delete actions validate the record UUID, derive the signed-in owner, and require an archived row in the Server Action; database RLS independently enforces owner plus archived-only deletion. The app never permanently deletes an active record.
- The outfit plus its link rows are currently written in separate Supabase requests, not one database transaction. If link creation fails, the app attempts to archive the newly created outfit rather than hard-delete it. An RPC/transaction can be considered if live testing shows it is needed.
- The stylist, try-on, photo-upload, Storage, and AI routes remain explicit deferred states.

## Rollback and verification next steps

A Vercel build number identifies an application deployment; rolling back that build does **not** reverse SQL schema changes or restore database data. A database rollback is a separate operation. Dropping these tables after users add records would permanently delete those records; no destructive rollback was run or prepared.

Next: verify create/edit/favorite, long-press bulk soft-delete, Restore, and outfit-link preservation on Preview. Test **Delete forever** only with disposable synthetic records/accounts, confirming it is blocked for active records and cross-user IDs; permanent garment deletion must remove that garment's outfit links. Preview and Production share this database, so do not use real account records for irreversible-delete tests. Anonymous access and two-user isolation still need live verification. Stage C private photos/Storage, real AI, payments, and Production setting changes remain out of scope.
