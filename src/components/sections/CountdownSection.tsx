"use client";

import { useEffect, useState } from "react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { DoomMask3D } from "@/components/ui/DoomMask3D";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { HudFrame } from "@/components/ui/HudFrame";

function CountdownUnit({ label, value, align = "center", delay = 0 }: { label: string, value: string, align?: "left" | "right" | "center", delay?: number }) {
  return (
    <div className={`flex flex-col gap-1 ${align === "left" ? "items-start text-left" : align === "right" ? "items-end text-right" : "items-center text-center"}`}>
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/60 mb-1">{label}</span>
      <div className="relative group">
        <div className="absolute -inset-2 bg-accent/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
        <ScrambleText 
          text={value} 
          className="font-mono text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tabular-nums tracking-tighter" 
          delay={delay}
        />
      </div>
    </div>
  );
}

export function CountdownSection() {
  const targetDate = "2026-12-18T00:00:00";
  const [timeLeft, setTimeLeft] = useState({
    days: "000",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(3, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section id="countdown" className="relative border-t border-white/5 bg-background px-6 py-24 md:px-10 md:py-40 overflow-hidden">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-center text-center gap-20">
        <AnimatedSection className="flex flex-col items-center gap-12 w-full max-w-6xl">
          <AnimatedItem>
            <EyebrowBadge>MULTIVERSE CONVERGENCE</EyebrowBadge>
          </AnimatedItem>
          
          <AnimatedItem>
            <h2 className="font-heading text-6xl leading-[0.8] tracking-tighter text-foreground md:text-8xl lg:text-9xl flex flex-col items-center">
              <span className="text-white/90 text-[0.55em] tracking-[0.1em]">Avengers</span>
              <span className="text-accent shimmer-emerald drop-shadow-[0_0_30px_rgba(16,185,129,0.4)]">Doomsday</span>
            </h2>
          </AnimatedItem>

          <AnimatedItem className="w-full relative mt-8">
            <div className="relative mx-auto w-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0">
              
              {/* LEFT HUD: Days & Hours */}
              <div className="flex flex-row md:flex-col gap-12 md:gap-24 z-20 md:w-1/4 items-center md:items-end">
                 <CountdownUnit label="Days" value={timeLeft.days} align="right" delay={200} />
                 <CountdownUnit label="Hours" value={timeLeft.hours} align="right" delay={400} />
              </div>

              {/* CENTER: The Mask */}
              <div className="relative w-full aspect-square max-w-[500px] z-10 flex items-center justify-center group">
                {/* HUD Targeting Circles */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[100%] h-[100%] border border-accent/20 rounded-full animate-[spin_20s_linear_infinite]" style={{ borderStyle: 'dashed' }} />
                  <div className="absolute w-[85%] h-[85%] border border-accent/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" style={{ borderStyle: 'dotted' }} />
                  <div className="absolute w-[70%] h-[70%] border border-accent/5 rounded-full" />
                </div>
                
                {/* Inner Glow */}
                <div className="absolute inset-0 bg-accent/5 blur-[120px] rounded-full group-hover:bg-accent/10 transition-colors duration-1000" />
                
                {/* HUD Brackets */}
                <HudFrame corner="tl" className="absolute -top-4 -left-4 text-accent/60" size={60} />
                <HudFrame corner="tr" className="absolute -top-4 -right-4 text-accent/60" size={60} />
                <HudFrame corner="bl" className="absolute -bottom-4 -left-4 text-accent/60" size={60} />
                <HudFrame corner="br" className="absolute -bottom-4 -right-4 text-accent/60" size={60} />
                
                {/* Scanlines Overlay for the Mask area */}
                <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none z-20 opacity-20">
                    <div className="w-full h-1 bg-accent/30 absolute top-0 animate-[scanline_4s_linear_infinite]" />
                </div>

                <div className="w-full h-full">
                  <DoomMask3D />
                </div>
              </div>

              {/* RIGHT HUD: Minutes & Seconds */}
              <div className="flex flex-row md:flex-col gap-12 md:gap-24 z-20 md:w-1/4 items-center md:items-start">
                 <CountdownUnit label="Minutes" value={timeLeft.minutes} align="left" delay={600} />
                 <CountdownUnit label="Seconds" value={timeLeft.seconds} align="left" delay={800} />
              </div>

            </div>
          </AnimatedItem>

          <AnimatedItem>
             <div className="flex flex-col items-center gap-4 mt-12">
               <div className="h-px w-24 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
               <p className="max-w-md text-zinc-500 text-xs font-mono uppercase tracking-[0.4em] leading-relaxed">
                 Timeline destabilization: 99.8%
                 <br />
                 Status: <span className="text-accent animate-pulse">Convergence Imminent</span>
               </p>
             </div>
          </AnimatedItem>
        </AnimatedSection>
      </div>
      
      {/* Styles for custom animations */}
      <style jsx global>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(500%); }
        }
      `}</style>
    </section>
  );
}
