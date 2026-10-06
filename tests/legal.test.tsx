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
    expect(t).toContain("Alliance Protocols, by David Hamilton and Zhongming Shi, Singapore");
    expect(t).toMatch(/not therapy/);
    expect(t).toMatch(/We offer the site and app as they are/);
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

describe("The books, if you want more.", () => {
  it("hides buy links when no store URL is set", async () => {
    const html = await renderWith({ NEXT_PUBLIC_STORE_URL_MANUAL: "", NEXT_PUBLIC_STORE_URL_KIT: "", NEXT_PUBLIC_STORE_URL_BUNDLE: "", NEXT_PUBLIC_STORE_URL_VOLUME_A: "", NEXT_PUBLIC_STORE_URL_COMPLETE: "" }, store);
    expect(html).not.toMatch(/>Buy/);
    expect(text(html)).toContain("The books aren’t on sale yet.");
    // Each product states its own format, and tax is added at checkout.
    expect(text(html)).toMatch(/Field Kit.*PDF \+ print-ready files.*Volume A.*PDF \+ HTML.*Volume B.*PDF \+ HTML.*Complete Edition.*PDF.*Complete Bundle.*PDF \+ HTML \+ print-ready files/);
    expect(text(html)).toContain("Plus any VAT/GST calculated at checkout.");
    expect(text(html)).not.toContain("Prices may exclude");
    expect(text(html)).toContain("Download the Situation Map (PDF)");
    expect(text(html)).toContain("Download the sample (PDF)");
    // Sign-up isn't live, so the card doesn't promise it.
    expect(text(html)).not.toContain("sign up below");
    expect(text(html)).toContain("Email sign-up isn’t open yet");
  });

  it("gives each product only its own link: no shared fallback, so two products never open one page", async () => {
    const html = await renderWith(
      { NEXT_PUBLIC_STORE_URL_BUNDLE: "", NEXT_PUBLIC_STORE_URL_VOLUME_A: "", NEXT_PUBLIC_STORE_URL_COMPLETE: "", NEXT_PUBLIC_FULL_SYSTEM_URL: "https://store.example/all", NEXT_PUBLIC_STORE_URL_MANUAL: "https://store.example/manual", NEXT_PUBLIC_STORE_URL_KIT: "http://insecure.example/kit" },
      store,
    );
    expect(html).toContain('href="https://store.example/manual"');
    expect(html).not.toContain("store.example/all");
    expect(html.match(/>Buy/g)).toHaveLength(1); // kit (http refused), bundle and the rest unset
    expect(html).not.toContain("insecure.example");
    expect(text(html)).toMatch(/Field Kit.*Volume A.*Volume B.*Complete Edition.*Complete Bundle/);
  });

  it("with only a bundle link, shows only the bundle", async () => {
    const html = await renderWith({ NEXT_PUBLIC_STORE_URL_MANUAL: "", NEXT_PUBLIC_STORE_URL_KIT: "", NEXT_PUBLIC_STORE_URL_VOLUME_A: "", NEXT_PUBLIC_STORE_URL_COMPLETE: "", NEXT_PUBLIC_STORE_URL_BUNDLE: "https://store.example/b" }, store);
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

describe("store links: one variable per product", () => {
  it("renders each product's buy button only from its own variable", async () => {
    const store = () => import("@/components/GetFullSystem").then((m) => m.GetFullSystem);
    const vars = {
      NEXT_PUBLIC_STORE_URL_KIT: "https://store.example/kit",
      NEXT_PUBLIC_STORE_URL_MANUAL: "https://store.example/manual",
      NEXT_PUBLIC_STORE_URL_VOLUME_A: "https://store.example/volume-a",
      NEXT_PUBLIC_STORE_URL_COMPLETE: "https://store.example/complete",
      NEXT_PUBLIC_STORE_URL_BUNDLE: "https://store.example/bundle",
    };
    const html = await renderWith(vars, store);
    for (const url of Object.values(vars)) expect(html.match(new RegExp(`href="${url}"`, "g"))).toHaveLength(1);
    expect(html.match(/>Buy/g)).toHaveLength(5);
  });
});
