# Code Review — Homepage SAA responsive (content full-bleed, no side gutter)

Screen: Homepage SAA (i87tDx10uM) · viewports tested: 1440 / 768 / 390 · evidence: Playwright measurements + screenshots.

## Reported bug (CONFIRMED → FIXED)

Content overflowed full screen width with no side gap, unlike the design's 144px gutter.

**Root cause:** No shared page container. `HeroSection` and `RootFurtherContent` each self-contain a centered max-width + padding, but `AwardsGrid` was bare `w-full` (no max-width, no padding). Two effects:
1. Awards header + grid stretched edge-to-edge (0px gutter vs 144px on siblings).
2. Grid used `auto-fill minmax(280px,1fr)` → ~4–5 columns on wide screens instead of the design's 3 (violated TC ID-15/16).

Measured before (1440px): awards left/right gutter = 0/0; columns ≈ 4–5.

## Fixes applied

| File | Change |
|------|--------|
| `components/homepage/awards-grid.tsx` | Wrapped in centered `maxWidth:1152` + `paddingInline:24` container (144px desktop gutter, matches siblings); grid → `grid-cols-2 lg:grid-cols-3` (2 tablet/mobile, 3 desktop per spec C2 / TC ID-15/16) |
| `components/homepage/kudos-block.tsx` | Added `paddingInline:24` so the 1120px card never touches screen edges |
| `components/shared/site-header.tsx` | Side padding `144px` → `clamp(16px, 9.52vw, 144px)` (was forcing horizontal scroll below ~900px) |
| `components/shared/site-footer.tsx` | Side padding → `clamp(16px, 6.25vw, 90px)` + `flex-wrap` + `rowGap:24px` (graceful stack) |

## Verification (after)

| Viewport | Award columns | Side gutter | Horizontal overflow |
|----------|---------------|-------------|---------------------|
| 1440 (desktop) | 3 ✅ | 137px ≈144 (matches hero/root-further) ✅ | none ✅ |
| 768 (tablet) | 2 ✅ | 24px ✅ | none ✅ (scrollW 756) |
| 390 (mobile) | 2 ✅ | 24px ✅ | **still present** ⚠️ |

`tsc --noEmit` clean · eslint clean on changed files.

## Residual finding (OUT OF SCOPE — needs design)

At < ~600px the page still scrolls horizontally. Offenders are fixed-width **desktop-only** layouts with no mobile design in Figma (1440 frame only):
- Header nav = 3 inline links (~564px) — needs responsive collapse (hamburger).
- Kudos block — absolute `width:457px` panel inside a fixed `1120×500` card — needs vertical stacking.
- Hero `ROOT FURTHER` logo (451px fixed) overflows narrow screens.

Properly fixing these means inventing un-designed mobile UI (against MoMorph "no guessing visuals" rule). Recommend a separate task once a mobile/tablet design exists.

## Unresolved questions
- Is true mobile (<600px) in scope? Design provides desktop (1440) only.
- Desired mobile nav pattern (hamburger drawer vs. wrap)?
