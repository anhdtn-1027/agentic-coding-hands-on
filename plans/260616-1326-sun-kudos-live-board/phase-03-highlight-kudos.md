# Phase 03 — Highlight Kudos Carousel

**Status:** completed | **Priority:** P1 | **Sections:** B, B.1–B.5
**Depends on:** Phase 01

## Goal
HIGHLIGHT KUDOS section: heading + filters + interactive 5-card carousel + nav/pagination.

## Files to create
- `components/sun-kudos/highlight-filters.tsx` (B.1, mm:2940:13452) — "Hashtag" (B.1.1) + "Phòng ban" (B.1.2) dropdown buttons; click toggles an open menu (mock options); active state on selection.
- `components/sun-kudos/highlight-kudos-card.tsx` (B.3, mm:2940:13465) — sender info → arrow icon → receiver info (reuse `user-info-block`), time, content (max 3 lines + `...`), `hashtag-list`, action bar (`heart-button`, `copy-link-button`, "Xem chi tiết"). Center=prominent, side=faded variant.
- `components/sun-kudos/highlight-carousel.tsx` (B.2/B.5, mm:2940:13461) — holds card list, center-prominent + side-faded layout, prev/next arrows (disabled at ends), pagination "n/5". `"use client"`.
- `components/sun-kudos/highlight-kudos-section.tsx` (B) — wraps `section-heading` (HIGHLIGHT KUDOS) + filters + carousel.

## Files to modify
- `app/[locale]/sun-kudos/page.tsx` — mount section.

## Notes
- Empty state text "Hiện tại chưa có Kudos nào." (i18n). Heart/copy reuse Phase 01 parts.

## Success Criteria
- 5 mock cards, center prominent/sides faded, arrows disable at first/last, pagination updates, filters open & mark active. Matches design layout.
