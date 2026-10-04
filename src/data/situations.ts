import type { Situation } from "./types";

/**
 * The Situation Map: the one 12-row list, in the exact order every map uses
 * (CANON round 5; registry concepts.situation-map.rowsCanonical):
 * take the first row that fits, top to bottom. Safety routing always comes first;
 * never route "unsafe" to Pause + Return.
 */
export const situations: Situation[] = [
  {
    id: "unsafe",
    label: "I’m afraid, being threatened, or not free to say no",
    description:
      "You’re afraid of your partner, or being threatened, pressured or controlled, and it’s more than a hard conversation. This includes jealousy that leads to checking, restricting, or accusing.",
    firstMove: "Stop. These tools are not for this. Get outside help (see Help Lines).",
    primaryHref: "/help",
    danger: true,
  },
  {
    id: "flooded",
    label: "I’m flooded or shut down (but safe)",
    description: "Racing heart, tunnel vision, can’t think straight, urge to flee or win.",
    firstMove: "Pause + Return, with an exact return time. For flooding, never for fear.",
    primaryHref: "/protocols/pause-and-return",
    secondaryHrefs: [
      { label: "Start timer", href: "/pause" },
      { label: "60-Second Alliance Reset", href: "/protocols/60-second-reset" },
    ],
  },
  {
    id: "conflict-starting",
    label: "A fight is starting",
    description: "Voices are rising and you’re both building a case.",
    firstMove: "Check it’s safe to speak (Green Rule). Then use the System Overlay: the quick version if you can hear the sniping start, the full five steps if it’s already a fight. If either of you floods partway through, switch to Pause + Return.",
    primaryHref: "/protocols/system-overlay",
    secondaryHrefs: [
      { label: "Green Rule (Honesty Gate)", href: "/protocols/green-rule" },
      { label: "Pause + Return", href: "/protocols/pause-and-return" },
    ],
  },
  {
    id: "outside-pressure",
    label: "Outside pressure or disapproval from family, friends or strangers",
    description:
      "Family disapproval, discrimination or judgement from others is landing on the two of you. If the pressure is coming from your partner, this isn’t the right tool. Go to the Green Rule, or to Help if you’re afraid.",
    firstMove: "Team agreement: decide together how the couple responds. Never limit a partner’s contact with anyone.",
    primaryHref: "/together",
    secondaryHrefs: [{ label: "Green Rule (Honesty Gate)", href: "/protocols/green-rule" }],
  },
  {
    id: "trust-breach",
    label: "Trust breach",
    description: "Lying, infidelity or a broken agreement.",
    firstMove: "Safety first, then Trust Recovery. Agree one change you’ll both see, and look at it together at a set check-in.",
    primaryHref: "/protocols/trust-recovery",
  },
  {
    id: "detachment",
    label: "Pulling away",
    description: "Warmth missing, repairs on autopilot: several signs of pulling away, not just needing space.",
    firstMove:
      "Pulling-Away Check: each of you marks the signs on your own, then compare. Three or more: one or both of you may be pulling away. Bring back the daily floor and your check-ins for two weeks; if nothing has shifted, book a Full Recovery conversation. Contempt, fear or coercion: stop and get outside support first.",
    primaryHref: "/protocols/uninvestment-check",
    secondaryHrefs: [{ label: "Full Recovery", href: "/protocols/full-recovery" }],
  },
  {
    id: "after-fight",
    label: "After a fight, or something small stung",
    description: "Something sharp was said, or a small promise slipped, and it’s still sitting there.",
    firstMove: "Micro-Repair: start within minutes if you can; complete within 24 hours. Bigger hurts go to Full Recovery.",
    primaryHref: "/protocols/micro-repair",
    secondaryHrefs: [
      { label: "Full Recovery", href: "/protocols/full-recovery" },
    ],
  },
  {
    id: "attachment-clash",
    label: "We keep clashing the same way",
    description: "Reach–Recoil (one reaches, the other pulls back), the same ask on repeat, or one of you always wanting to talk sooner than the other.",
    firstMove: "Name it out loud: “I think we’re doing the thing again.” Later, when you’re calm, find it in the Loop Library. To see where you two differ, try Profile Calibration together.",
    goDeeper: "The Loop Library is Manual Appendix A; for timing clashes, see Manual Ch\u00a0X.",
    primaryHref: "/calibrate",
    icon: "profile-calibration",
    secondaryHrefs: [{ label: "System Overlay", href: "/protocols/system-overlay" }],
  },
  {
    id: "intimacy-stall",
    label: "Intimacy feels stuck",
    description: "Asking or saying no feels tense; things have gone cold.",
    firstMove: "Intimacy Pact. Pressure after a no: stop. If you both feel safe, have a Green Rule talk. Again, or either of you can’t say no: stop and use the Help Lines.",
    primaryHref: "/protocols/intimacy-pact",
    secondaryHrefs: [{ label: "Help Lines", href: "/help" }],
  },
  {
    id: "say-do-gap",
    label: "Saying one thing, doing another",
    description: "Your own follow-through: promises that don’t match what happens.",
    firstMove: "Consistency Pact: a private weekly check. After a breach, add a shared Proof item.",
    primaryHref: "/protocols/consistency-pact",
  },
  {
    id: "daily-drift",
    label: "We feel like housemates",
    description: "Conversations are just logistics; the connection feels thin.",
    firstMove: "Morning + Evening Rhythm. Feels like a chore? Take a night off fixing: a Sun Memory.",
    primaryHref: "/protocols/morning-evening-rhythm",
  },
  {
    id: "weekly-maintenance",
    label: "Time for our weekly check-in",
    description: "A short catch-up at a set time, to keep small things small.",
    firstMove: "Weekly Reset: about 40 minutes. Once a month, it includes a look back over the whole month.",
    primaryHref: "/weekly-reset",
    secondaryHrefs: [{ label: "Weekly Reset card", href: "/protocols/weekly-reset" }],
  },
];
