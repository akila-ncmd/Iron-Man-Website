"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [theme, setTheme] = useState<"iron" | "doom">("doom");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 400, damping: 28, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 400, damping: 28, mass: 0.5 });

  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setMounted(true);

    let animationFrameId: number;
    const updateRotation = () => {
      setRotation((prev) => (prev + 1) % 360);
      animationFrameId = requestAnimationFrame(updateRotation);
    };
    updateRotation();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") ||
        target.closest("a") ||
        window.getComputedStyle(target).cursor === "pointer"
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const checkTheme = () => {
      const hero = document.getElementById("hero");
      const cinematic = document.getElementById("cinematic");
      const vCenter = window.innerHeight / 2;

      let iron = false;
      [hero, cinematic].forEach(el => {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= vCenter && rect.bottom >= vCenter) {
            iron = true;
          }
        }
      });
      
      const newTheme = iron ? "iron" : "doom";
      setTheme(newTheme);
      if (document.documentElement.getAttribute("data-theme") !== newTheme) {
        document.documentElement.setAttribute("data-theme", newTheme);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("scroll", checkTheme, { passive: true });
    
    checkTheme();
    
    document.documentElement.classList.add("hide-default-cursor");
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("scroll", checkTheme);
      document.documentElement.classList.remove("hide-default-cursor");
      cancelAnimationFrame(animationFrameId);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  // Colors based on theme for immediate style application
  const accentColor = theme === "iron" ? "#ef4444" : "#10b981";
  const glowColor = theme === "iron" ? "#facc15" : "#10b981";

  return (
    <>
      {/* Arc Reactor Rings (Outer Follower) */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center mix-blend-screen"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 1.4 : 1,
            opacity: isHovering ? 0.9 : 0.5,
          }}
          transition={{ scale: { duration: 0.3, type: "spring" } }}
          className="relative flex items-center justify-center h-16 w-16"
        >
          {/* Outer Housing Ring */}
          <motion.div 
            className="absolute inset-0 rounded-full border opacity-40"
            animate={{ rotate: isHovering ? -180 : -rotation * 0.5 }}
            transition={{ rotate: { duration: 0 } }}
            style={{ 
              borderColor: accentColor,
              boxShadow: isHovering ? `0 0 20px ${glowColor}` : "none" 
            }}
          />
          
          {/* Electromagnetic Coil Ring (Dashed) */}
          <motion.div 
            className="absolute inset-1 rounded-full border-[3px] border-dashed"
            animate={{ rotate: isHovering ? 360 : rotation * 1.5 }}
            transition={{ rotate: { duration: 0 } }}
            style={{ 
              borderColor: accentColor,
              filter: `drop-shadow(0 0 8px ${glowColor})` 
            }}
          />
 
          {/* Inner Containment Ring */}
          <motion.div 
            className="absolute inset-3 rounded-full border-2 opacity-60"
            animate={{ rotate: isHovering ? -360 : -rotation * 2 }}
            transition={{ rotate: { duration: 0 } }}
            style={{ 
              borderColor: accentColor,
              borderStyle: "dotted", 
              filter: `drop-shadow(0 0 5px ${glowColor})` 
            }}
          />
        </motion.div>
      </motion.div>
  
      {/* Arc Reactor Core (Inner Precision Dot) */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[10000] mix-blend-screen"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 2 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="flex h-3 w-3 items-center justify-center rounded-full"
          style={{ 
            backgroundColor: isHovering ? "#fff" : accentColor,
            boxShadow: isHovering 
              ? `0 0 35px 12px ${glowColor}` 
              : `0 0 25px 6px ${glowColor}`
          }}
        >
          {/* High-energy white core center */}
          <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_5px_#fff]" />
        </motion.div>
      </motion.div>
    </>
  );
}
