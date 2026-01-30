import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Disable image optimization for static export (no Node.js server)
  images: {
    unoptimized: true,
  },
  // Trailing slashes for better compatibility with static hosting
  trailingSlash: true,
};

export default nextConfig;
