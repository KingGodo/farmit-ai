import type { NextConfig } from "next";

const appDir = __dirname;

const nextConfig: NextConfig = {
  // Cursor opens the parent FarmitAI folder as the workspace, so Next
  // treats that as the project root. Pin tracing to this app.
  outputFileTracingRoot: appDir,
  compress: true,
  turbopack: {
    root: appDir,
  },
  images: {
    unoptimized: true,
    qualities: [75, 90],
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/_next/static/media/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
