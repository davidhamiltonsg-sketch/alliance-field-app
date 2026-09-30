import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { aboutAuthors, authorNames, authorsCoupleLine } from "@/data/authors";
import { coreFive, coreFiveSlugs } from "@/data/core5";
import { KIT } from "@/data/kit";
import { emergencyNumbers, helpRegions } from "@/data/help";
import { getProtocol, protocolSlugs, protocols } from "@/data/protocols";
import { situations } from "@/data/situations";
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
    const badge = protocolDiagrams["pause-and-return"].steps.find((s) => s.title === "Time")?.badge;
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

  it("Uninvestment Check lists 8 signs and the 0–2 / 3+ bands", () => {
    const card = getProtocol("uninvestment-check")!;
    expect(card.activity.match(/\(\d\)/g)).toHaveLength(8);
    expect(card.steps.join(" ")).toContain("0–2 signs");
    expect(card.steps.join(" ")).toContain("3 or more signs");
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
    expect(card.steps.join(" ")).toContain("Full Recovery within a week");
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
    expect(full).toContain("only if it's true for both of you");
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
    expect(byId["outside-pressure"].label).toMatch(/Outside pressure, disapproval or jealousy about others/);
    const diagrams = readFileSync(join(__dirname, "../src/components/intro/diagrams.tsx"), "utf8");
    expect(diagrams).toContain('q: ["Trust breach?"]');
    expect(diagrams).toContain('q: ["Pulling away?"]');
    expect(diagrams).toContain('a: ["Unity Anchor"]');
    expect(diagrams).not.toContain("Trust breach or");
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
      if (d.tool) expect(routes, `day ${d.day} → ${d.tool.href}`).toContain(d.tool.href);
    }
  });

  it("ends with the first Weekly Reset on day 7 and covers every Core 5 tool", () => {
    const last = startDays.at(-1)!;
    expect(last.day).toBe(7);
    expect(last.slug).toBe("weekly-reset");
    expect(last.task).toContain("40-minute timer");
    for (const slug of coreFiveSlugs) expect(startDays.map((d) => d.slug)).toContain(slug);
    for (const d of startDays.slice(0, -1)) expect(d.minutes).toBeLessThanOrEqual(10);
  });

  it("never offers a pause shorter than 20 minutes", () => {
    for (const d of startDays) expect(d.task).not.toMatch(/\b(10|15|ten|fifteen)[- ]?min(ute)? (pause|break)/i);
    expect(startDays.find((d) => d.slug === "pause-and-return")!.task).toContain("20 minutes minimum, 24 hours max");
  });
});

describe("About the authors", () => {
  it("credits both authors in one combined bio, with no placeholders", () => {
    expect(authorNames).toEqual(["David Hamilton", "Dr Zhongming Shi (Dami)"]);
    expect(aboutAuthors).toContain("David");
    expect(aboutAuthors).toContain("Dami");
    expect(aboutAuthors).not.toMatch(/\[\[/);
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
    expect(src).toContain("30 September 2026");
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
  it("has a real contact address and never links to a placeholder store", () => {
    expect(CONTACT_EMAIL).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/);
    expect(CONTACT_EMAIL).not.toMatch(/thealliance\.app/);
    if (!process.env.NEXT_PUBLIC_FULL_SYSTEM_URL) expect(FULL_SYSTEM_URL).toBeNull();
    expect(httpsUrlOrNull("http://example.com")).toBeNull();
    expect(httpsUrlOrNull("javascript:alert(1)")).toBeNull();
    expect(httpsUrlOrNull("https://store.example/p")).toBe("https://store.example/p");
    expect(componentSource("GetFullSystem")).toMatch(/Coming soon/);
  });
});
