# Code Review — Award System Page
**Date**: 2026-06-12 | **Branch**: feat/system-award | **Reviewer**: reviewer agent

---

## Scope
- `app/[locale]/awards-information/page.tsx` (37 lines)
- `components/awards/award-hero.tsx` (86 lines)
- `components/awards/award-nav.tsx` (124 lines)
- `components/awards/award-detail-block.tsx` (400 lines) ⚠️
- `components/awards/award-system-content.tsx` (238 lines) ⚠️
- `components/shared/site-header.tsx` (166 lines — diff: active-nav logic)
- `messages/vi.json`, `en.json`, `ja.json` — awardSystem namespace (34 keys each)

**TypeScript**: 0 errors | **ESLint**: 0 errors | **Build**: clean

---

## Overall Assessment
Solid implementation. All section slugs match homepage deep-links, i18n parity is perfect (34/34 keys across all 3 locales, no leftover Vietnamese in en/ja), auth pattern mirrors homepage exactly, and security posture is clean. Two files exceed the 200-line limit (award-detail-block.tsx at 400, award-system-content.tsx at 238). The main behavioral issue is a scroll-spy vs. nav-click race that causes flickering of the active nav item during smooth-scroll animations. One accessibility concern (low-contrast "Or" separator text) and one minor responsive alignment ambiguity.

**Score: 7.5 / 10**

---

## Critical Issues
None.

---

## High Priority

### H1 — Scroll-spy overrides nav click during smooth-scroll (UX behavior bug)
**File**: `award-system-content.tsx` lines 119–151 + `award-nav.tsx` line 60

When the user clicks a nav item (e.g., "MVP" from "Top Talent"), `setActiveId(id)` fires immediately and `scrollIntoView({ behavior: "smooth" })` begins. During the ~500ms smooth-scroll animation the IntersectionObserver fires on every intermediate section that enters the viewport. The `visibilityMap` selects the section with the highest `intersectionRatio`—which will be whatever section is most visible *during* the scroll—and calls `setActiveId`, overriding the click intent. Result: the active nav item flickers through intermediate entries before settling on the clicked one.

**Fix**: add a short scroll-lock after a nav click:
```tsx
const scrollLockRef = useRef(false);
// In AwardNav handleClick: scrollLockRef.current = true, clearTimeout after 800ms
// In observer callback: if (scrollLockRef.current) return;
```
Or pass `scrollLockRef` down to the nav component and set it in `onSelect`.

---

### H2 — `award-detail-block.tsx` at 400 lines (2× file-size limit)
**Rule**: project convention ≤ 200 lines per file.

The file contains 3 private icon components (`IconDiamond`, `IconLicense`, `IconTarget`) + `AwardDetailBlock`. `IconTarget` is also defined identically in `award-nav.tsx`—a DRY violation.

**Fix options**:
1. Extract `components/awards/award-icons.tsx` with all three icons exported.
2. This collapses `award-detail-block.tsx` to ~310 lines — still over limit. Further extract the qty-row and value-row into sub-components inside the same file, or accept ~310 as a borderline case given dense inline styles.
3. At minimum, de-duplicate `IconTarget`.

---

## Medium Priority

### M1 — "Or" separator text is near-invisible (WCAG fail)
**File**: `award-detail-block.tsx` line 333

`t("or")` is rendered with `color: "rgba(46,57,64,1)"` (#2E3940) on the `#00101A` page background. Contrast ratio: **1.63:1** (AA requires ≥ 4.5 for body text, ≥ 3.0 for large text). The Signature section is the only place this matters at runtime but it will be invisible to users with low vision and near-invisible to all users.

Note: this color is taken from the Figma spec divider line (mm:313:8499). If the design intentionally uses a subdued "Or" divider, the text should at minimum be `#FFFFFF` or a mid-grey like `rgba(160,170,176,1)` to remain readable. Flag with designer before changing.

### M2 — `alignSelf: "flex-start"` cancels `items-center` on mobile
**File**: `award-detail-block.tsx` line 141

The picture wrapper has `alignSelf: "flex-start"` as an inline style. The parent row uses `className="flex flex-col items-center lg:items-start ..."`. On mobile (`flex-col`), `items-center` centres children on the cross-axis (horizontal), but `alignSelf: "flex-start"` on the picture element overrides this and pushes the badge image to the left edge instead of centering it.

On a 375px phone with 16px side padding (343px content width), the 336px badge would appear left-aligned. Whether this matches the design intent is unclear—the clarification says "image always on top" but doesn't specify alignment. If the design shows the image centred on mobile, remove `alignSelf: "flex-start"` from the picture block (it's only needed on desktop to prevent flex-stretch from distorting the image, and that case is handled by `lg:items-start` on the parent).

### M3 — `aria-current="true"` instead of `aria-current="location"` on section nav
**File**: `award-nav.tsx` line 89

