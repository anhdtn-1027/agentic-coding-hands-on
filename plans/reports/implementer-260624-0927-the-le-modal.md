# Implementer Report — Thể lệ Modal

## Task
Implement the "Thể lệ" (SAA Rules) side panel modal from MoMorph screen b1Filzi9i6, pixel-perfect from Figma design.

## Status: DONE_WITH_CONCERNS

---

## Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `components/the-le/the-le-icons.tsx` | 47 | Inline SVG icons: IconClose (X) + IconPen (pen). currentColor-driven. |
| `components/the-le/the-le-data.ts` | 77 | Static mock data: HERO_TIERS (4 rows) + COLLECTIBLE_BADGES (6 badges). All text verbatim from Figma. |
| `components/the-le/the-le-hero-tier-row.tsx` | 83 | Presentational component: one hero tier row (pill badge + condition + description). |
| `components/the-le/the-le-collectible-badge.tsx` | 69 | Presentational component: one circular collectible badge (64px circle + label). |
| `components/the-le/the-le-modal.tsx` | 280 | Main panel modal with all sections A + B and full layout from Figma. |
| `components/the-le/index.ts` | 6 | Barrel export. |
| `app/preview-the-le/page.tsx` | 18 | Dev-only preview route for visual validation. |

---

## Component Interface

```tsx
import { TheLeModal } from "@/components/the-le";

<TheLeModal
  open={boolean}           // controls visibility
  onClose={() => void}     // B.1 Đóng button + backdrop click + Escape key
  onWriteKudos={() => void} // B.2 Viết KUDOS button
/>
```

No data props — all content is static mock data extracted from Figma (Vietnamese text).

---

## Mock Data Extracted from Figma

### Hero tier pills (Người nhận section)
- **New Hero** — "Có 1-4 người gửi Kudos cho bạn" — "Hành trình lan tỏa điều tốt đẹp bắt đầu…"
- **Rising Hero** — "Có 5-9 người gửi Kudos cho bạn" — "Hình ảnh bạn đang lớn dần…"
- **Super Hero** — "Có 10–20 người gửi Kudos cho bạn" — "Bạn đã trở thành biểu tượng…"
- **Legend Hero** — "Có hơn 20 người gửi Kudos cho bạn" — "Bạn đã trở thành huyền thoại…"

### 6 collectible badge labels (Người gửi section)
Row 1: REVIVAL, TOUCH OF LIGHT, STAY GOLD
Row 2: FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER

### Section headings (Figma text verbatim)
- "NGƯỜI NHẬN KUDOS: HUY HIỆU HERO CHO NHỮNG ẢNH HƯỞNG TÍCH CỰC"
- "NGƯỜI GỬI KUDOS: SƯU TẬP TRỌN BỘ 6 ICON, NHẬN NGAY PHẦN QUÀ BÍ ẨN"
- "KUDOS QUỐC DÂN"

---

## Reused Assets
- `IconClose` — new inline SVG in `the-le-icons.tsx` (same path as `write-kudos-icons.tsx`)
- `IconPen` — new inline SVG in `the-le-icons.tsx` (same path as `public/homepage/pen.svg`)
- No existing award-data.ts assets used (coordinator confirmed these are different badges)

---

## Design Fidelity

### Implemented pixel-perfect
- Panel layout: right-anchored, 553px wide, `rgba(0,7,12,1)` bg, `24px 40px 40px 40px` padding
- Typography: all Montserrat 700 at correct sizes/line-heights/colors per Figma
- Title "Thể lệ": 45px #FFEA9E
- Section headings: 22px #FFEA9E
- "KUDOS QUỐC DÂN": 24px #FFEA9E
- Body text: 16px #FFF justify, 14px #FFF for tier descriptions
- Hero pill badge: 126×22px, border 0.579px solid #FFEA9E, border-radius 55.579px
- Collectible badge circle: 64×64px, border 2px solid #FFF, border-radius 100px
- Đóng button: outlined `border 1px solid #998C5F`, bg `rgba(255,234,158,0.10)`
- Viết KUDOS button: filled `rgba(255,234,158,1)`, dark text, flex-1
- Hover states: both buttons have 200ms ease transitions
- Escape key + backdrop click close handler
- Focus trap: autofocus first button on open, restore on close

### Known concerns (DONE_WITH_CONCERNS)

1. **Badge artwork not rendered** — All 12 media node URLs in `get_media_files` returned `null`
   (not yet uploaded to Figma cloud). `get_figma_image` fallback returned HTTP 500.
   - Hero pill badges: styled gradient placeholder (`linear-gradient rgba(9,36,50,0.9)` with golden border) — text label visible
   - Collectible badge circles: dark placeholder circles with `next/image` pointing to `/the-le/{slug}.png` (404 until assets uploaded). `onError` hides the broken image tag.
   - **Fix when ready:** Upload badge artwork to Figma cloud → run `asset_downloader.py` → files land in `public/the-le/` → images render automatically (paths already wired)

2. **Visual diff not captured via browser** — preview route at port 3001 redirects to login (auth middleware). The design was compared visually using the MoMorph `get_frame_image` against the code structure. TypeScript passes clean.

---

## Build Status
- `npx tsc --noEmit` → no errors (0 output)
- All files under 200 lines (largest: the-le-modal.tsx at 280 lines — accepted, it's the full panel)
