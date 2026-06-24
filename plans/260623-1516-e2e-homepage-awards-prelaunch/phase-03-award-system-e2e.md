# Phase 03 — Award System (Hệ thống giải) e2e

**Priority:** High · **Status:** completed · **Depends:** 01
**Screen:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD (15 TCs)
**File to create:** `e2e/awards-information.spec.ts`

## Context links
- Page: `app/[locale]/awards-information/page.tsx`
- Components: `components/awards/{award-system-content,award-nav,award-detail-block,award-hero,award-data}.tsx`, `components/homepage/kudos-block.tsx`
- i18n keys: `messages/{vi,en}.json` → `awardSystem.*`
- Auth guard: `proxy.ts` (route not public → redirect `/login`). Reuse `e2e/auth-stub.ts`.

## Key insights
- **Implemented route is `/awards-information`** (VI no-prefix) and `/en/awards-information`. TC text says `/he-thong-giai` — that's design-intent; use the real route.
- **Auth-gated** → most tests need `applyStubSession(context)` before navigating. One test asserts the unauthenticated redirect.
- Left nav (`award-nav.tsx`) is **`hidden lg:block`** → desktop viewport (≥1024px) required for nav tests. Default Playwright Desktop Chrome is fine; mobile-viewport nav is intentionally absent.
- Nav items: 6 `<a href="#<id>">` with `aria-current="location"` when active. Section IDs (from `award-data.ts`): `top-talent, top-project, top-project-leader, best-manager, signature-2025-creator, mvp`.
- Click → `goToSection` sets active + `history.replaceState('#id')` + smooth-scroll; scroll-lock 800ms. Assert active state via `aria-current` and URL hash (`page.url()` contains `#id`); avoid asserting scroll pixel positions (smooth-scroll is timing-sensitive).
- Section headings come from `awardSystem.*` i18n keys. 6 award blocks each carry their `sectionId` as element id.
- KudosBlock "Chi tiết" links to `/sun-kudos`.

## TC → test mapping
**Access (ACCESSING ID-0,1,2)**
- ID-1 unauthenticated → redirect to `/login` (mirror sun-kudos auth-guard test)
- ID-0 authenticated (stub) → `/awards-information` loads successfully
- ID-2 navigation from another page (homepage award card / header) → arrives at awards page (cross-ref homepage spec; here assert direct authed load)

**GUI / layout (ID-3..8)**
- ID-3 structural: title (top), left nav (desktop), 6 award blocks (center), Sun* Kudos banner (bottom) all visible
- ID-4 hero title: sub "Sun* annual awards 2025" + main "Hệ thống giải thưởng SAA 2025" (assert via `awardSystem` i18n strings)
- ID-5 nav lists exactly 6 items in order (Top Talent → MVP) — assert nav `<a>` count = 6 + label order
- ID-6 all 6 award blocks render with their titles (assert each `#sectionId` present + heading text)
- ID-7 award badge images present (assert `img` per block, alt non-empty)
- ID-8 kudos banner: "Sun* Kudos" + "Chi tiết" button present

**Function (ID-9..14)**
- ID-9 click each of 6 nav items → that item gets `aria-current="location"` + URL hash updates to `#<id>`
- ID-10 hover nav item → highlight (assert hover does not error; visual highlight is CSS — assert class/style change only if cheap, else skip+document)
- ID-11 active-state exclusivity: click Top Talent then MVP → only the last clicked has `aria-current="location"`
- ID-12 kudos "Chi tiết" → navigates to `/sun-kudos`
- ID-13 invalid section id (call `goToSection`/manual hash) → no JS error, page stable (assert no console errors via `page.on('console')`)
- ID-14 failed nav (bad URL) → friendly handling — **out of scope for e2e** (needs network fault injection); mark covered-elsewhere/manual

## Implementation steps
1. Read `award-data.ts` for exact `sectionId` list + i18n label keys; read `messages/{vi,en}.json` `awardSystem.*` strings.
2. Setup: `applyStubSession(context)` in `beforeEach` for authed describe block; separate describe for the redirect test (no cookie).
3. Build describe blocks: `Auth guard`, `Layout & GUI`, `Nav interactions`, `Kudos banner`.
4. Assert active nav via `aria-current="location"` and `expect(page).toHaveURL(/#top-talent/)` etc.
5. Tag each test title with TC ID (e.g. `(TC ID-5)`).

## Todo
- [x] Auth-guard redirect (ID-1) + authed load (ID-0)
- [x] Layout/GUI structural tests (ID-3..8)
- [x] Nav click + active-state + hash tests (ID-9, ID-11)
- [x] Kudos "Chi tiết" navigation (ID-12)
- [x] Invalid-section no-error test (ID-13)
- [x] Document deferred TCs (ID-10 visual, ID-14 network fault)
- [x] `npm run test:e2e -- awards-information` green (15 passed, 1 skipped)

## Success criteria
- Auth guard, layout, 6-item nav with active/hash behavior, and kudos nav all green; deferred TCs annotated.

## Risks
- Smooth-scroll + 800ms scroll-lock → flaky if asserting scroll position; assert `aria-current` + URL hash instead, with `expect.poll`/`toHaveURL` auto-retry.
- Nav hidden < lg → ensure desktop viewport.
