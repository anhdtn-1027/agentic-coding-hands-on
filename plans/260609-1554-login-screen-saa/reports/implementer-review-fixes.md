# Implementation Report — Review Fixes

**Date:** 2026-06-10
**Scope:** Apply all findings from reviewer-inspection.md

---

## Findings Applied

### C1 — Email case mismatch (auth.ts) — DONE
- `getAdminEmails()`: added `.toLowerCase()` to `.map(s => s.trim().toLowerCase())`
- jwt callback: `user.email.toLowerCase()` before `.includes()` comparison
- Guard `user?.email` already present (unchanged)

### H1 — SiteFooter missing `"use client"` (site-footer.tsx) — DONE
- Added `"use client";` as first line of `components/shared/site-footer.tsx`

### H5 — `.env.example` wrong env var name — DONE (partial)
- `.env.example`: renamed `EVENT_DATETIME` → `NEXT_PUBLIC_EVENT_DATETIME`, added comment explaining NEXT_PUBLIC_ prefix requirement
- `.env.local`: **BLOCKED by privacy hook** — cannot read/write this file programmatically. Manual action required: rename `EVENT_DATETIME` → `NEXT_PUBLIC_EVENT_DATETIME` in `.env.local` line 15.

### M2 — Session callback cast order (auth.ts) — DONE
- Changed `(token.role as "admin" | "user") ?? "user"` → `(token.role ?? "user") as "admin" | "user"`
- `??` fallback now fires correctly before cast

### M3 — Login page ignores `?callbackUrl` (login/page.tsx) — DONE
- Added `useSearchParams()` import from `next/navigation`
- Reads `callbackUrl` from search params, sanitizes to same-origin (`startsWith("/") && !startsWith("//")`)
- Passes `safeCallbackUrl` to `signIn()` and `router.push()`
- Wrapped `LoginContent` (which uses `useSearchParams`) in `<Suspense>` boundary — required by Next.js 16 App Router for static prerendering

### H3 — CountdownDisplay "Comming soon" hardcoded (countdown-display.tsx) — DONE
- Added `comingSoonLabel?: string` prop (default "Coming Soon")
- JSX now renders `{comingSoonLabel}` instead of hardcoded string
- Threaded through `HeroSection` → `HomepageClient` using `t("comingSoon")`

### H4 — Countdown unit labels hardcoded (countdown-display.tsx) — DONE
- Added `daysLabel?`, `hoursLabel?`, `minutesLabel?` props (defaults DAYS/HOURS/MINUTES)
- `TimeUnit` now receives these from props
- Threaded through `HeroSection` → `HomepageClient` using `t("days")`, `t("hours")`, `t("minutes")`

### H2 — AwardsGrid + KudosBlock hardcoded Vietnamese — DONE
- `awards-grid.tsx`: added `"use client"` directive; replaced hardcoded "Sun* annual awards 2025" and "Hệ thống giải thưởng" with `t("awardsCaption")` and `t("awardsTitle")`; AWARDS array converted to visual-only metadata (AWARD_VISUALS); card title/description now driven by `t("awards.{key}.title")` / `t("awards.{key}.description")` using 6 message keys: starOfTheYear, bestLeader, riseOfTheYear, bestTeam, innovationAward, customerChampion
- `kudos-block.tsx`: added `"use client"` directive; removed hardcoded default props; uses `useTranslations("homepage.kudos")`; label → `t("label")`, title → `t("title")`, paragraph → `t("detail")`, button text → `t("description")`

### M4 — Dead `pathname === "/vi"` branch (site-header.tsx) — DONE
- Removed dead condition; `isAboutSelected` is now `pathname === "/" || pathname === ""`

### L1 — ZERO constant duplicated — DONE
- Exported `ZERO` from `lib/use-countdown.ts`
- Removed duplicate declaration from `lib/use-countdown-hook.ts`; imports `ZERO` from `use-countdown`

---

## Files Modified

| File | Change |
|---|---|
| `auth.ts` | C1 (lowercase), M2 (cast order) |
| `components/shared/site-footer.tsx` | H1 ("use client") |
| `.env.example` | H5 (key rename + comment) |
| `app/[locale]/login/page.tsx` | M3 (useSearchParams + Suspense boundary) |
| `components/homepage/countdown-display.tsx` | H3, H4 (i18n label props) |
| `components/homepage/hero-section.tsx` | H3, H4 (thread i18n props) |
| `app/[locale]/homepage-client.tsx` | H3, H4 (pass t("comingSoon"), t("days/hours/minutes")) |
| `components/homepage/awards-grid.tsx` | H2 ("use client" + useTranslations) |
| `components/homepage/kudos-block.tsx` | H2 ("use client" + useTranslations) |
| `components/shared/site-header.tsx` | M4 (remove dead branch) |
| `lib/use-countdown.ts` | L1 (export ZERO) |
| `lib/use-countdown-hook.ts` | L1 (import ZERO, remove duplicate) |

---

## Verification Results

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npm run build` | Success — 18 pages generated |
| `npm run lint` | App code clean; pre-existing .claude/hooks CJS errors only (excluded per spec) |
| `npm run test` | 24/24 pass |

---

## Manual Action Required

**.env.local line 15**: Privacy hook blocks programmatic writes. Rename manually:
```
EVENT_DATETIME=2025-12-26T18:30:00+07:00
# → change to:
NEXT_PUBLIC_EVENT_DATETIME=2025-12-26T18:30:00+07:00
```

---

## Notes / Concerns

1. **H2 award key mismatch**: The AWARDS array in `awards-grid.tsx` previously used different award names (Top Talent, Top Project, etc.) vs the i18n message keys (starOfTheYear, bestLeader, etc.). After the fix, card titles/descriptions come entirely from message files. Visual assets (image paths/dims) are unchanged. This is the correct behavior per the "full i18n" spec.

2. **KudosBlock button text**: `t("description")` = "Hãy gửi lời khen ngợi và ghi nhận đồng nghiệp của bạn" (vi) renders as the button label — this is longer than the original "Chi tiết". The `detail` key (single sentence) renders in the paragraph. This mapping uses all 4 message keys per reviewer instruction. A dedicated `detailButtonLabel` key could improve this in a follow-up.

3. **M3 Suspense**: The `LoginContent` inner component pattern required to satisfy Next.js 16's static prerendering requirement for `useSearchParams`. The fallback is an empty flex div to maintain layout height.

---

**Status:** DONE_WITH_CONCERNS
**Summary:** All 10 listed fixes applied and verified (tsc clean, build passes, 24/24 tests pass, app lint clean). One manual action needed for `.env.local` due to privacy hook blocking programmatic file access.
**Concerns/Blockers:** (1) `.env.local` KEY rename requires manual edit — countdown will not work in dev until done. (2) KudosBlock button label uses the `description` message key (a full sentence) instead of the original short "Chi tiết" label — functional but visually verbose; track as UX follow-up.
