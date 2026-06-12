# Phase 02 — Track B: Integration + i18n (orchestrator)

**Goal:** Wire the UI to real i18n + navigation. Non-blocking with Track A.

## Tasks
1. **i18n (all 3 locales)** — from Track A's reported key map, add `awardSystem` namespace to
   `messages/vi.json` (verbatim design text), `messages/en.json`, `messages/ja.json` (translated).
   Keys cover: hero caption/title, 6 nav labels, 6 award blocks (title, description, qty label,
   qty value+unit, value label, value amount+note; Signature has two values), shared labels
   ("Số lượng giải thưởng", "Giá trị giải thưởng").
2. **Header active state** — update `components/shared/site-header.tsx` NavLink logic so
   "Awards Information" highlights when `pathname` starts with `/awards-information`.
3. **Anchor slugs** — confirm section ids match homepage deep-links (top-talent … mvp) so
   `/awards-information#<slug>` from homepage cards scrolls correctly.
4. **Auth gate** — already satisfied by proxy.ts (route non-public). No change. Verify only.

## Files
- Modify: messages/vi.json, messages/en.json, messages/ja.json, components/shared/site-header.tsx
- Read: Track A components + page for exact keys/slugs

## Success criteria
- `npm run build` clean; all 3 locales render real text; homepage card deep-links land on sections;
  header shows correct active nav; unauthenticated access redirects to /login.
