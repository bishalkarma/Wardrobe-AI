export function requireAuthenticatedIdentity<T>(
  identity: T | null | undefined,
  redirectToLogin: (destination: string) => never,
): T {
  if (!identity) return redirectToLogin("/welcome?error=session");
  return identity;
}
