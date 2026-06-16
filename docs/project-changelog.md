# Project Changelog

## [0.3.1] — 2026-06-16

### Language dropdown re-aligned to design — Japanese (`ja`) removed

Re-aligned the language switcher (MoMorph screen `hUyaaugye2` "Dropdown-ngôn ngữ") to the design,
which specifies **VN/EN only**. Removed Japanese locale support across the whole stack, reversing the
earlier "add JP" deviation (`plans/260609-1554-login-screen-saa/clarifications.md`).

#### Removed

- **i18n** — `ja` dropped from `i18n/routing.ts` locales; `messages/ja.json` deleted; `locale.ja`
  label removed from `messages/{vi,en}.json`
- **Proxy** — `isLoginPage`/`isHomePage` regexes narrowed from `(?:en|ja)` to `en`-only (`proxy.ts`)
- **Components** — `ja`/`JP` option removed from `language-options.ts`; `LanguageOption.code`
  union narrowed to `"vi" | "en"`
- **Assets** — orphaned `public/shared/flag-jp.svg` deleted

#### Fixed

- **Homepage long-form copy did not switch language** — `RootFurtherContent` (the two "Root
  Further" paragraphs + quote), the `EventInfo` `Thời gian:`/`Địa điểm:` labels, and the
  `WidgetButton` `aria-label` were hard-coded in Vietnamese and bypassed `next-intl`, so `/en`
  still showed Vietnamese. Extracted into the `homepage` message namespace
  (`rootFurther.*`, `eventTimeLabel`, `eventVenueLabel`, `widgetAria`) with authored English,
  and rendered via `useTranslations`. Regression tests added
  (`root-further-content.test.tsx`, `event-info.test.tsx`) assert English renders under `en`
  with no Vietnamese leakage.
- **Language dropdown could not be dismissed by its own trigger** — while open, clicking
  the switcher button closed (via the dropdown's outside-click `mousedown`) then immediately
  re-opened (via the button's `onClick`). Outside-click detection is now scoped to the whole
  switcher wrapper (`containerRef`), so the trigger button cleanly toggles closed. Surfaced by
  the new test suite below.

#### Changed

- `components/shared/language-dropdown.tsx` — accepts a `containerRef`; outside-click checks
  the wrapper instead of the dropdown alone
- `components/shared/language-switcher.tsx` — owns the wrapper ref, passes it to the dropdown

#### Tests

- `components/shared/language-dropdown.test.tsx` (NEW) — 6 unit tests: VN/EN render, `aria-selected`
  state, EN select navigates + closes, current-locale select closes without navigating, Escape +
  outside-click close
- `components/shared/language-switcher.test.tsx` — asserts 2 options (`['VN','EN']`) + trigger-toggle
  regression test
- `e2e/language-switcher.spec.ts` (NEW) — 7 Playwright tests: default VN copy, dropdown opens with 2
  options, EN↔VN switch (URL `/login` ↔ `/en/login` + interface copy), trigger-toggle regression,
  outside-click + Escape close
- `e2e/login.spec.ts` — dropdown option count assertion `3 → 2`
- `docs/system-architecture.md` — locale table, message-file list, namespaces, and asset list updated

## [0.3.0] — 2026-06-15

### Countdown — Prelaunch page (`/[locale]/prelaunch`)

Full-screen prelaunch/coming-soon page (MoMorph screen `8PJQswPZmU`): dark organic background
+ overlay, localized title, and a live DAYS / HOURS / MINUTES countdown in LED-style digit boxes.
Auth-required; freezes at 00:00:00 on completion (no redirect).

#### Added

- **Prelaunch UI (`components/countdown/`)**
  - `prelaunch-page-view.tsx` — full-screen layout: background image + gradient overlay + centered
    content, responsive via `.prelaunch-countdown-scaler` (CSS `zoom`)
  - `prelaunch-countdown-block.tsx` — localized title + countdown row
  - `prelaunch-client.tsx` — client wrapper wiring `useCountdown()` + i18n title
- `app/[locale]/prelaunch/page.tsx` — server route (locale-aware, auth-gated via `proxy.ts`)
- `lib/use-countdown.ts` — pure `splitDigits()` helper (clamps to 2 LED boxes, 00–99)
- **i18n** — `prelaunch.title` added to `messages/{vi,en,ja}.json`
- `public/countdown-prelaunch-bg.png` — background asset (Figma node 2268:35129)

#### Changed

- `components/homepage/countdown-display.tsx` — added `variant="prelaunch"` size table (DRY reuse
  by homepage + prelaunch); digit split now via `splitDigits` (fixes >99-day truncation)

#### Fixed

- **Hydration mismatch in `useCountdown`** — the `useState` lazy initializer computed the real
  countdown on the client's first render while the server rendered `00`, causing a React hydration
  error (digit "0" vs "15"). Initializer now always returns `ZERO`; the real value is applied
  post-mount in the effect. Affected both the prelaunch page and the homepage countdown.

#### Notes

- DAYS/HOURS/MINUTES labels stay English across all locales (per design); only the title is localized
- Range/edge-case logic (00–23, 00–59, invalid→00, complete→00) is the existing `computeCountdown`

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
