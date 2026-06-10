# Track B Infrastructure Report — SAA 2025

## 1. Files Created / Modified

| File | Action | Notes |
|---|---|---|
| `package.json` | modified | added `next-auth@beta`, `next-intl@^3.26.5` |
| `.env.example` | created | all 6 env vars documented with comments |
| `.env.local` | SKIPPED | privacy hook blocked write; user must copy from `.env.example` |
| `app/globals.css` | modified (additive) | SAA design tokens added to `@theme inline` block |
| `i18n/routing.ts` | created | `defineRouting`: locales vi/en/ja, defaultLocale vi, localePrefix as-needed |
| `i18n/request.ts` | created | `getRequestConfig` with locale validation + message import |
| `i18n/navigation.ts` | created | `createNavigation` wrappers (Link, redirect, usePathname, useRouter, getPathname) |
| `messages/vi.json` | created | Vietnamese — sourced from Figma text; 8 namespaces |
| `messages/en.json` | created | English — authored translations; 8 namespaces |
| `messages/ja.json` | created | Japanese — authored translations (deviates from Figma per clarifications); 8 namespaces |
| `auth.ts` | created | NextAuth v5 config: Google provider, JWT strategy, role callback |
| `app/api/auth/[...nextauth]/route.ts` | created | exports `{ GET, POST }` from handlers |
| `types/next-auth.d.ts` | created | augments `Session.user.role` + `JWT.role` |
| `lib/auth-helpers.ts` | created | re-exports `auth`, `signIn`, `signOut` from `@/auth` |
| `middleware.ts` | created | minimal/non-disruptive; auth guard DISABLED behind flag |

---

## 2. Dependencies + Versions

Added to `package.json` (requires `npm install` to resolve):

```
next-auth   beta       (Auth.js v5; latest beta as of 2026-06 is 5.0.0-beta.29)
next-intl   ^3.26.5    (latest stable; supports Next.js App Router + React 19)
```

Both packages support React 19 and Next.js App Router. `next-auth@beta` requires `AUTH_SECRET` env var; the project's `.env*` glob is already gitignored.

**Action required by orchestrator/user:** run `npm install` after this task completes (Bash was hook-blocked for this agent).

---

## 3. next-intl Plugin Wiring — FOR INTEGRATION TO APPLY

Integration track applies these two changes. Do NOT apply them until UI-agent preview routes are retired.

### 3a. `next.config.ts` — wrap with createNextIntlPlugin

```ts
// next.config.ts
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin(
  // Points to i18n/request.ts (default path; explicit for clarity)
  "./i18n/request.ts"
);

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* existing config options */
};

export default withNextIntl(nextConfig);
```

### 3b. `app/[locale]/layout.tsx` — locale-aware root layout

