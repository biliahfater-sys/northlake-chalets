"use client";

import { motion, useReducedMotion } from "motion/react";
import { AtmosphereShader } from "@/components/media/atmosphere-shader";
import { CinematicImage } from "@/components/media/cinematic-image";
import { IMAGES } from "@/lib/media";

const WORDS = "The mountains do the talking. The house just listens.".split(" ");

/** Interlude — a full-bleed nature plate with one line of type. */
export function NatureQuote() {
  const reduce = useReducedMotion();

  return (
    <section
      id="nature"
      className="relative flex min-h-[88svh] items-center overflow-hidden bg-pine-deep"
    >
      <CinematicImage
        src={IMAGES.natureMountainLake}
        alt="Sunrise over an alpine lake and granite peaks"
        parallax={90}
        kenBurns
        fog
        sizes="100vw"
        className="absolute inset-0"
      >
        <span
          className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/60"
          aria-hidden
        />
      </CinematicImage>
      <AtmosphereShader className="z-[1] opacity-70" warmth={0.45} />
      <span className="grain-overlay z-[2]" aria-hidden />

      <figure className="relative z-10 mx-auto max-w-5xl px-5 py-32 text-center sm:px-8">
        <blockquote>
          <p className="font-serif text-[clamp(2rem,5vw,4.4rem)] font-light italic leading-[1.12] tracking-[-0.02em] text-cream">
            {WORDS.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                className="inline-block whitespace-pre"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  delay: i * 0.06,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {word}{" "}
              </motion.span>
            ))}
          </p>
        </blockquote>
        <motion.figcaption
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
          className="eyebrow mt-9 text-cream-faint"
        >
          — A Northlake design principle
        </motion.figcaption>
      </figure>
    </section>
  );
}
