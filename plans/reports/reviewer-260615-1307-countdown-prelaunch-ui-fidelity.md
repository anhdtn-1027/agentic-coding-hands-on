# Review — Countdown Prelaunch UI fidelity vs MoMorph spec

Screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/8PJQswPZmU (node 2268:35127)
Method: authoritative MoMorph node geometry vs rendered DOM (Playwright @ 1512×1077, exact Figma canvas).

## Verdict: PASS (after 2 fixes applied)

All component values were already pixel-exact. Two **page-layout** fidelity bugs found via measurement and fixed.

## Value comparison (all EXACT — no change needed)
- Digit box: 76.8×122.88 (code 77×123), radius 12, border 0.75px #FFEA9E, gradient #FFF→rgba(255,255,255,.1), opacity .5, blur 24.96 ✓
- Digit text: Digital Numbers 73.728px white ✓
- Labels: Montserrat 700 36px/48px white, left-aligned ✓
- Title: Montserrat 700 36px/48px white, centered, "Sự kiện sẽ bắt đầu sau" ✓
- Gaps: box 21, unit 60, title→time 24 ✓
- Overlay: linear-gradient(18deg,#00101A 15.48%,rgba(0,18,29,.46) 52.13%,rgba(0,19,32,0) 63.41%) — byte-identical ✓

## Findings (fixed)
1. [Important] Vertical position — content dead-centered (50%) but design = upper-center.
   Design band y=218..673 → content center 41.3%. Rendered was 50% (~93px too low).
   Fix: content band `top-0 height:82.6vh justify-center` → center 41.3%. (prelaunch-page-view.tsx)
2. [Medium] Horizontal misalignment — CONTENT_WIDTH=720 + left-aligned time row → digits centered at
   x=718 while title centered at x=756 (38px off-axis). Design aligns both at 756.
   Fix: CONTENT_WIDTH 720→645 (exact row width) → both at x=756. (prelaunch-page-view.tsx)

## Verification (rendered vs design @1512×1077)
| Metric | Design | Before | After |
|---|---|---|---|
| Title top Y | 29.2% | 37.8% | 29.1% ✓ |
| Content center Y | 41.3% | 50% | 41.3% ✓ |
| Time row x / w | 434 / 644 | 396 / 720 | 434 / 645 ✓ |
| Title↔row offset | 0 | 38px | 0 ✓ |

Gates: tsc ✓ · eslint ✓ · build ✓ · vitest 25/25 ✓

## Minor / accepted
- BG image: code uses `objectFit:cover, center top`; design uses exact scale 109.4%/216% @ offset -142/-790.
  Visually equivalent crop (dark top-left, roots right/below). Accepted as responsive approximation.
- Digits render 00/00/00 (event date past) vs design 00/05/20 — data only; split logic unit-tested.

## Unresolved
- BG crop is an approximation, not the exact Figma scale/offset. Pixel-faithful crop would need a
  positioned background instead of objectFit cover — only pursue if art framing must match exactly.
