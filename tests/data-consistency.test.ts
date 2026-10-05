import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { aboutAuthors, authorNames, authorsCoupleLine } from "@/data/authors";
import { coreSix, coreSixSlugs } from "@/data/core6";
import { KIT } from "@/data/kit";
import { ELSEWHERE_LINE, HELP_LINES_POINTER, HELP_LINES_REGIONS, emergencyNumbers, helpRegions } from "@/data/help";
import { getProtocol, protocolSlugs, protocols } from "@/data/protocols";
import { situations } from "@/data/situations";
import registry from "@/data/registry.json";
import { START_PLAN_DAYS, START_NOTES, TONIGHT, startDays } from "@/data/start";
import { TOGETHER_CITATION, commonMoves, togetherFaq, teamAgreement, togetherTools, whoFor } from "@/data/together";
import { protocolDiagrams } from "@/data/visuals/protocol-diagrams";
import { precacheUrls } from "../scripts/generate-sw.mjs";
import { ACCESS_COOKIE } from "@/lib/launch-lock";
import { CONTACT_EMAIL, FULL_SYSTEM_URL, httpsUrlOrNull } from "@/lib/links";

const appDir = join(__dirname, "../src/app");
const pageSource = (route: string) => readFileSync(join(appDir, route, "page.tsx"), "utf8");
const componentSource = (name: string) => readFileSync(join(__dirname, "../src/components", `${name}.tsx`), "utf8");

const cardsDir = join(__dirname, "../src/data/cards");
const cardFiles = readdirSync(cardsDir).filter((f) => f.endsWith(".json"));

describe("protocol cards", () => {
  it("has exactly the 15 tool cards, all registered", () => {
    expect(protocols).toHaveLength(15);
    expect(protocols).toHaveLength(KIT.protocolCards);
    expect(cardFiles).toHaveLength(KIT.protocolCards);
    expect(new Set(protocolSlugs).size).toBe(protocolSlugs.length);
    for (const f of cardFiles) {
      const slug = JSON.parse(readFileSync(join(cardsDir, f), "utf8")).slug;
      expect(f).toBe(`${slug}.json`);
      expect(getProtocol(slug)).toBeDefined();
    }
  });

  it("every card has synonyms for search", () => {
    for (const p of protocols) {
      expect(Array.isArray(p.synonyms), p.slug).toBe(true);
      expect(p.synonyms.length, p.slug).toBeGreaterThanOrEqual(6);
    }
  });

  it("every card has a step diagram with the same number of steps", () => {
    for (const p of protocols) {
      const diagram = protocolDiagrams[p.slug];
      expect(diagram, `diagram for ${p.slug}`).toBeDefined();
      expect(diagram.steps.length, `${p.slug} step count`).toBe(p.steps.length);
    }
  });

  it("diagram step titles use the card's step names (voice pass 38)", () => {
    for (const p of protocols) {
      protocolDiagrams[p.slug].steps.forEach((s, i) => {
        expect(p.steps[i].startsWith(s.title), `${p.slug} step ${i + 1}: “${s.title}”`).toBe(true);
      });
    }
  });

  it("has no diagram without a card", () => {
    for (const slug of Object.keys(protocolDiagrams)) expect(protocolSlugs).toContain(slug);
  });

  it("cross-links only point at real routes", () => {
    const routes = new Set(precacheUrls());
    for (const p of protocols) {
      for (const link of p.crossLinks) {
        if (link.href) expect(routes, `${p.slug} → ${link.href}`).toContain(link.href);
      }
    }
  });
});

