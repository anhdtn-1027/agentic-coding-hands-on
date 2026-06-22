# Sun* Kudos — Live Board Testing

MoMorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ (screenId MaZUn5xHXZ)
Clarifications: [clarifications.md](./clarifications.md)

## Status: COMPLETE
All phases completed. 651 unit tests pass (29 files; +523 added this session). E2E: 16 sun-kudos + 13 supporting tests pass. TypeScript clean. Reviewed & hardened (2 rounds; vacuous assertions removed, style brittle failures fixed).

## Goal
Comprehensive unit tests (all sun-kudos components) + an e2e suite (Playwright) for the Live Board,
asserting the rendered UI matches the spec. Existing: 128 unit tests on 5 components; 0 e2e.

## Existing infra (reuse, don't reinvent)
- Vitest + @testing-library/react + jsdom; `vitest.setup.ts` mocks next/image. Run: `npm test`.
- Playwright: `e2e/`, `playwright.config.ts` (E2E_PORT default 3100, AUTH_URL aligned to port).
  `e2e/auth-stub.ts` → `applyStubSession(context, user)` mints a signed next-auth cookie for guarded routes.
  Pattern reference: `e2e/language-switcher.spec.ts`, `e2e/login.spec.ts`. Run: `npm run test:e2e`.

## Decisions
- Unit: every untested component (render + spec text/props/structure) + spotlight-scatter util.
- E2E: structural + text/role assertions mapped to the 41 MoMorph test cases; no screenshot baselines.
- E2E locales: vi (default) + en.

## Phases
| # | Phase | Status | Scope |
|---|---|---|---|
| 01 | [Unit tests — presentational + section components](./phase-01-unit-presentational.md) | completed | 8 test files: user-info-block, section-heading, kudos-banner, kudos-input-row, highlight-kudos-card, highlight-kudos-section, kudos-post-card, all-kudos-section |
| 02 | [Unit tests — sidebar + spotlight + util](./phase-02-unit-sidebar-spotlight.md) | completed | 7 test files: spotlight-scatter, kudos-stats-block, kudos-leaderboard, kudos-sidebar, spotlight-controls, spotlight-canvas, spotlight-board |
| 03 | [E2E suite + run-all + review + deliver](./phase-03-e2e-and-verify.md) | completed | e2e/sun-kudos.spec.ts (16 tests authed via auth-stub), i18n (vi+en), TC-mapped assertions, 2 review rounds |

## Dependencies
- Phases 01 & 02 independent (disjoint test files) — parallel-runnable.
- Phase 03 e2e independent of 01/02; final verify depends on all.

## Success Criteria (all met)
- ✓ Every sun-kudos component has a unit test; `npm test` 100% pass (651 tests, 29 files), tsc clean.
- ✓ `e2e/sun-kudos.spec.ts` covers all sections + key interactions + vi/en; `npm run test:e2e` green (29 pass, 0 skipped).
- ✓ E2E assertions traceable to MoMorph test cases (GUI layout, FUNCTION interactions, ACCESSING auth).
- ✓ Reviewer approved. No vacuous/fake assertions; brittle style checks removed.

## Verification
| Tool | Result |
|------|--------|
| `npx tsc --noEmit` | Clean (no errors) |
| `npm test` | 651 pass (unit: 29 files) |
| `npm run test:e2e` | 29 pass (16 sun-kudos + 13 supporting); 0 skipped |

## Follow-ups (non-blocking)
1. **Avatar placeholder SVG** (`/shared/user-profile.svg`) triggers Next.js image aspect-ratio warning in dev. Consider replacing with real avatars or adding `width/height: auto` CSS.
2. **TC-71b3ef43 spec divergence**: Spec implies Kudos UI publicly viewable; implementation guards `/sun-kudos` behind auth (e2e confirms redirect to `/login`). Decision deferred to product.
