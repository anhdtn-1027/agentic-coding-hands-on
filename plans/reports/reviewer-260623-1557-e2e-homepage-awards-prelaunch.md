---
date: 2026-06-23
reviewer: reviewer agent
scope: e2e test-authoring review (no production code changed)
---

## Code Review Summary

### Scope
- Files: `e2e/support/routes.ts`, `e2e/homepage.spec.ts`, `e2e/awards-information.spec.ts`, `e2e/prelaunch.spec.ts`, `lib/use-countdown.test.ts` (diff only)
- LOC: ~760 new lines across spec files + 121-line unit-test extension
- Focus: test correctness, selector robustness, auth handling, TC mapping integrity, DRY/KISS

### Overall Assessment
High-quality set. Auth handling is correct, assertions are real (not trivially truthy), TC ID mapping is consistent. Found no critical failures. Three medium issues could produce flakes or false-greens in CI; two low-priority style concerns noted. The unit-test value-matrix additions are well-structured and correctly scoped.

---

### Critical Issues
None.

---

### High Priority
None.

---

### Medium Priority

**M-1: `langBtn` accepts unused `locale` parameter — dead code that signals intent but does nothing**
- File: `e2e/homepage.spec.ts:73-77`
- The function signature is `(page, locale: 'vn' | 'en')` but the body completely ignores `locale`; it only returns `button[aria-haspopup="listbox"]` regardless of locale. The caller passes `'en'` at line 375 expecting a locale-sensitive locator, but gets the same one. This works today because there is only one listbox button in the banner, but the dead parameter could mislead future authors into thinking the locator is locale-aware.
- Fix: either drop the parameter entirely, or add an aria-label filter so the parameter actually does something (e.g., `{ name: locale === 'en' ? /English/i : /Tiếng Việt/i }`).

**M-2: `homepage.spec.ts` imports from `./auth-stub` directly instead of `./support/routes`**
- File: `e2e/homepage.spec.ts:2` (`import { applyStubSession } from './auth-stub';`)
- `awards-information.spec.ts` and `prelaunch.spec.ts` both import from `./support/routes` (the shared surface). `homepage.spec.ts` bypasses it and imports directly. If `auth-stub.ts` moves or its export renames, two out of three new specs are insulated; one is not.
- Fix: change to `import { applyStubSession } from './support/routes';` (matches the other two specs, no logic change needed).

**M-3: `sectionAnchors` count assertion in awards spec may flake if SiteFooter ever links to `#<section>` hashes**
- File: `e2e/awards-information.spec.ts:112-115`
- The locator `SECTION_IDS.map(id => \`a[href="#${id}"]\`).join(', ')` is page-scoped (no container scope). The `AwardNav` renders one `<a href="#${id}">` per item (6 total). The SiteFooter and SiteHeader currently link to full page routes (`/awards-information`, no hash), so the count is correct now. But this is fragile: any future addition of a same-page anchor elsewhere (e.g., a mobile nav drawer that duplicates the sticky nav) would silently inflate the count and break `toHaveCount(6)`.
- Fix: scope to the nav container — e.g., `page.locator('.hidden.lg\\:block').locator(...)` — to match exactly the sticky nav. This also aligns with how the individual anchor lookups in TC ID-9 already use `.first()` defensively.

---

### Low Priority

**L-1: `waitForTimeout` hardcoded delays in awards spec (lines 181, 228)**
- `awards-information.spec.ts:181` (`waitForTimeout(100)`) inside the hover JS-error test: this is acceptable as a minimal settle gap for a pure hover event with no navigable outcome, and the test's assertion is not timing-sensitive (checking errors array after settle). However, replacing with `page.waitForFunction(() => true)` is marginally more deterministic under slow CI.
- `awards-information.spec.ts:228` (`waitForTimeout(200)`) after setting an invalid hash: functionally acceptable (checking the hash-guard is effectively instantaneous), but a `page.waitForFunction(() => window.location.hash === '#invalid-section-does-not-exist')` would be safer.
- Neither represents an actual flake risk under current Playwright retry=1 CI config; flagged as nice-to-have hardening.

**L-2: Duplicate TC ID-12 annotated on two separate tests in awards spec**
- `awards-information.spec.ts:212` and `awards-information.spec.ts:252` both carry `TC ID-12`. The second test in the "Kudos Banner" describe block explicitly labels itself `TC ID-12 — banner describe` to distinguish. This is not a false-green and the behavior is intentionally re-tested in a different describe scope with a scroll step added. Still, the duplication in a TC-coverage matrix would show two tests mapped to one ID.
- Suggestion: either consolidate into one test with the scroll step, or annotate the second as `TC ID-12 (scroll-variant)` to make the intent explicit.

---

### Edge Cases Found

