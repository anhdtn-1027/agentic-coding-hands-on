# Code Review — Sun* Kudos Live Board Test Suite Quality

**Date:** 2026-06-16  
**Scope:** 15 new unit test files (components/sun-kudos/), 1 e2e spec (e2e/sun-kudos.spec.ts)  
**Total tests:** 651 unit / 29 e2e — all currently passing

---

## Overall Assessment

The suite is **substantially meaningful** — it exercises real behavior (i18n integration, focus state, aria attributes, filter state, pan/zoom toggle, canvas search dimming, leaderboard empty-state) and avoids mocks where possible. The `spotlight-scatter.test.ts` logic tests are particularly strong. However there are recurring patterns of vacuous and redundant assertions scattered across most files that dilute trustworthiness, and the e2e carousel test has a fundamentally broken assertion. Over-testing of inline style values (px-exact checks) inflates test count without adding regression value.

---

## Critical Issues

### C1 — E2E carousel test assertion always passes (e2e/sun-kudos.spec.ts:265-266)

```
expect([paginationBefore, paginationAfter]).toBeDefined();
```

`[anything]` is always defined — an array literal is never undefined. This test was supposed to assert that pagination text changed after clicking Next, but the assertion is a no-op. The real check is silently missing. Even if pagination advances from "1/5" to "2/5", this test passes; even if the button had no effect, this test passes.

**Fix:** Replace with `expect(paginationAfter).not.toBe(paginationBefore)` (inside the truthy guard).

### C2 — E2E Hashtag filter test ends with `expect(true).toBe(true)` (e2e/sun-kudos.spec.ts:423)

After racing to detect a menu, the test announces success via a constant `true`. This always passes even if the menu was never found (the code path skips when `!menuFound`), providing zero regression protection for TC 0e56cacb filter selection.

**Fix:** Remove the race/timeout approach. Use `await expect(page.getByRole('listbox', …)).toBeVisible()` with a proper timeout, or mark the whole test as `test.skip` with a note explaining it is deferred until the dropdown is implemented.

---

## High Priority

### H1 — Vacuous `not.toThrow()` smoke tests add noise without behavior coverage

Found in: `user-info-block.test.tsx:115-123`, `spotlight-board.test.tsx:23`, `highlight-kudos-section.test.tsx:222`, `kudos-sidebar.test.tsx:182`, `kudos-stats-block.test.tsx:49`

Pattern:
```tsx
it('accepts sender variant without error', () => {
  expect(() => { render(<UserInfoBlock user={mockUser} variant="sender" />); }).not.toThrow();
});
```

These test only that JSX evaluation doesn't crash — React components never throw during static render in jsdom unless there is an uncaught runtime error. They provide no behavior signal. The same render is immediately repeated in sibling tests that do make real assertions.

**Fix:** Delete them. If variant behavior is spec-relevant, assert the difference between `sender` and `receiver` rendering instead.

### H2 — Vacuous `toBeTruthy()` on DOM query results (multiple files)

Pattern found in: `kudos-input-row.test.tsx:232,246,254`, `highlight-kudos-section.test.tsx:245,275,283`, `highlight-kudos-card.test.tsx:214`, `all-kudos-section.test.tsx:120,128,255`, `kudos-post-card.test.tsx:247,255,271`, `kudos-banner.test.tsx:163`

Example:
```tsx
const flexRow = container.querySelector('div.flex-row');
expect(flexRow).toBeTruthy();
```
`querySelector` returns `null` if no match — so this assertion is "DOM node exists" at best. It will silently pass even if layout changes, because the selector has no binding to the spec behavior being documented.

```tsx
// highlight-kudos-section.test.tsx:57
it('renders carousel', () => {
  const { container } = renderWithI18n(<HighlightKudosSection />);
  expect(container).toBeTruthy();  // ← always truthy
});
```
`container` is the jsdom root element returned by `render()`, never null — this test always passes regardless of what renders.

**Fix:** Either assert specific content/attributes of the found element, or delete the test.

### H3 — Self-contradictory test name vs. assertion (`kudos-input-row.test.tsx:187-194`)

```tsx
it('inputs have no border and outline', () => {
  const inputs = screen.getAllByRole('textbox');
  inputs.forEach((input) => {
    const style = window.getComputedStyle(input);
    expect(style.border).toBeTruthy();   // ← asserts border IS truthy
    expect(style.outline).toBeTruthy();  // ← asserts outline IS truthy
  });
});
```

The test name says "no border and outline" but asserts the opposite (both truthy). In jsdom `getComputedStyle`, `border` returns `""` (empty string, falsy) and `outline` returns `""` — so these are vacuous truthy-on-empty-string checks that always pass. The intent was probably `expect(input).toHaveStyle('border: none')`.

**Fix:** Either rename to "border and outline exist" and fix assertion, or replace with `expect(input).toHaveStyle('outline: none')` which is tested correctly in the sibling test at line 200.

### H4 — Conditional assertions that silently no-op (`highlight-kudos-card.test.tsx:52-65`)

