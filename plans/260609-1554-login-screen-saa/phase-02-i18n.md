# Phase 02 — Internationalization (next-intl) (Track B)

**Priority:** P0 · **Status:** completed · BlockedBy: 01 · Blocks: 04,07

## Goal
next-intl with locales **vi (default), en, ja**; locale-aware routing + provider.

## Decisions
- Default locale `vi`. Locales: `vi`, `en`, `ja` (ja deviates from Figma per clarifications).
- Routing strategy: prefer localePrefix `as-needed` (vi unprefixed) OR cookie-based — pick per Next 16 + next-intl docs (read docs first; verify App Router integration).

## Steps
1. Read next-intl docs (context7 / search-docs) for the version installed + Next 16 App Router.
2. `i18n/routing.ts`, `i18n/request.ts`, middleware integration (compose with auth middleware in 03).
3. `messages/vi.json`, `en.json`, `ja.json` — keys for: login (welcome lines, button), header (nav: aboutSaa, awardsInfo, sunKudos; account: profile, signOut, adminDashboard), footer (copyright, links), homepage (comingSoon, days/hours/minutes, event info, CTA labels, awards titles/descriptions, kudos block), language names. Author ja translations (not in Figma).
4. `NextIntlClientProvider` in locale layout. `getTranslations` in server components.

## Related files
- create: `i18n/routing.ts`, `i18n/request.ts`, `messages/{vi,en,ja}.json`, `app/[locale]/layout.tsx`
- modify: `middleware.ts` (shared with auth), `next.config.ts` (next-intl plugin)

## Success
Switching locale re-renders all chrome + screen text in vi/en/ja. Default vi. TC ID-24/25/26/58 satisfied (extended to ja).
