---
date: 2026-06-15
scope: Login feature test suite (Vitest × 40, Playwright × 6)
branch: feat/add-testing-to-feature
---

## Code Review Summary

### Scope
- Files: vitest.config.ts, vitest.setup.ts, 5× *.test.tsx, playwright.config.ts, e2e/auth-stub.ts, e2e/login.spec.ts
- Focus: test quality, correctness, flakiness, coverage gaps

### Overall Assessment
The suite is well-structured and TC-tagged. Most Vitest assertions are meaningful and grounded in actual component output. The e2e auth-stub approach (real JWT, no Google) is sound. Three issues are worth fixing before treating these tests as a reliable gate.

---

### Critical Issues

**C1 — `aria-busy` boolean serialized as `"false"` not `"true"` when loading=false**
- File: `components/login/google-login-button.tsx:59`
- Component sets `aria-busy={loading}` where `loading` is a boolean. React renders boolean `false` as the string `"false"` on the DOM attribute. The test asserts `toHaveAttribute('aria-busy', 'true')` only when `loading` is true, so that direction passes. But a render with `loading={false}` would yield `aria-busy="false"` on the DOM, which is technically valid but semantically redundant. Not a test bug per se — **the real risk** is that the `false` render path is untested, and if React ever omits the attribute for `false`, the assertion for the `loading=true` case could give a misleading picture. Minor, but the companion assertion `expect(button).not.toHaveAttribute('aria-busy', 'true')` is absent from any test, creating a one-sided gate. Severity: warning (the true-loading path is tested correctly; the untested false path could hide a regression).

**C2 — `waitForRequest` called AFTER `click` — race window**
- File: `e2e/login.spec.ts:70-74`
- `page.waitForRequest(...)` returns a Promise. It is set up AFTER `page.goto('/login')` finishes but BEFORE `.click()`. That ordering is correct on its own, but the `signinRequest` Promise is then awaited via `expect(signinRequest).resolves.toBeTruthy()` after the click. If the network request fires and completes between the `.click()` call and the `await expect(...)` line, Playwright's internal listener may miss it. The canonical pattern is:
  ```ts
  const signinRequest = page.waitForRequest(...)  // register FIRST
  await page.getByRole('button').click()           // then click
  await signinRequest                              // then await
  ```
  The current code does register before the click (line 70 before line 73), which is correct — **but** the `expect(...).resolves.toBeTruthy()` wrapper is non-idiomatic and adds an unnecessary async hop. Use `await signinRequest` directly so the 15s timeout applies cleanly. With `fullyParallel: true` and a single shared dev server, slow CI can amplify this.

---

### High Priority

**H1 — `next/image` mock drops `alt` prop — icon assertions query by `src`, not `alt`**
- File: `vitest.setup.ts:12-17`
- The mock destructures `priority` and `fill` off props but passes everything else (including `alt`) through via `...props`. This is correct. However, the `google-login-button.test.tsx` queries the icon as `document.querySelector('img[src="/login/google-icon.svg"]')` (line 17) rather than by `alt` — because the icon has `alt=""` in production. That's fine. But the language-switcher test queries the chevron via `img[src="/shared/chevron-down.svg"]` (line 24), which also has `alt=""` on the real component (the `aria-hidden` chevron). Both assertions work but are fragile to asset path renames. Suggest querying by a stable data-testid or at minimum document why alt is intentionally empty.

**H2 — `LanguageDropdown` is NOT mocked in `language-switcher.test.tsx` — its `@/i18n/navigation` import is partially mocked**
- File: `components/shared/language-switcher.test.tsx:9-11`
- `LanguageSwitcher` renders `<LanguageDropdown>` when open (line 73 of language-switcher.tsx). `LanguageDropdown` imports `useRouter` and `usePathname` from `@/i18n/navigation` (not from `next/navigation`) — but the test mock at line 10 correctly targets `@/i18n/navigation`. So the dropdown DOES render under the mock, and the test works. **The concern** is that `LanguageDropdown` also calls `useLocale()` from `next-intl` — covered by the `vi.mock('next-intl', ...)` at line 8. So in practice the chain is fully mocked. No bug, but if `LanguageDropdown` gains a new dependency this could silently break. Suggest adding a comment that the mock covers the transitive dropdown dependency.

