# Phase 02 — Data model + board state provider (Track B)

## Overview
Priority: High · Status: completed
Introduce a client-side state layer so a submitted Kudos appears in the All Kudos feed,
and extend the data model for the `Danh hiệu` (award title) + anonymous sending.

## Requirements
- Extend `Kudos` type in `components/sun-kudos/types.ts`:
  - `awardTitle: string` — the Danh hiệu, used as the Kudos heading.
  - `anonymous?: boolean` and `anonymousName?: string` — anonymous send support.
  - Make `sender` tolerate anonymous display (keep type; provider supplies a placeholder user when anonymous).
- New `components/sun-kudos/kudos-board-provider.tsx` (client component, < 200 lines):
  - Context value: `{ kudos: Kudos[], addKudos(input): void, isModalOpen, openModal(), closeModal() }`
  - Seed `kudos` from `mockKudos`.
  - `addKudos` prepends a new `Kudos` (newest first), generating `id`, `postedAt`, default counts.
  - Expose a `useKudosBoard()` hook; throw if used outside provider OR provide safe fallback.
- `AllKudosSection` consumes `useKudosBoard().kudos` instead of importing `mockKudos` directly
  (keep mock import only as the provider seed).

## Architecture
- Provider is a client component mounted in `page.tsx` (server) wrapping input row + feed + modal.
- Current user fixture: reuse a `mockUsers` entry (e.g. `mockUsers[5]` Đặng Thị Ngọc Ánh) as the sender;
  when anonymous, sender name/avatar replaced by "Ẩn danh" placeholder.

## Related code files
- Edit: `components/sun-kudos/types.ts`, `components/sun-kudos/all-kudos-section.tsx`
- Create: `components/sun-kudos/kudos-board-provider.tsx`

## Todo
- [x] Extend Kudos type (awardTitle, anonymous, anonymousName)
- [x] Create kudos-board-provider with context + useKudosBoard hook
- [x] addKudos prepends + generates id/postedAt
- [x] AllKudosSection reads from provider
- [x] tsc passes

## Success criteria
- Board renders identically from provider state; type-checks clean.

## Completion notes
- `Kudos` type extended in `types.ts` with awardTitle, anonymous, anonymousName
- `kudos-board-provider.tsx` created with context + useKudosBoard hook
- addKudos optimistically prepends new Kudos with generated id + postedAt
- AllKudosSection migrated to read from provider instead of mockKudos directly
- tsc validation passed
