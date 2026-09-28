import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { AppHeader } from "@/components/AppHeader";
import { AppNav } from "@/components/AppNav";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://alliance-field-app.vercel.app"),
  title: {
    default: "THE ALLIANCE · Field App",
    template: "%s · THE ALLIANCE Field App",
  },
  description:
    "Built for precision. Designed for connection. Field companion to THE ALLIANCE Manual and Kit.",
  applicationName: "THE ALLIANCE Field App",
  authors: [{ name: "David Hamilton" }],
  appleWebApp: {
    capable: true,
    title: "Alliance Field",
    statusBarStyle: "default",
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
  themeColor: "#3D5A4C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
    >
      <body className="min-h-full text-ink">
        <div className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-paper sm:border-x sm:border-rule/[0.07] sm:shadow-[0_0_60px_-20px_rgb(44_62_45/0.25)]">
          <AppHeader />
          <main className="flex-1 px-4 pb-28 pt-4">{children}</main>
          <AppNav />
        </div>
      </body>
    </html>
  );
}
