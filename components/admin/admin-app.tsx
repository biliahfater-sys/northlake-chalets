"use client";

import {
  ArrowLeft,
  FolderLock,
  Inbox,
  KeyRound,
  LayoutGrid,
  MessageCircleQuestion,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FAQ } from "@/features/content/faq";
import { villas } from "@/features/villas/data";
import {
  clearEnquiries,
  loadEnquiries,
  type StoredEnquiry,
} from "@/lib/enquiries";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Back office — the same visual language as the Northlake OS plate, full
 * screen. Demo passcode gate (sessionStorage), enquiries from localStorage,
 * in-browser content management for residence status. Swap the storage layer
 * for a real API when one exists; the UI is already shaped for it.
 * ------------------------------------------------------------------------- */

const GATE_KEY = "nl-admin";
const STATUS_KEY = "nl-villa-status";

const SEED: StoredEnquiry[] = [
  {
    id: "seed-1",
    kind: "viewing",
    at: "2026-06-08T09:12:00Z",
    name: "M. Keller",
    email: "m.keller@example.ch",
    summary: "Private viewing · Maison Lac Clair · €8M – €12M",
    details: { Message: "Interested in a viewing late June, ideally a weekend." },
  },
  {
    id: "seed-2",
    kind: "dossier",
    at: "2026-06-06T15:40:00Z",
    name: "L. Forrer",
    email: "l.forrer@example.ch",
    summary: "Private dossier · Domaine Belvedère · €12M – €20M",
    details: { Region: "Valais", Timeline: "This season", Contact: "Phone · +41 79 000 00 00" },
  },
];

type Pane = "enquiries" | "residences" | "faq";

const PANES: { id: Pane; label: string; icon: typeof Inbox }[] = [
  { id: "enquiries", label: "Enquiries", icon: Inbox },
  { id: "residences", label: "Residences", icon: LayoutGrid },
  { id: "faq", label: "FAQ", icon: MessageCircleQuestion },
];

export function AdminApp() {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(GATE_KEY) === "1");
    setReady(true);
  }, []);

  if (!ready) return <div className="min-h-screen bg-pine-deep" />;

  return (
    <div className="relative min-h-screen bg-pine-deep text-cream">
      <span className="grain-overlay fixed" aria-hidden />
      <AnimatePresence mode="wait">
        {unlocked ? (
          <Dashboard key="dash" />
        ) : (
          <Gate key="gate" onUnlock={() => setUnlocked(true)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---- passcode gate -------------------------------------------------------- */

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: code.trim() }),
      });
      if (res.ok) {
        sessionStorage.setItem(GATE_KEY, "1");
        onUnlock();
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(
        res.status === 503
          ? body?.error ?? "Back office is disabled in this build."
          : res.status === 429
            ? "Too many attempts — wait a minute and try again."
            : "That's not it — try again.",
      );
    } catch {
      setError("Connection problem — try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 flex min-h-screen items-center justify-center px-5"
    >
      <div className="w-full max-w-sm">
        <div className="glass-dark rounded-2xl border border-cream/14 p-8 shadow-float">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold-soft">
            <KeyRound className="h-5 w-5" />
          </span>
          <h1 className="mt-6 font-serif text-2xl font-light tracking-tight">
            Back office
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-cream-dim">
            Advisors only. Enter the desk passcode to continue.
          </p>
          <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
            <input
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(null);
              }}
              placeholder="Passcode"
              aria-label="Passcode"
              autoComplete="current-password"
              autoFocus
              className={cn(
                "h-12 w-full rounded-lg border bg-cream/[0.06] px-4 text-sm text-cream transition-colors duration-300 placeholder:text-cream-faint/70 focus:outline-none focus:ring-2 focus:ring-gold/50",
                error ? "border-gold/60" : "border-cream/15 focus:border-gold/50",
              )}
            />
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-gold-soft"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <button
              type="submit"
              disabled={busy}
              className="h-12 cursor-pointer rounded-full bg-gold text-sm font-medium text-ink transition-colors duration-300 hover:bg-gold-soft disabled:opacity-50"
            >
              {busy ? "Checking…" : "Enter"}
            </button>
          </form>
          <p className="mt-4 text-center text-[0.7rem] text-cream-faint">
            Access is provisioned by the desk. The passcode is configured
            server-side and never published.
          </p>
        </div>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-sm text-cream-faint transition-colors hover:text-cream"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to the site
        </Link>
      </div>
    </motion.div>
  );
}

