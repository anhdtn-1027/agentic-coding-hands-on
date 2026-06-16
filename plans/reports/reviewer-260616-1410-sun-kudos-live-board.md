# Code Review: Sun* Kudos Live Board

**Date:** 2026-06-16  
**Branch:** feat/sun-kudo-live-board  
**Reviewer:** reviewer agent (af2b4e3953079d16b)

---

## Scope

- Files: 24 component/type/mock files + page.tsx + vi.json + en.json
- LOC: ~1,100 lines of component code
- MoMorph design: screenId MaZUn5xHXZ (note: MCP tool execution was unavailable; fidelity assessment is based on design annotations embedded in code comments vs implementation)

---

## Overall Assessment

Implementation is structurally sound and demonstrates careful design-annotation discipline (every node has a mm: comment). The section ordering matches the spec (Banner → Input → Highlight → Spotlight → AllKudos+Sidebar). Color tokens (#00101A, #FFEA9E, #FFF8E1, #998C5F) and Montserrat typography are consistently applied. There are **no critical security or data-leak issues**. The most pressing problems are: a **double-padding bug** that will visually narrow the input row and All Kudos section, a **leaderboard avatar size mismatch** (40px vs spec 64px), a **missing `"use client"` on `KudosBanner`** which uses `useTranslations` inside a component that might be rendered from a server context but technically the RSC tree is fine — however the real `"use client"` boundary concern is `KudosPostCard` using `HeartButton` which is client-only, and the outer card is also marked `"use client"` so that's fine. There are also several minor accessibility and convention gaps.

---

## Critical Issues

### C-1 — Double-padding on Input Row (visual layout break)
**File:** `app/[locale]/sun-kudos/page.tsx:46` + `components/sun-kudos/kudos-input-row.tsx:163`  
**Problem:** `page.tsx` wraps the `<KudosInputRow>` section in a `<section>` with `paddingInline: "clamp(16px, 10vw, 144px)"`. Then `KudosInputRow` *re-applies* the exact same `paddingInline: "clamp(16px, 10vw, 144px)"` on its own inner wrapper. On a 1440px viewport this produces 288px of total horizontal padding instead of 144px, making the pill inputs appear half-width.  
**Expected (design mm:2940:13448):** pills fill from x:144 to x:1296 (i.e., one 144px gutter each side).  
**Fix:** Remove the `paddingInline` in `page.tsx` line 46 for the Input section wrapper, OR remove it from `KudosInputRow`'s inner wrapper at line 163. The pattern used by `HighlightKudosSection` and `SectionHeading` is correct — they own their own padding internally and `page.tsx` does not re-add it.

---

### C-2 — Double-padding on All Kudos section (same root cause)
**File:** `app/[locale]/sun-kudos/page.tsx:70` + `components/sun-kudos/all-kudos-section.tsx:36`  
**Problem:** `page.tsx` wraps the All Kudos + Sidebar row in a `<div>` with `paddingInline: "clamp(16px, 10vw, 144px)"` (line 70). `AllKudosSection` then applies the same clamp again internally (line 36). This doubles the left/right inset for the All Kudos card list.  
**Expected:** cards flush to the 144px design gutter, not 288px.  
**Fix:** Remove `paddingInline` from `AllKudosSection`'s inner div (line 36 in all-kudos-section.tsx) since the page-level wrapper already provides it. Or remove it from `page.tsx` line 70 and let the component own it — but pick one source of truth.

---

## High Priority

### H-1 — Leaderboard avatar size: 40×40 vs spec 64×64
**File:** `components/sun-kudos/kudos-leaderboard.tsx:131-148`  
**Problem:** The comment at line 98 says "Avatar 64×64 circle" (matching mm:2940:13516), but the actual rendered `<div>` and `<Image>` are 40×40 (lines 134, 143). The 64px size appears in the comment only.  
**Fix:**
```tsx
// change lines 134-143:
<div style={{ width: 64, height: 64, ... }}>
  <Image width={64} height={64} ... />
```

### H-2 — Leaderboard name font size: 14px vs spec 16px
**File:** `components/sun-kudos/kudos-leaderboard.tsx:160-165`  
**Problem:** The comment at line 98 says "name Montserrat 700 16px/24px #FFEA9E" but the implementation renders `fontSize: 14` at line 161. Description text is also 12px (line 174) vs spec 14px/20px.  
**Fix:** `fontSize: 16, lineHeight: "24px"` for name; `fontSize: 14, lineHeight: "20px"` for description.

### H-3 — UserInfoBlock name font size: 14px vs spec 16px
**File:** `components/sun-kudos/user-info-block.tsx:52-58`  
**Problem:** The file header comment says "Name: Montserrat 700 16px/24px #00101A" but the implementation renders `fontSize: 14` and `lineHeight: "20px"`. Also `className="flex flex-col items-start w-full"` at line 45 should be `items-center` since both sender and receiver are centered-column per design — the text-align:center on children only partially compensates.  
**Fix:** `fontSize: 16, lineHeight: "24px"` for name span (line 52); `items-center` on line 45 wrapper.

### H-4 — `KudosBanner` uses `useTranslations` but is NOT marked `"use client"`
**File:** `components/sun-kudos/kudos-banner.tsx:9-11`  
**Problem:** `useTranslations` from `next-intl` can be called from both server and client components — BUT this component uses `Image` with `fill` which requires a positioned parent, and it embeds inline styles. More importantly: the component is a server component that calls `useTranslations` — this is valid BUT only if the `next-intl` server provider is properly set up. Given the page does `setRequestLocale(locale)` which is the correct RSC pattern, this is technically fine for `next-intl` v3+.  
**Verdict:** Not a bug for next-intl v3 RSC setup, but worth documenting explicitly in a comment to avoid future confusion. **Downgrade to Minor.**

### H-5 — Highlight section inlines its own heading instead of using `SectionHeading`
**File:** `components/sun-kudos/highlight-kudos-section.tsx:46-97`  
**Problem:** `HighlightKudosSection` manually inlines subtitle + divider + title (lines 44-96) instead of using the shared `SectionHeading` component. It duplicates the pattern but the gap between subtitle and divider is `40px` (line 26) vs `SectionHeading`'s gap of `16px`. The `HighlightKudosSection` heading gap between its own subtitle and divider is also 40px (its outer `flex-col gap: 40`), while `SectionHeading` and the Spotlight/AllKudos sections use `gap: 16`. This means the Highlight section's header spacing differs visually from all other sections.  
**Design:** mm:2940:13452 shows B.1_header gap 40px, but mm:2940:13453 Header inner-flex gap is between subtitle→divider→title-row — the 40px is the section-level gap between header and carousel, not the heading internal gap.  
**Fix:** Use `SectionHeading` for the subtitle+divider+title block; then put filter row in a `justify-content: space-between` wrapper alongside the title. This also removes the code duplication.

### H-6 — Carousel cards: `faded` side cards stay visible underneath gradient on small viewports
**File:** `components/sun-kudos/highlight-carousel.tsx:73-97`  
**Problem:** The left/right gradient overlays are fixed at `width: 400` pixels. On viewports narrower than ~900px, the 400px gradient on each side will completely obscure the visible area, making the center card invisible or heavily clipped. The gradient width should be proportional or capped at something like `min(400px, 30vw)`.  
**Fix:** Change `width: 400` to `width: "min(400px, 30vw)"` in both gradient dividers (lines 73, 86).

---

## Medium Priority

### M-1 — AllKudosSection padding architecture (structural DRY violation)
The section comments say "Phase 05 scope: only C.2 list column" but AllKudosSection wraps its card list in a `paddingInline` div (line 34-40), and the page also adds padding. Even ignoring the double-padding bug (C-2 above), the inner div at line 40 that holds only the card list has `paddingInline` which is confusing when the page.tsx wrapper already handles outer padding. Per the C-2 fix, one of these should be removed.

### M-2 — `KudosSidebar` leaderboard order: design vs implementation
**File:** `components/sun-kudos/kudos-sidebar.tsx:35-45`  
**Problem:** The sidebar renders `KudosStatsBlock` → `leaderboardGifts` → `leaderboardRankUp`. The design (mm:2940:13488) order in the comments at line 35 says "D.3 leaderboard gifts" but the inline comment at line 41 says "leaderboard rank-up" comes second. This order (Stats → Gifts → RankUp) may or may not match the design. **Cannot confirm without MoMorph MCP access** — flagged for manual verification.

### M-3 — `SpotlightBoard` ticker is not animated (design has scrolling text)
**File:** `components/sun-kudos/spotlight-board.tsx:107-127`  
**Problem:** The design shows a ticker/marquee strip of recent recipients. The implementation renders them as static `<p>` tags with `overflow: hidden; textOverflow: ellipsis`. They won't scroll/animate. This is a significant visual difference from a live board design.  
**Fix:** Wrap in a CSS marquee animation or use `animation: marquee linear infinite` on the inner container. This is a presentational enhancement, not a hard bug given the note says "Presentational" pass, but the design explicitly shows movement.

### M-4 — Highlight card `categoryLabel` extraction is fragile
**File:** `components/sun-kudos/highlight-kudos-card.tsx:26-27`  
**Problem:**
```ts
const categoryLabel = kudos.hashtags.find((h) => !h.startsWith("#"));
const tagList = kudos.hashtags.filter((h) => h.startsWith("#"));
```
This splits hashtags into "category" (strings not prefixed with #) vs "tags" (prefixed with #). This convention is implicit — if a future hashtag doesn't use the `#` prefix by accident, it silently becomes a category label. The `Hashtag` type has a `label` field that could formally distinguish categories; the split logic should either use a proper type discriminant or be documented explicitly.  
**Severity:** suggestion — no prod bug today since mock data is consistent, but fragile.

### M-5 — `KudosPostCard` image gallery: no alt text on individual images
**File:** `components/sun-kudos/kudos-post-card.tsx:149-163`  
**Problem:** Gallery images use `alt=""` (line 153). While empty alt is acceptable for purely decorative images, user-uploaded kudos photos likely have semantic meaning. The wrapping div has `aria-label="Image 1"` but this is on the container, not the `<img>`. Screen readers will skip the images entirely.  
**Fix:** If image descriptions aren't available, keep `alt=""` but add `role="presentation"` to the `<Image>` to be explicit. If alt text is available from API, use it.

### M-6 — `HeartButton` count display order: count then icon vs design
**File:** `components/sun-kudos/heart-button.tsx:63-98`  
**Problem:** The implementation renders count (left) then heart icon (right). Per mm:I3127:21871;256:5175 C.4.1_Hearts the design typically shows heart icon then count. Verify against design. If icon should be first, swap the order.

### M-7 — `FilterDropdown` listbox items miss keyboard navigation
**File:** `components/sun-kudos/highlight-filters.tsx:128-150`  
**Problem:** The dropdown `<ul role="listbox">` and `<li role="option">` items only handle `onClick`. There's no `onKeyDown` handler for arrow-key navigation through options, no `tabIndex` on `<li>` items, so keyboard users can't navigate the dropdown. `aria-haspopup="listbox"` is correct but the listbox isn't keyboard-operable.  
**Fix:** Add `tabIndex={0}` and `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { ... }}}` to each `<li>`, and add arrow-key navigation in the listbox.

### M-8 — `console.log` statements in production code
**Files:**
- `spotlight-canvas.tsx:162` — `console.log("[SpotlightCanvas] clicked:", node.name)`
- `spotlight-board.tsx:36` — `console.log("[SpotlightBoard] node clicked:", node.name)`  
- `kudos-stats-block.tsx:116` — `console.log("Mở quà clicked")`

These debug logs ship to production. Remove before merge.

---

## Minor / Suggestions

### S-1 — `KudosBanner` paddingLeft/paddingRight clamp is inverted
**File:** `components/sun-kudos/kudos-banner.tsx:47-48`  
```ts
paddingLeft: "clamp(16px, 3vw, 0px)",   // min > max — always 16px
paddingRight: "clamp(16px, 3vw, 0px)",  // same issue
```
`clamp(min, preferred, max)` requires `min ≤ max`. Here `min=16px` and `max=0px` — this is invalid CSS. All browsers will resolve to the `min` (16px) but it's wrong semantically and confusing.  
**Fix:** Either `paddingLeft: "clamp(0px, 3vw, 16px)"` (grow from 0 to 16px) or just remove these lines since the 1152px max-width + `mx-auto` already centers the column.

### S-2 — `SectionHeading` rendered as `<h2>` even in `AllKudosSection` which also uses `<h2>` heading level
**Files:** `section-heading.tsx:43`, `all-kudos-section.tsx:27`, `spotlight-board.tsx:45`  
All three sections use `SectionHeading` which renders `<h2>`. The page has no `<h1>` (banner title is `<h1>` — good) but three sequential `<h2>` with the same landmark structure is fine. Just confirming no heading level skip.

### S-3 — `KudosInputRow` uses `<style>` JSX injection for placeholder color
**File:** `components/sun-kudos/kudos-input-row.tsx:146-154`  
The `<style>` tag with `kudos-pill-input::placeholder` is a global CSS injection from a component. This works but pollutes the global scope. Should use a CSS module or Tailwind's `placeholder:` variant instead.

### S-4 — `spotlight-canvas.tsx` is exactly at the 200-line limit
The file is 200 lines (at the limit per convention). Acceptable as-is but worth splitting `TooltipState`/tooltip render into a sub-component if complexity grows.

### S-5 — `UserInfoBlock` `variant` prop is unused
**File:** `components/sun-kudos/user-info-block.tsx:13-15`  
The `variant?: "sender" | "receiver"` prop is declared in the interface but the component body ignores it entirely (no `if (variant === ...)` branches). Dead code — either implement differentiated styling for sender vs receiver per design, or remove the prop.

### S-6 — `KudosBanner` uses server-side `useTranslations` without `"use client"` but the banner subtitle `"Hệ thống ghi nhận và cảm ơn"` in the design is static. No real risk, just confirm with next-intl server provider setup.

### S-7 — i18n: `en.json` footer copyright not translated
**File:** `messages/en.json:29`  
`"copyright": "Bản quyền thuộc về Sun* © 2025"` — the en.json copyright is still in Vietnamese, same as vi.json. Both files have identical text here. Minor, cosmetic.

### S-8 — `KudosStats` has no `badge`/`stars` usage
`KudosUser` has `stars` and `badge` fields (types.ts:8-9), populated in mock-users.ts, but no component renders them. If the design shows a badge/star count on the user block, this is a missing feature. If it's intentionally deferred, the dead fields add noise to the type.

---

## Edge Cases Found

1. **Carousel at total=1:** With a single card, `atStart && atEnd` are both true simultaneously. Both nav buttons disable. The gradient overlays still render, fading non-existent side cards — no visual harm but the entire nav bar (B.5) with prev/next disabled looks odd. Consider hiding it when total ≤ 1.

2. **Spotlight zoom + pan state not reset on node data change:** `transform` state in `SpotlightCanvas` persists across `nodes` prop changes. If a filter is applied (future) and nodes change, the viewport stays panned/zoomed to the old position. The existing double-click-to-reset handler covers this partially.

3. **Carousel index out of bounds on live data refresh:** `currentIndex` is client state; if `kudos` prop shrinks (real API, pagination), `currentIndex` could be ≥ `total`. The `Math.max(0, i-1)` / `Math.min(total-1, i+1)` guards on the nav buttons prevent navigating further out but the initial render at a stale index would show an empty/wrong position. Fix: add `useEffect(() => { if (currentIndex >= kudos.length) setCurrentIndex(0); }, [kudos.length])`.

4. **`CopyLinkButton` clipboard error silently swallowed (empty catch):** `copy-link-button.tsx:31-33`. The catch block is intentionally empty — fine for this light interaction, but if clipboard API fails (HTTP non-localhost in Chrome), the user gets no feedback at all. Consider showing a fallback toast: "Copy failed — use Ctrl+C".

5. **`SpotlightCanvas` wheel event: `e.preventDefault()` without `{passive: false}`:** React synthetic wheel events cannot call `preventDefault` to block page scroll without being registered as a non-passive listener. The implementation uses `onWheel` (React synthetic event) which IS passive by default in React 17+. Result: `preventDefault` is ignored, and the page scrolls while the user tries to zoom. This is a real UX bug.  
**Fix:** Use `useEffect` to attach a non-passive wheel listener directly to the SVG element's DOM node:
```ts
useEffect(() => {
  const el = svgRef.current;
  if (!el) return;
  const handler = (e: WheelEvent) => {
    e.preventDefault();
    // zoom logic
  };
  el.addEventListener('wheel', handler, { passive: false });
  return () => el.removeEventListener('wheel', handler);
}, []);
```

---

## Positive Observations

- Every JSX node has a `// mm:` reference comment — excellent design traceability.
- Color tokens are derived from design (no guessed values); #00101A, #FFEA9E, #FFF8E1, #998C5F are consistently applied across all 24 files.
- `spotlight-scatter.ts` uses purely deterministic positions (no `Math.random()`), so the word cloud is stable across SSR/client hydration — good.
- `FilterDropdown` has correct `aria-haspopup="listbox"` + `aria-expanded` on the trigger button.
- `HeartButton` correctly `disabled` when `kudos.isOwn === true`.
- Empty states are translated: `t("emptyKudos")` → "Hiện tại chưa có Kudos nào." / "Chưa có dữ liệu" both present.
- `CopyLinkButton` has `useEffect` cleanup (timer clear) on unmount — correct.
- File naming is kebab-case throughout.
- All `<Image>` tags with `fill` have a positioned parent container — no Next.js Image layout errors.

---

## Pixel Fidelity Assessment

| Section | Expected (mm: spec) | Actual | Match? |
|---------|---------------------|--------|--------|
| Page bg | #00101A | `style={{ background: "#00101A" }}` | ✓ |
| Banner height | 512px | `height: 512` | ✓ |
| Banner overlay tint | ~rgba(0,16,26,0.35) | `rgba(0,16,26,0.35)` | ✓ |
| Input pills height | 72px | `height: 72` | ✓ |
| Input pill radius | 68px | `borderRadius: 68` | ✓ |
| Input pill border | 1px #998C5F | `1px solid #998C5F` | ✓ |
| Input pill bg | rgba(255,234,158,0.10) | same | ✓ |
| Input **gutter** | 144px each side | **288px (double-padded)** | ✗ C-1 |
| Highlight card width | 528px | `width: 528` | ✓ |
| Highlight card border | 4px solid #FFEA9E | `border: "4px solid #FFEA9E"` | ✓ |
| Highlight card bg | #FFF8E1 | `background: "#FFF8E1"` | ✓ |
| Highlight card radius | 16px | `borderRadius: 16` | ✓ |
| Highlight card content box | 1px #FFEA9E, rgba(255,234,158,0.40) | same | ✓ |
| Highlight line-clamp | 3 lines | `WebkitLineClamp: 3` | ✓ |
| Carousel side opacity | 0.45 | `opacity: faded ? 0.45 : 1` | ✓ |
| Spotlight canvas radius | 47px | `borderRadius: 47` | ✓ |
| Spotlight canvas border | 1px #998C5F | same | ✓ |
| Spotlight canvas bg | rgba(0,0,0,0.70) | same | ✓ |
| Spotlight highlighted color | rgba(241,118,118,1) | `COLOR_HIGHLIGHTED` | ✓ |
| Feed card bg | #FFF8E1 | `backgroundColor: "#FFF8E1"` | ✓ |
| Feed card radius | 24px | `borderRadius: 24` | ✓ |
| Feed card line-clamp | 5 lines | `WebkitLineClamp: 5` | ✓ |
| Sidebar stats bg | #00070C | same | ✓ |
| Sidebar stats radius | 17px | `borderRadius: 17` | ✓ |
| Leaderboard avatar | 64×64 | **40×40** | ✗ H-1 |
| Leaderboard name size | 16px | **14px** | ✗ H-2 |
| UserInfoBlock name size | 16px | **14px** | ✗ H-3 |
| Heart button layout | icon+count | count+icon (reversed?) | ? M-6 |

---

## Recommended Actions (prioritized)

1. **Fix double-padding** (C-1, C-2) — most visually impactful; remove `paddingInline` from `page.tsx` input/All Kudos wrappers since the components own their own padding.
2. **Fix leaderboard avatar** 40→64px (H-1) and font sizes (H-2, H-3).
3. **Fix `SpotlightCanvas` wheel passivity** (edge case 5) — real UX bug on all desktop browsers.
4. **Remove `console.log`** statements (M-8).
5. **Add keyboard nav to FilterDropdown** (M-7).
6. Fix `clamp` inversion in `KudosBanner` (S-1).
7. Fix `UserInfoBlock.variant` dead prop (S-5).
8. Verify heart button icon/count order against design (M-6).
9. Verify sidebar leaderboard order (M-2) manually against Figma.
10. Fix carousel edge-case with single card (edge case 1).

---

## Metrics

- Type Coverage: high — all props typed, no `any` found
- Linting Issues: 0 (build clean per brief)
- Files > 200 lines: 0 (test files excluded; spotlight-canvas.tsx is exactly 200)
- `console.log` in production: 3 occurrences
- Missing i18n keys: 0 (all used keys present in both locales)

---

## Unresolved Questions

1. What is the canonical leaderboard rendering order (Gifts first or RankUp first)? Cannot confirm from code alone — needs MoMorph verification against mm:2940:13488.
2. Does the design show the heart icon before or after the count number in `HeartButton`? (M-6)
3. Is the ticker strip in the Spotlight section supposed to animate (marquee)? The static implementation is clearly incomplete if yes.
4. Does the `UserInfoBlock` variant (`sender`/`receiver`) trigger any visual differentiation in the design (e.g., different label text, different alignment)? Currently the prop is dead.
5. MoMorph MCP tool execution was blocked (HTTP SSE transport not supported by current mcp-manager skill). Design values above are sourced from the `mm:` annotations embedded in code — treat high-confidence mismatches as confirmed, but edge cases should be re-verified when MCP access is restored.

---

**Status:** DONE_WITH_CONCERNS  
**Summary:** 24 files reviewed. No security/data-leak issues. Two critical double-padding layout bugs (C-1, C-2) will cause visible pixel mismatch on all viewports. Three fidelity mismatches in leaderboard/user block text sizes (H-1, H-2, H-3). One real UX bug in Spotlight zoom (passive wheel listener). Fidelity score: **6.5/10** — foundation is faithful but the double-padding and size mismatches are visually prominent.  
**Concerns:** C-1 and C-2 (double-padding) must be fixed before the design can be considered pixel-faithful. H-1/H-2/H-3 (avatar and font sizes) together significantly impact the sidebar and card appearance.