describe("numbers and wording", () => {
  it("Pause + Return is 20 minutes to 24 hours", () => {
    const badge = protocolDiagrams["pause-and-return"].steps.find((s) => s.title === "Set a time")?.badge;
    expect(badge).toBe("20 min – 24 h");
    expect(getProtocol("pause-and-return")!.steps.join(" ")).toContain("at least 20 minutes and at most 24 hours away");
    expect(KIT.pauseMinMinutes).toBe(20);
    expect(KIT.pauseMaxMinutes).toBe(1440);
  });

  it("no card or diagram offers a pause shorter than 20 minutes", () => {
    const collect = (v: unknown): string[] =>
      typeof v === "string" ? [v] : v && typeof v === "object" ? Object.values(v).flatMap(collect) : [];
    const strings = collect([protocols, protocolDiagrams])
      .flatMap((text) => text.split(/(?<=[.!?”])\s+/))
      .filter((sentence) => /pause/i.test(sentence));
    expect(strings.length).toBeGreaterThan(0);
    for (const sentence of strings) {
      expect(sentence).not.toMatch(/\b(10|15|ten|fifteen)[- ]?min/i);
    }
  });

  it("Weekly Reset is five parts of about 40 minutes (5/15/15/5), plus the monthly part", () => {
    const card = getProtocol("weekly-reset")!;
    expect(card.steps).toHaveLength(KIT.weeklyResetParts + 1);
    expect(card.concept).toContain("About 40 minutes, five short parts");
    expect(card.concept).toContain("15 minutes is fine to start");
    expect(card.activity).toContain("40-minute timer");
    const badges = protocolDiagrams["weekly-reset"].steps.map((s) => s.badge ?? "");
    const minutes = badges.map((b) => Number(b.match(/^(\d+) min/)?.[1] ?? 0));
    expect(minutes.reduce((a, b) => a + b, 0)).toBe(KIT.weeklyResetMinutes);
    // The monthly part adds 10 minutes; the yearly part is 1 to 2 hours.
    expect(card.steps[5]).toMatch(/^Monthly part, once a month, adds 10 minutes/);
    expect(card.note).toMatch(/^Yearly part, 1 to 2 hours once a year/);
    expect(KIT.weeklyResetMonthlyExtraMinutes).toBe(10);
    expect(KIT.weeklyResetStartMinutes).toBe(15);
  });

  it("Weekly Reset parts: Requests, then Next steps, then the monthly part", () => {
    const card = getProtocol("weekly-reset")!;
    expect(card.steps[3]).toMatch(/^Requests/);
    expect(card.steps[4]).toMatch(/^Next steps/);
    expect(protocolDiagrams["weekly-reset"].steps.map((s) => s.title).slice(3)).toEqual(["Requests", "Next steps", "Monthly part"]);
  });

  it("Check-Up: one tool, three lenses; safety first; compare only if you both want to", () => {
    const card = getProtocol("check-up")!;
    expect(card.concept).toContain("One sheet, three lenses");
    for (const lens of ["Lens 1, drifting apart", "Lens 2, pulling away", "Lens 3, say-and-do gaps"]) expect(card.activity).toContain(lens);
    expect(card.activity.match(/\(\d\)/g)).toHaveLength(8);
    expect(card.steps[0]).toMatch(/^Safety first\. Contempt, fear or coercion: stop and get outside support\./);
    expect(card.steps[0]).toContain("Never use the signs to question where your partner goes, who they see or what they plan.");
    expect(card.steps[0]).toContain("A partner who has stopped sharing because they are afraid is not pulling away: use the Help Lines.");
    expect(card.steps[2]).toContain("Either of you may decline to compare counts.");
    expect(card.steps.join(" ")).toContain("agree a Full Repair date if you both want to; either of you may say no.");
    expect(card.warn).toContain("Contempt, fear or coercion at any count: stop");
    expect(card.warn).toContain("It is not a verdict");
    expect(card.safetyLink).toBe(true);
    expect(JSON.stringify(card)).not.toMatch(/before you leave the table/);
  });

  it("states the anti-weaponisation guardrails on the relevant cards", () => {
    expect(getProtocol("intimacy-pact")!.warn).toMatch(/Afraid of your partner|no/);
    expect(JSON.stringify(getProtocol("intimacy-pact"))).toContain("A no costs nothing and needs no reason.");
    expect(teamAgreement.steps.join(" ")).toContain("never how much contact your partner has");
    expect(getProtocol("trust-recovery")!.steps.join(" ")).toContain("never becomes monitoring");
    expect(JSON.stringify(teamAgreement)).not.toMatch(/how much access they get/);
  });

  it("uses canonical names", () => {
    const text = JSON.stringify(protocols);
    expect(text).not.toMatch(/Care Audit|Tempo Mismatch|Manager Imbalance|Abuse guardrail|push-pull/i);
  });
});

