"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAccountContext } from "@/lib/data/account";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isUuid, parseClothingForm } from "@/lib/data/validation";

type ServerSupabase = Awaited<ReturnType<typeof createSupabaseServerClient>>;

function field(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function getOrCreateWardrobeId(supabase: ServerSupabase, userId: string): Promise<string | null> {
  const { data: existing, error: lookupError } = await supabase
    .from("wardrobes")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (lookupError) return null;
  if (existing?.id) return existing.id;

  const { data: created, error: createError } = await supabase
    .from("wardrobes")
    .insert({ user_id: userId, name: "My Wardrobe" })
    .select("id")
    .single();
  if (!createError && created?.id) return created.id;

  // If another request created the one-per-user wardrobe first, reuse it.
  const { data: afterRace, error: retryError } = await supabase
    .from("wardrobes")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (!retryError && afterRace?.id) return afterRace.id;
  return null;
}

export async function saveClothingItemAction(formData: FormData): Promise<void> {
  const parsed = parseClothingForm(formData);
  const itemId = field(formData, "itemId");
  const returnPath = itemId && isUuid(itemId) ? `/wardrobe/${itemId}/edit` : "/wardrobe/new";
  if (!parsed.ok || (itemId && !isUuid(itemId))) redirect(`${returnPath}?error=invalid`);

  const { supabase, user } = await requireAccountContext();
  const { data: category, error: categoryError } = await supabase
    .from("clothing_categories")
    .select("id")
    .eq("id", parsed.value.categoryId)
    .eq("is_active", true)
    .maybeSingle();
  if (categoryError) redirect(`${returnPath}?error=unavailable`);
  if (!category) redirect(`${returnPath}?error=invalid`);

  const values = {
    category_id: parsed.value.categoryId,
    name: parsed.value.name,
    subcategory: parsed.value.subcategory,
    color: parsed.value.color,
    pattern: parsed.value.pattern,
    material: parsed.value.material,
    fit: parsed.value.fit,
    season: parsed.value.season,
    formality: parsed.value.formality,
    occasions: parsed.value.occasions,
    brand: parsed.value.brand,
    notes: parsed.value.notes,
    updated_at: new Date().toISOString(),
  };

  if (itemId) {
    const { data, error } = await supabase
      .from("clothing_items")
      .update(values)
      .eq("id", itemId)
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .select("id")
      .maybeSingle();
    if (error) redirect(`${returnPath}?error=save`);
    if (!data) redirect("/wardrobe?error=missing");

    revalidatePath("/");
    revalidatePath("/wardrobe");
    revalidatePath("/outfits");
    revalidatePath(`/wardrobe/${itemId}`);
    redirect(`/wardrobe/${itemId}?notice=item-updated`);
  }

  const wardrobeId = await getOrCreateWardrobeId(supabase, user.id);
  if (!wardrobeId) redirect(`${returnPath}?error=save`);

  const { data, error } = await supabase
    .from("clothing_items")
    .insert({ ...values, user_id: user.id, wardrobe_id: wardrobeId })
    .select("id")
    .single();
  if (error || !data) redirect(`${returnPath}?error=save`);

  revalidatePath("/");
  revalidatePath("/wardrobe");
  revalidatePath("/outfits");
  redirect(`/wardrobe/${data.id}?notice=item-added`);
}

export async function toggleItemFavoriteAction(formData: FormData): Promise<void> {
  const itemId = field(formData, "itemId");
  const nextValue = field(formData, "nextValue");
  if (!isUuid(itemId) || !["true", "false"].includes(nextValue)) redirect("/wardrobe?error=invalid");

  const { supabase, user } = await requireAccountContext();
  const { data, error } = await supabase
    .from("clothing_items")
    .update({ is_favorite: nextValue === "true", updated_at: new Date().toISOString() })
    .eq("id", itemId)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();
  if (error) redirect("/wardrobe?error=save");
  if (!data) redirect("/wardrobe?error=missing");

  revalidatePath("/");
  revalidatePath("/wardrobe");
  redirect("/wardrobe?notice=item-state-saved");
}

export async function archiveItemAction(formData: FormData): Promise<void> {
  const itemId = field(formData, "itemId");
  if (!isUuid(itemId)) redirect("/wardrobe?error=invalid");

  const { supabase, user } = await requireAccountContext();
  const { data, error } = await supabase
    .from("clothing_items")
    .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", itemId)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();
  if (error) redirect("/wardrobe?error=save");
  if (!data) redirect("/wardrobe?error=missing");

  revalidatePath("/");
  revalidatePath("/wardrobe");
  revalidatePath("/outfits");
  redirect("/wardrobe?view=trash&notice=item-archived");
}

export async function restoreItemAction(formData: FormData): Promise<void> {
  const itemId = field(formData, "itemId");
  if (!isUuid(itemId)) redirect("/wardrobe?view=trash&error=invalid");

  const { supabase, user } = await requireAccountContext();
  const { data, error } = await supabase
    .from("clothing_items")
    .update({ deleted_at: null, updated_at: new Date().toISOString() })
    .eq("id", itemId)
    .eq("user_id", user.id)
    .not("deleted_at", "is", null)
    .select("id")
    .maybeSingle();
  if (error) redirect("/wardrobe?view=trash&error=save");
  if (!data) redirect("/wardrobe?view=trash&error=missing");

  revalidatePath("/");
  revalidatePath("/wardrobe");
  revalidatePath("/outfits");
  redirect("/wardrobe?notice=item-restored");
}
