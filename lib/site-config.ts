/**
 * SITE CONFIG — the single file a buyer edits to rebrand the template.
 * Every component reads brand copy, contacts, and coordinates from here;
 * villa inventory lives in `features/villas/data.ts`, design tokens in
 * `app/globals.css` (@theme), imagery paths in `lib/media.ts`.
 */
export const SITE = {
  /** Brand */
  name: "Northlake",
  nameSuffix: "Chalets",
  tagline: "Private alpine residences",
  description:
    "A private platform for premium chalet acquisitions, lakefront villas, and mountain real-estate investments. Curated alpine residences where silence feels expensive.",

  /** Canonical production URL (no trailing slash). */
  url: "https://northlake.estate",

  /** Contact */
  email: "advisors@northlake.estate",

  /** Place identity */
  region: "Valais — Switzerland",
  coordinates: "46°26′ N · 7°39′ E",
  locations: ["Valais", "Graubünden", "Bern"],
  established: 2014,

  /** Headline facts shown in the hero ledger. */
  facts: [
    { value: "€120M+", label: "Portfolio value" },
    { value: "34", label: "Private residences" },
    { value: "12", label: "Alpine locations" },
    { value: "Private", label: "Access only" },
  ],

  /** Marquee ribbon entries. */
  places: [
    "Valais",
    "Graubünden",
    "Bern",
    "Lac Léman",
    "Zermatt",
    "St. Moritz",
    "Gstaad",
    "Interlaken",
  ],

  /* --------------------------------------------------------------------------
   * ОПЕРАТОР ПЕРСОНАЛЬНЫХ ДАННЫХ (152-ФЗ)
   * --------------------------------------------------------------------------
   * ⚠️ ОБЯЗАТЕЛЬНО ЗАПОЛНИТЕ реальными реквизитами оператора (того лица —
   * ООО / ИП / физлица, — которое фактически собирает данные через сайт).
   * Эти значения подставляются в Политику обработки ПДн, в Согласие на
   * обработку ПДн и в cookie-баннер. Пустые/демо-значения = нарушение РКН.
   *
   * Перед публичным запуском также необходимо (вне кода):
   *   1) Подать уведомление об обработке ПДн в Роскомнадзор
   *      (https://pd.rkn.gov.ru) — иначе штраф 1–3 млн ₽ (с 30.05.2025).
   *   2) Обеспечить первичную запись/хранение ПДн граждан РФ в БД на
   *      территории РФ (ст. 18 ч. 5). См. файл 152-FZ-COMPLIANCE.md.
   * ------------------------------------------------------------------------- */
  operator: {
    /** Полное юридическое наименование оператора. */
    legalName: "ООО «Нортлейк»",
    /** Краткое наименование / бренд. */
    shortName: "Northlake",
    /** ОГРН / ОГРНИП. */
    ogrn: "0000000000000",
    /** ИНН. */
    inn: "0000000000",
    /** Юридический (почтовый) адрес для обращений субъектов ПДн. */
    address: "Россия, 000000, г. Москва, ул. Примерная, д. 1, оф. 1",
    /** E-mail для запросов по персональным данным (отзыв согласия, доступ, удаление). */
    privacyEmail: "privacy@northlake.estate",
    /** Телефон оператора (необязательно, но желательно). */
    phone: "+7 (000) 000-00-00",
    /** Ф. И. О. лица, ответственного за организацию обработки ПДн (ст. 22.1). */
    responsiblePerson: "—",
    /**
     * Иностранные государства, на территорию которых может осуществляться
     * трансграничная передача ПДн (например, при ответе советника из Швейцарии
     * и доставке писем через зарубежного провайдера). Требует отдельного
     * согласия и уведомления РКН (ст. 12).
     */
    crossBorderCountries: ["Швейцария", "Европейский союз", "США"],
    /** Дата последней редакции правовых документов. */
    documentsUpdated: { ru: "Июнь 2026", en: "June 2026" },
  },
} as const;
