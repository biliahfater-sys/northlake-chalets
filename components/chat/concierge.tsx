"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Msg {
  id: number;
  from: "concierge" | "visitor";
  text: string;
}

const GREETING: Msg = {
  id: 0,
  from: "concierge",
  text: "Good evening — you've reached the Northlake desk. How may we help? Viewings, dossiers, or the platform — ask anything.",
};

const REPLY =
  "Thank you — your message has reached a senior advisor. We reply within the hour during Valais business hours, and always within one business day.";

/**
 * Concierge — a quiet floating chat in the corner. No backend yet: messages
 * are acknowledged with an honest "an advisor has been notified" state, and
 * the thread survives reopening within the visit (sessionStorage).
 */
export function Concierge() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [seen, setSeen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // restore thread within the visit
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("nl-concierge");
      if (raw) setMessages(JSON.parse(raw) as Msg[]);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem("nl-concierge", JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // keep the latest message in view
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, messages, typing]);

  // esc closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = () => {
    const text = draft.trim();
    if (!text || typing) return;
    setDraft("");
    setMessages((m) => [...m, { id: Date.now(), from: "visitor", text }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, from: "concierge", text: REPLY },
      ]);
    }, 1400);
  };

  // the back office has its own surface — no visitor chat there
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/* launcher */}
      <motion.button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setSeen(true);
        }}
        aria-label={open ? "Close concierge chat" : "Open concierge chat"}
        aria-expanded={open}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: reduce ? 0 : 2.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed right-5 bottom-5 z-[120] flex h-13 w-13 cursor-pointer items-center justify-center rounded-full border border-gold/40 bg-pine-deep text-gold-soft shadow-float transition-all duration-500 hover:scale-105 hover:border-gold hover:text-gold sm:right-7 sm:bottom-7"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "chat"}
            initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
            transition={{ duration: 0.25 }}
            className="flex"
          >
            {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
          </motion.span>
        </AnimatePresence>
        {!open && !seen && (
          <span className="absolute top-0 right-0 flex h-3 w-3" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/50" />
            <span className="relative inline-flex h-3 w-3 rounded-full border border-pine-deep bg-gold" />
          </span>
        )}
      </motion.button>

      {/* panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            role="dialog"
            aria-label="Northlake concierge"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="glass-dark fixed inset-x-3 bottom-20 z-[119] flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-cream/14 text-cream shadow-float sm:inset-x-auto sm:right-7 sm:bottom-24 sm:w-[22.5rem]"
          >
            {/* header */}
            <div className="flex items-center justify-between border-cream/10 border-b bg-pine-deep/60 px-5 py-4">
              <div>
                <p className="font-serif text-lg leading-tight">Concierge</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[0.66rem] uppercase tracking-[0.18em] text-cream-faint">
                  <span className="relative flex h-1.5 w-1.5" aria-hidden>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300/50" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300/80" />
                  </span>
                  Advisors online · Valais desk
                </p>
              </div>
              <span className="eyebrow text-gold-soft">Northlake</span>
            </div>

            {/* thread */}
            <div
              ref={scrollRef}
              data-lenis-prevent
              className="flex min-h-[14rem] flex-1 flex-col gap-3 overflow-y-auto px-5 py-5"
            >
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-[0.86rem] leading-relaxed",
                    m.from === "concierge"
                      ? "self-start rounded-bl-sm border border-cream/10 bg-cream/[0.06] text-cream-dim"
                      : "self-end rounded-br-sm bg-gold text-ink",
                  )}
                >
                  {m.text}
                </motion.div>
              ))}
              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1.5 self-start rounded-2xl rounded-bl-sm border border-cream/10 bg-cream/[0.06] px-4 py-3.5"
                  aria-label="Concierge is typing"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={reduce ? {} : { opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
                      className="h-1.5 w-1.5 rounded-full bg-cream-faint"
                    />
                  ))}
                </motion.div>
              )}
            </div>

            {/* composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2 border-cream/10 border-t bg-pine-deep/60 p-3"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write to the desk…"
                aria-label="Message to the concierge"
                className="h-11 flex-1 rounded-full border border-cream/15 bg-cream/[0.06] px-4 text-sm text-cream transition-colors duration-300 placeholder:text-cream-faint/70 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!draft.trim() || typing}
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gold text-ink transition-all duration-300 hover:bg-gold-soft disabled:cursor-default disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
