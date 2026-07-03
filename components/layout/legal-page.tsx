"use client";

import { ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { DrawnRule, RiseLines } from "@/components/motion/text-rise";
import { SITE } from "@/lib/site-config";

export interface LegalSection {
  title: string;
  body: string[];
}

/**
 * Shared shell for the legal pages — same paper, same serif voice as the
 * folio, none of the home page machinery. Quietly animated: the title
 * rises out of its mask, sections surface as you read down.
 */
export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
}) {
  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-line border-b">
        <div className="mx-auto flex h-18 max-w-4xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-serif text-xl leading-none tracking-tight">
              {SITE.name}
            </span>
            <span className="text-[0.6rem] font-sans font-semibold uppercase tracking-[0.3em] opacity-70">
              {SITE.nameSuffix}
            </span>
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-400 group-hover:-translate-x-1" />{" "}
            Back to the site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="eyebrow block text-bronze"
        >
          {eyebrow}
        </motion.span>
        <h1 className="mt-4 font-serif text-[clamp(2.2rem,5vw,3.6rem)] font-light leading-[1.05] tracking-[-0.02em]">
          <RiseLines lines={[title]} delay={0.15} amount={0.1} />
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.6, duration: 0.9 }}
          className="mt-3 text-[0.72rem] uppercase tracking-[0.2em] text-faint"
        >
          Last updated — {updated}
        </motion.p>
        <DrawnRule className="mt-8" delay={0.3} />

        {intro && (
          <Reveal direction="up" amount={0.15}>
            <p className="mt-10 max-w-2xl text-[1.02rem] leading-relaxed text-espresso">
              {intro}
            </p>
          </Reveal>
        )}

        <div className="mt-10 flex flex-col gap-10">
          {sections.map((s, i) => (
            <Reveal key={s.title} direction="up" amount={0.15}>
              <section>
                <h2 className="flex items-baseline gap-4 font-serif text-2xl font-light text-ink">
                  <span className="text-sm text-bronze tnum">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </h2>
                {s.body.map((p) => (
                  <p
                    key={p.slice(0, 32)}
                    className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-espresso"
                  >
                    {p}
                  </p>
                ))}
              </section>
            </Reveal>
          ))}
        </div>

        <DrawnRule className="mt-14" />
        <Reveal direction="none" delay={0.1}>
          <p className="mt-6 text-sm text-muted">
            Questions about this document —{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="font-medium text-bronze underline-offset-4 hover:underline"
            >
              {SITE.email}
            </a>
          </p>
        </Reveal>
      </main>
    </div>
  );
}
