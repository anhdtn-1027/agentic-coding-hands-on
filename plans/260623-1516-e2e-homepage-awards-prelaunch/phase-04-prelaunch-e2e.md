# Phase 04 — Countdown Prelaunch e2e

**Priority:** High · **Status:** completed · **Depends:** 01
**Screen:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/8PJQswPZmU (17 TCs, UUID IDs)
**File to create:** `e2e/prelaunch.spec.ts`

## Context links
- Page: `app/[locale]/prelaunch/page.tsx` → `components/countdown/prelaunch-client.tsx`
- Components: `components/countdown/{prelaunch-page-view,prelaunch-countdown-block}.tsx`, `components/homepage/countdown-display.tsx`
- Logic: `lib/use-countdown.ts` (pure, unit-tested), `lib/use-countdown-hook.ts` (reads `NEXT_PUBLIC_EVENT_DATETIME`)
- Auth guard: `proxy.ts` (route not public → redirect `/login`). Reuse `e2e/auth-stub.ts`.

## Key insights
- **Auth-gated** → stub session required; one test asserts unauthenticated redirect to `/login`.
- Renders `CountdownDisplay variant="prelaunch"`: title "Sự kiện sẽ bắt đầu sau", 3 units with labels **DAYS / HOURS / MINUTES** (uppercase, white). Read `countdown-display.tsx` for exact digit DOM/selector before writing.
- Countdown value depends on `NEXT_PUBLIC_EVENT_DATETIME` baked at server start → **cannot vary per-test**. Per clarification: e2e asserts **structure + 2-digit format**; the value matrix (0/9/10/31, ranges, zero-state, invalid, leading-zero) is **unit-tested in `lib/use-countdown.test.*`**.
- Most prelaunch TCs are GUI-presence + format (e2e-suitable) or value-matrix (unit-suitable).

## TC → test mapping (UUIDs → readable labels)
**Access (ACCESSING)**
- `e6a59553…` unauthenticated → redirect to `/login` (route is guarded → "blocked/redirected per config")
- `68d82c58…` authenticated any-privilege → page displays; direct URL ok; malformed URL handled by Next 404 (assert authed load; malformed-URL → note Next default 404, light assertion)
- `1c266552…` low-privilege → app has only user/admin roles, no per-page privilege gate → mark N/A (document: no privilege tiers on this route)
- `17aa9e0d…` expired session → expired/empty cookie → redirect to `/login` (assert by clearing cookie then navigating)

**GUI / layout (structure + labels)**
- `400e248f…` DAYS unit: 2-digit display + label "DAYS"
- `25d9ddaa…` HOURS unit: 2-digit display + label "HOURS"
- `68cf8e17…` MINUTES unit: 2-digit display + label "MINUTES"
- `37fd89d1…` all labels uppercase + white (assert text DAYS/HOURS/MINUTES; color via computed style if cheap)
- title "Sự kiện sẽ bắt đầu sau" visible (add as structural assertion)

**GUI Initialize / FUNCTION value matrix → UNIT TESTS (mark covered-elsewhere):**
- `33fe648b…`(days 0/9/10/31), `1bd69f78…`(hours 0/9/10/23), `8dc4bba6…`(minutes 0/9/10/59) — value rendering
- `840dd6be…` real-time auto-update, `b373626d…` days<1→00, `f98adad8…` hours range 00-23, `724e6e17…` minutes range 00-59, `50fc4021…` completion→00, `c715cb38…` two-digit leading-zero enforcement
- These exercise `computeCountdown`/`pad`/`parseEventDatetime` → assert in `lib/use-countdown.test.ts` (verify it already covers; if a case is missing, add it there in this phase). e2e only asserts the *rendered* values are all 2-digit (regex `/^\d{2}$/`).

## Implementation steps
1. Read `components/homepage/countdown-display.tsx` for the prelaunch-variant digit DOM (how days/hours/minutes + labels are marked up) → pick stable selectors (label text + sibling digit).
2. Confirm `lib/use-countdown.test.ts` (or sibling) coverage of the value matrix above; add any missing case there (do NOT push value-matrix into e2e).
3. Write `e2e/prelaunch.spec.ts`:
   - `Auth guard` describe: unauth redirect, expired-cookie redirect, authed load.
   - `Layout` describe (authed): title + 3 units + DAYS/HOURS/MINUTES labels + each rendered value matches `/^\d{2}$/`.
4. Tag tests with short UUID prefix + intent, e.g. `(TC 400e248f — DAYS unit)`.

## Todo
- [x] Auth-guard tests (unauth redirect, expired cookie, authed load)
- [x] Structural: title + 3 units + uppercase labels (400e248f, 25d9ddaa, 68cf8e17, 37fd89d1)
- [x] Rendered-value 2-digit format assertion (structural proxy for c715cb38)
- [x] Verify/extend `lib/use-countdown` unit tests for value matrix; reference them in coverage matrix
- [x] Mark N/A TCs (low-privilege 1c266552) with reason
- [x] `npm run test:e2e -- prelaunch` green (9 passed; unit: 38 existing + 9 new = 47 passed)

## Success criteria
- Auth guard + structural/label/format tests green; value-matrix TCs confirmed unit-covered and cross-referenced.

## Risks
- Asserting exact countdown values in e2e = flaky/impossible (env-baked, ticking) → restrict e2e to structure + format; keep values in unit tests.
- `CountdownDisplay` digit markup unknown until read → step 1 must precede selector choices.