describe("tools: guardrails and safety wording (spec section 6)", () => {
  const LEAVING = "Deciding not to rebuild, or to end the relationship, is a valid outcome of this tool, not a failure of it.";
  const all = (slug: string) => JSON.stringify(getProtocol(slug));

  it("says leaving is valid on Trust Recovery, Full Repair and the Check-Up", () => {
    for (const slug of ["trust-recovery", "full-repair", "check-up"]) {
      expect(getProtocol(slug)!.note, slug).toBe(LEAVING);
    }
    expect(componentSource("ProtocolLayout")).toContain("protocol.note");
  });

  it("Micro-Repair uses the one canonical window", () => {
    const text = [all("micro-repair"), JSON.stringify(protocolDiagrams["micro-repair"])].join(" ");
    expect(text.toLowerCase()).toContain("start within minutes if you can; finish within 24 hours");
    expect(text).not.toMatch(/48[- ]hour|within (10|ten) minutes/i);
  });

  it("Full Repair and Trust Recovery handle one-sided breaches", () => {
    const full = getProtocol("full-repair")!.steps.join(" ");
    expect(full).toContain("only that partner acknowledges impact; the hurt partner is never asked to confess in return");
    expect(full).toContain("only if it’s true for both of you");
    expect(getProtocol("trust-recovery")!.steps[0]).toContain("never asked to confess in return");
  });

  it("Full Repair: 60 to 90 minutes, and either of you may say no to booking it", () => {
    expect(all("full-repair")).toContain("60 to 90 minutes");
  });

  it("Trust Recovery: a breach is something the partner agrees they did; proof windows; pauses noted only if the one pausing agrees", () => {
    const trust = getProtocol("trust-recovery")!;
    const text = all("trust-recovery");
    expect(text).toMatch(/breach/);
    expect(trust.warn).toMatch(/agree|refus|voluntary/i);
    expect(trust.steps[2]).toContain("two to four weeks to start (1 to 2 weeks for a smaller agreed breach)");
    expect(trust.steps[3]).toContain("noted only if the one pausing agrees");
    expect(trust.steps[4]).toContain("the hurt partner’s feelings and questions come first");
    expect(trust.steps[4]).toContain("The record is an aid, never the judge");
    expect(trust.safetyLink).toBe(true);
  });

  it("Intimacy Pact: the review is about how asking and no feel, never how often; pressure after a no stops the tool", () => {
    const card = getProtocol("intimacy-pact")!;
    expect(card.steps[0]).toBe("Asking? Think first about how it will land for the other person tonight. If you’re declining, you owe nothing. No is enough.");
    expect(card.steps[3]).toContain("ask, and wait for a clear yes.");
    expect(card.steps[4]).toContain("The review is about how asking and saying no feel, never about how often.");
    expect(card.steps[4]).toContain("Either of you can skip or postpone it. “Stalled” is never a reason to ask more.");
    const last = card.steps.at(-1)!;
    expect(last).toContain("don’t try to patch intimacy on top");
    expect(last).toContain("The one pressured decides whether, when and with whom to talk.");
    expect(last).toContain("Force, threats, fear or a repeat: use the Help Lines.");
    expect(card.warn).toMatch(/Help Lines/);
    expect(card.safetyLink).toBe(true);
    expect(JSON.stringify(protocolDiagrams["intimacy-pact"])).toContain("Force, threats, fear or a repeat: use the Help Lines.");
  });

  it("Consistency Pact: telling your partner about a broken shared agreement is part of the partnership; your notes are never owed", () => {
    const steps = getProtocol("consistency-pact")!.steps;
    expect(steps[4]).toContain("Your own notes, thoughts and answers are never owed.");
    expect(steps[5]).toContain("Tell your partner. Telling them is part of the partnership");
  });

  it("Team Agreement: Believe first, one step list, the outing line", () => {
    const card = getProtocol("team-agreement")!;
    expect(card.steps).toHaveLength(5);
    expect(card.steps[0]).toMatch(/^Believe first\./);
    expect(teamAgreement.steps).toEqual(card.steps);
    expect(card.warn).toContain(teamAgreement.outingLine);
    expect(card.safetyLink).toBe(true);
  });

  it("Pause + Return: the one waiting does not follow, block or message; leaving a room is a Help Lines moment", () => {
    const card = getProtocol("pause-and-return")!;
    expect(card.steps[3]).toContain("If you’re the one waiting: don’t follow, block the way or message during the pause.");
    expect(card.steps[3]).toContain("Not being allowed to leave a room or the house is a Help Lines moment, not a pause.");
    expect(card.steps[4]).toBe("Come back at the time you said, even briefly. If you are afraid, do not go back: use the Help Lines.");
    expect(JSON.stringify([card, protocolDiagrams["pause-and-return"]])).not.toMatch(/prove it/);
    expect(card.warn).toContain("do not return at the set time");
  });

  it("Green Rule: do not return at the set time; a stated lack of safety is believed first", () => {
    const card = getProtocol("green-rule")!;
    expect(card.steps[2]).toContain("do not return at the set time");
    expect(card.warn).toContain("A stated lack of safety is believed first.");
    expect(card.steps[1]).toContain("Whoever hears it believes it first");
  });

  it("Profile Calibration: nobody has to complete it; do not ask your partner to show their answers", () => {
    const card = getProtocol("profile-calibration")!;
    expect(card.whenToUse).toContain("Nobody has to complete this, and you can stop at any time.");
    expect(card.warn).toContain("Do not ask your partner to show their answers.");
    expect(card.steps.join(" ")).toContain("44 questions");
  });

  it("never asks to track or verify the other partner", () => {
    const text = JSON.stringify([getProtocol("trust-recovery")]);
    expect(text).not.toMatch(/\btrack(ing)? (the facts|it)\b|\bverify\b/i);
    expect(text).toContain("look at it together");
  });

  it("the System Overlay's second step never asks anyone to say something untrue", () => {
    const line = "Make it safe: if it’s true, say out loud that the relationship isn’t at risk tonight.";
    expect(getProtocol("system-overlay")!.steps[1]).toBe(line);
    expect(protocolDiagrams["system-overlay"].steps[1].detail).toBe("If it’s true, say out loud that the relationship isn’t at risk tonight.");
  });

  it("Pause + Return flooding signs leave out contempt", () => {
    for (const sign of ["heart racing", "tunnel vision", "can’t think straight", "flee or to win"]) {
      expect(getProtocol("pause-and-return")!.whenToUse).toContain(sign);
    }
    expect(getProtocol("pause-and-return")!.whenToUse).not.toMatch(/contempt/i);
    expect(protocolDiagrams["pause-and-return"].when).not.toMatch(/contempt/i);
    expect(situations.find((s) => s.id === "flooded")!.description).not.toMatch(/contempt/i);
  });

  it("“afraid” only appears in safety content", () => {
    const green = getProtocol("green-rule")!;
    expect(green.working).not.toMatch(/afraid/i);
    expect(green.notWorking).toContain("Misuse: saying “this doesn’t feel safe” to shut down every complaint");
    for (const p of protocols) {
      for (const field of [p.concept, p.whenToUse, p.working, p.notWorking, p.activity, ...p.steps, ...p.phrases.map((x) => x.text)]) {
        if (/\bafraid\b/i.test(field)) expect(field, p.slug).toMatch(/Help Lines|outside help|outside support|Afraid of your partner|because they are afraid/);
      }
    }
  });
});

