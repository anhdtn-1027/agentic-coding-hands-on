# Phase 01 — Foundation

**Status:** completed | **Priority:** P0 (blocks all)

## Goal
Shared infra: TS types, mock-data module, i18n `sunKudos` namespace (vi+en), page layout shell,
reusable sub-parts used across sections.

## Files to create
- `components/sun-kudos/types.ts` — `KudosUser`, `Kudos`, `Hashtag`, `Department`, `LeaderboardEntry`, `KudosStats`, `SpotlightNode`.
- `components/sun-kudos/mock-data.ts` — sample users, ~8 kudos (sender→receiver, content, hashtags, images, likes, time), hashtag + department lists, 2 leaderboards (10 each), stats object, spotlight node list (names + counts). Kudos bodies + names hardcoded; everything else as mock fields.
- `components/sun-kudos/user-info-block.tsx` — avatar + name + dept/stars/badge (sender & receiver variants).
- `components/sun-kudos/hashtag-list.tsx` — `#tag` row, max 5 then `...`.
- `components/sun-kudos/heart-button.tsx` — like count + heart, gray↔red toggle, disabled variant.
- `components/sun-kudos/copy-link-button.tsx` — Copy Link + clipboard + "Link copied — ready to share!" toast.
- `components/sun-kudos/section-heading.tsx` — subtitle "Sun* Annual Awards 2025" + big title (B/C reuse).

## Files to modify
- `messages/vi.json`, `messages/en.json` — add `sunKudos` namespace (section titles, filter labels, placeholders, button labels, stat labels, leaderboard titles, empty states, toast).
- `app/[locale]/sun-kudos/page.tsx` — server shell: `setRequestLocale`, `SiteHeader variant="home"`, responsive main column + right sidebar grid, `SiteFooter variant="home"`. Sections imported as placeholders here, filled by later phases.

## Notes
- Fetch real design tokens (colors, spacing, font sizes, radii) via `momorph-implement-design` skill / `get_frame_node_tree` during forge — do NOT guess.
- All client interactivity components get `"use client"`.

## Success Criteria
- `npm run build` compiles; i18n keys resolve in both locales; shell renders header/footer + empty section regions responsively.
