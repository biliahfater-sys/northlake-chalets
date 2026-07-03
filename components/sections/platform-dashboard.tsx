"use client";

import {
  ArrowDownToLine,
  ArrowUpRight,
  Bell,
  CalendarDays,
  FileText,
  FolderLock,
  Lock,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { featuredVilla } from "@/features/villas/data";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * The Private Client Area — what a buyer actually receives after
 * introduction. One window, four working panes: the dossier itself, the
 * document vault, the viewing schedule, and advisor updates. Deliberately
 * not a SaaS dashboard: no metrics, no plans, no growth charts — just one
 * residence, treated carefully.
 * ------------------------------------------------------------------------- */

const TABS = [
  { id: "dossier", label: "Dossier", icon: FileText },
  { id: "documents", label: "Documents", icon: FolderLock },
  { id: "viewings", label: "Viewings", icon: CalendarDays },
  { id: "updates", label: "Updates", icon: Bell },
] as const;

type TabId = (typeof TABS)[number]["id"];

const PANE_TITLES: Record<TabId, string> = {
  dossier: "Dossier № 041",
  documents: "Documents",
  viewings: "Viewings",
  updates: "Updates",
};

const SUMMARY = [
  { value: "€11.5–12.9M", label: "Guide price" },
  { value: "520 m²", label: "Living area" },
  { value: "3,840 m²", label: "Plot" },
  { value: "6 · 7", label: "Suites · baths" },
];

const CONTENTS = [
  { name: "The film — 4 min", note: "Shot last October, evening light" },
  { name: "Floor & plot plans", note: "All levels · 1:100, with survey" },
  { name: "Yield & holding model", note: "Conservative casework, 10-year" },
  { name: "Provenance & title", note: "Single family ownership since 1987" },
];

const DOCUMENTS = [
  { name: "Non-disclosure agreement", state: "Signed", locked: false },
  { name: "Title extract — land registry", state: "Available", locked: false },
  { name: "Floor plans · all levels", state: "Available", locked: false },
  { name: "Plot & cadastre survey", state: "Available", locked: false },
  { name: "Yield model — Spring 2026", state: "Updated", locked: false },
  { name: "Energy & structural reports", state: "On request", locked: true },
];

const VIEWINGS = [
  { day: "14", mon: "Jun", name: "Domaine Belvedère", format: "On site · half day", status: "Confirmed" },
  { day: "21", mon: "Jun", name: "Crête Sud — village & shoreline", format: "With your advisor", status: "Proposed" },
  { day: "27", mon: "Jun", name: "Private film walkthrough", format: "Live, by video", status: "Optional" },
];

const UPDATES = [
  { t: "Today", body: "Yield model refreshed — letting assumptions reviewed with the estate manager." },
  { t: "Tue", body: "Owner confirms availability for a second viewing through late June." },
  { t: "Last week", body: "Floor plans re-issued at 1:100 with the survey overlaid, as requested." },
  { t: "3 Jun", body: "Dossier № 041 opened for you after NDA — welcome." },
];

export function PlatformDashboard() {
  const [tab, setTab] = useState<TabId>("dossier");
  const reduce = useReducedMotion();

  return (
    <div className="overflow-hidden rounded-2xl border border-cream/12 bg-[#0a110d]/90 shadow-float backdrop-blur-sm">
      {/* window chrome */}
      <div className="flex h-12 items-center justify-between border-cream/10 border-b px-5">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-cream/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-cream/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-gold/60" />
          </span>
          <span className="eyebrow text-cream-faint">
            Client area — {PANE_TITLES[tab]}
          </span>
        </div>
        <span className="hidden items-center gap-2 text-[0.66rem] uppercase tracking-[0.2em] text-cream-faint sm:flex">
          <Lock className="h-3 w-3 text-gold-soft/70" aria-hidden />
          By invitation
        </span>
      </div>

      {/* mobile tab strip */}
      <div
        className="flex gap-1 overflow-x-auto border-cream/10 border-b px-3 py-2 [scrollbar-width:none] lg:hidden"
        role="tablist"
        aria-label="Client area sections"
      >
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-[0.74rem] tracking-tight transition-colors duration-300",
              tab === id
                ? "border-gold/50 bg-gold/15 text-gold-soft"
                : "border-cream/12 text-cream-faint hover:border-cream/30 hover:text-cream",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[13rem_minmax(0,1fr)_minmax(0,19rem)]">
        {/* sidebar */}
        <nav
          className="hidden flex-col border-cream/10 border-r p-3 lg:flex"
          aria-label="Client area sections"
        >
          <div className="flex flex-col gap-0.5">
            {TABS.map(({ id, label, icon: Icon }) => (
              <SideItem
                key={id}
                active={tab === id}
                onClick={() => setTab(id)}
                icon={<Icon className="h-3.5 w-3.5" />}
                label={label}
              />
            ))}
          </div>
          <div className="mt-auto border-cream/10 border-t pt-3">
            <p className="px-3 text-[0.62rem] uppercase tracking-[0.18em] text-cream-faint">
              Residence
            </p>
            <p className="mt-1 px-3 text-[0.82rem] leading-snug text-cream-dim">
              {featuredVilla.name}
              <span className="block text-[0.7rem] text-cream-faint">
                {featuredVilla.location}
              </span>
            </p>
          </div>
        </nav>

        {/* main pane — fixed min height so switching never reflows the page */}
        <div className="min-h-[27rem] p-5 sm:p-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {tab === "dossier" && <DossierPane />}
              {tab === "documents" && <DocumentsPane />}
              {tab === "viewings" && <ViewingsPane />}
              {tab === "updates" && <UpdatesPane />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* advisor aside */}
        <aside className="hidden border-cream/10 border-l p-5 lg:block">
          <span className="eyebrow text-cream-faint">Your advisor</span>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/35 bg-gold/10 font-serif text-[0.95rem] text-gold-soft">
              CB
            </span>
            <div>
              <p className="text-[0.9rem] text-cream">C. Bouvier</p>
              <p className="text-[0.7rem] text-cream-faint">
                Senior advisor · Valais desk
              </p>
            </div>
          </div>
          <p className="mt-4 flex items-center gap-2 text-[0.72rem] text-cream-dim">
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300/50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300/80" />
            </span>
            Replies within hours, in season
          </p>
          <a
            href="#contact"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-full border border-cream/20 px-4 text-[0.82rem] text-cream-dim transition-colors duration-300 hover:border-gold/50 hover:text-gold-soft"
          >
            Write to the desk <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <div className="mt-6 border-cream/10 border-t pt-5">
            <p className="text-[0.72rem] leading-relaxed text-cream-faint">
              One advisor carries your acquisition end to end. Documents are
              watermarked to your name; nothing is shared onward without your
              consent.
            </p>
          </div>
        </aside>
      </div>

      {/* status bar */}
      <div className="flex h-9 items-center justify-between border-cream/10 border-t px-5 text-[0.62rem] uppercase tracking-[0.18em] text-cream-faint">
        <span>Encrypted session · documents watermarked</span>
        <span className="hidden sm:block">Swiss data residency</span>
      </div>
    </div>
  );
}

function SideItem({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex w-full cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-left text-[0.82rem] tracking-tight transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
        active ? "text-cream" : "text-cream-faint hover:bg-cream/[0.05] hover:text-cream-dim",
      )}
    >
      {active && (
        <motion.span
          layoutId="nl-portal-active"
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 rounded-md bg-cream/10"
          aria-hidden
        />
      )}
      <span
        className={cn(
          "relative transition-colors duration-300",
          active ? "text-gold-soft" : "text-cream-faint group-hover:text-cream-dim",
        )}
      >
        {icon}
      </span>
      <span className="relative">{label}</span>
    </button>
  );
}

