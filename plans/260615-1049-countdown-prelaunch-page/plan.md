# Countdown — Prelaunch page

**Status:** ✅ Complete | **Branch:** feat/countdown-prelunch | **Date:** 2026-06-15
**Screen:** https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/8PJQswPZmU (node 2268:35127)

Full-screen prelaunch/coming-soon page: dark organic background + dark overlay, title
"Sự kiện sẽ bắt đầu sau", and a live DAYS / HOURS / MINUTES countdown in LED-style digit boxes.

## Decisions
See [clarifications.md](clarifications.md). Key: auth-required route `/[locale]/prelaunch`;
freeze at 00:00:00 on completion (no redirect); title localized (vi/en/ja), labels stay English;
reuse existing `useCountdown` hook + `CountdownDisplay` (DRY).

## Two-track execution
- **Track A (UI, background agent):** built the page view + extended `CountdownDisplay` with a
  `variant="prelaunch"` size table. Pixel-validated against Figma.
- **Track B (orchestrator):** auth gating (already covered by `proxy.ts`), i18n title keys, route at
  `/prelaunch`, wired the live `useCountdown()` hook, completion/edge-case behavior.

## Files
- `app/[locale]/prelaunch/page.tsx` — server route (locale + auth-gated via proxy)
- `components/countdown/prelaunch-client.tsx` — client wrapper: useCountdown + i18n title
- `components/countdown/prelaunch-page-view.tsx` — full-screen layout (bg + overlay + content)
- `components/countdown/prelaunch-countdown-block.tsx` — title + CountdownDisplay(prelaunch)
- `components/homepage/countdown-display.tsx` — added `variant` + `splitDigits` digit clamp
- `lib/use-countdown.ts` — added pure `splitDigits()` helper (2-box clamp 00–99)
- `messages/{vi,en,ja}.json` — `prelaunch.title`
- `app/globals.css` — `.prelaunch-countdown-scaler` responsive zoom
- `public/countdown-prelaunch-bg.png` — background asset

## Verification
- `npm run build` ✅ (routes /vi,/en,/ja/prelaunch generated)
- `npx eslint app components lib` ✅
- `npm test` ✅ 25/25 (incl. new splitDigits tests)
- Reviewer: DONE_WITH_CONCERNS → both Important findings fixed (>99-day clamp; stale comments/dead code)

## Spec / test-case coverage
2-digit LED display + uppercase white labels (GUI); ranges hours 00–23 / minutes 00–59, invalid→00,
completion→00 (FUNCTION, handled in `computeCountdown`); unauthenticated→redirect to /login (ACCESSING,
via `proxy.ts`).
