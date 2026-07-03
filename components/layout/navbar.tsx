"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { SoundToggle } from "@/components/audio/sound-toggle";
import { LangToggle } from "@/components/layout/lang-toggle";
import { Magnetic } from "@/components/motion/magnetic-button";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { NAV_LINKS, SECTION_IDS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const navLabel: Record<string, string> = {
    collection: t.nav.collection,
    estate: t.nav.estate,
    investment: t.nav.investment,
    platform: t.nav.platform,
    contact: t.nav.contact,
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Track every section and map the one in the viewport mid-band to its
    // nearest preceding nav link, so the indicator stays meaningful through
    // the long in-between chapters.
    const order = SECTION_IDS as readonly string[];
    const navIds = new Set<string>(NAV_LINKS.map((l) => l.id));
    const visible = new Set<string>();

    const ownerFor = (sectionId: string): string | null => {
      const idx = order.indexOf(sectionId);
      for (let i = idx; i >= 0; i--) {
        if (navIds.has(order[i])) return order[i];
      }
      return null;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        let current: string | null = null;
        let best = -1;
        for (const id of visible) {
          const idx = order.indexOf(id);
          if (idx > best) {
            best = idx;
            current = id;
          }
        }
        if (!current) return;
        setActive(ownerFor(current) ?? "hero");
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    for (const id of order) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "absolute inset-0 transition-all duration-700 ease-[var(--ease-glide)]",
            scrolled
              ? "border-b border-line bg-paper/88 shadow-[0_8px_30px_-18px_rgba(24,27,18,0.35)] backdrop-blur-xl"
              : "bg-gradient-to-b from-black/35 to-transparent",
          )}
        />
        <nav className="relative mx-auto flex h-18 max-w-[92rem] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <a
            href="#hero"
            className={cn(
              "group flex items-baseline gap-2 transition-colors duration-500",
              scrolled ? "text-ink" : "text-cream",
            )}
          >
            <span className="font-serif text-xl leading-none tracking-tight">
              Northlake
            </span>
            <span className="text-[0.6rem] font-sans font-semibold uppercase tracking-[0.3em] opacity-70">
              Chalets
            </span>
          </a>

          <div className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={cn(
                  "relative py-2 text-[0.82rem] font-medium tracking-tight transition-colors duration-400",
                  scrolled
                    ? "text-muted hover:text-ink"
                    : "text-cream-dim hover:text-cream",
                  active === link.id && (scrolled ? "text-ink" : "text-cream"),
                )}
              >
                {navLabel[link.id] ?? link.label}
                {active === link.id && (
                  <motion.span
                    layoutId="nav-active"
                    className={cn(
                      "absolute inset-x-0 -bottom-px h-px",
                      scrolled ? "bg-bronze" : "bg-gold",
                    )}
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden xl:inline-flex">
              <LangToggle light={!scrolled} />
            </span>
            <span className="hidden md:inline-flex">
              <SoundToggle light={!scrolled} />
            </span>
            <Magnetic className="hidden sm:inline-flex">
              <Button asChild size="md" variant={scrolled ? "primary" : "cream"}>
                <a href="#contact">
                  {t.nav.viewing} <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </Magnetic>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t.nav.openMenu}
              className={cn(
                "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-colors lg:hidden",
                scrolled
                  ? "border-line-strong text-ink"
                  : "border-cream/30 text-cream",
              )}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-pine-deep text-cream lg:hidden"
          >
            <span className="grain-overlay" aria-hidden />
            <div className="relative flex h-18 items-center justify-between px-5 sm:px-8">
              <span className="font-serif text-lg">Northlake</span>
              <div className="flex items-center gap-3">
                <LangToggle light />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label={t.nav.closeMenu}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-cream/30"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <motion.nav
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
              }}
              className="relative mt-8 flex flex-col px-5 sm:px-8"
            >
              {[...NAV_LINKS, { id: "contact", label: t.nav.contact }].map((link, i) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMenuOpen(false)}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { ease: [0.16, 1, 0.3, 1], duration: 0.6 },
                    },
                  }}
                  className="flex items-baseline justify-between border-cream/12 border-b py-5"
                >
                  <span className="font-serif text-4xl tracking-tight">
                    {navLabel[link.id] ?? link.label}
                  </span>
                  <span className="font-serif text-sm text-cream-faint">
                    0{i + 1}
                  </span>
                </motion.a>
              ))}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { ease: [0.16, 1, 0.3, 1], duration: 0.6 },
                  },
                }}
                className="mt-10"
              >
                <Button asChild variant="cream" size="lg" className="w-full">
                  <a href="#contact" onClick={() => setMenuOpen(false)}>
                    {t.nav.requestViewing} <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