describe("Situation Map", () => {
  const byId = Object.fromEntries(situations.map((s) => [s.id, s]));

  it("rows are the registry's 12 canonical rows, in order (first match wins)", () => {
    const rows = registry.concepts["situation-map"].rowsCanonical;
    expect(situations.map((s) => s.id)).toEqual(rows.map((r) => r.id));
    expect(situations.map((s) => s.label)).toEqual(rows.map((r) => r.label));
  });

  it("puts the safety row first, routed to Help, never to Pause", () => {
    expect(situations[0].danger).toBe(true);
    expect(situations[0].primaryHref).toBe("/help");
    for (const s of situations.filter((s) => s.danger)) {
      expect(s.primaryHref).not.toMatch(/pause/);
      expect(s.secondaryHrefs ?? []).toEqual([]);
    }
  });

  it("“A fight is starting” first move is one sentence to say, from the 60-Second Reset; Pause + Return second; the Overlay is the next link", () => {
    const row = byId["conflict-starting"];
    expect(row.firstMove).toBe("Say: “I want to connect, not fight. Can we talk at ___?” (60-Second Reset)");
    expect(row.primaryHref).toBe("/protocols/60-second-reset");
    expect(row.secondaryHrefs!.map((l) => l.href)).toEqual(["/protocols/pause-and-return", "/protocols/system-overlay"]);
    expect(row.secondaryHrefs![0].label).toMatch(/^Too hot to stay in the room\? Pause \+ Return/);
  });

  it("trust breach skips the 7-day plan; a breach is something both agree happened", () => {
    expect(byId["trust-breach"].primaryHref).toBe("/protocols/trust-recovery");
    expect(byId["trust-breach"].firstMove).toContain("Skip the 7-day plan: start with Trust Recovery, then the Weekly Reset.");
    expect(byId["trust-breach"].description).toContain("never a breach");
  });

  it("pulling away goes to the Check-Up with its safety lines; outside pressure goes to the Team Agreement", () => {
    expect(byId["detachment"].primaryHref).toBe("/protocols/check-up");
    expect(byId["detachment"].firstMove).toContain("Contempt, fear or coercion: stop and get outside support first.");
    expect(byId["detachment"].firstMove).toContain("A partner who has stopped sharing because they are afraid is not pulling away: use the Help Lines.");
    expect(byId["outside-pressure"].primaryHref).toBe("/protocols/team-agreement");
    expect(byId["outside-pressure"].label).toBe("Outside pressure or disapproval from family, friends or strangers");
    expect(byId["outside-pressure"].secondaryHrefs!.map((c) => c.href)).toContain("/protocols/green-rule");
  });

  it("pressure from a partner goes to Help or the Green Rule, never to the Team Agreement", () => {
    expect(byId["outside-pressure"].description).toContain("If the pressure is coming from your partner, this isn’t the right tool.");
    expect(byId["unsafe"].description).toContain("This includes jealousy that leads to checking, restricting, or accusing.");
    expect(JSON.stringify(byId["outside-pressure"])).not.toMatch(/jealous/i);
  });

  it("Intimacy row: pressure after a no stops; the person pressured decides; force, threats, fear or a repeat go to Help Lines", () => {
    const row = byId["intimacy-stall"];
    expect(row.primaryHref).toBe("/protocols/intimacy-pact");
    expect(row.firstMove).toContain("Pressure after a no: stop; don’t talk it through in the moment.");
    expect(row.firstMove).toContain("The person pressured decides whether, when and with whom to talk.");
    expect(row.firstMove).toContain("Force, threats, fear or a repeat: Help Lines.");
  });

  it("other rows route to the right tools, in plain words", () => {
    expect(byId["say-do-gap"].primaryHref).toBe("/protocols/consistency-pact");
    expect(byId["after-fight"].firstMove).toContain("start within minutes if you can; finish within 24 hours");
    expect(byId["after-fight"].secondaryHrefs!.map((l) => l.href)).toContain("/protocols/full-repair");
    expect(byId["daily-drift"].primaryHref).toBe("/protocols/daily-rhythm");
    expect(byId["daily-drift"].secondaryHrefs!.map((l) => l.href)).toContain("/protocols/sun-memory");
    expect(byId["weekly-maintenance"].firstMove).toContain("The monthly part adds 10 minutes.");
    expect(byId["attachment-clash"].primaryHref).toBe("/protocols/profile-calibration");
    expect(byId["attachment-clash"].firstMove.startsWith("Name it out loud: “I think we’re doing the thing again.”")).toBe(true);
    expect(byId["attachment-clash"].firstMove).toContain("try Profile Calibration together.");
    expect(byId["attachment-clash"].goDeeper).toContain("Appendix A: common patterns");
    expect(componentSource("SituationCard")).toContain("situation.goDeeper");
    expect(byId["daily-drift"].label).toBe("We feel like housemates");
    expect(JSON.stringify(situations)).not.toMatch(/roommate/i);
    // Amber is for pause only: no row routes to an amber tone except Pause + Return.
    for (const s of situations) expect(s).not.toHaveProperty("warn");
  });
});

