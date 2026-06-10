# Phase 03 — Auth.js + Guard (Track B)

**Priority:** P0 · **Status:** completed · BlockedBy: 01 · Blocks: 04,07

## Goal
Auth.js v5 + Google OAuth, JWT session (no DB), role via `ADMIN_EMAILS`, route guard.

## Decisions
- next-auth v5 (`auth.ts` root config). Provider: Google. Session strategy: `jwt`.
- `role`: in `jwt` callback set `token.role = ADMIN_EMAILS.includes(email) ? 'admin' : 'user'`; expose on `session.user.role`.
- Redirect after sign-in → `/`. Sign-out → `/login`.

## Steps
1. Read Auth.js v5 + Next 16 docs (search-docs/context7) — App Router handlers, middleware auth.
2. `auth.ts`: providers, callbacks (jwt, session), pages: `{ signIn: '/login' }`.
3. `app/api/auth/[...nextauth]/route.ts` → export handlers.
4. Middleware: compose next-intl + auth. Rules:
   - Unauthenticated → only `/login` (+ public assets); else redirect `/login`.
   - Authenticated on `/login` → redirect `/` (TC Login f62b0c97 / 45278c06).
5. Types: augment `next-auth` Session/JWT with `role`.
6. Server helpers: `auth()` for session in RSC; `signIn('google')` / `signOut()` actions.

## Related files
- create: `auth.ts`, `app/api/auth/[...nextauth]/route.ts`, `types/next-auth.d.ts`, `lib/auth-helpers.ts`
- modify: `middleware.ts`

## Success
Google sign-in → `/`; guard redirects both directions; admin email → role=admin. Loading/disabled states wired in integration.

## Security
OWASP: secure JWT cookie (httpOnly, sameSite lax), `AUTH_SECRET` from env, no creds in client bundle, validate redirect targets.
