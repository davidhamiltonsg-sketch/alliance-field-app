import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";

const nav = vi.hoisted(() => ({ path: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.path }));

import { AppNav } from "@/components/AppNav";

afterEach(() => {
  nav.path = "/";
});

const activeTab = (path: string) => {
  nav.path = path;
  const html = renderToStaticMarkup(<AppNav />);
  return [...html.matchAll(/<a [^>]*>/g)]
    .map((m) => m[0])
    .filter((tag) => tag.includes('aria-current="page"'))
    .map((tag) => tag.match(/href="([^"]+)"/)![1]);
};

describe("Together tab", () => {
  it("lights up on /together and /connect, but not on /about", () => {
    expect(activeTab("/together")).toEqual(["/together"]);
    expect(activeTab("/connect")).toEqual(["/together"]);
    expect(activeTab("/about")).toEqual([]);
    expect(activeTab("/")).toEqual(["/"]);
  });

  it("/together is a hub: outside pressure, Connection Cards, Profile Calibration, How this works, Help & safety", () => {
    const src = readFileSync(join(__dirname, "../src/app/together/page.tsx"), "utf8");
    for (const href of ["/protocols/team-agreement", "/connect", "/calibrate", "/about", "/help"]) {
      expect(src).toContain(`href: "${href}"`);
    }
    for (const label of ["Outside pressure", "Connection Cards", "Profile Calibration", "How this works", "Help & safety"]) {
      expect(src).toContain(`label: "${label}"`);
    }
    // Order: Connection Cards, then Outside pressure, then Profile Calibration; About and Help sit in "More" at the bottom.
    const at = (s: string) => src.indexOf(s);
    expect(at('label: "Connection Cards"')).toBeLessThan(at('label: "Outside pressure"'));
    expect(at('label: "Outside pressure"')).toBeLessThan(at('label: "Profile Calibration"'));
    expect(at("const more")).toBeLessThan(at('label: "How this works"'));
    expect(at("const more")).toBeLessThan(at('label: "Help & safety"'));
    expect(at('id="outside-pressure"')).toBeLessThan(at('id="more-heading"'));
    // The outside-pressure copy stays, as one section.
    expect(src).toContain('id="outside-pressure"');
    expect(src).toContain("minority stress");
  });
});
