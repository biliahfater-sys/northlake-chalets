"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { featuredVilla } from "@/features/villas/data";

/* ----------------------------------------------------------------------------
 * The asset, on paper — the part a buyer actually studies: a specimen sheet
 * of the ground floor, the access ledger, and one honest paragraph on why
 * the price holds. Drawn as architectural hairlines, not marketing.
 * ------------------------------------------------------------------------- */

export function DossierDetails() {
  const v = featuredVilla;

  return (
    <div className="relative z-10 mx-auto max-w-[92rem] px-5 pb-28 sm:px-8 sm:pb-36 lg:px-12 lg:pb-44">
      <Reveal direction="none">
        <span className="rule-line bg-cream/15" aria-hidden />
        <div className="mt-8 flex items-baseline justify-between gap-6">
          <span className="eyebrow text-gold-soft">The asset, on paper</span>
          <span className="eyebrow hidden text-cream-faint sm:block">
            Specimen sheet · full set under NDA
          </span>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* floor plan plate */}
        <Reveal delay={0.1} direction="none">
          <div className="overflow-hidden rounded-xl border border-cream/12 bg-[#0b120e]/85 shadow-float backdrop-blur-sm">
            <div className="flex h-11 items-center justify-between border-cream/10 border-b px-5">
              <span className="text-[0.62rem] uppercase tracking-[0.2em] text-cream-faint">
                Ground floor — 1:100
              </span>
              <span className="text-[0.62rem] uppercase tracking-[0.2em] text-gold-soft/80">
                Specimen
              </span>
            </div>
            <FloorPlan />
            <div className="flex flex-wrap items-center justify-between gap-4 border-cream/10 border-t px-5 py-4">
              <p className="text-[0.78rem] leading-relaxed text-cream-faint">
                All levels, sections, and the plot survey are issued inside the
                dossier, watermarked to your name.
              </p>
              <Button asChild variant="cream" size="sm" sheen={false}>
                <a href="#contact">
                  Request full plans <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </div>
        </Reveal>

        {/* positioning + access */}
        <div className="flex flex-col">
          <Reveal delay={0.15} direction="none">
            <h3 className="font-serif text-2xl font-light text-cream sm:text-[1.7rem]">
              Why the price holds
            </h3>
            <p className="mt-4 max-w-lg text-pretty text-[0.98rem] leading-relaxed text-cream-dim">
              {v.positioning}
            </p>
            {v.audience && (
              <div className="mt-5 flex flex-wrap gap-2">
                {v.audience.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-gold/30 px-3.5 py-1.5 text-[0.7rem] uppercase tracking-[0.14em] text-gold-soft"
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}
          </Reveal>

          <Reveal delay={0.25} direction="none" className="mt-10">
            <AccessMap />
          </Reveal>

          {v.access && (
            <Reveal delay={0.3} direction="none" className="mt-6">
              <div className="overflow-hidden rounded-xl border border-cream/12">
                {v.access.map((a) => (
                  <div
                    key={a.label}
                    className="flex h-12 items-center justify-between gap-4 border-cream/8 border-b px-4 transition-colors duration-300 last:border-0 hover:bg-cream/[0.04]"
                  >
                    <span className="truncate text-[0.86rem] text-cream-dim">
                      {a.label}
                    </span>
                    <span className="whitespace-nowrap text-[0.84rem] text-cream tnum">
                      {a.value}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- architectural specimen drawing -------------------------------------- */

const wall = "rgba(242, 237, 225, 0.55)";
const thin = "rgba(242, 237, 225, 0.22)";
const room = "rgba(242, 237, 225, 0.04)";
const gold = "rgba(224, 198, 132, 0.85)";

/* Motion variant helpers — the plan draughts itself in like a pen drawing. */
const EASE = [0.16, 1, 0.3, 1] as const;

function drawVariants(reduce: boolean, delay: number, duration = 1.1) {
  return {
    hidden: reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 },
    show: reduce
      ? { opacity: 1, transition: { duration: 0.3 } }
      : {
          pathLength: 1,
          opacity: 1,
          transition: { delay, duration, ease: EASE },
        },
  };
}

function fadeVariants(reduce: boolean, delay: number, duration = 0.9) {
  return {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { delay: reduce ? 0 : delay, duration, ease: EASE },
    },
  };
}

function FloorPlan() {
  const reduce = useReducedMotion() ?? false;
  const draw = (delay: number, duration?: number) =>
    drawVariants(reduce, delay, duration);
  const fade = (delay: number) => fadeVariants(reduce, delay);

  return (
    <motion.svg
      viewBox="0 0 560 380"
      role="img"
      aria-label={`Schematic ground-floor plan of ${featuredVilla.name} — grand salon, dining, kitchen, library, master suite, and a south terrace`}
      className="block w-full"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
    >
      {/* paper */}
      <rect width="560" height="380" fill="transparent" />

      {/* room wash settles in once the walls are up */}
      <motion.rect
        x="70" y="46" width="340" height="250"
        fill={room} stroke="none"
        variants={fade(1.2)}
      />
      {/* outer walls */}
      <motion.rect
        x="70" y="46" width="340" height="250"
        fill="none" stroke={wall} strokeWidth="2.5"
        variants={draw(0, 1.6)}
      />
      {/* terrace, dashed */}
      <motion.rect
        x="70" y="296" width="240" height="56"
        fill="none" stroke={thin} strokeWidth="1.4" strokeDasharray="5 4"
        variants={fade(1.5)}
      />
      <motion.text
        x="190" y="328" textAnchor="middle" fill={thin} fontSize="9"
        letterSpacing="2" fontFamily="var(--font-sans)"
        variants={fade(1.7)}
      >
        TERRACE · 86 M²
      </motion.text>

      {/* interior walls */}
      <motion.line x1="240" y1="46" x2="240" y2="180" stroke={wall} strokeWidth="1.6" variants={draw(0.5)} />
      <motion.line x1="240" y1="180" x2="410" y2="180" stroke={wall} strokeWidth="1.6" variants={draw(0.65)} />
      <motion.line x1="320" y1="46" x2="320" y2="180" stroke={wall} strokeWidth="1.6" variants={draw(0.8)} />
      <motion.line x1="70" y1="200" x2="180" y2="200" stroke={wall} strokeWidth="1.6" variants={draw(0.95)} />
      <motion.line x1="180" y1="200" x2="180" y2="296" stroke={wall} strokeWidth="1.6" variants={draw(1.1)} />

      {/* door openings (gaps drawn as paper-coloured breaks + swing arcs) */}
      <motion.line x1="240" y1="118" x2="240" y2="146" stroke="#0b120e" strokeWidth="3" variants={fade(1.3)} />
      <motion.path d="M 240 118 A 28 28 0 0 1 268 146" fill="none" stroke={thin} strokeWidth="1" variants={draw(1.35, 0.7)} />
      <motion.line x1="296" y1="180" x2="270" y2="180" stroke="#0b120e" strokeWidth="3" variants={fade(1.4)} />
      <motion.path d="M 270 180 A 26 26 0 0 1 296 154" fill="none" stroke={thin} strokeWidth="1" variants={draw(1.45, 0.7)} />
      <motion.line x1="180" y1="232" x2="180" y2="258" stroke="#0b120e" strokeWidth="3" variants={fade(1.5)} />
      <motion.path d="M 180 232 A 26 26 0 0 1 206 258" fill="none" stroke={thin} strokeWidth="1" variants={draw(1.55, 0.7)} />

      {/* glazing toward the terrace */}
      <motion.line
        x1="84" y1="296" x2="296" y2="296"
        stroke={gold} strokeWidth="2" strokeDasharray="14 6"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 0.65,
            transition: { delay: reduce ? 0 : 1.8, duration: 0.9, ease: EASE },
          },
        }}
      />

      {/* fireplace */}
      <motion.rect x="74" y="128" width="14" height="34" fill="none" stroke={gold} strokeWidth="1.4" variants={draw(1.9, 0.8)} />
      <motion.line x1="74" y1="145" x2="88" y2="145" stroke={gold} strokeWidth="1" variants={draw(2.1, 0.5)} />

      {/* room labels */}
      <PlanLabel x={152} y={140} title="GRAND SALON" sub="68 M²" delay={1.6} />
      <PlanLabel x={280} y={108} title="DINING" sub="32 M²" delay={1.72} />
      <PlanLabel x={365} y={108} title="KITCHEN" sub="28 M²" delay={1.84} />
      <PlanLabel x={300} y={240} title="MASTER SUITE" sub="54 M²" delay={1.96} />
      <PlanLabel x={124} y={244} title="LIBRARY" sub="22 M²" delay={2.08} />
      <PlanLabel x={210} y={244} title="ENTRY" sub="18 M²" delay={2.2} />

      {/* dimension line */}
      <motion.line x1="70" y1="30" x2="410" y2="30" stroke={thin} strokeWidth="1" variants={draw(2.1, 0.9)} />
      <motion.line x1="70" y1="24" x2="70" y2="36" stroke={thin} strokeWidth="1" variants={fade(2.2)} />
      <motion.line x1="410" y1="24" x2="410" y2="36" stroke={thin} strokeWidth="1" variants={fade(2.3)} />
      <motion.text
        x="240" y="22" textAnchor="middle" fill={thin} fontSize="9"
        letterSpacing="2" fontFamily="var(--font-sans)"
        variants={fade(2.4)}
      >
        24.60 M
      </motion.text>

      {/* north arrow + scale */}
      <motion.g transform="translate(478, 70)" variants={fade(2.3)}>
        <circle r="16" fill="none" stroke={thin} strokeWidth="1" />
        <path d="M 0 -10 L 5 8 L 0 4 L -5 8 Z" fill={gold} />
        <text y="34" textAnchor="middle" fill={thin} fontSize="9" letterSpacing="2" fontFamily="var(--font-sans)">N</text>
      </motion.g>
      <motion.g transform="translate(446, 330)" variants={fade(2.4)}>
        <line x1="0" y1="0" x2="80" y2="0" stroke={wall} strokeWidth="1.4" />
        <line x1="0" y1="-4" x2="0" y2="4" stroke={wall} strokeWidth="1.4" />
        <line x1="40" y1="-3" x2="40" y2="3" stroke={wall} strokeWidth="1" />
        <line x1="80" y1="-4" x2="80" y2="4" stroke={wall} strokeWidth="1.4" />
        <text x="40" y="16" textAnchor="middle" fill={thin} fontSize="9" letterSpacing="2" fontFamily="var(--font-sans)">
          0 — 5 M
        </text>
      </motion.g>

      {/* watermark */}
      <motion.text
        x="280"
        y="205"
        textAnchor="middle"
        fill="rgba(242,237,225,0.05)"
        fontSize="34"
        letterSpacing="10"
        fontFamily="var(--font-serif)"
        transform="rotate(-14 280 205)"
        variants={fade(2.6)}
      >
        SPECIMEN
      </motion.text>
    </motion.svg>
  );
}

function PlanLabel({
  x,
  y,
  title,
  sub,
  delay = 0,
}: {
  x: number;
  y: number;
  title: string;
  sub: string;
  delay?: number;
}) {
  const reduce = useReducedMotion() ?? false;
  return (
    <motion.g variants={fadeVariants(reduce, delay)}>
      <text x={x} y={y} textAnchor="middle" fill="rgba(242,237,225,0.78)" fontSize="10" letterSpacing="2.4" fontFamily="var(--font-sans)">
        {title}
      </text>
      <text x={x} y={y + 14} textAnchor="middle" fill="rgba(242,237,225,0.34)" fontSize="9" letterSpacing="2" fontFamily="var(--font-sans)">
        {sub}
      </text>
    </motion.g>
  );
}

/* ---- access map — schematic, honest, not pretending to be GPS ------------- */

function AccessMap() {
  const reduce = useReducedMotion() ?? false;
  const fade = (delay: number) => fadeVariants(reduce, delay);

  return (
    <div className="overflow-hidden rounded-xl border border-cream/12 bg-[#0b120e]/70">
      <motion.svg
        viewBox="0 0 520 150"
        role="img"
        aria-label="Schematic access map — route from Geneva and Sion to the estate above the lake at Crête Sud"
        className="block w-full"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >
        {/* ridge line draws across first */}
        <motion.path
          d="M 0 64 L 70 38 L 130 58 L 210 22 L 290 52 L 360 30 L 440 56 L 520 36"
          fill="none"
          stroke="rgba(242,237,225,0.14)"
          strokeWidth="1.2"
          variants={drawVariants(reduce, 0, 1.8)}
        />
        {/* lake */}
        <motion.path
          d="M 320 118 Q 360 108 410 116 Q 460 124 500 114 L 520 150 L 300 150 Z"
          fill="rgba(140, 170, 175, 0.10)"
          variants={fade(0.8)}
        />
        <motion.path
          d="M 330 120 Q 372 111 416 118"
          fill="none"
          stroke="rgba(170, 200, 205, 0.25)"
          strokeWidth="1"
          variants={fade(1)}
        />

        {/* route — the dashes keep travelling toward the estate */}
        <motion.g
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 0.7,
              transition: { delay: reduce ? 0 : 0.6, duration: 1, ease: EASE },
            },
          }}
        >
          <motion.path
            d="M 36 96 C 130 96 170 88 232 86 C 300 84 330 78 398 72"
            fill="none"
            stroke={gold}
            strokeWidth="1.4"
            strokeDasharray="6 5"
            animate={reduce ? undefined : { strokeDashoffset: [0, -22] }}
            transition={
              reduce
                ? undefined
                : { duration: 2.6, repeat: Infinity, ease: "linear" }
            }
          />
        </motion.g>

        {/* stops light up along the way */}
        <MapStop x={36} y={96} label="GENEVA" sub="1 H 50" delay={0.7} />
        <MapStop x={166} y={90} label="SION" sub="35 MIN" delay={1} />
        <MapStop x={284} y={82} label="VILLAGE" sub="8 MIN" delay={1.3} />

        {/* estate — the destination breathes */}
        <motion.g transform="translate(398, 72)" variants={fade(1.6)}>
          {!reduce && (
            <motion.circle
              r="6"
              fill="none"
              stroke="rgba(224,198,132,0.45)"
              strokeWidth="1.2"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              animate={{ scale: [1, 2.3], opacity: [0.6, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <path d="M 0 -8 L 2.4 -2.4 L 8 -2 L 3.8 1.8 L 5 7.6 L 0 4.4 L -5 7.6 L -3.8 1.8 L -8 -2 L -2.4 -2.4 Z" fill={gold} />
          <text y="-15" textAnchor="middle" fill="rgba(242,237,225,0.85)" fontSize="10" letterSpacing="2.4" fontFamily="var(--font-sans)">
            DOMAINE BELVEDÈRE
          </text>
          <text y="22" textAnchor="middle" fill="rgba(242,237,225,0.4)" fontSize="8.5" letterSpacing="2" fontFamily="var(--font-sans)">
            CRÊTE SUD · 1 480 M
          </text>
        </motion.g>

        {/* lake label */}
        <motion.text
          x="452" y="138" textAnchor="middle" fill="rgba(170,200,205,0.4)"
          fontSize="8.5" letterSpacing="2.4" fontFamily="var(--font-sans)"
          variants={fade(1.4)}
        >
          LAC · 14 MIN
        </motion.text>
      </motion.svg>
      <p className="border-cream/10 border-t px-4 py-2.5 text-[0.66rem] uppercase tracking-[0.18em] text-cream-faint">
        Schematic — exact location disclosed under NDA
      </p>
    </div>
  );
}

function MapStop({
  x,
  y,
  label,
  sub,
  delay = 0,
}: {
  x: number;
  y: number;
  label: string;
  sub: string;
  delay?: number;
}) {
  const reduce = useReducedMotion() ?? false;
  return (
    /* outer g keeps the position — motion must not own this transform */
    <g transform={`translate(${x}, ${y})`}>
      <motion.g
        variants={{
          hidden: { opacity: 0, scale: reduce ? 1 : 0.4 },
          show: {
            opacity: 1,
            scale: 1,
            transition: { delay: reduce ? 0 : delay, duration: 0.7, ease: EASE },
          },
        }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <circle r="3.4" fill="none" stroke={gold} strokeWidth="1.2" />
        <circle r="1.2" fill={gold} />
        <text y="-10" textAnchor="middle" fill="rgba(242,237,225,0.7)" fontSize="9" letterSpacing="2.2" fontFamily="var(--font-sans)">
          {label}
        </text>
        <text y="18" textAnchor="middle" fill="rgba(242,237,225,0.38)" fontSize="8.5" letterSpacing="1.8" fontFamily="var(--font-sans)">
          {sub}
        </text>
      </motion.g>
    </g>
  );
}
