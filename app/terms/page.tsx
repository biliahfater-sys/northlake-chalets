import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Terms of engagement",
  description:
    "How a Northlake engagement is structured: buyer representation, confidentiality, KYC, fees fixed in writing.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Northlake — legal"
      title="Terms of engagement"
      updated="June 2026"
      sections={[
        {
          title: "Who we act for",
          body: [
            "Northlake is retained by buyers. We represent your interest in sourcing, evaluating, and negotiating an acquisition. We do not hold listings for sale on behalf of owners within the same engagement, and we disclose any potential conflict before it could arise.",
          ],
        },
        {
          title: "How an engagement begins",
          body: [
            "An engagement starts only when both sides sign a letter of engagement that fixes scope, fee, and confidentiality. Until then, conversations are exploratory and free of obligation on either side.",
            "Standard know-your-client checks and a proof-of-funds review are completed after the first conversation and before private dossiers or off-market opportunities are opened.",
          ],
        },
        {
          title: "Fees",
          body: [
            "One advisory fee, agreed in writing before the engagement begins and payable at completion. No retainers, no percentage surprises, and no fee if no acquisition completes.",
          ],
        },
        {
          title: "Confidentiality",
          body: [
            "Both sides owe each other confidentiality. Residence dossiers are shared under NDA, watermarked, and revocable. Your identity is disclosed to an owner only with your written consent.",
          ],
        },
        {
          title: "Foreign ownership",
          body: [
            "Acquisitions by non-Swiss buyers are structured within the Lex Koller framework with independent Swiss counsel. We coordinate this work; legal advice itself is rendered by the appointed law firm.",
          ],
        },
        {
          title: "Liability and governing law",
          body: [
            "We work with care and verified information, but valuations and yield models are professional estimates, not guarantees. Engagements are governed by Swiss law; place of jurisdiction is the canton named in the letter of engagement.",
          ],
        },
      ]}
    />
  );
}
