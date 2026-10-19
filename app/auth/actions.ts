"use server";

import type { AuthError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type { AuthActionState } from "@/lib/auth/action-state";
import { safeRedirectPath } from "@/lib/auth/redirects";
import { getRequestOrigin } from "@/lib/auth/request-origin";
import { SupabaseConfigurationError } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function readEmail(formData: FormData): string {
  return readText(formData, "email").trim();
}

function validEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function configurationFailure(): AuthActionState {
  return {
    status: "error",
    message: "Account access is not configured for this deployment. Please try again later.",
  };
}

function signInError(error: AuthError): string {
  if (error.code === "email_not_confirmed" || /email not confirmed/i.test(error.message)) {
    return "Please confirm your email address using the message we sent, then sign in again.";
  }
  if (error.code === "invalid_credentials" || /invalid login credentials/i.test(error.message)) {
    return "Email or password is incorrect. Check your details and try again.";
  }
  if (error.code?.includes("rate_limit") || /rate limit|too many requests/i.test(error.message)) {
    return "Too many attempts. Wait a little and try again.";
  }
  return "We couldn't sign you in right now. Check your details and try again.";
}

function genericAuthError(error: AuthError): string {
  if (error.code?.includes("rate_limit") || /rate limit|too many requests/i.test(error.message)) {
    return "Too many attempts. Wait a little and try again.";
  }
  return "We couldn't complete that request. Check your details and try again.";
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readEmail(formData);
  const password = readText(formData, "password");
  const nextPath = safeRedirectPath(readText(formData, "next"));

  if (!validEmail(email) || !password) {
    return { status: "error", message: "Enter a valid email address and password." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { status: "error", message: signInError(error) };
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) return configurationFailure();
    return { status: "error", message: "We couldn't reach account access. Please try again." };
  }

  redirect(nextPath);
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readEmail(formData);
  const password = readText(formData, "password");
  const nextPath = safeRedirectPath(readText(formData, "next"));

  if (!validEmail(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }
  if (password.length < 8 || password.length > 128) {
    return { status: "error", message: "Use a password between 8 and 128 characters." };
  }

  let immediateSession = false;
  try {
    const [supabase, origin] = await Promise.all([
      createSupabaseServerClient(),
      getRequestOrigin(),
    ]);
    const callback = new URL("/auth/callback", origin);
    callback.searchParams.set("next", nextPath);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: callback.toString() },
    });
    if (error) return { status: "error", message: genericAuthError(error) };
    immediateSession = Boolean(data.session);
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) return configurationFailure();
    return {
      status: "error",
      message: "We couldn't complete sign-up. Please try again in a moment.",
    };
  }

  // Confirmation is required. A session is only expected if the project is
  // configured to allow immediate sign-in, so do not rely on it for success.
  if (immediateSession) redirect(nextPath);
  return {
    status: "success",
    message: "Check your inbox for a confirmation link. After confirming, return here to sign in.",
  };
}

export async function requestPasswordRecoveryAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readEmail(formData);
  if (!validEmail(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }

  try {
    const [supabase, origin] = await Promise.all([
      createSupabaseServerClient(),
      getRequestOrigin(),
    ]);
    const callback = new URL("/auth/callback", origin);
    callback.searchParams.set("next", "/auth/reset-password");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: callback.toString(),
    });
    if (error) return { status: "error", message: genericAuthError(error) };

    return {
      status: "success",
      message: "If an account matches that address, recovery instructions will arrive by email.",
    };
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) return configurationFailure();
    return {
      status: "error",
      message: "We couldn't send recovery instructions. Please try again later.",
    };
  }
}

export async function completePasswordRecoveryAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = readText(formData, "password");
  const confirmation = readText(formData, "confirmPassword");

  if (password.length < 8 || password.length > 128) {
    return { status: "error", message: "Use a password between 8 and 128 characters." };
  }
  if (password !== confirmation) {
    return { status: "error", message: "Those passwords don't match." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: sessionError } = await supabase.auth.getUser();
    if (sessionError || !user) {
      return {
        status: "error",
        message: "This recovery link has expired or is invalid. Request a new one to continue.",
      };
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { status: "error", message: genericAuthError(error) };
  } catch (error) {
    if (error instanceof SupabaseConfigurationError) return configurationFailure();
    return { status: "error", message: "We couldn't update your password. Request a new recovery link and try again." };
  }

  redirect("/?notice=password-updated");
}

export async function signOutAction(): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) redirect("/welcome?error=signout");
  } catch {
    redirect("/welcome?error=signout");
  }
  redirect("/welcome?notice=signed-out");
}
