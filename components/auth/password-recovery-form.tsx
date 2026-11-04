"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { INITIAL_AUTH_ACTION_STATE } from "@/lib/auth/action-state";
import { requestPasswordRecoveryAction } from "@/app/auth/actions";

export function PasswordRecoveryForm() {
  const [state, formAction, pending] = useActionState(requestPasswordRecoveryAction, INITIAL_AUTH_ACTION_STATE);

  return (
    <form action={formAction} className="form-stack">
      <label className="field-label">
        Email address
        <input className="text-input" type="email" name="email" placeholder="you@example.com" autoComplete="email" required maxLength={254} />
      </label>
      {state.message && (
        <p className={`auth-message auth-message-${state.status}`} role={state.status === "error" ? "alert" : "status"} aria-live="polite">
          {state.message}
        </p>
      )}
      <button className="button button-dark button-full" type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send recovery link"}
        {!pending && <ArrowRight size={16} />}
      </button>
    </form>
  );
}
