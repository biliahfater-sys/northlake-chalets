"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          callback: (token: string) => void;
          "expired-callback"?: () => void;
        },
      ) => string;
      remove: (id: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/**
 * Cloudflare Turnstile widget — renders only when
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY is configured; otherwise the form ships
 * with no third-party scripts at all.
 */
export function Turnstile({ onToken }: { onToken: (token?: string) => void }) {
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!SITE_KEY || !holder.current) return;
    let widgetId: string | undefined;
    let cancelled = false;

    const render = () => {
      if (cancelled || !holder.current || !window.turnstile) return;
      widgetId = window.turnstile.render(holder.current, {
        sitekey: SITE_KEY,
        theme: "dark",
        callback: onToken,
        "expired-callback": () => onToken(undefined),
      });
    };

    if (window.turnstile) {
      render();
    } else {
      let script = document.querySelector<HTMLScriptElement>(
        `script[src="${SCRIPT_SRC}"]`,
      );
      if (!script) {
        script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", render);
    }

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [onToken]);

  if (!SITE_KEY) return null;
  return <div ref={holder} className="min-h-[65px]" />;
}
