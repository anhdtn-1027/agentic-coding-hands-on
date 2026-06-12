# Project Changelog

## [0.2.0] — 2026-06-12

### Award System page (Hệ thống giải thưởng SAA 2025)

Replaces the `/awards-information` placeholder with the full Award System screen
(MoMorph screen `zFYDgyj_pD`). Authenticated, mostly-presentational page.

#### Added

- **Award System UI (`components/awards/`)**
  - `award-hero.tsx` — keyvisual + "Hệ thống giải thưởng SAA 2025" title (specs 3, A)
  - `award-nav.tsx` — sticky left nav, 6 categories, active = yellow + underline (specs C)
  - `award-detail-block.tsx` — award block: badge image + title + description + qty + value;
    `reverse` for alternating layout; Signature dual-value with "Hoặc" separator (specs D.1–D.6)
  - `award-system-content.tsx` — orchestrates nav + 6 blocks + KudosBlock; IntersectionObserver
    scroll-spy with scroll-lock on click; hash deep-link support; updates URL hash on select
  - `award-icons.tsx` — shared Target/Diamond/License SVG icons (DRY)
  - `award-data.ts` — static award catalogue (i18n keys + qty/value from design)
- **i18n** — `awardSystem` namespace added to `messages/{vi,en,ja}.json` (34 keys each, full parity)

#### Changed

- `app/[locale]/awards-information/page.tsx` — placeholder → real page (Header + content + Footer)
- `components/shared/site-header.tsx` — active-nav state for `/awards-information` and `/sun-kudos`

#### Notes

- Section slugs (`top-talent` … `mvp`) match homepage award-card deep-links — `#hash` links land correctly
- Auth gate unchanged: `proxy.ts` already redirects unauthenticated users to `/login` (TC ID-0/1)
- Responsive: left nav hidden on mobile/tablet, award blocks stack full-width
- Tests: 15/15 MoMorph TCs pass, 24/24 unit tests green, `tsc`/`eslint` clean

## [0.1.0] — 2026-06-10

### Login + Homepage + Language Dropdown

Auth.js Google login, next-intl (vi/en/ja), homepage with live countdown, shared chrome.

#### Added

- **Auth (Auth.js v5, Google OAuth, JWT)**
  - `auth.ts`: Google provider, JWT strategy, role callback (ADMIN_EMAILS allowlist, lowercased comparison)
  - `app/api/auth/[...nextauth]/route.ts`: GET/POST handler
  - `types/next-auth.d.ts`: typed `Session.user.role` and `JWT.role`
  - `lib/auth-helpers.ts`: re-exports `auth`, `signIn`, `signOut`

- **Auth guard (`proxy.ts`)**
  - Unauthed + non-public → `/login?callbackUrl=<path>`
  - Authed on login page → `/`
  - Login page reads and sanitizes `?callbackUrl` (same-origin only via `useSearchParams`)

- **i18n (next-intl v4)**
  - `i18n/routing.ts`, `i18n/request.ts`, `i18n/navigation.ts`
  - `messages/vi.json`, `messages/en.json`, `messages/ja.json` — 8 namespaces each
  - `localeDetection: false`; `vi` default (unprefixed), `en`/`ja` prefixed

- **Shared chrome (`components/shared/`)**
  - `site-header.tsx` — sticky, login + home variants
  - `site-footer.tsx` — login + home variants (`"use client"` for `useTranslations`)
  - `language-switcher.tsx` — flag + code + chevron toggle
  - `language-dropdown.tsx` — locale picker dropdown
  - `account-menu.tsx` — profile/sign-out/admin-dashboard (admin link role-gated)
  - `notification-button.tsx` — bell + red badge

- **Login screen (`components/login/`, `app/[locale]/login/page.tsx`)**
  - Google sign-in button with loading + error states
  - Background key visual (gradient fallback — see deviations)
  - Welcome text from i18n

- **Homepage (`components/homepage/`, `app/[locale]/page.tsx`, `app/[locale]/homepage-client.tsx`)**
  - Hero section with live countdown (days/hours/minutes)
  - Awards grid: 6 cards fully i18n (starOfTheYear, bestLeader, riseOfTheYear, bestTeam, innovationAward, customerChampion)
  - Sun Kudos block (i18n)
  - Event info, CTA buttons, widget button, Root/Further brand content

- **Countdown logic**
  - `lib/use-countdown.ts` — pure functions: `pad()`, `computeCountdown()`, `parseEventDatetime()`, `ZERO`
  - `lib/use-countdown-hook.ts` — `"use client"` React hook
  - `lib/use-countdown.test.ts` — 24 unit tests (vitest), all passing
  - Graceful fallback: missing/invalid/past `NEXT_PUBLIC_EVENT_DATETIME` → `00:00:00`

- **Placeholder routes**: `/awards-information`, `/sun-kudos`

- **`.env.example`** documenting all 6 required env vars

#### Infrastructure

- Next.js 16.2.7 App Router with `proxy.ts` (replaces `middleware.ts`)
- `app/[locale]/layout.tsx`: Montserrat + Montserrat Alternates fonts, `NextIntlClientProvider`
- `next.config.ts` wrapped with `createNextIntlPlugin`
- Build: PASS (18 routes, Turbopack). tsc strict: PASS. Lint (app): PASS. Tests: 24/24 PASS.

---

### Accepted Deviations

1. **Background image unavailable** — Figma API returned HTTP 500 for `saa-bg.jpg` (nodes 662:14389 + 662:14388). `BackgroundKeyVisual` uses a dark gradient overlay fallback.

2. **Countdown font fallback** — "Digital Numbers" (Figma spec) is not on Google Fonts. Countdown renders with `monospace` + `font-variant-numeric: tabular-nums`.

3. **Flag SVGs invented** — `flag-gb.svg` and `flag-jp.svg` were not available in MoMorph S3. Inline SVGs created matching standard proportions. `flag-vn.svg` sourced from MoMorph.

---

### Follow-ups

- **KudosBlock button label**: uses `homepage.kudos.description` key (full sentence) instead of a short label. Add dedicated `detailButtonLabel` message key to fix verbosity.
- **Countdown days > 99**: `TimeUnit` renders only 2 characters; hundreds digit is silently dropped. Clamp at 99 in `computeCountdown` or accept as cosmetic limitation.
- **`callbackUrl` loses query string**: `proxy.ts` stores only `pathname`, not `pathname + search`. Post-login redirect drops `?q=foo` style params.
- **Preview routes**: `app/preview-login/` and `app/preview-homepage/` return `null` — delete when no longer needed.
- **Google credentials**: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` must be provisioned in Google Console and added to `.env.local` before live sign-in works.
- **Open-redirect verification**: whether next-auth 5.0.0-beta.31 fully validates `callbackUrl` to same-origin is unconfirmed. Login page enforces same-origin at the call site independently.
