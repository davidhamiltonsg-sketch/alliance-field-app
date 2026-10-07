import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { SHOW_TESTIMONIALS, coupleTestimonials, individualTestimonials } from "@/data/testimonials";
import { TESTIMONIALS_DISCLAIMER, Testimonials } from "@/components/Testimonials";

/**
 * Testimonials are paraphrases of pilot feedback (October 2026 rewrite into
 * current tool names, with no outcome claims), pending each person's approval.
 * This pins them: if this test fails, the wording changed — only update the
 * hash for wording the people quoted have approved.
 */
// Updated October 2026 when the retired "2% habit" wording was replaced in one
// quote. The wording is still unapproved, so SHOW_TESTIMONIALS stays false.
const ORIGINAL_SHA256 = "e1890bc68cd75966f7d9dc13fba16267707cdcd7cbadfaa982dd707f9127d5c0";

describe("testimonials", () => {
  it("are the approved paraphrase, pinned", () => {
    const text = JSON.stringify([coupleTestimonials, individualTestimonials]);
    expect(createHash("sha256").update(text).digest("hex")).toBe(ORIGINAL_SHA256);
    expect(coupleTestimonials).toHaveLength(6);
    expect(individualTestimonials).toHaveLength(4);
  });

  it("use no retired names and make no outcome claims", () => {
    const text = JSON.stringify([coupleTestimonials, individualTestimonials]);
    expect(text).not.toMatch(/Care Audit|Team Frame|pursuer|withdrawer|Layer Scan|2% Rule/i);
    expect(text).not.toMatch(/changed everything|game-changer|completely|saved (us|me)|rebuild real trust/i);
  });

  it("are shown with the permission and results-vary note", () => {
    expect(TESTIMONIALS_DISCLAIMER).toBe("Paraphrased from pilot feedback. Individual experiences; results vary.");
    const html = renderToStaticMarkup(createElement(Testimonials));
    expect(html).toContain(TESTIMONIALS_DISCLAIMER);
    for (const t of [...coupleTestimonials, ...individualTestimonials]) expect(html).toContain(t.names.replace("&", "&amp;"));
  });

  it("are not rendered on the About page until each person approves the wording", () => {
    const about = readFileSync(join(__dirname, "..", "src", "app", "about", "page.tsx"), "utf8");
    expect(SHOW_TESTIMONIALS).toBe(false);
    expect(about).toMatch(/\{SHOW_TESTIMONIALS && <Testimonials \/>\}/);
    const others = ["page.tsx", "together/page.tsx", "start/page.tsx", "help/page.tsx"].map((f) =>
      readFileSync(join(__dirname, "..", "src", "app", f), "utf8"),
    );
    for (const src of others) expect(src).not.toContain("<Testimonials");
  });

  it("stay out of the copy scans (their wording is never “fixed”)", () => {
    const registryTest = readFileSync(join(__dirname, "registry.test.ts"), "utf8");
    expect(registryTest).toMatch(/testimonials\\\.ts\$/);
  });
});
