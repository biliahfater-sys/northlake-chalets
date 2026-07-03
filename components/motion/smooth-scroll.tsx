"use client";

import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { useEffect } from "react";

/** Fixed navbar height — anchored sections settle just beneath it. */
const NAV_OFFSET = -72;

/** Long glides for far sections, but never sluggish for near ones. */
const easeGlide = (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t));

/**
 * Sitewide inertial smooth scrolling. Lenis drives window scroll with a
 * gentle exponential ease; a delegated click handler turns every in-page
 * anchor — navbar, plan cards, footer, chat — into a cinematic glide
 * instead of a jump. Wheel smoothing steps aside under
 * prefers-reduced-motion; anchor glides shorten but stay smooth.
 */
export function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: easeGlide,
      smoothWheel: !reduce,
      touchMultiplier: 1.4,
    });

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    // Delegated so links mounted later (modals, chat, admin) glide too.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor) return;
      const id = decodeURIComponent(anchor.hash.slice(1));
      const target = id ? document.getElementById(id) : document.body;
      if (!target) return;
      e.preventDefault();

      lenis.scrollTo(target, {
        offset: id === "hero" || !id ? 0 : NAV_OFFSET,
        duration: reduce ? 0.7 : 1.7,
        easing: easeGlide,
        lock: true,
      });
      // keep the URL shareable without triggering a native jump
      history.replaceState(null, "", id ? `#${id}` : " ");
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduce]);

  return null;
}
