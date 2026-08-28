"use client";

import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";

export function PageReveal({ children }: { children: React.ReactNode }) {
  const [isRevealing, setIsRevealing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealing(false);
    }, 2000); // Duration of the reveal animation
    return () => clearTimeout(timer);
  }, []);

  const barVariants: Variants = {
    initial: { scaleY: 1 },
    animate: (i: number) => ({
      scaleY: 0,
      transition: {
        duration: 0.8,
        ease: [0.645, 0.045, 0.355, 1] as [number, number, number, number],
        delay: 0.05 * i,
      },
    }),
  };

  const bars = Array.from({ length: 8 });

  return (
    <div className="relative min-h-screen">
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          filter: "blur(0px)",
          transition: {
            duration: 1.5,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.4
          }
        }}
      >
        {children}
      </motion.div>

      {/* Shutter Overlay */}
      <div className="fixed inset-0 z-[10000] pointer-events-none flex flex-col">
        {bars.map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={barVariants}
            initial="initial"
            animate="animate"
            style={{ 
              originY: i < 4 ? 0 : 1,
              backgroundColor: "#08090a"
            }}
            className="flex-1 w-full relative border-b border-white/5 overflow-hidden"
          >
             {/* Metal Texture/Grain */}
             <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.svg')] mix-blend-overlay" />
             
             {/* Edge Glow */}
             <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-accent/20 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
          </motion.div>
        ))}
      </div>

      {/* Diagnostic Reveal Text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0, 1, 1, 0],
          scale: [0.8, 1, 1, 1.1],
        }}
        transition={{ duration: 2, times: [0, 0.2, 0.8, 1], delay: 0.1 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10003] pointer-events-none"
      >
        <div className="font-mono text-[10px] tracking-[0.6em] text-accent uppercase flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-[1px] bg-accent/30" />
            <span className="glitch-text" data-text="SYSTEMS ONLINE">SYSTEMS ONLINE</span>
            <div className="w-16 h-[1px] bg-accent/30" />
          </div>
          <div className="flex gap-8 text-[8px] text-accent/40 tracking-[0.4em]">
            <span>MK-LXXXV</span>
            <span>OS-v14.2</span>
            <span>STARK-HUD</span>
          </div>
        </div>
      </motion.div>

      {/* HUD Scanning Line */}
      <motion.div
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{ duration: 1.8, ease: "easeInOut", delay: 0.1 }}
        className="fixed left-0 right-0 h-[2px] bg-accent/60 shadow-[0_0_20px_rgba(16,185,129,0.8)] z-[10001] pointer-events-none"
      />
      
      {/* Cinematic Flash */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 0.5, 0],
          transition: { duration: 1, times: [0, 0.5, 1], delay: 0.6 }
        }}
        className="fixed inset-0 z-[10004] pointer-events-none bg-white"
      />
    </div>
  );
}
