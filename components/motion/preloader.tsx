"use client";

import gsap from "gsap";
import { useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site-config";

const LETTERS = SITE.name.toUpperCase().split("");

const RIDGE_FRONT =
  "M0 270 L150 175 L265 235 L430 85 L565 205 L705 115 L845 215 L985 145 L1200 245";
const RIDGE_BACK =
  "M0 240 L180 150 L330 205 L520 60 L660 170 L820 95 L990 185 L1200 130";

/**
 * Opening title sequence (GSAP timeline): twin mountain ridges draw
 * themselves in gold, the wordmark rises letter by letter out of a mask,
 * a counter runs to 100 — then the stage splits like curtains and the
 * hero is already breathing underneath. Plays on every arrival; a click
 * or Escape fast-forwards it for returning visitors in a hurry.
 */
export function Preloader() {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [show, setShow] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce || !isHome) return;
    setShow(true);
  }, [reduce, isHome]);

  useEffect(() => {
    if (!show || !root.current) return;
    document.documentElement.style.overflow = "hidden";
    let cleanupListeners = () => {};

    const ctx = gsap.context((self) => {
      const q = self.selector;
      if (!q) return;

      // prepare ridge strokes for the draw-on effect
      for (const path of root.current?.querySelectorAll<SVGPathElement>(
        "[data-ridge]",
      ) ?? []) {
        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;
        path.style.strokeDashoffset = `${len}`;
      }

      const counter = { v: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          document.documentElement.style.overflow = "";
          setShow(false);
        },
      });

      // a click or Escape fast-forwards the sequence without skipping the reveal
      const skip = () => {
        if (tl.progress() < 0.78) tl.timeScale(3.2);
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") skip();
      };
      root.current?.addEventListener("pointerdown", skip);
      window.addEventListener("keydown", onKey);
      // failsafe: occluded/background windows throttle rAF to a crawl —
      // never hold the page hostage longer than ~9s of wall-clock time
      const failsafe = setTimeout(() => {
        if (tl.progress() < 1) tl.progress(1);
      }, 9000);
      cleanupListeners = () => {
        clearTimeout(failsafe);
        root.current?.removeEventListener("pointerdown", skip);
        window.removeEventListener("keydown", onKey);
      };

      tl.to("[data-ridge-back]", { strokeDashoffset: 0, duration: 1.6 }, 0.1)
        .to("[data-ridge-front]", { strokeDashoffset: 0, duration: 1.5 }, 0.35)
        .fromTo(
          q("[data-bloom]"),
          { opacity: 0, scale: 0.7 },
          { opacity: 1, scale: 1, duration: 2.2, ease: "power2.out" },
          0.3,
        )
        .fromTo(
          q("[data-letter]"),
          { yPercent: 115, rotate: 4, filter: "blur(6px)" },
          {
            yPercent: 0,
            rotate: 0,
            filter: "blur(0px)",
            duration: 1.1,
            stagger: 0.055,
            ease: "expo.out",
          },
          0.4,
        )
        .fromTo(
          q("[data-tagline]"),
          { opacity: 0, letterSpacing: "0.55em" },
          { opacity: 1, letterSpacing: "0.26em", duration: 1.2 },
          1.0,
        )
        .fromTo(
          q("[data-meta]"),
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
          1.1,
        )
        .to(
          counter,
          {
            v: 100,
            duration: 2.1,
            ease: "power2.inOut",
            onUpdate: () => {
              const el = root.current?.querySelector("[data-count]");
              if (el) el.textContent = String(Math.round(counter.v));
            },
          },
          0.2,
        )
        .to(
          q("[data-bar]"),
          { scaleX: 1, duration: 2.1, ease: "power2.inOut" },
          0.2,
        )
        // — exit: content lifts, ridges glow out, curtains split —
        .to(
          q("[data-stage]"),
          { opacity: 0, y: -40, filter: "blur(8px)", duration: 0.6 },
          2.5,
        )
        .to(q("[data-panel-top]"), { yPercent: -100, duration: 0.95, ease: "expo.inOut" }, 2.7)
        .to(q("[data-panel-bottom]"), { yPercent: 100, duration: 0.95, ease: "expo.inOut" }, 2.7);
    }, root);

    return () => {
      cleanupListeners();
      ctx.revert();
      document.documentElement.style.overflow = "";
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="fixed inset-0 z-[200] overflow-hidden"
    >
      {/* split curtains */}
      <div
        data-panel-top
        className="absolute inset-x-0 top-0 h-1/2 bg-pine-deep"
      />
      <div
        data-panel-bottom
        className="absolute inset-x-0 bottom-0 h-1/2 bg-pine-deep"
      />
      <span className="grain-overlay" aria-hidden />

      <div
        data-stage
        className="relative flex h-full flex-col items-center justify-center text-cream"
      >
        {/* warm bloom rising behind the wordmark, like first light on the ridge */}
        <span
          aria-hidden
          className="-translate-x-1/2 -translate-y-[58%] pointer-events-none absolute top-1/2 left-1/2 h-[34rem] w-[34rem]"
        >
          <span
            data-bloom
            style={{ opacity: 0, animation: "none" }}
            className="light-bloom absolute inset-0"
          />
        </span>
        {/* drawing ridges */}
        <svg
          viewBox="0 0 1200 320"
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute inset-x-0 top-1/2 h-64 w-full -translate-y-[58%] opacity-70"
          aria-hidden
        >
          <path
            data-ridge
            data-ridge-back
            d={RIDGE_BACK}
            fill="none"
            stroke="#8a6f45"
            strokeWidth="1"
            opacity="0.45"
          />
          <path
            data-ridge
            data-ridge-front
            d={RIDGE_FRONT}
            fill="none"
            stroke="#c2a25f"
            strokeWidth="1.4"
          />
        </svg>

        {/* masked wordmark */}
        <p className="relative flex overflow-hidden font-serif text-[clamp(3rem,9vw,7.5rem)] font-light leading-none tracking-[-0.02em]">
          {LETTERS.map((ch, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: static letter list
              key={`${ch}-${i}`}
              data-letter
              className="inline-block will-change-transform"
            >
              {ch}
            </span>
          ))}
        </p>
        <p data-tagline className="eyebrow mt-5 text-gold-soft">
          {SITE.tagline}
        </p>

        {/* footer strip */}
        <div className="absolute right-0 bottom-12 left-0 mx-auto w-[min(26rem,76vw)]">
          <div className="h-px w-full bg-cream/15">
            <div
              data-bar
              style={{ transform: "scaleX(0)", transformOrigin: "left" }}
              className="h-px bg-gradient-to-r from-bronze to-gold-soft"
            />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span data-meta className="eyebrow text-cream-faint">
              {SITE.region}
            </span>
            <span data-meta className="font-serif text-2xl text-gold-soft tnum">
              <span data-count>0</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
