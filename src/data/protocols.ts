import type { Protocol } from "./types";

import card0 from "./cards/green-rule.json";
import card1 from "./cards/pause-and-return.json";
import card2 from "./cards/60-second-reset.json";
import card3 from "./cards/micro-repair.json";
import card4 from "./cards/weekly-reset.json";
import card5 from "./cards/system-overlay.json";
import card6 from "./cards/full-repair.json";
import card7 from "./cards/trust-recovery.json";
import card8 from "./cards/check-up.json";
import card9 from "./cards/team-agreement.json";
import card10 from "./cards/sun-memory.json";
import card11 from "./cards/daily-rhythm.json";
import card12 from "./cards/intimacy-pact.json";
import card13 from "./cards/consistency-pact.json";
import card14 from "./cards/profile-calibration.json";

/** The 15 tools, in tier order: six to learn first, five for when it comes up, four to build over time. */
export const protocols = [card0, card1, card2, card3, card4, card5, card6, card7, card8, card9, card10, card11, card12, card13, card14] as Protocol[];

export const protocolSlugs = protocols.map((p) => p.slug);

export function getProtocol(slug: string): Protocol | undefined {
  return protocols.find((p) => p.slug === slug);
}
