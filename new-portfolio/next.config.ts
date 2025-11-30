import type { NextConfig } from "next";

declare module "next" {
  interface NextConfig {
    eslint?: {
      ignoreDuringBuilds?: boolean;
    };
  }
}

const nextConfig: NextConfig = {
  eslint: {
    // Skip ESLint checks during builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
