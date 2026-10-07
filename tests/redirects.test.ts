import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

describe("redirects", () => {
  it("send the printed /situation-map and /map addresses to the map on the home page", async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    for (const source of ["/situation-map", "/map"]) {
      const r = redirects.find((x) => x.source === source);
      expect(r, source).toBeDefined();
      expect(r?.destination).toBe("/#situation-map");
    }
  });
});
