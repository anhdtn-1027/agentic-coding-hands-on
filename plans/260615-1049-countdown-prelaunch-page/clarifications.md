# Clarifications — Countdown - Prelaunch page

Screen: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/8PJQswPZmU
fileKey: 9ypp4enmFmdK3YAFJLIu6C | screenId: 8PJQswPZmU | node: 2268:35127

## Session 2026-06-15

- Q: Should the Prelaunch countdown page require login? → A: Require login (same auth as homepage; unauthenticated users redirected to login)
- Q: What route should the Prelaunch page live at? → A: /[locale]/prelaunch (locale-aware: / for vi has no prefix → /prelaunch, /en/prelaunch, /ja/prelaunch)
- Q: When the countdown reaches zero, what should the page do? → A: Stay frozen at 00:00:00, all units show '00', no redirect (matches test cases)
- Q: How to handle text localization? → A: Localize the title via next-intl (vi/en/ja); keep DAYS/HOURS/MINUTES labels in English everywhere as the design shows
- Q: Event datetime source? → A: Reuse existing NEXT_PUBLIC_EVENT_DATETIME via the existing useCountdown hook (per-minute tick, zero-pad, edge cases already handled)
- Q: Seconds unit? → A: No — design + specs show only DAYS/HOURS/MINUTES; per-minute tick is correct
