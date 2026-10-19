import { describe, expect, it } from "vitest";
import { requireAuthenticatedIdentity } from "../../lib/auth/require-auth";

describe("server-side identity guard", () => {
  it("returns a verified identity", () => {
    expect(requireAuthenticatedIdentity("person@example.test", () => {
      throw new Error("redirect must not run");
    })).toBe("person@example.test");
  });

  it("redirects when no verified identity is available", () => {
    const redirectSignal = new Error("redirected");
    const redirectToLogin = (destination: string): never => {
      expect(destination).toBe("/welcome?error=session");
      throw redirectSignal;
    };

    expect(() => requireAuthenticatedIdentity(null, redirectToLogin)).toThrow(redirectSignal);
  });
});
