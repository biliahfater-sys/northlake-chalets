// Order MUST follow document order (see SECTION_IDS) so the active-link
// indicator only ever travels forward as the page scrolls.
export const NAV_LINKS = [
  { id: "collection", label: "Collection" },
  { id: "estate", label: "Estate" },
  { id: "investment", label: "Investment" },
  { id: "platform", label: "Platform" },
] as const;

/** All section ids tracked for the active-link indicator, in document order. */
export const SECTION_IDS = [
  "hero",
  "philosophy",
  "collection",
  "estate",
  "nature",
  "craft",
  "seasons",
  "investment",
  "process",
  "platform",
  "faq",
  "mandate",
  "voices",
  "contact",
] as const;
