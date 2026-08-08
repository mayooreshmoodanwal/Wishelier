import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow local network IP dev origins in development mode
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.20.33"],

  // Image optimization: allow ImageKit and external image sources
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/wishelier/**",
      },
      {
        protocol: "https",
        hostname: "**.catbox.moe",
      },
      {
        protocol: "https",
        hostname: "nekos.best",
      },
      {
        protocol: "https",
        hostname: "media*.giphy.com",
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        // Allow Cashfree webhook calls
        source: "/api/payments/webhook",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "POST",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
