"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { AnimatedItem, AnimatedSection } from "@/components/ui/AnimatedSection";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { Magnetic } from "@/components/ui/Magnetic";
import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

const telemetry = [
  { label: "Multiverse Stability", value: "32.4%", note: "Timeline degradation" },
  { label: "Latverian Output", value: "Infinite", note: "Sovereign power source" },
  { label: "Temporal Reach", value: "Universal", note: "Cross-reality access" },
  { label: "Response Time", value: "Instant", note: "Divine will, V.I.C.T.O.R." },
];

export function SystemsNominal() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const faceOpacity = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0, 0.45, 0.45, 0]);
  const faceY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      id="systems"
      ref={containerRef}
      className="relative border-t border-white/5 bg-background px-6 pb-28 pt-24 md:px-10 md:pb-40 md:pt-32 overflow-hidden"
    >
      {/* Background Doctor Doom Face */}
      <motion.div 
        style={{ opacity: faceOpacity, y: faceY }}
        className="absolute right-0 top-0 z-0 h-full w-full pointer-events-none md:w-[60%]"
      >
        <div className="relative h-full w-full">
          <Image
            src="/Doctor Doom Face.png"
            alt="Doctor Doom"
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-contain object-right-top grayscale brightness-125 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/20" />
        </div>
      </motion.div>

      <div className="mx-auto relative z-10 flex max-w-[1400px] flex-col gap-16 md:grid md:grid-cols-[5fr_4fr] md:gap-20">
        <AnimatedSection className="flex flex-col gap-8">
          <AnimatedItem>
            <EyebrowBadge>V.I.C.T.O.R. // SYSTEMS SUPREME</EyebrowBadge>
          </AnimatedItem>
          <AnimatedItem>
            <h2 className="max-w-[16ch] font-heading text-5xl leading-[0.9] tracking-tighter text-foreground md:text-7xl">
              &ldquo;New mask.&hellip; Same&hellip;{" "}
              <span className="text-accent">Task.</span>&rdquo;
            </h2>
          </AnimatedItem>
          <AnimatedItem>
            <p className="max-w-[48ch] font-sans text-base leading-relaxed text-zinc-400 md:text-lg">
              The multiverse is a canvas, and Doctor Doom is the artist. 
              Forged in the fires of Battleworld and destined for absolute rule.
              Every reading above represents the shifting reality as we approach
              December 2026.
            </p>
          </AnimatedItem>
          <AnimatedItem>
            <Magnetic strength={20}>
              <a
                href="#footer"
                className="group inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-foreground backdrop-blur-md transition-all duration-300 hover:border-accent/60 hover:bg-accent/10 hover:text-accent hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] active:translate-y-[1px]"
              >
                Enter Battleworld
                <ArrowUpRight
                  size={14}
                  weight="bold"
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </Magnetic>
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="flex flex-col divide-y divide-white/8 border-t border-white/8 font-mono md:mt-3">
          {telemetry.map((row) => (
            <AnimatedItem key={row.label}>
              <div className="flex items-baseline justify-between gap-6 py-5">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                    {row.label}
                  </span>
                  <span className="font-sans text-[13px] text-zinc-400">
                    {row.note}
                  </span>
                </div>
                <span className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  <ScrambleText text={row.value} duration={1200} delay={200} />
                </span>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
