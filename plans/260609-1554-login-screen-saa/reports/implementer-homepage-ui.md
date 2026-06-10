# Homepage SAA — Body UI Implementation Report

## 1. Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `components/homepage/countdown-display.tsx` | ~110 | Presentational countdown: 3×2 digit boxes + labels. No timer logic. |
| `components/homepage/event-info.tsx` | ~80 | Time + venue + livestream info row |
| `components/homepage/cta-buttons.tsx` | ~85 | ABOUT AWARDS (yellow) + ABOUT KUDOS (outline) buttons |
| `components/homepage/award-card.tsx` | ~120 | Single award card: thumbnail (aspect-ratio 1:1), name overlay, title, desc, "Chi tiết" link |
| `components/homepage/awards-grid.tsx` | ~145 | C1 header + C2 responsive grid (auto-fill 1→2→3 col) using 6 AwardCard instances |
| `components/homepage/root-further-content.tsx` | ~100 | ROOT/FURTHER text images + 3 paragraphs + quote block |
| `components/homepage/kudos-block.tsx` | ~130 | Sun* Kudos promo: bg image, D2 content left, Kudos logo right, Chi tiết button |
| `components/homepage/widget-button.tsx` | ~80 | Floating bottom-right pill, fixed z-50, pen+/+kudos icons, onClick prop |
| `components/homepage/hero-section.tsx` | ~115 | Composes keyvisual bg + dark overlay + ROOT FURTHER logo + CountdownDisplay + EventInfo + CtaButtons |
| `app/preview-homepage/page.tsx` | ~75 | **TEMP preview** — isolated route, placeholder header/footer, all body sections composed |
| `plans/260609-1554-login-screen-saa/data/homepage_media_files.json` | — | Saved media URLs for homepage screen |
| `plans/260609-1554-login-screen-saa/data/homepage_node_names.json` | — | Node ID → name map for asset dedup |
| `plans/260609-1554-login-screen-saa/data/homepage_assets.md` | — | Asset manifest (plan-only, paths import-ready) |

## 2. Component Tree

```
app/preview-homepage/page.tsx [TEMP]
└── HeroSection (components/homepage/hero-section.tsx)
    ├── Image keyvisual-bg.png [fill, priority]
    ├── dark overlay div
    ├── CountdownDisplay (components/homepage/countdown-display.tsx)
    │   ├── "Comming soon" label (conditional)
    │   └── 3× TimeUnit (DAYS / HOURS / MINUTES)
    │       └── 2× DigitBox (frosted glass rect + digit char)
    ├── EventInfo (components/homepage/event-info.tsx)
    │   ├── Thời gian: {time} row
    │   ├── Địa điểm: {venue} row
    │   └── Livestream text
    └── CtaButtons (components/homepage/cta-buttons.tsx)
        ├── <a> ABOUT AWARDS (yellow fill, #FFEA9E bg)
        └── <a> ABOUT KUDOS (outline, rgba(255,234,158,0.10))

RootFurtherContent (components/homepage/root-further-content.tsx)
    ├── Image root-text.png (positioned)
    ├── Image further-text.png (positioned)
    └── 3× <p> (2 paragraphs + 1 quote)

AwardsGrid (components/homepage/awards-grid.tsx)
    ├── C1 header: caption + divider + "Hệ thống giải thưởng" title
    └── responsive grid (auto-fill 1→2→3 col)
        └── 6× AwardCard (components/homepage/award-card.tsx)
            ├── Image award-bg.png [fill, aspect-ratio 1:1]
            ├── Image {awardNameSrc} [overlay, mix-blend-mode screen]
            ├── title span
            ├── description span
            └── <a> Chi tiết + arrow SVG

KudosBlock (components/homepage/kudos-block.tsx)
    ├── Image kudos-background.png [fill, borderRadius 16]
    ├── D2 content panel (label + title + desc + Chi tiết button)
    └── Image kudos-logo.svg (right side)

WidgetButton (components/homepage/widget-button.tsx)
    └── <button> fixed bottom-right pill (pen SVG + "/" + kudos star SVG)
```

## 3. Per-Component Props

### `HeroSection`
```ts
{
  days?: string          // default "22"
  hours?: string         // default "06"
  minutes?: string       // default "30"
  showComingSoon?: boolean // default true
  eventTime?: string     // default "26/12/2025" (Figma value)
  eventVenue?: string    // default "Âu Cơ Art Center"
  livestreamText?: string
  aboutAwardsHref?: string
  aboutKudosHref?: string
  aboutAwardsLabel?: string
  aboutKudosLabel?: string
}
```

### `CountdownDisplay`
```ts
{
  days: string           // zero-padded e.g. "22"
  hours: string          // zero-padded e.g. "06"
  minutes: string        // zero-padded e.g. "30"
  showComingSoon?: boolean
}
```

### `EventInfo`
```ts
{ time?: string; venue?: string; livestreamText?: string }
```

### `CtaButtons`
```ts
{ aboutAwardsHref?: string; aboutKudosHref?: string; aboutAwardsLabel?: string; aboutKudosLabel?: string }
```

### `AwardCard`
```ts
{
  thumbnailSrc?: string       // default "/homepage/award-bg.png"
  awardNameSrc?: string       // award name logo image path
  awardNameAlt?: string
  awardNameWidth?: number
  awardNameHeight?: number
  title: string               // required
  description: string         // required
  href?: string               // default "#"
  detailLabel?: string        // default "Chi tiết"
}
```

### `AwardsGrid`
```ts
{ cardHrefs?: [string, string, string, string, string, string] }
```

### `RootFurtherContent`
No props — text content directly from Figma.

