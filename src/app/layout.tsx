import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { AppHeader } from "@/components/AppHeader";
import { AppNav } from "@/components/AppNav";
import { ChromeGate } from "@/components/ChromeGate";
import { Splash } from "@/components/splash/Splash";
import { splashBootScript } from "@/components/splash/boot";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import launchScreenList from "@/data/launch-screens.json";
import "./globals.css";

// Self-hosted (OFL, licences alongside) so builds never depend on
// fetching from Google Fonts.
const inter = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  weight: "400 600",
  variable: "--font-inter",
  display: "swap",
});

const sourceSerif = localFont({
  src: [
    {
      path: "./fonts/source-serif-4-latin-wght-normal.woff2",
      weight: "400 600",
      style: "normal",
    },
    {
      path: "./fonts/source-serif-4-latin-wght-italic.woff2",
      weight: "400 600",
      style: "italic",
    },
  ],
  variable: "--font-source-serif",
  display: "swap",
});

// iOS launch screens, [cssWidth, cssHeight, dpr] — the same list
// scripts/generate-icons.mjs renders the PNGs from.
const launchScreens = launchScreenList as [number, number, number][];

export const metadata: Metadata = {
  metadataBase: new URL("https://allianceprotocols.com"),
  title: {
    default: "ALLIANCE PROTOCOLS · Field App",
    template: "%s · Alliance Protocols Field App",
  },
  description:
    "Built for precision. Designed for connection. Field companion to the Alliance Protocols Manual and Kit.",
  applicationName: "Alliance Protocols Field App",
  authors: [{ name: "David Hamilton" }, { name: "Dr Zhongming Shi" }],
  appleWebApp: {
    capable: true,
    title: "Alliance",
    statusBarStyle: "default",
    startupImage: launchScreens.map(([w, h, r]) => ({
      url: `/splash/launch-${w * r}x${h * r}.png`,
      media: `(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${r}) and (orientation: portrait)`,
    })),
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "ALLIANCE PROTOCOLS · Field App",
    description: "Built for precision. Designed for connection.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Alliance Protocols Field App: “What’s happening right now?” with three routes, afraid, flooded or something else",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#2C3E2D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: splashBootScript }} />
      </head>
      <body className="min-h-full text-ink">
        <ServiceWorkerRegister />
        <Splash />
        <div className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-paper sm:border-x sm:border-rule/30 sm:shadow-[0_0_60px_-20px_rgb(44_62_45/0.25)]">
          <ChromeGate>
            <AppHeader />
          </ChromeGate>
          <main className="flex-1 px-4 pb-28 pt-4">{children}</main>
          <ChromeGate>
            <AppNav />
          </ChromeGate>
        </div>
      </body>
    </html>
  );
}
