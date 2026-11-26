import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
  experimental: {
    inlineCss: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "arunkallam\\.vercel\\.app" }],
        destination: "https://arunkallam.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
