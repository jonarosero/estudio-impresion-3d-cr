import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "mcp-tools-z-image-turbo.hf.space",
      },
    ],
  },
};

export default nextConfig;
