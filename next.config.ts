import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      // The separate "7-Day Install" plan was retired: /start is the one plan (CANON round 5).
      { source: "/install", destination: "/start", permanent: true },
      // The Conflict Protocol was folded into the System Overlay ("already a fight" speed), pass 3.
      { source: "/protocols/conflict-protocol", destination: "/protocols/system-overlay", permanent: true },
    ];
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
