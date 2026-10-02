export type ConnectionStage = "warmth" | "curiosity" | "care" | "repair" | "alliance";

export interface ConnectionCard {
  id: string;
  stage: ConnectionStage;
  question: string;
}

export const STAGE_META: Record<
  ConnectionStage,
  { label: string; caption: string }
> = {
  warmth: {
    label: "Warmth",
    caption: "Nothing heavy here. Use when you’re distant or just back from a pause.",
  },
  curiosity: {
    label: "Curiosity",
    caption: "Catch up on each other: what’s changed lately, for either of you.",
  },
  care: {
    label: "Care",
    caption: "Notice what your partner is carrying, and say it out loud.",
  },
  repair: {
    label: "Repair",
    caption: "For after friction — talk it through without re-arguing it.",
  },
  alliance: {
    label: "Alliance",
    caption: "Questions about where the two of you are heading.",
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
 * Connection Cards — a flip-card deck for coming back to each other, organised
 * by five kinds of question along the Alliance arc (Warmth → Curiosity → Care → Repair →
 * Alliance). Concrete, specific questions in everyday words.
 */
export const connectionCards: ConnectionCard[] = [
  // Warmth
  { id: "w1", stage: "warmth", question: "What’s one thing about today that you’re glad happened?" },
  { id: "w2", stage: "warmth", question: "What’s a small thing I did this week that you noticed?" },
  { id: "w3", stage: "warmth", question: "When did you feel most relaxed this week, and where were you?" },
  { id: "w4", stage: "warmth", question: "What made you laugh recently — even a little?" },
  { id: "w5", stage: "warmth", question: "If we had one free hour tonight, what would you actually want to do?" },
  { id: "w6", stage: "warmth", question: "What’s one thing you’re looking forward to this week?" },
  { id: "w7", stage: "warmth", question: "Say one true, specific thing you like about me right now." },

  // Curiosity
  { id: "c1", stage: "curiosity", question: "What’s something you’ve changed your mind about in the last year?" },
  { id: "c2", stage: "curiosity", question: "What’s taking up the most space in your head lately?" },
  { id: "c3", stage: "curiosity", question: "What’s a skill or interest you’d like more time for right now?" },
  { id: "c4", stage: "curiosity", question: "Who outside us have you been leaning on lately, and for what?" },
  { id: "c5", stage: "curiosity", question: "What’s something you’re proud of that you haven’t said out loud?" },
  { id: "c6", stage: "curiosity", question: "What’s a question you wish I’d ask you more often?" },
  { id: "c7", stage: "curiosity", question: "What’s one way you’ve grown in the last six months?" },

  // Care
  { id: "ca1", stage: "care", question: "What’s one thing on your plate right now that feels heavier than it should?" },
  { id: "ca2", stage: "care", question: "Where do you feel most supported by me? Where the least?" },
  { id: "ca3", stage: "care", question: "What would make tomorrow a little easier for you?" },
  { id: "ca4", stage: "care", question: "When did you last feel truly looked after — by anyone?" },
  { id: "ca5", stage: "care", question: "What’s something I could take off your list this week?" },
  { id: "ca6", stage: "care", question: "What’s one way I show care that really lands for you?" },
  { id: "ca7", stage: "care", question: "What did you carry this week that I didn’t notice? I’d like to thank you for it." },

  // Repair
  { id: "r1", stage: "repair", question: "What’s a friction point from this week that we haven’t actually named yet?" },
  { id: "r2", stage: "repair", question: "When we last disagreed, what did you need that you didn’t ask for?" },
  { id: "r3", stage: "repair", question: "What’s one specific thing I could do differently next time we’re stuck?" },
  { id: "r4", stage: "repair", question: "Is there something small I did recently that came across wrong, even if it wasn’t a big deal?" },
  { id: "r5", stage: "repair", question: "How can I tell when you’re ready to talk, and when you’re going quiet?" },
  { id: "r6", stage: "repair", question: "What’s something we agreed after a past argument that’s slipped? Worth saying again?" },
  { id: "r7", stage: "repair", question: "What’s the difference between you needing space and you pulling away? How would I tell?" },

  // Alliance
  { id: "a1", stage: "alliance", question: "What’s one thing we’re building right now that you’re genuinely excited about?" },
  { id: "a2", stage: "alliance", question: "If we’re doing this right, what does an ordinary weeknight look like a year from now?" },
  { id: "a3", stage: "alliance", question: "What’s one of our habits that’s really working and worth keeping?" },
  { id: "a4", stage: "alliance", question: "What’s one way we could back each other up more visibly, in front of other people?" },
  { id: "a5", stage: "alliance", question: "What’s something you want us to be known for, as a team?" },
  { id: "a6", stage: "alliance", question: "What’s one thing about us that you hope never changes?" },
  { id: "a7", stage: "alliance", question: "What’s one hard thing we got through together that you’re still proud of?" },
];