**E-1: `splitDigits` unit test asserts `'5'` → `['0','5']` but source behavior for single-char is under-specified**
- `lib/use-countdown.test.ts:131`: `expect(splitDigits('5')).toEqual(['0', '5'])`.
- Looking at the source in `lib/use-countdown.ts:78-83`: for a single-char string `v.length >= 2` is false for tens and false for units, so `tens = '0'`, `units = v[0] = '5'`. This is correct. But `pad()` always produces a 2-char string via `padStart(2, '0')`, so `splitDigits` will never actually receive a 1-char value in production. The test is still valid as a defensive boundary case — no action needed, just confirming the assertion matches the source.

**E-2: `computeCountdown` returns `days: '100'` for large day counts but `splitDigits('100')` clamps to `'99'`**
- Unit test at line 118 (`expect(result.days).toBe('100')`) is correct for `computeCountdown` (pad does not cap). The downstream `splitDigits` clamping to '99' is separately tested at line 135. These are consistent and deliberately split. No bug, but two tests that together cover the full contract need to be read together to understand the display cap.

**E-3: Prelaunch `'(TC structural) title...'` test at `prelaunch.spec.ts:82-86` is redundant with the `beforeEach`**
- The `beforeEach` at line 79 already asserts `getByText('Sự kiện sẽ bắt đầu sau').toBeVisible()`. The first test body asserts the same thing again. This is harmless but wastes a test slot — the test would pass trivially even with no body. Not a false-green (if the page crashed before the beforeEach await completed, both would fail together), but the test adds zero additional signal.

---

### Positive Observations

- Auth-stub pattern is correct end-to-end: real JWT signed with `AUTH_SECRET`, `httpOnly`, `sameSite: 'Lax'`, domain `localhost`. No session mocking at the module level.
- Public specs consistently call `context.clearCookies()` in `beforeEach` — no cookie bleed-through from parallel workers.
- Auth-guard redirect assertions use `/\/login\?callbackUrl=/` regex — confirms the query param is present, not just the path. Consistent with existing `login.spec.ts` + `sun-kudos.spec.ts` conventions.
- `span[style*="Digital Numbers"]` selector for countdown digits is implementation-specific but stable (the inline fontFamily is the intentional design token, not a test-id). Scoped to `main` to avoid header collisions. Good pragmatic choice.
- `aria-current="location"` is the correct ARIA value for same-page navigation (not `"page"`) — the tests match the actual component output.
- TC ID-10 (hover CSS visual) is correctly deferred with a documented reason and a minimal non-trivial assertion (JS error check).
- TC ID-14 skip has a fully annotated reason. `test.skip` with a descriptive string rather than a bare no-op is the right pattern.
- Unit test additions are pure-function tests with deterministic timestamps (no `Date.now()`). All boundary values (0/9/10/31 days, etc.) cover every explicit MoMorph TC UUID.
- `routes.ts` is small and well-typed; re-exporting `applyStubSession` and `StubUser` from a single surface is the right DRY move even if `homepage.spec.ts` currently bypasses it (see M-2).

---

### Recommended Actions
1. **M-2 (import path)** — one-line fix, align `homepage.spec.ts` with the other two specs: change `'./auth-stub'` → `'./support/routes'`.
2. **M-1 (dead param)** — drop the `locale` parameter from `langBtn` or make it functional. Low risk either way; prevents future confusion.
3. **M-3 (selector scope)** — scope the `sectionAnchors` locator to the sticky nav container to guard against future structural additions to the page.
4. **L-2 (TC ID-12 dupe)** — rename the second test to `TC ID-12 (scroll-variant)` to make matrix mapping unambiguous.
5. **E-3 (redundant test)** — optionally add a non-trivial assertion to the structural title test or remove it.

### Metrics
- Test Count: 30 (homepage) + 15 + 1 skip (awards) + 9 (prelaunch) = 55 e2e; 27 additional unit test cases
- Linting Issues: 1 unused parameter (`langBtn` locale)
- Hardcoded waits: 2 (both in awards spec, both defensible)
- False-green risk: low (0 critical, 0 high)

### Unresolved Questions
- None blocking. The `sectionAnchors` count assumption (M-3) depends on whether a mobile nav drawer duplicating sticky nav links is planned — if so, priority rises to High.

---

**Status:** DONE_WITH_CONCERNS
**Summary:** 55 new e2e tests + 27 unit test cases are well-authored with real assertions and correct auth handling. Three medium findings (dead param, inconsistent import path, fragile global anchor count) are straightforward to fix; none blocks shipping.
**Concerns/Blockers:** M-2 (import path inconsistency) is a maintenance hazard if `auth-stub.ts` is ever relocated. M-3 (anchor count) could silently break if the page gains a second nav surface. Both are 1-line fixes.
