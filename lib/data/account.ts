import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAccountContext() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/welcome?error=unavailable");
  return { supabase, user: data.user };
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
