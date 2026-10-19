import type { NextConfig } from "next";
import { createBuildNumber } from "./lib/build-number";

const buildNumber = createBuildNumber(
  new Date(),
  process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA,
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["*.e2b.app"],
  env: {
    NEXT_PUBLIC_BUILD_NUMBER: buildNumber,
  },
};

export default nextConfig;
