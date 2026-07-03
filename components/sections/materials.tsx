"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { InkReveal } from "@/components/ui/ink-reveal";
import { IMAGES } from "@/lib/media";

const MATERIALS = [
  {
    n: "01",
    word: "Stone.",
    glyph: "stone" as const,
    body: "Quarried within forty kilometres of every site. Foundations and hearths that hold the day's warmth long after the fire is lit.",
  },
  {
    n: "02",
    word: "Walnut & larch.",
    glyph: "timber" as const,
    body: "Hand-cut, slow-dried, joined without haste. The façades silver gracefully; the interiors deepen like good furniture.",
  },
  {
    n: "03",
    word: "Glass.",
    glyph: "glass" as const,
    body: "Double-height and frameless where the view deserves it. The landscape is the artwork — the house is its frame.",
  },
];

/* Hand-drawn material glyphs that sketch themselves in as they enter view. */
const GLYPH_PATHS: Record<"stone" | "timber" | "glass", string[]> = {
  stone: [
    "M 6 26 L 10 12 L 20 7 L 30 13 L 28 26 Z",
    "M 13 26 L 16 17 L 24 19",
  ],
  timber: [
    "M 18 30 C 8 26 6 16 10 6 C 20 9 26 16 25 30",
    "M 17 28 C 15 21 15 14 13 9",
    "M 21 24 C 19 20 18 16 17 12",
  ],
  glass: [
    "M 8 6 L 28 6 L 28 28 L 8 28 Z",
    "M 11 24 L 24 9",
    "M 16 26 L 26 15",
  ],
};

function MaterialGlyph({ kind }: { kind: "stone" | "timber" | "glass" }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 34 34"
      className="h-7 w-7 shrink-0 self-center sm:h-8 sm:w-8"
      aria-hidden
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.8 }}
    >
      {GLYPH_PATHS[kind].map((d, i) => (
        <motion.path
          key={d.slice(0, 12)}
          d={d}
          fill="none"
          stroke="#8a6f45"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: reduce ? 1 : 0, opacity: reduce ? 0 : 1 },
            show: {
              pathLength: 1,
              opacity: 0.9,
              transition: {
                delay: 0.2 + i * 0.35,
                duration: reduce ? 0.3 : 1.1,
                ease: [0.16, 1, 0.3, 1],
              },
            },
          }}
        />
      ))}
    </motion.svg>
  );
}

/** Chapter IV — material honesty, set as oversized typographic entries. */
export function Materials() {
  return (
    <section id="craft" className="relative bg-paper-deep">
      <div className="mx-auto max-w-[92rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        {/* chapter rule */}
        <Reveal direction="none">
          <div className="flex items-baseline justify-between gap-6">
            <span className="eyebrow flex items-center gap-3 text-bronze">
              <span className="h-px w-10 bg-bronze/50" aria-hidden />
              Chapter IV — Material Honesty
            </span>
            <span className="eyebrow hidden text-faint sm:block">
              Three materials, nothing fashionable
            </span>
          </div>
          <span className="rule-line mt-5" aria-hidden />
        </Reveal>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-[1fr_minmax(0,20rem)] lg:gap-20">
          <div>
            <Reveal>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-espresso">
                Every Northlake residence is built from three materials and
                nothing fashionable. What ages well is what holds value.
              </p>
            </Reveal>

            <div className="mt-12">
              <span className="rule-line" aria-hidden />
              {MATERIALS.map((m, i) => (
                <Reveal key={m.n} delay={i * 0.1} direction="none">
                  <div className="group grid gap-4 border-line-strong/60 border-b py-10 transition-colors duration-500 sm:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] sm:items-baseline sm:gap-10">
                    <div className="flex items-baseline gap-6">
                      <span className="flex flex-col items-center gap-3">
                        <span className="font-serif text-sm text-bronze tnum">
                          {m.n}
                        </span>
                        <MaterialGlyph kind={m.glyph} />
                      </span>
                      <h3 className="font-serif text-[clamp(2.4rem,5.5vw,4.8rem)] font-light leading-none tracking-[-0.03em] text-ink transition-all duration-500 group-hover:translate-x-2 group-hover:text-bronze">
                        {m.word}
                      </h3>
                    </div>
                    <p className="text-pretty text-[0.98rem] leading-relaxed text-muted sm:justify-self-end">
                      {m.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* craftsmanship plate */}
          <Reveal delay={0.15} direction="none" className="hidden lg:block">
            <div className="group sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-card">
                <Image
                  src={IMAGES.privateFamilyLodge}
                  alt="Private family lodge among the pines, stone base and timber crown"
                  fill
                  sizes="(min-width: 1024px) 20rem, 1px"
                  className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-glide)] group-hover:scale-[1.06]"
                />
                <span
                  className="absolute inset-0 z-[1] bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  aria-hidden
                />
                <InkReveal
                  maskColor={[233, 225, 205]}
                  brushSize={118}
                  lifetime={920}
                  stampStep={14}
                  className="hidden opacity-[0.94] lg:block"
                  style={{ zIndex: 2 }}
                />
                <div className="absolute right-4 bottom-4 left-4 z-[3] hidden rounded-md border border-ink/10 bg-paper/72 px-4 py-3 text-ink shadow-soft backdrop-blur-md transition-opacity duration-500 group-hover:opacity-0 xl:block">
                  <p className="text-[0.64rem] uppercase tracking-[0.2em] text-bronze">
                    Construction plate
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    Graubünden timber shell, winter light study, 2025.
                  </p>
                </div>
              </div>
              <p className="eyebrow mt-4 text-faint">
                Lodge under construction — Graubünden, 2025
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
