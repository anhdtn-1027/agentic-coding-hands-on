# Phase 03 — E2E Suite + Run-All + Review + Deliver

**Status:** completed | **Priority:** P1
**Depends on:** 01, 02 (satisfied)

## Goal
Playwright e2e suite for the Live Board, mapped to the MoMorph test cases; then run everything, fix, review, deliver.

## Create `e2e/sun-kudos.spec.ts`
Use `applyStubSession(context, ...)` from `e2e/auth-stub.ts` to authenticate (page is guarded).
Assertions (structural + text/role; trace each to a MoMorph TC id where applicable):

### GUI — layout & presence (TC 40d4ba26, 0578e8ef, b03..., 86092c3a, ddf67e52, 9dfda316, 99ade8e6, d3877e54, b35d40c1)
- Banner heading + KUDOS logo visible; kudos input placeholder + Sunner search placeholder visible.
- Highlight: "HIGHLIGHT KUDOS" + subtitle; Hashtag + Phòng ban/Department filter buttons; a carousel card with sender/receiver/time/hashtags/Like/Copy Link/View detail.
- Spotlight: "SPOTLIGHT BOARD" + "388 KUDOS" + search ("Tìm kiếm"/"Search") + Pan/Zoom control.
- All Kudos: "ALL KUDOS" heading + ≥1 post card with gallery/hashtags/Like/Copy Link.
- Sidebar: stat labels + "Mở quà"/Open gift + both leaderboard titles.

### FUNCTION — interactions (TC 81446f61, 7a7ec63e, 0adfd7ce, 0e56cacb, 159fed13, cac4b7a3, 43b54c29)
- Carousel: next advances, prev disabled at first / next disabled at last, pagination "n/5".
- Heart: click toggles count/active; own-kudos heart disabled.
- Copy Link: click → toast "Link copied — ready to share!" (mock/granting clipboard permission).
- Filters: Hashtag/Department dropdown opens & option selectable (presentational active state).
- Spotlight Pan/Zoom toggle changes mode (aria-pressed).

### ACCESSING — auth (TC 71b3ef43)
- Unauthenticated (clearCookies) visiting `/sun-kudos` → redirected to `/login` (current guard behavior). Note the spec-vs-impl divergence in report.

### i18n
- vi (default, `/sun-kudos`): Vietnamese chrome; kudos body + names stay Vietnamese.
- en (`/en/sun-kudos`): translated chrome (e.g. "View detail", "Open gift", "Search Sunner profile"); same structure; user content still Vietnamese.

## Verify / Review / Deliver
- Run `npm test` (all unit) + `npm run test:e2e` (playwright). 100% pass. Fix any failures (real bugs → report, don't mask).
- `reviewer`: test quality — no fake assertions, good selectors, TC traceability, a11y selectors.
- Delivery: `project-manager` sync plan; `doc-writer` note test coverage in docs/changelog if warranted; ask about commit.

## Success Criteria
- e2e green on chromium for vi + en; all unit tests pass; reviewer approved.
