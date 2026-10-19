import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { isProtectedPath, loginRedirectFor } from "@/lib/auth/redirects";
import { SupabaseConfigurationError, getSupabasePublicConfig } from "@/lib/supabase/config";

function copySessionCookies(from: NextResponse, to: NextResponse) {
  for (const cookie of from.cookies.getAll()) {
    to.cookies.set(cookie.name, cookie.value, cookie);
  }
  for (const name of ["cache-control", "expires", "pragma"]) {
    const value = from.headers.get(name);
    if (value) to.headers.set(name, value);
  }
}

function redirectToWelcome(request: NextRequest, error?: "configuration" | "unavailable" | "session") {
  const destination = new URL(loginRedirectFor(request.nextUrl.pathname), request.url);
  if (error) destination.searchParams.set("error", error);
  const response = NextResponse.redirect(destination);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!isProtectedPath(pathname)) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  try {
    const { url, anonKey } = getSupabasePublicConfig();
    const supabase = createServerClient(url, anonKey, {
      cookieOptions: {
        path: "/",
        sameSite: "lax",
        secure: request.nextUrl.protocol === "https:",
        httpOnly: true,
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
          for (const [name, value] of Object.entries(headers)) {
            response.headers.set(name, value);
          }
        },
      },
    });

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      const unavailable = redirectToWelcome(request, "unavailable");
      copySessionCookies(response, unavailable);
      return unavailable;
    }
    if (!user) {
      const signIn = redirectToWelcome(request, "session");
      copySessionCookies(response, signIn);
      return signIn;
    }

    return response;
  } catch (error) {
    const code = error instanceof SupabaseConfigurationError ? "configuration" : "unavailable";
    const unavailable = redirectToWelcome(request, code);
    copySessionCookies(response, unavailable);
    return unavailable;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest).*)"],
};
