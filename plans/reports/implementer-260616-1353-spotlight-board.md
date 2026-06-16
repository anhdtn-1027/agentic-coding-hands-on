# Implementer Report — Phase 04 Spotlight Board

## Task
- Task: Implement Spotlight Board interactive word cloud (Phase 04)
- Status: completed

## Files Modified / Created
| File | Lines | Action |
|------|-------|--------|
| `components/sun-kudos/spotlight-scatter.ts` | 88 | Created — deterministic scatter util, font-size tiers, constants |
| `components/sun-kudos/spotlight-canvas.tsx` | 200 | Created — SVG word-cloud with pan/zoom/hover/click |
| `components/sun-kudos/spotlight-controls.tsx` | 123 | Created — SearchIcon, PanZoomIcon, SpotlightSearchBar, PanZoomButton |
| `components/sun-kudos/spotlight-board.tsx` | 130 | Created — full section wrapper (heading + canvas + controls + ticker) |
| `app/[locale]/sun-kudos/page.tsx` | +2 lines | Mounted `<SpotlightBoard />` in Spotlight region; added import |

## Design Tokens (extracted from MoMorph — never guessed)
| Token | Value | Source node |
|-------|-------|-------------|
| Canvas border | `1px solid #998C5F` | mm:2940:14174 |
| Canvas border-radius | `47.14px` | mm:2940:14174 |
| Canvas background | `rgba(0,0,0,0.70)` | mm:B.7 RECTANGLE overlay |
| Count label font | Montserrat 700 36px/44px `rgba(255,255,255,1)` | mm:3007:17482 |
| Search bar size | 219×39px | mm:2940:14833 |
| Search bar border | `0.682px solid #998C5F` | mm:2940:14833 |
| Search bar bg | `rgba(255,234,158,0.10)` | mm:2940:14833 |
| Search bar radius | `46.404px` | mm:2940:14833 |
| Search text font | Montserrat 500 10.919px/16.378px ls 0.102px | mm:I2940:14833;186:2760 |
| Pan/Zoom button | 30×30px | mm:3007:17479 |
| Word-cloud normal color | `rgba(255,255,255,1)` | mm:TEXT nodes |
| Word-cloud highlight color | `rgba(241,118,118,1)` — #F17676 | mm:Nguyễn Hoàng Linh node |
| Header subtitle | Montserrat 700 24px/32px white | mm:2940:13477 |
| Header title | Montserrat 700 57px/64px ls -0.25px #FFEA9E | mm:2940:13480 |

## Props Signatures

```ts
// spotlight-canvas.tsx
interface SpotlightCanvasProps {
  nodes: SpotlightNode[];
  loading?: boolean;       // default false
  panMode: boolean;        // true = drag-to-pan; false = scroll-zoom only
  onNodeClick?: (node: SpotlightNode) => void;
  searchQuery?: string;    // live filter; dimmed nodes get opacity 0.2
}

// spotlight-board.tsx — no external props (self-contained, uses mock-data)
export function SpotlightBoard(): JSX.Element
```

## Mount Snippet (for Spotlight region in page.tsx)
```tsx
import { SpotlightBoard } from "@/components/sun-kudos/spotlight-board";

<section aria-label="Spotlight Board" className="w-full" style={{ marginTop: 120 }}>
  <SpotlightBoard />
</section>
```

## Pan / Zoom / Tooltip Wiring
- **Pan**: `onPointerDown` sets `dragging=true` + captures pointer; `onPointerMove` computes dx/dy → updates `transform.{x,y}`; `onPointerUp/Leave` clears flag. Only active when `panMode=true`.
- **Zoom**: `onWheel` (always active) adjusts `transform.scale` ±0.1, clamped `[0.5, 2.5]`.
- **Reset**: `onDoubleClick` → `setTransform({x:0,y:0,scale:1})`.
- **Hover tooltip**: SVG `<text>` `onMouseEnter` captures `clientX/Y` relative to SVG bounding rect → positions absolute `<div>` overlay outside the SVG.
- **Pan/Zoom button**: `aria-pressed` toggle; active state uses gold tint `rgba(255,234,158,0.15)` + matching border.

## Tests Status
- Type check: PASS (`npx tsc --noEmit` — exit 0)
- Build: PASS (`npx next build` — `/[locale]/sun-kudos` SSG route included)
- Unit tests: N/A (pure presentational component; no business logic to unit-test)

## Acceptance Criteria
- [x] `spotlight-canvas.tsx` created — `"use client"`, SVG word cloud
- [x] `spotlight-board.tsx` created — `"use client"`, wraps heading + canvas + controls + ticker
- [x] Pan (drag) implemented — pointer capture + transform translate
- [x] Zoom (wheel) implemented — scale clamp 0.5–2.5, Pan/Zoom toggle button wired
- [x] Hover tooltip — name + postedAt shown on mouse enter
- [x] Highlighted node rendered in `#F17676` (extracted from design)
- [x] Click node — presentational callback prop, console.log, no navigation
- [x] Loading skeleton prop (controlled by `loading` prop, default `false`)
- [x] Empty state rendered when `nodes.length === 0`
- [x] Search bar (B.7.3) — filters cloud by dimming non-matching nodes
- [x] Deterministic scatter — positions computed from index+label hash, no `Math.random` in render
- [x] All files ≤ 200 lines (canvas: 200, board: 130, controls: 123, scatter: 88)
- [x] `npx tsc --noEmit` clean
- [x] `npx next build` clean

## Issues Encountered
- Auth middleware intercepts all routes (including `/preview-*`) — visual diff via browser not possible without credentials. Build + TSC used as verification proxy. Visual validation deferred to authenticated session or separate preview bypass.
- `spotlight-canvas.tsx` initially 202 lines — trimmed 2 blank lines to hit exactly 200.
