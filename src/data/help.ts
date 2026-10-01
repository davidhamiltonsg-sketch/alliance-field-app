/**
 * Canonical Help Lines — identical wording and numbers to the printed
 * Operating Manual and Field Kit. Change them there first, then here.
 */

export interface HelpNumber {
  label: string;
  /** Display text, exactly as printed. */
  display: string;
  /** tel: / sms: target (digits only). */
  href: string;
}

export interface HelpRegion {
  region: string;
  lines: HelpNumber[];
}

export const SAFETY_FIRST_ROW =
  "Afraid of your partner, being threatened, or not free to say no? → Stop. These tools are not for this. Get outside help (see Help Lines).";

export const emergencyNumbers: HelpNumber[] = [
  { label: "UK / SG", display: "999", href: "tel:999" },
  { label: "US", display: "911", href: "tel:911" },
  { label: "AU", display: "000", href: "tel:000" },
  { label: "EU", display: "112", href: "tel:112" },
];

export const helpRegions: HelpRegion[] = [
  {
    region: "US",
    lines: [
      { label: "National Domestic Violence Hotline", display: "1-800-799-7233", href: "tel:18007997233" },
      { label: "National Domestic Violence Hotline (text START)", display: "88788", href: "sms:88788?body=START" },
      { label: "988 Suicide & Crisis Lifeline (call/text)", display: "988", href: "tel:988" },
    ],
  },
  {
    region: "UK",
    lines: [
      { label: "National Domestic Abuse Helpline (Refuge)", display: "0808 2000 247", href: "tel:08082000247" },
      { label: "Samaritans", display: "116 123", href: "tel:116123" },
      { label: "Men’s Advice Line (men experiencing abuse)", display: "0808 8010327", href: "tel:08088010327" },
    ],
  },
  {
    region: "Australia",
    lines: [
      { label: "1800RESPECT", display: "1800 737 732", href: "tel:1800737732" },
      { label: "Lifeline", display: "13 11 14", href: "tel:131114" },
    ],
  },
  {
    region: "Singapore",
    lines: [
      { label: "National Anti-Violence & Sexual Harassment Helpline", display: "1800 777 0000", href: "tel:18007770000" },
      { label: "SOS", display: "1767", href: "tel:1767" },
      { label: "AWARE Women’s Helpline", display: "1800 777 5555", href: "tel:18007775555" },
      { label: "Police by SMS, if you can’t speak", display: "70999", href: "sms:70999" },
    ],
  },
  {
    region: "EU",
    lines: [
      { label: "Helpline for women experiencing violence, where available", display: "116 016", href: "tel:116016" },
    ],
  },
];

/**
 * CANON round 6: for anyone worried about their own behaviour. Numbers as
 * verified by the authors on each service's own site (1 October 2026); PAVE
 * answers in office hours only.
 */
export const ownBehaviourLines: (HelpNumber & { region: string })[] = [
  { region: "UK", label: "Respect Phoneline", display: "0808 8024040", href: "tel:08088024040" },
  { region: "Australia", label: "Men’s Referral Service", display: "1300 766 491", href: "tel:1300766491" },
  { region: "Singapore", label: "PAVE (office hours)", display: "6555 0390", href: "tel:65550390" },
];

/** CANON round 6 safety note for people whose phone or books may be checked. */
export const PRIVATE_STORAGE_NOTE =
  "If someone checks your phone or books, keep this somewhere private; you can find the Help Lines at allianceprotocols.com/help.";

/** CANON round 5: the LGBTQ+-affirming line, printed after the regional lines. */
export const LGBTQ_LINE =
  "LGBTQ+-affirming: US: Trevor Project 1-866-488-7386 (under 25) · LGBT National Hotline 1-888-843-4564 · UK: Switchboard LGBT+ 0800 0119 100 · Australia: QLife 1800 184 527 · Singapore: Oogachaga (oogachaga.com)";

/** The same line as tappable links (the Singapore service is web-based). */
export const lgbtqLines: (HelpNumber & { region: string })[] = [
  { region: "US", label: "Trevor Project (under 25)", display: "1-866-488-7386", href: "tel:18664887386" },
  { region: "US", label: "LGBT National Hotline", display: "1-888-843-4564", href: "tel:18888434564" },
  { region: "UK", label: "Switchboard LGBT+", display: "0800 0119 100", href: "tel:08000119100" },
  { region: "Australia", label: "QLife", display: "1800 184 527", href: "tel:1800184527" },
  { region: "Singapore", label: "Oogachaga", display: "oogachaga.com", href: "https://oogachaga.com" },
];

export const ELSEWHERE_LINE = "Elsewhere: your local emergency number or national helpline.";
