"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface BackgroundVideoProps {
  src: string;
  srcMobile?: string;
  poster: string;
  className?: string;
  /** Overlay dark gradient on top of the video. */
  overlay?: boolean;
}

/**
 * Looped, muted background video with a graceful poster fallback. Autoplay
 * is muted (browser policy); a sitewide ambient soundscape carries the audio
 * atmosphere instead. Pauses when scrolled off-screen to save battery/CPU,
 * and falls back to the poster image if the video can't play.
 */
export function BackgroundVideo({
  src,
  srcMobile,
  poster,
  className,
  overlay = true,
}: BackgroundVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => undefined);
        else el.pause();
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {!failed && (
        <video
          ref={ref}
          className="h-full w-full object-cover"
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
        >
          {srcMobile && (
            <source src={srcMobile} type="video/mp4" media="(max-width: 768px)" />
          )}
          <source src={src} type="video/mp4" />
        </video>
      )}
      {failed && (
        // biome-ignore lint/a11y/useAltText: decorative fallback frame
        <img
          src={poster}
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
        />
      )}
      {overlay && <span className="cine-overlay absolute inset-0" aria-hidden />}
    </div>
  );
}
