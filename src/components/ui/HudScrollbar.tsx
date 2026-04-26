"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export function HudScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [theme, setTheme] = useState<"iron" | "doom">("doom");
  const [scrollPercent, setScrollPercent] = useState(0);

  const thumbY = useMotionValue(0);
  const smoothThumbY = useSpring(thumbY, { stiffness: 300, damping: 40, mass: 0.3 });
  const glowIntensity = useSpring(0, { stiffness: 200, damping: 30 });

  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dragStartYRef = useRef(0);
  const dragStartScrollRef = useRef(0);

  const getThumbHeight = useCallback(() => {
    const docHeight = document.documentElement.scrollHeight;
    const viewHeight = window.innerHeight;
    const ratio = viewHeight / docHeight;
    return Math.max(60, Math.min(ratio * viewHeight, viewHeight * 0.4));
  }, []);

  const getTrackHeight = useCallback(() => {
    return window.innerHeight - 120; // 60px padding top + bottom
  }, []);

  const updateThumbPosition = useCallback(() => {
    const docHeight = document.documentElement.scrollHeight;
    const viewHeight = window.innerHeight;
    const scrollTop = window.scrollY;
    const maxScroll = docHeight - viewHeight;
    if (maxScroll <= 0) return;

    const progress = scrollTop / maxScroll;
    const trackH = getTrackHeight();
    const thumbH = getThumbHeight();
    const maxThumbY = trackH - thumbH;

    thumbY.set(progress * maxThumbY);
    setScrollPercent(Math.round(progress * 100));
  }, [thumbY, getTrackHeight, getThumbHeight]);

  // Theme detection (mirrors CustomCursor)
  useEffect(() => {
    const checkTheme = () => {
      const attr = document.documentElement.getAttribute("data-theme");
      setTheme(attr === "iron" ? "iron" : "doom");
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  // Scroll listener
  useEffect(() => {
    setMounted(true);
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateThumbPosition();
          setIsVisible(true);
          glowIntensity.set(1);

          if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
          hideTimerRef.current = setTimeout(() => {
            if (!isDragging && !isHovering) {
              setIsVisible(false);
              glowIntensity.set(0);
            }
          }, 1800);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateThumbPosition();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [updateThumbPosition, isDragging, isHovering, glowIntensity]);

  // Drag handler
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragStartYRef.current = clientY;
    dragStartScrollRef.current = window.scrollY;
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaY = clientY - dragStartYRef.current;
      const trackH = getTrackHeight();
      const thumbH = getThumbHeight();
      const maxThumbY = trackH - thumbH;
      const docHeight = document.documentElement.scrollHeight;
      const viewHeight = window.innerHeight;
      const maxScroll = docHeight - viewHeight;

      const scrollDelta = (deltaY / maxThumbY) * maxScroll;
      window.scrollTo(0, dragStartScrollRef.current + scrollDelta);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchmove", handleDragMove, { passive: false });
    window.addEventListener("touchend", handleDragEnd);

    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, getTrackHeight, getThumbHeight]);

  // Track click to jump
  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const progress = clickY / rect.height;
    const docHeight = document.documentElement.scrollHeight;
    const viewHeight = window.innerHeight;
    window.scrollTo({ top: progress * (docHeight - viewHeight), behavior: "smooth" });
  }, []);

  if (!mounted) return null;

  const accent = theme === "iron" ? "#ef4444" : "#10b981";
  const glow = theme === "iron" ? "#facc15" : "#10b981";
  const accentDim = theme === "iron" ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)";
  const accentMid = theme === "iron" ? "rgba(239,68,68,0.4)" : "rgba(16,185,129,0.4)";
  const thumbH = getThumbHeight();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{
          opacity: isVisible || isDragging || isHovering ? 1 : 0,
          x: isVisible || isDragging || isHovering ? 0 : 10,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed right-0 top-0 bottom-0 z-[60] flex items-center pointer-events-none"
        style={{ width: 52 }}
      >
        {/* ── TRACK RAIL ── */}
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          onMouseEnter={() => {
            setIsHovering(true);
            setIsVisible(true);
            glowIntensity.set(1);
          }}
          onMouseLeave={() => {
            setIsHovering(false);
            if (!isDragging) {
              hideTimerRef.current = setTimeout(() => {
                setIsVisible(false);
                glowIntensity.set(0);
              }, 1200);
            }
          }}
          className="relative pointer-events-auto"
          style={{
            position: "absolute",
            right: 8,
            top: 60,
            bottom: 60,
            width: 36,
            cursor: "pointer",
          }}
        >
          {/* Glassmorphic Track Background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              left: 14,
              width: 8,
              background: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(12px)",
              border: `1px solid ${accentDim}`,
              borderRadius: 4,
            }}
          />

          {/* HUD Tick Marks */}
          {Array.from({ length: 21 }).map((_, i) => {
            const isMajor = i % 5 === 0;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  right: isMajor ? 6 : 10,
                  top: `${(i / 20) * 100}%`,
                  width: isMajor ? 30 : 22,
                  height: 1,
                  background: isMajor ? accentMid : accentDim,
                  transformOrigin: "right center",
                }}
              />
            );
          })}

          {/* HUD Corner Brackets — Top */}
          <svg
            width="20" height="20" viewBox="0 0 20 20" fill="none"
            style={{ position: "absolute", top: -10, left: 8 }}
          >
            <path d="M 2 18 L 2 2 L 18 2" stroke={accent} strokeWidth="1.5" strokeLinecap="square" opacity={0.5} />
          </svg>

          {/* HUD Corner Brackets — Bottom */}
          <svg
            width="20" height="20" viewBox="0 0 20 20" fill="none"
            style={{ position: "absolute", bottom: -10, left: 8 }}
          >
            <path d="M 2 2 L 2 18 L 18 18" stroke={accent} strokeWidth="1.5" strokeLinecap="square" opacity={0.5} />
          </svg>

          {/* ── THUMB ── */}
          <motion.div
            style={{
              y: smoothThumbY,
              position: "absolute",
              left: 0,
              right: 0,
              height: thumbH,
              cursor: isDragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            {/* Outer Glow Aura */}
            <motion.div
              animate={{
                boxShadow: isDragging
                  ? `0 0 40px 8px ${glow}, 0 0 80px 16px ${accentDim}`
                  : isHovering
                  ? `0 0 25px 4px ${glow}, 0 0 50px 10px ${accentDim}`
                  : `0 0 15px 2px ${glow}`,
              }}
              transition={{ duration: 0.3 }}
              style={{
                position: "absolute",
                left: 14,
                width: 8,
                top: 0,
                bottom: 0,
                borderRadius: 4,
              }}
            />

            {/* Main Thumb Body — Glassmorphic */}
            <div
              style={{
                position: "absolute",
                left: 12,
                width: 12,
                top: 2,
                bottom: 2,
                borderRadius: 6,
                background: `linear-gradient(to bottom, ${accent}, ${glow})`,
                border: "1px solid rgba(255,255,255,0.25)",
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.3)`,
              }}
            >
              {/* Inner Core Shine */}
              <div
                style={{
                  position: "absolute",
                  inset: 2,
                  borderRadius: 4,
                  background: "linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.2) 100%)",
                }}
              />

              {/* Grip Notches */}
              <div style={{ position: "absolute", left: 3, right: 3, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 4, height: 1, background: "rgba(255,255,255,0.5)", borderRadius: 1 }} />
                ))}
              </div>
            </div>

            {/* Arc Reactor Ring — Dashed orbit */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                left: -2,
                width: 40,
                top: -4,
                bottom: -4,
                border: `1px dashed ${accentMid}`,
                borderRadius: 20,
                pointerEvents: "none",
              }}
            />

            {/* Percentage HUD Readout */}
            <AnimatePresence>
              {(isHovering || isDragging) && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute",
                    right: 44,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                  }}
                >
                  {/* Readout Card */}
                  <div
                    style={{
                      background: "rgba(15, 23, 42, 0.85)",
                      backdropFilter: "blur(24px) saturate(160%)",
                      border: `1px solid ${accentDim}`,
                      borderRadius: 8,
                      padding: "6px 10px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 2,
                      boxShadow: `0 0 20px ${accentDim}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: 9,
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        color: accent,
                        opacity: 0.7,
                      }}
                    >
                      Scroll Position
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: 16,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        color: "#f4f4f5",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {String(scrollPercent).padStart(3, "\u00A0")}%
                    </span>
                  </div>

                  {/* Connecting Line */}
                  <div
                    style={{
                      width: 12,
                      height: 1,
                      background: `linear-gradient(to right, ${accent}, transparent)`,
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Top Readout Label */}
          <div
            style={{
              position: "absolute",
              top: -28,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 8,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: accent,
              opacity: 0.5,
            }}
          >
            Nav
          </div>

          {/* Bottom Readout Label */}
          <div
            style={{
              position: "absolute",
              bottom: -28,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 8,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: accent,
              opacity: 0.5,
            }}
          >
            End
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
