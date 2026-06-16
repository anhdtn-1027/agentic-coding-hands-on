# Phase 06 — Sidebar (Stats + Leaderboards)

**Status:** completed | **Priority:** P1 | **Sections:** D, D.1–D.4
**Depends on:** Phase 01

## Goal
Right sidebar: personal stats block + "Mở quà" button + two leaderboard lists.

## Files to create
- `components/sun-kudos/kudos-stats-block.tsx` (D.1, mm:2940:13489) — 5–6 stat rows (label + value, mock): Kudos nhận / đã gửi / số tim / Secret Box đã mở / chưa mở; divider; "Mở quà" button (D.1.8, click = no dialog this pass / toast or no-op). Labels i18n, values mock.
- `components/sun-kudos/kudos-leaderboard.tsx` (D.3, mm:2940:13510) — titled list (avatar + name + small description), scrollable; reused for "10 SUNNER NHẬN QUÀ MỚI NHẤT" and the rank-up list. Empty state "Chưa có dữ liệu" (i18n).
- `components/sun-kudos/kudos-sidebar.tsx` (D) — stacks stats block + leaderboard(s); independent scroll.

## Files to modify
- `app/[locale]/sun-kudos/page.tsx` — mount sidebar in right column.

## Notes
- Titles i18n; member names/descriptions are mock. Profile click = no-op this pass.

## Success Criteria
- Stats rows + Mở quà + leaderboards match design; empty states; sidebar fixed-right on desktop, stacks below on mobile.
