/**
 * Contact and store links. Both come from build-time env vars (see README):
 *
 * - NEXT_PUBLIC_CONTACT_EMAIL: where privacy requests and the signup mailto:
 *   fallback go. Defaults to hello@allianceprotocols.com.
 * - NEXT_PUBLIC_FULL_SYSTEM_URL: the store page for the Manual + Field Kit.
 *   Must be an https URL; when unset (or invalid) the "Get the full system"
 *   button is replaced by "Coming soon" instead of linking to a placeholder.
 */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "hello@allianceprotocols.com";

/** Returns the URL when it is a valid https URL, else null. */
export function httpsUrlOrNull(value: string | undefined | null): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export const FULL_SYSTEM_URL = httpsUrlOrNull(process.env.NEXT_PUBLIC_FULL_SYSTEM_URL);

/**
 * Email-signup endpoint (Buttondown, ConvertKit, Formspree or similar): the
 * form POSTs a form-encoded `email` field here. Set at build time via
 * NEXT_PUBLIC_SIGNUP_ENDPOINT; when unset, signup falls back to a mailto: to
 * CONTACT_EMAIL. This is the only thing the app ever sends.
 */
export const SIGNUP_ENDPOINT = process.env.NEXT_PUBLIC_SIGNUP_ENDPOINT?.trim() || "";

/** Free lead magnet: printable Situation Map (drop the PDF in public/downloads/). */
export const SITUATION_MAP_PDF = "/downloads/situation-map.pdf";

/** One-line positioning, used in GetFullSystem and on /about. */
export const POSITIONING_LINE =
  "One payment. No subscription. Works offline. Your data stays on your phone.";
