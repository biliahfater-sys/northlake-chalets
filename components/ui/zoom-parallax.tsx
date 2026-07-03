"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export interface ZoomParallaxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ZoomParallaxProps {
  images: ZoomParallaxImage[];
  className?: string;
}

const FRAME_CLASSES = [
  "h-[54vh] w-[54vw]",
  "-top-[28vh] left-[5vw] h-[28vh] w-[32vw]",
  "-top-[8vh] -left-[27vw] h-[42vh] w-[20vw]",
  "left-[27vw] top-[4vh] h-[24vh] w-[24vw]",
  "top-[28vh] -left-[18vw] h-[24vh] w-[30vw]",
];

export function ZoomParallax({ images, className }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scaleA = useTransform(scrollYProgress, [0, 1], [1, 2.1]);
  const scaleB = useTransform(scrollYProgress, [0, 1], [1, 2.65]);
  const scaleC = useTransform(scrollYProgress, [0, 1], [1, 3.1]);
  const scaleD = useTransform(scrollYProgress, [0, 1], [1, 2.45]);
  const scaleE = useTransform(scrollYProgress, [0, 1], [1, 2.85]);
  const scales = [scaleA, scaleB, scaleC, scaleD, scaleE];

  if (reduce) {
    return (
      <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
        {images.slice(0, 4).map((image, index) => (
          <figure
            key={`${image.src}-${index}`}
            className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-paper shadow-soft"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 92vw, 44vw"
              className="object-cover"
            />
            <span
              className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent"
              aria-hidden
            />
            {image.caption && (
              <figcaption className="absolute right-4 bottom-4 left-4 text-[0.68rem] uppercase tracking-[0.2em] text-cream">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div className="grid gap-3 md:hidden">
        {images.slice(0, 4).map((image, index) => (
          <figure
            key={`${image.src}-mobile-${index}`}
            className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-paper shadow-soft"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="92vw"
              className="object-cover"
            />
            <span
              className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent"
              aria-hidden
            />
            {image.caption && (
              <figcaption className="absolute right-4 bottom-4 left-4 text-[0.68rem] uppercase tracking-[0.2em] text-cream">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <div ref={container} className="relative hidden h-[180vh] md:block">
        <div className="sticky top-0 h-screen overflow-hidden">
          <span
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(194,162,95,0.18),transparent_32%),linear-gradient(180deg,var(--color-paper-deep),var(--color-paper))]"
            aria-hidden
          />
          {images.slice(0, 5).map((image, index) => (
            <motion.figure
              key={`${image.src}-${index}`}
              style={{ scale: scales[index] }}
              className="absolute inset-0 flex items-center justify-center will-change-transform"
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-xl border border-cream/20 bg-pine-deep shadow-float",
                  FRAME_CLASSES[index],
                )}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={index === 0 ? "56vw" : "32vw"}
                  className="object-cover"
                />
                <span
                  className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10"
                  aria-hidden
                />
                {image.caption && (
                  <figcaption className="absolute right-5 bottom-5 left-5 text-[0.66rem] uppercase tracking-[0.22em] text-cream/85">
                    {image.caption}
                  </figcaption>
                )}
              </div>
            </motion.figure>
          ))}
          <span className="grain-overlay" aria-hidden />
        </div>
      </div>
    </div>
  );
}
