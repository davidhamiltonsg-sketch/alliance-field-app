import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// The splash and app chrome read the current path; render them as the server would for a given page.
const nav = vi.hoisted(() => ({ path: "/" }));
vi.mock("next/navigation", () => ({
  usePathname: () => nav.path,
  useRouter: () => ({ replace: () => {}, push: () => {} }),
}));

import { Splash } from "@/components/splash/Splash";
import { ChromeGate, hidesAppChrome } from "@/components/ChromeGate";
import { isNoSplashPath } from "@/components/splash/boot";

afterEach(() => {
  nav.path = "/";
});

describe("opening splash (M1)", () => {
  it("is not even server-rendered on /help, /pause or /unlock", () => {
    for (const path of ["/help", "/pause", "/unlock"]) {
      nav.path = path;
      expect(isNoSplashPath(path)).toBe(true);
      expect(renderToStaticMarkup(<Splash />), path).toBe("");
    }
  });

  it("elsewhere carries a working Help link and a visible skip hint", () => {
    nav.path = "/about";
    const html = renderToStaticMarkup(<Splash />);
    expect(html).toContain('class="splash"');
    expect(html).toMatch(/<a href="\/help"[^>]*>Help<\/a>/);
    expect(html).toContain("Tap anywhere to skip");
    // No interactive element nested inside another (the splash itself is not a button).
    expect(html).not.toMatch(/class="splash"[^>]*role="button"/);
  });
});

describe("app chrome on the intro (M2)", () => {
  it("is not rendered on /intro, and is everywhere else", () => {
    nav.path = "/intro";
    expect(hidesAppChrome("/intro")).toBe(true);
    expect(renderToStaticMarkup(<ChromeGate><nav>App nav</nav></ChromeGate>)).toBe("");
    nav.path = "/help";
    expect(renderToStaticMarkup(<ChromeGate><nav>App nav</nav></ChromeGate>)).toBe("<nav>App nav</nav>");
    expect(hidesAppChrome("/introduction")).toBe(false);
  });
});
