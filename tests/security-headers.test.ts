import { describe, expect, it } from "vitest";
import { contentSecurityPolicy, originOf, securityHeaders } from "../src/lib/security-headers";

const directives = (csp: string) =>
  Object.fromEntries(csp.split("; ").map((d) => [d.split(" ")[0], d.split(" ").slice(1)]));

describe("security headers", () => {
  it("locks down everything but same-origin, with no eval in production", () => {
    const d = directives(contentSecurityPolicy());
    expect(d["default-src"]).toEqual(["'self'"]);
    expect(d["script-src"]).not.toContain("'unsafe-eval'");
    expect(d["script-src"].some((s: string) => s.startsWith("'sha256-"))).toBe(false);
    expect(d["frame-ancestors"]).toEqual(["'none'"]);
    expect(d["object-src"]).toEqual(["'none'"]);
    expect(d["base-uri"]).toEqual(["'self'"]);
    expect(d["connect-src"]).toEqual(["'self'"]);
    expect(d["form-action"]).toEqual(["'self'"]);
    expect(d["img-src"]).toEqual(["'self'", "data:", "blob:"]);
    expect(d["font-src"]).toEqual(["'self'"]);
  });

  it("allows only the signup endpoint's origin for connect and form-action", () => {
    const d = directives(contentSecurityPolicy({ signupEndpoint: "https://buttondown.com/api/emails/embed-subscribe/x?y=1" }));
    expect(d["connect-src"]).toEqual(["'self'", "https://buttondown.com"]);
    expect(d["form-action"]).toEqual(["'self'", "https://buttondown.com"]);
    expect(originOf("javascript:alert(1)")).toBeNull();
    expect(originOf("not a url")).toBeNull();
    expect(originOf("")).toBeNull();
  });

  it("sends the standard hardening headers", () => {
    const h = Object.fromEntries(securityHeaders().map(({ key, value }) => [key, value]));
    expect(h["X-Content-Type-Options"]).toBe("nosniff");
    expect(h["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["Permissions-Policy"]).toBe("camera=(), microphone=(), geolocation=()");
  });
});
