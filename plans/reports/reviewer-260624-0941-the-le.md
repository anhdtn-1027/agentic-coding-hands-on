# Code Review — Thể lệ (SAA Rules) modal + FAB expanded menu

**Date:** 2026-06-24  
**Branch:** feat/the-le  
**Plan:** plans/260624-0925-the-le-rules-modal/plan.md

---

## Scope
- `components/the-le/*` (6 files — modal, data, hero-tier-row, collectible-badge, icons, barrel)
- `components/homepage/widget-button.tsx` (refactored FAB)
- `app/[locale]/layout.tsx` (KudosBoardProvider lift)
- `app/[locale]/sun-kudos/page.tsx` (provider removed)
- `app/[locale]/homepage-client.tsx` (wiring)
- `messages/{vi,en}.json` (theLe namespace)
- `e2e/the-le.spec.ts` (5 new tests)

---

## Overall Assessment

Feature is functionally correct. The provider lift is clean (no double-provider, no lost state). i18n is complete with VI/EN parity. The modal open/close handoffs are race-free (React 18 batching). Z-index stacking is correct. The two moderate a11y gaps below are the main things that need attention before merge.

---

## Critical Issues

None.

---

## High Priority

### H1 — TheLeModal missing Tab key focus trap  
**File:** `components/the-le/the-le-modal.tsx:49–51`  
**Impact:** Keyboard-only users can Tab out of the panel into the background page. Pressing Escape only works while focus is inside the panel. Once focus escapes, the panel cannot be closed via keyboard. This breaks WCAG 2.1 SC 2.1.2 (No Keyboard Trap in the intended direction) and ARIA Dialog pattern.  
**Evidence:** `WriteKudosModal` (`write-kudos-modal.tsx:161–183`) has a full Tab trap. `TheLeModal` handles `Escape` but has no `if (e.key !== "Tab")` guard.  
**Fix:** Copy the Tab trap from `write-kudos-modal.tsx` into `the-le-modal.tsx`'s `handleKeyDown`. Add `tabIndex={-1}` to the panel div so it can receive focus programmatically, then query `'button, [tabindex]:not([tabindex="-1"])'` for the cycle. Also add `tabIndex={-1}` on the panel `div` so the initial `querySelector('button')` finds it reliably across browsers.

```tsx
function handleKeyDown(e: React.KeyboardEvent) {
  if (e.key === "Escape") { onClose(); return; }
  if (e.key !== "Tab" || !panelRef.current) return;
  const focusable = Array.from(
    panelRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault(); last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault(); first.focus();
  }
}
```

---

## Medium Priority

### M1 — `aria-label` on dialog element is hardcoded VI string  
**File:** `components/the-le/the-le-modal.tsx:81`  
```tsx
aria-label="Thể lệ SAA"   // always VI regardless of locale
```
When locale=`en`, the dialog's accessible name is still "Thể lệ SAA". Screen readers announce it in Vietnamese to EN-locale users.  
**Fix:** Either use `aria-labelledby` pointing to the `<h2>` (add `id="the-le-modal-title"` to the h2 and `aria-labelledby="the-le-modal-title"` to the div), or use `t("title")` for the aria-label. `aria-labelledby` is preferred per ARIA authoring practices.

```tsx
// h2:
<h2 id="the-le-modal-title" style={...}>{t("title")}</h2>
// panel div:
aria-labelledby="the-le-modal-title"
// (remove aria-label)
```

### M2 — `next/image` fill without `sizes` prop  
**File:** `components/the-le/the-le-collectible-badge.tsx:49–52`  
```tsx
<Image src={imageSrc} alt={...} fill style={{ objectFit: "cover" }} onError={...} />
```
Without `sizes`, Next.js generates all breakpoint variants assuming `100vw`, which for a 64×64 badge circle is massive over-generation. In dev this produces a noisy console warning: `Image with src "..." has "fill" but is missing "sizes"`.  
**Fix:** Add `sizes="64px"` (the container is a fixed 64×64 div).

### M3 — File sizes exceed 200-line convention  
- `components/the-le/the-le-modal.tsx`: **448 lines** (convention: <200)  
- `components/homepage/widget-button.tsx`: **288 lines** (convention: <200)

The modal bloat is almost entirely inline styles duplicating Figma tokens. This is consistent with the MoMorph approach, but the convention is not met. Widget-button could split the collapsed/expanded into two sub-components.  
**Suggestion (not blocking):** Extract the two expanded action buttons (`TheLeButton`, `WriteKudosButton`) and the collapsed pill into sub-components. The modal is harder to split without losing the Figma node comment trail.

---

## Low Priority

### L1 — Dead `onClick` prop on WidgetButton  
**File:** `components/homepage/widget-button.tsx:15–16`  
```tsx
/** Legacy: kept for backward compat; not used when expanded menu is present */
onClick?: () => void;
```
There are zero callers that pass `onClick`. The comment says "backward compat" but there is no old caller anywhere in the codebase. Dead API surface.  
**Fix:** Remove `onClick` from `WidgetButtonProps` and `handleExpand`.

