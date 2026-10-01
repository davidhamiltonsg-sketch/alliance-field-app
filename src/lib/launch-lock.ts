/**
 * Pre-launch lock. While LAUNCH_ACCESS_CODE is set (Vercel env var), every page
 * except the public ones below asks for the code first (see src/proxy.ts).
 * Launching = delete the env var and redeploy; nothing else changes.
 *
 * The cookie holds "v2.<issued-at>.<HMAC-SHA256(secret, code + issued-at)>",
 * never the code. The issued-at time (Unix seconds) is signed with the code,
 * so it can't be changed, and a token older than 30 days is refused even if
 * the browser kept the cookie (or it was copied elsewhere). The secret is
 * LAUNCH_COOKIE_SECRET when set; otherwise it is derived from the code itself
 * (fine for a pre-launch gate, since knowing the code already grants access).
 * Setting a separate secret means a leaked cookie can't be brute-forced back
 * into the code, and rotating the secret signs everyone out.
 *
 * Codes are compared case-insensitively, ignoring surrounding spaces, on
 * purpose: the code is shared by word of mouth and typed on phones, where
 * auto-capitalisation is common. Folding case costs little: a code of 4+
 * random words (or 12+ random characters) keeps far more entropy than an
 * online attacker slowed by the wrong-code delay and a WAF rate limit can
 * search (see README, "Pre-launch lock").
 */

export const ACCESS_COOKIE = "ap_access";
export const UNLOCK_PATH = "/unlock";
/** Pause before answering a wrong code, to slow scripted guessing. */
export const WRONG_CODE_DELAY_MS = 600;

/** Safety and legal pages stay reachable even while the app is locked. */
const PUBLIC_PATHS = new Set([UNLOCK_PATH, "/help", "/privacy", "/terms"]);

/** How long an access token is honoured after it was issued (and the cookie's Max-Age). */
export const ACCESS_MAX_AGE_S = 60 * 60 * 24 * 30;
/** Clock skew tolerated for an issued-at time slightly in the future. */
const FUTURE_SKEW_S = 5 * 60;

export function isPublicPath(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return PUBLIC_PATHS.has(path);
}

const PLACEHOLDER_ORIGIN = "https://x.invalid";

/**
 * Only same-origin relative paths are allowed as the post-unlock destination.
 * Backslashes and control characters are rejected outright (browsers treat
 * "/\evil.com" and "/\t/evil.com" as protocol-relative URLs); what's left is
 * resolved against a placeholder origin and must stay on it.
 */
export function safeNext(next: string | null | undefined): string {
  if (typeof next !== "string" || !next.startsWith("/") || next.length > 2048) return "/";
  if (/[\\\u0000-\u001f\u007f]/.test(next)) return "/";
  let url: URL;
  try {
    url = new URL(next, PLACEHOLDER_ORIGIN);
  } catch {
    return "/";
  }
  if (url.origin !== PLACEHOLDER_ORIGIN) return "/";
  if (url.pathname === UNLOCK_PATH || url.pathname.startsWith(`${UNLOCK_PATH}/`)) return "/";
  return url.pathname + url.search;
}

const encoder = new TextEncoder();

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Codes match ignoring case and surrounding spaces. */
export function normaliseCode(code: string): string {
  return code.trim().toLowerCase();
}

async function sha256(text: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", encoder.encode(text));
}

/** Compares two strings in time that depends only on their length. */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** HMAC key: LAUNCH_COOKIE_SECRET if given, else derived from the code. */
async function hmacKey(code: string, secret?: string): Promise<CryptoKey> {
  const raw = secret?.trim() ? encoder.encode(secret.trim()) : await sha256(`alliance-protocols:cookie-key:${normaliseCode(code)}`);
  return crypto.subtle.importKey("raw", raw, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}

async function signature(code: string, iat: number, secret?: string): Promise<string> {
  const key = await hmacKey(code, secret);
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(`ap_access:v2:${iat}:${normaliseCode(code)}`)));
}

/** Cookie value for a successful unlock: "v2.<issued-at seconds>.<64 hex HMAC>". */
export async function issueAccessToken(code: string, secret?: string, nowMs = Date.now()): Promise<string> {
  const iat = Math.floor(nowMs / 1000);
  return `v2.${iat}.${await signature(code, iat, secret)}`;
}

const TOKEN_SHAPE = /^v2\.(\d{1,12})\.([0-9a-f]{64})$/;

/**
 * True when the cookie is a token for this code (and secret), issued no more
 * than 30 days ago and not in the future. The signature is compared in
 * constant time.
 */
export async function verifyAccessToken(
  cookie: string | undefined,
  code: string,
  secret?: string,
  nowMs = Date.now(),
): Promise<boolean> {
  if (typeof cookie !== "string") return false;
  const m = TOKEN_SHAPE.exec(cookie);
  if (!m) return false;
  const iat = Number(m[1]);
  const now = Math.floor(nowMs / 1000);
  if (iat > now + FUTURE_SKEW_S || now - iat > ACCESS_MAX_AGE_S) return false;
  return timingSafeEqual(m[2], await signature(code, iat, secret));
}

/**
 * Checks a submitted code against the expected one. Both are hashed first so
 * the comparison is fixed-length and constant-time whatever was typed.
 */
export async function codesMatch(given: string, expected: string): Promise<boolean> {
  const [a, b] = await Promise.all([sha256(normaliseCode(given)), sha256(normaliseCode(expected))]);
  return timingSafeEqual(toHex(a), toHex(b)) && normaliseCode(expected).length > 0;
}
