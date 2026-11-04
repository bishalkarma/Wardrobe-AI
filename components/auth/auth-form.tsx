"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { INITIAL_AUTH_ACTION_STATE } from "@/lib/auth/action-state";
import type { AuthActionState } from "@/lib/auth/action-state";
import { signInAction, signUpAction } from "@/app/auth/actions";

export type AuthMode = "sign-in" | "create";

function ActionMessage({ state }: { state: AuthActionState }) {
  if (!state.message) return null;
  return (
    <p className={`auth-message auth-message-${state.status}`} role={state.status === "error" ? "alert" : "status"} aria-live="polite">
      {state.message}
    </p>
  );
}

export function AuthForm({ mode, nextPath = "/" }: { mode: AuthMode; nextPath?: string }) {
  const [signInState, signInFormAction, signInPending] = useActionState(signInAction, INITIAL_AUTH_ACTION_STATE);
  const [signUpState, signUpFormAction, signUpPending] = useActionState(signUpAction, INITIAL_AUTH_ACTION_STATE);
  const isSignIn = mode === "sign-in";
  const state = isSignIn ? signInState : signUpState;
  const pending = isSignIn ? signInPending : signUpPending;

  return (
    <>
      <form action={isSignIn ? signInFormAction : signUpFormAction} className="form-stack">
        <input type="hidden" name="next" value={nextPath} />
        <label className="field-label">
          Email address
          <input className="text-input" type="email" name="email" placeholder="you@example.com" autoComplete="email" required maxLength={254} />
        </label>
        <label className="field-label">
          Password
          <input
            className="text-input"
            type="password"
            name="password"
            placeholder={isSignIn ? "Your password" : "At least 8 characters"}
            autoComplete={isSignIn ? "current-password" : "new-password"}
            required
            minLength={isSignIn ? undefined : 8}
            maxLength={128}
          />
        </label>
        <ActionMessage state={state} />
        <button className="button button-dark button-full" type="submit" disabled={pending}>
          {pending ? "Please wait…" : isSignIn ? "Sign in" : "Create account"}
          {!pending && <ArrowRight size={16} />}
        </button>
      </form>
      {isSignIn && (
        <p className="auth-secondary-link"><Link href="/auth/forgot-password">Forgot your password?</Link></p>
      )}
      <p className="prototype-disclaimer"><LockKeyhole size={13} /> New accounts must confirm their email before signing in.</p>
    </>
  );
}
