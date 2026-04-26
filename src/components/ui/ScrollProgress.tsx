"use client";

import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [mounted, setMounted] = useState(false);
  const [percent, setPercent] = useState(0);
  const [theme, setTheme] = useState<"iron" | "doom">("doom");

  useEffect(() => setMounted(true), []);

  // Detect theme
  useEffect(() => {
    const check = () => {
      const attr = document.documentElement.getAttribute("data-theme");
      setTheme(attr === "iron" ? "iron" : "doom");
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  // Track percentage
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setPercent(Math.round(v * 100));
  });

  // Glow position
  const glowLeft = useTransform(scaleX, [0, 1], ["0%", "100%"]);

  if (!mounted) return null;

  const accent = theme === "iron" ? "#ef4444" : "#10b981";
  const glow = theme === "iron" ? "#facc15" : "#10b981";

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none" style={{ height: 3 }}>
      {/* Background Track */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255,255,255,0.03)",
          borderBottom: `1px solid rgba(148,163,184,0.08)`,
        }}
      />

      {/* Progress Fill */}
      <motion.div
        style={{
          scaleX,
          transformOrigin: "left",
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to right, transparent 0%, ${accent}66 30%, ${accent} 70%, ${glow} 100%)`,
        }}
      />

      {/* Bright End Cap Glow */}
      <motion.div
        style={{
          left: glowLeft,
          position: "absolute",
          top: -2,
          width: 6,
          height: 7,
          background: "#fff",
          borderRadius: "50%",
          filter: `blur(2px) drop-shadow(0 0 8px ${glow}) drop-shadow(0 0 15px ${accent})`,
          opacity: percent > 0 ? 1 : 0,
          transform: "translateX(-50%)",
        }}
      />

      {/* Bottom Reflection */}
      <motion.div
        style={{
          scaleX,
          transformOrigin: "left",
          position: "absolute",
          top: 3,
          left: 0,
          right: 0,
          height: 8,
          background: `linear-gradient(to bottom, ${accent}15, transparent)`,
        }}
      />
    </div>
  );
}
