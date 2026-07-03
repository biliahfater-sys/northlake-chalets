"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { RiseLines } from "@/components/motion/text-rise";

/* ----------------------------------------------------------------------------
 * Chapter IX — the mandate. How the engagement is actually run: who we act
 * for, what happens with your identity and funds, and the order of events.
 * Careful wording throughout: professional, specific, and honest — no
 * invented licence numbers, no claims we can't carry.
 * ------------------------------------------------------------------------- */

const PRINCIPLES = [
  {
    title: "Buyer representation",
    body: "We are retained by the buyer and negotiate against the asking price, not toward it. Owners are counterparties, never clients of the same engagement.",
  },
  {
    title: "Confidentiality first",
    body: "Residences are shown under NDA. Your identity is disclosed to an owner only with your written consent, and most transactions never reach the open market.",
  },
  {
    title: "KYC & proof of funds",
    body: "After the first conversation — never before — we complete standard KYC and a proof-of-funds review, as Swiss practice and our banking partners require.",
  },
  {
    title: "Secure document handling",
    body: "Titles, plans, and models are shared through the private client area: watermarked to your name, revocable, and stored under Swiss data residency.",
  },
  {
    title: "Off-market access",
    body: "The published collection is a fraction of what we carry. Off-market and quiet-sale opportunities are introduced once intent and funds are established.",
  },
  {
    title: "One engagement, in writing",
    body: "Scope, fee, and exclusivity are fixed in a single letter of engagement before work begins. No retainers, no surprises at completion.",
  },
];

export function Trust() {
  return (
    <section id="mandate" className="relative overflow-hidden bg-paper-deep">
      <div className="mx-auto max-w-[92rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <Reveal direction="none">
          <div className="flex items-baseline justify-between gap-6">
            <span className="eyebrow flex items-center gap-3 text-bronze">
              <span className="h-px w-10 bg-bronze/50" aria-hidden />
              Chapter IX — The mandate
            </span>
            <span className="eyebrow hidden text-faint sm:block">
              How the engagement is run
            </span>
          </div>
          <span className="rule-line mt-5" aria-hidden />
        </Reveal>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-20">
          <h2 className="font-serif text-[clamp(2.2rem,5vw,4.6rem)] font-light leading-[1.04] tracking-[-0.03em] text-ink">
            <RiseLines
              lines={[
                "Discretion is a process,",
                <em key="accent" className="italic text-bronze">
                  not a promise.
                </em>,
              ]}
            />
          </h2>
          <Reveal delay={0.18} className="lg:pb-2">
            <p className="text-pretty text-lg leading-relaxed text-espresso">
              Northlake operates as a private brokerage under Swiss practice —
              acting for buyers, by appointment. The rules below apply to every
              engagement, including yours.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line-strong/60 bg-line-strong/40 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={0.06 * i} direction="none" className="h-full">
              <div className="group flex h-full flex-col bg-paper p-7 transition-colors duration-500 hover:bg-paper-raised sm:p-8">
                <span className="font-serif text-sm text-bronze tnum transition-transform duration-500 ease-[var(--ease-glide)] group-hover:translate-x-1.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-serif text-[1.35rem] font-light leading-snug text-ink transition-colors duration-500 group-hover:text-bronze">
                  {p.title}
                </h3>
                <span
                  className="mt-3 block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-bronze/60 to-transparent transition-transform duration-700 ease-[var(--ease-glide)] group-hover:scale-x-100"
                  aria-hidden
                />
                <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15} direction="none" className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <p className="max-w-xl text-sm leading-relaxed text-muted">
              The full engagement terms, fee structure, and data-handling
              practice are set out in writing before any commitment — see the{" "}
              <a
                href="/privacy"
                className="font-medium text-bronze underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                privacy policy
              </a>{" "}
              and{" "}
              <a
                href="/terms"
                className="font-medium text-bronze underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                terms of engagement
              </a>
              .
            </p>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-bronze"
            >
              Begin the conversation
              <ArrowUpRight className="h-4 w-4 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
