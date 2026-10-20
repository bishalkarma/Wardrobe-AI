const ALLOWED_ROUTE_ROOTS = [
  "/profile",
  "/wardrobe",
  "/stylist",
  "/try-on",
  "/outfits",
] as const;

const ALLOWED_AUTH_CONTINUATIONS = new Set(["/auth/reset-password"]);
const INTERNAL_ORIGIN = "https://wardrobe-ai.internal";

export function isProtectedPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return ALLOWED_ROUTE_ROOTS.some(
    (root) => pathname === root || pathname.startsWith(`${root}/`),
  );
}

export function safeRedirectPath(candidate: string | null | undefined): string {
  if (!candidate || candidate.length > 2048) return "/";
  if (!candidate.startsWith("/") || candidate.startsWith("//")) return "/";
  if (candidate.includes("\\") || /[\u0000-\u001f\u007f]/.test(candidate)) return "/";

  let parsed: URL;
  try {
    parsed = new URL(candidate, INTERNAL_ORIGIN);
  } catch {
    return "/";
  }

  if (parsed.origin !== INTERNAL_ORIGIN) return "/";
  const pathname = parsed.pathname;
  const isAppRoute = isProtectedPath(pathname);
  const isRecoveryRoute = ALLOWED_AUTH_CONTINUATIONS.has(pathname);

  if (!isAppRoute && !isRecoveryRoute) return "/";

  // Do not carry untrusted query strings or fragments across an auth boundary.
  return pathname;
}

export function loginRedirectFor(pathname: string): string {
  const safePath = safeRedirectPath(pathname);
  return `/welcome?next=${encodeURIComponent(safePath)}`;
}
