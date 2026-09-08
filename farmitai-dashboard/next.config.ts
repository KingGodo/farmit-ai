import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    qualities: [75, 90],
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/_next/static/media/**" },
    ],
  },
};

export default nextConfig;
