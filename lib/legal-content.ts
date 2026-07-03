/**
 * Правовые документы по 152-ФЗ «О персональных данных».
 *
 * Здесь собраны два документа — Политика обработки персональных данных
 * (ст. 18.1 ч. 2) и Согласие на обработку персональных данных (ст. 9) —
 * на русском (юридически основная версия для РКН) и английском языках.
 *
 * Реквизиты оператора, перечень стран трансграничной передачи и дата
 * редакции берутся из `SITE.operator` — правьте их там, а не здесь.
 */
import { SITE } from "@/lib/site-config";
import type { Lang } from "@/lib/i18n";
import type { LegalSection } from "@/components/layout/legal-page";

const OP = SITE.operator;
const countries = OP.crossBorderCountries.join(", ");

export interface LegalDocument {
  eyebrow: string;
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
}

/* -------------------------------------------------------------------------- */
/*  ПОЛИТИКА ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ                                     */
/* -------------------------------------------------------------------------- */

const privacyRu: LegalDocument = {
  eyebrow: `${OP.shortName} — правовая информация`,
  title: "Политика обработки персональных данных",
  updated: OP.documentsUpdated.ru,
  sections: [
    {
      title: "Общие положения",
      body: [
        `Настоящая Политика обработки персональных данных (далее — «Политика») составлена в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по обеспечению их безопасности, предпринимаемые оператором.`,
        `Оператор: ${OP.legalName} (ОГРН ${OP.ogrn}, ИНН ${OP.inn}), адрес: ${OP.address}. Контакт по вопросам обработки персональных данных: ${OP.privacyEmail}${OP.phone && OP.phone !== "+7 (000) 000-00-00" ? `, ${OP.phone}` : ""}.`,
        `Оператор ставит своей важнейшей целью соблюдение прав и свобод человека и гражданина при обработке его персональных данных, в том числе защиты прав на неприкосновенность частной жизни, личную и семейную тайну. Используя сайт ${SITE.url}, посетитель подтверждает согласие с настоящей Политикой.`,
      ],
    },
    {
      title: "Основные понятия",
      body: [
        `Персональные данные — любая информация, относящаяся к прямо или косвенно определённому или определяемому физическому лицу (субъекту персональных данных). Обработка персональных данных — любое действие или совокупность действий с персональными данными (сбор, запись, систематизация, накопление, хранение, уточнение, использование, передача, обезличивание, блокирование, удаление, уничтожение).`,
        `Оператор — лицо, самостоятельно или совместно с другими лицами организующее и (или) осуществляющее обработку персональных данных. Субъект персональных данных — посетитель сайта, направивший заявку или иным образом передавший свои данные оператору.`,
      ],
    },
    {
      title: "Какие данные мы обрабатываем",
      body: [
        `Оператор обрабатывает только те данные, которые субъект самостоятельно указывает в форме заявки на сайте: фамилию и имя; адрес электронной почты; номер телефона (по желанию); предпочтительный способ связи; интересующую резиденцию и регион; ориентировочный бюджет и горизонт покупки; текст сообщения.`,
        `Также автоматически могут обрабатываться технические данные, передаваемые браузером: IP-адрес, файлы cookie, сведения об устройстве и браузере, данные о действиях на сайте. Состав cookie и порядок управления ими описаны в разделе «Файлы cookie».`,
        `Оператор не обрабатывает специальные категории персональных данных (раса, национальность, политические взгляды, религиозные убеждения, состояние здоровья, интимная жизнь) и биометрические персональные данные.`,
      ],
    },
    {
      title: "Цели обработки",
      body: [
        `Персональные данные обрабатываются исключительно для обработки заявки субъекта и связи с ним: подготовки досье по резиденциям, согласования дат частного показа, проведения консультаций и ответа на обращение выбранным субъектом способом.`,
        `Оператор не использует персональные данные для рассылок рекламного характера и не передаёт их третьим лицам в маркетинговых целях.`,
      ],
    },
    {
      title: "Правовые основания обработки",
      body: [
        `Правовым основанием обработки является согласие субъекта персональных данных, выражаемое путём проставления отметки в форме заявки и направления заявки (п. 1 ч. 1 ст. 6, ст. 9 152-ФЗ), а также договор, стороной которого является субъект, и законные интересы оператора в пределах, допустимых законом.`,
        `Обработка осуществляется на основании настоящей Политики и Согласия на обработку персональных данных, размещённого на сайте.`,
      ],
    },
    {
      title: "Условия обработки и доступ к данным",
      body: [
        `Обработка персональных данных осуществляется с соблюдением принципов и правил, предусмотренных 152-ФЗ, с согласия субъекта и в объёме, необходимом для достижения заявленных целей.`,
        `Доступ к данным имеет только советник, ведущий обращение, а также — в части, необходимой для доставки сообщений, — провайдер транзакционной электронной почты. Данные не продаются и не раскрываются собственникам объектов или иным третьим лицам без явного письменного согласия субъекта.`,
      ],
    },
    {
      title: "Трансграничная передача",
      body: [
        `Поскольку оператор оказывает услуги в отношении зарубежной недвижимости, обработка может включать трансграничную передачу персональных данных на территорию иностранных государств: ${countries}. Передача осуществляется только при наличии отдельного согласия субъекта и с уведомлением Роскомнадзора в порядке ст. 12 152-ФЗ.`,
        `Оператор принимает меры к тому, чтобы иностранная сторона обеспечивала адекватную защиту прав субъектов персональных данных.`,
      ],
    },
    {
      title: "Сроки хранения",
      body: [
        `Персональные данные хранятся не дольше, чем этого требуют цели обработки. Записи по состоявшемуся взаимодействию хранятся в течение срока сотрудничества и установленного законом срока хранения, после чего удаляются. Если сотрудничество не последовало, заявка удаляется из активных систем в течение двенадцати месяцев.`,
        `Согласие на обработку персональных данных действует до достижения целей обработки либо до его отзыва субъектом.`,
      ],
    },
    {
      title: "Права субъекта персональных данных",
      body: [
        `Субъект вправе: получать сведения об обработке своих данных; требовать уточнения, блокирования или удаления данных, если они неполны, устарели, неточны, получены незаконно или не нужны для заявленной цели; отозвать согласие на обработку; обжаловать действия оператора в Роскомнадзоре или в судебном порядке.`,
        `Для реализации прав или отзыва согласия направьте обращение на ${OP.privacyEmail} либо по адресу: ${OP.address}. Оператор ответит в срок не позднее тридцати дней.`,
      ],
    },
    {
      title: "Файлы cookie",
      body: [
        `Сайт использует файлы cookie. Технические (строго необходимые) cookie обеспечивают работу сайта и сохранение ваших настроек (например, выбор языка и решение по cookie) — они устанавливаются без отдельного согласия. Аналитические cookie помогают понять, как используется сайт; они подключаются только после вашего согласия в баннере cookie.`,
        `Вы можете отказаться от необязательных cookie в баннере при первом посещении, а также изменить выбор позже через настройки своего браузера. Отказ от аналитических cookie не влияет на возможность отправить заявку.`,
      ],
    },
    {
      title: "Меры защиты и изменение Политики",
      body: [
        `Оператор принимает правовые, организационные и технические меры для защиты персональных данных от неправомерного доступа, уничтожения, изменения, блокирования, копирования и распространения, включая шифрование канала передачи (HTTPS), ограничение доступа и защиту форм от автоматических обращений.`,
        `Оператор вправе вносить изменения в настоящую Политику. Актуальная редакция всегда доступна по адресу ${SITE.url}/privacy. Дата последнего обновления указана в начале документа.`,
      ],
    },
  ],
};

