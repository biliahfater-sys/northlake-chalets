# Northlake — Private Alpine Brokerage Website

[![CI](https://github.com/biliahfater-sys/northlake-chalets/actions/workflows/ci.yml/badge.svg)](https://github.com/biliahfater-sys/northlake-chalets/actions/workflows/ci.yml)

A production-ready, design-led site for a private luxury real-estate
brokerage: cinematic chapters, a confidential Private Client Area, a
specimen floor plan and access ledger, a premium enquiry flow, legal pages,
and a protected back office — built to be rebranded for a real €6M–€12M
alpine portfolio.

> Northlake is a **fictional brand**, crafted for demonstration. The legal
> copy uses careful, honest wording and invents no licence numbers — review
> it with counsel before going live for a real brokerage.

## Stack

| Layer      | Tech                                                                   |
| ---------- | ---------------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, webpack) · React 19 · TypeScript strict        |
| Styling    | Tailwind CSS 4 — design tokens in CSS via `@theme`                     |
| Motion     | Motion 12 (`motion/react`) + GSAP (opening title sequence)             |
| WebGL/Canvas | raw WebGL fog & contour shaders · Canvas-2D dust field (no three.js) |
| Scrolling  | Lenis — inertial smooth scroll with anchor glide                       |
| Audio      | Web Audio API — generative alpine score (zero audio files/licences)    |
| Forms      | react-hook-form + zod · Resend API route · rate-limited · Turnstile-ready |
| i18n       | EN/RU dictionary + persisted switcher (`lib/i18n.tsx`)                 |
| Fonts      | Fraunces (variable) + Hanken Grotesk via `next/font`                   |

## Quick start

```bash
pnpm install
cp .env.example .env.local   # optional — the form works without it
pnpm dev                     # http://localhost:3000
```

```bash
pnpm build && pnpm start     # production
pnpm typecheck               # TypeScript only
```

Windows one-click: `start.cmd` (checks Node/pnpm, installs, opens browser).

## Environment & integrations

All optional — the site runs with zero env vars in development. See
`.env.example` for the full annotated list.

| Feature                | Vars                                                | Behaviour without them            |
| ---------------------- | --------------------------------------------------- | --------------------------------- |
| Enquiry email (Resend) | `RESEND_API_KEY`, `CONTACT_TO/FROM_EMAIL`           | Logged to server console          |
| Back office `/admin`   | `ADMIN_PASSCODE`                                     | **Disabled entirely** (safe default) |
| Anti-spam (Turnstile)  | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | No widget, no enforcement     |
| Analytics (Clarity)    | `NEXT_PUBLIC_CLARITY_ID`                             | Not loaded                        |
| Analytics (PostHog)    | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | Not loaded                       |
| Errors (Sentry)        | run `npx @sentry/wizard@latest -i nextjs`            | Not bundled by default            |

Built-in protections: in-memory rate limiting on `/api/contact` and
`/api/admin/login` (swap `lib/rate-limit.ts` for Redis in multi-region
production), zod validation on every route, the admin passcode checked
server-side only, security headers in `next.config.ts`.

## Rebranding — where everything lives

| What                                                              | File                     |
| ----------------------------------------------------------------- | ------------------------ |
| Brand name, tagline, email, coordinates, hero facts, marquee places | `lib/site-config.ts`   |
| Colors, radii, shadows, easings, keyframes (design tokens)        | `app/globals.css` `@theme` |
| Villa inventory — prices, specs, plot, access distances, positioning | `features/villas/data.ts` |
| FAQ content                                                       | `features/content/faq.ts` |
| EN/RU dictionary (nav, hero, footer, enquiry form)                | `lib/i18n.tsx`           |
| Imagery & video paths                                             | `lib/media.ts` + `public/` |
| Nav links & section order                                         | `lib/nav.ts`             |
| Section copy                                                      | `components/sections/*`  |
| Legal pages                                                       | `app/privacy` · `app/terms` |
| SEO metadata & JSON-LD                                            | `app/layout.tsx`         |

Swap the JPGs in `public/images` (≥1672×941), edit `lib/site-config.ts`, and
the site is rebranded. To extend Russian coverage beyond the buyer flow, add
keys to both dictionaries in `lib/i18n.tsx` and consume them with `useI18n()`.

## Page chapters

Hero (WebGL fog + canvas dust) → Marquee → **I** Philosophy → **II**
Collection (editorial index + sticky preview) → **III** Featured estate —
film lightbox, specimen floor plan, access map & ledger, "why the price
holds" → Nature interlude → **IV** Materials → **V** Investment → **VI**
Process → **VII** Private Client Area (buyer portal plate + the transaction
end-to-end) → **VIII** FAQ → **IX** The mandate (trust & legal) → Voices →
Contact (premium enquiry flow + consent) → Footer (privacy/terms links).

Plus: `/privacy`, `/terms`, `/admin` (env-gated back office), concierge chat,
generative ambient score with mute, RU/EN switcher.

## Performance & accessibility

- No three.js — the hero dust is Canvas 2D (~600 kB lighter, no
  `THREE.Clock` deprecation)
- `prefers-reduced-motion` honored everywhere — shaders, dust, cursor,
  smooth scroll, and the preloader all sit out
- WebGL/canvas layers pause off-screen (IntersectionObserver); DPR capped
- Hero image `priority` (LCP); AVIF/WebP via `next/image`
- The preloader force-completes after 9 s of wall-clock time (background
  tabs never hold the page), and a click or Esc fast-forwards it
- Optional analytics load lazily and only when configured

## Deployment

The project is configured for a standard Next.js Node.js host such as Vercel
or a container platform. Set the environment variables from `.env.example`
before going live. For static hosting, switch `next.config.ts` to
`output: 'export'` and copy the `out/` folder to your CDN.

## Licence note for resale

All imagery in `public/` was generated for this project; the firepit clip
ships with the template. Fonts are open (OFL). For a real brokerage,
replace the generated imagery with licensed photography of the actual
residences — the layout assumes ≥1672×941 stills — and review the legal
pages with counsel.
