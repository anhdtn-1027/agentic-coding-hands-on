# Clarifications — Thể lệ (SAA rules) modal + FAB expanded menu

## Session 2026-06-24
- Q: Screens in scope? → A: Thể lệ modal=b1Filzi9i6, FAB expanded menu=Sv7DFwBw1h (fileKey=9ypp4enmFmdK3YAFJLIu6C)
- Q: Which pages show the FAB (Thể lệ / Viết KUDOS)? → A: Homepage only (keep current widget placement)
- Q: How does FAB 'Viết KUDOS' open the form? → A: Lift KudosBoardProvider + write-kudos-modal-host to app/[locale]/layout; de-dupe the inner provider on the Sun* Kudos page
- Q: i18n coverage for Thể lệ content? → A: VI + EN (author EN translations for all rules copy)
- Q: Thể lệ modal badges/icons source? → A: Modal's own assets from Figma (4 Hero rank badges + 6 collectible icons: Revival, Touch of Light, Stay Gold, Flow to Horizon, Beyond the Boundary, Root Further); NOT the SAA award-data badges
- Q: Thể lệ modal open/close state location? → A: FAB is homepage-only → modal open state local to homepage-client (no new global provider); Write Kudos uses the lifted board provider
- Q: Rules content source? → A: Static i18n content (no backend/CMS) — YAGNI
