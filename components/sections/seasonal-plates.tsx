import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { type ZoomParallaxImage, ZoomParallax } from "@/components/ui/zoom-parallax";
import { IMAGES } from "@/lib/media";

const PLATES: ZoomParallaxImage[] = [
  {
    src: IMAGES.heroVillage,
    alt: "Alpine village and still lake at first light",
    caption: "First light · lake approach",
  },
  {
    src: IMAGES.lakefrontChalet,
    alt: "Lakefront chalet with private water access",
    caption: "Waterline · private mooring",
  },
  {
    src: IMAGES.forestResidence,
    alt: "Forest residence embedded among old-growth pines",
    caption: "Pine canopy · low road",
  },
  {
    src: IMAGES.mountainViewEstate,
    alt: "Mountain estate positioned against the summit line",
    caption: "Ridge estate · evening exposure",
  },
  {
    src: IMAGES.privateFamilyLodge,
    alt: "Private family lodge with stone base and timber crown",
    caption: "Family lodge · winter gardens",
  },
];

const NOTES = [
  ["Winter", "Snow line, access roads, hearths, and the house after dark."],
  ["Summer", "Water, terraces, morning routes, and how the gardens hold privacy."],
  ["Shoulder season", "The quiet months that reveal construction, upkeep, and light."],
];

export function SeasonalPlates() {
  return (
    <section id="seasons" className="relative overflow-hidden bg-paper-deep">
      <div className="mx-auto max-w-[92rem] px-5 pt-24 sm:px-8 sm:pt-32 lg:px-12 lg:pt-40">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:items-end lg:gap-20">
          <Reveal direction="none">
            <span className="eyebrow flex items-center gap-3 text-bronze">
              <span className="h-px w-10 bg-bronze/50" aria-hidden />
              Interlude — Alpine seasons
            </span>
            <h2 className="mt-6 max-w-4xl font-serif text-[clamp(2.5rem,6vw,5.7rem)] font-light leading-[1.01] tracking-[-0.03em] text-ink">
              A residence is measured across the whole year.
            </h2>
          </Reveal>

          <Reveal delay={0.15} className="lg:pb-3">
            <p className="text-pretty text-lg leading-relaxed text-espresso">
              The portfolio is photographed as a sequence of seasons, not a
              listing. Snow load, lake access, privacy, light, and maintenance
              all become visible when the house is watched slowly.
            </p>
          </Reveal>
        </div>
      </div>

      <ZoomParallax images={PLATES} className="mx-auto mt-12 max-w-[100rem] px-5 sm:px-8 lg:px-12" />

      <div className="mx-auto max-w-[92rem] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-12 lg:pb-40">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end lg:gap-20">
          <Reveal direction="none">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line-strong/70 bg-paper shadow-card">
              <Image
                src={IMAGES.natureMountainLake}
                alt="Alpine lake and mountain range used to evaluate seasonal exposure"
                fill
                sizes="(min-width: 1024px) 44vw, 92vw"
                className="object-cover"
              />
              <span
                className="absolute inset-0 bg-gradient-to-t from-pine-deep/70 via-transparent to-transparent"
                aria-hidden
              />
              <div className="absolute right-5 bottom-5 left-5 flex flex-wrap items-end justify-between gap-4 text-cream">
                <div>
                  <p className="eyebrow text-gold-soft">Site rhythm</p>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream-dim">
                    Morning lake, evening ridge, winter access, summer terrace.
                  </p>
                </div>
                <span className="font-serif text-sm text-cream-faint tnum">
                  04 seasons
                </span>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal direction="none">
              <span className="rule-line" aria-hidden />
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
              {NOTES.map(([label, body], index) => (
                <Reveal key={label} delay={index * 0.08} direction="none">
                  <div className="grid gap-3 border-line border-b pb-6 sm:border-b-0 sm:border-l sm:pb-0 sm:pl-6 lg:grid-cols-[8rem_1fr] lg:border-b lg:border-l-0 lg:pb-6 lg:pl-0">
                    <span className="text-[0.7rem] uppercase tracking-[0.22em] text-bronze">
                      {label}
                    </span>
                    <p className="text-sm leading-relaxed text-muted">{body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.24} className="mt-9">
              <Button asChild variant="outline" size="lg">
                <a href="#contact">
                  Request seasonal dossier <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
