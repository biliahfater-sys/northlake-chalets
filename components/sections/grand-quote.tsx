"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/motion/reveal";

/* The testimonial, word by word — each phrase surfacing out of soft focus. */
const WORDS: { node: React.ReactNode; key: string }[] = [
  ..."“We saw eleven properties in three countries before Northlake showed us one. We stopped looking"
    .split(" ")
    .map((word, i) => ({ node: `${word} `, key: `w-${i}` })),
  { node: <span className="text-bronze">the </span>, key: "a-1" },
  { node: <span className="text-bronze">same </span>, key: "a-2" },
  {
    node: (
      <>
        <span className="text-bronze">afternoon</span>.”
      </>
    ),
    key: "a-3",
  },
];

/** Chapter VII — one voice, given the space of a full chapter. */
export function GrandQuote() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 36, reduce ? 0 : -36]);

  return (
    <section id="voices" ref={ref} className="relative overflow-hidden bg-paper-deep">
      <div className="mx-auto max-w-6xl px-5 py-28 text-center sm:px-8 sm:py-36 lg:py-44">
        <Reveal direction="none">
          <span className="eyebrow text-bronze">Chapter VIII — Voices</span>
        </Reveal>

        {/* an opening quotation mark, drawn like a pen flourish */}
        <motion.svg
          viewBox="0 0 64 48"
          className="mx-auto mt-10 h-10 w-14 sm:h-12 sm:w-16"
          aria-hidden
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.8 }}
        >
          {["M 24 6 C 12 10 6 20 6 32 C 6 38 10 42 16 42 C 21 42 25 38 25 33 C 25 28 21 24 16 24 C 15 24 13 25 12 25 C 13 17 18 11 24 8",
            "M 56 6 C 44 10 38 20 38 32 C 38 38 42 42 48 42 C 53 42 57 38 57 33 C 57 28 53 24 48 24 C 47 24 45 25 44 25 C 45 17 50 11 56 8",
          ].map((d, i) => (
            <motion.path
              key={d.slice(2, 8)}
              d={d}
              fill="none"
              stroke="#8a6f45"
              strokeWidth="1.6"
              strokeLinecap="round"
              variants={{
                hidden: { pathLength: reduce ? 1 : 0, opacity: reduce ? 0 : 1 },
                show: {
                  pathLength: 1,
                  opacity: 0.85,
                  transition: {
                    delay: i * 0.3,
                    duration: reduce ? 0.3 : 1.4,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              }}
            />
          ))}
        </motion.svg>

        <motion.blockquote style={{ y: drift }} className="mt-8">
          <p className="text-balance font-serif text-[clamp(1.9rem,4.6vw,4rem)] font-light italic leading-[1.18] tracking-[-0.02em] text-ink">
            {WORDS.map(({ node, key }, i) => (
              <motion.span
                key={key}
                className="inline-block whitespace-pre"
                initial={
                  reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: "blur(7px)" }
                }
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  delay: i * 0.045,
                  duration: 0.75,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {node}
              </motion.span>
            ))}
          </p>
        </motion.blockquote>

        <Reveal delay={0.3} direction="none">
          <footer className="mt-12 flex flex-col items-center gap-2">
            <motion.span
              initial={reduce ? { opacity: 0 } : { scaleX: 0 }}
              whileInView={reduce ? { opacity: 1 } : { scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="block h-px w-24 bg-gradient-to-r from-transparent via-line-strong to-transparent"
              aria-hidden
            />
            <span className="mt-4 text-[0.72rem] uppercase tracking-[0.24em] text-espresso">
              Owners, Maison Lac Clair
            </span>
            <span className="text-[0.68rem] uppercase tracking-[0.2em] text-faint">
              Acquired 2024 · Geneva & London
            </span>
          </footer>
        </Reveal>
      </div>
    </section>
  );
}
