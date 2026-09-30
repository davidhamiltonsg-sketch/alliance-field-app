import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { AppHeader } from "@/components/AppHeader";
import { AppNav } from "@/components/AppNav";
import { Splash } from "@/components/splash/Splash";
import { splashBootScript } from "@/components/splash/boot";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import launchScreenList from "@/data/launch-screens.json";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
  display: "swap",
});

// iOS launch screens, [cssWidth, cssHeight, dpr] — the same list
// scripts/generate-icons.mjs renders the PNGs from.
const launchScreens = launchScreenList as [number, number, number][];

export const metadata: Metadata = {
  metadataBase: new URL("https://alliance-field-app.vercel.app"),
  title: {
    default: "THE ALLIANCE · Field App",
    template: "%s · THE ALLIANCE Field App",
  },
  description:
    "Built for precision. Designed for connection. Field companion to THE ALLIANCE Manual and Kit.",
  applicationName: "THE ALLIANCE Field App",
  authors: [{ name: "David Hamilton" }, { name: "Dr Zhongming Shi" }],
  appleWebApp: {
    capable: true,
    title: "Alliance Field",
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
    title: "THE ALLIANCE · Field App",
    description: "Built for precision. Designed for connection.",
    images: [{ url: "/icon-512.png", width: 512, height: 512 }],
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
        <div className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-paper sm:border-x sm:border-rule/[0.07] sm:shadow-[0_0_60px_-20px_rgb(44_62_45/0.25)]">
          <AppHeader />
          <main className="flex-1 px-4 pb-28 pt-4">{children}</main>
          <AppNav />
        </div>
      </body>
    </html>
  );
}
