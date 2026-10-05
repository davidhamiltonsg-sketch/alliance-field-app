import type { Tier } from "@/data/types";

/** Plain-word tier labels (SPEC section 1). No dots, no Core/Situational/Build. */
export const TIER_LABEL: Record<Tier, string> = {
  core: "Learn first",
  situational: "When it comes up",
  build: "Build over time",
};

export const TIER_MEANING: Record<Tier, string> = {
  core: "Start here. These six cover most evenings.",
  situational: "For when the Situation Map sends you there.",
  build: "Habits to add once the first six feel familiar.",
};

export const TIER_ORDER: Tier[] = ["core", "situational", "build"];

/** The 15 tools in card order. */
export const TOOL_ORDER = [
  "green-rule", "pause-and-return", "60-second-reset", "micro-repair", "weekly-reset", "system-overlay",
  "full-repair", "trust-recovery", "check-up", "team-agreement", "sun-memory",
  "daily-rhythm", "intimacy-pact", "consistency-pact", "profile-calibration",
];

/** One plain line under each tool name in the Tools list, so no name needs decoding. */
export const PLAIN_SUBTITLE: Record<string, string> = {
  "green-rule": "Safe to be honest",
  "pause-and-return": "A timed break when one of you is flooded",
  "60-second-reset": "Stop a fight before it becomes one to win",
  "micro-repair": "Make up after something small stung",
  "weekly-reset": "A weekly check-in, about 40 minutes",
  "system-overlay": "An order for hard talks",
  "full-repair": "A booked talk for the fight that keeps coming back",
  "trust-recovery": "Rebuild after a lie or a broken promise",
  "check-up": "Notice if you’re drifting apart",
  "team-agreement": "Face outside pressure from the same side",
  "sun-memory": "A break from working on the relationship",
  "daily-rhythm": "A morning hello and an evening catch-up",
  "intimacy-pact": "How asking for sex and saying no work",
  "consistency-pact": "Check privately that you do what you say",
  "profile-calibration": "Where you two differ most",
};

/** Plain words people type, matched in addition to a card's own synonyms field. */
export const SEARCH_HINTS: Record<string, string> = {
  "green-rule": "honest honesty truth safe to say secret hide punished yell yelling shouting afraid scared fear hit hitting pushed shoved violence threatened controlled controlling phone",
  "pause-and-return": "break timeout time out space cool down walk away flooded angry shut down stonewall stonewalling silent treatment yell yelling shouting overwhelmed",
  "60-second-reset": "argument fight starting heated calm quick connect snapping yell yelling shouting raised voice bickering",
  "micro-repair": "sorry apologise apologize snapped sharp tone small hurt make up rude jealous jealousy",
  "weekly-reset": "weekly meeting catch up check in routine schedule talk money finances budget bills spending chores housework load",
  "system-overlay": "system-talk we versus us problem blame who is right money finances budget spending decision hard talk",
  "full-repair": "big fight aftermath make up after a fight apology same fight again recurring stonewalling",
  "trust-recovery": "lied lie cheated affair betrayal betrayed broke trust secret honest proof money hidden debt",
  "check-up": "housemates roommates drifting drift apart distant pulling away lonely cold gap stonewalling silent ignoring jealous jealousy insecure insecurity envy",
  "team-agreement": "family in-laws parents friends outside pressure disapproval racist comments stares jealous jealousy ex",
  "sun-memory": "joy fun good times happy memories laughter",
  "daily-rhythm": "morning evening hello catch up every day habit routine",
  "intimacy-pact": "sex sexual intimacy touch desire mismatch no pressure closeness libido",
  "consistency-pact": "promises follow through broken agreement keep word chores",
  "profile-calibration": "differences personality types questions report misunderstood",
};

/**
 * Words that may mean fear or control rather than an ordinary fight. A search
 * that contains one pins the Help Lines card above the results.
 */
export const SAFETY_SEARCH_WORDS = [
  "jealous", "jealousy", "yell", "yells", "yelling", "hit", "hits", "hitting", "threat", "threats", "threaten",
  "threatens", "threatened", "threatening", "afraid", "scared", "frightened", "fear", "control", "controls",
  "controlling", "controlled", "checking my phone", "checks my phone", "forced", "forces", "force", "abuse",
  "abusive", "violence", "violent",
];
