import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { aboutAuthors, authorNames, authorsCoupleLine } from "@/data/authors";
import { coreFive, coreFiveSlugs } from "@/data/core5";
import { KIT } from "@/data/kit";
import { emergencyNumbers, helpRegions } from "@/data/help";
import { getProtocol, protocolSlugs, protocols } from "@/data/protocols";
import { situations } from "@/data/situations";
import registry from "@/data/registry.json";
import { START_PLAN_DAYS, startDays } from "@/data/start";
import { TOGETHER_CITATION, commonMoves, togetherFaq, togetherTools, whoFor } from "@/data/together";
import { protocolDiagrams } from "@/data/visuals/protocol-diagrams";
import { precacheUrls } from "../scripts/generate-sw.mjs";
import { ACCESS_COOKIE } from "@/lib/launch-lock";
import { CONTACT_EMAIL, FULL_SYSTEM_URL, httpsUrlOrNull } from "@/lib/links";

const cardsDir = join(__dirname, "../src/data/cards");
const cardFiles = readdirSync(cardsDir).filter((f) => f.endsWith(".json"));

describe("protocol cards", () => {
  it("has the canonical 15 protocol cards, all registered", () => {
    expect(protocols).toHaveLength(KIT.protocolCards);
    expect(cardFiles).toHaveLength(KIT.protocolCards);
    expect(new Set(protocolSlugs).size).toBe(protocolSlugs.length);
    for (const f of cardFiles) {
      const slug = JSON.parse(readFileSync(join(cardsDir, f), "utf8")).slug;
      expect(f).toBe(`${slug}.json`);
      expect(getProtocol(slug)).toBeDefined();
    }
  });

  it("every card has a step diagram with the same number of steps", () => {
    for (const p of protocols) {
      const diagram = protocolDiagrams[p.slug];
      expect(diagram, `diagram for ${p.slug}`).toBeDefined();
      expect(diagram.steps.length, `${p.slug} step count`).toBe(p.steps.length);
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

describe("CANON numbers and wording", () => {
  it("Pause + Return is 20 minutes to 24 hours", () => {
    const badge = protocolDiagrams["pause-and-return"].steps.find((s) => s.title === "Set a time")?.badge;
    expect(badge).toBe("20 min – 24 h");
    expect(getProtocol("pause-and-return")!.steps.join(" ")).toContain("20 minutes minimum, 24 hours max");
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

  it("Weekly Reset is five parts, about 40 minutes (5/15/15/5)", () => {
    const card = getProtocol("weekly-reset")!;
    expect(card.steps).toHaveLength(KIT.weeklyResetParts);
    expect(card.activity).toContain("40-minute timer");
    const badges = protocolDiagrams["weekly-reset"].steps.map((s) => s.badge ?? "");
    const minutes = badges.map((b) => Number(b.match(/^(\d+) min/)?.[1] ?? 0));
    expect(minutes.reduce((a, b) => a + b, 0)).toBe(KIT.weeklyResetMinutes);
  });

  it("Uninvestment Check lists 8 signs and the 0 / 1–2 / 3+ bands (CANON round 6)", () => {
    const card = getProtocol("uninvestment-check")!;
    expect(card.activity.match(/\(\d\)/g)).toHaveLength(8);
    const steps = card.steps.join(" ");
    expect(steps).toContain("0 signs → nothing to fix");
    expect(steps).toContain("1–2 signs → likely needs space and small repairs (Micro-Repair, Morning + Evening Rhythm)");
    expect(steps).toContain("3 or more signs → may be pulling away");
    expect(steps).not.toContain("0–2");
  });

  it("uses canonical names", () => {
    const text = JSON.stringify(protocols);
    expect(text).not.toMatch(/Care Audit|Tempo Mismatch|Manager Imbalance|Abuse guardrail|push-pull/i);
  });

  it("states the anti-weaponisation guardrails on the relevant cards", () => {
    expect(getProtocol("intimacy-pact")!.warn).toContain("needs no script, reason, or substitute");
    expect(getProtocol("unity-anchor")!.warn).toContain("never how much access a relative gets");
    expect(getProtocol("trust-recovery")!.warn).toContain("never becomes monitoring");
    expect(JSON.stringify(getProtocol("unity-anchor"))).not.toMatch(/how much access they get/);
  });
});

describe("CANON round 3", () => {
  const LEAVING = "Deciding not to rebuild, or to end the relationship, is a valid outcome of this protocol, not a failure of it.";
  const all = (slug: string) => JSON.stringify(getProtocol(slug));

  it("says leaving is valid on Trust Recovery, Full Recovery and the Uninvestment Check", () => {
    for (const slug of ["trust-recovery", "full-recovery", "uninvestment-check"]) {
      expect(getProtocol(slug)!.note, slug).toBe(LEAVING);
    }
    expect(componentSource("ProtocolLayout")).toContain("protocol.note");
  });

  it("Uninvestment Check: sign 4 wording, contempt skips the count, routing", () => {
    const card = getProtocol("uninvestment-check")!;
    expect(card.activity).toContain("(4) doing more on your own in place of shared time (time apart is healthy)");
    const contempt = "If contempt is one of your signs, skip the count: contempt means stop and get outside support first.";
    expect(card.activity).toContain(contempt);
    expect(card.steps.join(" ")).toContain(contempt);
    expect(card.warn).toContain(contempt);
    expect(card.steps.join(" ")).toContain("Full Recovery conversation within a week");
    expect(card.crossLinks.map((c) => c.href)).toContain("/protocols/trust-recovery");
  });

  it("Micro-Repair uses the one canonical window", () => {
    const text = [all("micro-repair"), JSON.stringify(protocolDiagrams["micro-repair"])].join(" ");
    expect(text.toLowerCase()).toContain("start within minutes if you can; complete within 24 hours");
    expect(text).not.toMatch(/48[- ]hour|within (10|ten) minutes/i);
  });

  it("Full Recovery and Trust Recovery handle one-sided breaches", () => {
    const full = getProtocol("full-recovery")!.steps.join(" ");
    expect(full).toContain("only that partner acknowledges impact; the hurt partner is never asked to confess in return");
    expect(full).toContain("only if it’s true for both of you");
    expect(getProtocol("trust-recovery")!.steps[0]).toContain("never asked to confess in return");
  });

  it("Intimacy Pact never routes repeated pressure to in-house tools only", () => {
    const card = getProtocol("intimacy-pact")!;
    const last = card.steps.at(-1)!;
    expect(last).toMatch(/Green Rule or Trust Recovery/);
    expect(last).toMatch(/If it happens again, or either of you feels unable to say no, stop and use the Help Lines/);
    expect(card.warn).toMatch(/Help Lines/);
    expect(card.safetyLink).toBe(true);
  });

  it("Intimacy Pact sends force, threats or fear straight to the Help Lines", () => {
    const FORCE = "If it involved force, threats or fear, it isn’t a ‘once’: go straight to the Help Lines.";
    const last = getProtocol("intimacy-pact")!.steps.at(-1)!;
    expect(last).toContain(FORCE);
    expect(last.indexOf(FORCE)).toBeGreaterThan(last.indexOf("Green Rule or Trust Recovery"));
    expect(JSON.stringify(protocolDiagrams["intimacy-pact"])).toContain(FORCE);
  });

  it("never asks to track or verify the other partner", () => {
    const text = JSON.stringify([getProtocol("trust-recovery"), getProtocol("proof-protocol")]);
    expect(text).not.toMatch(/\btrack(ing)? (the facts|it)\b|\bverify\b/i);
    expect(text).toContain("see and review at the agreed check-in");
  });

  it("Weekly Reset part 4 is Requests, part 5 is Next steps", () => {
    const card = getProtocol("weekly-reset")!;
    expect(card.steps[3]).toMatch(/^Requests — /);
    expect(card.steps[4]).toMatch(/^Next steps — /);
    expect(protocolDiagrams["weekly-reset"].steps.map((s) => s.title).slice(3)).toEqual(["Requests", "Next steps"]);
    expect(componentSource("WeeklyResetWizard")).toContain('title="Requests"');
    expect(componentSource("WeeklyResetWizard")).not.toContain("Requests (5 min, with next steps)");
  });

  it("Situation Map (app and intro diagram) splits trust breach from pulling away and routes outside pressure to Unity Anchor", () => {
    const byId = Object.fromEntries(situations.map((s) => [s.id, s]));
    expect(byId["trust-breach"].primaryHref).toBe("/protocols/trust-recovery");
    expect(byId["trust-breach"].firstMove).toContain("Trust Recovery + Proof");
    expect(byId["detachment"].primaryHref).toBe("/protocols/uninvestment-check");
    expect(byId["detachment"].label).toMatch(/Pulling away/);
    expect(byId["outside-pressure"].primaryHref).toBe("/protocols/unity-anchor");
    expect(byId["outside-pressure"].label).toBe("Outside pressure or disapproval from family, friends or strangers");
    const diagrams = readFileSync(join(__dirname, "../src/components/intro/diagrams.tsx"), "utf8");
    expect(diagrams).toContain('q: ["Trust breach?"]');
    expect(diagrams).toContain('q: ["Pulling away?"]');
    expect(diagrams).toContain('a: ["Unity Anchor"]');
    expect(diagrams).not.toContain("Trust breach or");
    // Same order as the app list: outside pressure (row 3) before trust breach and pulling away.
    expect(diagrams.indexOf('q: ["Outside pressure"')).toBeLessThan(diagrams.indexOf('q: ["Trust breach?"]'));
    expect(diagrams.indexOf('q: ["Trust breach?"]')).toBeLessThan(diagrams.indexOf('q: ["Pulling away?"]'));
  });

  it("Situation Map rows are the registry's 12 canonical rows, in order (first match wins)", () => {
    const rows = registry.concepts["situation-map"].rowsCanonical;
    expect(situations.map((s) => s.id)).toEqual(rows.map((r) => r.id));
    expect(situations.map((s) => s.label)).toEqual(rows.map((r) => r.label));
    const byId = Object.fromEntries(situations.map((s) => [s.id, s]));
    expect(byId["say-do-gap"].primaryHref).toBe("/protocols/consistency-pact");
    expect(byId["after-fight"].firstMove).toContain("start within minutes if you can; complete within 24 hours");
    expect(byId["intimacy-stall"].firstMove).toMatch(/Help Lines/);
    expect(byId["weekly-maintenance"].firstMove).toContain("the monthly Care Check-in (inside the Weekly Reset)");
    // Amber is for pause only: no row routes to an amber tone except Pause + Return.
    for (const s of situations) expect(s).not.toHaveProperty("warn");
  });
});

describe("safety routing", () => {
  it("puts the safety row first, routed to Help, never to Pause", () => {
    expect(situations[0].danger).toBe(true);
    expect(situations[0].primaryHref).toBe("/help");
    for (const s of situations.filter((s) => s.danger)) {
      expect(s.primaryHref).not.toMatch(/pause/);
      expect(s.secondaryHrefs ?? []).toEqual([]);
    }
  });

  it("lists the canonical help lines as dialable links", () => {
    expect(emergencyNumbers.map((n) => n.display)).toEqual(["999", "911", "000", "112"]);
    const all = helpRegions.flatMap((r) => r.lines.map((l) => l.display));
    for (const n of ["1-800-799-7233", "88788", "988", "0808 2000 247", "116 123", "1800 737 732", "13 11 14", "1800 777 0000", "1767"]) {
      expect(all).toContain(n);
    }
    for (const line of [...emergencyNumbers, ...helpRegions.flatMap((r) => r.lines)]) {
      expect(line.href).toMatch(/^(tel|sms):\d/);
    }
  });

  it("adds the canonical LGBTQ+-affirming line (CANON round 5)", async () => {
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

describe("Core 5 and the 7-day start plan", () => {
  it("Core 5 is five distinct, real protocol cards, Green Rule first", () => {
    expect(coreFive).toHaveLength(5);
    expect(new Set(coreFiveSlugs).size).toBe(5);
    for (const slug of coreFiveSlugs) expect(getProtocol(slug), slug).toBeDefined();
    expect(coreFiveSlugs[0]).toBe("green-rule");
    expect(coreFiveSlugs).toEqual(
      expect.arrayContaining(["green-rule", "pause-and-return", "60-second-reset", "weekly-reset", "micro-repair"])
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

  it("ends with the first Weekly Reset on day 7 and covers every Core 5 tool", () => {
    const last = startDays.at(-1)!;
    expect(last.day).toBe(7);
    expect(last.slug).toBe("weekly-reset");
    expect(last.task).toContain("40-minute timer");
    for (const slug of coreFiveSlugs) expect(startDays.map((d) => d.slug)).toContain(slug);
    // About 10 minutes a day; the Pause + Return practice includes 20 minutes apart,
    // and the morning and evening check-ins are the Manual's two check-ins (≤5 + about 10) across the day.
    for (const d of startDays.slice(0, -1).filter((d) => d.slug !== "pause-and-return" && d.slug !== "morning-evening-rhythm")) expect(d.minutes).toBeLessThanOrEqual(10);
    expect(startDays.find((d) => d.day === 5)!.task).toMatch(/morning check-in \(5 minutes or less\) and an evening check-in \(about 10 minutes\)/);
  });

  it("is the Field Kit's “The First Week”, day for day (CANON round 5: one plan)", () => {
    expect(startDays.map((d) => d.title)).toEqual([
      "Safety + Pause defaults",
      "Practise the 60-Second Reset",
      "A first Micro-Repair",
      "Practise Pause + Return",
      "Morning and evening check-ins",
      "Set up the Reset",
      "Weekly Reset #1",
    ]);
    for (const d of startDays) expect(d.proof, `day ${d.day}`).toMatch(/\S/);
  });

  it("never offers a pause shorter than 20 minutes", () => {
    for (const d of startDays) expect(d.task).not.toMatch(/\b(10|15|ten|fifteen)[- ]?min(ute)? (pause|break)/i);
    expect(startDays[0].task).toContain("a 20-minute minimum");
    expect(startDays.find((d) => d.slug === "pause-and-return")!.task).toContain("Take 20 minutes apart");
  });
});

describe("About the authors", () => {
  it("credits both authors in one combined bio, with no placeholders", () => {
    expect(authorNames).toEqual(["David Hamilton", "Dr Zhongming Shi"]);
    expect(aboutAuthors).toContain("Dr Zhongming Shi (known to everyone as Dami)");
    expect(aboutAuthors).toContain("David");
    expect(aboutAuthors).toContain("Dami");
    expect(aboutAuthors).not.toMatch(/\[\[/);
    expect(aboutAuthors).toContain("They first used these protocols in their own relationship.");
  });

  it("stays anonymous: no employers, job titles, institutions, places or pets", () => {
    for (const text of [aboutAuthors, authorsCoupleLine]) {
      expect(text).not.toMatch(/\b(bank|banking|CAO|COO|consultant|ETH|Zurich|Singapore|Hong Kong|Australia|Troy|Bean)\b/i);
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

const appDir = join(__dirname, "../src/app");
const pageSource = (route: string) => readFileSync(join(appDir, route, "page.tsx"), "utf8");
const componentSource = (name: string) => readFileSync(join(__dirname, "../src/components", `${name}.tsx`), "utf8");

describe("/privacy", () => {
  const src = pageSource("privacy");

  it("is dated, names both authors and Singapore's PDPA, and points to data deletion", () => {
    expect(src).toContain("1 October 2026");
    expect(src).toContain("David Hamilton");
    expect(src).toContain("Dr Zhongming Shi");
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
      expect.arrayContaining(["/protocols/unity-anchor", "/"])
    );
    expect(TOGETHER_CITATION.text).toMatch(/Faber, Zare & Williams/);
    expect(TOGETHER_CITATION.text).toContain("2026");
    expect(TOGETHER_CITATION.href).toMatch(/^https:\/\/pubmed\.ncbi\.nlm\.nih\.gov\//);
    expect(authorsCoupleLine).toContain("biracial couple");
  });

  it("routes safety to Help and states the Unity Anchor guardrail", () => {
    const src = pageSource("together");
    expect(src).toContain("WarnBanner pauseLink={false} safetyLink");
    expect(src).toContain("never how much access a relative gets");
    expect(src).toContain('href="/protocols/unity-anchor"');
  });

  it("is linked from /about and the Unity Anchor card", () => {
    expect(pageSource("about")).toContain('href="/together"');
    expect(getProtocol("unity-anchor")!.crossLinks.map((c) => c.href)).toContain("/together");
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
    expect(componentSource("GetFullSystem")).toMatch(/Coming soon/);
    for (const f of ["src/app/privacy/page.tsx", "src/app/terms/page.tsx", "src/components/SignupForm.tsx", "src/lib/links.ts"]) {
      expect(readFileSync(join(__dirname, "..", f), "utf8"), f).not.toMatch(/hello@/);
    }
  });
});

describe("CANON round 6", () => {
  const byId = Object.fromEntries(situations.map((s) => [s.id, s]));
  const allCopy = JSON.stringify([protocols, protocolDiagrams, situations, commonMoves, togetherTools, togetherFaq, whoFor]);

  it("jealousy is a safety-row matter, never routed to Unity Anchor", () => {
    expect(byId["unsafe"].description).toContain("This includes jealousy that leads to checking, restricting, or accusing.");
    expect(JSON.stringify(byId["outside-pressure"])).not.toMatch(/jealous/i);
    expect(JSON.stringify(getProtocol("unity-anchor"))).not.toMatch(/jealous/i);
    expect(JSON.stringify(protocolDiagrams["unity-anchor"])).not.toMatch(/jealous|log it/i);
    expect(allCopy).not.toMatch(/log (it|jealousy)[^.]*Weekly Reset/i);
  });

  it("Unity Anchor: outside pressure only; partner pressure goes to the Green Rule; carries the safety line", () => {
    const card = getProtocol("unity-anchor")!;
    expect(card.whenToUse).toContain("If the pressure comes from your partner, this isn’t a Unity Anchor situation");
    expect(card.warn).toContain("Afraid of your partner, being threatened, or not free to say no? Stop");
    expect(card.safetyLink).toBe(true);
    expect(card.crossLinks.map((c) => c.href)).toContain("/protocols/green-rule");
  });

  it("row 11 says housemates, never roommates", () => {
    expect(byId["daily-drift"].label).toBe("We feel like housemates");
    expect(allCopy).not.toMatch(/roommate/i);
  });

  it("Intimacy Pact steps 1 and 4 use the round 6 consent wording", () => {
    const card = getProtocol("intimacy-pact")!;
    expect(card.steps[0]).toBe("Before you initiate, think about how it lands for the other person. If you’re declining, you owe nothing: just say no.");
    expect(card.steps[3]).toContain("body language can signal interest, but a clear yes is still asked for");
  });

  it("Trust Recovery and Proof: feelings and questions first, the record is an aid; disputed and coerced cases stop", () => {
    const trust = getProtocol("trust-recovery")!;
    expect(trust.steps.join(" ")).toContain("the hurt partner’s feelings and questions come first; the record is an aid, never the judge");
    expect(trust.warn).toContain("If you can’t agree that a breach happened, this tool isn’t for it");
    expect(trust.warn).toContain("If refusing the “voluntary” transparency would feel unsafe, it isn’t voluntary");
    expect(getProtocol("proof-protocol")!.steps.join(" ")).toContain("feelings and questions come first; the record is an aid, never the judge");
    expect(allCopy).not.toMatch(/hypernotic|record first|facts first|right breach/i);
  });

  it("“afraid” only appears in safety content; the Green Rule names its misuse", () => {
    const green = getProtocol("green-rule")!;
    expect(green.working).not.toMatch(/afraid/i);
    expect(green.notWorking).toContain("Misuse: saying “this doesn’t feel safe” to shut down every complaint");
    for (const p of protocols) {
      for (const field of [p.concept, p.whenToUse, p.working, p.notWorking, p.activity, ...p.steps, ...p.phrases.map((x) => x.text)]) {
        if (/\bafraid\b/i.test(field)) expect(field, p.slug).toMatch(/Help Lines|outside help|Afraid of your partner/);
      }
    }
  });

  it("Pause + Return flooding signs leave out contempt", () => {
    const signs = "racing heart, tunnel vision, can’t think straight";
    expect(getProtocol("pause-and-return")!.whenToUse).toContain(signs);
    expect(getProtocol("pause-and-return")!.whenToUse).not.toMatch(/contempt/i);
    expect(protocolDiagrams["pause-and-return"].when).not.toMatch(/contempt/i);
    expect(byId["flooded"].description).not.toMatch(/contempt/i);
  });

  it("Uninvestment Check: within a week, and no one caused drift", () => {
    const card = getProtocol("uninvestment-check")!;
    expect(JSON.stringify(card)).not.toMatch(/before you leave the conversation/);
    expect(card.activity).toContain("book a Full Recovery conversation within a week");
    expect(card.steps.join(" ")).toContain("For drift, no one “caused” it: you both name your part.");
  });

  it("Weekly Reset scope rule names the Monthly Review", () => {
    expect(getProtocol("weekly-reset")!.activity).toContain(
      "Only the five parts fit in 40 minutes: anything else (Proof reviews, plans for fun, the bigger picture) goes to the Monthly Review, a 40-minute once-a-month look at how things are going",
    );
  });

  it("/together points at the live Situation Map row", () => {
    const map = togetherTools.find((t) => t.href === "/")!;
    expect(map.note).toContain(`“${byId["outside-pressure"].label}”`);
  });

  it("Help lists the round 6 additions with the verified numbers", async () => {
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
    for (const l of all.filter((l) => l.href.startsWith("tel:"))) expect(l.href.slice(4), l.label).toBe(l.display.replace(/\D/g, ""));
    expect(PRIVATE_STORAGE_NOTE).toContain("keep this somewhere private");
  });

  it("states “scripts are training wheels” exactly once in the app", () => {
    const walk = (d: string): string[] =>
      readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
    const hits = walk(join(__dirname, "../src"))
      .filter((f) => /\.(tsx?|json)$/.test(f))
      .flatMap((f) => readFileSync(f, "utf8").match(/scripts are training wheels/gi) ?? []);
    expect(hits).toHaveLength(1);
  });
});
