import type { Metadata } from "next";
import { LocalizedLegal } from "@/components/layout/localized-legal";
import { PRIVACY_POLICY } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Политика обработки персональных данных",
  description:
    "Политика обработки персональных данных по 152-ФЗ: оператор, цели и правовые основания обработки, перечень данных, сроки хранения, права субъекта, трансграничная передача и файлы cookie.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return <LocalizedLegal doc={PRIVACY_POLICY} />;
}
