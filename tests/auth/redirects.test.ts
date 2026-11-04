import { describe, expect, it } from "vitest";
import { isProtectedPath, loginRedirectFor, safeRedirectPath } from "../../lib/auth/redirects";

describe("protected route classification", () => {
  it.each(["/", "/wardrobe", "/wardrobe/123", "/profile", "/profile/photo", "/stylist", "/try-on", "/outfits", "/outfits/abc"]) (
    "%s requires authentication",
    (pathname) => expect(isProtectedPath(pathname)).toBe(true),
  );

  it.each(["/welcome", "/demo", "/demo/wardrobe", "/auth/callback", "/auth/forgot-password", "/auth/reset-password"]) (
    "%s is not an application route guarded by the proxy",
    (pathname) => expect(isProtectedPath(pathname)).toBe(false),
  );
});

describe("safe authentication redirects", () => {
  it("allows an internal application destination and drops its query string", () => {
    expect(safeRedirectPath("/wardrobe?filter=favorites")).toBe("/wardrobe");
    expect(safeRedirectPath("/outfits/look-1?next=https://attacker.test")).toBe("/outfits/look-1");
  });

  it("allows the password-reset continuation", () => {
    expect(safeRedirectPath("/auth/reset-password")).toBe("/auth/reset-password");
  });

  it.each([
    "https://attacker.test/path",
    "//attacker.test/path",
    "/\\attacker.test",
    "/demo/wardrobe",
    "/welcome",
    "/auth/callback",
    "/%2f%2fattacker.test",
    "\r\nLocation: https://attacker.test",
  ])("rejects unsafe or unapproved destination %j", (candidate) => {
    expect(safeRedirectPath(candidate)).toBe("/");
  });

  it("creates a same-site login redirect for a protected route", () => {
    expect(loginRedirectFor("/profile/photo")).toBe("/welcome?next=%2Fprofile%2Fphoto");
    expect(loginRedirectFor("//attacker.test")).toBe("/welcome?next=%2F");
  });
});
