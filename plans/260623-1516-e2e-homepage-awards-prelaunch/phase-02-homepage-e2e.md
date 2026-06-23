# Phase 02 — Homepage SAA e2e

**Priority:** High · **Status:** completed · **Depends:** 01
**Screen:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM (62 TCs)
**File to create:** `e2e/homepage.spec.ts`

## Context links
- Page: `app/[locale]/page.tsx` → `app/[locale]/homepage-client.tsx`
- Components: `components/shared/site-header.tsx`, `components/homepage/{hero-section,countdown-display,event-info,cta-buttons,awards-grid,award-card,kudos-block,widget-button}.tsx`, `components/shared/site-footer.tsx`
- i18n keys: `messages/{vi,en}.json` → `homepage.*`
- Reuse: `e2e/auth-stub.ts`, helpers from phase 01. Mirror style of `e2e/sun-kudos.spec.ts`.

## Key insights
- Homepage is **PUBLIC** (proxy.ts: `/` and `/en` bypass auth). Test BOTH unauthenticated and authenticated views.
- Authenticated extras: account menu (Profile / Sign out, +Admin Dashboard for `role: 'admin'`), notification bell. Apply stub session with `role` per case.
- Countdown reads `NEXT_PUBLIC_EVENT_DATETIME` baked at server start → assert structure (3 units, DAYS/HOURS/MINUTES labels) + 2-digit format of rendered values; do NOT assert specific remaining time. Coming-soon label visibility depends on env → assert it is consistent with `showComingSoon` derived state, not a hard-coded value.
- Award cards deep-link to `/awards-information#<section>` — assert href/navigation target, not scroll pixels.
- Some TCs map to no-op placeholders → assert presence/affordance only, never fake. See TC mapping notes.

## TC → test mapping (group by describe block)
**Access (ACCESSING ID-0..6)**
- ID-0 unauthenticated `/` loads public content (no redirect)
- ID-1 authenticated `/` shows bell + account menu affordance
- ID-2/ID-18 logo click → navigates to `/` (from another page e.g. `/awards-information`)
- ID-5/ID-37 admin stub → account menu includes "Admin Dashboard"
- ID-6/ID-38 user stub → account menu excludes "Admin Dashboard"

**GUI / layout (ID-7..17)**
- ID-7 structural: header, hero ("ROOT FURTHER"), countdown, awards grid, kudos section, widget button, footer all visible
- ID-8 header logo present with alt text
- ID-9 active nav link ("About SAA 2025") rendered
- ID-10 language button shows "VN"
- ID-12 countdown: 3 two-digit units + labels DAYS/HOURS/MINUTES (use VI/EN labels from messages)
- ID-14 event info copy present (`homepage.eventTime/eventLocation/eventNote`)
- ID-15 desktop: award cards in grid (assert count + each card has title + "Chi tiết"); ID-16 tablet/mobile viewport → 2-col (assert via `page.setViewportSize` + computed columns only if deterministic, else assert all cards still visible)
- ID-17 footer: logo, nav links, copyright "© 2025"

**Function — navigation (ID-20..23, 44..55, 62)**
- ID-21/ID-44 header link + "ABOUT AWARDS" CTA → `/awards-information`
- ID-22/ID-45 "ABOUT KUDOS" CTA / Sun* Kudos link → `/sun-kudos`
- ID-47/48/49/50/52 award card image/title/"Chi tiết" → href contains `/awards-information#<section>` (assert href; navigate one card, confirm URL hash)
- ID-53 kudos "Chi tiết" → `/sun-kudos`
- ID-55 footer links navigate correctly (assert hrefs)
- ID-62 card missing hashtag → navigates to `/awards-information` without hash (only if such a card exists; else mark N/A)

**Function — i18n (ID-24..26, 58)**
- ID-24 language button opens VN/EN menu; ID-58 exactly VN + EN options
- ID-25 select EN → URL `/en`, interface English; ID-26 EN→VN returns to `/`
- (Reuse assertions consistent with existing language-switcher spec; do not duplicate that spec's scope — focus on homepage context)

**Function — authed menus (ID-27..38)**
- ID-27 notification button opens panel/affordance (assert click target + panel presence; if no-op placeholder, assert button exists & is clickable — document)
- ID-30..35 dropdown menu open/close (click toggle, outside click, Esc, keyboard Enter/Space) — only for menus actually implemented; skip+document any not present
- ID-36 account menu shows Profile + Sign out

**Function — countdown structural (ID-39,40,41,42,43,56,57,60)**
- ID-40 rendered values are zero-padded 2-digit (regex `/^\d{2}$/` on each unit) — structural, env-agnostic
- ID-41/42/43 coming-soon label visibility: assert it matches the rendered countdown state (present when units > 0, hidden at 00:00:00). Exact env-driven values → covered by `lib/use-countdown` unit tests (note in coverage matrix).
- ID-39 auto-update, ID-56/57/60 env format/invalid → **unit-tested**, mark covered-elsewhere (NEXT_PUBLIC env can't vary per-test).

**Placeholder / non-deterministic (document, don't fake):**
- ID-11/28/29 notification badge (depends on unread state — `hasUnreadNotifications={false}` hard-coded → assert no badge), ID-54 widget quick-action menu (no-op per build), ID-59 broken-link scan (manual/out-of-scope).

## Implementation steps
1. Read `homepage-client.tsx` + `site-header.tsx` + `messages/vi.json`/`en.json` for exact strings & roles.
2. Build describe blocks: `Public`, `Authenticated (user)`, `Authenticated (admin)`, `GUI/layout`, `Navigation`, `i18n`, `Countdown (structural)`.
3. Apply stub session per `e2e/auth-stub.ts` for authed blocks; leave public block cookie-free.
4. Tag every `test(...)` title with its TC ID(s), matching existing convention e.g. `(TC ID-7, ID-8)`.
5. Prefer `getByRole`/`getByText` with i18n strings; reserve CSS selectors for structure.

## Todo
- [x] Public-access tests (ID-0, ID-7..17 structural, ID-40 format)
- [x] Authenticated user/admin menu tests (ID-1,5,6,36,37,38)
- [x] Navigation tests (ID-18,21,22,44,45,47-53,55)
- [x] i18n tests in homepage context (ID-24,25,26,58)
- [x] Countdown structural + coming-soon state (ID-40,41,42,43)
- [x] Document deferred/placeholder TCs in test comments
- [x] `npm run test:e2e -- homepage` green (30 tests passed)

## Success criteria
- All deterministic TCs covered & green; deferred TCs annotated with reason + pointer (unit test / placeholder).

## Risks
- Placeholder menus may not exist → assert affordance only, document; never invent behavior.
- Responsive column-count assertions flaky → assert visibility/count over exact CSS grid columns.
