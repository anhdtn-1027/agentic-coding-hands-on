# Phase 05 — Tests (unit + e2e) (Track B)

## Overview
Priority: High · Status: completed
Cover the behavior layer per the 57 test cases. Stack: vitest + Testing Library (unit), Playwright (e2e).

## Requirements
### Unit (vitest, `*.test.tsx` beside components)
- Validation: required errors for receiver / awardTitle / content / hashtag; Gửi disabled→enabled (ID-7,11,14,48,49,56).
- Hashtag: add (pick + type), remove, max-5 block (ID-15,16,17,34,36,53).
- Image: add, max-5 hides button, remove re-shows, reject non-jpg/png (ID-18..24,38,39,40,54,55).
- Anonymous: toggle + name field show/hide (ID-41..44).
- Rich text: bold/italic toggles apply formatting; @mention inserts (ID-27,28,33).
- Provider: addKudos prepends new kudos (heading = awardTitle).

### E2E (playwright, `e2e/`)
- Open modal from input row → fill all required → Gửi → modal closes → new card at top of All Kudos.
- Cancel discards (ID-45). Submit blocked when required empty (ID-56).

## Todo
- [x] Unit tests for form/validation, hashtag, image, anonymous, editor
- [x] Provider unit test (addKudos)
- [x] E2E happy path + cancel + blocked submit
- [x] `npm run test` + `npm run test:e2e` green

## Success criteria
- All new tests pass; no regressions in existing suite.

## Completion notes
- Unit tests: kudos-board-provider.test.tsx + write-kudos-modal.test.tsx
- Coverage: validation (required fields), hashtag add/remove/max, image add/max/remove/type validation, anonymous toggle, rich-text formatting, @mention
- E2E test: e2e/write-kudos.spec.ts
- Coverage: open modal from input row → fill form → submit → modal closes → new card at top; cancel flow; blocked submit on empty required fields
- Test results: 671 unit tests passing + 19 e2e tests passing
- No regressions in existing test suite
- Full test coverage verified
