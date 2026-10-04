import type { Protocol } from "./types";

import card0 from "./cards/pause-and-return.json";
import card1 from "./cards/60-second-reset.json";
import card2 from "./cards/green-rule.json";
import card3 from "./cards/system-overlay.json";
import card4 from "./cards/weekly-reset.json";
import card6 from "./cards/micro-repair.json";
import card8 from "./cards/morning-evening-rhythm.json";
import card9 from "./cards/intimacy-pact.json";
import card10 from "./cards/trust-recovery.json";
import card11 from "./cards/consistency-pact.json";
import card12 from "./cards/full-recovery.json";
import card13 from "./cards/uninvestment-check.json";

export const protocols = [card0, card1, card2, card3, card4, card6, card8, card9, card10, card11, card12, card13] as Protocol[];

export const protocolSlugs = protocols.map((p) => p.slug);

export function getProtocol(slug: string): Protocol | undefined {
  return protocols.find((p) => p.slug === slug);
}
