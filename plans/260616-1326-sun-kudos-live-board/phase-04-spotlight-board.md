# Phase 04 — Spotlight Board (Interactive Word Cloud)

**Status:** completed | **Priority:** P1 | **Sections:** B.6, B.7
**Depends on:** Phase 01

## Goal
"SPOTLIGHT BOARD" section: heading + interactive word-cloud canvas with count, search, pan/zoom.

## Files to create
- `components/sun-kudos/spotlight-board.tsx` (B.6/B.7, mm:2940:14174) — wrapper: heading "Sun* Annual Awards 2025 / SPOTLIGHT BOARD" (i18n), dark canvas frame, "388 KUDOS" count label (B.7.1, value from mock), Sunner search bar (B.7.3, placeholder "Tìm kiếm", max 100), Pan/Zoom icon button (B.7.2), bottom ticker text. `"use client"`.
- `components/sun-kudos/spotlight-canvas.tsx` — interactive layer: scattered name nodes (mock), pan (drag) + zoom (wheel / pan-zoom toggle), hover tooltip (name + time), click node (no-op/log this pass). SVG or absolutely-positioned div nodes with transform.

## Files to modify
- `app/[locale]/sun-kudos/page.tsx` — mount section.

## Notes
- One name highlighted (red) per design. Loading + empty states supported. Keep node count modest (~40 mock names). Names hardcoded/mock (user content), not i18n.
- Pan/zoom via transform on a group container; clamp zoom range.

## Success Criteria
- Count label, search, pan/zoom control render; drag pans, wheel/toggle zooms, hover shows tooltip; matches dark-canvas look.