/* ---- dashboard ------------------------------------------------------------ */

function Dashboard() {
  const [pane, setPane] = useState<Pane>("enquiries");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 mx-auto max-w-6xl px-5 py-10 sm:px-8"
    >
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="eyebrow text-gold-soft">Northlake OS</span>
          <h1 className="mt-1 font-serif text-3xl font-light tracking-tight">
            Back office
          </h1>
        </div>
        <Link
          href="/"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-cream/20 px-4 text-sm text-cream-dim transition-colors duration-300 hover:border-cream/50 hover:text-cream"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> View site
        </Link>
      </header>

      <nav className="mt-8 flex gap-1 overflow-x-auto rounded-full border border-cream/12 bg-cream/[0.04] p-1 sm:inline-flex">
        {PANES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setPane(id)}
            aria-current={pane === id ? "page" : undefined}
            className={cn(
              "relative flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors duration-300",
              pane === id ? "text-ink" : "text-cream-faint hover:text-cream",
            )}
          >
            {pane === id && (
              <motion.span
                layoutId="nl-admin-tab"
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 rounded-full bg-gold"
                aria-hidden
              />
            )}
            <Icon className="relative h-3.5 w-3.5" />
            <span className="relative">{label}</span>
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pane}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8"
        >
          {pane === "enquiries" && <EnquiriesPane />}
          {pane === "residences" && <ResidencesPane />}
          {pane === "faq" && <FaqPane />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/* ---- enquiries ------------------------------------------------------------ */

function EnquiriesPane() {
  const [rows, setRows] = useState<StoredEnquiry[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setRows([...loadEnquiries(), ...SEED]);
  }, []);

  const wipe = () => {
    clearEnquiries();
    setRows(SEED);
  };

  return (
    <Plate
      title={`Enquiries · ${rows.length}`}
      action={
        <button
          type="button"
          onClick={wipe}
          className="inline-flex cursor-pointer items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.16em] text-cream-faint transition-colors hover:text-gold-soft"
        >
          <Trash2 className="h-3 w-3" /> Clear local
        </button>
      }
    >
      {rows.length === 0 && (
        <p className="px-5 py-10 text-center text-sm text-cream-faint">
          No enquiries yet — submit a form on the site and it appears here.
        </p>
      )}
      {rows.map((r) => (
        <div key={r.id} className="border-cream/8 border-b last:border-0">
          <button
            type="button"
            onClick={() => setExpanded(expanded === r.id ? null : r.id)}
            aria-expanded={expanded === r.id}
            className="grid w-full cursor-pointer grid-cols-[5.5rem_minmax(0,1fr)_6rem] items-center gap-3 px-5 py-4 text-left transition-colors duration-300 hover:bg-cream/[0.04] sm:grid-cols-[5.5rem_minmax(0,1fr)_minmax(0,1fr)_6rem]"
          >
            <span
              className={cn(
                "inline-flex justify-self-start rounded-full border px-2.5 py-0.5 text-[0.58rem] uppercase tracking-[0.12em]",
                r.kind === "dossier"
                  ? "border-gold/40 text-gold-soft"
                  : "border-emerald-300/30 text-emerald-300/90",
              )}
            >
              {r.kind}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[0.88rem] text-cream">{r.name}</span>
              <span className="block truncate text-[0.72rem] text-cream-faint">{r.email}</span>
            </span>
            <span className="hidden truncate text-[0.8rem] text-cream-dim sm:block">
              {r.summary}
            </span>
            <span className="text-right text-[0.72rem] text-cream-faint tnum">
              {new Date(r.at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          </button>
          <AnimatePresence initial={false}>
            {expanded === r.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <dl className="flex flex-col gap-2 bg-cream/[0.03] px-5 py-4 sm:hidden">
                  <Detail k="Summary" v={r.summary} />
                </dl>
                <dl className="flex flex-col gap-2 bg-cream/[0.03] px-5 py-4">
                  {Object.entries(r.details).map(([k, v]) => (
                    <Detail key={k} k={k} v={v} />
                  ))}
                </dl>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </Plate>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[6rem_1fr] gap-3 text-[0.8rem]">
      <span className="text-[0.62rem] uppercase tracking-[0.16em] text-cream-faint">
        {k}
      </span>
      <span className="text-cream-dim">{v}</span>
    </div>
  );
}

/* ---- residences ------------------------------------------------------------ */

const STATUSES = ["available", "reserved", "private"] as const;

function ResidencesPane() {
  // status overrides persist per browser — a stand-in for a real DB write
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STATUS_KEY);
      if (raw) setOverrides(JSON.parse(raw));
    } catch {}
  }, []);

  const setStatus = (id: string, status: string) => {
    const next = { ...overrides, [id]: status };
    setOverrides(next);
    try {
      localStorage.setItem(STATUS_KEY, JSON.stringify(next));
    } catch {}
  };

  return (
    <Plate title={`Residences · ${villas.length}`}>
      {villas.map((v) => {
        const status = overrides[v.id] ?? v.availability;
        return (
          <div
            key={v.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-cream/8 border-b px-5 py-4 last:border-0 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto]"
          >
            <span className="min-w-0">
              <span className="block truncate text-[0.88rem] text-cream">{v.name}</span>
              <span className="block truncate text-[0.72rem] text-cream-faint">
                {v.location}
              </span>
            </span>
            <span className="hidden whitespace-nowrap text-[0.82rem] text-cream-dim tnum sm:block">
              {v.priceRange}
            </span>
            <span className="flex gap-1">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={status === s}
                  onClick={() => setStatus(v.id, s)}
                  className={cn(
                    "cursor-pointer rounded-full border px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.1em] transition-colors duration-300",
                    status === s
                      ? "border-gold/60 bg-gold/15 text-gold-soft"
                      : "border-cream/12 text-cream-faint hover:border-cream/30 hover:text-cream-dim",
                  )}
                >
                  {s}
                </button>
              ))}
            </span>
          </div>
        );
      })}
      <p className="px-5 py-4 text-[0.72rem] leading-relaxed text-cream-faint">
        Inventory lives in <code className="text-gold-soft">features/villas/data.ts</code>;
        status changes here persist in this browser as a demo of the editing flow.
      </p>
    </Plate>
  );
}

