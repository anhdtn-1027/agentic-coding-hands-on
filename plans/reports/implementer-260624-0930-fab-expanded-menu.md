# Implementation Report — FAB Expanded Menu

**Task:** Implement FAB expanded state (Sv7DFwBw1h) pixel-perfect from Figma design
**Status:** DONE

## Files Modified

| File | Change |
|------|--------|
| `components/homepage/widget-button.tsx` | Refactored: added `expanded` state toggle, full expanded menu (A/B/C buttons) |
| `messages/vi.json` | Added 5 new keys: `widgetRulesLabel`, `widgetWriteKudosLabel`, `widgetRulesAria`, `widgetWriteKudosAria`, `widgetCancelAria` |
| `messages/en.json` | Same 5 keys (English) |

## Final Component Interface

```tsx
interface WidgetButtonProps {
  onClick?: () => void;          // Legacy — kept for backward compat; triggers expand
  onOpenRules?: () => void;      // Called when "Thể lệ" (A) clicked — orchestrator wires modal open
  onWriteKudos?: () => void;     // Called when "Viết KUDOS" (B) clicked — orchestrator wires form open
}
```

Expand/collapse is owned internally via `useState(false)`. Both action buttons collapse the menu before calling their prop.

## Design Spec Implementation

| Button | Size | BG | Border-radius | Icon | Text |
|--------|------|----|---------------|------|------|
| A "Thể lệ" | 149×64px | `#FFEA9E` | 4px | Lightning bolt SVG `#E73928` | Montserrat 700 24px `#00101A` |
| B "Viết KUDOS" | 214×64px | `#FFEA9E` | 4px | Pen SVG `#00101A` | Montserrat 700 24px `#00101A` |
| C "Hủy" | 56×56px | `rgba(212,39,29,1)` | 100px | White × SVG | — |

Container: 214×224px, `gap: 20px`, flex-col align-end, `fixed bottom:32 right:19`.
Height: 64+20+64+20+56 = 224px (exact Figma match).

## Icons

- `get_figma_image` returned HTTP 500 for all 3 media nodes — inline SVG implemented from design image:
  - MM_MEDIA_LOGO: lightning bolt, fill `#E73928` (matches Figma frame screenshot)
  - MM_MEDIA_Pen: pen path from existing `public/homepage/pen.svg` adapted inline, fill `#00101A`
  - MM_MEDIA_Close: standard × cross, stroke white 2px rounded

## Visual Validation

Screenshot vs Figma reference: layout dimensions, colors, border-radius, text weight all match.
Collapsed pill unchanged (backward compat preserved).

## What Orchestrator Must Wire

1. `homepage-client.tsx` — pass `onOpenRules` and `onWriteKudos` props to `<WidgetButton>`:
   ```tsx
   <WidgetButton
     onOpenRules={() => setRulesModalOpen(true)}
     onWriteKudos={() => setWriteKudosOpen(true)}
   />
   ```
2. The Thể lệ rules modal (owned by `components/the-le/*`) should be opened by `onOpenRules`.
3. The Write Kudos form (existing modal) should be opened by `onWriteKudos`.
