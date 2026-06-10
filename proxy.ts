// proxy.ts — replaces middleware.ts in Next.js 16.2.7+
// ("middleware" file convention deprecated → use "proxy")
// Composed: next-intl locale routing + auth guard
//
// Guard rules:
//   - Unauthenticated + non-public route → /login?callbackUrl=<path>
//   - Authenticated + on /login → /
//   - All else → next-intl middleware (handles locale prefix)
//
// Matcher: skips _next internals, _vercel, api routes, static files (dot in path).

import createMiddleware from "next-intl/middleware";
import { auth } from "@/auth";
import { routing } from "@/i18n/routing";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default auth(function middleware(req: NextRequest) {
  // auth() wraps the request and attaches .auth (session) to it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).auth as { user?: unknown } | null;
  const { pathname } = req.nextUrl;

  const isAuthed = !!session?.user;

  // Login page matches /login (vi default no-prefix) and /en/login /ja/login
  const isLoginPage =
    pathname === "/login" || /^\/(?:en|ja)\/login$/.test(pathname);

  // Homepage is public (TC ID-0: unauthenticated users see public content).
  // Matches "/" (vi default no-prefix) and "/en" /"/ja".
  const isHomePage = pathname === "/" || /^\/(?:en|ja)$/.test(pathname);

  // Public paths that never require auth
  const isPublic =
    isLoginPage ||
    isHomePage ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel");

  // Unauthed on guarded route → redirect to /login
  if (!isAuthed && !isPublic) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authed on login page → redirect to homepage
  if (isAuthed && isLoginPage) {
    const homeUrl = req.nextUrl.clone();
    homeUrl.pathname = "/";
    homeUrl.search = "";
    return NextResponse.redirect(homeUrl);
  }

  // All other requests: let next-intl handle locale prefix routing
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Match all paths except Next.js internals, static assets (contain a dot), and api routes
    "/((?!_next|_vercel|api|.*\\..*).*)",
  ],
};
