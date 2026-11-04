-- Owner-approved initial schema migration (approved 2026-10-26; applied 2026-10-28).
-- Recorded Supabase migration version: 20261028162903.
-- The owner waived the backup step due to the Supabase Free plan; no restorable
-- backup was verified before applying. A Vercel build does not run or roll back
-- database schema or data.
--
-- Scope: initial relational persistence only. This draft creates new tables
-- in public, leaves all Supabase-managed schemas untouched, and inserts only
-- the five static clothing categories already used by the UI. It does not
-- backfill Auth users, create signup triggers, seed demo wardrobe/outfit rows,
-- add Storage/media tables, or call an AI provider. updated_at defaults on
-- insert; the application must set it on updates (no trigger is installed).
--
-- Review decisions reflected here:
--   * Soft deletion for clothing items and outfits (`deleted_at`).
--   * Favorite/saved/rating state stored as columns: is_favorite on garments
--     and outfits, and is_saved/rating on outfits.
--   * Owner identity is tied to auth.uid() through RLS and composite FKs.
--   * Empty accounts remain empty; profile/preferences/wardrobe rows are
--     created only when the application first needs them.

BEGIN;

CREATE TABLE public.user_profiles (
  user_id uuid PRIMARY KEY DEFAULT auth.uid()
    REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name text,
  preferred_units text NOT NULL DEFAULT 'metric'
    CHECK (preferred_units IN ('metric', 'imperial')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (display_name IS NULL OR char_length(btrim(display_name)) BETWEEN 1 AND 80)
);

CREATE TABLE public.style_preferences (
  user_id uuid PRIMARY KEY DEFAULT auth.uid()
    REFERENCES auth.users (id) ON DELETE CASCADE,
  preferred_style text,
  color_palette text,
  fit_preference text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.wardrobes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid()
    REFERENCES auth.users (id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'My Wardrobe'
    CHECK (char_length(btrim(name)) BETWEEN 1 AND 80),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id),
  UNIQUE (id, user_id)
);

CREATE TABLE public.clothing_categories (
  id text PRIMARY KEY,
  parent_id text REFERENCES public.clothing_categories (id) ON DELETE RESTRICT,
  label text NOT NULL CHECK (char_length(btrim(label)) BETWEEN 1 AND 80),
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true
);

-- Static category catalogue only; these are not sample wardrobe records.
INSERT INTO public.clothing_categories (id, parent_id, label, sort_order) VALUES
  ('tops',        NULL, 'Tops',        10),
  ('bottoms',     NULL, 'Bottoms',     20),
  ('shoes',       NULL, 'Shoes',       30),
  ('outerwear',   NULL, 'Outerwear',   40),
  ('accessories', NULL, 'Accessories', 50);

CREATE TABLE public.clothing_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid()
    REFERENCES auth.users (id) ON DELETE CASCADE,
  wardrobe_id uuid NOT NULL,
  category_id text NOT NULL
    REFERENCES public.clothing_categories (id) ON DELETE RESTRICT,
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 120),
  subcategory text,
  color text,
  pattern text,
  material text,
  fit text,
  season text[] NOT NULL DEFAULT ARRAY[]::text[],
  formality text,
  occasions text[] NOT NULL DEFAULT ARRAY[]::text[],
  brand text,
  notes text,
  is_favorite boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, user_id),
  FOREIGN KEY (wardrobe_id, user_id)
    REFERENCES public.wardrobes (id, user_id) ON DELETE CASCADE
);

CREATE TABLE public.outfits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid()
    REFERENCES auth.users (id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 120),
  occasion text,
  style text,
  reason text,
  is_favorite boolean NOT NULL DEFAULT false,
  is_saved boolean NOT NULL DEFAULT false,
  rating smallint CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, user_id)
);

CREATE TABLE public.outfit_items (
  user_id uuid NOT NULL DEFAULT auth.uid()
    REFERENCES auth.users (id) ON DELETE CASCADE,
  outfit_id uuid NOT NULL,
  clothing_item_id uuid NOT NULL,
  slot text,
  position smallint NOT NULL DEFAULT 0 CHECK (position >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (outfit_id, clothing_item_id),
  UNIQUE (outfit_id, position),
  FOREIGN KEY (outfit_id, user_id)
    REFERENCES public.outfits (id, user_id) ON DELETE CASCADE,
  FOREIGN KEY (clothing_item_id, user_id)
    REFERENCES public.clothing_items (id, user_id) ON DELETE CASCADE
);

CREATE INDEX clothing_items_owner_active_idx
  ON public.clothing_items (user_id, wardrobe_id, created_at DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX outfits_owner_active_idx
  ON public.outfits (user_id, created_at DESC)
  WHERE deleted_at IS NULL;
CREATE INDEX outfit_items_owner_idx
  ON public.outfit_items (user_id, outfit_id);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.style_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wardrobes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clothing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clothing_categories ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE
  public.user_profiles,
  public.style_preferences,
  public.wardrobes,
  public.clothing_items,
  public.outfits,
  public.outfit_items
FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE ON TABLE
  public.user_profiles,
  public.style_preferences,
  public.wardrobes,
  public.clothing_items,
  public.outfits
TO authenticated;

-- Link rows may be removed when a user edits outfit composition. Clothing
-- items and outfits have no direct authenticated DELETE grant: callers must
-- use deleted_at so those records can be restored.
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.outfit_items TO authenticated;

REVOKE ALL ON TABLE public.clothing_categories FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.clothing_categories TO authenticated;

CREATE POLICY user_profiles_owner_all ON public.user_profiles
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY style_preferences_owner_all ON public.style_preferences
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY wardrobes_owner_all ON public.wardrobes
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY clothing_items_owner_all ON public.clothing_items
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY outfits_owner_all ON public.outfits
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY outfit_items_owner_all ON public.outfit_items
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY clothing_categories_authenticated_read ON public.clothing_categories
  FOR SELECT TO authenticated
  USING (is_active);

COMMENT ON TABLE public.user_profiles IS 'User-owned profile fields; created on demand, not by an Auth trigger.';
COMMENT ON TABLE public.style_preferences IS 'User-owned style preferences; created on demand.';
COMMENT ON TABLE public.wardrobes IS 'One user-owned wardrobe container; created on first wardrobe write.';
COMMENT ON TABLE public.clothing_categories IS 'Shared category catalogue; authenticated users can read active rows only.';
COMMENT ON TABLE public.clothing_items IS 'User-owned garment metadata; no photo or Storage fields in this stage.';
COMMENT ON TABLE public.outfits IS 'User-owned outfits; is_saved, is_favorite, and rating are columns; deleted_at supports restore.';
COMMENT ON TABLE public.outfit_items IS 'Outfit-to-garment links constrained to the same owner.';

COMMIT;
