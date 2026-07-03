"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { Reveal, RevealItem, StaggerReveal } from "@/components/motion/reveal";
import { RiseLines } from "@/components/motion/text-rise";
import { Button } from "@/components/ui/button";

const FIGURES = [
  {
    value: 6.2,
    decimals: 1,
    prefix: "+",
    suffix: "%",
    label: "Avg. annual appreciation",
    note: "Alpine lakefront, 2014–2026",
  },
  {
    value: 5.1,
    decimals: 1,
    prefix: "",
    suffix: "%",
    label: "Net rental yield",
    note: "Managed winter & summer seasons",
  },
  {
    value: 0,
    decimals: 0,
    prefix: "",
    suffix: " hrs",
    label: "Owner administration",
    note: "Northlake operates everything",
  },
];

const LEDGER = [
  {
    n: "I",
    title: "Acquisition advisory",
    body: "Off-market sourcing, valuation, and negotiation handled by one senior advisor from first call to closing.",
  },
  {
    n: "II",
    title: "Legal & tax structuring",
    body: "Swiss counsel for Lex Koller, cantonal tax, and cross-border ownership — arranged before you commit.",
  },
  {
    n: "III",
    title: "Rental & operations",
    body: "Discreet letting to a vetted guest list, full housekeeping and maintenance, quarterly owner statements.",
  },
  {
    n: "IV",
    title: "Resale strategy",
    body: "When the time comes, your residence returns to the same private channel it was acquired through.",
  },
];

