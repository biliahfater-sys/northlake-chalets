"use client";

import { type Lang, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LANGS: Lang[] = ["en", "ru"];

/** EN | RU — a hairline editorial toggle, persisted per visitor. */
export function LangToggle({ light = false }: { light?: boolean }) {
  const { lang, setLang } = useI18n();

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "flex h-10 items-center gap-0.5 rounded-full border px-1.5 transition-colors duration-500",
        light ? "border-cream/30" : "border-line-strong",
      )}
    >
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          className={cn(
            "cursor-pointer rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300",
            lang === l
              ? light
                ? "bg-cream/15 text-cream"
                : "bg-ink/8 text-ink"
              : light
                ? "text-cream/50 hover:text-cream"
                : "text-muted hover:text-ink",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
