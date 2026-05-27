import type { NextConfig } from "next";
import { MARKETPLACE_BASE_PATH } from "./lib/image-marketplace-flow/routes";

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
        destination: `${MARKETPLACE_BASE_PATH}/user/:handle`,
      },
    ];
  },
};

export default nextConfig;
