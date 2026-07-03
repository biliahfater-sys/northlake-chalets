/**
 * FAQ content — edit here, the section renders whatever this array holds.
 * Keep answers short, factual, and calm; this is the trust chapter.
 */

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: FaqItem[] = [
  {
    q: "How does an acquisition begin?",
    a: "With a conversation, not a listing. You tell us what you're looking for; we answer with two or three residences under NDA, a season to see them in, and a yield model for each. Nothing is published, nothing is rushed.",
  },
  {
    q: "Can foreign buyers own Swiss property?",
    a: "Yes, within the Lex Koller framework. Several of our residences carry existing second-home permits; for the others we structure the acquisition with Swiss counsel before any offer is made. We have closed for buyers from fourteen countries.",
  },
  {
    q: "What do viewings look like?",
    a: "Private, by appointment, usually over half a day — the house, the shoreline, the village, lunch. If you cannot travel, we produce a dedicated film of the residence and walk you through it live.",
  },
  {
    q: "How are your fees structured?",
    a: "A single advisory fee agreed before engagement, payable at completion. No retainers, no percentage surprises, and no fee at all if we never bring you a residence worth pursuing.",
  },
  {
    q: "What returns do alpine residences carry?",
    a: "Across the current portfolio, blended net yields run 4.2–5.4% from discreet seasonal letting, with long-hold appreciation historically ahead of Swiss prime averages. Every dossier includes a conservative model — we'd rather under-promise.",
  },
  {
    q: "How private is the process?",
    a: "Entirely. Residences are shown only under NDA, your identity is disclosed to owners only with your consent, and dossiers live in Swiss data residency. Most of our transactions never appear on the open market.",
  },
  {
    q: "What is Northlake OS?",
    a: "The platform our own advisors run on — inventory, dossiers, viewings, and yield models — licensed to partner desks as a white-label workspace on their own domain. See the Platform chapter, or commission a workspace directly.",
  },
];
