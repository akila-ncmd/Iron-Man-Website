"use client";

import { useEffect, useState } from "react";
import { ScrambleText } from "./ScrambleText";

export function Countdown({ targetDate = "2026-12-18T00:00:00" }: { targetDate?: string }) {
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
    <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
      <div className="flex flex-col items-center gap-1">
        <ScrambleText text={timeLeft.days} className="text-sm text-foreground" delay={200} />
        <span>Days</span>
      </div>
      <span className="text-zinc-600 mb-4">:</span>
      <div className="flex flex-col items-center gap-1">
        <ScrambleText text={timeLeft.hours} className="text-sm text-foreground" delay={300} />
        <span>Hrs</span>
      </div>
      <span className="text-zinc-600 mb-4">:</span>
      <div className="flex flex-col items-center gap-1">
        <ScrambleText text={timeLeft.minutes} className="text-sm text-foreground" delay={400} />
        <span>Min</span>
      </div>
      <span className="text-zinc-600 mb-4">:</span>
      <div className="flex flex-col items-center gap-1">
        <ScrambleText text={timeLeft.seconds} className="text-sm text-foreground" delay={500} />
        <span>Sec</span>
      </div>
    </div>
  );
}
