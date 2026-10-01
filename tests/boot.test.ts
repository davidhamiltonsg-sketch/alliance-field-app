import { describe, expect, it } from "vitest";
import { INTRO_SEEN_KEY, splashBootScript } from "@/components/splash/boot";

function run({ seen, path, ua = "Mozilla/5.0 (iPhone)", throws = false }: { seen: boolean; path: string; ua?: string; throws?: boolean }) {
  const documentElement = { dataset: {} as Record<string, string> };
  const replaced: string[] = [];
  const localStorage = {
    getItem: (k: string) => {
      if (throws) throw new Error("SecurityError");
      return k === INTRO_SEEN_KEY && seen ? "1" : null;
    },
  };
  const location = { pathname: path, search: "", hash: "", replace: (u: string) => replaced.push(u) };
  new Function("document", "localStorage", "location", "navigator", splashBootScript)(
    { documentElement },
    localStorage,
    location,
    { userAgent: ua }
  );
  return { mode: documentElement.dataset.splash, replaced };
}

describe("splash boot script", () => {
  it("sends a first-time visitor on / straight to /intro", () => {
    expect(run({ seen: false, path: "/" })).toEqual({ mode: "full", replaced: ["/intro"] });
  });

  it("leaves returning visitors, other pages and crawlers alone", () => {
    expect(run({ seen: true, path: "/" })).toEqual({ mode: "short", replaced: [] });
    expect(run({ seen: false, path: "/about" })).toEqual({ mode: "full", replaced: [] });
    expect(run({ seen: false, path: "/", ua: "Googlebot/2.1" })).toEqual({ mode: "full", replaced: [] });
  });

  it("never shows the splash on /help, /pause or /unlock, first visit or not (M1)", () => {
    for (const path of ["/help", "/pause", "/unlock", "/help/"]) {
      expect(run({ seen: false, path })).toEqual({ mode: "off", replaced: [] });
      expect(run({ seen: true, path })).toEqual({ mode: "off", replaced: [] });
      expect(run({ seen: false, path, throws: true })).toEqual({ mode: "off", replaced: [] });
    }
    expect(run({ seen: false, path: "/helpful" }).mode).toBe("full");
    expect(run({ seen: true, path: "/pause-and-return" }).mode).toBe("short");
  });

  it("never redirects when storage is unavailable (no loop)", () => {
    expect(run({ seen: false, path: "/", throws: true })).toEqual({ mode: "full", replaced: [] });
  });
});
