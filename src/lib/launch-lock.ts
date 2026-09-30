/**
 * Pre-launch lock. While LAUNCH_ACCESS_CODE is set (Vercel env var), every page
 * except the public ones below asks for the code first (see src/proxy.ts).
 * Launching = delete the env var and redeploy; nothing else changes.
 */

export const ACCESS_COOKIE = "ap_access";
export const UNLOCK_PATH = "/unlock";

/** Safety and legal pages stay reachable even while the app is locked. */
const PUBLIC_PATHS = new Set([UNLOCK_PATH, "/help", "/privacy"]);

export function isPublicPath(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return PUBLIC_PATHS.has(path);
}

/** Only same-site relative paths are allowed as the post-unlock destination. */
export function safeNext(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith(UNLOCK_PATH)) return "/";
  return next;
}

/** Cookie value: a hash of the code, so the code itself never sits in the browser. */
export async function accessToken(code: string): Promise<string> {
  const bytes = new TextEncoder().encode(`alliance-protocols:${code.trim()}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function codesMatch(given: string, expected: string): boolean {
  return given.trim().toLowerCase() === expected.trim().toLowerCase();
}