/* ---- faq ------------------------------------------------------------------- */

function FaqPane() {
  return (
    <Plate title={`FAQ · ${FAQ.length} items`}>
      {FAQ.map((f, i) => (
        <div key={f.q} className="flex gap-4 border-cream/8 border-b px-5 py-4 last:border-0">
          <span className="shrink-0 text-[0.7rem] text-cream-faint tnum">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <p className="text-[0.88rem] text-cream">{f.q}</p>
            <p className="mt-1 line-clamp-2 text-[0.78rem] leading-relaxed text-cream-faint">
              {f.a}
            </p>
          </div>
        </div>
      ))}
      <p className="px-5 py-4 text-[0.72rem] leading-relaxed text-cream-faint">
        Answers live in <code className="text-gold-soft">features/content/faq.ts</code> —
        edit the array and both the site section and this list update.
      </p>
    </Plate>
  );
}

/* ---- shared plate ----------------------------------------------------------- */

function Plate({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-cream/12 bg-[#0a110d]/90 shadow-float">
      <div className="flex h-12 items-center justify-between border-cream/10 border-b px-5">
        <span className="flex items-center gap-2.5">
          <FolderLock className="h-3.5 w-3.5 text-gold-soft" aria-hidden />
          <span className="eyebrow text-cream-faint">{title}</span>
        </span>
        {action}
      </div>
      {children}
    </div>
  );
}
