"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface CinematicImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  /** Slow infinite Ken Burns zoom/pan. */
  kenBurns?: boolean;
  /** Vertical scroll parallax travel in px (image drifts as you scroll). */
  parallax?: number;
  /** Cinematic dark gradient overlay. */
  overlay?: boolean;
  /** Drifting fog band. */
  fog?: boolean;
  children?: React.ReactNode;
}

/**
 * The atmospheric image primitive. Combines next/image with an optional
 * Ken Burns CSS loop, scroll-linked parallax, a cinematic overlay, and a
 * drifting fog layer — the backbone of the site's "alive still" look.
 */
export function CinematicImage({
  src,
  alt,
  priority,
  sizes = "100vw",
  className,
  imgClassName,
  kenBurns = false,
  parallax = 0,
  overlay = false,
  fog = false,
  children,
}: CinematicImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const travel = reduce ? 0 : parallax;
  const rawY = useTransform(scrollYProgress, [0, 1], [-travel, travel]);
  // Spring-smoothed parallax: the image eases into place instead of tracking
  // the wheel one-to-one, which reads as far more cinematic.
  const y = useSpring(rawY, { stiffness: 90, damping: 28, restDelta: 0.5 });

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {/* Wrapper is taller than the frame by the parallax travel so the
          drifting image never reveals a gap at the top or bottom. */}
      <motion.div
        style={{ y, top: -travel, bottom: -travel }}
        className="absolute inset-x-0 will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn(
            "object-cover",
            kenBurns && !reduce && "[animation:var(--animate-kenburns)]",
            imgClassName,
          )}
        />
      </motion.div>

      {fog && !reduce && (
        <>
          <span className="fog-layer" aria-hidden />
          <span
            className="fog-layer [animation:var(--animate-fog-slow)]"
            aria-hidden
          />
        </>
      )}
      {overlay && <span className="cine-overlay absolute inset-0" aria-hidden />}
      {children}
    </div>
  );
}
