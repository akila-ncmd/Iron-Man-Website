import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // There is a stray package-lock.json in the user profile directory above
  // this project, and Turbopack picks the outermost lockfile it finds as the
  // workspace root. Pinning the root to this directory keeps the build reading
  // this project's own dependency tree rather than an unrelated one.
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
};

export default nextConfig;