```tsx
// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Montserrat, Montserrat_Alternates } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";

const montserrat = Montserrat({
  variable: "--font-saa-brand",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const montserratAlt = Montserrat_Alternates({
  variable: "--font-saa-alt",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sun* Annual Awards 2025",
  description: "SAA 2025 — Vinh danh những cá nhân xuất sắc",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale — notFound() for unrecognised segments
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${montserratAlt.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-saa-bg)] text-[var(--color-saa-text-primary)]">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### 3c. middleware.ts — compose next-intl + auth guard at integration

```ts
// Replace middleware.ts at integration with:
import createMiddleware from "next-intl/middleware";
import { auth } from "@/auth";
import { routing } from "@/i18n/routing";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default auth(function middleware(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).auth as { user?: unknown } | null;
  const { pathname } = req.nextUrl;

  const isAuthed = !!session?.user;
  const isLoginPage = pathname === "/login" || /^\/(?:en|ja)\/login$/.test(pathname);
  const isPublic = isLoginPage || pathname.startsWith("/api/auth");

  if (!isAuthed && !isPublic) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthed && isLoginPage) {
    const homeUrl = req.nextUrl.clone();
    homeUrl.pathname = "/";
    homeUrl.search = "";
    return NextResponse.redirect(homeUrl);
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // next-intl: skip internals + static files
    "/((?!_next|_vercel|api|.*\\..*).*)",
  ],
};
```

---

## 4. Final Intended Middleware Matcher + Guard Logic

**Current state (this phase):** matcher covers only `["/", "/login"]`. Guard disabled via `ENABLE_AUTH_GUARD = false`. All `/preview-*` routes, `/api/*`, `/_next/*`, and static assets are unaffected.

**At integration:**
- Replace with the composed next-intl + auth guard shown in §3c above
- Remove `ENABLE_AUTH_GUARD` flag
- Matcher: `/((?!_next|_vercel|api|.*\\..*).*)`

**Guard rules:**
- Unauthenticated + non-public route → redirect to `/login?callbackUrl=<original-path>`
- Authenticated + on `/login` → redirect to `/`
- All else → pass through to next-intl middleware (handles locale prefix)

---

## 5. i18n Message Key Namespaces

All three locale files (`vi.json`, `en.json`, `ja.json`) share this namespace structure:

```
locale.{vi,en,ja}               — language display names
login.{welcomeLine1,welcomeLine2,googleButton}
header.nav.{aboutSaa,awardsInfo,sunKudos}
header.account.{profile,signOut,adminDashboard}
header.notifications
footer.{copyright,links.{aboutSaa,awardsInfo,sunKudos}}
homepage.{comingSoon,days,hours,minutes,seconds,eventTime,eventLocation,eventNote,
          aboutAwards,aboutKudos,awardsCaption,awardsTitle}
homepage.awards.{starOfTheYear,bestLeader,riseOfTheYear,bestTeam,innovationAward,
                 customerChampion}.{title,description}
homepage.kudos.{label,title,description,detail}
```

`vi` text is sourced directly from Figma design content. `en` and `ja` are authored translations (clarifications authorised ja as invented content).

---

## 6. Auth Role Logic

```ts
// In auth.ts jwt callback:
token.role = getAdminEmails().includes(user.email) ? "admin" : "user";
```

- `ADMIN_EMAILS` env var: comma-separated list of Google email addresses
- Role is set once on first JWT creation (when `user` object is present)
- Role persists in JWT across subsequent requests via `token.role`
- `session` callback copies `token.role` onto `session.user.role`
- TypeScript augmentation in `types/next-auth.d.ts` makes `session.user.role` typed as `"admin" | "user"` (no `any`)

---

## 7. Deviations / Blockers

| Item | Detail |
|---|---|
| `.env.local` not created | Privacy hook blocked the write. User must: `cp .env.example .env.local` then fill in `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and optionally `ADMIN_EMAILS`. `AUTH_SECRET` placeholder is in the example. |
| `npm install` not run | Bash tool was hook-blocked. Orchestrator must run `npm install` before `npx tsc --noEmit` can pass. |
| `next.config.ts` not modified | Intentional per task spec — next-intl plugin wiring deferred to integration to avoid breaking UI-agent preview routes. Exact snippet provided in §3a. |
| `app/[locale]/layout.tsx` not created | Intentional — owned by integration track. Exact snippet provided in §3b. |
| `next-auth@beta` exact version | Package.json uses `"beta"` tag. Actual resolved version will be the latest beta at install time (5.0.0-beta.29 as of 2026-06). Lock file will pin it after `npm install`. |
| `tsc --noEmit` not run | Cannot run without `npm install` completing first (type definitions from next-auth + next-intl are not yet on disk). Mark as pending orchestrator action. |

---

**Status:** DONE_WITH_CONCERNS

**Summary:** All Track B infrastructure files are written — deps declared in package.json, design tokens added to globals.css, i18n modules (routing/request/navigation + 3 locale files), Auth.js v5 config with Google provider + role callback, route handler, type augmentations, auth helpers, and minimal non-disruptive middleware. next.config.ts and [locale] layout wiring deferred to integration as required.

**Concerns/Blockers:**
1. `npm install` must be run by orchestrator before types resolve — tsc cannot be verified until then.
2. `.env.local` was not created (privacy hook block) — user must create it manually from `.env.example`.
3. Integration track must apply §3a (next.config.ts), §3b ([locale]/layout.tsx), and §3c (middleware replacement) to fully activate i18n routing and auth guard.
