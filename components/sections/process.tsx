"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/motion/reveal";
import { RiseLines } from "@/components/motion/text-rise";

const STEPS = [
  {
    n: "01",
    title: "Consultation",
    duration: "Day one",
    body: "A single conversation — your intent, horizon, and the kind of silence you're after. We shortlist three residences, never thirty.",
  },
  {
    n: "02",
    title: "Private viewings",
    duration: "Week one",
    body: "On site or by film, at your pace. Helicopter transfers from Geneva and Zürich arranged where the season allows.",
  },
  {
    n: "03",
    title: "Acquisition",
    duration: "Weeks 2–8",
    body: "Diligence, structuring, and negotiation run by one team under one engagement. You sign twice: the offer and the deed.",
  },
  {
    n: "04",
    title: "Handover & care",
    duration: "Ongoing",
    body: "Keys, staff, and a lit fireplace on arrival. The estate is run for you from that evening forward.",
  },
];

/**
 * Chapter VI — the acquisition path, set as a quiet ledger. A bronze thread
 * pulls itself down the margin as the reader scrolls; each step's node
 * lights as the thread reaches it.
 */
export function Process() {
  const railRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.75", "end 0.55"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    mass: 0.6,
  });

  return (
    <section id="process" className="relative bg-paper">
      <div className="mx-auto max-w-[92rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        {/* chapter rule */}
        <Reveal direction="none">
          <div className="flex items-baseline justify-between gap-6">
            <span className="eyebrow flex items-center gap-3 text-bronze">
              <span className="h-px w-10 bg-bronze/50" aria-hidden />
              Chapter VI — The Path
            </span>
            <span className="eyebrow hidden text-faint sm:block">
              Four steps, one engagement
            </span>
          </div>
          <span className="rule-line mt-5" aria-hidden />
        </Reveal>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end lg:gap-20">
          <h2 className="font-serif text-[clamp(2.2rem,5vw,4.6rem)] font-light leading-[1.04] tracking-[-0.03em] text-ink">
            <RiseLines
              lines={[
                "From first call",
                <em key="accent" className="italic text-bronze">
                  to first fire.
                </em>,
              ]}
            />
          </h2>
          <Reveal delay={0.18} className="lg:pb-2">
            <p className="text-pretty text-lg leading-relaxed text-espresso">
              One senior advisor carries the acquisition end to end — no
              hand-offs, no listing agents, no noise between you and the
              house.
            </p>
          </Reveal>
        </div>

        <div ref={railRef} className="relative mt-14 lg:pl-14">
          {/* the margin thread — track + scroll-driven bronze fill (desktop) */}
          <span
            className="absolute top-2 bottom-2 left-[5px] hidden w-px bg-line-strong/50 lg:block"
            aria-hidden
          />
          <motion.span
            style={{ scaleY: reduce ? 1 : progress, transformOrigin: "top" }}
            className="absolute top-2 bottom-2 left-[5px] hidden w-px bg-bronze lg:block"
            aria-hidden
          />

          <span className="rule-line" aria-hidden />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08} direction="none">
              <div className="group relative grid gap-3 border-line-strong/60 border-b py-9 sm:grid-cols-[5rem_minmax(0,18rem)_1fr] sm:items-baseline sm:gap-8">
                {/* node on the thread */}
                <motion.span
                  initial={reduce ? { opacity: 0 } : { scale: 0.3, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="-left-14 absolute top-[3.1rem] hidden h-[11px] w-[11px] items-center justify-center lg:flex"
                  aria-hidden
                >
                  <span className="absolute inset-0 rounded-full border border-bronze/60 bg-paper" />
                  <span className="absolute top-1/2 left-1/2 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bronze transition-transform duration-500 group-hover:scale-150" />
                </motion.span>

                <span className="font-serif text-2xl font-light text-bronze tnum transition-transform duration-500 group-hover:translate-x-1">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-serif text-[1.6rem] font-light leading-tight text-ink transition-colors duration-500 group-hover:text-bronze">
                    {s.title}
                  </h3>
                  <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.22em] text-faint">
                    {s.duration}
                  </span>
                </div>
                <p className="max-w-md text-pretty text-[0.98rem] leading-relaxed text-muted sm:justify-self-end">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
