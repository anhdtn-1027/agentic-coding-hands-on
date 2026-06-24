# Phase 01 — Test infra & shared helpers

**Priority:** High · **Status:** completed · **Depends:** none

## Goal
Add a small shared helper module so the 3 new specs reuse locale-aware URL building
and authed-session setup consistently. No behavior change to existing specs.

## Context links
- Existing infra: `playwright.config.ts`, `e2e/auth-stub.ts`
- Existing pattern to mirror: `e2e/sun-kudos.spec.ts` (auth + locale switching), `e2e/login.spec.ts` (auth guard)

## Key insights
- Existing specs inline `applyStubSession` + raw paths. Only extract what ≥2 new specs share — do NOT over-abstract (KISS/YAGNI).
- VI is the default locale with **no** prefix (`/`, `/awards-information`); EN is `/en`, `/en/awards-information`.
- Auth-gated routes need a stubbed session cookie applied to the `context` BEFORE first navigation.

## Files to create
- `e2e/support/routes.ts`

## Implementation steps
1. Create `e2e/support/routes.ts` exporting:
   - `localePath(path: string, locale: 'vi' | 'en' = 'vi')` → prefixes `/en` for EN, returns `path` as-is for VI (handle root `/` → `/en`).
   - Route constants: `HOME = '/'`, `AWARDS = '/awards-information'`, `PRELAUNCH = '/prelaunch'`, `LOGIN = '/login'`.
2. Re-export `applyStubSession` / `StubUser` from `e2e/auth-stub.ts` through the support module (single import surface) OR leave auth-stub imported directly — pick the lighter option, document choice.
3. Keep the file < 60 lines. Pure helpers, no Playwright fixtures unless a real need emerges.

## Todo
- [x] Create `e2e/support/routes.ts` with `localePath` + route constants
- [x] Verify `npx tsc --noEmit` passes (or playwright's own type check)
- [x] Smoke-run one existing spec to confirm no regression: `npm run test:e2e -- login`

## Success criteria
- Helpers compile, importable from `e2e/*.spec.ts`.
- No change to existing specs' behavior.

## Risks
- Over-engineering — mitigate by extracting only shared bits.
