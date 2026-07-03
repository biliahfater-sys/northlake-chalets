"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * An alpine ridge that draws itself across the page as it scrolls into
 * view — a quiet signature divider between chapters. A gold marker
 * breathes at the summit once the line has been set down.
 */
export function RidgeLine({
  className,
  stroke = "rgba(242,237,225,0.22)",
  marker = "#c2a25f",
}: {
  className?: string;
  stroke?: string;
  marker?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div className={className} aria-hidden>
      <motion.svg
        viewBox="0 0 1200 48"
        preserveAspectRatio="none"
        className="block h-10 w-full sm:h-12"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
      >
        <motion.path
          d="M 0 40 L 150 30 L 290 38 L 430 14 L 560 34 L 700 8 L 840 30 L 980 20 L 1100 32 L 1200 26"
          fill="none"
          stroke={stroke}
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
          variants={{
            hidden: { pathLength: reduce ? 1 : 0, opacity: reduce ? 0 : 1 },
            show: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: reduce ? 0.3 : 2.4, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        />
        {/* summit marker */}
        <motion.path
          d="M 700 8 m 0 -7 l 1.8 4.6 4.9 0.4 -3.7 3.2 1.1 4.8 -4.1-2.6 -4.1 2.6 1.1-4.8 -3.7-3.2 4.9-0.4 Z"
          fill={marker}
          variants={{
            hidden: { opacity: 0, scale: 0.4 },
            show: {
              opacity: 1,
              scale: 1,
              transition: { delay: reduce ? 0 : 1.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
            },
          }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      </motion.svg>
    </div>
  );
}
