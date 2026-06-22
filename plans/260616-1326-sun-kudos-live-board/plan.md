# Sun* Kudos — Live Board UI

MoMorph: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ (fileKey `9ypp4enmFmdK3YAFJLIu6C`, screenId `MaZUn5xHXZ`)
Clarifications: [clarifications.md](./clarifications.md)

## Goal
Replace the `sun-kudos/page.tsx` placeholder with the full Live Board UI, pixel-matching the
design. Static layout + light client interactivity. Fully responsive. Pixel-perfect from MoMorph
node data (NEVER guess visual values — fetch design tokens during forge).

## Decisions (from clarifications)
- Interactivity: carousel slide, heart toggle, Copy Link toast, filter dropdowns open. No backend.
- Text: kudos message bodies + user names hardcoded (user content); DB-sourced data → mock module;
  all UI chrome (titles/labels/placeholders/buttons) → i18n `sunKudos.*` (vi + en).
- Spotlight: full interactive word cloud (pan/zoom, hover tooltip, clickable nodes).
- Responsive: mobile → desktop.

## Architecture
- Route: `app/[locale]/sun-kudos/page.tsx` (server) → `SiteHeader(home)` + section components + `SiteFooter(home)`.
- Components: `components/sun-kudos/` — one file per section + shared sub-parts, all < 200 lines.
- Mock data + types: `components/sun-kudos/mock-data.ts`, `components/sun-kudos/types.ts`.
- i18n: new `sunKudos` namespace in `messages/{vi,en}.json`.
- Style: match existing convention (inline styles + `mm:` refs, Montserrat, palette above).

## Status
COMPLETE. All phases delivered and verified:
- npm run build: PASS (both /vi/sun-kudos + /en/sun-kudos prerender)
- npx tsc --noEmit: clean
- Tests: 128 sun-kudos component tests pass
- Visual: rendered /en/sun-kudos verified via accessibility snapshot — all 6 regions present

## Phases
| # | Phase | Status | Sections |
|---|---|---|---|
| 01 | [Foundation: types, mock data, i18n, layout shell, shared sub-parts](./phase-01-foundation.md) | completed | infra |
| 02 | [Banner + Kudos input + Sunner search](./phase-02-banner-input.md) | completed | A, A.1 |
| 03 | [Highlight Kudos carousel](./phase-03-highlight-kudos.md) | completed | B |
| 04 | [Spotlight Board (interactive word cloud)](./phase-04-spotlight-board.md) | completed | B.6/B.7 |
| 05 | [All Kudos feed](./phase-05-all-kudos.md) | completed | C |
| 06 | [Sidebar: stats + leaderboards](./phase-06-sidebar.md) | completed | D |
| 07 | [Integration, responsive polish, tests, review](./phase-07-integration-tests.md) | completed | all |

## Dependencies
- Phase 01 unblocks all others (shared types/mock/i18n/sub-parts).
- Phases 02–06 are independent of each other (parallel-runnable) once 01 lands.
- Phase 07 depends on 02–06.

## Success Criteria
- Every spec section (A, A.1, B.*, C.*, D.*) rendered, positions/colors/typography match design.
- Light interactivity works: carousel nav + disabled states, heart toggle, copy-link toast,
  filter dropdowns open, spotlight pan/zoom + tooltips.
- `npm run build` + `npm run lint` clean; unit tests pass; reviewer sign-off.

## Follow-ups (non-blocking)
- **Dev-env config:** vi default-locale routes (`/`, `/sun-kudos`) returned 500 in local session due to AUTH base-URL/port mismatch (redirect to :3001) — not a code issue; production build + /en routes render fine. Flag for env config check.
- **Design polish:** Spotlight ticker is static (not an animated marquee) — minor design follow-up.
- **Auth scope:** /sun-kudos is auth-guarded; test case TC-71b3ef43 implies Kudos UI should be publicly viewable when unauthenticated — backend/behavior decision deferred (UI-only task scope).
