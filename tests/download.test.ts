// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { REVOKE_AFTER_MS, downloadObjectUrl } from "@/lib/download";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("downloadObjectUrl (M6)", () => {
  it("starts the download, then revokes the object URL only after a delay", () => {
    vi.useFakeTimers();
    const revoke = vi.fn();
    URL.revokeObjectURL = revoke;
    const clicks: string[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      clicks.push(`${this.getAttribute("href")} ${this.download}`);
    });
    downloadObjectUrl("blob:abc", "x.ics");
    expect(clicks).toEqual(["blob:abc x.ics"]);
    expect(document.querySelector("a[download]")).toBeNull();
    expect(revoke).not.toHaveBeenCalled();
    vi.advanceTimersByTime(REVOKE_AFTER_MS - 1);
    expect(revoke).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(revoke).toHaveBeenCalledWith("blob:abc");
  });

  it("is what every calendar download uses", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    for (const name of ["PauseTimer", "WeeklyResetWizard", "KeepItGoing", "StartReminder"]) {
      const src = readFileSync(join(__dirname, `../src/components/${name}.tsx`), "utf8");
      expect(src, name).toContain("downloadObjectUrl(url, filename)");
      expect(src, name).not.toContain("URL.revokeObjectURL");
    }
  });
});
