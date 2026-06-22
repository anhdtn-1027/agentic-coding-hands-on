# Implementation Report — Phase 03: Highlight Kudos Carousel

## Task
- Task: Phase 03 — Highlight Kudos Section (B section, Sun* Kudos Live Board)
- Status: completed

## Files Created
| File | Lines | Notes |
|------|-------|-------|
| `components/sun-kudos/highlight-filters.tsx` | 187 | "use client" — B.1 dual dropdown filters |
| `components/sun-kudos/highlight-kudos-card.tsx` | 109 | B.3 card — sender→arrow→receiver, content, actions |
| `components/sun-kudos/highlight-carousel.tsx` | 125 | "use client" — B.2+B.5 carousel + slide nav |
| `components/sun-kudos/highlight-kudos-section.tsx` | 104 | B_Highlight section wrapper (server component) |
| `components/sun-kudos/carousel-arrow-icons.tsx` | 32 | Shared Left/Right/CardArrow SVG icons (extracted to keep files ≤200 lines) |

## Design Tokens Applied (from MoMorph MCP — never guessed)
- Card: `width 528px`, `border 4px solid #FFEA9E`, `bg #FFF8E1`, `padding 24px 24px 16px`, `border-radius 16px`, `gap 16px`
- Content box: `border 1px solid #FFEA9E`, `bg rgba(255,234,158,0.40)`, `border-radius 12px`, `padding 16px 24px`
- Content text: `Montserrat 700 20px/32px #00101A`, max 3 lines CSS `line-clamp`
- Faded card opacity: `0.45` (side cards)
- Left overlay: `400×525px`, `gradient 90deg #00101A 50%→transparent`
- Right overlay: `400×525px`, `gradient 270deg #00101A 50%→transparent`
- Big nav buttons: `80×80px`, icon `60px`
- Slide nav buttons: `48×48px`, icon `28px`
- Page label: `Montserrat 700 28px/36px #999999`
- Filter buttons: `border 1px solid #998C5F`, `bg rgba(255,234,158,0.10)`, `padding 16px`, `border-radius 4px`
- Filter label: `Montserrat 700 16px/24px #FFFFFF`

## Tests Status
- Type check: **pass** (`npx tsc --noEmit` — no output)
- Unit tests: N/A (UI component, no logic under test; carousel state tested visually)

## Acceptance Criteria
- [x] `highlight-filters.tsx` — two dropdown buttons, options from mockHashtags/mockDepartments, active state tracked in local state
- [x] `highlight-kudos-card.tsx` — UserInfoBlock(sender)→arrow→UserInfoBlock(receiver), time, 3-line content, HashtagList, HeartButton+CopyLinkButton+"Xem chi tiết", `faded` prop
- [x] `highlight-carousel.tsx` — center card prominent + side cards faded, prev/next disabled at boundaries, pagination label `n/total`, empty state
- [x] `highlight-kudos-section.tsx` — SectionHeading pattern + HighlightFilters right-aligned + HighlightCarousel
- [x] Files ≤ 200 lines each (187/109/125/104/32)
- [x] All design values from MoMorph MCP, none guessed
- [x] Consumes Phase 01 foundation components (UserInfoBlock, HashtagList, HeartButton, CopyLinkButton, SectionHeading, mock-data, types)
- [x] i18n via `useTranslations("sunKudos")` keys: sectionSubtitle, highlight.title, highlight.filterHashtag, highlight.filterDepartment, card.viewDetail, emptyKudos

## Mount Snippet (for page.tsx)
```tsx
import { HighlightKudosSection } from "@/components/sun-kudos/highlight-kudos-section";

// Inside page JSX, after the KV/header section:
<HighlightKudosSection />
```

## Props Signatures
```ts
// highlight-filters.tsx
HighlightFilters({ hashtags: Hashtag[], departments: Department[] })

// highlight-kudos-card.tsx
HighlightKudosCard({ kudos: Kudos, faded?: boolean })

// highlight-carousel.tsx
HighlightCarousel({ kudos: Kudos[] })

// highlight-kudos-section.tsx
HighlightKudosSection()  // no props — consumes mock-data internally
```

## Issues / Concerns
None blocking. One observational note: `highlight-filters.tsx` is presentational only — selecting a filter does not actually filter carousel cards per spec ("No real filtering needed — track selected value for active styling"). This is intentional per clarifications.md.
