"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAccountContext } from "@/lib/data/account";
import { parseProfileForm } from "@/lib/data/validation";

export async function saveProfileAction(formData: FormData): Promise<void> {
  const parsed = parseProfileForm(formData);
  if (!parsed.ok) redirect("/profile?error=invalid");

  const { supabase, user } = await requireAccountContext();
  const { error: profileError } = await supabase.from("user_profiles").upsert({
    user_id: user.id,
    display_name: parsed.value.displayName,
    preferred_units: parsed.value.preferredUnits,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });
  if (profileError) redirect("/profile?error=save");

  const { error: preferencesError } = await supabase.from("style_preferences").upsert({
    user_id: user.id,
    preferred_style: parsed.value.preferredStyle,
    color_palette: parsed.value.colorPalette,
    fit_preference: parsed.value.fitPreference,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });
  if (preferencesError) redirect("/profile?error=save");

  revalidatePath("/");
  revalidatePath("/profile");
  redirect("/profile?notice=profile-saved");
}
