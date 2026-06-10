# Code Review — Homepage SAA keyvisual background cut off

Screen: Homepage SAA (i87tDx10uM) · evidence: Figma node geometry + Playwright screenshots @1440.

## Reported bug (CONFIRMED → FIXED)

Keyvisual background should sit behind the hero AND fade down into the "Đứng trước bối cảnh…" intro paragraph. Instead it was cut off at the hero edge, before that content.

## Root cause — wrong layer ownership

Authoritative Figma structure (frame 2167:9026, 1512×4480), painted bottom→top:
1. `2167:9027` Keyvisual — **1512×1392**, page top (y 0→1392)
2. `2167:9029` Cover — **1512×1480**, `linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0.00) 48.92%)`
3. Header + `2167:9030` "Bìa" content frame (holds ALL body sections)

→ keyvisual + gradient are **page-level** backgrounds spanning hero + the "ROOT FURTHER" intro, fading to solid `#00101A` by ~y1129 (paragraph starts y1047).

Implementation buried both **inside `HeroSection`** as `absolute inset-0` (clipped to `100vh`) and used a flat `rgba(0,0,0,0.55)` cover instead of the directional gradient. So the keyvisual died at the hero boundary and root-further sat on plain dark.

## Fix

| File | Change |
|------|--------|
| `components/homepage/hero-section.tsx` | Removed the keyvisual `<Image>` + flat dark cover from the hero (no longer clips bg to 100vh) |
| `app/[locale]/homepage-client.tsx` | Added page-level keyvisual layer: absolute `top-0`, `height: calc(100vh + 480px)`, `z-0`, `pointer-events-none`; keyvisual `<Image fill object-cover object-center>` + the exact Figma gradient cover. `<main>` set `relative z-10`; root `relative`. |

Net: keyvisual spans hero → ROOT FURTHER intro, fading via the real gradient to `#00101A` exactly as the body paragraph begins; page `#00101A` continues seamlessly below.

## Verification

- Hero @ scrollY 0: keyvisual strands render (vivid right / dark-left for text) ✅
- scrollY 760: keyvisual visible behind "ROOT FURTHER" heading, fading into "Đứng trước bối cảnh…" paragraph ✅ (matches design)
- No horizontal overflow @1440 ✅
- `tsc --noEmit` clean · eslint clean on changed files ✅
- Header (sticky z-40) + content (z-10) above bg (z-0); bg `pointer-events-none` (no interaction regression)

## Notes
- Layer height `calc(100vh + 480px)` chosen so the keyvisual always covers the full hero plus the intro region across viewport heights; gradient fades to `#00101A` (= page bg) so the cutoff is invisible regardless of reflow.
- Mobile (<600px) horizontal-overflow items from the prior review (header nav, Kudos fixed panel) remain out of scope (no mobile design).

## Unresolved questions
- None for this bug. (Mobile responsive redesign still pending design input.)
