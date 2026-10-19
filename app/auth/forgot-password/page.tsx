import Link from "next/link";
import { AuthFlowPage } from "@/components/auth/auth-flow-page";
import { PasswordRecoveryForm } from "@/components/auth/password-recovery-form";

export default function ForgotPasswordPage() {
  return (
    <AuthFlowPage
      eyebrow="ACCOUNT RECOVERY"
      title="Reset your password"
      description="Enter your account email. If it matches an account, we’ll send a secure recovery link."
    >
      <PasswordRecoveryForm />
      <p className="auth-secondary-link"><Link href="/welcome">Return to sign in</Link></p>
    </AuthFlowPage>
  );
}
