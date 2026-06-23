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
    sun-kudos/page.tsx          # Sun* Kudos Live Board (server shell + client sections A–D)
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
sunKudos.{filters.{all, mostLiked, mostRecent, myKudos},
          spotlight.{title, zoomIn, zoomOut, resetView},
          stats.{totalKudos, activeMembers, topHashtag},
          leaderboard.{title, rank, name, kudosGiven, kudosReceived},
          actions.{copyLink, copied, heart},
          writeModal.{title, recipientLabel, awardTitleLabel, contentLabel,
                      hashtagLabel, imageLabel, anonymousLabel, submit, cancel, …}}
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

### `components/sun-kudos/`

Sun* Kudos Live Board (MoMorph screen `MaZUn5xHXZ`) + Write Kudos modal (MoMorph screen
`ihQ26W78P2`). No backend — all data is client-side; mock data stands in for DB-sourced content.

#### State / context

| File | Type | Purpose |
|---|---|---|
| `kudos-board-provider.tsx` | context | React context: kudos feed (seeded from `mock-data.ts`), `addKudos()` (optimistic prepend), modal open/close state; `useKudosBoard()` hook with read-only fallback outside provider |

#### Shared atoms

| File | Type | Purpose |
|---|---|---|
| `types.ts` | data | Shared TypeScript interfaces (`KudosPost` + `awardTitle`, `anonymous`, `anonymousName`; `KudosUser`, `KudosStat`, etc.) |
| `mock-users.ts` | data | Mock user roster (names/avatars; DB-sourced placeholder) |
| `mock-data.ts` | data | Mock kudos posts, stats, leaderboard rows |
| `user-info-block.tsx` | presentational | Avatar + name + team badge |
| `hashtag-list.tsx` | presentational | Pill list of hashtag strings |
| `heart-button.tsx` | client | Like toggle with optimistic counter |
| `copy-link-button.tsx` | client | Clipboard copy with transient "Copied" toast |
| `section-heading.tsx` | presentational | Shared section title bar |

#### Live Board sections

| File | Type | Purpose |
|---|---|---|
| `kudos-banner.tsx` | presentational | Section A hero banner |
| `kudos-input-row.tsx` | client | Section A pen-pill input (readOnly); opens Write Kudos modal on click/keyboard |
| `highlight-filters.tsx` | client | Section B filter tabs (All / Most Liked / Most Recent / My Kudos) |
| `highlight-kudos-card.tsx` | presentational | Section B single highlight card |
| `highlight-carousel.tsx` | client | Section B carousel with prev/next navigation |
| `carousel-arrow-icons.tsx` | data | SVG arrow icon components for carousel |
| `highlight-kudos-section.tsx` | server | Section B orchestrator |
| `spotlight-scatter.ts` | util | Pure function: scatter word-cloud node positions |
| `spotlight-canvas.tsx` | client | Section B.6 interactive canvas (pan/zoom/hover tooltip) |
| `spotlight-controls.tsx` | client | Section B.7 zoom-in/zoom-out/reset controls |
| `spotlight-board.tsx` | client | Section B word-cloud orchestrator |
| `kudos-post-card.tsx` | presentational | Section C single post card |
| `all-kudos-section.tsx` | client | Section C paginated post list with filter dropdown |
| `kudos-stats-block.tsx` | presentational | Section D summary stat tiles |
| `kudos-leaderboard.tsx` | presentational | Section D leaderboard table |
| `kudos-sidebar.tsx` | presentational | Section D sidebar (stats + leaderboard) |

#### Write Kudos modal (Viết Kudo)

Opened from the pen-pill input. Validates form → calls `addKudos()` → closes modal.

| File | Type | Purpose |
|---|---|---|
| `write-kudos-modal-host.tsx` | client | Bridges provider state to the modal; maps form values to a new `Kudos` on submit |
| `write-kudos-modal.tsx` | client | Modal shell + form state |
| `write-kudos-recipient-select.tsx` | client | Recipient picker (from mock users) |
| `write-kudos-award-title-field.tsx` | presentational | Award title input (required; renders as card heading) |
| `write-kudos-rich-text-area.tsx` | client | `contentEditable` editor: bold/italic/strikethrough/ordered-list/link/quote via `document.execCommand`; @mention autocomplete; 500-char counter; board stores plain text |
| `write-kudos-hashtag-picker.tsx` | client | Hashtag multi-select, max 5 |
| `write-kudos-image-uploader.tsx` | client | Image upload (jpg/png, client object URLs, max 5) |
| `write-kudos-anonymous-checkbox.tsx` | presentational | Anonymous toggle |
| `write-kudos-modal-footer.tsx` | presentational | Submit / cancel actions |
| `write-kudos-icons.tsx` | data | SVG icons for the modal |

Validation rules: recipient, awardTitle, content, and ≥ 1 hashtag are required.

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
public/sun-kudos-live-board/  — static assets for the Sun* Kudos Live Board screen
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
