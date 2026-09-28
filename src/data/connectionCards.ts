export type ConnectionStage = "warmth" | "curiosity" | "care" | "repair" | "alliance";

export interface ConnectionCard {
  id: string;
  stage: ConnectionStage;
  question: string;
}

export const STAGE_META: Record<
  ConnectionStage,
  { label: string; caption: string; accentHint: "accent" | "pause" | "repair" | "safety" }
> = {
  warmth: {
    label: "Warmth",
    caption: "Low-stakes. Use when you're distant or just back from a pause.",
    accentHint: "pause",
  },
  curiosity: {
    label: "Curiosity",
    caption: "Get re-acquainted. What's changed lately, in them or in you.",
    accentHint: "accent",
  },
  care: {
    label: "Care",
    caption: "Notice and name what the other person is carrying.",
    accentHint: "safety",
  },
  repair: {
    label: "Repair",
    caption: "For after friction — process it without relitigating it.",
    accentHint: "repair",
  },
  alliance: {
    label: "Alliance",
    caption: "Future-facing. What you're building together, on purpose.",
    accentHint: "accent",
  },
};

export const STAGE_ORDER: ConnectionStage[] = [
  "warmth",
  "curiosity",
  "care",
  "repair",
  "alliance",
];

/**
 * Connection Cards — a flip-card deck for coming back to each other, organized
 * by the five stages of the Alliance arc (Warmth → Curiosity → Care → Repair →
 * Alliance). Concrete, specific questions — no therapy-speak, no abstractions.
 */
export const connectionCards: ConnectionCard[] = [
  // Warmth
  { id: "w1", stage: "warmth", question: "What's one thing about today that you're glad happened?" },
  { id: "w2", stage: "warmth", question: "What's a small thing I did this week that actually landed?" },
  { id: "w3", stage: "warmth", question: "Where in your body do you feel most relaxed right now?" },
  { id: "w4", stage: "warmth", question: "What made you laugh recently — even a little?" },
  { id: "w5", stage: "warmth", question: "If we had one free hour tonight, what would you actually want to do?" },
  { id: "w6", stage: "warmth", question: "What's one thing you're looking forward to this week?" },
  { id: "w7", stage: "warmth", question: "Say one true, specific thing you like about me right now." },

  // Curiosity
  { id: "c1", stage: "curiosity", question: "What's something you've changed your mind about in the last year?" },
  { id: "c2", stage: "curiosity", question: "What's taking up the most space in your head lately?" },
  { id: "c3", stage: "curiosity", question: "What's a skill or interest you'd like more time for right now?" },
  { id: "c4", stage: "curiosity", question: "Who outside us have you been leaning on lately, and for what?" },
  { id: "c5", stage: "curiosity", question: "What's something you're proud of that you haven't said out loud?" },
  { id: "c6", stage: "curiosity", question: "What's a question you wish I'd ask you more often?" },
  { id: "c7", stage: "curiosity", question: "What's one way you've grown in the last six months?" },

  // Care
  { id: "ca1", stage: "care", question: "What's one thing on your plate right now that feels heavier than it should?" },
  { id: "ca2", stage: "care", question: "Where do you feel most supported by me? Where the least?" },
  { id: "ca3", stage: "care", question: "What would make tomorrow 10% easier for you?" },
  { id: "ca4", stage: "care", question: "When did you last feel truly looked after — by anyone?" },
  { id: "ca5", stage: "care", question: "What's something I could take off your list this week?" },
  { id: "ca6", stage: "care", question: "What's a way I show care that actually works for you — do more of that." },
  { id: "ca7", stage: "care", question: "Name one thing you did for us this week that went unnoticed." },

  // Repair
  { id: "r1", stage: "repair", question: "What's a friction point from this week that we haven't actually named yet?" },
  { id: "r2", stage: "repair", question: "When we last disagreed, what did you need that you didn't ask for?" },
  { id: "r3", stage: "repair", question: "What's one specific thing I could do differently next time we're stuck?" },
  { id: "r4", stage: "repair", question: "Is there something small I did recently that landed wrong, even if it wasn't a big deal?" },
  { id: "r5", stage: "repair", question: "What does it look like when you're actually ready to talk, versus just going quiet?" },
  { id: "r6", stage: "repair", question: "What's one agreement from a past repair that's slipped — worth restating?" },
  { id: "r7", stage: "repair", question: "What's the difference between you needing space and you pulling away? How would I tell?" },

  // Alliance
  { id: "a1", stage: "alliance", question: "What's one thing we're building right now that you're genuinely excited about?" },
  { id: "a2", stage: "alliance", question: "If we're doing this right, what does a random Tuesday look like a year from now?" },
  { id: "a3", stage: "alliance", question: "What's a rule of ours that's actually working — worth keeping on purpose?" },
  { id: "a4", stage: "alliance", question: "What's one way we could back each other up more visibly, in front of other people?" },
  { id: "a5", stage: "alliance", question: "What's something you want us to be known for, as a team?" },
  { id: "a6", stage: "alliance", question: "Say it plainly: what does 'the Alliance' mean to you right now?" },
  { id: "a7", stage: "alliance", question: "What's one thing we made it through that you're still proud we didn't quit on?" },
];
