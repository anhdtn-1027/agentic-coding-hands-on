# Phase 05 — All Kudos Feed

**Status:** completed | **Priority:** P1 | **Sections:** C, C.1–C.7
**Depends on:** Phase 01

## Goal
"ALL KUDOS" feed: heading + vertical list of kudos post cards.

## Files to create
- `components/sun-kudos/kudos-post-card.tsx` (C.3, mm:3127:21871) — sender info → sent icon → receiver info, time (C.3.4), content (max 5 lines + `...`), image gallery (C.3.6, max 5 thumbnails), `hashtag-list` (C.3.7), action bar (`heart-button` C.4.1 + `copy-link-button` C.4.2).
- `components/sun-kudos/all-kudos-section.tsx` (C) — `section-heading` (ALL KUDOS) + maps mock kudos to post cards. Empty state "Hiện tại chưa có Kudos nào." (i18n).

## Files to modify
- `app/[locale]/sun-kudos/page.tsx` — mount in main column (left of sidebar).

## Notes
- Gallery thumbnails: placeholder images from `public/` or mock; click = no-op this pass (no lightbox). Reuse Phase 01 heart/copy parts. Heart disabled for own kudos (mock flag).

## Success Criteria
- Feed of post cards matches design (sender→receiver, gallery row, hashtags, like/copy), content truncates, empty state works, responsive.
