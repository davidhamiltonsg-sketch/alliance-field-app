import type { Situation } from "./types";

/**
 * The Situation Map: the one 12-row list, in the exact order every map uses
 * (registry concepts.situation-map.rowsCanonical): take the first row that
 * fits, top to bottom. Safety routing always comes first; never route
 * "unsafe" to Pause + Return. Every row points at one of the 15 tools.
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
      { label: "60-Second Reset", href: "/protocols/60-second-reset" },
    ],
  },
  {
    id: "conflict-starting",
    label: "A fight is starting",
    description: "Voices are rising and you’re both building a case.",
    firstMove: "Say: “I want to connect, not fight. Can we talk at ___?” (60-Second Reset)",
    primaryHref: "/protocols/60-second-reset",
    secondaryHrefs: [
      { label: "Too hot to stay in the room? Pause + Return", href: "/protocols/pause-and-return" },
      { label: "Next: System Overlay", href: "/protocols/system-overlay" },
    ],
  },
  {
    id: "outside-pressure",
    label: "Outside pressure or disapproval from family, friends or strangers",
    description:
      "Family disapproval, discrimination or judgement from others is landing on the two of you. If the pressure is coming from your partner, this isn’t the right tool. If they check, restrict or punish your contact with others, go to Help; otherwise use the Green Rule.",
    firstMove: "Team Agreement: decide together how the two of you respond. Never limit a partner’s contact with anyone.",
    primaryHref: "/protocols/team-agreement",
    secondaryHrefs: [
      { label: "Together", href: "/together" },
      { label: "Green Rule", href: "/protocols/green-rule" },
    ],
  },
  {
    id: "trust-breach",
    label: "Trust breach",
    description:
      "Lying, infidelity or a broken agreement that you both agree happened. Seeing friends or family, privacy or a locked phone is never a breach.",
    firstMove:
      "Safety first, then Trust Recovery. Skip the 7-day plan: start with Trust Recovery, then the Weekly Reset. Agree one change you’ll both see, and look at it together at a set check-in.",
    primaryHref: "/protocols/trust-recovery",
  },
  {
    id: "detachment",
    label: "Pulling away",
    description: "Warmth missing, repairs on autopilot: several signs of pulling away, not just needing space.",
    firstMove:
      "Check-Up: each of you marks what you’ve noticed on one sheet, on your own. Contempt, fear or coercion: stop and get outside support first. A partner who has stopped sharing because they are afraid is not pulling away: use the Help Lines.",
    primaryHref: "/protocols/check-up",
    secondaryHrefs: [{ label: "Full Repair", href: "/protocols/full-repair" }],
  },
  {
    id: "after-fight",
    label: "After a fight, or something small stung",
    description: "Something sharp was said, or a small promise slipped, and it’s still sitting there.",
    firstMove: "Micro-Repair: start within minutes if you can; complete within 24 hours. Bigger hurts go to Full Repair.",
    primaryHref: "/protocols/micro-repair",
    secondaryHrefs: [{ label: "Full Repair", href: "/protocols/full-repair" }],
  },
  {
    id: "attachment-clash",
    label: "We keep clashing the same way",
    description: "Reach–Recoil (one reaches, the other pulls back), the same ask on repeat, or one of you always wanting to talk sooner than the other.",
    firstMove: "Name it out loud: “I think we’re doing the thing again.” Later, when you’re calm, look at the common patterns. To see where you two differ, try Profile Calibration together.",
    goDeeper: "Appendix A: common patterns is in the Manual; for timing clashes, see Chapter 5, Hearing Each Other.",
    primaryHref: "/protocols/profile-calibration",
    icon: "profile-calibration",
    secondaryHrefs: [
      { label: "Start Profile Calibration", href: "/calibrate" },
      { label: "Check-Up", href: "/protocols/check-up" },
    ],
  },
  {
    id: "intimacy-stall",
    label: "Intimacy feels stuck",
    description: "Asking or saying no feels tense; things have gone cold.",
    firstMove:
      "Intimacy Pact. Pressure after a no: stop; don’t talk it through in the moment. The person pressured decides whether, when and with whom to talk. Force, threats, fear or a repeat: Help Lines.",
    primaryHref: "/protocols/intimacy-pact",
    secondaryHrefs: [{ label: "Help Lines", href: "/help" }],
  },
  {
    id: "say-do-gap",
    label: "Saying one thing, doing another",
    description: "Your own follow-through: promises that don’t match what happens.",
    firstMove: "Consistency Pact: a private weekly check. Broke a shared agreement? Tell your partner. After a breach, add a shared Proof item.",
    primaryHref: "/protocols/consistency-pact",
  },
  {
    id: "daily-drift",
    label: "We feel like housemates",
    description: "Conversations are just logistics; the connection feels thin.",
    firstMove: "Daily Rhythm: a morning hello and an evening catch-up. Feels like a chore? Take a night off fixing: a Sun Memory.",
    primaryHref: "/protocols/daily-rhythm",
    secondaryHrefs: [
      { label: "Sun Memory", href: "/protocols/sun-memory" },
      { label: "Check-Up", href: "/protocols/check-up" },
    ],
  },
  {
    id: "weekly-maintenance",
    label: "Time for our weekly check-in",
    description: "A short catch-up at a set time, to keep small things small.",
    firstMove: "Weekly Reset: about 40 minutes (15 is fine to start). The monthly part adds 10 minutes.",
    primaryHref: "/weekly-reset",
    secondaryHrefs: [{ label: "Weekly Reset card", href: "/protocols/weekly-reset" }],
  },
];
