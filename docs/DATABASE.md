# Database

**Status:** Approved platform direction; logical schema proposal only. No database or migrations are created in Phase 1.  
**Last updated:** 2026-10-07

## Platform and ownership model

Use Supabase Auth and PostgreSQL for the MVP unless implementation reveals a concrete blocker. Supabase Auth owns credentials and authenticated identities; application profile rows reference the auth UUID. PostgreSQL Row Level Security (RLS) is required for user-owned rows. Never rely on a client-supplied `user_id` as authorization.

Store image bytes in private Supabase Storage buckets, not database rows. Store object keys and media metadata in PostgreSQL; do not store permanent public URLs. Access to private media should be authorized and short-lived.

## Proposed logical entities

- `user_profiles`: one row per auth user; display/profile-photo references, units, timestamps, and deletion state.
- `style_preferences`: user-owned preferences and their update time.
- `wardrobes`: user-owned wardrobe container; start with one default wardrobe per user while allowing future expansion.
- `clothing_categories`: extensible category/subcategory tree (tops, bottoms, shoes, outerwear, accessories, and future additions).
- `clothing_items`: owner, wardrobe, category, editable classification fields, colors, pattern, material/fit/formality/season/occasion where known, optional brand/notes, favorite state, AI-review state, timestamps, and soft-delete state.
- `media_assets`: owner, private storage key, asset role, MIME type, dimensions, checksum, source/derivative relationship, lifecycle state, and timestamps. Roles distinguish original garment, processed garment, profile photo, and generated image.
- `clothing_images`: links a clothing item to its original and optional processed image assets.
- `profile_photos`: links profile-photo history/current selection to private assets.
- `outfits`: owner, occasion, style, rationale, save state, and timestamps.
- `outfit_items`: outfit-to-clothing-item relationships with slot/order; selected IDs must refer to active items belonging to the same owner.
- `outfit_generations`: generation job fields and output media reference.
- `outfit_favorites` and `outfit_ratings`: owner-scoped saved/favorite and rating relationships.
- `ai_requests`: per-operation provider/model, status, duration, input/output references or safe hashes, usage, estimated cost, error category, and timestamps where available.

Notifications and analytics rollups are deferred. Per-request usage is sufficient to begin; aggregates can be derived later.

## RLS and relationship requirements

- Enable RLS on every user-owned table before real data is introduced.
- Policies use the authenticated Supabase user identity and enforce ownership for reads, inserts, updates, and deletes.
- Validate ownership across relationships, not just on the parent row. An outfit cannot reference another user's clothing item; a media association cannot cross users.
- Service-role credentials are server-only. The service role must not be used as a reason to skip application-level owner checks.
- Test policies using at least two users and anonymous requests before launch.

## Deletion and image lifecycle

Preserve original garment images when generating processed derivatives. Deleting an item/profile image/generated result must remove or schedule removal of its associated private object(s) and references. Account deletion needs a retryable cleanup workflow for database rows and all owned storage objects; define backup-retention behavior before production. Soft deletion may help recovery, but it must not accidentally leave media accessible.

## Phase 2 schema review

Before migrations, confirm category values, whether clothing favorites are a column or relation, retention/soft-delete behavior, composite ownership constraints, and the exact Supabase storage policy design. The current document is a logical starting point, not an implemented or frozen schema.
