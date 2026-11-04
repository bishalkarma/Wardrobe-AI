"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { INITIAL_AUTH_ACTION_STATE } from "@/lib/auth/action-state";
import { completePasswordRecoveryAction } from "@/app/auth/actions";

export function PasswordResetForm() {
  const [state, formAction, pending] = useActionState(completePasswordRecoveryAction, INITIAL_AUTH_ACTION_STATE);

  return (
    <form action={formAction} className="form-stack">
      <label className="field-label">
        New password
        <input className="text-input" type="password" name="password" autoComplete="new-password" minLength={8} maxLength={128} required />
      </label>
      <label className="field-label">
        Confirm new password
        <input className="text-input" type="password" name="confirmPassword" autoComplete="new-password" minLength={8} maxLength={128} required />
      </label>
      {state.message && (
        <p className={`auth-message auth-message-${state.status}`} role={state.status === "error" ? "alert" : "status"} aria-live="polite">
          {state.message}
        </p>
      )}
      <button className="button button-dark button-full" type="submit" disabled={pending}>
        {pending ? "Updating…" : "Update password"}
        {!pending && <ArrowRight size={16} />}
      </button>
    </form>
  );
}
