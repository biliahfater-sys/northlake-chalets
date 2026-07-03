/**
 * Client-side enquiry ledger. Submissions are emailed via the API routes;
 * a copy is kept in localStorage so the /admin demo dashboard has real rows
 * to show without a database. Swap this for an API/DB read when one exists.
 */

export type EnquiryKind = "viewing" | "dossier";

export interface StoredEnquiry {
  id: string;
  kind: EnquiryKind;
  at: string; // ISO timestamp
  name: string;
  email: string;
  summary: string;
  details: Record<string, string>;
}

const KEY = "nl-enquiries";

export function loadEnquiries(): StoredEnquiry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredEnquiry[]) : [];
  } catch {
    return [];
  }
}

export function saveEnquiry(
  entry: Omit<StoredEnquiry, "id" | "at">,
): void {
  if (typeof window === "undefined") return;
  try {
    const all = loadEnquiries();
    all.unshift({
      ...entry,
      id: Math.random().toString(36).slice(2, 10),
      at: new Date().toISOString(),
    });
    window.localStorage.setItem(KEY, JSON.stringify(all.slice(0, 100)));
  } catch {
    // storage full / blocked — the email path already succeeded, so ignore
  }
}

export function clearEnquiries(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
