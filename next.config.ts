import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Inlined identically into server and client bundles, so the footer's
  // hydration render always matches the prerendered HTML.
  env: { BUILD_YEAR: String(new Date().getFullYear()) },
  images: {
    // Serve the profile photo as AVIF, falling back to WebP.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Inline the (small) global stylesheet into the HTML so first paint
    // doesn't wait on a separate render-blocking CSS request.
    inlineCss: true,
  },
};

export default nextConfig;