/* ---- panes ---------------------------------------------------------------- */

function DossierPane() {
  return (
    <>
      {/* residence summary — facts, not metrics */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-cream/10 bg-cream/10 sm:grid-cols-4">
        {SUMMARY.map((k) => (
          <div key={k.label} className="flex h-24 flex-col justify-center bg-[#0c130f] px-4">
            <span className="whitespace-nowrap font-serif text-[1.35rem] font-light text-cream tnum sm:text-[1.5rem]">
              {k.value}
            </span>
            <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.16em] text-cream-faint">
              {k.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-gold/25 bg-gold/[0.06] px-4 py-3">
        <span className="text-[0.82rem] text-cream-dim">
          {featuredVilla.name} · {featuredVilla.location}
        </span>
        <span className="whitespace-nowrap rounded-full border border-gold/40 px-2.5 py-0.5 text-[0.58rem] uppercase tracking-[0.12em] text-gold-soft">
          Reserved · waitlist open
        </span>
      </div>

      {/* what the dossier holds */}
      <div className="mt-5 overflow-hidden rounded-lg border border-cream/10">
        {CONTENTS.map((c) => (
          <div
            key={c.name}
            className="grid h-13 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-cream/8 border-b px-4 transition-colors duration-300 last:border-0 hover:bg-cream/[0.04]"
          >
            <span className="min-w-0">
              <span className="block truncate text-[0.86rem] text-cream">{c.name}</span>
            </span>
            <span className="truncate text-right text-[0.72rem] text-cream-faint">
              {c.note}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function DocumentsPane() {
  return (
    <div className="overflow-hidden rounded-lg border border-cream/10">
      {DOCUMENTS.map((d) => (
        <div
          key={d.name}
          className="grid h-13 grid-cols-[minmax(0,1fr)_5.5rem_2.5rem] items-center gap-3 border-cream/8 border-b px-4 transition-colors duration-300 last:border-0 hover:bg-cream/[0.04]"
        >
          <span className="truncate text-[0.86rem] text-cream">{d.name}</span>
          <span
            className={cn(
              "justify-self-end whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[0.58rem] uppercase tracking-[0.12em]",
              d.state === "Signed"
                ? "border-emerald-300/30 text-emerald-300/90"
                : d.locked
                  ? "border-cream/20 text-cream-faint"
                  : "border-gold/35 text-gold-soft",
            )}
          >
            {d.state}
          </span>
          <button
            type="button"
            aria-label={d.locked ? `${d.name} — on request` : `Download ${d.name}`}
            disabled={d.locked}
            className={cn(
              "flex h-8 w-8 items-center justify-center justify-self-end rounded-full border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
              d.locked
                ? "border-cream/10 text-cream-faint/50"
                : "cursor-pointer border-cream/15 text-cream-faint hover:border-gold/50 hover:text-gold-soft",
            )}
          >
            {d.locked ? (
              <Lock className="h-3 w-3" />
            ) : (
              <ArrowDownToLine className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      ))}
      <p className="border-cream/8 border-t px-4 py-3 text-[0.7rem] leading-relaxed text-cream-faint">
        Every file carries your personal watermark. Forwarding is disabled;
        share access is granted only through your advisor.
      </p>
    </div>
  );
}

function ViewingsPane() {
  return (
    <div className="overflow-hidden rounded-lg border border-cream/10">
      {VIEWINGS.map((v) => (
        <div
          key={v.name}
          className="grid h-15 grid-cols-[3rem_minmax(0,1fr)_5.5rem] items-center gap-3 border-cream/8 border-b px-4 transition-colors duration-300 last:border-0 hover:bg-cream/[0.04]"
        >
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[1.05rem] text-cream tnum">{v.day}</span>
            <span className="mt-0.5 text-[0.58rem] uppercase tracking-[0.14em] text-cream-faint">
              {v.mon}
            </span>
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[0.86rem] text-cream">{v.name}</span>
            <span className="block truncate text-[0.72rem] text-cream-faint">{v.format}</span>
          </span>
          <span
            className={cn(
              "justify-self-end whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[0.58rem] uppercase tracking-[0.12em]",
              v.status === "Confirmed"
                ? "border-emerald-300/30 text-emerald-300/90"
                : v.status === "Proposed"
                  ? "border-gold/40 text-gold-soft"
                  : "border-cream/25 text-cream-dim",
            )}
          >
            {v.status}
          </span>
        </div>
      ))}
      <p className="border-cream/8 border-t px-4 py-3 text-[0.7rem] leading-relaxed text-cream-faint">
        Travel, keys, and timing are handled by the desk. Helicopter transfer
        from Geneva or Zürich can be arranged in season.
      </p>
    </div>
  );
}

function UpdatesPane() {
  return (
    <div className="overflow-hidden rounded-lg border border-cream/10">
      {UPDATES.map((u) => (
        <div key={u.body} className="border-cream/8 border-b px-4 py-4 last:border-0">
          <span className="text-[0.62rem] uppercase tracking-[0.16em] text-gold-soft">
            {u.t}
          </span>
          <p className="mt-1 text-[0.84rem] leading-relaxed text-cream-dim">{u.body}</p>
        </div>
      ))}
    </div>
  );
}
