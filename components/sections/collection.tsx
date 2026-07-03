"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { RiseLines } from "@/components/motion/text-rise";
import { Button } from "@/components/ui/button";
import { villas } from "@/features/villas/data";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  private: "Private sale",
};

const STATUS_DOT: Record<string, string> = {
  available: "bg-emerald-700",
  reserved: "bg-gold",
  private: "bg-bronze",
};

/**
 * Chapter II — the collection as an editorial index. Rows like a folio's
 * table of contents; a sticky plate on the right previews the hovered
 * residence. No real-estate cards anywhere.
 */
export function Collection() {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);

  return (
    <section id="collection" className="relative bg-paper">
      <div className="mx-auto max-w-[92rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        {/* chapter heading */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal direction="none">
            <span className="eyebrow text-bronze">Chapter II — The Collection</span>
            <h2 className="mt-5 font-serif text-[clamp(2.6rem,6.5vw,6rem)] font-light leading-[0.98] tracking-[-0.03em] text-ink">
              <RiseLines
                lines={[
                  "Four residences.",
                  <em key="accent" className="italic text-bronze">
                    One winter.
                  </em>,
                ]}
              />
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="max-w-sm pb-2">
            <p className="text-pretty leading-relaxed text-muted">
              The current portfolio, Winter 2026. Full dossiers — floor plans,
              yield models, provenance — are shared privately after
              introduction.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* index rows */}
          <div
            className="flex flex-col"
            onMouseLeave={() => setHovering(false)}
          >
            <span className="rule-line" aria-hidden />
            {villas.map((villa, i) => (
              <Reveal key={villa.id} delay={i * 0.08} direction="none">
                <a
                  href="#contact"
                  onMouseEnter={() => {
                    setActive(i);
                    setHovering(true);
                  }}
                  onFocus={() => setActive(i)}
                  className={cn(
                    "group block cursor-pointer border-line border-b py-7 transition-opacity duration-500 sm:py-8",
                    hovering && active !== i && "opacity-40",
                  )}
                  aria-label={`${villa.name} — ${villa.type}, ${villa.priceRange}. Request the dossier.`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex items-baseline gap-5">
                      <span className="font-serif text-sm text-bronze tnum">
                        0{i + 1}
                      </span>
                      <h3 className="font-serif text-[clamp(1.7rem,3.2vw,2.6rem)] font-light tracking-tight text-ink transition-colors duration-400 group-hover:text-bronze">
                        {villa.name}
                      </h3>
                    </div>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-faint transition-all duration-400 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-bronze" />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 pl-0 sm:pl-10">
                    <span className="text-[0.72rem] uppercase tracking-[0.18em] text-muted">
                      {villa.type} · {villa.location}
                    </span>
                    <span className="font-serif text-[0.95rem] text-ink-soft tnum">
                      {villa.priceRange}
                    </span>
                    <span className="text-[0.72rem] uppercase tracking-[0.18em] text-muted tnum">
                      {villa.area} m² · {villa.bedrooms} suites
                    </span>
                    <span className="flex items-center gap-1.5 text-[0.72rem] uppercase tracking-[0.18em] text-muted">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          STATUS_DOT[villa.availability],
                        )}
                        aria-hidden
                      />
                      {STATUS_LABEL[villa.availability]}
                    </span>
                  </div>

                  {/* mobile image plate */}
                  <div className="relative mt-5 block aspect-[16/10] overflow-hidden rounded-lg lg:hidden">
                    <Image
                      src={villa.image}
                      alt={`${villa.name} — ${villa.type}`}
                      fill
                      sizes="(max-width: 1024px) 92vw, 1px"
                      priority={i === 0}
                      className="object-cover transition-transform duration-700 ease-[var(--ease-glide)] group-hover:scale-[1.04]"
                    />
                  </div>
                </a>
              </Reveal>
            ))}

            <Reveal delay={0.2} direction="none" className="mt-10">
              <Button asChild variant="outline" size="lg">
                <a href="#contact">
                  Request the full portfolio <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </Reveal>
          </div>

          {/* sticky preview plate (desktop) */}
          <div className="relative hidden lg:block">
            <div className="group sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-card">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={villas[active].id}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={villas[active].image}
                      alt={`${villas[active].name} — ${villas[active].type}`}
                      fill
                      sizes="(min-width: 1024px) 44vw, 1px"
                      className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-glide)] group-hover:scale-[1.05]"
                    />
                  </motion.div>
                </AnimatePresence>
                <span
                  className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"
                  aria-hidden
                />
                <div className="absolute right-0 bottom-0 left-0 flex items-end justify-between p-6">
                  <div>
                    <p className="eyebrow text-gold-soft">
                      {villas[active].view}
                    </p>
                    <p className="mt-2 font-serif text-2xl text-cream">
                      {villas[active].name}
                    </p>
                  </div>
                  <p className="font-serif text-sm text-cream-dim tnum">
                    0{active + 1} / 0{villas.length}
                  </p>
                </div>
              </div>
              <p className="mt-5 max-w-md text-pretty text-[0.95rem] leading-relaxed text-muted">
                {villas[active].blurb}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
