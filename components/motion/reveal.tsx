"use client";

import { type HTMLMotionProps, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 26 },
  down: { y: -26 },
  left: { x: 36 },
  right: { x: -36 },
  none: {},
};

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  /** Animate only on first entry (default) — re-triggering on every pass reads as flicker. */
  once?: boolean;
  amount?: number;
}

/**
 * Bidirectional reveal. Blocks rise out of the fog with a soft blur as they
 * enter the viewport, and drift/blur back out as they leave — on every pass,
 * so the whole page feels alive. `whileInView` toggles against the `initial`
 * state; with `once: false` Motion animates back to `initial` on exit.
 * Honors prefers-reduced-motion (no drift/blur, near-instant).
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 1.05,
  once = true,
  amount = 0.25,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once, amount }}
        transition={{ duration: 0.25 }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }

  const offset = OFFSET[direction];

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(6px)", ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Container whose children stagger in/out. Pair with <RevealItem>. */
export function StaggerReveal({
  children,
  stagger = 0.1,
  delay = 0,
  amount = 0.2,
  once = true,
  className,
}: {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  amount?: number;
  once?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  direction = "up",
  className,
}: {
  children: ReactNode;
  direction?: Direction;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const offset = reduce ? {} : OFFSET[direction];
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, filter: reduce ? "blur(0px)" : "blur(6px)", ...offset },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: reduce ? 0.2 : 1, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