**H3 — `fullyParallel: true` with a single shared `webServer` (dev mode) on CI**
- File: `playwright.config.ts:12, 21-29`
- All 6 specs share one `next dev` instance. `fullyParallel: true` means all specs run simultaneously in the same browser process against the same server. The unauthenticated tests call `context.clearCookies()` in `beforeEach`; the authenticated test sets a cookie in the context. Since each `test()` in Playwright gets an isolated browser context by default, this is safe **unless** `use.storageState` or `use.extraHTTPHeaders` is added later without adjusting. Currently safe, but fragile by architecture.
  - Also: `reuseExistingServer: !process.env.CI` means on dev machines a stale server on 3100 (e.g., from a prior run) is reused. If that server was started without `AUTH_URL=http://localhost:3100`, the stub cookie mint will succeed but the auth middleware may reject it. Add a note or set `reuseExistingServer: false` unconditionally.

**H4 — `aria-busy` boolean → string: the attribute value on `false` is `"false"` (string), test only asserts the `true` branch**
- File: `components/login/google-login-button.test.tsx:32`
- Already covered partially in C1. Additionally: the test for the disabled-but-not-loading state (`it('does not fire onClick while loading or disabled', ...)`) does not assert that `aria-busy` is absent or `"false"` when `disabled` only is set. A component change that sets `aria-busy` on all disabled buttons would pass the existing suite.

---

### Medium Priority

**M1 — `background-key-visual.test.tsx` tests inline-style `backgroundImage` via a CSS-selector attribute filter, not getComputedStyle**
- File: `components/login/background-key-visual.test.tsx:16-19`
- `container.querySelector('div[style*="keyvisual-bg.png"]')` works because jsdom preserves inline style strings, but it is brittle: any whitespace change in the template literal (e.g., `url( /login/...` with a space) would silently break the selector. Prefer `expect(layer.style.backgroundImage).toContain(...)` which is already done on line 20, making the querySelector redundant — the test could just grab the element by another means and assert `style.backgroundImage` directly.

**M2 — `login-hero.test.tsx` has no error/boundary test for missing required assets**
- File: `components/login/login-hero.test.tsx`
- `LoginHero` renders without the `welcomeText` or `loginButton` props (both optional). The one test passes both explicitly. There is no test for the default prop path (render with no props at all). This means a regression on the default Vietnamese strings would only be caught by `welcome-text.test.tsx`, not by the hero integration test. Low real risk given WelcomeText tests cover defaults, but the hero test scope is narrower than implied by the TC tags.

**M3 — TC 33a1dacf (footer copyright) covered only in e2e, no unit test**
- File: `e2e/login.spec.ts:32-35`
- The footer content assertion is in the e2e spec but no Vitest unit test covers `SiteFooter` or the `contentinfo` landmark. If the footer component is refactored, only the slower e2e suite catches the regression.

**M4 — TC covering "closes on outside click" (TC ID-33) and "closes on Escape" (TC ID-34) are implemented in `LanguageDropdown` but not tested**
- Files: `components/shared/language-dropdown.tsx:26-46`, `components/shared/language-switcher.test.tsx`
- The dropdown's `useEffect` event listeners are confirmed in the source but zero tests exercise them. Both TCs appear to be among the 17 MoMorph cases based on the in-code comments. These behaviors are not covered in Vitest or Playwright.

---

### Nice-to-have

**N1 — `vitest.setup.ts` next/image mock uses `Record<string, unknown>` param type**
- File: `vitest.setup.ts:12`
- The mock destructures known Next.js-specific props (`priority`, `fill`) but types the rest as `Record<string, unknown>`. This loses type safety for `src`, `alt`, `width`, `height`. Use `React.ComponentPropsWithoutRef<'img'>` plus `{ priority?: boolean; fill?: boolean }` for safer mock shape.

**N2 — `login.spec.ts` bundles 4 TCs into one test (lines 12-36)**
- File: `e2e/login.spec.ts:12`
- The first test checks header logo, hero, button, and footer in one assertion block. A failure in the footer assertion hides whether the header was also broken. Splitting would give more precise failure attribution in CI.

**N3 — `auth-stub.ts` `expires` field is not set on the cookie**
- File: `e2e/auth-stub.ts:39-48`
- No `expires` is passed to `addCookies`. Playwright defaults to a session cookie (no expiry). For a test that re-uses the authenticated session across multiple page navigations, this is fine. But if the test ever runs long enough for a browser-level session timeout (browser restart scenario in CI), the cookie may be silently dropped. Setting `expires: Date.now() / 1000 + 3600` explicitly makes the intent clear.

