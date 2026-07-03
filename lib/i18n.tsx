"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

/* ----------------------------------------------------------------------------
 * Lightweight i18n for the primary buyer flow: navigation, hero, footer,
 * and the enquiry form. Editorial chapters remain English by design — a
 * bilingual luxury voice — and can be added to the dictionary chapter by
 * chapter as translations are approved. No URL change, no middleware: the
 * choice persists per visitor in localStorage.
 * ------------------------------------------------------------------------- */

export type Lang = "en" | "ru";

const STORAGE_KEY = "nl-lang";

const en = {
  nav: {
    collection: "Collection",
    estate: "Estate",
    investment: "Investment",
    platform: "Client area",
    contact: "Contact",
    viewing: "Private viewing",
    requestViewing: "Request private viewing",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    eyebrow: "The Alpine Lake Collection — Est. 2014",
    l1: "Alpine residences",
    l2pre: "where",
    l2accent: "silence",
    l3: "feels expensive.",
    sub: "A private platform for premium chalet acquisitions, lakefront villas, and mountain real-estate investments — curated, discreet, by introduction.",
    ctaCollection: "Explore the collection",
    ctaViewing: "Private viewing",
    factLabels: [
      "Portfolio value",
      "Private residences",
      "Alpine locations",
      "Access only",
    ],
    scroll: "Scroll",
  },
  footer: {
    taglineA: "Quiet estates,",
    taglineB: "measured carefully.",
    blurb:
      "A private platform for premium chalet acquisitions across the alpine lakes. By appointment, and by introduction.",
    explore: "Explore",
    contact: "Contact",
    legal: "Legal",
    locations: "Locations",
    viewing: "Private viewing",
    portfolio: "Request portfolio",
    privacy: "Privacy policy",
    consent: "Data consent",
    terms: "Terms of engagement",
    mandate: "The mandate",
    cookies: "Cookie settings",
  },
  contact: {
    eyebrow: "The last page",
    hA: "Begin where the",
    hB: "evening is",
    hAccent: "quietest.",
    sub: "Tell us what you're looking for. We'll answer with three residences, a season to see them in, and nothing you didn't ask for.",
    assurances: [
      {
        title: "Response",
        body: "A senior advisor replies within one business day — never a mailing list.",
      },
      {
        title: "Viewings",
        body: "On site in Valais, or privately by film. Travel arranged end to end.",
      },
      {
        title: "Discretion",
        body: "Your enquiry exists only between you and your advisor.",
      },
    ],
  },
  form: {
    fullName: "Full name",
    namePlaceholder: "Your name",
    email: "Email",
    phone: "Phone (optional)",
    replyBy: "Reply by",
    residence: "Residence of interest",
    region: "Preferred region",
    timeline: "Buying timeline",
    budget: "Budget range",
    request: "What shall we prepare first?",
    message: "Message (optional)",
    messagePlaceholder:
      "Anything that helps us prepare — party size, season, intent.",
    consentA: "I give my consent to the processing of my personal data to handle this enquiry, and confirm that I have read the",
    consentLink: "Privacy Policy",
    consentMid: "and",
    consentLink2: "Consent to Personal Data Processing",
    consentB: ". No mailing lists, no third parties.",
    submit: "Send the enquiry",
    sending: "Sending…",
    note: "Confidential. Reviewed by a senior advisor, never an inbox queue.",
    successTitle: "Received, quietly.",
    successBody:
      "Your enquiry is with a senior advisor — not a mailing list. Expect a personal reply within one business day, by the method you chose.",
    sendAnother: "Send another enquiry",
    errorBody:
      "Something went wrong sending your enquiry. Please try again in a moment, or write to us directly.",
  },
  cookie: {
    title: "Cookies & personal data",
    body: "We use strictly necessary cookies to run the site and, with your consent, analytics cookies to improve it. See the",
    policyLink: "Privacy Policy",
    accept: "Accept all",
    reject: "Necessary only",
    settings: "Cookie settings",
  },
};

export type Dict = typeof en;

