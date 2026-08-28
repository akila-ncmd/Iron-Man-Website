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

/**
 * Absolute URLs for Open Graph and Twitter cards are resolved against this.
 * It used to be hard-coded to localhost, which meant every share card in
 * production pointed its image at a machine the reader does not have. Vercel
 * injects the deployment host at build time, so the deployed site describes
 * itself and local dev still resolves to the dev server.
 */
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const title = "Avengers: Doomsday — 2026";
const description =
  "New mask. Same task. Scroll to witness the arrival of Doctor Doom. December 18, 2026.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title,
    description,
    url: "/",
    siteName: title,
    type: "website",
    images: [
      {
        url: "/doom_throne_cinematic.jpg",
        width: 1024,
        height: 576,
        alt: "Doctor Doom seated on the throne, lit in Latverian green.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/doom_throne_cinematic.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${heading.variable} ${mono.variable} antialiased relative`}
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
