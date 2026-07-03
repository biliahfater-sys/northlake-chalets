import type { Metadata, Viewport } from "next";
import { fraunces, hanken } from "@/lib/fonts";
import { IMAGES } from "@/lib/media";
import { SITE } from "@/lib/site-config";
import { LanguageProvider } from "@/lib/i18n";
import { Analytics } from "@/components/analytics";
import { CookieConsent } from "@/components/legal/cookie-consent";
import { Concierge } from "@/components/chat/concierge";
import { CustomCursor } from "@/components/motion/custom-cursor";
import { Preloader } from "@/components/motion/preloader";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import "./globals.css";

const SITE_URL = SITE.url;
const SITE_NAME = `${SITE.name} ${SITE.nameSuffix}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Private Alpine Residences by the Lake`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE.description,
  keywords: [
    "luxury alpine chalets",
    "Swiss villas for sale",
    "lakefront chalet investment",
    "mountain real estate",
    "private villa acquisition",
    "alpine real estate platform",
  ],
  authors: [{ name: "Northlake Chalets" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: "Northlake Chalets",
    title: "Own Alpine Residences Where Silence Feels Expensive",
    description:
      "A private platform for premium chalet acquisitions, lakefront villas, and mountain real-estate investments.",
    images: [
      { url: IMAGES.og, width: 1200, height: 630, alt: "Northlake Chalets — alpine village by the lake" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Northlake Chalets — Private Alpine Residences",
    description:
      "Curated alpine residences where silence feels expensive. For investors and private buyers.",
    images: [IMAGES.og],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0d1511",
  colorScheme: "light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Northlake Chalets",
  description:
    "Private platform for premium alpine chalet acquisitions, lakefront villas, and mountain real-estate investments.",
  url: SITE_URL,
  areaServed: "Alpine Europe",
  priceRange: "€€€€",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hanken.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">
        {/* eslint-disable-next-line react/no-danger */}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static, trusted JSON-LD
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          <SmoothScroll />
          <CustomCursor />
          <Preloader />
          <ScrollProgress />
          <Concierge />
          {children}
          <CookieConsent />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
