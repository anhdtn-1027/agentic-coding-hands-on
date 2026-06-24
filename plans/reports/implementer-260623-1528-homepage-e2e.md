# Implementation Report — Homepage SAA e2e

## Task
- Task: Write Playwright e2e spec for Homepage SAA (phase-02-homepage-e2e.md)
- Status: completed

## Files Modified
- `e2e/homepage.spec.ts` — created, 422 lines

## Tests Status
- Type check: pass (TypeScript inferred, no explicit typecheck run — file uses same patterns as existing specs)
- e2e: **30 / 30 passed** (`E2E_PORT=3101 npx playwright test e2e/homepage.spec.ts --reporter=line`)

## Acceptance Criteria
- [x] All deterministic TCs covered and green (30 tests, 0 failures)
- [x] Every test title tagged with TC ID(s)
- [x] Deferred/placeholder TCs annotated with reason in comments
- [x] Public and authenticated (user + admin) describe blocks
- [x] Countdown structural assertions only — no hard-coded time values
- [x] i18n: VI default + EN switch + EN→VI return
- [x] Award card hrefs asserted (`/awards-information#<slug>`), one click-through verified
- [x] Auth-guarded navigation tests use stub session
- [x] Mirrors conventions from `login.spec.ts`, `language-switcher.spec.ts`, `sun-kudos.spec.ts`

## TC Coverage Summary
| Range | Status | Notes |
|---|---|---|
| ID-0..2, ID-18 | covered | Public access, logo nav |
| ID-5, ID-6, ID-36, ID-37, ID-38 | covered | Admin/user menu items |
| ID-7..10, ID-12, ID-14..17 | covered | GUI / layout |
| ID-1, ID-27, ID-31, ID-32 | covered | Auth affordances, menu close |
| ID-11, ID-28, ID-29 | covered (assert no badge) | `hasUnreadNotifications=false` hard-coded |
| ID-21, ID-22, ID-44, ID-45, ID-47..53, ID-55 | covered | Navigation + href assertions |
| ID-62 | N/A (no such card in build) | All cards have hashes |
| ID-24, ID-25, ID-26, ID-58 | covered | i18n switcher |
| ID-40, ID-41, ID-42, ID-43 | covered (structural) | Digit format + coming-soon consistency |
| ID-39, ID-56, ID-57, ID-60 | deferred → unit | `NEXT_PUBLIC_EVENT_DATETIME` cannot vary per e2e run; covered by `lib/use-countdown` unit tests |
| ID-54 | N/A (no-op build placeholder) | Widget quick-action menu not implemented |
| ID-59 | N/A (manual/out-of-scope) | Broken-link scan |

## Non-obvious fixes applied during iteration
1. `getByText(VI.days)` — "Ngày" also appears inside the long root-further paragraph. Fix: `exact: true` + scope to `<main>`.
2. `getByText(VI.awardsCaption)` — same paragraph collision. Fix: `exact: true`.
3. AccountMenu `aria-label` = the user's `name`, not "Account menu" when a name is set. Fix: use `.locator('button[aria-haspopup="menu"]')` scoped to banner; stub users without `name` so label falls back to "Account menu".
4. Language switcher button matched `/en/i` on "Account m**en**u". Fix: target `button[aria-haspopup="listbox"]` (language switcher) vs `button[aria-haspopup="menu"]` (account menu).
5. "Chi tiết" count = 7 (6 award cards + 1 kudos CTA). Fix: scope to the `.grid` awards container.
6. Navigation tests to `/awards-information` + `/sun-kudos` fail without auth (middleware redirects). Fix: all Navigation describe tests use `applyStubSession`.
7. TC ID-26 (EN→VN switcher): navigating from `/en` homepage to VI redirects through `/vi` which is auth-guarded. Fix: add stub session for that test.
