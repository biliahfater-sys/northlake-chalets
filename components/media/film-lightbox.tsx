"use client";

import { Play, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { VIDEO } from "@/lib/media";

/**
 * "Watch the film" — a circular play control with slow-orbiting caption that
 * opens a full-screen promo lightbox. Esc / backdrop closes it.
 */
export function FilmButton({ label = "Watch the film" }: { label?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    // soundtrack steps aside while the film plays
    window.dispatchEvent(new Event("nl:ambience-duck"));
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      window.dispatchEvent(new Event("nl:ambience-restore"));
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        className="group relative flex h-28 w-28 cursor-pointer items-center justify-center"
      >
        {/* orbiting caption */}
        <svg
          viewBox="0 0 100 100"
          aria-hidden
          className="absolute inset-0 h-full w-full text-cream-dim transition-colors duration-500 group-hover:text-gold-soft"
          style={{ animation: "spin 22s linear infinite" }}
        >
          <defs>
            <path
              id="film-orbit"
              d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
            />
          </defs>
          <text className="fill-current text-[8.2px] uppercase tracking-[0.32em]">
            <textPath href="#film-orbit">
              {label} · Northlake · {label} ·
            </textPath>
          </text>
        </svg>
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-cream/30 bg-cream/10 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
          <Play className="ml-0.5 h-5 w-5 fill-current" />
        </span>
      </button>

      {/* portal escapes transformed ancestors so `fixed` means the viewport */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="film"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm sm:p-10"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl overflow-hidden rounded-xl shadow-float"
              onClick={(e) => e.stopPropagation()}
            >
              {/* biome-ignore lint/a11y/useMediaCaption: ambient promo loop, no dialogue */}
              <video
                src={VIDEO.firepit1080}
                poster={VIDEO.firepitPoster}
                autoPlay
                loop
                playsInline
                controls
                className="aspect-video w-full bg-black object-cover"
              />
              {/* header band — scrim keeps the titles legible on any frame */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/75 via-black/35 to-transparent pb-12">
                <div className="flex items-start justify-between gap-6 p-6 sm:p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="eyebrow leading-none text-gold-soft">
                      Northlake — the film
                    </p>
                    <p className="mt-2.5 font-serif text-xl font-light leading-tight tracking-[-0.01em] text-cream sm:text-2xl">
                      An evening above the lake
                    </p>
                  </motion.div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close film"
                    className="pointer-events-auto flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-cream/30 bg-black/40 text-cream backdrop-blur-md transition-colors duration-300 hover:bg-cream hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
