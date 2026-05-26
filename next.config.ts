import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "imagedelivery.net" },
      { protocol: "http", hostname: "imagedelivery.net" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/@:handle",
        destination: "/demos/image-marketplace-flow/user/:handle",
      },
    ];
  },
};

export default nextConfig;
