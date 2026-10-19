import { describe, expect, it } from "vitest";
import { compactBuildNumber, createBuildNumber } from "../lib/build-number";

describe("automatic build numbers", () => {
  it("combines a UTC timestamp with the short source revision", () => {
    expect(createBuildNumber(new Date("2026-10-19T06:02:42.321Z"), "c6a00f2abcdef"))
      .toBe("20261019060242-c6a00f2");
  });

  it("marks builds without CI source metadata as local", () => {
    expect(createBuildNumber(new Date("2026-10-19T06:02:42.321Z")))
      .toBe("20261019060242-local");
  });

  it("formats a compact timestamp for mobile UI", () => {
    expect(compactBuildNumber("20261019060242-c6a00f2"))
      .toBe("261019-060242");
  });
});