const privacyEn: LegalDocument = {
  eyebrow: `${OP.shortName} — legal`,
  title: "Personal Data Processing Policy",
  updated: OP.documentsUpdated.en,
  sections: [
    {
      title: "General",
      body: [
        `This Personal Data Processing Policy is drawn up in accordance with Russian Federal Law No. 152-FZ of 27 July 2006 “On Personal Data” and defines how the operator processes personal data and the measures taken to keep it secure.`,
        `Operator: ${OP.legalName} (OGRN ${OP.ogrn}, INN ${OP.inn}), address: ${OP.address}. Personal-data contact: ${OP.privacyEmail}.`,
        `By using ${SITE.url} you confirm that you accept this Policy. Protecting the rights and privacy of the data subject is the operator’s paramount objective.`,
      ],
    },
    {
      title: "What we collect",
      body: [
        `Only the data you enter into the enquiry form: your name; email; phone (optional); preferred contact method; the residence and region of interest; an indicative budget and timeline; and any message you add.`,
        `Technical data sent by your browser may also be processed: IP address, cookies, device and browser information, on-site behaviour. See the “Cookies” section below. We do not process special categories of data or biometric data.`,
      ],
    },
    {
      title: "Purposes and legal basis",
      body: [
        `Your data is processed solely to handle your enquiry and to reply to you — preparing dossiers, arranging viewings, advisory calls. The legal basis is your consent, given by ticking the box and submitting the form (art. 6(1)(1), art. 9 of 152-FZ), together with this Policy and the on-site Consent document. We do not run mailing lists or share data for marketing.`,
      ],
    },
    {
      title: "Cross-border transfer",
      body: [
        `As the service concerns foreign real estate, processing may involve cross-border transfer to: ${countries}. Such transfer takes place only with your separate consent and with notification to Roskomnadzor under art. 12 of 152-FZ, and only where the receiving party affords adequate protection.`,
      ],
    },
    {
      title: "Retention and recipients",
      body: [
        `Access is limited to the advisor handling your enquiry and, where needed for delivery, our transactional email provider. Data is never sold. Records are kept for the engagement and any statutory period, then deleted; an enquiry that leads to no engagement is removed from active systems within twelve months.`,
      ],
    },
    {
      title: "Your rights",
      body: [
        `You may request information about, correction, blocking or deletion of your data, and you may withdraw consent at any time, or complain to Roskomnadzor or a court. Write to ${OP.privacyEmail} or ${OP.address}; we reply within thirty days.`,
      ],
    },
    {
      title: "Cookies",
      body: [
        `Strictly necessary cookies (e.g. your language and cookie choice) run without separate consent. Analytics cookies load only after you accept them in the cookie banner; declining them does not affect your ability to send an enquiry.`,
      ],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ                                  */
/* -------------------------------------------------------------------------- */

const consentRu: LegalDocument = {
  eyebrow: `${OP.shortName} — правовая информация`,
  title: "Согласие на обработку персональных данных",
  updated: OP.documentsUpdated.ru,
  intro: `Проставляя отметку в форме заявки на сайте ${SITE.url} и нажимая кнопку отправки, субъект персональных данных свободно, своей волей и в своём интересе даёт настоящее согласие оператору — ${OP.legalName} (ОГРН ${OP.ogrn}, ИНН ${OP.inn}), адрес: ${OP.address} — на обработку своих персональных данных на условиях, изложенных ниже.`,
  sections: [
    {
      title: "Перечень персональных данных",
      body: [
        `Согласие даётся на обработку следующих персональных данных, указанных субъектом в форме: фамилия и имя; адрес электронной почты; номер телефона; предпочтительный способ связи; интересующая резиденция и регион; ориентировочный бюджет и горизонт покупки; текст сообщения; а также технических данных (IP-адрес, файлы cookie, сведения об устройстве и браузере).`,
      ],
    },
    {
      title: "Цели обработки",
      body: [
        `Обработка персональных данных осуществляется в целях обработки заявки субъекта и связи с ним: подготовки досье, согласования дат показа, проведения консультаций и направления ответа выбранным способом.`,
      ],
    },
    {
      title: "Действия с персональными данными",
      body: [
        `Субъект даёт согласие на сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (предоставление, доступ), в том числе трансграничную передачу на территорию следующих государств: ${countries}, обезличивание, блокирование, удаление и уничтожение персональных данных. Обработка осуществляется как с использованием средств автоматизации, так и без таковых.`,
      ],
    },
    {
      title: "Срок действия и отзыв согласия",
      body: [
        `Согласие действует с момента его предоставления до достижения целей обработки либо до его отзыва. Субъект вправе отозвать согласие в любой момент, направив письменное обращение на ${OP.privacyEmail} или по адресу: ${OP.address}. После отзыва оператор прекращает обработку и уничтожает данные в сроки, установленные 152-ФЗ, если иное не предусмотрено законом.`,
      ],
    },
    {
      title: "Подтверждение",
      body: [
        `Субъект подтверждает, что ознакомлен с Политикой обработки персональных данных, осознаёт, что предоставление данных является добровольным, и что настоящее согласие даётся отдельно от иных согласий и действий.`,
      ],
    },
  ],
};

const consentEn: LegalDocument = {
  eyebrow: `${OP.shortName} — legal`,
  title: "Consent to Personal Data Processing",
  updated: OP.documentsUpdated.en,
  intro: `By ticking the box in the enquiry form on ${SITE.url} and submitting it, the data subject freely, by their own will and in their own interest gives this consent to the operator — ${OP.legalName} (OGRN ${OP.ogrn}, INN ${OP.inn}), ${OP.address} — to process their personal data on the terms below.`,
  sections: [
    {
      title: "Scope of data",
      body: [
        `Consent covers the data you enter in the form: name; email; phone; preferred contact method; residence and region of interest; indicative budget and timeline; message; and technical data (IP address, cookies, device and browser information).`,
      ],
    },
    {
      title: "Purposes and actions",
      body: [
        `Data is processed to handle your enquiry and contact you. You consent to collection, recording, structuring, storage, updating, use, transfer — including cross-border transfer to: ${countries} — anonymisation, blocking, deletion and destruction, with and without automation.`,
      ],
    },
    {
      title: "Term and withdrawal",
      body: [
        `Consent runs from the moment it is given until the purposes are achieved or it is withdrawn. You may withdraw it at any time by writing to ${OP.privacyEmail} or ${OP.address}; the operator then stops processing and destroys the data within the periods set by 152-FZ.`,
      ],
    },
  ],
};

export const PRIVACY_POLICY: Record<Lang, LegalDocument> = {
  ru: privacyRu,
  en: privacyEn,
};

export const CONSENT_DOCUMENT: Record<Lang, LegalDocument> = {
  ru: consentRu,
  en: consentEn,
};
