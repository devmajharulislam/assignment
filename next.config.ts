import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "http",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "cdn-nextshop.prospectbdltd.com",
      },
    ],
  },
};

export default nextConfig;
