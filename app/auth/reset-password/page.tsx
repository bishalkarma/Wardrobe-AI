import Link from "next/link";
import { AuthFlowPage } from "@/components/auth/auth-flow-page";
import { PasswordResetForm } from "@/components/auth/password-reset-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SupabaseConfigurationError } from "@/lib/supabase/config";

export default async function ResetPasswordPage() {
  let recoverySession = false;
  let failure: "configuration" | "unavailable" | "invalid-link" = "invalid-link";

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) failure = "unavailable";
    recoverySession = Boolean(user && !error);
  } catch (error) {
    failure = error instanceof SupabaseConfigurationError ? "configuration" : "unavailable";
  }

  return (
    <AuthFlowPage
      eyebrow="SECURE RECOVERY"
      title="Choose a new password"
      description={recoverySession
        ? "Choose a new password for your Wardrobe AI account."
        : "For your protection, this page needs a valid recovery link."}
    >
      {recoverySession ? (
        <PasswordResetForm />
      ) : (
        <>
          <p className="auth-message auth-message-error" role="alert">
            {failure === "configuration"
              ? "Account access is not configured for this deployment. Please try again later."
              : failure === "unavailable"
                ? "We couldn't verify your recovery link right now. Please try again in a moment."
                : "This recovery link has expired or is invalid. Request a new one to continue."}
          </p>
          <p className="auth-secondary-link"><Link href="/auth/forgot-password">Request another recovery link</Link></p>
        </>
      )}
    </AuthFlowPage>
  );
}
