import { Fraunces, Hanken_Grotesk } from "next/font/google";

/**
 * Display serif — editorial luxury. Variable font: we expose optical-size and
 * softness axes (no explicit weight array, which would conflict with axes).
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
});

/** Interface sans — clean, modern, SaaS-grade. */
export const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});
