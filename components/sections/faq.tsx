"use client";

import { Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { RiseLines } from "@/components/motion/text-rise";
import { FAQ } from "@/features/content/faq";
import { cn } from "@/lib/utils";

/**
 * Chapter VIII — questions, answered quietly. An editorial index on paper:
 * sticky chapter heading left, numbered hairline accordion right. One item
 * open at a time; height animates with a calm glide.
 */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="relative bg-paper text-ink">
      <div className="mx-auto max-w-[92rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <Reveal direction="none">
          <div className="flex items-baseline justify-between gap-6">
            <span className="eyebrow flex items-center gap-3 text-bronze">
              <span className="h-px w-10 bg-bronze/50" aria-hidden />
              Chapter VIII — Before you ask
            </span>
            <span className="eyebrow hidden text-faint sm:block">
              Seven honest answers
            </span>
          </div>
          <span className="rule-line mt-5" aria-hidden />
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <h2 className="font-serif text-[clamp(2.2rem,4.6vw,4.2rem)] font-light leading-[1.04] tracking-[-0.03em]">
              <RiseLines
                lines={[
                  "Questions,",
                  <span key="accent">
                    answered <em className="italic text-bronze">quietly.</em>
                  </span>,
                ]}
              />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-7 max-w-sm text-pretty leading-relaxed text-muted">
                The things buyers ask in the first conversation — fees,
                privacy, foreign ownership, returns — answered the way we'd
                answer across a table.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="mt-6 text-sm text-faint">
                Anything else —{" "}
                <a
                  href="#contact"
                  className="font-medium text-bronze underline-offset-4 transition-colors hover:text-ink hover:underline"
                >
                  ask an advisor
                </a>
                .
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} direction="none">
            <dl className="border-line border-t">
              {FAQ.map((item, i) => {
                const isOpen = open === i;
                return (
                  <div key={item.q} className="border-line border-b">
                    <dt>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="group flex w-full cursor-pointer items-baseline gap-5 py-6 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:gap-8 sm:py-7"
                      >
                        <span className="shrink-0 text-[0.7rem] tracking-[0.18em] text-faint tnum">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "flex-1 font-serif text-xl font-light tracking-[-0.01em] transition-colors duration-300 sm:text-2xl",
                            isOpen ? "text-ink" : "text-ink-soft group-hover:text-ink",
                          )}
                        >
                          {item.q}
                        </span>
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 translate-y-1.5 items-center justify-center self-start rounded-full border transition-all duration-500 ease-[var(--ease-glide)]",
                            isOpen
                              ? "rotate-45 border-bronze bg-bronze text-cream"
                              : "border-line-strong text-muted group-hover:border-bronze group-hover:text-bronze",
                          )}
                          aria-hidden
                        >
                          <Plus className="h-4 w-4" />
                        </span>
                      </button>
                    </dt>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.dd
                          initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          animate={
                            reduce
                              ? { opacity: 1 }
                              : { height: "auto", opacity: 1 }
                          }
                          exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-7 pl-10 text-pretty leading-relaxed text-espresso sm:pl-14">
                            {item.a}
                          </p>
                        </motion.dd>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
