import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  images: {
    // Remove `domains` completely — it is deprecated and triggers the warning
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // Optional: be more specific if you want (recommended for security)
        // pathname: "/**",   // allows all paths under the domain
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Remove the empty turbopack object (not needed)
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
})(nextConfig);