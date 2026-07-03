"use client";

import { ArrowUpRight } from "lucide-react";
import { CinematicImage } from "@/components/media/cinematic-image";
import { FilmButton } from "@/components/media/film-lightbox";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { Reveal } from "@/components/motion/reveal";
import { RiseLines } from "@/components/motion/text-rise";
import { Button } from "@/components/ui/button";
import { featuredVilla } from "@/features/villas/data";
import { DossierDetails } from "./dossier-details";

const SPECS = [
  { value: 520, suffix: "", label: "Square metres" },
  { value: 6, suffix: "", label: "Suites" },
  { value: 7, suffix: "", label: "Bathrooms" },
  { value: 1480, suffix: " m", label: "Altitude" },
];

/** Chapter III — one estate, treated with the reverence of a Cartier plate. */
export function Dossier() {
  return (
    <section
      id="estate"
      className="relative overflow-hidden bg-pine-deep text-cream"
    >
      <CinematicImage
        src={featuredVilla.image}
        alt={`${featuredVilla.name} — ${featuredVilla.type} above the valley`}
        parallax={80}
        sizes="100vw"
        className="absolute inset-0"
      >
        <span className="chapter-veil absolute inset-0" aria-hidden />
      </CinematicImage>
      <span className="grain-overlay z-[2]" aria-hidden />

      <div className="relative z-10 mx-auto max-w-[92rem] px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-48">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <Reveal direction="none">
              <span className="eyebrow flex items-center gap-3 text-gold-soft">
                <span className="h-px w-10 bg-gold-soft/50" />
                Chapter III — Featured estate
              </span>
            </Reveal>
            <h2 className="mt-6 font-serif text-[clamp(2.8rem,6.5vw,6.2rem)] font-light leading-[0.98] tracking-[-0.03em]">
              <RiseLines
                delay={0.1}
                lines={[
                  "Domaine",
                  <em key="accent" className="italic text-gold-soft">
                    Belvedère.
                  </em>,
                ]}
              />
            </h2>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-lg text-pretty text-lg leading-relaxed text-cream-dim">
                {featuredVilla.blurb} Crête Sud, Valais — twelve minutes above
                the lake, posed against the summit line where the evening
                light stays longest.
              </p>
            </Reveal>
            <Reveal delay={0.3} className="mt-10 flex flex-wrap items-center gap-5">
              <Button asChild variant="gold" size="lg">
                <a href="#contact">
                  Request the dossier <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
              <span className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.2em] text-cream-faint">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                Reserved — waitlist open
              </span>
            </Reveal>
            <Reveal delay={0.45} direction="none" className="mt-12">
              <FilmButton />
            </Reveal>
          </div>

          {/* spec ledger */}
          <div className="flex flex-col justify-end">
            <Reveal direction="none">
              <p className="font-serif text-2xl text-cream-dim">
                {featuredVilla.priceRange}
              </p>
              <p className="mt-1 text-[0.7rem] uppercase tracking-[0.2em] text-cream-faint">
                Guide price · {featuredVilla.view}
              </p>
            </Reveal>
            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-cream/12 bg-cream/12">
              {SPECS.map((s, i) => (
                <Reveal
                  key={s.label}
                  delay={0.1 + i * 0.08}
                  direction="none"
                  className="bg-pine-deep/80 p-6 backdrop-blur-sm sm:p-7"
                >
                  <span className="font-serif text-4xl font-light text-cream sm:text-5xl">
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                  </span>
                  <span className="mt-2 block text-[0.66rem] uppercase tracking-[0.2em] text-cream-faint">
                    {s.label}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* the asset on paper — plan, access, positioning */}
      <DossierDetails />
    </section>
  );
}
