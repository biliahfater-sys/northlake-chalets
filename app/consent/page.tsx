import type { Metadata } from "next";
import { LocalizedLegal } from "@/components/layout/localized-legal";
import { CONSENT_DOCUMENT } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных",
  description:
    "Согласие на обработку персональных данных по 152-ФЗ: перечень данных, цели и действия, трансграничная передача, срок действия и порядок отзыва согласия.",
  robots: { index: true, follow: true },
};

export default function ConsentPage() {
  return <LocalizedLegal doc={CONSENT_DOCUMENT} />;
}
