# Database

**Status:** Initial Stage B SQL is owner-approved and versioned as a migration, but has **not** been applied. No database write has occurred.
**Last updated:** 2026-10-26

## Platform and ownership model

Use Supabase Auth and PostgreSQL for the MVP. Supabase Auth owns credentials and authenticated identities; application rows reference the auth UUID. Row Level Security (RLS) is required for every user-owned table. Never rely on a client-supplied `user_id` as authorization.

Store image bytes in private Supabase Storage, not database rows. Stage C will separately design object keys, media metadata, private access, replacement, and cleanup. No Storage changes are part of the current migration.

## Inventory and safety boundary

Read-only inventory performed on 2026-10-20 found no app-owned tables or columns in `public`; the broader non-system relation listing contained only Supabase-managed `auth`, `extensions`, `realtime`, `storage`, and `vault` relations. No row data or Vault secret contents were queried.

The existing Supabase project is shared by Vercel Preview and Production. The owner approved the exact SQL on 2026-10-26 and waived the backup step because the Supabase Free plan does not provide the desired backup option. **No restorable backup/export has been created or verified, and no DDL or data writes have occurred.** The agent has no Supabase database access, so the migration below is prepared but not executed.

## Approved initial schema

- Versioned migration: [`supabase/migrations/20261026000000_stage_b_initial_schema.sql`](../supabase/migrations/20261026000000_stage_b_initial_schema.sql)
- Owner-approved SQL copy: [`STAGE_B_INITIAL_SCHEMA_DRAFT.sql`](STAGE_B_INITIAL_SCHEMA_DRAFT.sql)
- Current handoff: [approved migration and next steps](assets/stage-b-migration-handoff.png)
- Field-by-field schema diagram from the earlier review: [schema overview](assets/stage-b-schema-overview.png)

The migration creates seven tables: `user_profiles`, `style_preferences`, `wardrobes`, `clothing_categories`, `clothing_items`, `outfits`, and `outfit_items`. It inserts only five static clothing categories; it does not seed demo wardrobe, profile, or outfit records. New accounts remain empty until the user adds data.

### Owner-selected behavior

- Clothing items and outfits use recoverable deletion via `deleted_at`. Normal lists must exclude deleted rows; restoring sets `deleted_at` back to `NULL`. Soft-deleted items retain their outfit links so a restored item can reappear in those outfits.
- Favorite/save/rating state is stored on records: `clothing_items.is_favorite`, and `outfits.is_favorite`, `outfits.is_saved`, and nullable `outfits.rating` (1–5). There are no separate favorite or rating tables.
- There is one wardrobe per user in this initial model. Profiles, preferences, and wardrobe rows are created on demand; there is no Auth signup trigger.
- Account deletion remains a hard cascade from the Supabase Auth user to the user's database rows. Storage cleanup belongs to the later, separately approved Stage C.

### Security and integrity

- RLS is enabled for every owner table. Owner policies compare the row's `user_id` with `auth.uid()` for reads and writes.
- The migration revokes `PUBLIC`, `anon`, and `authenticated` table grants, then grants owner-scoped privileges as needed to `authenticated`; the shared category catalogue is authenticated read-only. It does not alter table-owner/service-role privileges. Authenticated users have no direct hard-delete privilege on clothing items or outfits; those records are retired/restored through `deleted_at`.
- Composite foreign keys prevent wardrobe, outfit, and garment links from crossing account ownership.
- `updated_at` has a default on insert but no trigger; application updates must set it.

## Apply and rollback status

The owner has instructed us to proceed, but this workspace has no database/dashboard access. The migration is committed as code only; neither Vercel nor a Git build automatically runs it. The owner will need to apply it through the chosen Supabase migration workflow or SQL Editor, then verify the seven tables and RLS policies before application persistence is connected.

After applying, these read-only checks can confirm the tables and policies:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'user_profiles', 'style_preferences', 'wardrobes',
    'clothing_categories', 'clothing_items', 'outfits', 'outfit_items'
  )
order by table_name;

select tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
  and tablename in (
    'user_profiles', 'style_preferences', 'wardrobes',
    'clothing_categories', 'clothing_items', 'outfits', 'outfit_items'
  )
order by tablename, policyname;
```

**Important:** a Vercel build number identifies an application deployment; rolling back that build does **not** reverse SQL schema changes or database data. A database rollback is a separate database operation. Dropping these tables after users have added records would permanently delete those records, so no automatic destructive rollback is included. Use a reviewed database rollback/forward-fix plan and retain the no-backup risk in mind.

After application, test anonymous access and at least two synthetic authenticated users, cross-user relationship rejection, create/update/soft-delete/restore flows, and account cleanup. Stage C private photos/Storage, real AI, payments, and Production setting changes remain out of scope.
