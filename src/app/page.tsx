"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { CinematicReveal } from "@/components/sections/CinematicReveal";
import { SystemsNominal } from "@/components/sections/SystemsNominal";
import { CountdownSection } from "@/components/sections/CountdownSection";
import { Footer } from "@/components/sections/Footer";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { PageReveal } from "@/components/ui/PageReveal";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { HudScrollbar } from "@/components/ui/HudScrollbar";

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Lock scroll while loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [loading]);

  return (
    <>
      {loading ? (
        <LoadingScreen onComplete={() => setLoading(false)} />
      ) : (
        <>
          <ScrollProgress />
          <HudScrollbar />
          <PageReveal>
            <Navbar />
          <main>
            <div className="[--accent:var(--iron-red)] [--accent-glow:var(--iron-glow)] [--accent-soft:var(--iron-soft)]">
              <Hero />
              <CinematicReveal />
            </div>
            <SystemsNominal />
            <CountdownSection />
          </main>
          <Footer />
        </PageReveal>
      </>
    )}
    </>
  );
}
