---
date: 2026-06-16
slug: language-switcher-tests
scope: feat/add-testing-to-feature (commit 0b04154)
files reviewed:
  - components/shared/language-dropdown.test.tsx (NEW)
  - components/shared/language-switcher.test.tsx (updated)
  - e2e/language-switcher.spec.ts (NEW)
  - e2e/login.spec.ts (NEW — described as "option count 3→2 change" but is actually a new file per git diff)
components under test:
  - components/shared/language-dropdown.tsx
  - components/shared/language-switcher.tsx
  - components/shared/language-options.ts
---

## Code Review Summary

### Scope
- 4 test files, ~240 LOC
- Components: LanguageDropdown, LanguageSwitcher, LANGUAGE_OPTIONS constant
- Focus: test quality — correctness, coverage, brittleness, mock fidelity, DRY/style

### Overall Assessment
The tests are well-structured and cover the happy path and primary MoMorph TCs completely. Mocks are accurate. There is one real uncovered production bug, one misleading e2e regex, and one DOM-order reliance worth flagging — none are blocking, but the uncovered bug scenario is a meaningful gap.

---

### High Priority

#### 1. Undetected production bug: clicking the switcher button to close does not work (coverage gap + component bug)

When the dropdown is open and the user clicks the **switcher button** again to dismiss it:
1. `mousedown` fires on the button → `LanguageDropdown.handleOutsideClick` runs (the button is **outside** `dropdownRef`) → `onClose()` → `setOpen(false)` — dropdown closes.
2. `click` fires on the button → `setOpen(v => !v)` → `v` is now `false` → `setOpen(true)` — dropdown **re-opens**.

Net effect: clicking the toggle button while open produces a flash-close then re-opens. No test exercises this path (`language-switcher.test.tsx` only clicks the button to *open*; close tests use `document.body` or `Escape`). The component has a real interaction bug that the tests can't catch because the scenario is not covered.

Fix for test: add a `it('clicking the button again while open closes the dropdown')` test; fix for component: use `pointerdown` instead of `mousedown` listener, or check `e.target` against the toggle button ref and skip close there.

---

### Medium Priority

#### 2. E2E URL regex ambiguity in VN→unprefixed assertion (e2e/language-switcher.spec.ts, line 59)

```ts
await expect(page).toHaveURL(/\/login$/);  // also matches /en/login
await expect(page).not.toHaveURL(/\/en\//); // guard
```

`/\/login$/` matches both `/login` and `/en/login`. The test is only correct because the second assertion (`not.toHaveURL(/\/en\//)`) guards against it. If the second assertion is ever deleted in isolation, the first silently passes even when locale switch failed. Prefer one unambiguous regex: `/^http:\/\/localhost:\d+\/login$/` or simply keep both but add a comment explaining the dependency.

#### 3. DOM-order reliance on LANGUAGE_OPTIONS array (language-dropdown.test.tsx, lines 26 & 33)

```ts
expect(options.map((o) => o.textContent)).toEqual(['VN', 'EN']);  // order-dependent
const [vn, en] = screen.getAllByRole('option');                   // order-dependent
```

Both assertions assume VN is index 0, EN is index 1, matching `LANGUAGE_OPTIONS` array order. If the array is reordered (e.g., for a different default locale), the assertions silently invert — the role-query finds them in DOM order without language semantics. This is low-risk given `as const` freeze, but the test at line 33 should use `getByRole('option', { name: /vn/i })` for the VN assertion to be explicit.

---

### Low Priority

#### 4. Chevron selector via DOM query (language-switcher.test.tsx, line 27)

```ts
document.querySelector('img[src="/shared/chevron-down.svg"]')
```

Direct `document.querySelector` bypasses Testing Library's accessibility queries, leaks implementation details (the exact `src` path), and would silently pass even if the element is hidden. Prefer `screen.getByRole('img', { hidden: true })` filtered by name, or simply accept the path-based selector given the mock strips all Next.js image behavior — it's not wrong, just brittle on rename.

#### 5. login.spec.ts described as "option count 3→2 update" but git diff shows it is a new file

The task description says `login.spec.ts` changed its option count from 3 to 2. Per `git diff HEAD~1`, the file is entirely **new** in this commit (the old file did not exist). The current file has `toHaveCount(2)` which is correct. No issue with the code itself; the description is just inaccurate.

#### 6. `language-switcher.test.tsx` creates a fresh `vi.fn()` per `useRouter` call

```ts
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  ...
}));
```

The `replace` mock is not captured, so there is no way to assert on navigation calls from this test file. That is intentional (the switcher test only covers open/close state), but it means if `LanguageDropdown` is rendered and a locale switch happens, the test wouldn't detect it. Not a bug in the current tests, but worth a comment to make the intent explicit.

---

### Positive Observations

- Mock fidelity is accurate: `useRouter` is mocked to return `{ replace }` matching the real `createNavigation` router signature; `usePathname` returns a string; `useLocale` returns `'vi'`. The call site `router.replace(pathname, { locale: option.code })` is verified by the captured `replace` mock — this correctly reflects the next-intl v4 locale-switch API.
- The "selecting current locale does not navigate" case (line 46-51, dropdown test) is explicitly covered — uncommon for this type of test.
- `aria-selected` state on options is tested.
- E2E clears cookies in `beforeEach`, preventing locale bleed between tests.
- The 2-option contract is tested at both unit (dropdown + switcher) and e2e level.
- `vitest.setup.ts` global cleanup (`afterEach cleanup`) and `next/image` mock are correct and don't introduce noise.
- TC IDs from MoMorph specs are referenced in test names — good traceability.

---

### Recommended Actions (priority order)

1. **(High)** Add a unit test for "clicking the switcher button while open re-closes it" to expose (or confirm) the double-toggle production bug. Then decide if the component needs a fix.
2. **(Medium)** Replace the two-step URL regex in `language-switcher.spec.ts` with one unambiguous pattern, or add a comment explaining why both are required.
3. **(Low)** Change the `const [vn, en] = getAllByRole('option')` destructure to use named queries to decouple from array order.
4. **(Low)** Add a comment to the `language-switcher.test.tsx` mock explaining why `replace` is not captured.

---

**Status:** DONE_WITH_CONCERNS
**Summary:** Tests are sound for all spec'd TCs, mocks correctly reflect next-intl v4 router API, coverage of edge cases is good. One real uncovered scenario exists: clicking the toggle button to dismiss while open — this path has a production interaction bug the current tests cannot detect.
**Concerns:** Item 1 above (toggle-button double-open) is the only meaningful gap; items 2–4 are maintainability issues, not correctness problems.
