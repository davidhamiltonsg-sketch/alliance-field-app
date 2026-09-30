/**
 * Store / contact links used by the free-app "Get the full system" CTA.
 *
 * TODO(david): swap these placeholders for your real Gumroad product URL and
 * a capture address you actually check — see the delivery notes.
 */
export const FULL_SYSTEM_URL = "https://thealliance.gumroad.com/l/complete-bundle";
export const SIGNUP_CAPTURE_EMAIL = "hello@thealliance.app";

/**
 * Email-signup endpoint (Buttondown, ConvertKit, Formspree or similar): the
 * form POSTs a form-encoded `email` field here. Set at build time via
 * NEXT_PUBLIC_SIGNUP_ENDPOINT; when unset, signup falls back to a mailto: to
 * SIGNUP_CAPTURE_EMAIL. This is the only thing the app ever sends.
 */
export const SIGNUP_ENDPOINT = process.env.NEXT_PUBLIC_SIGNUP_ENDPOINT?.trim() || "";

/** Free lead magnet: printable Situation Map (drop the PDF in public/downloads/). */
export const SITUATION_MAP_PDF = "/downloads/situation-map.pdf";

/** One-line positioning, used in GetFullSystem and on /about. */
export const POSITIONING_LINE =
  "One payment. No subscription. Works offline. Your data stays on your phone.";