For within-page scroll navigation (section anchors), `aria-current="location"` is the correct ARIA value per the [WAI-ARIA spec](https://www.w3.org/TR/wai-aria-1.1/#aria-current). `aria-current="true"` is a valid generic value but may not be announced meaningfully by all screen readers for navigation context.

Change: `aria-current={isActive ? "location" : undefined}`

---

## Low Priority

### L1 — Duplicate `IconTarget` SVG between `award-nav.tsx` and `award-detail-block.tsx`
Same 24×24 SVG inline with identical paths. Related to H2.

### L2 — `award-system-content.tsx` at 238 lines (marginally over 200-line limit)
The `AWARDS` data array (94 lines) dominates. Extracting it to `awards/award-data.ts` would bring the component to ~145 lines and make both files clearly under the limit.

### L3 — Redundant `background: "#00101A"` on page wrapper
**File**: `awards-information/page.tsx` line 24

`layout.tsx` already sets `body { background: "#00101A" }`. The page-level `style={{ background: "#00101A" }}` on the flex wrapper div is redundant. This is a pre-existing pattern (same in `homepage-client.tsx`, `login/page.tsx`, `sun-kudos/page.tsx`) so not a regression—just unnecessary.

### L4 — Hash navigation does not update URL on click (minor UX)
**File**: `award-nav.tsx` line 56

`e.preventDefault()` suppresses the default anchor behavior, which means clicking "MVP" does not update the browser URL to `#mvp`. If a user tries to copy the URL after clicking a nav item and share it, they get the base URL without the hash. Deep-linking only works on page load (the second `useEffect` handles this). Consider using `history.pushState` or `window.location.hash = id` inside `handleClick` alongside `scrollIntoView`. Low impact for this type of page.

### L5 — `award-hero.tsx` logo container has fixed `height: 150` without responsive override
The container `<div style={{ height: 150 }}>` with the 338×150 image will be fine on desktop but on narrow screens the image has `style={{ flexShrink: 0 }}` so it will not shrink below 338px—potentially overflowing the 150px container height is fine (`overflow` is not set), but the image may overflow its parent's width. This mirrors the homepage `hero-section.tsx` pattern (same 451×200 without responsive override), so it's consistent with the existing codebase. Low risk.

---

## Edge Cases Found (Scouting Phase)
- **Observer/hash race**: The first `useEffect` calls `setupObserver()` (mounts observer), and the second `useEffect` runs the hash handler 100ms later. Because both run on mount and `setupObserver` is called first (React runs effects top-to-bottom), the observer is active when `scrollIntoView` fires from the hash effect at +100ms. This means the scroll triggered by the hash will fire the observer callback and potentially re-override `activeId` back to whatever section is most visible *after* the scroll—which may not be the hash target if it's a short section at the bottom. This is the same H1 race manifesting in the hash path.
- **`window.location.hash` on SSR**: The `award-system-content.tsx` is a `"use client"` component so `window` access is safe. No SSR hazard.
- **Stale `visibilityMap` on re-mount**: `visibilityMap` is declared inside `setupObserver` (via `useCallback`) so it is fresh on each observer setup. No stale-closure issue.
- **`observerRef.current!.observe(el)` non-null assertion**: Safe because the line is always reached after `observerRef.current = new IntersectionObserver(...)`. No production risk.

---

## Positive Observations
- Section IDs exactly match homepage deep-links (`top-talent`, `top-project`, `top-project-leader`, `best-manager`, `signature-2025-creator`, `mvp`). Zero risk of broken links.
- i18n: 34/34 keys parity across vi/en/ja. No untranslated strings. No leftover Vietnamese in en/ja.
- Security: no `dangerouslySetInnerHTML`, no unsafe DOM, all i18n text passes through `useTranslations` safely.
- Auth: correctly delegates gate to `proxy.ts`; page calls `auth()` only for session data (role/name for the header) — consistent with homepage pattern.
- `mixBlendMode: "screen"` on the badge picture block matches `award-card.tsx` exactly. Consistent glow treatment.
- `scrollMarginTop: 100` and sticky nav `top: 100` are consistent — offset accounts for 80px header + 20px breathing room.
- TypeScript clean, ESLint clean, 0 type errors.
- Active-state single-selection: single `activeId` state string guarantees no multiple-active states are possible.
- Clarifications documented and followed for all four ambiguous decisions (route, i18n scope, mobile nav, section slugs).

---

## Recommended Actions (Priority Order)
1. **(H1)** Add a scroll-lock ref in `award-system-content.tsx` to prevent the observer from overriding `activeId` during nav-click smooth-scroll (set `scrollLockRef.current = true` on click, auto-clear after ~800ms).
2. **(H2 + L1)** Extract `components/awards/award-icons.tsx` to share `IconTarget` between nav and detail-block; this also reduces `award-detail-block.tsx` line count toward the 200-line target.
3. **(M1)** Confirm "Or" separator text color with designer — if not intentionally subdued, change to `#FFFFFF` or a visible grey (contrast ≥ 4.5:1 against `#00101A`).
4. **(M2)** Verify mobile image alignment intent; remove `alignSelf: "flex-start"` from the picture wrapper if centred is correct.
5. **(M3)** Change `aria-current="true"` to `aria-current="location"` in `award-nav.tsx`.
6. **(L2)** Extract `AWARDS` data to `award-data.ts` to bring `award-system-content.tsx` under 200 lines.

---

## Metrics
- TypeScript errors: 0
- ESLint errors: 0
- Files over 200-line limit: 2 (award-detail-block.tsx: 400, award-system-content.tsx: 238)
- i18n key parity: 34/34 (vi=en=ja)
- Security issues: 0

---

## Unresolved Questions
1. Was the `rgba(46,57,64,1)` color for the "Or" separator text intentional in the Figma spec, or is it meant to match the divider line (making it decorative-only)?
2. Should the award badge image be centred or left-aligned on mobile? The clarification doc says "stacks vertically" but does not specify alignment.
3. Is the URL-not-updating-on-nav-click behavior acceptable (by product decision), or should `history.pushState` be added?

---

**Status**: DONE_WITH_CONCERNS
**Summary**: Implementation is functionally correct and production-safe. Main concern is the scroll-spy vs. nav-click race (H1) which causes visible active-state flicker on click in the desktop nav; file-size violations (H2) break project convention. No security, auth, or data-correctness issues found.
