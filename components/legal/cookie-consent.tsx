"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getConsent, setConsent } from "@/lib/cookie-consent";
import { useI18n } from "@/lib/i18n";

/** Footer (or anywhere) can re-open the banner by dispatching this event. */
export const OPEN_COOKIE_SETTINGS = "nl-open-cookie-settings";

/**
 * Cookie consent banner (152-ФЗ). Appears on first visit so analytics never
 * load before the visitor decides. "Accept all" enables analytics cookies;
 * "Necessary only" keeps strictly-necessary cookies only. The choice is
 * remembered; visitors can change it later via the footer link.
 */
export function CookieConsent() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // show only when no decision has been recorded yet
    if (getConsent() === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS, reopen);
  }, []);

  const choose = (choice: "accepted" | "rejected") => {
    setConsent(choice);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-label={t.cookie.title}
          className="fixed inset-x-3 bottom-3 z-[120] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-md"
        >
          <div className="glass-dark rounded-2xl border border-cream/14 p-5 shadow-float sm:p-6">
            <p className="font-serif text-lg tracking-tight text-cream">
              {t.cookie.title}
            </p>
            <p className="mt-2 text-[0.86rem] leading-relaxed text-cream-dim">
              {t.cookie.body}{" "}
              <Link
                href="/privacy"
                className="text-gold-soft underline-offset-2 hover:underline"
              >
                {t.cookie.policyLink}
              </Link>
              .
            </p>
            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={() => choose("accepted")}
                className="order-1 cursor-pointer rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-ink shadow-soft transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
              >
                {t.cookie.accept}
              </button>
              <button
                type="button"
                onClick={() => choose("rejected")}
                className="order-2 cursor-pointer rounded-full border border-cream/20 px-5 py-2.5 text-sm text-cream-dim transition-colors duration-300 hover:border-gold/50 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
              >
                {t.cookie.reject}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
