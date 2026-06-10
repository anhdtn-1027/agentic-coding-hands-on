# Phase 07 — Integration (Track B)

**Priority:** P0 · **Status:** completed · BlockedBy: 04 · integrates A (05,06) incrementally

## Goal
Assemble routes; wire shared chrome + auth + i18n + countdown into Track A bodies. No hard merge point — integrate each screen as its UI agent completes.

## Steps
1. Routes under `app/[locale]/`:
   - `app/[locale]/login/page.tsx` — SiteHeader variant=login + Login body + SiteFooter variant=login + background. Server: if session → redirect `/`.
   - `app/[locale]/page.tsx` — SiteHeader variant=home + Homepage body + SiteFooter variant=home. (Replaces starter `app/page.tsx` — remove/redirect old.)
2. Wire Google button: `signIn('google')`, loading/disabled during pending (TC 37eae882, c18649fa). Error → display message.
3. Wire account menu (session.user, role), notification (mock unread), language dropdown (setLocale), nav links + CTA + award cards → placeholder routes / hash anchors.
4. Countdown display ← `use-countdown` with `EVENT_DATETIME`.
5. Remove default starter page/assets; ensure `/` → Homepage. Handle locale redirect at root.
6. Replace all Track A mock handlers/text with real i18n + handlers.

## Related files
- create: `app/[locale]/login/page.tsx`, `app/[locale]/page.tsx`
- modify/delete: `app/page.tsx`, `app/layout.tsx` (locale-aware)

## Success
End-to-end: visit `/` unauth → `/login` → Google → `/` Homepage; language switch vi/en/ja across chrome+bodies; guard both ways; countdown live. All screens pixel-faithful.
