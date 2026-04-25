"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const CHARS = "!<>-_\\\\/[]{}—=+*^?#_0123456789";

interface ScrambleTextProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
}

export function ScrambleText({ text, className = "", duration = 1500, delay = 0 }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView) return;
    
    // If we've already done the initial scramble, just update the text immediately
    if (hasAnimated.current) {
      setDisplayText(text);
      return;
    }

    hasAnimated.current = true;

    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressRatio = Math.min(Math.max((progress - delay) / duration, 0), 1);

      if (progress < delay) {
        setDisplayText(Array(text.length).fill("_").join(""));
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      const revealedChars = Math.floor(progressRatio * text.length);
      
      let scrambled = text.substring(0, revealedChars);
      for (let i = revealedChars; i < text.length; i++) {
        if (text[i] === " ") {
          scrambled += " ";
        } else {
          scrambled += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      
      setDisplayText(scrambled);

      if (progressRatio < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [text, duration, delay, isInView]);

  return (
    <motion.span 
      ref={ref} 
      className={`inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.1, delay: delay / 1000 }}
    >
      {displayText}
    </motion.span>
  );
}
