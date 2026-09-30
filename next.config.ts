import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
