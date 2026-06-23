# Phase 04 — Integration: wire modal into Live Board (Track A + B)

## Overview
Priority: High · Status: completed
Connect the Track A modal to the Track B state/behavior on the Live Board page.

## Requirements
- Mount `KudosBoardProvider` in `app/[locale]/sun-kudos/page.tsx` wrapping the input row,
  highlight/spotlight/all-kudos sections, and the modal (provider is client; page stays server shell).
- `KudosInputRow` pen pill (`kudos-write-input`) → `openModal()` on click/focus (ID-0/2).
  Keep it accessible (button semantics / keyboard).
- Mount `WriteKudosModal` once inside the provider; open state from context; pass recipients=`mockUsers`,
  hashtag options=`mockHashtags`, onSubmit→`addKudos`, onCancel→`closeModal`.
- Auth gate (ID-1): the page is already behind auth; ensure unauthenticated users can't open it
  (rely on existing route protection — verify, document if gap).
- On submit, the new Kudos appears at the top of All Kudos feed.

## Related code files
- Edit: `app/[locale]/sun-kudos/page.tsx`, `components/sun-kudos/kudos-input-row.tsx`
- Use: `write-kudos-modal.tsx` (A), `kudos-board-provider.tsx` (B)

## Todo
- [x] Provider wraps board sections + modal in page
- [x] Input row triggers openModal (accessible)
- [x] Modal wired: recipients, hashtags, submit, cancel
- [x] Submitted kudos shows at top of feed
- [x] Verify auth gate
- [x] tsc + build passes

## Success criteria
- End-to-end: open modal → fill → Gửi → modal closes → new card on top.

## Completion notes
- KudosBoardProvider mounted in page.tsx wrapping all sections + modal
- KudosInputRow pen pill wired to openModal (accessible button semantics)
- WriteKudosModal integrated: recipients from mockUsers, hashtags from mockHashtags
- onSubmit calls addKudos, onCancel closes modal
- Optimistic prepend: new Kudos appears at top of All Kudos feed immediately
- Auth gate verified: page behind existing route protection
- tsc validation passed, production build succeeds
- Integration tested end-to-end
