"use client";

import { useEffect, useRef, useState } from "react";
import { Ambience } from "./ambience";
import { cn } from "@/lib/utils";

const BARS = [0, 1, 2, 3];
const PREF_KEY = "nl-sound";

/** One engine for the page — both navbar instances drive the same score. */
let sharedEngine: Ambience | null = null;
function engine() {
  sharedEngine ??= new Ambience();
  return sharedEngine;
}

/**
 * Ambient score toggle — four hairline bars that sway while the generative
 * alpine score plays. Browsers block true autoplay, so the score starts on
 * the visitor's first gesture (scroll, click, key) — unless they previously
 * chose silence, which we remember.
 */
export function SoundToggle({ light = false }: { light?: boolean }) {
  const [on, setOn] = useState(false);
  const onRef = useRef(on);
  onRef.current = on;

  // autoplay-after-first-gesture, duck/restore for the film modal,
  // and cross-instance sync (navbar renders two toggles)
  useEffect(() => {
    const sync = () => setOn(engine().running);

    const firstGesture = () => {
      if (localStorage.getItem(PREF_KEY) === "off") return;
      if (engine().running) return;
      engine()
        .start()
        .then(() => window.dispatchEvent(new Event("nl:ambience-sync")))
        .catch(() => {});
    };
    const duck = () => engine().duck();
    const restore = () => engine().restore();

    window.addEventListener("pointerdown", firstGesture, { once: true });
    window.addEventListener("keydown", firstGesture, { once: true });
    window.addEventListener("nl:ambience-duck", duck);
    window.addEventListener("nl:ambience-restore", restore);
    window.addEventListener("nl:ambience-sync", sync);
    return () => {
      window.removeEventListener("pointerdown", firstGesture);
      window.removeEventListener("keydown", firstGesture);
      window.removeEventListener("nl:ambience-duck", duck);
      window.removeEventListener("nl:ambience-restore", restore);
      window.removeEventListener("nl:ambience-sync", sync);
    };
  }, []);

  const toggle = async () => {
    if (onRef.current) {
      await engine().stop();
      localStorage.setItem(PREF_KEY, "off");
    } else {
      await engine().start();
      localStorage.setItem(PREF_KEY, "on");
    }
    window.dispatchEvent(new Event("nl:ambience-sync"));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn ambient sound off" : "Turn ambient sound on"}
      className={cn(
        "group flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 transition-colors duration-500",
        light
          ? "border-cream/30 text-cream hover:border-cream/60"
          : "border-line-strong text-ink hover:border-bronze",
      )}
    >
      <span className="flex h-3.5 items-end gap-[3px]" aria-hidden>
        {BARS.map((i) => (
          <span
            key={i}
            style={{
              animationDelay: `${i * 0.18}s`,
              animationPlayState: on ? "running" : "paused",
            }}
            className={cn(
              "w-px origin-bottom [animation:var(--animate-soundbar)] rounded-full transition-colors duration-500",
              on
                ? "bg-gold h-3.5"
                : cn("h-1.5", light ? "bg-cream/60" : "bg-muted"),
            )}
          />
        ))}
      </span>
      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em]">
        {on ? "Sound" : "Muted"}
      </span>
    </button>
  );
}
