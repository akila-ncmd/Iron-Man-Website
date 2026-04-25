import type { Metadata } from "next";
import { Inter, Bebas_Neue, Orbitron } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { MouseSpotlight } from "@/components/ui/MouseSpotlight";
import { LatverianEmbers } from "@/components/ui/LatverianEmbers";
import { CustomCursor } from "@/components/ui/CustomCursor";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const heading = Bebas_Neue({
  weight: "400",
  variable: "--font-heading",
  subsets: ["latin"],
});

const mono = Orbitron({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Avengers: Doomsday — 2026",
  description:
    "New mask. Same task. Scroll to witness the arrival of Doctor Doom. December 18, 2026.",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${heading.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full bg-background text-foreground grain">
        <div className="hud-overlay" />
        <div className="vignette" />
        <CustomCursor />
        <MouseSpotlight />
        <LatverianEmbers />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