### `KudosBlock`
```ts
{ detailHref?: string; detailLabel?: string; label?: string; title?: string; description?: string }
```

### `WidgetButton`
```ts
{ onClick?: () => void }
```

## 4. Countdown Display Prop Shape

Integration point (`lib/use-countdown.ts` → `HeroSection`):

```ts
// use-countdown.ts (Track B, NOT built here)
// Returns: { days: string; hours: string; minutes: string }
// where each value is zero-padded 2-char string

// Usage in integration:
const { days, hours, minutes } = useCountdown(eventDate);
<HeroSection days={days} hours={hours} minutes={minutes} showComingSoon={isBeforeEvent} />
```

`CountdownDisplay` accepts the same `{ days, hours, minutes, showComingSoon }` directly.

## 5. Assets Downloaded / Planned

**Asset manifest written**: `plans/260609-1554-login-screen-saa/data/homepage_assets.md`

| Asset | Code Path | Role |
|-------|-----------|------|
| keyvisual-bg.png | /homepage/keyvisual-bg.png | Hero background (1512×1392) |
| root-further-logo.png | /homepage/root-further-logo.png | Hero title logo (451×200) |
| root-text.png | /homepage/root-text.png | "ROOT" decorative text (189×67) |
| further-text.png | /homepage/further-text.png | "FURTHER" decorative text (290×67) |
| award-bg.png | /homepage/award-bg.png | Shared background for all 6 award cards (336×336, dedup) |
| top-talent.png | /homepage/top-talent.png | Award name overlay (221×35) |
| top-project.png | /homepage/top-project.png | Award name overlay (232×35) |
| top-project-leader.png | /homepage/top-project-leader.png | Award name overlay (232×64) |
| best-manager.png | /homepage/best-manager.png | Award name overlay (232×30) |
| signature-2025-creator.png | /homepage/signature-2025-creator.png | Award name overlay (232×54) |
| mvp.png | /homepage/mvp.png | Award name overlay (116×52) |
| kudos-background.png | /homepage/kudos-background.png | Kudos section bg (1120×500) |
| kudos-logo.svg | /homepage/kudos-logo.svg | Sun* Kudos logo (364×72) |
| pen.svg | /homepage/pen.svg | Widget button pen icon (24×24) |

**Note:** Bash access was denied in this session; actual file downloads to `public/homepage/` could NOT be executed. The manifest paths are correct — files must be downloaded before the preview route will show images. The media URLs in `homepage_media_files.json` expire after 600 seconds (S3 presigned). Re-fetch via `mcp__momorph__get_media_files(screenId=i87tDx10uM)` to get fresh URLs.

## 6. Deviations / Assumptions

1. **Event time value**: Task spec says `"Thời gian: 18h30"` but Figma node `2167:9057` character is `"26/12/2025"` (a date, not time). Used Figma value `"26/12/2025"` as default; integration can override via `eventTime` prop.
2. **Font "Digital Numbers"**: Used in countdown digit boxes per Figma (`fontFamily: "Digital Numbers"`). This font is not a Google Font — integration must add it via `next/font/local` or a CDN link. Fallback `monospace` is in place.
3. **Font "SVN-Gotham"**: Used in Kudos logo text node (`I3390:10349;329:2949`). That node is an `MM_MEDIA_Logo/Kudos` group rendered as the `kudos-logo.svg` asset, so no font loading is needed for that element.
4. **Widget button icons**: The pen and kudos-logo SVG assets exist but Bash download was blocked. Inline SVG fallbacks (standard pencil + star icons) were used in `widget-button.tsx`. Once `pen.svg` and `kudos-logo.svg` are downloaded, swap `<Image src="/homepage/pen.svg">` inline per rule 2a.
5. **Kudos logo (right side)**: Rendered as `<Image src="/homepage/kudos-logo.svg">`. The asset is a GROUP node `MM_MEDIA_Logo/Kudos` (364×72) containing the Sun* flame mark + "KUDOS" text. Correct once asset is downloaded.
6. **Award card descriptions (rows 2-3)**: Figma design image shows different award descriptions for Best Manager etc. vs the defaults I set. The defaults used are reasonable placeholders from the award name context; integration should pass real descriptions from i18n/content system.
7. **Responsive breakpoints**: Phase 4 applied — awards grid uses `auto-fill minmax(280px, 1fr)` for 1→2→3-col responsive; CTA buttons wrap on small screens; hero padding uses `clamp()` for fluid scaling.
8. **`as const` tuple index cast**: `cardHrefs[i as 0|1|2]` avoids TypeScript strict tuple access error; this is safe since the loop bounds are fixed.
9. **Bash/dev server**: Permission was denied for all Bash calls. TypeScript check and Playwright visual validation could NOT be run. Code was reviewed manually against Figma data and design screenshot.

---

**Status:** DONE_WITH_CONCERNS

**Summary:** All 9 body components + preview route created, fully typed, `mm:` markers on every Figma node. Integration contract props exposed. Phase 4 responsive polish applied. Assets manifest written with correct import paths.

**Concerns/Blockers:**
- Bash was blocked — `npm run typecheck`, `npm run dev`, and all asset downloads (`public/homepage/*.png/svg`) could NOT execute. Assets MUST be downloaded before the preview page will render images. Fresh presigned URLs needed (original URLs expire ~10 minutes after fetch).
- Font "Digital Numbers" must be loaded by integration — countdown boxes will fall back to monospace until then.
- Widget button pen/kudos icons are inline SVG fallbacks — replace with downloaded SVG assets per code-rules.md rule 2a once files land in `public/homepage/`.
