import type { Situation } from "./types";

/**
 * The Situation Map: the one 12-row list, in the exact order every map uses
 * (CANON round 5; registry concepts.situation-map.rowsCanonical):
 * follow the first match, top to bottom. Safety routing always comes first;
 * never route "unsafe" to Pause + Return.
 */
export const situations: Situation[] = [
  {
    id: "unsafe",
    label: "I’m afraid, being threatened, or not free to say no",
    description:
      "Afraid of your partner, threats, pressure or control — not just a hard conversation. This includes jealousy that leads to checking, restricting, or accusing.",
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
    id: "outside-pressure",
    label: "Outside pressure or disapproval from family, friends or strangers",
    description:
      "Family disapproval, discrimination or judgement from others is landing on the two of you. Pressure from your partner isn’t this row: Green Rule, or row 1.",
    firstMove: "Unity Anchor: decide together how the couple responds. Never limit a partner’s contact with anyone.",
    primaryHref: "/protocols/unity-anchor",
    secondaryHrefs: [{ label: "Together under pressure", href: "/together" }],
  },
  {
    id: "trust-breach",
    label: "Trust breach",
    description: "Lying, infidelity or a broken agreement.",
    firstMove: "Safety first, then Trust Recovery + Proof. Review the record at the agreed check-in.",
    primaryHref: "/protocols/trust-recovery",
    secondaryHrefs: [{ label: "Proof Protocol", href: "/protocols/proof-protocol" }],
  },
  {
    id: "detachment",
    label: "Pulling away / uninvestment",
    description: "Warmth missing, repairs on autopilot: several signs of pulling away, not just needing space.",
    firstMove:
      "Uninvestment Check. 0 signs: nothing to fix. 1–2: space and small repairs. 3 or more: may be pulling away — book a Full Recovery within a week. Contempt, fear or coercion: stop and get outside support first.",
    primaryHref: "/protocols/uninvestment-check",
    secondaryHrefs: [{ label: "Full Recovery", href: "/protocols/full-recovery" }],
  },
  {
    id: "conflict-starting",
    label: "A fight is starting",
    description: "Tone is rising; it’s starting to feel like a courtroom, not a conversation.",
    firstMove: "System Overlay · Conflict Protocol. Green Rule first; flooded midway → Pause + Return.",
    primaryHref: "/protocols/system-overlay",
    secondaryHrefs: [
      { label: "Conflict Protocol", href: "/protocols/conflict-protocol" },
      { label: "Green Rule (Safety Gate)", href: "/protocols/green-rule" },
    ],
  },
  {
    id: "after-fight",
    label: "After a fight, or something small stung",
    description: "Still feeling the sting, or leftover friction from a sharp tone or a broken small agreement.",
    firstMove: "Micro-Repair: start within minutes if you can; complete within 24 hours. Bigger: Full Recovery; changes: Proof Protocol.",
    primaryHref: "/protocols/micro-repair",
    secondaryHrefs: [
      { label: "Full Recovery", href: "/protocols/full-recovery" },
      { label: "Proof Protocol", href: "/protocols/proof-protocol" },
    ],
  },
  {
    id: "attachment-clash",
    label: "We keep clashing the same way",
    description: "Reach–Recoil (one reaches, the other pulls back), the same ask on repeat, or out of sync on timing (Pace Mismatch).",
    firstMove: "Name the loop out loud. Then do Profile Calibration together to see where you differ.",
    primaryHref: "/calibrate",
    icon: "profile-calibration",
    secondaryHrefs: [{ label: "System Overlay", href: "/protocols/system-overlay" }],
  },
  {
    id: "intimacy-stall",
    label: "Intimacy feels stuck",
    description: "Initiating or declining feels tense; things have gone cold.",
    firstMove: "Start with the Intimacy Pact. If there’s pressure after a no, have a Green Rule talk. If it happens again, or either of you can’t say no, go to Help Lines.",
    primaryHref: "/protocols/intimacy-pact",
    secondaryHrefs: [{ label: "Help Lines", href: "/help" }],
  },
  {
    id: "say-do-gap",
    label: "Saying one thing, doing another",
    description: "Your own follow-through: promises that don’t match what happens.",
    firstMove: "Consistency Pact: a private weekly check. After a breach, add a shared Proof item.",
    primaryHref: "/protocols/consistency-pact",
    secondaryHrefs: [{ label: "Proof Protocol", href: "/protocols/proof-protocol" }],
  },
  {
    id: "daily-drift",
    label: "We feel like housemates",
    description: "Conversations are just logistics; the connection feels thin.",
    firstMove: "Morning + Evening Rhythm. Feels like a chore? Try a Sun Memory, a short break from fixing (Sensory Comfort Inventory). Flat after two weeks? Drift Check.",
    primaryHref: "/protocols/morning-evening-rhythm",
  },
  {
    id: "weekly-maintenance",
    label: "Time for our weekly check-in",
    description: "A short, scheduled catch-up — not a trial.",
    firstMove: "Weekly Reset: about 40 minutes, with the monthly Care Check-in (inside the Weekly Reset).",
    primaryHref: "/weekly-reset",
    secondaryHrefs: [{ label: "Weekly Reset card", href: "/protocols/weekly-reset" }],
  },
];
