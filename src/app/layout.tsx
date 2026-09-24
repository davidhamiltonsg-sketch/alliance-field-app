import type { Metadata, Viewport } from "next";
import { AppHeader } from "@/components/AppHeader";
import { AppNav } from "@/components/AppNav";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "THE ALLIANCE · Field App",
    template: "%s · THE ALLIANCE Field App",
  },
  description:
    "Built for precision. Designed for connection. Field companion to THE ALLIANCE Manual and Kit.",
  applicationName: "THE ALLIANCE Field App",
  appleWebApp: {
    capable: true,
    title: "Alliance Field",
    statusBarStyle: "default",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <AppHeader />
        <main className="mx-auto w-full max-w-lg flex-1 px-4 pb-24 pt-4">
          {children}
        </main>
        <AppNav />
      </body>
    </html>
  );
}
