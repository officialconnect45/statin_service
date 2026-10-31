import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentUpgrade: "security",
  },
  cacheComponents: true,
  images: {
    // Stock photography (Unsplash, free licence). Photo paths only, no query strings.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-**", search: "" }],
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
