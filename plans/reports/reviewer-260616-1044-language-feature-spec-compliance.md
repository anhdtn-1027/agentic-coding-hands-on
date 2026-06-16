# Spec-Compliance Review — Multi-language feature vs hUyaaugye2

Screen: Dropdown-ngôn ngữ (hUyaaugye2, node 525:11713). Values below are from MoMorph MCP (authoritative), not code comments.

## Stage 1 — Spec compliance

### Compliant (exact match vs design nodes)

| Aspect | Design (MCP) | Code | ✓ |
|---|---|---|---|
| Container border | `1px solid #998C5F` | same | ✓ |
| Container bg | `#00070C` | same | ✓ |
| Container radius / padding | `8px` / `6px` | same | ✓ |
| Container layout | flex column, align flex-start | `flex flex-col` | ✓ |
| Options count | VN + EN (2) | VN + EN | ✓ |
| Typography | Montserrat 700, 16px, lh 24px, ls 0.15px, #FFF | same | ✓ |
| Flag icon | 24×24 | 24×24 | ✓ |
| Flag→label gap | `4px` (Frame 485) | inner span `gap:4px` | ✓ |
| Selected highlight | `rgba(255,234,158,0.20)` | same | ✓ |
| EN flag | GB flag | `flag-gb.svg` | ✓ |
| Behavior | open/close; select → switch locale + close; default vi | matches | ✓ |

### Deviations

**1. [Important] Hover state not implemented.**
Specs A.1 & A.2 explicitly require it — A.1: *"State: hover hiển thị highlight"*; A.2: *"Hover: đổi nền để hiển thị trạng thái tương tác"*. Code has `transition-colors` but no `:hover` background rule. Options give no interactive feedback on hover.

**2. [Minor] Option border-radius mismatch.**
Design: VN option `border-radius: 2px`, EN option `0px`. Code hardcodes `4px` for all options. Code comment (line 79) even says "border-radius 2px" while the style is `4px` — comment/code drift.

**3. [Minor] Option box model differs.**
Design options: `padding:0`, fixed `108×56` (VN) / `110×56` (EN), justify `flex-start` (VN) / `center` (EN).
Code options: `padding:16px` + `w-full` + `justify-between`. Vertical height resolves to ~56px (16+24+16) so height is visually correct, but: EN content alignment is left (code) vs centered (design); per-option fixed width is not enforced (stretches to container).

**4. [Nit] `gap:2px` on the option button is dead** — the button has a single flex child, so the gap never applies. Harmless; remove for clarity.

## Stage 2 — Code quality
Small, typed, a11y-correct (`role="listbox"`/`option`, `aria-selected`, `aria-expanded`). Unknown-locale fallback (`?? LANGUAGE_OPTIONS[0]`) is safe. Already passed two prior reviewer passes; tsc/lint clean; 62 tests (49 unit + 13 e2e) green.

## Stage 3 — Adversarial
- Auth proxy regex narrowing (`(?:en|ja)` → `en`) is *more* restrictive after ja removal — no public-route/auth bypass introduced; invalid `/ja/*` now falls through to the auth guard.
- Outside-click (document `mousedown` + `containerRef`) — the trigger-toggle race was fixed and is regression-tested.
- No injection / secret / resource concerns in UI layer.

## Verdict
Behaviorally and typographically **compliant**. Remaining gaps are visual polish: hover state (Important), option border-radius (Minor), EN alignment + box model (Minor).

## Unresolved questions
- Design exposes only the static vi-selected frame; the exact hover fill is not in the node data. Confirm hover bg with user (suggest reusing the selected-highlight `rgba(255,234,158,0.20)` at lower alpha, or a neutral `rgba(255,255,255,0.08)`).