```tsx
it('renders hashtags', () => {
  const hashtag = testKudos.hashtags.find(h => h.startsWith('#'));
  if (hashtag) {
    expect(screen.getByText(hashtag)).toBeInTheDocument();
  }
});
it('renders category label', () => {
  const category = testKudos.hashtags.find(h => !h.startsWith('#'));
  if (category) {
    expect(screen.getByText(category)).toBeInTheDocument();
  }
});
```

`mockKudos[0].hashtags = ["#Dedicated", "#Inspiring", "IDOL GIỚI TRẺ"]` — both conditions are always true for this fixture, so the assertions always run. But if mock data ever changes (all-# or empty), the `if` guard silently swallows the test. Same pattern repeated in `kudos-post-card.test.tsx:53-58` and `all-kudos-section.test.tsx:286-295`.

**Fix:** Remove the conditional guard; test against the actual fixture values directly.

### H5 — `kudos-post-card.test.tsx:175-198` — variable shadowing `container`

```tsx
const imageContainers = gallery.querySelectorAll('div[style*="width: 88"]');
imageContainers.forEach(container => {   // shadows outer `container`
  expect(container).toHaveStyle('width: 88px');
  ...
});
```

The inner `container` parameter shadows the outer `const { container }` from `render()`. This works accidentally, but is confusing and error-prone: if the outer `container` were used in a later assertion in the loop, it would silently pick up the inner DOM element. Not a bug today but a maintenance hazard.

**Fix:** Rename the loop variable to `imageContainer`.

---

## Medium Priority

### M1 — Heart button `isOwn` tests check count, not disabled state (`kudos-post-card.test.tsx:276-288`)

```tsx
it('heart button is disabled when isOwn is true', () => {
  const ownKudos = { ...testKudos, isOwn: true };
  const { container } = renderWithI18n(<KudosPostCard kudos={ownKudos} />);
  const buttons = container.querySelectorAll('button');
  expect(buttons.length).toBeGreaterThan(0);  // never fails
});
```

The spec (`kudos-post-card.tsx:185`) says the heart button is `disabled={kudos.isOwn}`. The test should verify `expect(heartButton).toBeDisabled()` when `isOwn=true` and the opposite when `isOwn=false`. Current assertion is vacuous.

**Fix:**
```tsx
const heartBtn = container.querySelector('button[aria-label="Like"]') 
               ?? container.querySelector('button[aria-pressed]');
expect(heartBtn).toBeDisabled(); // when isOwn=true
```

### M2 — E2E arbitrary `waitForTimeout` throughout interactions suite

`waitForTimeout(200)` and `waitForTimeout(300)` appear 9 times in the interactions group. Playwright's web-first assertions (`await expect(el).toBeVisible()`, `await expect(el).toHaveAttribute(...)`) wait until the condition is met or timeout — no sleep needed. Arbitrary sleeps make the suite fragile on slow CI and mask timing issues.

Locations: sun-kudos.spec.ts:262, 271, 316, 334, 407, 443, 471, 482, 582

**Fix:** Replace `await page.waitForTimeout(N)` + bare attribute reads with `await expect(locator).toHaveAttribute('aria-pressed', 'true')` etc.

### M3 — Over-testing pixel-exact inline styles for pure presentation components

`user-info-block.test.tsx` (19 tests), `section-heading.test.tsx` (20 tests), `kudos-banner.test.tsx` (26 tests): roughly half the tests verify specific px values (border `1.869px`, gap `13px`, letterSpacing `-0.25px`, clamp values). These break on any design-token refactor without changing functional behavior. For an awards-board, visual correctness is better served by a single screenshot / snapshot test or Figma-comparison, not 8 separate `toHaveStyle` assertions.

No action required for correctness, but flagged as noise that inflates count and maintenance cost. If the design spec is locked, they stay; otherwise consider consolidating into 1-2 structural tests + a visual snapshot.

### M4 — `all-kudos-section.test.tsx:227-233` — empty-state branch never executes

```tsx
it('shows empty message when no kudos available', () => {
  const { container } = renderWithI18n(<AllKudosSection />);
  const section = container.querySelector('section');
  if (mockKudos.length === 0) {   // mockKudos has 8 entries, never 0
    expect(screen.getByText('Hiện tại chưa có Kudos nào.')).toBeInTheDocument();
  }
  // else: test body is empty, always passes
});
```

This test has never exercised the empty state. It registers as a passing test but provides zero coverage.

**Fix:** Inject an empty array via prop or via module mocking, or delete the test and document that `AllKudosSection` has no empty-state prop (which itself may be a coverage gap).

### M5 — `spotlight-board.test.tsx:267-271` — layout assertion yields nothing

```tsx
it('canvas area has proper padding', () => {
  const canvasArea = Array.from(container.querySelectorAll('div')).find(
    d => d.textContent?.includes('SPOTLIGHT BOARD') && d.querySelector('svg')
  );
  expect(canvasArea).toBeInTheDocument(); // just DOM presence, not padding
});
```

Test name promises "proper padding" but asserts only that a div containing both the heading text and an SVG exists — no padding assertion made. Is equivalent to a render smoke test.

---

## Low Priority

### L1 — `kudos-input-row.test.tsx:260-269` — `<style>` tag content assertions

```tsx
it('placeholders are semi-transparent white', () => {
  const style = container.querySelector('style');
  expect(style?.textContent).toContain('rgba(255, 255, 255, 0.60)');
});
```

Inspecting a rendered `<style>` block's raw text is extremely brittle — any whitespace change, minification, or CSS-in-JS version bump breaks it. Use CSS custom properties or Playwright visual tests for pseudo-element colors instead. This won't break behavior but is a maintenance liability.

### L2 — `user-info-block.test.tsx:129-133` — variant prop test asserts nothing useful

```tsx
it('renders same layout for both variants', () => {
  const senderName = senderContainer.querySelector('span');
  const receiverName = receiverContainer.querySelector('span');
  expect(senderName?.textContent).toBe(receiverName?.textContent);
});
```

Both containers render with the same `mockUser`, so their first span text is always identical. This asserts that the mock data is consistent with itself — not that `sender` vs `receiver` layout differs or matches spec.

### L3 — `spotlight-controls.test.tsx:531-545` — keyboard test asserts only tagName

```tsx
it('is keyboard accessible (Enter key)', () => {
  fireEvent.keyDown(button, { key: 'Enter' });
  expect(button.tagName).toBe('BUTTON'); // doesn't verify Enter fires the handler
});
```

`keyDown` on a `<button>` in jsdom doesn't trigger `click` (browsers do). The assertion checks element type, not key-press behavior. If the intent is to verify Enter triggers `onToggle`, use `userEvent.keyboard('{Enter}')` after focusing, and assert `onToggle` was called.

---

## Coverage Gaps (High Value Missing Tests)

1. **Heart button — `isOwn=true` disables it** — tested in `kudos-post-card.test.tsx:276-288` but assertion is vacuous (see M1). Real test missing.
2. **`AllKudosSection` empty state** — empty-kudos branch never exercised (see M4).
3. **E2E carousel pagination** — assertion is a no-op (see C1). Carousel advance is never validated end-to-end.
4. **E2E hashtag/department filter** — both tests effectively skip to `test.skip()` whenever the dropdown isn't detected; TC 0e56cacb and cac4b7a3 have zero real validation (see C2).
5. **Highlight card "Xem chi tiết" button click handler** — rendered and presence-tested but click behavior never asserted.
6. **`spotlight-scatter` node overlap** — `buildPositionedNodes` makes no attempt to avoid overlap; no regression test for grid distribution guarantees (though `distributes positions across grid cells` is a reasonable proxy).

---

## Positive Observations

- `spotlight-scatter.test.ts` is exemplary: pure function + exact boundary testing on tier thresholds, determinism, canvas bounds, and search trimming — all unambiguous.
- `spotlight-canvas.test.tsx` search/dimming tests (`dims nodes that do not match`, `case-insensitive`) and tooltip show/hide tests are genuine interaction coverage.
- `spotlight-controls.test.tsx` — `PanZoomButton` aria-pressed toggle, rerender active/inactive visual states are solid and meaningful.
- `kudos-stats-block.test.tsx` — custom vs. default props pattern, zero-values, large numbers: good parameterised thinking.
- E2E Like toggle (TC 7a7ec63e) is thorough: initial count parsed, click, aria-pressed flip, count +1, toggle back to original count — this is the gold standard test in the suite.
- E2E Copy Link (TC 0adfd7ce) verifies toast text AND auto-hide — covers the useEffect timer path.
- i18n integration done correctly: real message JSON loaded in test wrappers, not mocked strings.
- `kudos-input-row.test.tsx` focus/blur state changes test actual React state transitions with `userEvent`, not just static rendering.

---

## Metrics

| Dimension | Assessment |
|-----------|------------|
| Vacuous tests | ~18–22 tests across 10 files (3–4% of suite) |
| Always-passing (structurally) | C1, C2, H2 instances, M4 branch, H3 |
| Brittle selector patterns | `div[style*="width: 528"]`, `container.querySelector('style')` — moderate |
| Over-fitted style tests | ~25–30 per pure-presentation component |
| TC traceability | Good — e2e spec maps TC ids in comments |
| Console noise | None observed |
| App-code edits | None |

**Overall score: 6.5 / 10**

Strong on pure logic (scatter), interaction state (spotlight controls, Like toggle), and i18n integration. Pulled down by the broken e2e carousel/filter assertions, recurring vacuous DOM-presence checks across the larger presentational test files, and the misleading heart-button disabled test.

---

**Status:** DONE_WITH_CONCERNS  
**Summary:** Suite is functional and passes, but C1 (carousel assertion always passes) and C2 (filter test ends with `expect(true).toBe(true)`) mean two TC-cited e2e tests provide zero regression protection.  
**Concerns:** C1 and C2 should be fixed before treating these TC ids as covered.
