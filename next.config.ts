import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Inlined identically into server and client bundles, so the footer's
  // hydration render always matches the prerendered HTML.
  env: { BUILD_YEAR: String(new Date().getFullYear()) },
};

export default nextConfig;
