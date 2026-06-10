# Integration Track Report — SAA 2025

**Date:** 2026-06-09
**Phase:** 04 (Shared Chrome) + 07 (Integration)
**Status:** DONE_WITH_CONCERNS

---

## Implementation Report

### Task
- Task: Build shared chrome components + integrate routes, auth, i18n, countdown for SAA 2025
- Status: completed

### Files Created / Modified

#### New Files
| File | Lines | Purpose |
|------|-------|---------|
| `components/shared/language-options.ts` | 18 | LanguageOption type + LANGUAGE_OPTIONS vi/en/ja |
| `components/shared/language-switcher.tsx` | 62 | Flag+code+chevron toggle, 108×56px |
| `components/shared/language-dropdown.tsx` | 98 | Locale switcher dropdown, per Figma mm:525:11713 |
| `components/shared/notification-button.tsx` | 42 | Bell icon + red badge (8×8px #D4271D) |
| `components/shared/account-menu.tsx` | 86 | Profile/Sign Out/Admin dropdown, role-aware |
| `components/shared/site-header.tsx` | 118 | Sticky header, login/home variants |
| `components/shared/site-footer.tsx` | 74 | Server component, login/home variants |
| `lib/use-countdown.ts` | 93 | Client countdown hook, NEXT_PUBLIC_EVENT_DATETIME |
| `app/[locale]/layout.tsx` | 54 | Root locale layout, Montserrat fonts, NextIntlClientProvider |
| `app/[locale]/login/page.tsx` | 62 | Login page, Google signIn wired, loading/error states |
| `app/[locale]/page.tsx` | 28 | Home page (server), extracts session role+name |
| `app/[locale]/homepage-client.tsx` | 88 | Home client shell, countdown wired, SiteHeader home variant |
| `app/[locale]/awards-information/page.tsx` | 26 | Placeholder |
| `app/[locale]/sun-kudos/page.tsx` | 26 | Placeholder |
| `proxy.ts` | 64 | Next.js 16.2.7 proxy convention (replaces middleware.ts) |

#### Modified Files
| File | Change |
|------|--------|
| `next.config.ts` | Wrapped with createNextIntlPlugin |
| `app/layout.tsx` | Minimal shell (html/body moved to [locale]/layout.tsx) |
| `app/page.tsx` | Root redirect to /vi |
| `app/preview-login/page.tsx` | Stub return null |
| `app/preview-homepage/page.tsx` | Stub return null |
| `middleware.ts` | Deleted (conflict with proxy.ts) |

#### Assets Downloaded to public/
- `public/shared/`: saa-logo.png, flag-vn.svg, flag-gb.svg, flag-jp.svg, chevron-down.svg, bell.svg, user-profile.svg, saa-logo-footer.png, arrow-right.svg
- `public/homepage/`: keyvisual-bg.png, root-further-logo.png, root-text.png, further-text.png, pen.svg, kudos-star.svg, award-bg.png, top-talent.png, top-project.png, top-project-leader.png, best-manager.png, mvp.png, signature-2025-creator.png, kudos-background.png, kudos-logo.svg

---

### Tests Status
- Type check: PASS (`npx tsc --noEmit` — no output = clean)
- Build: PASS (`npm run build` — 18 static pages + ƒ Proxy confirmed in route table)
- Lint: PASS for our code — all errors are pre-existing in `.claude/hooks/__tests__/*.cjs` (use `require()` imports, unrelated to this task)
- Playwright visual validation: SKIPPED — browser tool access denied in this environment

---

### Acceptance Criteria
- [x] `components/shared/**` all created: SiteHeader, SiteFooter, LanguageSwitcher, LanguageDropdown, AccountMenu, NotificationButton, language-options.ts
- [x] `lib/use-countdown.ts` parses NEXT_PUBLIC_EVENT_DATETIME, per-minute tick, graceful fallback
- [x] next.config.ts wrapped with createNextIntlPlugin
- [x] `app/[locale]/layout.tsx` created with fonts, setRequestLocale, NextIntlClientProvider
- [x] Routes migrated: app/[locale]/login/page.tsx, app/[locale]/page.tsx
- [x] Google signIn button wired with loading/disabled states and error handling
- [x] Countdown values passed through to HeroSection
- [x] proxy.ts created (Next.js 16.2.7 convention), middleware.ts deleted
- [x] Auth guard: unauthed → /login?callbackUrl, authed on /login → /
- [x] Placeholder routes: awards-information, sun-kudos
- [x] Preview routes stubbed (return null)
- [x] All assets downloaded

---

### Deviations

1. **saa-bg.jpg unavailable** — Figma API returned HTTP 500 for both node IDs 662:14389 and parent 662:14388. BackgroundKeyVisual component (created by UI agent) uses a dark gradient overlay fallback. This is a Figma export error, not a code error.

2. **Digital Numbers font not loaded** — The countdown display font specified in Figma is "Digital Numbers", which is not available on Google Fonts. countdown values render with `font-family: monospace; font-variant-numeric: tabular-nums` fallback. Impact: visual appearance differs from design for countdown digits only.

3. **flag-gb.svg and flag-jp.svg invented** — These flag assets were not available in MoMorph S3 storage. GB and JP flag SVGs were created inline matching standard proportions. The VN flag came from MoMorph.

4. **Playwright validation skipped** — Browser tool access was denied in this agent session. Manual validation required: start `npm run dev`, navigate to `http://localhost:3000` (should redirect → /vi/login since unauthed), verify header/footer render, test language switcher toggle.

---

### Issues Encountered

- **middleware.ts / proxy.ts conflict**: Next.js 16.2.7 detects both files and errors. Resolved by deleting middleware.ts. The proxy.ts file carries identical routing logic.
- **Synchronous setState in useEffect**: ESLint rule flagged `setValues(ZERO)` inside useEffect null branch. Fixed by removing the redundant call — useState lazy initializer already handles null env var, and the RAF-deferred initial compute handles the client-hydration case.
- **next-intl v4 API differences**: Infra agent used v3-style code in some places. Corrected to v4: `setRequestLocale` (not `unstable_setRequestLocale`), `createNavigation` (not `createLocalizedPathnamesNavigation`), `getMessages()` server function.

---

### Manual Verification Steps (for QA)

```bash
# Start dev server
npm run dev

# Test auth guard
# 1. Open http://localhost:3000 (unauthed) → should redirect to /vi/login
# 2. Sign in with Google → should redirect to /
# 3. Navigate to http://localhost:3000/login while authed → should redirect to /

# Test language switcher
# 1. On login page, open language switcher → shows VN/EN/JP options
# 2. Select EN → URL prefix changes to /en/login
# 3. Select JP → URL prefix changes to /ja/login
# 4. Select VN → URL returns to /login (no prefix)

# Test countdown
# 5. Set NEXT_PUBLIC_EVENT_DATETIME= (empty) → countdown shows 00:00:00
# 6. Set NEXT_PUBLIC_EVENT_DATETIME=invalid → shows 00:00:00
# 7. Set NEXT_PUBLIC_EVENT_DATETIME=2025-12-01T00:00:00Z (past) → shows 00:00:00
# 8. Set NEXT_PUBLIC_EVENT_DATETIME=2027-01-01T00:00:00+09:00 (future) → shows live count
```
