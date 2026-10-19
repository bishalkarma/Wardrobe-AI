import { WelcomeScreen, type WelcomeNotice } from "@/components/welcome-screen";
import { safeRedirectPath } from "@/lib/auth/redirects";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const errorMessages: Record<string, string> = {
  callback: "That confirmation or recovery link could not be completed. Request a fresh link and try again.",
  configuration: "Account access is not configured for this deployment. Please try again later.",
  unavailable: "We couldn't verify your account right now. Please try again.",
  session: "Please sign in to continue.",
  signout: "We couldn't confirm sign-out. Please try again.",
};

const successMessages: Record<string, string> = {
  "signed-out": "You have been signed out.",
  "password-updated": "Your password has been updated.",
};

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function WelcomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const errorCode = firstValue(params.error);
  const noticeCode = firstValue(params.notice);
  let notice: WelcomeNotice | undefined;

  if (errorCode && errorMessages[errorCode]) {
    notice = { kind: "error", message: errorMessages[errorCode] };
  } else if (noticeCode && successMessages[noticeCode]) {
    notice = { kind: "success", message: successMessages[noticeCode] };
  }

  return <WelcomeScreen nextPath={safeRedirectPath(firstValue(params.next))} notice={notice} />;
}
