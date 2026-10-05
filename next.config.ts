import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      // The separate "7-Day Install" plan was retired: /start is the one plan.
      { source: "/install", destination: "/start", permanent: true },
      // Printed fridge sheets and the free PDF give allianceprotocols.com/situation-map.
      { source: "/situation-map", destination: "/#situation-map", permanent: false },
      { source: "/map", destination: "/#situation-map", permanent: false },
      // The Conflict Protocol was folded into the System Overlay ("already a fight" speed).
      { source: "/protocols/conflict-protocol", destination: "/protocols/system-overlay", permanent: true },
      // Folded: Proof Protocol became "a Proof item" inside Trust Recovery.
      { source: "/protocols/proof-protocol", destination: "/protocols/trust-recovery", permanent: true },
      // Renamed in the 15-tool rebuild: old slugs keep working.
      { source: "/protocols/full-recovery", destination: "/protocols/full-repair", permanent: true },
      { source: "/protocols/uninvestment-check", destination: "/protocols/check-up", permanent: true },
      { source: "/protocols/unity-anchor", destination: "/protocols/team-agreement", permanent: true },
      { source: "/protocols/morning-evening-rhythm", destination: "/protocols/daily-rhythm", permanent: true },
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
