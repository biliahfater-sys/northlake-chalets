"use client";

import {
  FileCheck,
  Home,
  Landmark,
  PenLine,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * The transaction — how an acquisition actually proceeds — drawn as a gold
 * thread that pulls itself across the chapter as it scrolls into view, each
 * stage lighting in sequence. Below it, the services carried inside the one
 * engagement: notary, escrow, KYC, counsel.
 * ------------------------------------------------------------------------- */

const STAGES = [
  { n: "01", name: "Introduction", body: "A conversation about intent and horizon. NDA signed; nothing public, ever." },
  { n: "02", name: "Private dossier", body: "Films, plans, title, and the yield model — sealed, watermarked, yours." },
  { n: "03", name: "Viewing", body: "On site or by film — travel, keys, and timing handled by the desk." },
  { n: "04", name: "Offer", body: "Negotiated by your advisor with the owner directly. Proof of funds reviewed." },
  { n: "05", name: "Diligence & escrow", body: "Counsel, structuring, and funds through Swiss escrow — one team, one engagement." },
  { n: "06", name: "Completion", body: "Notary, land registry, handover — and a lit fireplace on arrival." },
];

const SERVICES = [
  { icon: PenLine, label: "Notary coordination" },
  { icon: Landmark, label: "Swiss escrow" },
  { icon: ShieldCheck, label: "KYC & proof of funds" },
  { icon: Scale, label: "Lex Koller counsel" },
  { icon: FileCheck, label: "Land-registry filing" },
  { icon: Home, label: "Insurance & staffing" },
];

export function PlatformPipeline() {
  const reduce = useReducedMotion();

  return (
    <div className="mt-20 lg:mt-28">
      <Reveal direction="none">
        <div className="flex items-baseline justify-between gap-6">
          <h3 className="font-serif text-2xl font-light text-cream sm:text-3xl">
            The transaction, end to end
          </h3>
          <span className="eyebrow hidden text-cream-faint sm:block">
            One thread · six stages
          </span>
        </div>
      </Reveal>

      {/* the thread */}
      <div className="relative mt-12">
        {/* desktop: horizontal thread above the stage grid */}
        <svg
          viewBox="0 0 1200 2"
          preserveAspectRatio="none"
          className="absolute top-[5px] left-0 hidden h-0.5 w-full lg:block"
          aria-hidden
        >
          <line x1="0" y1="1" x2="1200" y2="1" stroke="rgba(242,237,225,0.12)" strokeWidth="2" />
          <motion.line
            x1="0"
            y1="1"
            x2="1200"
            y2="1"
            stroke="#c2a25f"
            strokeWidth="2"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        {/* mobile: vertical thread along the left edge */}
        <span
          className="absolute top-1 bottom-1 left-[5px] w-px bg-cream/12 lg:hidden"
          aria-hidden
        />
        <motion.span
          initial={{ scaleY: reduce ? 1 : 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "top" }}
          className="absolute top-1 bottom-1 left-[5px] w-px bg-gold/70 lg:hidden"
          aria-hidden
        />

        <div className="grid gap-9 lg:grid-cols-6 lg:gap-6">
          {STAGES.map((s, i) => (
            <motion.div
              key={s.n}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.8,
                delay: reduce ? 0 : 0.25 + i * 0.32,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative pl-7 lg:pl-0"
            >
              {/* node */}
              <span
                className="absolute top-0.5 left-0 flex h-3 w-3 items-center justify-center lg:relative lg:left-auto lg:mb-5 lg:block"
                aria-hidden
              >
                <span className="absolute inline-flex h-3 w-3 rounded-full border border-gold/60 bg-pine-deep" />
                <span className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" />
              </span>
              <span className="text-[0.62rem] tracking-[0.2em] text-gold-soft tnum">
                {s.n}
              </span>
              <h4 className="mt-1.5 text-[0.95rem] font-medium tracking-tight text-cream">
                {s.name}
              </h4>
              <p className="mt-2 text-[0.8rem] leading-relaxed text-cream-faint">
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* transaction services — handled inside the one engagement */}
      <Reveal delay={0.1} className="mt-16">
        <div className="flex flex-wrap items-center gap-x-0 gap-y-3 overflow-hidden rounded-xl border border-cream/10 bg-cream/[0.03]">
          <span className="eyebrow shrink-0 px-5 py-4 text-cream-faint">
            Handled within the engagement
          </span>
          {SERVICES.map(({ icon: Icon, label }, i) => (
            <span
              key={label}
              className={cn(
                "flex items-center gap-2 px-5 py-4 text-[0.78rem] tracking-tight text-cream-dim transition-colors duration-300 hover:text-cream",
                i > 0 && "border-cream/8 sm:border-l",
              )}
            >
              <Icon className="h-3.5 w-3.5 text-gold-soft/70" aria-hidden />
              {label}
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
