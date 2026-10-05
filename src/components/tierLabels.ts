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

/** The 15 tools in card order (new slugs first, older slugs kept so the page works on either data set). */
export const TOOL_ORDER = [
  "green-rule", "pause-and-return", "60-second-reset", "micro-repair", "weekly-reset", "system-overlay",
  "full-repair", "full-recovery", "trust-recovery", "check-up", "uninvestment-check", "team-agreement", "unity-anchor", "sun-memory",
  "daily-rhythm", "morning-evening-rhythm", "intimacy-pact", "consistency-pact", "profile-calibration",
];

/** Plain words people type, matched in addition to a card's own synonyms field. */
export const SEARCH_HINTS: Record<string, string> = {
  "green-rule": "honest honesty truth safe to say lie lied lying secret hide",
  "pause-and-return": "break timeout time out space cool down walk away flooded angry shut down",
  "60-second-reset": "argument fight starting heated calm quick connect snapping",
  "micro-repair": "sorry apologise apologize snapped sharp tone small hurt make up",
  "weekly-reset": "weekly meeting catch up check in routine schedule talk",
  "system-overlay": "system-talk we versus us problem blame who is right",
  "full-repair": "big fight aftermath make up after a fight apology",
  "full-recovery": "big fight aftermath make up after a fight apology",
  "trust-recovery": "lied lie cheated affair betrayal broke trust secret affair honest proof",
  "check-up": "housemates roommates drifting drift apart distant pulling away lonely cold gap",
  "uninvestment-check": "housemates roommates drifting drift apart distant pulling away lonely cold gap",
  "team-agreement": "family in-laws parents friends outside pressure disapproval racist comments stares",
  "unity-anchor": "family in-laws parents friends outside pressure disapproval racist comments stares",
  "sun-memory": "joy fun good times happy memories laughter",
  "daily-rhythm": "morning evening hello catch up every day habit routine",
  "morning-evening-rhythm": "morning evening hello catch up every day habit routine",
  "intimacy-pact": "sex intimacy touch desire mismatch no pressure jealous closeness",
  "consistency-pact": "promises follow through broken agreement jealous keep word chores",
  "profile-calibration": "differences personality types layer scan questions",
};
