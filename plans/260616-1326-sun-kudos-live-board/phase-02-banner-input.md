# Phase 02 — Banner + Kudos Input + Sunner Search

**Status:** completed | **Priority:** P1 | **Sections:** A, A.1
**Depends on:** Phase 01

## Goal
Top banner hero + the kudos input pill + Sunner search row.

## Files to create
- `components/sun-kudos/kudos-banner.tsx` (A, mm:2940:13437) — decorative hero bg, title "Hệ thống ghi nhận và cảm ơn" (i18n), KUDOS logo. Readonly.
- `components/sun-kudos/kudos-input-bar.tsx` (A.1, mm:2940:13449) — pill text field, pen icon left, placeholder "Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?" (i18n); + "Tìm kiếm profile Sunner" search field (mm:2940:13449 row). Click opens nothing (no dialog this pass) — focus/hover states only.

## Files to modify
- `app/[locale]/sun-kudos/page.tsx` — mount banner + input bar.

## Notes
- Reuse banner bg asset if present in `public/`; otherwise gradient fallback per existing pattern + note follow-up. Do NOT guess exact colors — pull from node tree.

## Success Criteria
- Banner + input pill + search match design position/typography; placeholders i18n'd; responsive (stack on mobile).
