import "server-only";

import { headers } from "next/headers";

function firstHeaderValue(value: string | null): string | null {
  return value?.split(",", 1)[0]?.trim() || null;
}

function isLocalHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

/**
 * Resolve the current request origin for Supabase email redirects.
 * Supabase's Auth redirect allowlist remains the final origin allowlist;
 * this helper also rejects mismatched Origin/Host headers and non-HTTPS hosts.
 */
export async function getRequestOrigin(): Promise<string> {
  const requestHeaders = await headers();
  const forwardedHost = firstHeaderValue(requestHeaders.get("x-forwarded-host"));
  const host = forwardedHost ?? firstHeaderValue(requestHeaders.get("host"));
  if (!host) throw new Error("Unable to determine the request host.");

  let hostUrl: URL;
  try {
    hostUrl = new URL(`http://${host}`);
  } catch {
    throw new Error("Invalid request host.");
  }

  const forwardedProtocol = firstHeaderValue(requestHeaders.get("x-forwarded-proto"));
  const protocol = forwardedProtocol ?? (isLocalHost(hostUrl.hostname) ? "http" : "https");
  if (protocol !== "https" && protocol !== "http") {
    throw new Error("Unsupported request protocol.");
  }

  const expectedOrigin = new URL(`${protocol}://${host}`).origin;
  const originHeader = requestHeaders.get("origin");
  if (originHeader) {
    let suppliedOrigin: URL;
    try {
      suppliedOrigin = new URL(originHeader);
    } catch {
      throw new Error("Invalid request origin.");
    }
    if (suppliedOrigin.origin !== expectedOrigin) {
      throw new Error("Request origin does not match the current host.");
    }
  }

  const parsed = new URL(expectedOrigin);
  if (parsed.protocol !== "https:" && !isLocalHost(parsed.hostname)) {
    throw new Error("HTTPS is required for authentication redirects.");
  }

  return parsed.origin;
}
