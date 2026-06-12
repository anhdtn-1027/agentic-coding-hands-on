# Phase 01 — Track A: UI (background implementer)

**Screen:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD
**Goal:** Pixel-perfect Award System page UI from Figma; extract full design text.

## Components (under `components/awards/`, each <200 lines)
- `award-hero.tsx` — keyvisual banner + "Hệ thống giải thưởng SAA 2025" title (specs 3, A)
- `award-nav.tsx` — sticky left menu, 6 items, active=yellow+underline, hover highlight (specs C/C.1–C.6)
- `award-detail-block.tsx` — image + title + description + qty + value; `reverse` for alternating layout (specs D.1–D.6)
- `award-system-content.tsx` — "use client"; IntersectionObserver scroll-spy + smooth scroll; KudosBlock at bottom
- Page: `app/[locale]/awards-information/page.tsx` (replace placeholder)

## Out of scope
- i18n message files (Track B owns messages/*.json)
- Header active-nav logic change (Track B)

## Integration contract (report to orchestrator)
- i18n key → vi-text map under `awardSystem` namespace
- Section slugs: top-talent, top-project, top-project-leader, best-manager, signature-2025-creator, mvp
- Uses `useTranslations("awardSystem")`; reuses SiteHeader/SiteFooter/KudosBlock
