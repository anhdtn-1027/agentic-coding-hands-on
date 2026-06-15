# Login Feature Tests — Unit + E2E

Screen: Login (`GzbNeVGJHz`) · 17 MoMorph test cases · branch `feat/add-testing-to-feature`

## Goal
Cover the 17 login test cases with component (Vitest + Testing Library) and e2e (Playwright) tests.

## Stack added
- `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom`, `@vitejs/plugin-react` — component tests under jsdom
- `@playwright/test` — e2e, dev server auto-started, next-auth routes stubbed

## Files
- `vitest.config.ts` — switch env to jsdom, add react plugin + setup, exclude `e2e/**`
- `vitest.setup.ts` — jest-dom matchers, RTL cleanup, `next/image` mock
- `components/login/google-login-button.test.tsx` — TC 6ae76d15, 37eae882, 60bc5bbb, c18649fa
- `components/login/welcome-text.test.tsx` — TC 42b82364
- `components/login/background-key-visual.test.tsx` — TC 5fbe2a18
- `components/login/login-hero.test.tsx` — TC 42b82364, 6ae76d15 (composition + ROOT FURTHER)
- `components/shared/language-switcher.test.tsx` — TC 5f1cbabd, 98e20775, 20d87e28, 4426635b, cb42461d
- `playwright.config.ts` — webServer = `next dev`, baseURL
- `e2e/login.spec.ts` — TC 45278c06, f62b0c97 (redirects, stubbed), layout presence, Google-click, language dropdown

## Status
- [x] Stage 1 Study · [x] Stage 2 Blueprint · [x] Stage 3 Forge · [x] Stage 4 Temper · [x] Stage 5 Review · [ ] Deliver (commit pending user)

## Result
- Vitest: 42 pass (13 login component tests added + 2 dropdown-close + existing countdown suite)
- Playwright: 6 e2e pass (layout, language dropdown, Google-click flow, guarded redirect, authed redirect via stubbed session)
- Reviewer fixes applied: C1 (waitForRequest await), H1 (dropdown close-on-outside/Escape), H3 (aria-busy disabled-only), M1/H2 (doc comments)
- Run: `npm test` (unit/component) · `npm run test:e2e` (e2e)

## Out of scope
- Real Google OAuth e2e (stubbed); visual-regression snapshots
