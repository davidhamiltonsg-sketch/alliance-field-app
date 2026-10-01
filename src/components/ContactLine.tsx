import { CONTACT_EMAIL, SITE_CONTACT_TEXT, SITE_URL } from "@/lib/links";

/**
 * How to reach us: the contact address when one is configured
 * (NEXT_PUBLIC_CONTACT_EMAIL), otherwise "via allianceprotocols.com". Never a
 * made-up default address.
 */
export function ContactLine() {
  if (CONTACT_EMAIL) {
    return (
      <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-accent underline underline-offset-4">
        {CONTACT_EMAIL}
      </a>
    );
  }
  return (
    <a href={SITE_URL} className="font-medium text-accent underline underline-offset-4">
      {SITE_CONTACT_TEXT}
    </a>
  );
}
