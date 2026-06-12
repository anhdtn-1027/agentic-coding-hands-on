# Design-Fidelity Review — Award System page

Screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD (zFYDgyj_pD)
Route: /awards-information · Branch: feat/system-award · Date: 2026-06-12

## Method (evidence-based)
- Authoritative design: `get_frame_image`, `get_frame_node_tree`, `get_design_item_image(313:8467)`.
- Rendered the REAL page via dev server (port 3001), temporarily un-gating `/awards-information`
  in proxy.ts for screenshots, then REVERTED (verified: 307 → /login restored).
- Captured desktop 1440 + mobile 390 full-page; compared against design.

## Stage 1 — Spec compliance

### MAJOR (fixed) — Missing keyvisual banner
- Design: full-width colorful keyvisual artwork (`mms_3_Keyvisual` 313:8437) fills the hero behind
  ROOT FURTHER + title, fading to #00101A.
- Was: flat #00101A background, only the ROOT FURTHER logo. Biggest visual deviation.
- Fix: added the keyvisual background (reusing `/homepage/keyvisual-bg.png`) in
  `app/[locale]/awards-information/page.tsx` with a fade gradient — mirrors the homepage treatment.
- Verified by re-render: artwork now shows in hero, fades before the first award block; 0 console errors.

### INFO (not a bug) — "Top Talent" unit text
- Spec CSV (D.1) + test case ID-6 say "Đơn vị"; implementation uses "Cá nhân".
- High-res design crop (`get_design_item_image 313:8467`) shows the RENDERED design = "10 Cá nhân".
- Per MoMorph rule (rendered design authoritative), implementation is CORRECT; spec text + TC are stale.
- Recommend QA update the spec CSV / TC ID-6 to "Cá nhân".

### Matches design (verified)
- Header home variant; "Thông tin Giải thưởng" (Award Information) active = yellow. ✓
- Title block centered (caption + divider + yellow title). ✓
- Left sticky nav, 6 items in order; alternating image L/R across the 6 blocks. ✓
- Per-card qty/value: Top Talent 10/7M, Top Project 02/15M, Top Project Leader 03/7M,
  Best Manager 01/10M, Signature 01/5M+8M (Hoặc), MVP 01/15M. ✓
- Signature dual-value with "Hoặc" separator. ✓ · Sun* Kudos banner + footer. ✓
- Responsive (clarified): nav hidden on mobile, blocks stack, image centered. ✓

## Stage 2 — Code quality
- Prior reviewer pass (7.5/10) concerns already resolved (scroll-lock, file split, mobile align,
  aria-current, shareable hash). Re-verified: `tsc` 0 errors, `eslint` 0 errors, all files <200 lines.

## Stage 3 — Adversarial (presentational, auth-gated, no user input → low risk)
- Invalid hash → guarded by `isSectionId`; no throw (TC ID-13). ✓
- No `dangerouslySetInnerHTML`; all text via i18n → no XSS vector. ✓
- IntersectionObserver + scroll-lock timer both cleaned up on unmount → no leak. ✓
- Auth gate unchanged; `/awards-information` non-public → 307 to /login when unauthenticated. ✓

## Follow-up fixes (after user "fix bug" request)

### CRITICAL (fixed) — Swapped award badge assets
- `public/homepage/signature-2025-creator.png` contained the "MVP" artwork and
  `public/homepage/mvp.png` contained the "SIGNATURE 2025 CREATOR" artwork — file CONTENTS were
  swapped. Result: Signature block showed "MVP", MVP block showed "SIGNATURE 2025 CREATOR".
- Affected BOTH the awards page and the homepage award grid (same shared assets).
- Code mapping + declared dims were correct (signature 232×54, mvp 116×52); only the files were wrong.
- Fix: swapped the two PNG files on disk. Verified (cache-busted raw load): signature → 232×54
  "SIGNATURE 2025 CREATOR", mvp → 116×52 "MVP" — now matches filenames + code dims.

### MINOR (fixed) — "Hoặc" separator legibility
- Was Figma color #2E3940 (~1.6:1 on dark, illegible). Lightened to #8A98A0 (~6:1, WCAG AA) in
  `award-detail-block.tsx`. Deliberate, user-requested deviation from the design color.

## Verdict
PASS. Keyvisual gap fixed+verified; swapped badge assets fixed+verified; "Hoặc" legibility fixed.
Top-Talent-unit nuance documented (design wins). No security/correctness issues. tsc 0, eslint 0.
Ready to commit.

## Unresolved
- Spec CSV (D.1) + TC ID-6 unit "Đơn vị" vs design "Cá nhân" — QA to reconcile (design wins).
- "Hoặc" separator color #2E3940 is low-contrast but verbatim from Figma — kept by design authority.