### L2 — No unit tests for `the-le/*` components or refactored `widget-button`  
There are no test files under `components/the-le/`. `widget-button.tsx` was significantly refactored but has no unit tests. The e2e covers the happy paths but misses:
- Escape key closes the panel
- Backdrop click closes the panel  
- Tab key contained inside panel (will fail until H1 is fixed)
- FAB renders only on homepage (not on awards/login)
- `HeroTierRow` renders i18n condition + description correctly
- `CollectibleBadgeItem` renders label + hides image on error

### L3 — Body scroll not locked when modal open  
Neither `TheLeModal` nor `WriteKudosModal` set `document.body.style.overflow = "hidden"` when open. The background page scrolls while the rules panel is visible. The existing `WriteKudosModal` has the same behavior (so this is a codebase-wide gap, not a regression), but worth noting as a UX polish item.

### L4 — FAB expanded state has no `aria-expanded` on collapsed button  
**File:** `components/homepage/widget-button.tsx:204–219`  
The collapsed pill button that triggers expansion does not have `aria-expanded={expanded}` or `aria-haspopup="menu"`. Screen reader users have no indication that activating it will reveal a menu.  
**Fix:** Add `aria-expanded={expanded}` and `aria-haspopup="true"` to the collapsed pill `<button>`.

---

## Edge Cases Found (not caught by tests)

1. **Escape while focus outside panel**: Once Tab leaks focus to the background (see H1), pressing Escape does nothing because the `onKeyDown` handler lives on the panel div which no longer has a focused descendant (events don't bubble from outside the panel).

2. **Very narrow viewport (<360px)**: The panel has `width: min(553px, 100vw)`. The footer buttons row has `gap:16`, two flex items. At ~360px width the "Đóng" button (`flexShrink:0`) and "Viết KUDOS" button (`flex:1`) should still fit, but there is no minimum width on the Đóng button, so it could collapse to near-zero. Low risk.

3. **Badge image 404 flash**: Because `next/image` with local paths still makes a request before `onError` fires, there will be a visible 404 flash (image box briefly empty) on first render until the error suppression applies. The dark gradient background makes this nearly imperceptible.

---

## Positive Observations

- **Provider lift executed correctly**: single `KudosBoardProvider` in `[locale]/layout.tsx`, no duplicate on sun-kudos page. All existing consumers (`all-kudos-section`, `kudos-input-row`, `write-kudos-modal-host`) work without modification.
- **Race-free dual-modal handoff**: `setRulesOpen(false) + openModal()` in the same React 18 event handler is batched atomically — no frame where both modals render simultaneously.
- **i18n parity verified**: 24 keys in both VI and EN `theLe` namespace, zero missing keys in either direction. Brand terms (`REVIVAL`, `TOUCH OF LIGHT`, etc.) correctly left untranslated in both locales.
- **Z-index stacking is correct**: backdrop(40) < FAB(50) = panel(50), and panel renders after FAB in DOM order → panel visually covers FAB when open. No interaction bleed.
- **onError badge handling**: `<Image onError>` correctly hides the `<img>` when PNG is absent, revealing the dark-gradient placeholder. The `position:relative` parent is properly sized (64×64). No layout shift.
- **Escape key propagation**: `onKeyDown` on the panel div correctly catches `Escape` bubbling from focused children (buttons). No missing `e.stopPropagation()` that would swallow the event.
- **`useKudosBoard` fallback**: the provider's fallback return (when called outside provider) is silent/noop rather than throwing. This is safe since the layout guarantees provider presence for all real pages.

---

## Recommended Actions (ordered)

1. **H1** — Add Tab focus trap to `TheLeModal.handleKeyDown` (copy pattern from `WriteKudosModal`)
2. **M1** — Replace `aria-label="Thể lệ SAA"` with `aria-labelledby` referencing the h2 id
3. **M2** — Add `sizes="64px"` to `<Image>` in `CollectibleBadgeItem`
4. **L4** — Add `aria-expanded={expanded}` + `aria-haspopup="true"` to collapsed FAB button
5. **L1** — Remove dead `onClick` prop from `WidgetButton`
6. Post-merge: add unit tests for `TheLeModal` (open/close, Escape, Tab trap) and `WidgetButton` (expand/collapse, action callbacks)

---

## Metrics

- Type Coverage: no `any` usage found in new files
- Test Coverage (unit): **0 new tests** for `components/the-le/*` and `widget-button` refactor
- Test Coverage (e2e): 5 new scenarios, cover happy paths; miss Escape, backdrop, Tab trap
- Linting: no visible linting issues (inline-style-heavy code is consistent with MoMorph pattern)
- File size violations: 2 files exceed 200-line convention

---

## Unresolved Questions

None.

---

**Status:** DONE_WITH_CONCERNS  
**Summary:** Feature is functional and integration-correct; no breaking changes or security issues. Two a11y gaps (H1: missing Tab trap in TheLeModal; M1: hardcoded VI aria-label) should be fixed before shipping to keyboard/screen-reader users. All other findings are low/suggestion severity.  
**Findings:** 2 High (H1 Tab trap, M1 aria-label), 1 Medium (M2 image sizes), 4 Low (L1 dead prop, L2 no unit tests, L3 no scroll lock, L4 FAB aria-expanded).
