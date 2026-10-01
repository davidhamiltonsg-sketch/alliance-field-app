import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { coupleTestimonials, individualTestimonials } from "@/data/testimonials";
import { TESTIMONIALS_DISCLAIMER, Testimonials } from "@/components/Testimonials";

/**
 * Testimonials are real people's words, kept exactly as first supplied
 * (CANON round 6). This pins them: if this test fails, the wording changed —
 * restore the original rather than updating the hash.
 */
const ORIGINAL_SHA256 = "7d8ca4698e561422703448201cbf05128a0da84d8686c41b20f32551492ce485";

describe("testimonials", () => {
  it("are the original wording, verbatim", () => {
    const text = JSON.stringify([coupleTestimonials, individualTestimonials]);
    expect(createHash("sha256").update(text).digest("hex")).toBe(ORIGINAL_SHA256);
    expect(coupleTestimonials).toHaveLength(6);
    expect(individualTestimonials).toHaveLength(4);
  });

  it("are shown with the permission and results-vary note", () => {
    expect(TESTIMONIALS_DISCLAIMER).toBe("Shared with permission. Individual experiences; results vary.");
    const html = renderToStaticMarkup(createElement(Testimonials));
    expect(html).toContain(TESTIMONIALS_DISCLAIMER);
    for (const t of [...coupleTestimonials, ...individualTestimonials]) expect(html).toContain(t.names.replace("&", "&amp;"));
  });

  it("stay out of the copy scans (their wording is never “fixed”)", () => {
    const registryTest = readFileSync(join(__dirname, "registry.test.ts"), "utf8");
    expect(registryTest).toMatch(/testimonials\\\.ts\$/);
  });
});
