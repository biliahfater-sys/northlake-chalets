"use client";

import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";

const LINES = [
  "Everything a serious",
  "acquisition needs.",
  "Nothing it doesn't.",
];

const PILLARS = [
  {
    n: "01",
    title: "Curated, not listed",
    body: "Four to six residences a season. Each walked, measured, and photographed by our own advisors before it is ever shown.",
  },
  {
    n: "02",
    title: "Discreet by design",
    body: "No public listings, no open houses. Dossiers are shared privately, and viewings happen on your calendar — not the market's.",
  },
  {
    n: "03",
    title: "Held for generations",
    body: "We structure every acquisition as an inheritance: legal, tax, and management arranged so the house outlasts its paperwork.",
  },
];

/** Chapter I — the platform philosophy, set like a folio opening page. */
export function Manifesto() {
  const reduce = useReducedMotion();

  return (
    <section id="philosophy" className="relative bg-paper">
      <div className="mx-auto max-w-[92rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        {/* chapter rule */}
        <Reveal direction="none">
          <div className="flex items-baseline justify-between gap-6">
            <span className="eyebrow flex items-center gap-3 text-bronze">
              <span className="h-px w-10 bg-bronze/50" aria-hidden />
              Chapter I — The Platform
            </span>
            <span className="eyebrow hidden text-faint sm:block">
              Northlake, Est. 2014
            </span>
          </div>
          <span className="rule-line mt-5" aria-hidden />
        </Reveal>

        {/* headline left, supporting copy right — no dead margins */}
        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end lg:gap-20">
          {/* the observed element is the (unclipped) h2, so the clipped lines
              inside still trigger their mask reveal */}
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="font-serif text-[clamp(2.3rem,5.6vw,5.2rem)] font-light leading-[1.02] tracking-[-0.025em] text-ink"
          >
            {LINES.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.05em]">
                <motion.span
                  className="block"
                  variants={{
                    hidden: reduce ? { opacity: 0 } : { y: "110%" },
                    show: reduce
                      ? { opacity: 1 }
                      : {
                          y: "0%",
                          transition: {
                            delay: i * 0.12,
                            duration: 1,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        },
                  }}
                >
                  {i === 2 ? (
                    <em className="italic text-bronze">{line}</em>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </motion.h2>

          <Reveal delay={0.25} className="lg:pb-3">
            <p className="text-pretty text-lg leading-relaxed text-espresso">
              Northlake is built for buyers, investors, and family offices who
              treat alpine property as an asset — and an inheritance.
              Discover, compare, evaluate, and arrange viewings within one
              calm, private system.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal
              key={p.n}
              delay={0.1 + i * 0.1}
              className="group bg-paper p-7 transition-colors duration-500 hover:bg-paper-raised sm:p-8"
            >
              <span className="font-serif text-sm text-bronze">{p.n}</span>
              <h3 className="mt-4 font-serif text-xl tracking-tight text-ink">
                {p.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
                {p.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
