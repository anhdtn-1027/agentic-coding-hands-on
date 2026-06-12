# Award System Page — Hệ thống giải thưởng SAA 2025

**Screen:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD
**Route:** `/awards-information` (replaces existing placeholder)
**Decisions:** see [clarifications.md](clarifications.md)

Mostly-presentational, authenticated page: keyvisual hero → sticky left nav (6 award
categories, scroll-spy) → 6 award detail blocks (alternating layout) → Sun* Kudos banner.
Reuses SiteHeader (home), SiteFooter (home), KudosBlock, and existing award badge assets.

## Two-track execution (MoMorph parallel strategy)

### Track A — UI (background `implementer`) ✅ DONE
Built pixel-perfect UI + i18n (all 3 locales), reported key map. Build clean.
Files: `components/awards/{award-hero,award-nav,award-detail-block,award-system-content,award-icons,award-data}`,
`app/[locale]/awards-information/page.tsx`.
- [x] [phase-01-track-a-ui.md](phase-01-track-a-ui.md)

### Track B — Integration + i18n (orchestrator) ✅ DONE
i18n verified (34 keys × vi/en/ja parity), responsive (hide nav + stack), header active-nav state,
anchor slugs match homepage deep-links, auth gate verified (proxy.ts).
- [x] [phase-02-track-b-integration.md](phase-02-track-b-integration.md)

### Quality gate ✅ DONE
tester: 15/15 TCs PASS, 24/24 unit tests, tsc+eslint clean. reviewer: 7.5→ concerns addressed
(H1 scroll-lock, H2 file split, M2 mobile align, M3 aria-current, L4 shareable hash). M1 kept (design).
- [x] [phase-03-test-and-review.md](phase-03-test-and-review.md)

## Key dependencies
- Track B i18n wiring depends on Track A's reported key map + full design text.
- Section slugs must equal homepage deep-links: top-talent, top-project, top-project-leader,
  best-manager, signature-2025-creator, mvp.
