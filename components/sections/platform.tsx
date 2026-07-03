"use client";

import { ArrowUpRight } from "lucide-react";
import { ContourShader } from "@/components/media/contour-shader";
import { Reveal } from "@/components/motion/reveal";
import { RiseLines } from "@/components/motion/text-rise";
import { Button } from "@/components/ui/button";
import { PlatformPipeline } from "./platform-pipeline";
import { PlatformDashboard } from "./platform-dashboard";

const ASSURANCES = [
  {
    title: "Gated by NDA",
    body: "Nothing is public. A dossier opens only after introduction and a signed non-disclosure agreement.",
  },
  {
    title: "Watermarked documents",
    body: "Plans, titles, and models carry your name. Forwarding is disabled; access is personal and revocable.",
  },
  {
    title: "Swiss residency",
    body: "Dossiers and correspondence are stored in Switzerland and removed when an engagement ends.",
  },
];

/**
 * Chapter VII — the Private Client Area: the confidential room a buyer
 * receives after introduction. Not a product pitch — a quiet demonstration
 * of how carefully an acquisition is handled.
 */
export function Platform() {
  return (
    <section
      id="platform"
      className="relative overflow-hidden bg-pine-deep text-cream"
    >
      <ContourShader className="opacity-90" />
      <span className="grain-overlay" aria-hidden />
      <span
        className="light-bloom -top-32 -left-32 absolute h-[32rem] w-[32rem] opacity-60"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[92rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-44">
        {/* chapter rule */}
        <Reveal direction="none">
          <div className="flex items-baseline justify-between gap-6">
            <span className="eyebrow flex items-center gap-3 text-gold-soft">
              <span className="h-px w-10 bg-gold-soft/50" aria-hidden />
              Chapter VII — Private Client Area
            </span>
            <span className="eyebrow hidden text-cream-faint sm:block">
              For buyers · by invitation
            </span>
          </div>
          <span className="rule-line mt-5 bg-cream/15" aria-hidden />
        </Reveal>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end lg:gap-20">
          <h2 className="font-serif text-[clamp(2.4rem,5.6vw,5.4rem)] font-light leading-[1.02] tracking-[-0.03em]">
            <RiseLines
              lines={[
                "The quiet room behind",
                <em key="accent" className="italic text-gold-soft">
                  every acquisition.
                </em>,
              ]}
            />
          </h2>
          <Reveal delay={0.18} className="lg:pb-2">
            <p className="text-pretty text-lg leading-relaxed text-cream-dim">
              After introduction, each buyer receives a confidential client
              area: the full dossier, watermarked documents, the viewing
              schedule, and updates from one senior advisor.
            </p>
          </Reveal>
        </div>

        {/* the client area itself */}
        <Reveal delay={0.1} className="mt-16">
          <PlatformDashboard />
        </Reveal>

        {/* the transaction, end to end */}
        <PlatformPipeline />

        {/* closing assurances + access */}
        <div className="mt-20 lg:mt-24">
          <Reveal direction="none">
            <span className="rule-line bg-cream/15" aria-hidden />
          </Reveal>
          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
            <div className="grid gap-8 sm:grid-cols-3">
              {ASSURANCES.map((a, i) => (
                <Reveal key={a.title} delay={0.08 * i} direction="none">
                  <h3 className="flex items-center gap-2.5 text-[0.95rem] font-medium tracking-tight text-cream">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                    {a.title}
                  </h3>
                  <p className="mt-3 text-[0.88rem] leading-relaxed text-cream-faint">
                    {a.body}
                  </p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2} direction="none">
              <Button asChild variant="gold" size="lg">
                <a href="#contact">
                  Request access <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
