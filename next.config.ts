import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    // The separate "7-Day Install" plan was retired: /start is the one plan (CANON round 5).
    return [{ source: "/install", destination: "/start", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders({
          signupEndpoint: process.env.NEXT_PUBLIC_SIGNUP_ENDPOINT,
          dev: process.env.NODE_ENV === "development",
        }),
      },
      {
        // The worker must always be revalidated so new deploys are picked up.
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
