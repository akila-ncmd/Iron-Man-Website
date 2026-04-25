"use client";

import Image from "next/image";
import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { LatverianEmbers } from "@/components/ui/LatverianEmbers";
import { DoomsdayTitle3D } from "@/components/ui/DoomsdayTitle3D";

export function ThroneRoom() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

  return (
    <section
      ref={containerRef}
      className="relative h-[120vh] w-full overflow-hidden bg-background"
    >
      {/* Background Image with Parallax and Cinematic Effects */}
      <motion.div 
        style={{ y: imageY, scale }}
        className="absolute inset-0 z-0 h-[120%] w-full"
      >
        <Image
          src="/doom_throne_cinematic.jpg"
          alt="Doctor Doom's Throne"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center opacity-100 brightness-100 contrast-105"
        />
        {/* Advanced Vignette & Color Grading Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
      </motion.div>

      {/* Atmospheric Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <LatverianEmbers />
      </div>

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <div className="flex flex-col items-center gap-6 max-w-4xl">
          <EyebrowBadge>SOVEREIGN QUARTERS // LATVERIA</EyebrowBadge>
          
          <div className="relative w-full h-48 md:h-64 lg:h-80 -mt-8">
            <DoomsdayTitle3D className="w-full h-full" />
            <h2 className="sr-only">Avengers Doomsday</h2>
          </div>
          
          <p className="max-w-[48ch] font-sans text-lg leading-relaxed text-zinc-300/90 md:text-xl">
            From the shadows of Latveria to the center of the Multiverse. 
            Every throne requires a sacrifice. Every king requires a kingdom. 
            And every reality requires a ruler.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px w-12 bg-accent/40" />
            <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent/80">
              Victor Von Doom
            </span>
            <div className="h-px w-12 bg-accent/40" />
          </div>
        </div>
      </motion.div>

      {/* Bottom HUD Detail */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-24 w-px bg-gradient-to-b from-accent/60 to-transparent" />
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500">
            Sovereign Protocol Active
          </span>
        </div>
      </div>
    </section>
  );
}
