import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

/** Renders a page or component with the given build-time env vars. */
async function renderWith(env: Record<string, string>, load: () => Promise<React.ComponentType>) {
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
  vi.resetModules();
  const Component = await load();
  return renderToStaticMarkup(<Component />);
}
const terms = () => import("@/app/terms/page").then((m) => m.default);
const privacy = () => import("@/app/privacy/page").then((m) => m.default);
const store = () => import("@/components/GetFullSystem").then((m) => m.GetFullSystem);
const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&#x27;|&rsquo;/g, "’").replace(/\s+/g, " ");

describe("/terms", () => {
  it("says who runs the site, no warranty, not therapy, acceptable use, privacy and statutory rights", async () => {
    const t = text(await renderWith({ NEXT_PUBLIC_CONTACT_EMAIL: "" }, terms));
    expect(t).toContain("Alliance Protocols, by David Hamilton and Dr Zhongming Shi, Singapore");
    expect(t).toMatch(/not therapy/);
    expect(t).toMatch(/provided as they are/);
    expect(t).toMatch(/Please don’t/);
    expect(t).toMatch(/limit their contact with friends, family, money, phone or movement/);
    expect(t).toMatch(/statutory rights are not affected/i);
    expect(t).toContain("via allianceprotocols.com");
    expect(await renderWith({ NEXT_PUBLIC_CONTACT_EMAIL: "" }, terms)).toContain('href="/privacy"');
  });

  it("keeps the owner's to-do (governing law, address) in a code comment only", async () => {
    const src = readFileSync(join(__dirname, "../src/app/terms/page.tsx"), "utf8");
    expect(src).toMatch(/\/\*[\s\S]*TO BE COMPLETED BY THE OWNER[\s\S]*governing law[\s\S]*address[\s\S]*\*\//);
    const t = text(await renderWith({}, terms));
    expect(t).not.toMatch(/governing law|to be completed|TODO/i);
  });

  it("shows the contact address only when one is configured", async () => {
    expect(await renderWith({ NEXT_PUBLIC_CONTACT_EMAIL: "team@allianceprotocols.com" }, terms)).toContain("mailto:team@allianceprotocols.com");
    expect(await renderWith({ NEXT_PUBLIC_CONTACT_EMAIL: "not-an-address" }, terms)).not.toContain("mailto:");
  });

  it("is linked from the home footer, About and Privacy, and public while locked", async () => {
    for (const f of ["page.tsx", "about/page.tsx", "privacy/page.tsx"]) {
      expect(readFileSync(join(__dirname, "../src/app", f), "utf8"), f).toContain('href="/terms"');
    }
    const { isPublicPath } = await import("@/lib/launch-lock");
    expect(isPublicPath("/terms")).toBe(true);
  });
});

describe("/privacy", () => {
  it("without a provider name: says the sign-up is not active, and covers Gumroad, transfers, retention and deletion", async () => {
    const t = text(await renderWith({ NEXT_PUBLIC_SIGNUP_ENDPOINT: "https://list.example/x", NEXT_PUBLIC_EMAIL_PROVIDER_NAME: "", NEXT_PUBLIC_CONTACT_EMAIL: "" }, privacy));
    expect(t).toMatch(/email sign-up isn’t active yet/);
    expect(t).toMatch(/Gumroad/);
    expect(t).toMatch(/outside Singapore/);
    expect(t).toMatch(/How long data is kept/);
    expect(t).toMatch(/Asking us to delete your data/);
    expect(t).toContain("via allianceprotocols.com");
    expect(t).not.toMatch(/hello@/);
  });

  it("with a provider: names it", async () => {
    const t = text(await renderWith({ NEXT_PUBLIC_SIGNUP_ENDPOINT: "https://list.example/x", NEXT_PUBLIC_EMAIL_PROVIDER_NAME: "Buttondown" }, privacy));
    expect(t).toMatch(/Buttondown, the service that runs our mailing list/);
    expect(t).not.toMatch(/isn’t active yet/);
  });
});

describe("Get the full system", () => {
  it("hides buy links when no store URL is set", async () => {
    const html = await renderWith({ NEXT_PUBLIC_FULL_SYSTEM_URL: "", NEXT_PUBLIC_STORE_URL_MANUAL: "", NEXT_PUBLIC_STORE_URL_KIT: "", NEXT_PUBLIC_STORE_URL_BUNDLE: "" }, store);
    expect(html).not.toMatch(/>Buy/);
    expect(text(html)).toContain("Coming soon.");
    expect(text(html)).toContain("Digital PDF + HTML");
    // Sign-up isn't live, so the card doesn't promise it.
    expect(text(html)).not.toContain("sign up below");
    expect(text(html)).toContain("Email sign-up isn’t open yet");
  });

  it("gives each product its own link, falling back to the single store URL", async () => {
    const html = await renderWith(
      { NEXT_PUBLIC_FULL_SYSTEM_URL: "https://store.example/all", NEXT_PUBLIC_STORE_URL_MANUAL: "https://store.example/manual", NEXT_PUBLIC_STORE_URL_KIT: "http://insecure.example/kit", NEXT_PUBLIC_STORE_URL_BUNDLE: "" },
      store,
    );
    expect(html).toContain('href="https://store.example/manual"');
    expect(html.match(/href="https:\/\/store\.example\/all"/g)).toHaveLength(2); // kit (http refused) and bundle
    expect(html).not.toContain("insecure.example");
    expect(text(html)).toMatch(/Operating Manual.*Field Kit.*Complete Bundle/);
  });

  it("with only a bundle link, shows only the bundle", async () => {
    const html = await renderWith({ NEXT_PUBLIC_FULL_SYSTEM_URL: "", NEXT_PUBLIC_STORE_URL_MANUAL: "", NEXT_PUBLIC_STORE_URL_KIT: "", NEXT_PUBLIC_STORE_URL_BUNDLE: "https://store.example/b" }, store);
    expect(html.match(/>Buy/g)).toHaveLength(1);
    expect(html).toContain('href="https://store.example/b"');
  });
});

describe("email sign-up", () => {
  it("is live only with both an endpoint and a provider name, and confirms carefully", async () => {
    const off = await renderWith({ NEXT_PUBLIC_SIGNUP_ENDPOINT: "https://list.example/x", NEXT_PUBLIC_EMAIL_PROVIDER_NAME: "" }, () => import("@/components/SignupForm").then((m) => m.SignupForm));
    expect(off).not.toContain("<form");
    const on = await renderWith({ NEXT_PUBLIC_SIGNUP_ENDPOINT: "https://list.example/x", NEXT_PUBLIC_EMAIL_PROVIDER_NAME: "Buttondown" }, () => import("@/components/SignupForm").then((m) => m.SignupForm));
    expect(on).toContain("<form");
    const { SIGNUP_SUCCESS } = await import("@/components/SignupForm");
    expect(SIGNUP_SUCCESS).toBe("If the address is right, a confirmation email will arrive shortly.");
  });
});

describe("About", () => {
  it("uses the new line and marks the wordmark ™ once", () => {
    const src = readFileSync(join(__dirname, "../src/app/about/page.tsx"), "utf8");
    expect(src).toContain("What we use when it goes wrong, written down so you can use it too.");
    expect(src).not.toMatch(/relationship operating system/i);
    expect(src.match(/™/g)).toHaveLength(1);
    expect(src).toContain("ALLIANCE PROTOCOLS™");
  });
});
