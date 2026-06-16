# Phase 02 — Unit Tests: Sidebar + Spotlight + Util

**Status:** completed | **Priority:** P1

## Goal
Vitest + RTL test files for sidebar, spotlight components, and the pure scatter util.

## Components to test (one *.test.tsx each, next to the component)
- `spotlight-scatter.ts` (pure util) — deterministic: same input → same output (no Math.random); font-size tiers; positions within bounds. Plain unit test (no DOM).
- `kudos-stats-block.tsx` — 5 stat rows with sunKudos.sidebar.stats* labels + mockStats values; "Mở quà"/Open gift button present & clickable (no throw).
- `kudos-leaderboard.tsx` — title prop + one row per entry (avatar alt, name, description); empty-state `emptyLeaderboard` when `entries=[]`.
- `kudos-sidebar.tsx` — smoke: stats block + both leaderboard titles render.
- `spotlight-controls.tsx` — search bar placeholder (sunKudos.spotlight.searchPlaceholder, maxLength 100) + Pan/Zoom button (aria/label).
- `spotlight-canvas.tsx` — renders nodes (names present), highlighted node distinct; Pan/Zoom toggle changes interaction mode (aria-pressed / state); loading prop → skeleton; empty nodes → empty state. Mock pointer/wheel minimally; assert state transitions, not pixel transforms.
- `spotlight-board.tsx` — "SPOTLIGHT BOARD" title + "388 KUDOS" count (totalKudos + countSuffix) + search + Pan/Zoom render (smoke).

## Conventions
- i18n via NextIntlClientProvider locale="vi" + messages/vi.json (copy existing pattern).
- spotlight-scatter test is pure (no provider). Assert determinism by calling twice and deep-equal.
- Test files only. < 200 lines each. No fake assertions.

## Success Criteria
- 7 new test files; `npm test` passes; tsc clean for test files.
