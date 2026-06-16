# System Architecture — SAA 2025

## Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router | 16.2.7 |
| Runtime | React | 19.2.4 |
| Auth | Auth.js (next-auth) | 5.0.0-beta.31 |
| i18n | next-intl | 4.13.0 |
| Styling | Tailwind CSS | v4 |
| Language | TypeScript | strict |
| Tests | Vitest | 4.1.8 |
| Build | Turbopack | (bundled with Next.js 16) |

> Next.js 16.2.7 uses `proxy.ts` instead of `middleware.ts` as the edge routing convention.
> `middleware.ts` was deleted to avoid a conflict detected at build time.

---

## Routing

### URL structure

| Locale | Prefix | Example |
|---|---|---|
| Vietnamese (default) | none | `/login`, `/` |
| English | `/en` | `/en/login`, `/en/` |

Config: `i18n/routing.ts` — `localePrefix: "as-needed"`, `localeDetection: false` (browser language never overrides; default is always `vi`).

### App directory layout

```
app/
  layout.tsx                    # Minimal shell (html/body moved to [locale]/layout.tsx)
  page.tsx                      # Root redirect → /vi
  api/auth/[...nextauth]/       # Auth.js route handler
  [locale]/
    layout.tsx                  # Locale root: Montserrat fonts, NextIntlClientProvider
    page.tsx                    # Homepage (server component, extracts session)
    homepage-client.tsx         # Homepage client shell, countdown wired
    login/page.tsx              # Login page, Google signIn, Suspense boundary
    awards-information/page.tsx # Placeholder
    sun-kudos/page.tsx          # Placeholder
  preview-login/page.tsx        # Stub (returns null) — dev artifact, not guarded
  preview-homepage/page.tsx     # Stub (returns null) — dev artifact, not guarded
```

---

## Auth

**Strategy:** Auth.js v5, Google OAuth only, JWT session (no database).

**Files:**
- `auth.ts` — NextAuth config, Google provider, JWT + session callbacks
- `app/api/auth/[...nextauth]/route.ts` — exports `{ GET, POST }` from handlers
- `lib/auth-helpers.ts` — re-exports `auth`, `signIn`, `signOut` from `@/auth`
- `types/next-auth.d.ts` — augments `Session.user.role` and `JWT.role`

**Role derivation (jwt callback):**
```ts
token.role = getAdminEmails().includes(user.email.toLowerCase()) ? "admin" : "user";
```
`getAdminEmails()` reads `ADMIN_EMAILS`, splits on comma, trims whitespace, lowercases each entry. Role is set once on first sign-in and carried in the JWT. `session.user.role` is typed as `"admin" | "user"` (non-optional).

**Auth guard (`proxy.ts`):**
- Unauthed + non-public route → redirect to `/login?callbackUrl=<original-path>`
- Authed + on login page → redirect to `/`
- `/api/auth/*` always public
- Login page reads `?callbackUrl` via `useSearchParams`, sanitizes to same-origin (must start with `/` and not `//`), passes to `signIn()`

---

## i18n

**Config files:**
- `i18n/routing.ts` — `defineRouting` (locales, defaultLocale, localePrefix)
- `i18n/request.ts` — `getRequestConfig` with locale validation + message import
- `i18n/navigation.ts` — `createNavigation` wrappers (`Link`, `redirect`, `usePathname`, `useRouter`, `getPathname`)

**Message files:** `messages/{vi,en}.json`

**Namespaces:**

```
locale.{vi,en}
login.{welcomeLine1, welcomeLine2, googleButton}
header.nav.{aboutSaa, awardsInfo, sunKudos}
header.account.{profile, signOut, adminDashboard}
header.notifications
footer.{copyright, links.{aboutSaa, awardsInfo, sunKudos}}
homepage.{comingSoon, days, hours, minutes, seconds, eventTime,
          eventLocation, eventNote, aboutAwards, aboutKudos,
          awardsCaption, awardsTitle}
homepage.awards.{starOfTheYear, bestLeader, riseOfTheYear,
                 bestTeam, innovationAward, customerChampion}.{title, description}
homepage.kudos.{label, title, description, detail}
```

`vi` text sourced from Figma design content. `en` is authored translation.

---

## Components

### `components/shared/`

| File | Type | Purpose |
|---|---|---|
| `language-options.ts` | data | `LanguageOption` type + `LANGUAGE_OPTIONS` (vi/en) |
| `language-switcher.tsx` | client | Flag + code + chevron toggle, 108×56px |
| `language-dropdown.tsx` | client | Locale switcher dropdown (Figma mm:525:11713) |
| `notification-button.tsx` | client | Bell icon + red 8×8px badge |
| `account-menu.tsx` | client | Profile/Sign Out/Admin dropdown, role-aware (admin-only link guarded) |
| `site-header.tsx` | client | Sticky header; login variant and home variant |
| `site-footer.tsx` | client | Login/home variants; `"use client"` required for `useTranslations` |

