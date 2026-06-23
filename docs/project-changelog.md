# Project Changelog

## [0.5.3] — 2026-06-23

### Test — Write Kudos coverage expanded to the MoMorph test-case matrix

No app behavior changed. Expands automated coverage of the "Viết Kudo" modal (MoMorph screen
`ihQ26W78P2`, 57 test cases).

#### Added / Changed (tests only)

- **`write-kudos-modal.test.tsx`** — added GUI checks (recipient/content placeholders, anonymous
  default, char counter), hashtag chip count + min-1, image png-accept / `.txt`+`.mp4` reject /
  max-5-hides-button / remove-re-shows, and toolbar tests that spy on `document.execCommand`
  asserting the correct command id (bold/italic/strikethrough/insertOrderedList/formatBlock/createLink).
- **`e2e/write-kudos.spec.ts`** — added unauthenticated→/login redirect, real bold/italic formatting,
  5-hashtag max + 6th blocked, 5-image upload hides "+ Image", anonymous submit with display name,
  and an @mention dropdown+insert test.
- Replaced earlier non-functional assertions (no-op `.catch`, zero-`expect` @mention units, a
  placeholder e2e body, a dead remove-image `if`) with assertions that actually exercise the feature.

#### Coverage / Verification

- ~44 of 57 MoMorph TCs covered; the rest need backend persistence or are unreachable by design
  (per-field error text — "Gửi" is disabled-until-valid).
- `npm test` — 689 unit pass; `npm run test:e2e` (write-kudos) — 11 pass; `tsc` + lint clean; build succeeds.

## [0.5.2] — 2026-06-23

### Fix — Write Kudos modal: restore design fidelity

Reverts the earlier over-compaction (the modal had been shrunk below the design) and corrects
several details against MoMorph screen `ihQ26W78P2`.

#### Fixed

- **Modal height restored to design** — re-applied the authoritative MoMorph dimensions
  (container `gap 32px` / `padding 40px`, editor 200px, title 32px, field labels 22px, image
  tiles 80px, footer 60px; design height ~1012px). On short viewports the modal still caps at
  `maxHeight: calc(100vh - 32px)` and scrolls internally — it never exceeds the screen.
- **`write-kudos-award-title-field.tsx`** — removed the dropdown-arrow icon from the "Danh hiệu"
  input; the spec defines it as a free-text field with no dropdown affordance.
- **`write-kudos-rich-text-area.tsx`** — content placeholder ("Hãy gửi gắm lời cám ơn…") could
  vanish: the CSS `:empty::before` approach breaks once the browser inserts a `<br>` on focus/blur
  and doesn't paint in some browsers. Replaced with a JS-driven overlay shown while the editor is
  empty (robust cross-browser).
- **`write-kudos-hashtag-picker.tsx` / `write-kudos-image-uploader.tsx`** — the "+ Hashtag" /
  "+ Image" buttons now render the label ("Hashtag" / "Image") bold and the "Tối đa 5" note in a
  smaller, non-bold style, matching the design.

#### Verification

- `npm test` — 672 unit pass; `npm run test:e2e` (write-kudos) pass; `tsc` clean; build succeeds
- Visually verified against the design at a tall viewport

## [0.5.1] — 2026-06-23

### Fix — HIGHLIGHT KUDOS carousel: first slides pushed off-screen

#### Fixed

- **`highlight-carousel.tsx`** — the sliding track used `translateX(calc(50% - 264px - …))`,
  but a percentage in `translateX` resolves against the element's **own** width. With 8 cards the
  track is ~4392px wide, so `50%` (~2196px) shoved every card ~1932px to the right; on pages 1–3
  the active card landed off-screen and appeared missing. Fixed by absolutely positioning the track
  at `left: 50%` / `top: 50%` (relative to the viewport parent) with a pixel-only X offset
  (`translate(calc(-264px - index*552px), -50%)`), so cards center on the viewport regardless of
  track width.

#### Verification

- Added regression test asserting the track centers via `left:50%` + px-based offset (not `translateX(50%)`)
- Visually verified: active card centers at viewport midpoint on pages 1–3 with faded neighbors
- `npm test` — 672 unit tests pass; `tsc` clean; build succeeds

## [0.5.0] — 2026-06-23

### Sun* Kudos — Write Kudos modal (Viết Kudo)

Adds the "Viết Kudo" compose modal (MoMorph screen `ihQ26W78P2`), opened from the Live Board
pen-pill input. No backend — submit optimistically prepends the new Kudos to the All Kudos feed
via client-side React context.

#### Added

- **`kudos-board-provider.tsx`** — React context owning the kudos feed (seeded from `mock-data.ts`),
  `addKudos()` (optimistic prepend), and modal open/close state; `useKudosBoard()` hook with
  read-only fallback when used outside a provider
- **`write-kudos-modal.tsx`** + sub-components — full modal UI + form logic:
  `write-kudos-recipient-select`, `write-kudos-award-title-field`, `write-kudos-rich-text-area`,
  `write-kudos-hashtag-picker`, `write-kudos-image-uploader`, `write-kudos-anonymous-checkbox`,
  `write-kudos-modal-footer`, `write-kudos-icons`
