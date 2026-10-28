-- Permit account owners to permanently delete only archived garments and outfits.
-- Restore remains available until a user explicitly confirms this final action.
BEGIN;

DROP POLICY IF EXISTS clothing_items_owner_all ON public.clothing_items;
DROP POLICY IF EXISTS outfits_owner_all ON public.outfits;

CREATE POLICY clothing_items_owner_select
  ON public.clothing_items FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));
CREATE POLICY clothing_items_owner_insert
  ON public.clothing_items FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY clothing_items_owner_update
  ON public.clothing_items FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY clothing_items_owner_delete_archived
  ON public.clothing_items FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()) AND deleted_at IS NOT NULL);

CREATE POLICY outfits_owner_select
  ON public.outfits FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));
CREATE POLICY outfits_owner_insert
  ON public.outfits FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY outfits_owner_update
  ON public.outfits FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY outfits_owner_delete_archived
  ON public.outfits FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()) AND deleted_at IS NOT NULL);

GRANT DELETE ON TABLE public.clothing_items, public.outfits TO authenticated;

COMMIT;