**N4 — `language-switcher.test.tsx` uses `{ name: /vn/i }` role query for button**
- File: `components/shared/language-switcher.test.tsx:39`
- The button's accessible name is computed from its children: flag image (alt = "Tiếng Việt"), "VN" text span, chevron image (alt = ""). The `getByRole('button', { name: /vn/i })` matches the "VN" substring. If the locale label changes (e.g., "VI" in a redesign), the test breaks but the accessible name would still work for screen readers. A `getByRole('button', { name: /tiếng việt/i })` or a `data-testid` would be more stable.

---

### Edge Cases Found

- **Cookie domain mismatch on CI**: `auth-stub.ts` hardcodes `domain: 'localhost'`. If CI runs Playwright against a hostname like `127.0.0.1` (e.g., if `baseURL` is `http://127.0.0.1:3100`), the cookie will be silently rejected by the browser. Currently `baseURL` uses `localhost` so this is not a bug today, but worth a comment.
- **`AUTH_SECRET` not forwarded to `webServer.env`**: `playwright.config.ts` passes `{ ...process.env, AUTH_URL: baseURL }` to the server process. `AUTH_SECRET` is loaded from `.env.local` by `loadEnvConfig` for the test process and thus exists in `process.env`, so spreading `...process.env` does forward it. This is correct but subtle — if `.env.local` is absent on a fresh CI checkout, `applyStubSession` will throw at runtime with a meaningful error.
- **`salt` in `encode` must match what Auth.js uses server-side**: `auth-stub.ts` passes `salt: SESSION_COOKIE` (`'authjs.session-token'`). Auth.js v5 derives the JWT encryption key from `AUTH_SECRET + salt`. If Auth.js is configured with a custom `cookies.sessionToken.name` override, the salt would differ and the cookie would be silently invalid (middleware rejects it, redirect to `/login`). No override found in `auth.ts`, so currently correct. Worth a comment.

---

### Positive Observations
- TC IDs embedded in test names — excellent traceability.
- `auth-stub.ts` avoids Google OAuth entirely while minting a cryptographically valid token — correct approach.
- `cleanup()` in `afterEach` and `globals: true` properly configured.
- `exclude: ['e2e/**']` in vitest config prevents Playwright specs from running under Vitest.
- `loadEnvConfig` in playwright.config.ts correctly loads `.env.local` before the webServer process starts.
- The `next/image` mock correctly strips Next-only props that cause React jsdom warnings.
- `language-switcher.test.tsx` correctly mocks `@/i18n/navigation` (the re-exported navigation wrappers), not `next/navigation` directly — aligns with how the dropdown imports them.

---

### Recommended Actions
1. (C2) Move `waitForRequest` registration before `page.goto` or at minimum before `click`, and `await signinRequest` directly instead of `expect(signinRequest).resolves.toBeTruthy()`.
2. (H3) Set `reuseExistingServer: false` or document the stale-server risk explicitly.
3. (M4) Add tests for dropdown close-on-outside-click and close-on-Escape — these are named TCs and currently have zero coverage.
4. (H2) Add a comment in `language-switcher.test.tsx` that the `@/i18n/navigation` mock also satisfies `LanguageDropdown`'s transitive import.
5. (M1) Remove the redundant `querySelector` in `background-key-visual.test.tsx` and rely solely on `style.backgroundImage` assertion.
6. (N1) Tighten the `next/image` mock type signature.
7. (N3) Set explicit `expires` on the stub cookie in `auth-stub.ts`.

### Metrics
- TC coverage: ~13/17 confirmed mapped (TCs ID-33, ID-34 + 2 unidentified have no test). 
- Flakiness risk: 1 confirmed (C2 waitForRequest ordering).
- Linting issues: 0 observed.

### Unresolved Questions
- Which 17 MoMorph TC IDs are in scope? The spec comments reference IDs like `5fbe2a18`, `42b82364`, `TC ID-33`, `TC ID-34` — these naming conventions differ (hash vs sequential). Mapping is incomplete without the full TC list.
- Does the project's Auth.js version use `authjs.session-token` or `next-auth.session-token` as the cookie name in development? (v4 used the latter; v5 uses the former.) The current stub hardcodes the v5 name — confirm Auth.js version in package.json.

---

**Status:** DONE_WITH_CONCERNS
**Summary:** Suite is well-constructed with meaningful assertions and correct auth-stub approach. Two actionable issues worth fixing before using this suite as a hard gate: the `waitForRequest` race window in `login.spec.ts` (C2) and the missing coverage for dropdown close behaviors (M4) which appear to be explicitly named TCs.
**Concerns:** C2 (e2e race condition on button-click assertion), M4 (TC ID-33 and ID-34 have zero test coverage).
