import { compactBuildNumber } from "@/lib/build-number";

const buildNumber = process.env.NEXT_PUBLIC_BUILD_NUMBER ?? "development";

export function BuildStamp({ className = "" }: { className?: string }) {
  return (
    <span
      className={`build-stamp${className ? ` ${className}` : ""}`}
      title={`Build ${buildNumber}`}
      aria-label={`Build ${buildNumber}`}
    >
      <span className="build-stamp-label">BUILD</span>
      <code className="build-stamp-full">{buildNumber}</code>
      <code className="build-stamp-compact">{compactBuildNumber(buildNumber)}</code>
    </span>
  );
}