/** Chapter V — the asset case, set in dark ledger form. */
export function Investment() {
  return (
    <section
      id="investment"
      className="relative overflow-hidden bg-pine-deep text-cream"
    >
      <span className="grain-overlay" aria-hidden />
      <span
        className="light-bloom -top-40 -right-40 absolute h-[36rem] w-[36rem]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[92rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-44">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-24">
          <div>
            <Reveal direction="none">
              <span className="eyebrow flex items-center gap-3 text-gold-soft">
                <span className="h-px w-10 bg-gold-soft/50" aria-hidden />
                Chapter V — The asset case
              </span>
            </Reveal>
            <h2 className="mt-6 font-serif text-[clamp(2.6rem,6vw,5.8rem)] font-light leading-[1.02] tracking-[-0.03em]">
              <RiseLines
                delay={0.08}
                lines={[
                  "Property that",
                  <em key="accent" className="italic text-gold-soft">
                    compounds.
                  </em>,
                ]}
              />
            </h2>
            <Reveal delay={0.16}>
              <p className="mt-8 max-w-lg text-pretty text-lg leading-relaxed text-cream-dim">
                Buildable lakefront land in the protected cantons is finite by
                law. Every residence we list is difficult to replicate — which
                is precisely why it holds.
              </p>
            </Reveal>

            <StaggerReveal className="mt-14 grid gap-px overflow-hidden rounded-xl border border-cream/12 bg-cream/12 sm:grid-cols-3">
              {FIGURES.map((f) => (
                <RevealItem
                  key={f.label}
                  className="bg-pine-deep/85 p-7 backdrop-blur-sm sm:p-8"
                >
                  <span className="font-serif text-5xl font-light text-cream tnum sm:text-[3.4rem]">
                    <AnimatedCounter
                      value={f.value}
                      decimals={f.decimals}
                      prefix={f.prefix}
                      suffix={f.suffix}
                    />
                  </span>
                  <span className="mt-3 block text-[0.68rem] uppercase tracking-[0.2em] text-gold-soft">
                    {f.label}
                  </span>
                  <span className="mt-1.5 block text-[0.8rem] leading-relaxed text-cream-faint">
                    {f.note}
                  </span>
                </RevealItem>
              ))}
            </StaggerReveal>

            {/* the appreciation line, drawn like a ledger annotation */}
            <Reveal delay={0.15} direction="none" className="mt-10">
              <AppreciationChart />
            </Reveal>
          </div>

          {/* service ledger */}
          <div className="flex flex-col lg:pt-24">
            <span className="rule-line bg-cream/15" aria-hidden />
            {LEDGER.map((row, i) => (
              <Reveal key={row.n} delay={i * 0.08} direction="none">
                <div className="group border-cream/12 border-b py-7 transition-colors duration-700">
                  <div className="flex items-baseline gap-5">
                    <span className="w-7 font-serif text-sm italic text-gold-soft/80">
                      {row.n}
                    </span>
                    <div>
                      <h3 className="font-serif text-xl text-cream transition-colors duration-500 group-hover:text-gold-soft">
                        {row.title}
                      </h3>
                      <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-cream-faint">
                        {row.body}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.4} direction="none" className="mt-10">
              <Button asChild variant="cream" size="lg">
                <a href="#contact">
                  Discuss an acquisition <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------------
 * The appreciation curve — alpine lakefront, indexed. Draws itself in like a
 * pen stroke when scrolled into view; the area beneath washes in after, and
 * a gold marker breathes at today's value.
 * ------------------------------------------------------------------------- */

const CURVE =
  "M 0 168 C 60 162 110 158 160 148 C 230 134 270 130 330 112 C 400 92 450 84 510 58 C 545 44 570 36 600 24";
const AREA = `${CURVE} L 600 200 L 0 200 Z`;
const GRID_YEARS = [
  { x: 0, label: "2014" },
  { x: 200, label: "2018" },
  { x: 400, label: "2022" },
  { x: 600, label: "2026" },
];

function AppreciationChart() {
  const reduce = useReducedMotion();

  return (
    <figure className="overflow-hidden rounded-xl border border-cream/12 bg-pine-deep/70 backdrop-blur-sm">
      <figcaption className="flex items-baseline justify-between gap-4 border-cream/10 border-b px-5 py-3.5">
        <span className="text-[0.64rem] uppercase tracking-[0.2em] text-cream-faint">
          Alpine lakefront index · 2014–2026
        </span>
        <span className="text-[0.64rem] uppercase tracking-[0.2em] text-gold-soft">
          +6.2% p.a.
        </span>
      </figcaption>
      <motion.svg
        viewBox="0 0 600 220"
        role="img"
        aria-label="Indexed price of alpine lakefront property, 2014 to 2026 — a steady upward curve averaging 6.2 percent a year"
        className="block w-full"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.45 }}
      >
        <defs>
          <linearGradient id="inv-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(194,162,95,0.22)" />
            <stop offset="100%" stopColor="rgba(194,162,95,0)" />
          </linearGradient>
        </defs>

        {/* horizontal ledger lines */}
        {[56, 104, 152].map((y) => (
          <motion.line
            key={y}
            x1="0"
            y1={y}
            x2="600"
            y2={y}
            stroke="rgba(242,237,225,0.07)"
            strokeWidth="1"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { duration: 1.2 } },
            }}
          />
        ))}

        {/* area wash */}
        <motion.path
          d={AREA}
          fill="url(#inv-area)"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { delay: reduce ? 0 : 1.4, duration: 1.2 },
            },
          }}
        />

        {/* the curve itself */}
        <motion.path
          d={CURVE}
          fill="none"
          stroke="#c2a25f"
          strokeWidth="2"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: reduce ? 1 : 0, opacity: reduce ? 0 : 1 },
            show: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: reduce ? 0.3 : 2.2, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        />

        {/* today's marker — soft breathing pulse */}
        <motion.g
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { delay: reduce ? 0 : 2, duration: 0.6 },
            },
          }}
        >
          {!reduce && (
            <motion.circle
              cx="600"
              cy="24"
              r="5"
              fill="none"
              stroke="rgba(224,198,132,0.5)"
              strokeWidth="1.4"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <circle cx="600" cy="24" r="3.4" fill="#e0c684" />
        </motion.g>

        {/* year ticks */}
        {GRID_YEARS.map((g, i) => (
          <motion.text
            key={g.label}
            x={Math.min(Math.max(g.x, 16), 584)}
            y="212"
            textAnchor={g.x === 0 ? "start" : g.x === 600 ? "end" : "middle"}
            fill="rgba(242,237,225,0.35)"
            fontSize="9.5"
            letterSpacing="2"
            fontFamily="var(--font-sans)"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { delay: reduce ? 0 : 0.5 + i * 0.3, duration: 0.8 },
              },
            }}
          >
            {g.label}
          </motion.text>
        ))}
      </motion.svg>
    </figure>
  );
}
