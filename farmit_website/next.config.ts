import type { NextConfig } from "next";
import path from "path";

const appDir = __dirname;

const nextConfig: NextConfig = {
  // Cursor opens the parent FarmitAI folder as the workspace, so Next
  // treats that as the project root. Pin tracing to this app.
  outputFileTracingRoot: appDir,
  turbopack: {
    root: appDir,
  },
  images: {
    qualities: [75, 90],
  },
};

export default nextConfig;