describe("safety routing", () => {
  it("lists the canonical help lines as dialable links", () => {
    expect(emergencyNumbers.map((n) => n.display)).toEqual(["911", "999", "000", "995", "112"]);
    const all = helpRegions.flatMap((r) => r.lines.map((l) => l.display));
    for (const n of ["1-800-799-7233", "88788", "988", "800-656-4673", "64673", "0808 2000 247", "116 123", "0808 500 2222", "1800 737 732", "13 11 14", "1800 777 0000", "1767", "6779 0282"]) {
      expect(all).toContain(n);
    }
    for (const line of [...emergencyNumbers, ...helpRegions.flatMap((r) => r.lines)]) {
      expect(line.href).toMatch(/^(tel|sms):\d/);
    }
  });

  it("every Help Lines surface lists the same regions, including the EU and elsewhere", () => {
    const regions = helpRegions.map((r) => r.region);
    expect(HELP_LINES_REGIONS).toEqual([...regions, "Elsewhere"]);
    for (const r of ["US", "UK", "Australia", "Singapore", "EU"]) expect(regions).toContain(r);

    // /help renders every region from the shared data, then the elsewhere line.
    const help = pageSource("help");
    expect(help).toContain("helpRegions.map(");
    expect(help).toContain("{ELSEWHERE_LINE}");
    expect(ELSEWHERE_LINE.startsWith("Elsewhere:")).toBe(true);

    // The pointer used on other pages names every region and says what to do anywhere else.
    for (const r of helpRegions) expect(HELP_LINES_POINTER).toContain(r.inProse);
    expect(HELP_LINES_POINTER).toMatch(/Anywhere else, call your local emergency number or national helpline\./);

    // /together uses the shared pointer, not its own (shorter) list.
    const together = pageSource("together");
    expect(together).toContain("{HELP_LINES_POINTER}");

    // The printed list in the registry covers the same regions (the EU via 112) and elsewhere.
    const printed = registry.concepts["help-safety"].helpLines.join(" ");
    for (const r of regions) expect(printed).toMatch(new RegExp(`\\b${r}\\b`));
    expect(registry.concepts["help-safety"].helpLines.at(-1)).toBe(ELSEWHERE_LINE);

    // No page or component hard-codes a partial region list.
    const partial = /\b(US|UK)\b, (the )?(UK|US)\b, Australia and Singapore\b/;
    for (const dir of ["app", "components"]) {
      const root = join(__dirname, "../src", dir);
      for (const f of readdirSync(root, { recursive: true }) as string[]) {
        if (!/\.tsx?$/.test(f)) continue;
        expect(readFileSync(join(root, f), "utf8"), f).not.toMatch(partial);
      }
    }
  });

  it("pins the child-protection line and the five-question self-check", async () => {
    const { CHILD_LINE, SELF_CHECK_QUESTIONS, SELF_CHECK_RESULT } = await import("@/data/help");
    expect(CHILD_LINE).toBe(
      "Worried about a child: your local child-protection service, or your emergency number if a child is in danger.",
    );
    expect(registry.concepts["help-safety"].helpLines).toContain(CHILD_LINE);
    expect(HELP_LINES_POINTER).toContain(CHILD_LINE);
    expect(SELF_CHECK_QUESTIONS).toHaveLength(5);
    expect(SELF_CHECK_RESULT).toMatch(/get outside help first/);
    const help = pageSource("help");
    expect(help).toContain("{CHILD_LINE}");
    expect(help).toContain("SELF_CHECK_QUESTIONS.map(");
  });

  it("adds the canonical LGBTQ+-affirming line", async () => {
    const { LGBTQ_LINE, lgbtqLines } = await import("@/data/help");
    expect(LGBTQ_LINE).toBe(registry.helpLinesExtra);
    for (const l of lgbtqLines) expect(LGBTQ_LINE).toContain(l.display);
    for (const l of lgbtqLines.filter((l) => l.href.startsWith("tel:"))) expect(l.href.slice(4)).toBe(l.display.replace(/\D/g, ""));
  });

  it("Green Rule and Pause + Return link to Help", () => {
    expect(getProtocol("green-rule")!.safetyLink).toBe(true);
    expect(getProtocol("pause-and-return")!.safetyLink).toBe(true);
  });
});

