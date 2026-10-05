/**
 * Canonical Help Lines: identical wording and numbers to the printed
 * Operating Manual and Field Kit. Change them there first, then here.
 * Numbers checked October 2026.
 */

export const HELP_LINES_CHECKED = "checked October 2026";

export interface HelpNumber {
  label: string;
  /** Display text, exactly as printed. */
  display: string;
  /** tel: / sms: target (digits only). */
  href: string;
}

export interface HelpRegion {
  region: string;
  /** How the region reads inside a sentence ("the US"). */
  inProse: string;
  lines: HelpNumber[];
}

export const SAFETY_FIRST_ROW =
  "Afraid of your partner, being threatened, or not free to say no? → Stop. These tools are not for this. Get outside help (see Help Lines).";

export const emergencyNumbers: HelpNumber[] = [
  { label: "UK / SG police", display: "999", href: "tel:999" },
  { label: "SG ambulance", display: "995", href: "tel:995" },
  { label: "US", display: "911", href: "tel:911" },
  { label: "AU", display: "000", href: "tel:000" },
  { label: "EU", display: "112", href: "tel:112" },
];

export const helpRegions: HelpRegion[] = [
  {
    region: "US",
    inProse: "the US",
    lines: [
      { label: "National Domestic Violence Hotline", display: "1-800-799-7233", href: "tel:18007997233" },
      { label: "National Domestic Violence Hotline (text START)", display: "88788", href: "sms:88788?body=START" },
      { label: "988 Suicide & Crisis Lifeline (call/text)", display: "988", href: "tel:988" },
      { label: "RAINN: sexual violence, including from a partner", display: "800-656-4673", href: "tel:8006564673" },
      { label: "RAINN (text HOPE)", display: "64673", href: "sms:64673?body=HOPE" },
    ],
  },
  {
    region: "UK",
    inProse: "the UK",
    lines: [
      { label: "National Domestic Abuse Helpline (Refuge)", display: "0808 2000 247", href: "tel:08082000247" },
      { label: "Samaritans", display: "116 123", href: "tel:116123" },
      { label: "Men’s Advice Line (men experiencing abuse)", display: "0808 8010327", href: "tel:08088010327" },
      { label: "Rape Crisis England & Wales: sexual violence, including from a partner", display: "0808 500 2222", href: "tel:08085002222" },
    ],
  },
  {
    region: "Australia",
    inProse: "Australia",
    lines: [
      { label: "1800RESPECT", display: "1800 737 732", href: "tel:1800737732" },
      { label: "Lifeline", display: "13 11 14", href: "tel:131114" },
    ],
  },
  {
    region: "Singapore",
    inProse: "Singapore",
    lines: [
      { label: "National Anti-Violence & Sexual Harassment Helpline", display: "1800 777 0000", href: "tel:18007770000" },
      { label: "SOS", display: "1767", href: "tel:1767" },
      { label: "AWARE Women’s Helpline", display: "1800 777 5555", href: "tel:18007775555" },
      { label: "Police by SMS, if you can’t speak", display: "70999", href: "sms:70999" },
      { label: "AWARE Sexual Assault Care Centre (weekdays 10am to 6pm)", display: "6779 0282", href: "tel:67790282" },
    ],
  },
  {
    region: "EU",
    inProse: "the EU",
    lines: [
      { label: "Helpline for women experiencing violence, where available", display: "116 016", href: "tel:116016" },
    ],
  },
];

/**
 * For anyone worried about their own behaviour. Numbers checked against each
 * service's own site (October 2026); PAVE answers in office hours only.
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

export const CHILD_LINE =
  "Worried about a child: your local child-protection service, or your emergency number if a child is in danger.";

export const SELF_CHECK_TITLE = "Not sure whether this is you?";

export const SELF_CHECK_QUESTIONS: string[] = [
  "Do you hold back what you think because you are afraid of how your partner would react?",
  "Are you ever afraid of what they will do?",
  "Do they check, restrict or punish your contact with others, or control your money?",
  "Does an argument ever end with you giving in out of fear?",
  "Are you ever pressured into sex or touch you do not want?",
];

export const SELF_CHECK_RESULT =
  "If any answer is yes, these tools are not for this: get outside help first.";

export const ELSEWHERE_LINE = "Elsewhere: your local emergency number or national helpline.";

/**
 * Every Help Lines region, in order, plus "elsewhere". Any surface that
 * lists or names the Help Lines regions must use this (or helpRegions and
 * ELSEWHERE_LINE), so no page can drop a region.
 */
export const HELP_LINES_REGIONS: string[] = [...helpRegions.map((r) => r.region), "Elsewhere"];

function proseList(items: string[]): string {
  return items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

/**
 * One sentence pointing to the Help page that names every region and says
 * what to do anywhere else. Built from helpRegions, so it can't fall behind.
 */
export const HELP_LINES_POINTER = `The Help page has Help Lines for ${proseList(
  helpRegions.map((r) => r.inProse),
)}. Anywhere else, call your local emergency number or national helpline. ${CHILD_LINE}`;

/** The line for sexual violence, including from a partner (printed after Singapore). */
export const SEXUAL_VIOLENCE_LINE =
  "Sexual violence, including from a partner: US RAINN 800-656-4673 (text HOPE to 64673) · UK Rape Crisis England & Wales 0808 500 2222 · Australia 1800RESPECT (1800 737 732) · Singapore AWARE Sexual Assault Care Centre 6779 0282 (weekdays 10am to 6pm)";

export const EMERGENCY_LINE =
  "Immediate danger: your local emergency number (999 UK/SG police · 995 SG ambulance · 911 US · 000 AU · 112 EU)";

/**
 * The printed Help Lines list, line by line. registry.json
 * concepts.help-safety.helpLines must equal this verbatim (tests/registry.test.ts),
 * as must the Help Lines in README.md.
 */
export const HELP_LINES_PRINTED: string[] = [
  EMERGENCY_LINE,
  "US: National Domestic Violence Hotline 1-800-799-7233 (text START to 88788) · 988 Suicide & Crisis Lifeline (call/text 988)",
  "UK: National Domestic Abuse Helpline (Refuge) 0808 2000 247 · Samaritans 116 123",
  "Australia: 1800RESPECT 1800 737 732 · Lifeline 13 11 14",
  "Singapore: National Anti-Violence & Sexual Harassment Helpline 1800 777 0000 · SOS 1767",
  SEXUAL_VIOLENCE_LINE,
  "EU: Helpline for women experiencing violence 116 016, where available",
  CHILD_LINE,
  ELSEWHERE_LINE,
];
