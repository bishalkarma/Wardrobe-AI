import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { SignOutForm } from "@/components/sign-out-form";
import { requireAuthenticatedIdentity } from "@/lib/auth/require-auth";
import { SupabaseConfigurationError } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  let identity: string | undefined;
  let authUnavailable = false;

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (!error && user) identity = user.email ?? "Account";
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) {
      redirect("/welcome?error=configuration");
    }
    authUnavailable = true;
  }

  if (authUnavailable) redirect("/welcome?error=unavailable");
  const verifiedIdentity = requireAuthenticatedIdentity(identity, redirect);

  return (
    <AppShell mode="account" identity={verifiedIdentity} signOutControl={<SignOutForm />}>
      {children}
    </AppShell>
  );
}
