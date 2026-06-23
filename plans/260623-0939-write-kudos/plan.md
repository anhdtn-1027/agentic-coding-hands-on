---
plan: Viết Kudo (Write Kudos) modal
screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2
discipline: interactive (MoMorph two-track)
status: completed
---

# Write Kudos (Viết Kudo) — Implementation Plan

Feature: a modal to compose & send a Kudos (recognition) to a teammate, opened from the
Live Board input row. No backend exists → optimistic client-side add to the All Kudos feed.

See `clarifications.md` for resolved decisions.

## Two tracks (parallel-runnable)

- **Track A — UI** (background `implementer` agent): build the `Viết Kudo` modal pixel-faithfully
  from Figma as presentational/controlled components with mock data + prop interfaces.
- **Track B — Behavior/Integration** (orchestrator): data model, board state, validation,
  submit, rich-text editor + @mention, hashtag/image logic, wiring into the page, tests.

No `blocks` between A and B. Integration phase connects them.

## Phases

| # | Phase | Track | Status |
|---|-------|-------|--------|
| 01 | [Modal UI from Figma](phase-01-track-a-modal-ui.md) | A | completed |
| 02 | [Data model + board state provider](phase-02-data-model-and-board-state.md) | B | completed |
| 03 | [Submit, validation, rich-text & field logic](phase-03-submit-validation-logic.md) | B | completed |
| 04 | [Integration: wire modal into Live Board](phase-04-integration.md) | A+B | completed |
| 05 | [Tests (unit + e2e)](phase-05-tests.md) | B | completed |

## Key decisions (from clarifications)
- `Danh hiệu` (awardTitle): required; added to `Kudos` model.
- Submit: optimistic prepend to All Kudos feed via client state; brief loading; close on success.
- Rich text: lightweight custom contentEditable (execCommand) + @mention from mockUsers; no heavy dep.
- Hashtag: pick from mockHashtags OR type new; min 1, max 5.
- i18n: `sunKudos.writeModal` keys in en.json + vi.json (VI verbatim from design).
- Trigger: existing `KudosInputRow` pen pill.

## Key files
- New: `components/sun-kudos/write-kudos-modal.tsx` (+ sub-components) — Track A
- New: `components/sun-kudos/kudos-board-provider.tsx` — Track B
- Edit: `components/sun-kudos/types.ts`, `all-kudos-section.tsx`, `kudos-input-row.tsx`,
  `app/[locale]/sun-kudos/page.tsx`, `messages/{en,vi}.json`