describe("the six to learn first and Your First Week", () => {
  it("the six to learn first are six distinct, real cards, Green Rule first", () => {
    expect(coreSix).toHaveLength(6);
    expect(new Set(coreSixSlugs).size).toBe(6);
    for (const slug of coreSixSlugs) expect(getProtocol(slug), slug).toBeDefined();
    expect(coreSixSlugs[0]).toBe("green-rule");
    expect(coreSixSlugs).toEqual(
      expect.arrayContaining(["green-rule", "pause-and-return", "60-second-reset", "weekly-reset", "micro-repair", "system-overlay"])
    );
  });

  it("/start has days 1–7, each linked to a real card and route", () => {
    const routes = new Set(precacheUrls());
    expect(routes).toContain("/start");
    expect(startDays.map((d) => d.day)).toEqual(Array.from({ length: START_PLAN_DAYS }, (_, i) => i + 1));
    for (const d of startDays) {
      expect(getProtocol(d.slug), `day ${d.day} → ${d.slug}`).toBeDefined();
      expect(routes).toContain(`/protocols/${d.slug}`);
      if (d.tool) expect(routes, `day ${d.day} → ${d.tool.href}`).toContain(d.tool.href.replace(/#.*$/, "") || "/");
    }
  });

  it("“Tonight (20 minutes)” has the three jobs, and day 1 is the tonight job only", () => {
    expect(TONIGHT.title).toBe("Tonight (20 minutes)");
    expect(TONIGHT.minutes).toBe(20);
    expect(TONIGHT.steps).toHaveLength(3);
    expect(TONIGHT.steps[0]).toBe("Read the red row of the Situation Map.");
    expect(TONIGHT.steps[2]).toBe("Try the 60-Second Reset once, while you’re calm.");
    expect(startDays[0].minutes).toBe(20);
    expect(startDays[0].task).toContain("read the red row of the Situation Map");
    expect(startDays[0].task).toContain("try the 60-Second Reset once, while you’re calm");
  });

  it("ends with the first Weekly Reset on day 7 and covers the six to learn first", () => {
    const last = startDays.at(-1)!;
    expect(last.day).toBe(7);
    expect(last.slug).toBe("weekly-reset");
    expect(last.task).toContain("40-minute timer");
    expect(last.task).toContain("15 minutes is fine");
    for (const slug of coreSixSlugs) expect(startDays.map((d) => d.slug)).toContain(slug);
    for (const d of startDays.slice(1, -1).filter((d) => d.slug !== "pause-and-return")) expect(d.minutes, `day ${d.day}`).toBeLessThanOrEqual(10);
    expect(startDays.find((d) => d.day === 5)!.task).toMatch(/evening catch-up only \(about 10 minutes\)/);
  });

  it("is the Field Kit’s week, day for day (SPEC section 5)", () => {
    expect(startDays.map((d) => d.title)).toEqual([
      "Tonight’s job",
      "Say the Green Rule lines aloud",
      "A first Micro-Repair",
      "Practise Pause + Return",
      "One evening catch-up",
      "Try the quick System Overlay",
      "Your first Weekly Reset",
    ]);
    expect(startDays.map((d) => d.slug)).toEqual(["60-second-reset", "green-rule", "micro-repair", "pause-and-return", "daily-rhythm", "system-overlay", "weekly-reset"]);
    expect(registry.firstWeek.title).toBe("Your First Week");
    expect(registry.firstWeek.tonight).toEqual([...TONIGHT.steps]);
    for (const d of startDays) expect(d.proof, `day ${d.day}`).toMatch(/\S/);
  });

  it("carries the First Week notes: tight on time, trust breach skips the plan, invite don’t assign", () => {
    expect(START_NOTES.tightOnTime).toBe("Tight on time? Do the Weekly Reset in two 20-minute halves.");
    expect(START_NOTES.trustBreach).toContain("start with Trust Recovery, then the Weekly Reset");
    expect(START_NOTES.onlyOneReading).toBe("Only one of you reading? Invite, don’t assign.");
  });

  it("never offers a pause shorter than 20 minutes", () => {
    for (const d of startDays) expect(d.task).not.toMatch(/\b(10|15|ten|fifteen)[- ]?min(ute)? (pause|break)/i);
    expect(startDays[0].task).toContain("one pause phrase and a return time");
    expect(startDays.find((d) => d.slug === "pause-and-return")!.task).toContain("Take 20 minutes apart");
  });
});

describe("About the authors", () => {
  it("credits both authors in one combined bio, with no placeholders", () => {
    expect(authorNames).toEqual(["David", "Dami"]);
    expect(aboutAuthors).toContain("David and Zhongming (known to everyone as Dami)");
    expect(aboutAuthors).toContain("David");
    expect(aboutAuthors).toContain("Dami");
    expect(aboutAuthors).not.toMatch(/\[\[/);
    expect(aboutAuthors).toContain("They first used these protocols in their own relationship.");
  });

  it("describes David's background without a title, employer, sector, institution, place or pet", () => {
    expect(aboutAuthors).toContain("governance and transformation");
    for (const text of [aboutAuthors, authorsCoupleLine]) {
      expect(text).not.toMatch(/\b(bank|banking|CAO|COO|Chief|consultant|ETH|Zurich|Singapore|Hong Kong|Australia|Asia Pacific|APAC|Troy|Bean)\b/i);
      expect(text).not.toMatch(/\btested\b/i);
    }
  });
});

describe("offline precache", () => {
  it("covers every static route and every protocol page", () => {
    const urls = precacheUrls();
    for (const route of ["/", "/about", "/calibrate", "/connect", "/help", "/pause", "/privacy", "/protocols", "/start", "/together", "/weekly-reset"]) {
      expect(urls).toContain(route);
    }
    for (const slug of protocolSlugs) expect(urls).toContain(`/protocols/${slug}`);
    expect(urls.some((u) => u.includes("["))).toBe(false);
  });
});

describe("/privacy", () => {
  const src = pageSource("privacy");

  it("is dated, names both authors and Singapore's PDPA, and points to data deletion", () => {
    expect(src).toContain("1 October 2026");
    expect(src).toContain("David Hamilton");
    expect(src).toContain("Zhongming Shi");
    expect(src).toContain("PDPA");
    expect(src).toContain("/help#your-data");
    expect(src).toContain("CONTACT_EMAIL");
    expect(src).toMatch(/Vercel/);
    expect(src).toMatch(/under\s+18/);
  });

  it("discloses the pre-launch access cookie by its real name and lifetime", () => {
    expect(src).toContain(ACCESS_COOKIE);
    expect(src).toMatch(/httpOnly/);
    expect(src).toMatch(/30 days/);
    expect(src).not.toMatch(/analytics, cookies or trackers|and no\s+cookies/i);
    expect(componentSource("DeleteAllData")).toMatch(/cookie/);
    // Delete-all can't clear the httpOnly cookie; the Privacy page says so.
    expect(src).toMatch(/Delete all my data[\s\S]{0,80}doesn’t\s+remove it/);
    expect(src).toMatch(/expires on its\s+own/);
  });

  it("is linked from the email signup, Help (Your data) and About", () => {
    expect(componentSource("SignupForm")).toContain('href="/privacy"');
    expect(componentSource("SignupForm")).toMatch(/only use your email for Alliance Protocols updates/);
    expect(componentSource("DeleteAllData")).toContain('href="/privacy"');
    expect(pageSource("about")).toContain('href="/privacy"');
  });

  it("matches the code: no analytics or tracker packages or scripts", () => {
    const pkg = JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf8"));
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    expect(deps.filter((d) => /analytics|speed-insights|gtag|plausible|posthog|segment|sentry|mixpanel/i.test(d))).toEqual([]);
    expect(readFileSync(join(appDir, "layout.tsx"), "utf8")).not.toMatch(/googletagmanager|gtag|Analytics/);
  });
});

describe("/together", () => {
  it("links only real routes and keeps the Faber, Zare & Williams 2026 citation", () => {
    const routes = new Set(precacheUrls());
    for (const t of togetherTools) expect(routes, t.href).toContain(t.href);
    expect(togetherTools.map((t) => t.href)).toEqual(
      expect.arrayContaining(["/protocols/team-agreement", "/weekly-reset", "/"])
    );
    expect(TOGETHER_CITATION.text).toMatch(/Faber, Zare & Williams/);
    expect(TOGETHER_CITATION.text).toContain("2026");
    expect(TOGETHER_CITATION.href).toMatch(/^https:\/\/pubmed\.ncbi\.nlm\.nih\.gov\//);
    expect(authorsCoupleLine).toContain("biracial couple");
  });

  it("routes safety to Help and states the Team Agreement guardrail", () => {
    const src = pageSource("together");
    expect(src).toContain("safetyLink");
    expect(src).toContain("never how much access a relative gets");
  });

  it("is linked from /about and the Situation Map row sends outside pressure to the Team Agreement", () => {
    expect(pageSource("about")).toContain('href="/together"');
    expect(situations.find((s) => s.id === "outside-pressure")!.primaryHref).toBe("/protocols/team-agreement");
    expect(situations.find((s) => s.id === "outside-pressure")!.secondaryHrefs!.map((l) => l.href)).toContain("/together");
  });

  it("/together points at the live Situation Map row", () => {
    const map = togetherTools.find((t) => t.href === "/")!;
    expect(map.note).toContain(`“${situations.find((s) => s.id === "outside-pressure")!.label}”`);
  });

  it("carries no pricing and none of the banned phrasings", () => {
    const text = [pageSource("together"), JSON.stringify([commonMoves, togetherFaq, togetherTools, whoFor])].join(" ");
    expect(text).not.toMatch(/\$\d|price|buy\b/i);
    expect(text).not.toMatch(/exotic|colou?r-?blind|sees no colou?r/i);
  });
});

describe("banned claims", () => {
  it("new pages never say evidence-based, proven or clinically", () => {
    const text = [pageSource("privacy"), pageSource("together"), componentSource("KeepItGoing"), JSON.stringify([commonMoves, togetherFaq, togetherTools, whoFor])].join(" ");
    expect(text).not.toMatch(/evidence[- ]based|\bproven\b|clinically/i);
  });
});

describe("contact and store links", () => {
  it("never shows a made-up contact address or links to a placeholder store", () => {
    if (!process.env.NEXT_PUBLIC_CONTACT_EMAIL) expect(CONTACT_EMAIL).toBeNull();
    if (!process.env.NEXT_PUBLIC_FULL_SYSTEM_URL) expect(FULL_SYSTEM_URL).toBeNull();
    expect(httpsUrlOrNull("http://example.com")).toBeNull();
    expect(httpsUrlOrNull("javascript:alert(1)")).toBeNull();
    expect(httpsUrlOrNull("https://store.example/p")).toBe("https://store.example/p");
    expect(componentSource("GetFullSystem")).toMatch(/The books aren’t on sale yet/);
    for (const f of ["src/app/privacy/page.tsx", "src/app/terms/page.tsx", "src/components/SignupForm.tsx", "src/lib/links.ts"]) {
      expect(readFileSync(join(__dirname, "..", f), "utf8"), f).not.toMatch(/hello@/);
    }
  });
});

describe("tests that cross the data and the app", () => {
  const allCopy = JSON.stringify([protocols, protocolDiagrams, situations, commonMoves, togetherTools, togetherFaq, whoFor]);

  it("Sun Memory: Quick (a few minutes) and Full (2 to 24 hours); either of you can end it by naming a safety concern", () => {
    const card = getProtocol("sun-memory")!;
    expect(card.concept).toContain("Quick is a few minutes; Full is 2 to 24 hours.");
    expect(card.steps.join(" ")).toContain("Quick: a few minutes inside one ritual. Full: 2 to 24 hours.");
    expect(card.warn).toContain("Safety, childcare, logistics and any repair you’ve already booked carry on.");
    expect(card.warn).toContain("Either of you can end it by naming a safety concern.");
  });

  it("Daily Rhythm: morning hello (5 minutes or less), evening catch-up (about 10), and the minimum", () => {
    const steps = getProtocol("daily-rhythm")!.steps;
    expect(steps[0]).toMatch(/^Morning hello \(5 minutes or less\)/);
    expect(steps[1]).toMatch(/^Evening catch-up \(about 10 minutes\)/);
    expect(steps[3]).toContain("keep the minimum: a hello, an “I see you”, an appreciation, and a repair within 24 hours if anything stings");
    expect(allCopy).not.toMatch(/morning check-in|evening check-in/i);
  });

  it("states “scripts are training wheels” exactly once in the app", () => {
    const walk = (d: string): string[] =>
      readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
    const hits = walk(join(__dirname, "../src"))
      .filter((f) => /\.(tsx?|json)$/.test(f))
      .flatMap((f) => readFileSync(f, "utf8").match(/scripts are training wheels/gi) ?? []);
    expect(hits).toHaveLength(1);
  });

  it("Help lists the verified additions (Respect, Men’s lines, PAVE, AWARE, SMS 70999, the EU line)", async () => {
    const { ownBehaviourLines, PRIVATE_STORAGE_NOTE } = await import("@/data/help");
    const all = [...helpRegions.flatMap((r) => r.lines), ...ownBehaviourLines];
    const byDisplay = Object.fromEntries(all.map((l) => [l.display, l]));
    expect(byDisplay["0808 8024040"].label).toMatch(/Respect/);
    expect(byDisplay["0808 8010327"].label).toMatch(/Men’s Advice Line/);
    expect(byDisplay["1300 766 491"].label).toMatch(/Men’s Referral Service/);
    expect(byDisplay["6555 0390"].label).toBe("PAVE (office hours)");
    expect(byDisplay["1800 777 5555"].label).toMatch(/AWARE/);
    expect(byDisplay["70999"].href).toBe("sms:70999");
    expect(all.map((l) => l.display)).not.toContain("71999");
    expect(byDisplay["116 016"].label).toBe("Helpline for women experiencing violence, where available");
    expect(byDisplay["800-656-4673"].label).toMatch(/RAINN/);
    expect(byDisplay["0808 500 2222"].label).toMatch(/Rape Crisis/);
    expect(byDisplay["6779 0282"].label).toMatch(/weekdays 10am to 6pm/);
    for (const l of all.filter((l) => l.href.startsWith("tel:"))) expect(l.href.slice(4), l.label).toBe(l.display.replace(/\D/g, ""));
    expect(PRIVATE_STORAGE_NOTE).toContain("keep this somewhere private");
  });
});
