# Clarifications — Award System Page (Hệ thống giải thưởng SAA 2025)

Screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD (screenId zFYDgyj_pD)

## Session 2026-06-12

- Q: Route path — test cases say /he-thong-giai but codebase wires this screen to /awards-information → A: Use /awards-information (reuse existing route; header/footer/homepage deep-links already point there; auth gate already protects it)
- Q: i18n scope for new Award System text (design is vi-only, app ships vi/en/ja) → A: Populate all 3 locales now — vi verbatim from design (authoritative), en/ja translated consistent with existing homepage i18n
- Q: Mobile/tablet behavior of the sticky left award-category nav → A: Hide nav on small screens and stack award blocks vertically full-width; desktop layout unchanged
- Q: Section anchor slugs for left-nav scroll targets → A: top-talent, top-project, top-project-leader, best-manager, signature-2025-creator, mvp (must match existing homepage card deep-links)
- Q: Sun* Kudos bottom banner (D1/D2/D2.1) → A: Reuse existing components/homepage/kudos-block.tsx with detailHref="/sun-kudos"
- Q: Auth gate for the page (TC ID-0/1) → A: Already satisfied by proxy.ts (route is non-public → unauthenticated redirected to /login); no change needed
