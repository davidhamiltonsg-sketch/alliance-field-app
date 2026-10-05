/**
 * The 5 Field Kit worksheets (SPEC section 4). Checked against registry.json
 * and KIT.worksheets by tests/registry.test.ts.
 */
export interface Worksheet {
  id: string;
  name: string;
  /** Tool cards this worksheet supports. */
  protocols: string[];
  /** Named parts inside the worksheet, if it has more than one. */
  parts?: string[];
  /** One plain-English line on what's inside, shown after the name. */
  detail?: string;
}

export const worksheets: Worksheet[] = [
  { id: "pause-times", name: "Pause times", protocols: ["pause-and-return"] },
  { id: "weekly-reset-agenda", name: "Weekly Reset agenda", protocols: ["weekly-reset"] },
  { id: "profile-calibration", name: "Profile Calibration", protocols: ["profile-calibration"] },
  {
    id: "pacts-sheet",
    name: "Pacts sheet",
    protocols: ["intimacy-pact", "consistency-pact"],
    parts: ["Intimacy Pact", "Consistency Pact"],
    detail: "one section for each pact",
  },
  {
    id: "check-up-sheet",
    name: "Check-Up sheet",
    protocols: ["check-up"],
    detail: "one sheet, three lenses: drifting apart, pulling away, and gaps between what you say and do",
  },
];

export function worksheetsFor(slug: string): Worksheet[] {
  return worksheets.filter((w) => w.protocols.includes(slug));
}
