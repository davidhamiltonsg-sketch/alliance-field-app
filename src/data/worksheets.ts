/**
 * The 7 Field Kit worksheets (CANON round 4). Checked against registry.json
 * and KIT.worksheets by tests/registry.test.ts.
 */
export interface Worksheet {
  id: string;
  name: string;
  /** Protocol cards this worksheet supports. */
  protocols: string[];
  /** Named parts inside the worksheet, if it has more than one. */
  parts?: string[];
  /** One plain-English line on what's inside, shown after the name. */
  detail?: string;
}

export const worksheets: Worksheet[] = [
  { id: "pause-and-return-defaults", name: "Pause + Return Defaults", protocols: ["pause-and-return"] },
  { id: "weekly-reset-agenda", name: "Weekly Reset Agenda", protocols: ["weekly-reset"] },
  { id: "profile-calibration", name: "Profile Calibration", protocols: [] },
  { id: "sensory-baseline-inventory", name: "Sensory Comfort Inventory", protocols: [] },
  {
    id: "pacts-worksheet",
    name: "Pacts Worksheet",
    protocols: ["intimacy-pact", "consistency-pact"],
    parts: ["Intimacy Pact", "Consistency Pact"],
    detail: "one section for each pact",
  },
  {
    id: "failure-mode-diagnostic",
    name: "Drift Check",
    protocols: ["system-overlay"],
    parts: ["Drift Check", "Circuit Spotter"],
    detail: "with the Circuit Spotter: a circuit is a repeating loop between you",
  },
  { id: "uninvestment-check-worksheet", name: "Uninvestment Check Worksheet", protocols: ["uninvestment-check"] },
];

export function worksheetsFor(slug: string): Worksheet[] {
  return worksheets.filter((w) => w.protocols.includes(slug));
}
