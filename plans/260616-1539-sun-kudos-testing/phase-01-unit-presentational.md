# Phase 01 — Unit Tests: Presentational + Section Components

**Status:** completed | **Priority:** P1

## Goal
Vitest + RTL test files for the untested presentational/section components.

## Components to test (one *.test.tsx each, next to the component)
- `user-info-block.tsx` — renders name + department; sender/receiver variant; avatar alt = name.
- `section-heading.tsx` — renders subtitle + title props.
- `kudos-banner.tsx` — renders banner title (sunKudos.banner.title) + KUDOS logo alt.
- `kudos-input-row.tsx` — both pills: kudos placeholder + Sunner-search placeholder present; pen + search icons.
- `highlight-kudos-card.tsx` — sender→receiver info, time, content, hashtags, Like/Copy Link/"Xem chi tiết"; `faded` prop dims (style/opacity).
- `highlight-kudos-section.tsx` — subtitle + "HIGHLIGHT KUDOS" title + filters + carousel render (smoke).
- `kudos-post-card.tsx` — sender/receiver, time, content, gallery (renders ≤5 imgs; omitted when imageUrls empty), hashtags, Like (disabled when `isOwn`) + Copy Link.
- `all-kudos-section.tsx` — "ALL KUDOS" heading + one card per mockKudos; empty-state text when given `[]` (if supported, else note).

## Conventions
- Wrap renders needing i18n in `NextIntlClientProvider` locale="vi" with `messages/vi.json` — copy the exact pattern from an existing passing test (e.g. components/login/welcome-text.test.tsx or the existing sun-kudos tests).
- Assert via roles/text, not brittle inline-style snapshots (except `faded` opacity which is behavioral).
- Test files only. < 200 lines each. No fake assertions.

## Success Criteria
- 8 new test files; `npm test` passes; tsc clean for test files.
