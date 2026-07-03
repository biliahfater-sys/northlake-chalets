"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useState } from "react";

const INTERACTIVE = "a, button, [role='button'], input, textarea, label, select";

/**
 * Physics cursor: a crisp dot rides the pointer while a larger ring trails it
 * on a spring, swelling over interactive elements. Desktop-only (pointer:
 * fine), disabled under prefers-reduced-motion, and blended with `difference`
 * so it stays visible on both paper and pine chapters.
 */
export function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [hoverLink, setHoverLink] = useState(false);
  const [visible, setVisible] = useState(false);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  // The dot tracks tightly; the ring floats behind on a soft spring.
  const dotX = useSpring(mx, { stiffness: 900, damping: 50, mass: 0.3 });
  const dotY = useSpring(my, { stiffness: 900, damping: 50, mass: 0.3 });
  const ringX = useSpring(mx, { stiffness: 160, damping: 20, mass: 0.6 });
  const ringY = useSpring(my, { stiffness: 160, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
      setHoverLink(!!(e.target as Element | null)?.closest?.(INTERACTIVE));
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [reduce, mx, my]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] hidden lg:block"
    >
      {/* trailing ring */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="absolute top-0 left-0"
      >
        <motion.div
          animate={{
            scale: pressed ? 0.7 : hoverLink ? 1.8 : 1,
            opacity: visible ? (hoverLink ? 0.9 : 0.55) : 0,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="-translate-x-1/2 -translate-y-1/2 h-9 w-9 rounded-full border border-[#e0c684] mix-blend-difference"
        />
      </motion.div>
      {/* core dot */}
      <motion.div
        style={{ x: dotX, y: dotY }}
        className="absolute top-0 left-0"
      >
        <motion.div
          animate={{
            scale: pressed ? 0.6 : hoverLink ? 0.4 : 1,
            opacity: visible ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="-translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#e0c684] mix-blend-difference"
        />
      </motion.div>
    </div>
  );
}
