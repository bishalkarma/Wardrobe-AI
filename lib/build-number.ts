const BUILD_NUMBER_PATTERN = /^(\d{8})(\d{6})-([^-]+)$/;

/** Create a unique, human-readable identifier for one Next.js build. */
export function createBuildNumber(date: Date, commitSha?: string): string {
  const timestamp = date.toISOString().replace(/\D/g, "").slice(0, 14);
  const revision = commitSha?.trim().slice(0, 7) || "local";
  return `${timestamp}-${revision}`;
}

/** Compact the full build stamp for narrow mobile headers. */
export function compactBuildNumber(buildNumber: string): string {
  const match = BUILD_NUMBER_PATTERN.exec(buildNumber);
  if (!match) return buildNumber;
  return `${match[1].slice(2)}-${match[2]}`;
}
