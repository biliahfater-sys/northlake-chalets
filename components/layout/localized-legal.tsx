"use client";

import { LegalPage } from "@/components/layout/legal-page";
import { useI18n } from "@/lib/i18n";
import type { LegalDocument } from "@/lib/legal-content";

/**
 * Picks the legal document in the visitor's current language (RU is the
 * authoritative version for Roskomnadzor; EN mirrors it). The choice follows
 * the same language toggle as the rest of the site.
 */
export function LocalizedLegal({ doc }: { doc: Record<"ru" | "en", LegalDocument> }) {
  const { lang } = useI18n();
  const d = doc[lang] ?? doc.ru;
  return (
    <LegalPage
      eyebrow={d.eyebrow}
      title={d.title}
      updated={d.updated}
      intro={d.intro}
      sections={d.sections}
    />
  );
}
