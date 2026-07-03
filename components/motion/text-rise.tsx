"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Living typography — each line rises out of an overflow mask, the way the
 * hero headline enters. Drop inside any <h2>/<p>; the lines stagger on
 * first viewport entry. Honors prefers-reduced-motion (plain fade).
 */
export function RiseLines({
  lines,
  delay = 0,
  stagger = 0.12,
  duration = 1.05,
  amount = 0.4,
}: {
  lines: ReactNode[];
  delay?: number;
  stagger?: number;
  duration?: number;
  amount?: number;
}) {
  const reduce = useReducedMotion();

  return (
    /* The observed element is this UNCLIPPED block — the clipped lines
       inside only receive variants. Observing a clipped child directly
       never fires: IntersectionObserver respects overflow clipping. */
    <motion.span
      className="block"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {lines.map((line, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static line list
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className="block will-change-transform"
            variants={{
              hidden: reduce ? { opacity: 0 } : { y: "112%" },
              show: reduce
                ? {
                    opacity: 1,
                    transition: { delay: delay + i * stagger, duration: 0.3 },
                  }
                : {
                    y: "0%",
                    transition: {
                      delay: delay + i * stagger,
                      duration,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/**
 * A hairline that draws itself from the left when scrolled into view —
 * used in place of static rule-lines so every chapter opening feels set
 * by hand, not printed.
 */
export function DrawnRule({
  className,
  delay = 0,
  dark = false,
}: {
  className?: string;
  delay?: number;
  dark?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      initial={reduce ? { opacity: 0 } : { scaleX: 0 }}
      whileInView={reduce ? { opacity: 1 } : { scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ delay, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: "left" }}
      className={`block h-px w-full ${
        dark
          ? "bg-gradient-to-r from-cream/25 via-cream/12 to-transparent"
          : "bg-gradient-to-r from-line-strong via-line to-transparent"
      } ${className ?? ""}`}
    />
  );
}
