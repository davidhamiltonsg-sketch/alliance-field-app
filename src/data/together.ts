import { getProtocol } from "./protocols";
import { situations } from "./situations";

/** The Situation Map row this page sends people to (its label, never a copy of it). */
const outsidePressureRow = situations.find((s) => s.id === "outside-pressure")!;

/**
 * /together: outside pressure on a couple (interracial, intercultural and
 * other minority-stress couples). Adapted from the landing copy, without
 * pricing. Tone rules: never assume which partner is in the minority, which
 * family disapproves, or that the pressure is always racial; write about
 * pressure *on* the couple, never about what either partner "is like".
 */

export const TOGETHER_CITATION = {
  text: "Faber, Zare & Williams, “Racial microaggressions in interracial relationships”, Current Opinion in Psychology 68 (2026), article 102270.",
  href: "https://pubmed.ncbi.nlm.nih.gov/41616413/",
} as const;

/** Places outside pressure shows up. Examples only — not a checklist of what any couple faces. */
export const outsideExamples = [
  "a parent who won’t say your partner’s name",
  "a relative’s “joke” at a holiday dinner",
  "the bill handed to the “obvious” person",
  "a shop assistant asking if you two are “together”",
  "forms and customs that assume you’re a different kind of couple",
];

export const whoFor = [
  "Interracial, intercultural and interfaith couples.",
  "Couples facing disapproval because of age gap, class, nationality, migration status, or sexual or gender identity.",
  "Couples where one partner is new to a country, a language or a family’s customs.",
  "Couples where only one of you is ready to start. The Team Agreement is meant for the two of you, but one person can begin by saying: “That’s coming from them, not from us.”",
];

export const notFor = [
  "Relationships with fear, intimidation, coercion or control. If you’re afraid of your partner, couples exercises aren’t the right tool.",
  "Immediate danger, including harassment or threats from other people. Contact local emergency services where it’s safe to do so.",
  "Pressure or put-downs that come from your partner. That isn’t an outside-pressure situation. If they check, restrict or punish your contact with others, use the Help Lines; otherwise use the Green Rule.",
];

export interface CommonMove {
  move: string;
  result: string;
  alliance: string;
}

export const commonMoves: CommonMove[] = [
  {
    move: "Debating whether the comment was “really” racist or rude",
    result: "You end up opponents: one defending, one prosecuting.",
    alliance: "Agree you’re a team on this before you work out what it was. After a cousin’s remark at a wedding, one of you might say: “That was about them, not us.” The other: “Agreed. We can talk about what it meant once we’re home, or not at all.”",
  },
  {
    move: "“Just ignore it”",
    result: "One of you ends up carrying it alone.",
    alliance: "Ask what each of you needs: reassurance, a plan, or a chance to vent.",
  },
  {
    move: "The partner whose family it is handles it alone",
    result: "You both end up resenting it.",
    alliance: "Agree the response together, so neither of you is deciding alone.",
  },
  {
    move: "Re-arguing it after every visit",
    result: "You have the same argument every holiday.",
    alliance: "Agree your response together before the next visit, not after it.",
  },
];

/**
 * The Team Agreement: one step list for outside pressure, mirrored word for
 * word from the card (src/data/cards/team-agreement.json; Manual Chapter 16).
 * "Believe first" is the first line for the partner who is told.
 */
const teamAgreementCard = getProtocol("team-agreement")!;

export const teamAgreement = {
  steps: teamAgreementCard.steps,
  phrases: teamAgreementCard.phrases,
  /** Said once, in the safety note: being out is each person's own decision. */
  outingLine:
    "Whether to be out is each person’s own decision. No agreement can require either of you to hide who you are or to be outed.",
} as const;

export const togetherTools = [
  {
    label: "Situation Map",
    href: "/",
    note: `Pick “${outsidePressureRow.label}” — it goes straight to the first move.`,
  },
  {
    label: "Weekly Reset",
    href: "/weekly-reset",
    note: "A set time, before the holidays or the next visit, to agree how you’ll handle it.",
  },
  {
    label: "Pause + Return",
    href: "/protocols/pause-and-return",
    note: "When outside pressure has already turned into a fight between you.",
  },
  {
    label: "Micro-Repair",
    href: "/protocols/micro-repair",
    note: "Small repairs after a comment has stung at home.",
  },
];

export const togetherFaq = [
  {
    q: "Is this only for interracial couples?",
    a: "No. Every tool is for any couple. This page gathers the parts that deal with outside pressure, which interracial couples, and others who stand out, often meet more of.",
  },
  {
    q: "Does it tell me how to handle my partner’s family?",
    a: "It helps the two of you agree how you’ll respond. It won’t tell either of you to cut anyone off, and no tool is ever used to limit a partner’s contact with their family.",
  },
  {
    q: "What if one of us doesn’t see what the other sees?",
    a: "That’s common. The Team Agreement starts by treating the strain as real, and as coming from outside, so you don’t have to win an argument about each incident before you can support each other.",
  },
];
