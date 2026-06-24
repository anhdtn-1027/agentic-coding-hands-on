---
title: Thể lệ (SAA rules) modal + FAB expanded menu
date: 2026-06-24
status: completed
branch: feat/the-le
blockedBy: []
blocks: []
---

# Thể lệ modal + Floating Action Button (expanded)

Wire the existing floating widget into an expandable FAB: tap → expands to
**Thể lệ** + **Viết KUDOS** + **Hủy**. "Thể lệ" opens a rules modal; "Viết KUDOS"
opens the existing Write Kudos modal; "Hủy" collapses.

## MoMorph refs (fileKey `9ypp4enmFmdK3YAFJLIu6C`)
- Thể lệ modal: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/b1Filzi9i6 (4 specs, 0 TCs)
- FAB expanded menu: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/Sv7DFwBw1h (3 specs, 0 TCs)
- Clarifications: plans/260624-0925-the-le-rules-modal/clarifications.md

## Two-track execution
**Track A — UI (background implementer agents, 1 per screen):**
- A1: Thể lệ modal → `components/the-le/` (own Hero badges + 6 collectible icons from Figma)
- A2: FAB expanded menu → refactor `components/homepage/widget-button.tsx` (collapsed pill ↔ expanded menu, props `onOpenRules`/`onWriteKudos`)

**Track B — Integration/logic (orchestrator, after A finishes):**
1. Lift `KudosBoardProvider` + `write-kudos-modal-host` from the Sun* Kudos page to `app/[locale]/layout.tsx`; remove the now-duplicate inner provider on the kudos page (single provider).
2. Homepage (`homepage-client.tsx`): local `useState` for Thể lệ modal open; wire FAB `onOpenRules` → open modal, `onWriteKudos` → board `openModal()`; modal "Viết KUDOS" → `openModal()` + close modal; "Đóng" → close.
3. Move UI agents' VI mock copy → i18n keys in `messages/{vi,en}.json` (`theLe.*`); author EN translations.
4. Verify build + lint; add e2e (homepage FAB expand → Thể lệ modal → Viết KUDOS opens write modal; Hủy collapses).

## Key constraints
- FAB shown on Homepage ONLY (per clarification).
- Static i18n content (no backend).
- Don't modify Write Kudos modal internals; only relocate its provider/host.
- File ownership: A1 = components/the-le/*; A2 = components/homepage/widget-*; integration (layout, homepage-client, messages, e2e) = orchestrator.

## Status
- [x] A1 Thể lệ modal UI (background)
- [x] A2 FAB expanded menu UI (background)
- [x] B integration + i18n
- [x] tests + review + delivery

## Outcome

### Files Added/Changed
**New files:**
- `components/the-le/` (5 components: RulesModal, HeroBadges, CollectibleIcons, RulesList, RulesCard)
- `messages/{vi,en}.json` (theLe i18n namespace, VI+EN)
- `e2e/the-le.spec.ts` (5 tests: expand FAB, open rules modal, navigate to Write Kudos, collapse FAB, mobile responsiveness)

**Modified files:**
- `components/homepage/widget-button.tsx` (refactored for collapsed pill ↔ expanded menu, props onOpenRules/onWriteKudos)
- `app/[locale]/layout.tsx` (lifted KudosBoardProvider + WriteKudosModalHost to root)
- `homepage-client.tsx` (wired FAB onOpenRules/onWriteKudos, local modal state, i18n integration)
- `sun-kudos/page.tsx` (removed duplicate provider)

### Test Summary
- Unit: 702 pass (no regressions)
- E2E: 99 pass / 1 skip / 0 fail (5 new the-le tests, zero regressions)

### Reviewer Verdict
No critical issues. Fixed 4 accessibility items:
- H1 focus-trap (modal focus containment)
- M1 aria-labelledby (Hero badges labels)
- M2 image sizes (collectible icon dimensions)
- L1/L3 FAB aria (button labels + menu semantics)

### Known Follow-Up
Badge/icon PNGs not exported from Figma (MCP media null/500). Currently 4 Hero badges + 6 collectible icons render as styled placeholders wired to `public/the-le/{slug}.png`. **Action:** Drop real PNG assets into `public/the-le/` directory when Figma exports are available.