### `components/login/`

`background-key-visual.tsx`, `google-login-button.tsx`, `login-hero.tsx`, `welcome-text.tsx`, `index.ts`

Background key visual uses a dark gradient overlay fallback — the Figma source image (`saa-bg.jpg`) was unavailable due to a Figma API 500 error during build.

### `components/homepage/`

| File | Purpose |
|---|---|
| `hero-section.tsx` | Hero area, threads i18n labels to CountdownDisplay |
| `countdown-display.tsx` | Countdown digits + "Coming Soon" label; i18n labels received as props |
| `awards-grid.tsx` | 6 award cards; `"use client"`, reads from `homepage.awards.*` message keys |
| `award-card.tsx` | Single award card |
| `kudos-block.tsx` | Sun Kudos section; `"use client"`, reads from `homepage.kudos.*` |
| `event-info.tsx` | Event time/location/note display |
| `cta-buttons.tsx` | Call-to-action buttons |
| `widget-button.tsx` | Widget button |
| `root-further-content.tsx` | Root/Further brand content (text hardcoded Vietnamese — intentionally brand-language only) |

---

## Countdown Logic

**Files:**
- `lib/use-countdown.ts` — Pure functions: `pad()`, `computeCountdown()`, `parseEventDatetime()`; exports `ZERO` constant
- `lib/use-countdown-hook.ts` — `"use client"` React hook; imports pure functions + `ZERO` from above
- `lib/use-countdown.test.ts` — 24 unit tests (vitest), all passing

`computeCountdown(targetMs, now?)` accepts an optional `now` override for deterministic testing. Countdown ticks every 60 seconds via `setInterval`; initial value is synced post-hydration via `requestAnimationFrame` to avoid SSR mismatch.

Env var: `NEXT_PUBLIC_EVENT_DATETIME` (ISO-8601 string). Missing or invalid value → countdown shows `00:00:00`, no error thrown. Past event → same result.

---

## Environment Variables

All vars documented in `.env.example`. Copy to `.env.local` and fill in real values before running.

| Variable | Side | Required | Purpose |
|---|---|---|---|
| `AUTH_SECRET` | server | yes | Auth.js session encryption key (`npx auth secret`) |
| `GOOGLE_CLIENT_ID` | server | yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | server | yes | Google OAuth client secret |
| `AUTH_URL` | server | yes | Base URL matching OAuth redirect URI in Google Console |
| `ADMIN_EMAILS` | server | no | Comma-separated emails that receive `role: "admin"` |
| `NEXT_PUBLIC_EVENT_DATETIME` | client | no | ISO-8601 event datetime for countdown; `NEXT_PUBLIC_` prefix required |

No server-only vars appear in any `"use client"` file. Only `NEXT_PUBLIC_EVENT_DATETIME` is exposed to the client bundle.

---

## Public Assets

```
public/shared/    — saa-logo.png, flag-vn.svg, flag-gb.svg,
                    chevron-down.svg, bell.svg, user-profile.svg,
                    saa-logo-footer.png, arrow-right.svg
public/homepage/  — keyvisual-bg.png, root-further-logo.png, root-text.png,
                    further-text.png, pen.svg, kudos-star.svg, award-bg.png,
                    top-talent.png, top-project.png, top-project-leader.png,
                    best-manager.png, mvp.png, signature-2025-creator.png,
                    kudos-background.png, kudos-logo.svg
```

`flag-gb.svg` is an inline-created SVG (MoMorph S3 did not have it). `flag-vn.svg` came from MoMorph.

---

## Known Limitations / Follow-ups

- `callbackUrl` stored without query string — `?q=foo` is lost after post-login redirect (`req.nextUrl.pathname` only, not full URL)
- `CountdownDisplay` `TimeUnit` only renders 2 characters — days > 99 lose the hundreds digit (cosmetic; clamp or accept)
- `KudosBlock` button label uses the `homepage.kudos.description` key (a full sentence) rather than a short label — track as UX follow-up, or add a dedicated `detailButtonLabel` key
- `root-further-content.tsx` text is hardcoded Vietnamese (intentional brand language; no i18n keys)
- Preview routes (`/preview-login`, `/preview-homepage`) return `null` and remain in the route table — delete when no longer needed
- Open-redirect question: whether next-auth 5.0.0-beta.31 fully validates `callbackUrl` to same-origin is unconfirmed. Login page enforces same-origin at the call site as a belt-and-suspenders guard
- Countdown font: Figma specifies "Digital Numbers" (unavailable on Google Fonts); countdown renders with `monospace` + `tabular-nums` fallback
