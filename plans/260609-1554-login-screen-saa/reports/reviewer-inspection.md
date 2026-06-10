# SAA 2025 — Production Readiness Review

**Reviewer:** Staff Engineer (reviewer subagent)
**Date:** 2026-06-10
**Scope:** Login + Homepage + Language Dropdown (Auth.js + next-intl)
**Files inspected:** auth.ts, proxy.ts, types/next-auth.d.ts, i18n/routing|request|navigation.ts,
app/[locale]/layout|page|login/page|homepage-client.tsx, components/shared/** (all 7),
lib/use-countdown.ts + hook + test, components/login/**, components/homepage/** (spot-check),
messages/{vi,en,ja}.json, next.config.ts, .env.example, .gitignore

---

## Score: 7.5 / 10

---

## Overall Assessment

The implementation is structurally sound: auth strategy is correct, i18n wiring is complete,
countdown logic is properly extracted and tested, and the server/client split follows App Router
conventions. No secrets are exposed to the client bundle, no SQL-injection vectors exist, and
the guard correctly enforces authentication. Several bugs and one meaningful security concern
require attention before production.

---

## Critical Issues

### C1 — Email case mismatch in role derivation (auth.ts:29)
**Severity: critical**

```ts
// auth.ts line 29
token.role = getAdminEmails().includes(user.email) ? "admin" : "user";
```

`user.email` from Google OAuth arrives normalized to lowercase. However the ADMIN_EMAILS env var
is user-supplied and may contain mixed-case addresses (e.g. `Admin@Company.com`). The check uses
`Array.includes` which is case-sensitive. An administrator who adds their address with any
uppercase letter will silently receive `role: "user"`.

`getAdminEmails()` already trims whitespace but does not lowercase. `user.email` is also not
lowercased before comparison.

**Fix:**
```ts
// auth.ts
function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

// jwt callback
if (user?.email) {
  token.role = getAdminEmails().includes(user.email.toLowerCase()) ? "admin" : "user";
}
```

---

### C2 — Open redirect via `callbackUrl` in proxy.ts (proxy.ts:43)
**Severity: critical**

```ts
// proxy.ts line 43
loginUrl.searchParams.set("callbackUrl", pathname);
```

`pathname` here is `req.nextUrl.pathname` — that's always a relative path (never an absolute URL
with a host), so this specific guard is safe. However the `callbackUrl` parameter lands in the
query string and is consumed by Auth.js v5's own redirect-after-login logic. Auth.js v5 does
validate `callbackUrl` against `NEXTAUTH_URL` / `AUTH_URL`, but only when using its built-in
`pages.signIn` redirect flow.

In `login/page.tsx`, the button explicitly passes `callbackUrl: "/"` (hardcoded), overriding
whatever was in the URL. That is safe. The risk surface is: a user manually crafts
`/login?callbackUrl=https://evil.com` and Auth.js reads it at callback time. Whether Auth.js
v5 beta 5.0.0-beta.31 fully sanitises this requires confirming — Auth.js has historically had
issues with this (CVE-2023-48309 / GHSA-v64w-49xw-qq89).

**Action required before production:** Verify that next-auth 5.0.0-beta.31 validates
`callbackUrl` to same-origin only. If not confirmed, add server-side validation in the Google
signIn callback or in the `authorized` callback to reject off-origin URLs. The proxy itself is
fine; the concern is Auth.js's internal consumption of the query parameter.

---

## High Priority

### H1 — `SiteFooter` uses `useTranslations` but has no `"use client"` directive
**Severity: high — runtime error in production**

`components/shared/site-footer.tsx` calls `useTranslations("footer")` (a client hook) but has
no `"use client"` directive at the top of the file. It does not appear in the shared component
grep result for `"use client"`.

`SiteFooter` is consumed by:
- `app/[locale]/login/page.tsx` (already `"use client"`)
- `app/[locale]/awards-information/page.tsx` — Server Component
- `app/[locale]/sun-kudos/page.tsx` — Server Component
- `homepage-client.tsx` (already `"use client"`)

When `SiteFooter` renders inside a Server Component (awards-information, sun-kudos), calling
`useTranslations` without a `"use client"` boundary will throw at runtime:
"You're importing a component that needs `useState`. It only works in a Client Component."

The build passes because Next.js defers this check, and the tester only exercised the build
output — not server rendering of those placeholder pages.

**Fix:** Add `"use client";` as the first line of `components/shared/site-footer.tsx`.

Alternatively, use next-intl's `getTranslations` (server) + pass the `t` function as a prop,
but that is a larger refactor. The `"use client"` directive is simpler and correct here since
the footer has no server-side data needs.

---

### H2 — `AwardsGrid` and `KudosBlock` text is hardcoded Vietnamese, not i18n
**Severity: high — correctness vs spec**

Both components contain hardcoded Vietnamese strings:

- `awards-grid.tsx` line 84: `"Sun* annual awards 2025"` (hardcoded)
- `awards-grid.tsx` line 109: `"Hệ thống giải thưởng"` (hardcoded)
- `awards-grid.tsx` AWARDS array: all 6 title/description strings are hardcoded Vietnamese
- `kudos-block.tsx` default props: all text is hardcoded Vietnamese

These are rendered inside `HomepageClient` which is a `"use client"` component, so
`useTranslations` is available. The i18n message files have `homepage.awards.*` and
`homepage.kudos.*` keys in all three locales (vi, en, ja).

Switching the language switcher to EN or JA will leave the awards section and kudos block
entirely in Vietnamese. This contradicts the spec ("full i18n" per clarifications, next-intl
vi/en/ja).

**Fix:** Pass `t` from `useTranslations("homepage")` down to `AwardsGrid` and `KudosBlock` as
props, or convert those components to `"use client"` and call `useTranslations` directly.
The message keys already exist in all three locale files.

---

### H3 — `CountdownDisplay` "Comming soon" label is hardcoded (not i18n)
**Severity: high — correctness vs spec**

`countdown-display.tsx` line 113: `"Comming soon"` is hardcoded English (with the design typo
preserved). When locale is `vi`, users see English text. The key `homepage.comingSoon` exists in
all three message files with correct locale-specific values.

**Fix:** Pass `comingSoonLabel` as a prop from `HomepageClient` (which has `useTranslations`):
```tsx
// homepage-client.tsx
<HeroSection
  ...
  comingSoonLabel={t("comingSoon")}
/>
// hero-section.tsx → CountdownDisplay
<CountdownDisplay ... comingSoonLabel={comingSoonLabel} />
// countdown-display.tsx
{showComingSoon && <span>{comingSoonLabel}</span>}
```

---

### H4 — Countdown unit labels hardcoded English in `CountdownDisplay`
**Severity: high — same root as H3**

`countdown-display.tsx` lines 123/125/127: `label="DAYS"`, `label="HOURS"`, `label="MINUTES"` —
all hardcoded English. Message keys `homepage.days/hours/minutes` exist in all locale files.
Same fix pattern as H3 — pass labels from `HomepageClient` through `HeroSection` down to
`CountdownDisplay`/`TimeUnit`.

---

### H5 — `NEXT_PUBLIC_EVENT_DATETIME` env var not documented in `.env.example`
**Severity: high — deploy correctness**

`.env.example` lists `EVENT_DATETIME` (no `NEXT_PUBLIC_` prefix). But the hook reads
`process.env.NEXT_PUBLIC_EVENT_DATETIME`. A developer copying `.env.example` and setting
`EVENT_DATETIME=...` will see a permanently zeroed countdown with no error or warning.

**Fix:** Rename the key in `.env.example` to `NEXT_PUBLIC_EVENT_DATETIME=...` and update the
comment to explain that the `NEXT_PUBLIC_` prefix is required for client-side access.

---

## Medium Priority

### M1 — Guard regex in proxy.ts does not cover default-locale `/vi/login` path
**Severity: medium — correctness**

```ts
// proxy.ts line 30
const isLoginPage =
  pathname === "/login" || /^\/(?:en|ja)\/login$/.test(pathname);
```

`localePrefix: "as-needed"` means `vi` never gets a prefix, so `/vi/login` is not a valid route
and this is technically correct. However if a user somehow navigates to `/vi/login` (e.g. from a
stale bookmark or SSR mismatch), the guard will not recognise it as the login page and will
redirect an authenticated user through auth-check unnecessarily. This is low-risk but worth
noting. The intl middleware handles `/vi/login` → 404 correctly downstream.

---

### M2 — Session `user.role` typed as non-optional but token.role is optional
**Severity: medium — type safety drift**

In `types/next-auth.d.ts`:
```ts
interface Session {
  user: {
    role: "admin" | "user";  // non-optional
  } & DefaultSession["user"];
}
interface JWT extends DefaultJWT {
  role?: "admin" | "user";  // optional
}
```

In `auth.ts session callback`:
```ts
session.user.role = (token.role as "admin" | "user") ?? "user";
```

The cast `token.role as "admin" | "user"` suppresses the `undefined` possibility instead of
using the `?? "user"` fallback properly. The fallback IS correct (value is fine at runtime),
but TypeScript is deceived by the cast. If `token.role` is ever `undefined` (e.g. a JWT minted
before the role callback was added), the cast silently passes `undefined` to a non-optional
field. The `?? "user"` fallback never fires because the cast comes first.

**Fix:**
```ts
session.user.role = (token.role ?? "user") as "admin" | "user";
```
Cast after the fallback, not before.

---

### M3 — Login page `callbackUrl` ignores the incoming query parameter
**Severity: medium — UX break**

`login/page.tsx:31` hardcodes `callbackUrl: "/"` on every Google sign-in, ignoring
`?callbackUrl=...` in the URL that the proxy correctly placed there. A user visiting
`/dashboard` → redirected to `/login?callbackUrl=/dashboard` → signs in → lands on `/` instead
of `/dashboard`.

This is a UX regression vs. the guard contract documented in `implementer-infra.md §4`.

**Fix:**
```tsx
import { useSearchParams } from "next/navigation";
const searchParams = useSearchParams();
const callbackUrl = searchParams.get("callbackUrl") ?? "/";

// Validate it's a relative path before use:
const safeCallbackUrl = callbackUrl.startsWith("/") ? callbackUrl : "/";

await signIn("google", { redirect: false, callbackUrl: safeCallbackUrl });
```
Note: the validation guard (starts with `/`) is necessary to close the open-redirect concern
raised in C2 at the login-page level independently of Auth.js's own validation.

---

### M4 — `isAboutSelected` in SiteHeader incorrectly matches `/vi` prefix path
**Severity: medium — UI correctness**

```ts
// site-header.tsx line 83
const isAboutSelected =
  pathname === "/" || pathname === "" || pathname === "/vi";
```

`usePathname` from `@/i18n/navigation` (next-intl's wrapper) returns the path **without the
locale prefix**. For all locales, the homepage pathname is `/` — not `/vi`. The `pathname === "/vi"`
condition never matches (it would always be `/`), but the condition is harmless because `/` is
matched. The dead `"/vi"` case is misleading and should be removed.

---

### M5 — Preview routes still exist and are unguarded by auth
**Severity: medium — unintended access**

`app/preview-login/page.tsx` and `app/preview-homepage/page.tsx` return `null` but the routes
still exist in the build. The matcher in `proxy.ts` does not exclude these paths, so they pass
through the auth guard — but since they return `null` they're benign. Still, stubs should
either be deleted from the filesystem or explicitly 404'd to avoid route table noise.

---

## Low Priority

### L1 — `ZERO` constant duplicated between use-countdown.ts and use-countdown-hook.ts
Both files define a `ZERO: CountdownValues = { days: "00", hours: "00", minutes: "00", showComingSoon: false }`.
The hook imports from the pure module — export `ZERO` from `use-countdown.ts` and import it
in the hook to satisfy DRY.

### L2 — `countdownDisplay` "Comming soon" preserves Figma design typo in code
The typo `"Comming soon"` (double m) is hardcoded. Once i18n is wired (H3 fix), this becomes a
translation key issue, not a code issue. After H3 is fixed, vi.json already has the correct
Vietnamese text.

### L3 — `SiteFooter` home variant renders "About SAA" link twice
`site-footer.tsx` lines 93 and 146 both render the same `{t("links.aboutSaa")}` → `/` link.
The second appears to duplicate the first (matches Figma node `1161:9487`). Verify against
design whether a 4th distinct link was intended; if not, remove the duplicate.

### L4 — `KudosBlock` and `AwardsGrid` used without i18n prop injection in HomepageClient
`homepage-client.tsx` calls `<KudosBlock detailHref="/sun-kudos" />` and `<AwardsGrid />` with
no i18n strings passed. Until H2 is fixed, swapping to a different locale leaves large sections
untranslated. This is consequence of H2.

### L5 — `RootFurtherContent` has no props and no i18n — paragraph text hardcoded Vietnamese
`root-further-content.tsx` has no props and contains hardcoded Vietnamese paragraph text.
If the spec truly requires full i18n, this also needs message keys. Low impact if this section
content is intentionally Vietnamese-only (brand language).

### L6 — `countdown-display.tsx` `TimeUnit` splits `value` character-by-character
```ts
const tens = value.length >= 2 ? value[0] : "0";
const units = value.length >= 2 ? value[1] : value[0] ?? "0";
```
This works for 2-digit values (the guaranteed case from `pad()`). For values > 99 days (e.g.
`"100"`), `TimeUnit` only renders `"1"` and `"0"` (first two chars), losing the hundreds digit.
Tests confirm `pad(100)` → `"100"` is a valid output. The visual display would silently drop the
leading digit. Consider clamping at 99 in `computeCountdown` or accepting this as a known
cosmetic limitation.

---

## Edge Cases Found

**EC1 — Race: countdown initial value vs. first interval tick**
The hook uses `requestAnimationFrame` to sync the initial value post-hydration, then
`setInterval(60_000)` for ticks. If the user's browser throttles rAF (background tab), the
initial displayed value stays as ZERO (SSR placeholder) until the next minute boundary. For
events far in the future this is cosmetic, but for events < 1 minute away the display could
show 00:00:00 briefly. Acceptable for this use case.

**EC2 — `getAdminEmails()` called on every JWT refresh**
`getAdminEmails()` reads `process.env.ADMIN_EMAILS` and splits/maps/filters on every JWT
callback invocation (every request that touches session). For low traffic this is negligible,
but it allocates a new array every time. Minor: memoize at module level if performance is a
concern.

**EC3 — `callbackUrl` param stored as `pathname` (no query string)**
In `proxy.ts` line 43, only `pathname` (not `pathname + search`) is stored in `callbackUrl`.
A user visiting `/search?q=foo` → redirected to login → signs in → lands on `/search` (no
query). `req.nextUrl.pathname` does not include the search string. Consider using
`req.nextUrl.pathname + req.nextUrl.search` for a complete post-login restore.

---

## Positive Observations

- Auth.js JWT strategy with no DB is the right choice for this use case; callback chain is clean.
- `getAdminEmails()` trims whitespace — good defensive coding for env vars.
- `localeDetection: false` correctly enforced — default locale is `vi` regardless of browser.
- `notFound()` on unrecognized locale segments in layout.tsx is correct and complete.
- Countdown logic extraction (`pure functions + "use client" hook separate file`) is excellent: testable, SSR-safe, clean separation.
- 24 unit tests cover all TC IDs (39–43, 56, 57, 60) with custom `now` injection — deterministic, no flaky timing.
- Both dropdown components (LanguageDropdown, AccountMenu) correctly clean up `mousedown` and `keydown` listeners on unmount.
- `role="menu"` / `role="menuitem"` / `role="listbox"` / `role="option"` ARIA roles are correct.
- `aria-expanded`, `aria-haspopup`, `aria-busy`, `aria-disabled` all set correctly on interactive elements.
- No secrets or server-only env vars (`ADMIN_EMAILS`, `GOOGLE_CLIENT_*`, `AUTH_SECRET`) appear in any `"use client"` file.
- `NEXT_PUBLIC_EVENT_DATETIME` is correctly prefixed for client bundle exposure (only non-sensitive data).
- `.env*` glob in `.gitignore` prevents accidental credential commits.
- `session` callback casts `token.role` with fallback — prevents null `role` on session reads.
- Preview routes stubbed to `return null` after integration — no dangling implementation code.

---

## Guard / Auth / i18n Spec Verification

| Rule | Status | Notes |
|---|---|---|
| Unauthed → /login?callbackUrl | PASS | proxy.ts:40–45 correct |
| Authed on /login → / | PASS | proxy.ts:48–53 correct |
| localeDetection: false (vi default) | PASS | i18n/routing.ts confirmed |
| vi/en/ja locales | PASS | routing.ts + all 3 message files |
| No locale prefix for vi | PASS | `localePrefix: "as-needed"` |
| Admin Dashboard admin-only | PASS | account-menu.tsx:127 role guard |
| Google JWT, no DB | PASS | auth.ts strategy: "jwt" |
| Countdown graceful fallback | PASS | parseEventDatetime returns null, hook zeros out |
| Countdown past event zeroed | PASS | computeCountdown diffMs <= 0 → ZERO |
| callbackUrl in login ignored | FAIL | M3 — hardcoded "/" overrides original destination |
| Awards/Kudos/Countdown i18n | FAIL | H2, H3, H4 — hardcoded strings |

---

## Recommended Actions (Priority Order)

1. **[Critical]** Normalize email case in `auth.ts` `getAdminEmails()` and jwt callback (C1)
2. **[Critical]** Verify Auth.js v5 beta 31 `callbackUrl` open-redirect protection; add
   same-origin validation in login/page.tsx if not confirmed (C2 + M3)
3. **[High]** Add `"use client"` to `site-footer.tsx` (H1 — prevents runtime crash on
   awards-information and sun-kudos server pages)
4. **[High]** Wire i18n for AwardsGrid, KudosBlock, CountdownDisplay labels (H2, H3, H4)
5. **[High]** Fix `NEXT_PUBLIC_EVENT_DATETIME` in `.env.example` (H5 — prevents silent zero
   countdown in all deployments)
6. **[Medium]** Read `?callbackUrl` from search params in login/page.tsx and sanitize to
   same-origin (M3)
7. **[Medium]** Fix `session.user.role` cast order in auth.ts (M2 — currently `as` before `??`)
8. **[Low]** Remove dead `pathname === "/vi"` branch in SiteHeader (M4)
9. **[Low]** Export `ZERO` from use-countdown.ts and import in hook to eliminate duplication (L1)
10. **[Low]** Investigate footer's 4th "About SAA" link (L3 — possible duplication)

---

## Metrics

| Metric | Value |
|---|---|
| Type safety | PASS (tsc --noEmit clean, strict mode) |
| Tests | 24/24 pass |
| Linting | PASS (app code) |
| Build | PASS |
| i18n completeness | PARTIAL (awards/kudos/countdown hardcoded) |
| File sizes | All files ≤ 175 lines — within 200-line guideline |
| Secrets in client bundle | NONE confirmed |

---

## Unresolved Questions

1. Does next-auth 5.0.0-beta.31 fully validate `callbackUrl` to same-origin? (C2 must be
   answered before production deploy)
2. Is `RootFurtherContent` text intentionally Vietnamese-only (brand language) or should it be
   i18n-ized? (L5)
3. Is the 4th footer link (node `1161:9487`) a deliberate 4th unique link or a duplicate of
   "About SAA"? (L3)
4. Is the `"Comming soon"` Figma typo to be preserved in production or corrected in the i18n
   message files?

---

**Status:** DONE_WITH_CONCERNS

**Summary:** Implementation is architecturally correct with passing build/types/tests. Found 2
critical issues (email case mismatch in role derivation, open-redirect callbackUrl risk), 5 high
issues (SiteFooter missing `"use client"` causing runtime crash on server pages, i18n gaps in
AwardsGrid/KudosBlock/CountdownDisplay, wrong env var name in .env.example), and several medium
concerns. The guard/i18n structure is correct; the identified issues are fixable without
architectural changes.

**Concerns/Blockers:** C1 (email case) and H1 (SiteFooter "use client") are production-breaking
bugs that must be fixed before deploy. C2 (open redirect) requires Auth.js version confirmation.
H2–H4 (i18n gaps) break the "full i18n" spec requirement. H5 causes silent countdown failure in
all deployments that follow .env.example. Recommend fixing all Critical + High items before
merging.