const ru: Dict = {
  nav: {
    collection: "Коллекция",
    estate: "Резиденция",
    investment: "Инвестиции",
    platform: "Кабинет",
    contact: "Контакт",
    viewing: "Частный показ",
    requestViewing: "Запросить частный показ",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
  },
  hero: {
    eyebrow: "Коллекция альпийских озёр — с 2014 года",
    l1: "Альпийские резиденции,",
    l2pre: "где",
    l2accent: "тишина",
    l3: "стоит дорого.",
    sub: "Частная платформа премиальных приобретений: шале, виллы у воды и горная недвижимость. Закрытый портфель — по знакомству, без публичных листингов.",
    ctaCollection: "Смотреть коллекцию",
    ctaViewing: "Частный показ",
    factLabels: [
      "Стоимость портфеля",
      "Частных резиденций",
      "Альпийских локаций",
      "Только по приглашению",
    ],
    scroll: "Листайте",
  },
  footer: {
    taglineA: "Тихие резиденции,",
    taglineB: "выверенные точно.",
    blurb:
      "Частная платформа премиальных приобретений на альпийских озёрах. По записи — и по рекомендации.",
    explore: "Разделы",
    contact: "Связь",
    legal: "Правовое",
    locations: "Локации",
    viewing: "Частный показ",
    portfolio: "Запросить портфолио",
    privacy: "Политика обработки ПДн",
    consent: "Согласие на обработку ПДн",
    terms: "Условия сотрудничества",
    mandate: "Мандат",
    cookies: "Настройки cookie",
  },
  contact: {
    eyebrow: "Последняя страница",
    hA: "Начните там,",
    hB: "где вечер",
    hAccent: "тише всего.",
    sub: "Расскажите, что вы ищете. В ответ — две-три резиденции, сезон, в который их стоит увидеть, и ничего лишнего.",
    assurances: [
      {
        title: "Ответ",
        body: "Старший советник отвечает в течение одного рабочего дня — лично, не рассылкой.",
      },
      {
        title: "Показы",
        body: "На месте в Вале или частным фильмом. Дорогу и логистику берём на себя.",
      },
      {
        title: "Конфиденциальность",
        body: "Ваш запрос существует только между вами и вашим советником.",
      },
    ],
  },
  form: {
    fullName: "Имя и фамилия",
    namePlaceholder: "Ваше имя",
    email: "Email",
    phone: "Телефон (необязательно)",
    replyBy: "Как ответить",
    residence: "Интересующая резиденция",
    region: "Предпочтительный регион",
    timeline: "Горизонт покупки",
    budget: "Бюджет",
    request: "Что подготовить первым?",
    message: "Сообщение (необязательно)",
    messagePlaceholder:
      "Всё, что поможет подготовиться: состав семьи, сезон, намерение.",
    consentA: "Я даю согласие на обработку моих персональных данных для ответа на этот запрос и подтверждаю, что ознакомлен(а) с",
    consentLink: "Политикой обработки персональных данных",
    consentMid: "и",
    consentLink2: "Согласием на обработку персональных данных",
    consentB: ". Без рассылок и передачи третьим лицам в маркетинговых целях.",
    submit: "Отправить запрос",
    sending: "Отправляем…",
    note: "Конфиденциально. Запрос читает старший советник, а не общий ящик.",
    successTitle: "Принято — тихо.",
    successBody:
      "Ваш запрос у старшего советника, не в рассылке. Личный ответ — в течение одного рабочего дня, выбранным вами способом.",
    sendAnother: "Отправить ещё один запрос",
    errorBody:
      "Не получилось отправить запрос. Попробуйте ещё раз через минуту — или напишите нам напрямую.",
  },
  cookie: {
    title: "Файлы cookie и персональные данные",
    body: "Мы используем строго необходимые cookie для работы сайта и, с вашего согласия, аналитические cookie для его улучшения. Подробнее — в",
    policyLink: "Политике обработки персональных данных",
    accept: "Принять все",
    reject: "Только необходимые",
    settings: "Настройки cookie",
  },
};

const DICTS: Record<Lang, Dict> = { en, ru };

interface I18nValue {
  lang: Lang;
  t: Dict;
  setLang: (lang: Lang) => void;
}

const I18nContext = createContext<I18nValue>({
  lang: "en",
  t: en,
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "ru" || stored === "en") setLangState(stored);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }, []);

  return (
    <I18nContext.Provider value={{ lang, t: DICTS[lang], setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
