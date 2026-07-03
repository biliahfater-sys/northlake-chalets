"use client";

import { useEffect, useState } from "react";

/**
 * Cookie-согласие по 152-ФЗ / трактовке Роскомнадзора.
 *
 * Технические (строго необходимые) cookie работают всегда. Аналитические
 * cookie подключаются только после явного согласия посетителя ("accepted").
 * Выбор хранится в localStorage и транслируется событием, чтобы баннер и
 * компонент аналитики оставались синхронными без перезагрузки страницы.
 */
export type ConsentChoice = "accepted" | "rejected" | null;

const KEY = "nl-cookie-consent";
const EVENT = "nl-cookie-consent-change";

export function getConsent(): ConsentChoice {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(choice: Exclude<ConsentChoice, null>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, choice);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: choice }));
  } catch {
    // storage blocked — nothing else we can safely do
  }
}

/** Reactive consent state; updates when the choice changes in this tab. */
export function useCookieConsent(): ConsentChoice {
  const [choice, setChoice] = useState<ConsentChoice>(null);

  useEffect(() => {
    setChoice(getConsent());
    const onChange = () => setChoice(getConsent());
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return choice;
}
