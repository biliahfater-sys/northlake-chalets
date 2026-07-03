"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/motion/reveal";
import { RidgeLine } from "@/components/motion/ridge-line";
import { useI18n } from "@/lib/i18n";
import { NAV_LINKS } from "@/lib/nav";
import { SITE } from "@/lib/site-config";
import { OPEN_COOKIE_SETTINGS } from "@/components/legal/cookie-consent";

const LOCATIONS = SITE.locations;

export function Footer() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const markY = useTransform(
    scrollYProgress,
    [0, 1],
    [reduce ? 0 : 70, 0],
  );
  const navLabel: Record<string, string> = {
    collection: t.nav.collection,
    estate: t.nav.estate,
    investment: t.nav.investment,
    platform: t.nav.platform,
  };

  return (
    <footer ref={ref} className="relative overflow-hidden bg-ink text-cream">
      <span className="grain-overlay" aria-hidden />
      <div className="relative mx-auto max-w-[92rem] px-5 pt-14 pb-10 sm:px-8 lg:px-12 lg:pt-20">
        {/* the ridge sets itself down before the colophon */}
        <RidgeLine className="mb-12 lg:mb-16" stroke="rgba(242,237,225,0.18)" />

        <div className="grid gap-14 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-20">
          <div>
            <p className="font-serif text-2xl leading-tight tracking-tight">
              {t.footer.taglineA}
              <br />
              <span className="italic text-cream/50">{t.footer.taglineB}</span>
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream-faint">
              {t.footer.blurb}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 sm:gap-12">
            <FooterColumn title={t.footer.explore}>
              {NAV_LINKS.map((l) => (
                <FooterLink key={l.id} href={`#${l.id}`}>
                  {navLabel[l.id] ?? l.label}
                </FooterLink>
              ))}
            </FooterColumn>
            <FooterColumn title={t.footer.contact}>
              <FooterLink href={`mailto:${SITE.email}`}>
                {SITE.email}
              </FooterLink>
              <FooterLink href="#contact">{t.footer.viewing}</FooterLink>
              <FooterLink href="#contact">{t.footer.portfolio}</FooterLink>
            </FooterColumn>
            <FooterColumn title={t.footer.legal}>
              <FooterLink href="/privacy">{t.footer.privacy}</FooterLink>
              <FooterLink href="/consent">{t.footer.consent}</FooterLink>
              <FooterLink href="/terms">{t.footer.terms}</FooterLink>
              <FooterLink href="#mandate">{t.footer.mandate}</FooterLink>
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS))
                }
                className="group/link w-fit cursor-pointer text-left text-sm text-cream-dim transition-colors duration-300 hover:text-gold-soft"
              >
                {t.footer.cookies}
                <span
                  className="block h-px max-w-full origin-left scale-x-0 bg-gold-soft/60 transition-transform duration-500 ease-[var(--ease-glide)] group-hover/link:scale-x-100"
                  aria-hidden
                />
              </button>
            </FooterColumn>
            <FooterColumn title={t.footer.locations}>
              {LOCATIONS.map((loc) => (
                <span key={loc} className="text-sm text-cream-dim">
                  {loc}
                </span>
              ))}
            </FooterColumn>
          </div>
        </div>

        {/* monumental wordmark — rises slowly out of the page edge */}
        <Reveal direction="none" className="mt-20 lg:mt-28">
          <motion.p
            aria-hidden
            style={{ y: markY }}
            className="select-none whitespace-nowrap text-center font-serif text-[clamp(4rem,14vw,12rem)] font-light leading-[0.85] tracking-[-0.04em] text-cream/[0.08] transition-colors duration-1000 hover:text-cream/[0.14]"
          >
            {SITE.name}
          </motion.p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-3 border-cream/10 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-cream-faint">
            © {new Date().getFullYear()} {SITE.name} {SITE.nameSuffix} —
            Switzerland
          </p>
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-cream-faint">
            {SITE.coordinates}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="eyebrow text-cream-faint">{title}</span>
      {children}
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group/link w-fit text-sm text-cream-dim transition-colors duration-300 hover:text-gold-soft"
    >
      {children}
      <span
        className="block h-px max-w-full origin-left scale-x-0 bg-gold-soft/60 transition-transform duration-500 ease-[var(--ease-glide)] group-hover/link:scale-x-100"
        aria-hidden
      />
    </a>
  );
}
