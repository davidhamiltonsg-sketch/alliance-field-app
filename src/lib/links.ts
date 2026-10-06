/**
 * Contact, email-list and store settings. All come from build-time env vars
 * (see README, "Environment variables"); every one is optional, and the app
 * says less rather than show a placeholder when one is missing.
 *
 * - NEXT_PUBLIC_CONTACT_EMAIL: shown on /privacy and /terms. When unset (or
 *   not an email address), no address is shown: people are pointed to
 *   allianceprotocols.com instead.
 * - NEXT_PUBLIC_SIGNUP_ENDPOINT + NEXT_PUBLIC_EMAIL_PROVIDER_NAME: the email
 *   sign-up is live only when both are set, so the privacy notice can always
 *   name the service that holds the list.
 * - NEXT_PUBLIC_STORE_URL_KIT / _MANUAL / _VOLUME_A / _COMPLETE / _BUNDLE:
 *   the store page for each product. No fallback: a product's buy link
 *   appears only when its own variable holds a valid https URL, so two
 *   products can never open the same page by accident.
 */

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

/** Returns the address when it looks like an email address, else null. */
export function emailOrNull(value: string | undefined | null): string | null {
  const v = value?.trim();
  return v && /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(v) ? v : null;
}

export const CONTACT_EMAIL = emailOrNull(process.env.NEXT_PUBLIC_CONTACT_EMAIL);

/** Where to point people when no contact address is configured. */
export const SITE_CONTACT_TEXT = "via allianceprotocols.com";
export const SITE_URL = "https://allianceprotocols.com";

export type StoreProduct = "manual" | "volumeA" | "complete" | "kit" | "bundle";

/** Store page per product, each from its own variable only; null = no buy link. */
export const STORE_URLS: Record<StoreProduct, string | null> = {
  kit: httpsUrlOrNull(process.env.NEXT_PUBLIC_STORE_URL_KIT),
  manual: httpsUrlOrNull(process.env.NEXT_PUBLIC_STORE_URL_MANUAL),
  volumeA: httpsUrlOrNull(process.env.NEXT_PUBLIC_STORE_URL_VOLUME_A),
  complete: httpsUrlOrNull(process.env.NEXT_PUBLIC_STORE_URL_COMPLETE),
  bundle: httpsUrlOrNull(process.env.NEXT_PUBLIC_STORE_URL_BUNDLE),
};

/**
 * Email-signup endpoint (Buttondown, Kit/ConvertKit, Formspree or similar):
 * the form POSTs a form-encoded `email` field here. This is the only thing
 * the app ever sends.
 */
export const SIGNUP_ENDPOINT = process.env.NEXT_PUBLIC_SIGNUP_ENDPOINT?.trim() || "";

/** The service that runs the mailing list, named on /privacy (e.g. "Buttondown"). */
export const EMAIL_PROVIDER_NAME = process.env.NEXT_PUBLIC_EMAIL_PROVIDER_NAME?.trim() || null;

/** The sign-up form is shown only when it can send somewhere and the privacy notice can say who holds the list. */
export const SIGNUP_ACTIVE = Boolean(SIGNUP_ENDPOINT && EMAIL_PROVIDER_NAME);

/** Free lead magnet: printable Situation Map (drop the PDF in public/downloads/). */
export const SITUATION_MAP_PDF = "/downloads/situation-map.pdf";

/** Free sample: the Companion Book's Prologue and Chapter I, with its Help Lines page. */
export const COMPANION_SAMPLE_PDF = "/downloads/companion-sample.pdf";

/** One-line positioning, used in GetFullSystem and on /about. */
export const POSITIONING_LINE =
  "Pay once; there’s no subscription. The Field App works without a signal, and what you type stays on your phone.";
