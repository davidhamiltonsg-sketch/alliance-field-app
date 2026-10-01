/**
 * Security headers for every response (applied in next.config.ts).
 *
 * Why script-src allows 'unsafe-inline': the App Router streams its React
 * Server Component payload as inline <script>self.__next_f.push(…)</script>
 * tags whose contents differ per page and per build, so they can't be listed
 * by hash. The only strict alternative is a per-request nonce, which forces
 * every page to render dynamically (no static HTML, no CDN cache) — the
 * wrong trade for an offline-first app with no user-generated HTML. Adding a
 * hash (e.g. for the splash boot script) would make browsers ignore
 * 'unsafe-inline' and break hydration, so none is listed. Everything else is
 * locked down: no third-party scripts, styles, fonts, frames or objects.
 */

/** Origin of an optional absolute URL, or null when unset/invalid/not http(s). */
export function originOf(url: string | undefined | null): string | null {
  if (!url?.trim()) return null;
  try {
    const u = new URL(url.trim());
    return u.protocol === "https:" || u.protocol === "http:" ? u.origin : null;
  } catch {
    return null;
  }
}

export function contentSecurityPolicy({
  signupEndpoint,
  dev = false,
}: { signupEndpoint?: string; dev?: boolean } = {}): string {
  const signup = originOf(signupEndpoint);
  const extra = signup ? ` ${signup}` : "";
  return [
    "default-src 'self'",
    // 'unsafe-eval' only in `next dev` (React's dev tooling); never in production.
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src 'self'${extra}${dev ? " ws: wss:" : ""}`,
    "manifest-src 'self'",
    "worker-src 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    `form-action 'self'${extra}`,
  ].join("; ");
}

export function securityHeaders(opts: { signupEndpoint?: string; dev?: boolean } = {}) {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy(opts) },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];
}
