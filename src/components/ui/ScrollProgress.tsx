"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[100] pointer-events-none">
      {/* Background Track */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
      
      {/* Progress Fill */}
      <motion.div
        className="h-full bg-gradient-to-r from-transparent via-[var(--cursor-accent)] to-[var(--cursor-glow)] origin-left"
        style={{ scaleX }}
      />
      
      {/* Glowing End Cap */}
      <motion.div
        className="absolute top-0 h-full w-2 bg-white blur-[2px] shadow-[0_0_10px_#fff]"
        style={{ 
          left: `${(scaleX.get() * 100).toFixed(2)}%`,
          opacity: scaleX.get() > 0.01 ? 1 : 0
        }}
      />

      {/* Percentage Readout (Optional HUD element) */}
      <div className="absolute top-2 right-4 font-mono text-[10px] tracking-tighter text-[var(--cursor-accent)] opacity-50 uppercase">
        Systems Nominal // Scroll {Math.round(scrollYProgress.get() * 100)}%
      </div>
    </div>
  );
}
