"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAccountContext } from "@/lib/data/account";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isUuid, parseOutfitForm } from "@/lib/data/validation";

type ServerSupabase = Awaited<ReturnType<typeof createSupabaseServerClient>>;

function field(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function ownedActiveItemIds(supabase: ServerSupabase, userId: string, ids: string[]) {
  const { data, error } = await supabase
    .from("clothing_items")
    .select("id")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .in("id", ids);
  if (error || !data || data.length !== ids.length) return null;
  return data.map((item) => item.id as string);
}

export async function createOutfitAction(formData: FormData): Promise<void> {
  const parsed = parseOutfitForm(formData);
  if (!parsed.ok || parsed.value.id) redirect("/outfits/new?error=invalid");

  const { supabase, user } = await requireAccountContext();
  const validItemIds = await ownedActiveItemIds(supabase, user.id, parsed.value.itemIds);
  if (!validItemIds) redirect("/outfits/new?error=items");

  const { data: outfit, error: outfitError } = await supabase
    .from("outfits")
    .insert({
      user_id: user.id,
      name: parsed.value.name,
      occasion: parsed.value.occasion,
      style: parsed.value.style,
      reason: parsed.value.reason,
      is_saved: true,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (outfitError || !outfit) redirect("/outfits/new?error=save");

  const links = validItemIds.map((clothingItemId, position) => ({
    user_id: user.id,
    outfit_id: outfit.id,
    clothing_item_id: clothingItemId,
    position,
  }));
  const { error: linkError } = await supabase.from("outfit_items").insert(links);
  if (linkError) {
    // Outfits have recoverable deletion only; do not attempt a hard delete.
    await supabase.from("outfits").update({ deleted_at: new Date().toISOString() }).eq("id", outfit.id).eq("user_id", user.id);
    redirect("/outfits/new?error=save");
  }

  revalidatePath("/");
  revalidatePath("/outfits");
  redirect(`/outfits/${outfit.id}?notice=outfit-added`);
}

export async function updateOutfitAction(formData: FormData): Promise<void> {
  const parsed = parseOutfitForm(formData);
  const outfitId = parsed.ok ? parsed.value.id : field(formData, "outfitId");
  const returnPath = outfitId && isUuid(outfitId) ? `/outfits/${outfitId}` : "/outfits";
  if (!parsed.ok || !outfitId || !isUuid(outfitId)) redirect(`${returnPath}?error=invalid`);

  const { supabase, user } = await requireAccountContext();
  const { data: outfit, error: outfitError } = await supabase
    .from("outfits")
    .select("id")
    .eq("id", outfitId)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();
  if (outfitError) redirect(`${returnPath}?error=save`);
  if (!outfit) redirect("/outfits?error=missing");

  const validItemIds = await ownedActiveItemIds(supabase, user.id, parsed.value.itemIds);
  if (!validItemIds) redirect(`${returnPath}?error=items`);

  const { data: oldLinks, error: linksError } = await supabase
    .from("outfit_items")
    .select("clothing_item_id, position")
    .eq("user_id", user.id)
    .eq("outfit_id", outfitId);
  if (linksError || !oldLinks) redirect(`${returnPath}?error=save`);

  const oldIds = oldLinks.map((link) => link.clothing_item_id as string);
  const { data: linkedItems, error: linkedItemsError } = oldIds.length
    ? await supabase.from("clothing_items").select("id, deleted_at").eq("user_id", user.id).in("id", oldIds)
    : { data: [], error: null };
  if (linkedItemsError || !linkedItems) redirect(`${returnPath}?error=save`);

  // Keep links to archived pieces so restoring a garment restores its outfit context.
  const archivedIds = linkedItems.filter((item) => item.deleted_at !== null).map((item) => item.id as string);
  const targetIds = [...new Set([...validItemIds, ...archivedIds])];
  const oldIdSet = new Set(oldIds);
  const additions = targetIds.filter((id) => !oldIdSet.has(id));
  const positions = oldLinks.map((link) => Number(link.position) || 0);
  let nextPosition = positions.length ? Math.max(...positions) + 1 : 0;

  if (additions.length) {
    const { error: addError } = await supabase.from("outfit_items").insert(additions.map((clothingItemId) => ({
      user_id: user.id,
      outfit_id: outfitId,
      clothing_item_id: clothingItemId,
      position: nextPosition++,
    })));
    if (addError) redirect(`${returnPath}?error=save`);
  }

  const targetSet = new Set(targetIds);
  const removals = oldIds.filter((id) => !targetSet.has(id));
  if (removals.length) {
    const { error: removeError } = await supabase
      .from("outfit_items")
      .delete()
      .eq("user_id", user.id)
      .eq("outfit_id", outfitId)
      .in("clothing_item_id", removals);
    if (removeError) redirect(`${returnPath}?error=save`);
  }

  const { error: updateError } = await supabase
    .from("outfits")
    .update({
      name: parsed.value.name,
      occasion: parsed.value.occasion,
      style: parsed.value.style,
      reason: parsed.value.reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", outfitId)
    .eq("user_id", user.id)
    .is("deleted_at", null);
  if (updateError) redirect(`${returnPath}?error=save`);

  revalidatePath("/");
  revalidatePath("/outfits");
  revalidatePath(`/outfits/${outfitId}`);
  redirect(`${returnPath}?notice=outfit-updated`);
}

export async function setOutfitStateAction(formData: FormData): Promise<void> {
  const outfitId = field(formData, "outfitId");
  const stateKey = field(formData, "stateKey");
  const nextValue = field(formData, "nextValue");
  if (!isUuid(outfitId) || !["is_favorite", "is_saved"].includes(stateKey) || !["true", "false"].includes(nextValue)) {
    redirect("/outfits?error=invalid");
  }

  const { supabase, user } = await requireAccountContext();
  const patch = stateKey === "is_favorite" ? { is_favorite: nextValue === "true" } : { is_saved: nextValue === "true" };
  const { data, error } = await supabase
    .from("outfits")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", outfitId)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();
  if (error) redirect(`/outfits/${outfitId}?error=save`);
  if (!data) redirect("/outfits?error=missing");

  revalidatePath("/");
  revalidatePath("/outfits");
  revalidatePath(`/outfits/${outfitId}`);
  redirect(`/outfits/${outfitId}?notice=outfit-state-saved`);
}

export async function setOutfitRatingAction(formData: FormData): Promise<void> {
  const outfitId = field(formData, "outfitId");
  const value = field(formData, "rating");
  const rating = value === "" ? null : Number(value);
  if (!isUuid(outfitId) || (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5))) {
    redirect("/outfits?error=invalid");
  }

  const { supabase, user } = await requireAccountContext();
  const { data, error } = await supabase
    .from("outfits")
    .update({ rating, updated_at: new Date().toISOString() })
    .eq("id", outfitId)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();
  if (error) redirect(`/outfits/${outfitId}?error=save`);
  if (!data) redirect("/outfits?error=missing");

  revalidatePath("/");
  revalidatePath("/outfits");
  revalidatePath(`/outfits/${outfitId}`);
  redirect(`/outfits/${outfitId}?notice=outfit-state-saved`);
}

export async function archiveOutfitAction(formData: FormData): Promise<void> {
  const outfitId = field(formData, "outfitId");
  if (!isUuid(outfitId)) redirect("/outfits?error=invalid");

  const { supabase, user } = await requireAccountContext();
  const { data, error } = await supabase
    .from("outfits")
    .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", outfitId)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();
  if (error) redirect(`/outfits/${outfitId}?error=save`);
  if (!data) redirect("/outfits?error=missing");

  revalidatePath("/");
  revalidatePath("/outfits");
  redirect("/outfits?view=trash&notice=outfit-archived");
}

export async function restoreOutfitAction(formData: FormData): Promise<void> {
  const outfitId = field(formData, "outfitId");
  if (!isUuid(outfitId)) redirect("/outfits?view=trash&error=invalid");

  const { supabase, user } = await requireAccountContext();
  const { data, error } = await supabase
    .from("outfits")
    .update({ deleted_at: null, updated_at: new Date().toISOString() })
    .eq("id", outfitId)
    .eq("user_id", user.id)
    .not("deleted_at", "is", null)
    .select("id")
    .maybeSingle();
  if (error) redirect("/outfits?view=trash&error=save");
  if (!data) redirect("/outfits?view=trash&error=missing");

  revalidatePath("/");
  revalidatePath("/outfits");
  redirect("/outfits?notice=outfit-restored");
}
