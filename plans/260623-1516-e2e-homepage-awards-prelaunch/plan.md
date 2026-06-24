---
title: E2E testing — Homepage SAA, Award System, Countdown Prelaunch
date: 2026-06-23
status: completed
branch: feat/e2e-testing
blockedBy: []
blocks: []
---

# E2E Testing — Homepage SAA / Award System / Countdown Prelaunch

Add Playwright e2e coverage for the 3 implemented features that currently lack it,
each test mapped to its MoMorph test-case ID. Login, Đa ngôn ngữ (language-switcher),
and Like Kudos already have e2e specs — **out of scope** (see clarifications.md).

## MoMorph refs (fileKey `9ypp4enmFmdK3YAFJLIu6C`)
- Homepage SAA — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM (62 TCs, ID-0..ID-62)
- Hệ thống giải / Award System — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD (15 TCs, ID-0..ID-14)
- Countdown Prelaunch — https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/8PJQswPZmU (17 TCs, UUID IDs)
- Clarifications: plans/260623-1516-e2e-homepage-awards-prelaunch/clarifications.md

## Key context
- Stack: Next.js 16.2.7, next-intl (VI default no-prefix, EN = `/en`), next-auth v5, Playwright 1.60.
- Run: `npm run test:e2e` (config `playwright.config.ts`, dev server on port 3100).
- Auth: stub session via `e2e/auth-stub.ts` (`applyStubSession(context, user)`); needs `AUTH_SECRET` in `.env.local`.
- Selectors: role/text-based (almost no `data-testid`); assert i18n strings from `messages/{vi,en}.json`.
- Routes: Homepage `/` + `/en` = **public**; `/awards-information` + `/prelaunch` = **auth-gated** (proxy.ts redirects to `/login`).
- Countdown reads `NEXT_PUBLIC_EVENT_DATETIME` (baked at server start) → e2e checks structure + 2-digit format only; value matrix lives in unit tests.

## Phases
| # | Phase | Status | Depends |
|---|-------|--------|---------|
| 01 | [Test infra & shared helpers](phase-01-test-infra-shared-helpers.md) | completed | — |
| 02 | [Homepage SAA e2e](phase-02-homepage-e2e.md) | completed | 01 |
| 03 | [Award System e2e](phase-03-award-system-e2e.md) | completed | 01 |
| 04 | [Countdown Prelaunch e2e](phase-04-prelaunch-e2e.md) | completed | 01 |
| 05 | [Verification & TC coverage](phase-05-verification-coverage.md) | completed | 02,03,04 |

Phases 02/03/04 own separate spec files → parallel-runnable after 01.

## New files
- `e2e/support/routes.ts` — locale-aware route + URL helpers (shared)
- `e2e/homepage.spec.ts`
- `e2e/awards-information.spec.ts`
- `e2e/prelaunch.spec.ts`
- `plans/260623-1516-e2e-homepage-awards-prelaunch/reports/tc-coverage-matrix.md` (phase 05)

## Out of scope
- Login, language-switcher, sun-kudos specs (already exist — do not modify).
- Exact countdown value/zero/invalid-datetime cases (unit-tested in `lib/use-countdown*`).
- Visual/pixel regression (covered during original feature builds).
- Unimplemented placeholder behaviors (notification panel content, widget quick-action menu) — asserted at presence level only.

## Known Issues (Out of Scope)

**Pre-existing language-switcher test-isolation bug:** `e2e/language-switcher.spec.ts` passes when run solo but fails after sibling specs in full suite. Root cause: stale session/locale state leakage. NOT caused by this work. Full suite: 92 passed, 2 failed (language-switcher), 1 skipped. All 54 new tests pass. See `tc-coverage-matrix.md` for details.
