# Clarifications — Sun* Kudos Live Board

MoMorph refs:
- Sun* Kudos - Live board: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ
- fileKey: 9ypp4enmFmdK3YAFJLIu6C | screenId: MaZUn5xHXZ

## Session 2026-06-16

- Q: Interactivity scope for the UI build → A: Static pixel-perfect layout + light client interactivity (carousel arrows, heart toggle, Copy Link toast, filter dropdowns open). No backend, no persistence.
- Q: Text / i18n handling → A: Kudos message content ("Cảm ơn...") in cards = hardcode original language (user-written); user names = not translated; data sourced from DB later = mock data module (not hardcoded, not i18n); all remaining UI chrome (titles, labels, placeholders, buttons) = i18n vi/en.
- Q: Spotlight Board fidelity → A: Full interactive word cloud — pan/zoom, hover tooltips, clickable nodes.
- Q: Viewport / responsive target → A: Fully responsive (mobile → desktop).