- **`write-kudos-modal-host.tsx`** — bridges provider state to the modal; maps form values to a
  new `Kudos` object on submit
- **Rich-text editor** — lightweight `contentEditable` using `document.execCommand`
  (bold / italic / strikethrough / ordered-list / link / quote) + @mention from mock users +
  500-char counter. Board stores plain text (compose-time formatting not persisted)
- **Validation** — recipient, awardTitle, content, and ≥ 1 hashtag required; hashtags and images
  capped at 5 each; images jpg/png only (client-side object URLs)
- **Data model** — `Kudos` type extended: `awardTitle` (required, rendered as card heading),
  `anonymous`, `anonymousName`
- **i18n** — `sunKudos.writeModal.*` keys added to `messages/en.json` + `messages/vi.json`

#### Changed

- `kudos-input-row.tsx` — pen-pill input now `readOnly`; opens the Write Kudos modal on click
  and keyboard activation (was non-functional)

#### Verification

- `tsc` strict clean
- `npm test` — 671 unit tests pass
- `npm run test:e2e` — 19 E2E tests pass

---

## [0.4.1] — 2026-06-16

### Sun* Kudos Live Board — test coverage (unit + E2E)

No app behavior changed. Adds comprehensive test coverage for the Live Board screen
(MoMorph screen `MaZUn5xHXZ`) introduced in [0.4.0].

#### Added

- **Unit tests (`components/sun-kudos/`)** — 15 new Vitest + RTL test files covering:
  `kudos-banner`, `kudos-input-row`, `user-info-block`, `section-heading`,
  `highlight-kudos-card`, `highlight-kudos-section`, `kudos-post-card`,
  `all-kudos-section`, `kudos-stats-block`, `kudos-leaderboard`, `kudos-sidebar`,
  `spotlight-board`, `spotlight-canvas`, `spotlight-controls`; plus `spotlight-scatter.ts`
  (pure util). Suite grew from 128 tests / 5 files → **651 tests / 29 files**.
- **E2E (`e2e/sun-kudos.spec.ts`)** — 16 Playwright tests authenticating via the existing
  `e2e/auth-stub.ts` (page is auth-gated). Covers: all spec sections present, carousel
  pagination + disabled-state edges, heart Like/Unlike toggle + count, Copy Link toast,
  Hashtag/Department filter dropdowns, Spotlight Pan/Zoom interactions,
  unauthenticated→`/login` redirect, and vi/en i18n split. Assertions traced to MoMorph
  test-case IDs (screen `MaZUn5xHXZ`).

#### Verification

- `tsc` strict clean
- `npm test` — 651 unit tests pass (29 files)
- `npm run test:e2e` — 29 E2E tests pass (0 skipped)

## [0.4.0] — 2026-06-16

### Sun* Kudos — Live Board (`/[locale]/sun-kudos`)

Replaces the `/sun-kudos` placeholder with the full Live Board screen
(MoMorph screen `MaZUn5xHXZ`). Auth-required; fully responsive (main + sidebar stack < lg).
No backend — DB-sourced content served by mock data (`mock-data.ts`, `mock-users.ts`).

#### Added

- **Server shell** — `app/[locale]/sun-kudos/page.tsx` rewritten as a server component
  orchestrating the four board sections
- **Foundation (`components/sun-kudos/`)**
  - `types.ts` — shared interfaces (`KudosPost`, `KudosUser`, `KudosStat`, …)
  - `mock-users.ts`, `mock-data.ts` — mock data standing in for DB-sourced content
  - `user-info-block.tsx`, `hashtag-list.tsx`, `section-heading.tsx` — shared presentational atoms
  - `heart-button.tsx` — like toggle with optimistic counter (client)
  - `copy-link-button.tsx` — clipboard copy with transient toast (client)
- **Section A — Banner + compose row**: `kudos-banner.tsx`, `kudos-input-row.tsx`
- **Section B — Highlight carousel**: `highlight-filters.tsx` (filter tabs), `highlight-kudos-card.tsx`,
  `highlight-carousel.tsx` (prev/next nav), `carousel-arrow-icons.tsx`, `highlight-kudos-section.tsx`
- **Section B — Spotlight word cloud**: `spotlight-scatter.ts` (pure scatter layout),
  `spotlight-canvas.tsx` (pan/zoom/hover tooltip), `spotlight-controls.tsx`, `spotlight-board.tsx`
- **Section C — All kudos**: `kudos-post-card.tsx`, `all-kudos-section.tsx` (paginated list + filter)
- **Section D — Sidebar**: `kudos-stats-block.tsx`, `kudos-leaderboard.tsx`, `kudos-sidebar.tsx`
- **i18n** — `sunKudos` namespace added to `messages/{vi,en}.json`; kudos message bodies + user names
  are hardcoded Vietnamese (user content, not chrome)
- **Assets** — `public/sun-kudos-live-board/` (board-specific static assets)

#### Verification

- `npm run build` green (both locales prerender, Turbopack)
- `tsc` strict clean
- 128 component tests pass

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
