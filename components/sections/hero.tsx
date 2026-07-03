"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { AtmosphereShader } from "@/components/media/atmosphere-shader";
import { CinematicImage } from "@/components/media/cinematic-image";
import { DustField } from "@/components/media/dust-field";
import { Magnetic } from "@/components/motion/magnetic-button";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { IMAGES } from "@/lib/media";
import { SITE } from "@/lib/site-config";

const FACTS = SITE.facts;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const lines: { key: string; node: React.ReactNode }[] = [
    { key: "l1", node: t.hero.l1 },
    {
      key: "l2",
      node: (
        <>
          {t.hero.l2pre}{" "}
          <em className="font-light italic text-gold-soft">{t.hero.l2accent}</em>
        </>
      ),
    },
    { key: "l3", node: t.hero.l3 },
  ];
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-pine-deep"
    >
      <CinematicImage
        src={IMAGES.heroVillage}
        alt="Alpine chalet village beside a still lake at sunrise, framed by snow-dusted peaks and pine forest"
        priority
        kenBurns
        fog
        overlay
        parallax={60}
        sizes="100vw"
        className="absolute inset-0"
      />
      {/* WebGL pass: drifting valley fog + breathing light shafts */}
      <AtmosphereShader className="z-[1] opacity-80" warmth={1} />
      {/* dust motes drifting through the morning light (canvas 2D) */}
      <DustField className="z-[2]" />
      <span className="grain-overlay z-[2]" aria-hidden />

      {/* warm sunrise bloom matching the source light */}
      <span
        aria-hidden
        className="light-bloom"
        style={{ left: "-8%", top: "8%", width: "44vw", height: "44vw" }}
      />

      {/* editorial coordinates strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 1.2 }}
        className="absolute top-24 right-5 z-10 hidden text-right sm:right-8 md:block lg:right-12"
      >
        <p className="eyebrow text-cream-faint">{SITE.coordinates}</p>
        <p className="mt-1 text-xs tracking-[0.14em] text-cream-faint/80 uppercase">
          {SITE.region}
        </p>
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-[92rem] flex-1 flex-col justify-end px-5 pt-28 pb-12 sm:px-8 sm:pb-14 lg:px-12 lg:pb-16"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="eyebrow mb-6 flex items-center gap-3 text-gold-soft"
        >
          <span className="h-px w-10 bg-gold-soft/50" />
          {t.hero.eyebrow}
        </motion.span>

        <h1 className="font-serif text-[clamp(2.9rem,8.4vw,8rem)] font-light leading-[0.96] tracking-[-0.03em] text-cream">
          {lines.map((line, i) => (
            <span key={line.key} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className="block"
                initial={reduce ? { opacity: 0 } : { y: "112%" }}
                animate={reduce ? { opacity: 1 } : { y: "0%" }}
                transition={{
                  delay: 0.7 + i * 0.14,
                  duration: 1.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {line.node}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-9 flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md text-pretty text-[1.02rem] leading-relaxed text-cream-dim"
          >
            {t.hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <Button asChild variant="gold" size="lg">
                <a href="#collection">
                  {t.hero.ctaCollection} <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </Magnetic>
            <Button asChild variant="cream" size="lg" sheen={false}>
              <a href="#contact">{t.hero.ctaViewing}</a>
            </Button>
          </motion.div>
        </div>

        {/* editorial fact bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.75, duration: 1 }}
          className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-cream/15 border-t pt-7 sm:grid-cols-4"
        >
          {FACTS.map((f, i) => (
            <div key={f.label} className="flex flex-col">
              <span className="font-serif text-2xl text-cream sm:text-3xl">
                {f.value}
              </span>
              <span className="mt-1 text-[0.66rem] uppercase tracking-[0.2em] text-cream-faint">
                {t.hero.factLabels[i] ?? f.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.a
        href="#philosophy"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute right-12 bottom-10 z-10 hidden flex-col items-center gap-2 text-cream-faint xl:flex"
        aria-label="Scroll to explore"
      >
        <span className="text-[0.6rem] uppercase tracking-[0.3em]">{t.hero.scroll}</span>
        <ArrowDown className="h-4 w-4 [animation:var(--animate-float-cue)]" />
      </motion.a>
    </section>
  );
}
