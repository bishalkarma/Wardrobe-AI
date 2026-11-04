import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// React's request-scoped cache shares this verified auth lookup between the
// authenticated layout and the leaf page, avoiding a second Supabase round-trip.
export const getAccountContext = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  return { supabase, user: error ? null : data.user, error };
});

export async function requireAccountContext() {
  const context = await getAccountContext();
  if (context.error || !context.user) redirect("/welcome?error=unavailable");
  return { supabase: context.supabase, user: context.user };
}

export function greetingName(displayName: string | null | undefined, email: string | undefined): string {
  const name = displayName?.trim();
  if (name) return name;
  const localPart = email?.split("@")[0]?.replace(/[._-]+/g, " ").trim();
  if (!localPart) return "there";
  return localPart.replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently added";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}
