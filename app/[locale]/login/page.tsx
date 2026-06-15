"use client";

// app/[locale]/login/page.tsx
// SiteHeader(login) + BackgroundKeyVisual + LoginHero(wired) + SiteFooter(login)
// Guard: if session exists → redirect to / (handled in middleware)
// Google button → signIn('google'), loading/disabled during pending (TC 37eae882, c18649fa)

import { Suspense, useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import {
  BackgroundKeyVisual,
  LoginHero,
} from "@/components/login";

// Inner component isolated so useSearchParams is inside a Suspense boundary.
// Next.js requires any component using useSearchParams to be wrapped in Suspense.
function LoginContent() {
  const t = useTranslations("login");
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [devEmail, setDevEmail] = useState("dev@sun-asterisk.com");

  // DEV-only login (no Google needed). Mirrors the auth.ts "dev-login" provider,
  // which is itself only registered when NODE_ENV !== "production".
  const isDev = process.env.NODE_ENV !== "production";

  // Read callbackUrl from query string (set by proxy.ts for post-login redirect).
  // Sanitize to same-origin relative path only — reject anything with a host (open-redirect guard).
  const rawCallbackUrl = searchParams.get("callbackUrl") ?? "/";
  const safeCallbackUrl =
    rawCallbackUrl.startsWith("/") && !rawCallbackUrl.startsWith("//")
      ? rawCallbackUrl
      : "/";

  async function handleGoogleSignIn() {
    setError(null);
    startTransition(async () => {
      try {
        // Google is an OAuth provider — it requires a full-page redirect to the
        // Google consent screen (NOT a popup, and NOT redirect:false which only
        // suits the Credentials provider). next-auth navigates the browser to
        // Google and, after auth, returns to `callbackUrl`.
        await signIn("google", { callbackUrl: safeCallbackUrl });
      } catch {
        setError("An unexpected error occurred. Please try again.");
      }
    });
  }

  // DEV-only: Credentials provider completes server-side, so we DON'T redirect
  // through a provider page — use redirect:false then navigate to callbackUrl.
  async function handleDevSignIn() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await signIn("dev-login", {
          email: devEmail.trim() || "dev@sun-asterisk.com",
          redirect: false,
        });
        if (res?.error) {
          setError("Dev login failed.");
        } else {
          // Full navigation so the freshly set session cookie is picked up.
          window.location.href = safeCallbackUrl;
        }
      } catch {
        setError("An unexpected error occurred. Please try again.");
      }
    });
  }

  return (
    <>
      {/* Layer B — hero content (z-10, absolute per Figma layout) */}
      <main className="flex-1 relative z-10">
        <LoginHero
          welcomeText={{
            line1: t("welcomeLine1"),
            line2: t("welcomeLine2"),
          }}
          loginButton={{
            onClick: handleGoogleSignIn,
            loading: isPending,
            disabled: isPending,
            label: t("googleButton"),
          }}
        />

        {/* Error message (TC c18649fa — failure state) */}
        {error && (
          <div
            className="absolute z-20"
            style={{
              top: "calc(88px + 96px + 200px + 80px + 24px + 52px + 16px)",
              left: "160px",
              color: "#FF6B6B",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "14px",
            }}
            role="alert"
          >
            {error}
          </div>
        )}
      </main>

      {/* DEV-ONLY login panel — bypasses Google for local testing. Never rendered
          in production (process.env.NODE_ENV is inlined at build time). */}
      {isDev && (
        <div
          className="fixed z-50 flex items-center gap-2"
          style={{
            left: 16,
            bottom: 16,
            padding: "10px 12px",
            borderRadius: 8,
            background: "rgba(0,0,0,0.65)",
            border: "1px solid rgba(255,234,158,0.4)",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          <span style={{ color: "#FFEA9E", fontSize: 11, fontWeight: 700 }}>DEV</span>
          <input
            type="email"
            value={devEmail}
            onChange={(e) => setDevEmail(e.target.value)}
            placeholder="email@dev.local"
            aria-label="Dev login email"
            style={{
              padding: "6px 8px",
              borderRadius: 4,
              border: "1px solid #2E3940",
              background: "#00101A",
              color: "#FFFFFF",
              fontSize: 13,
              width: 200,
            }}
          />
          <button
            type="button"
            onClick={handleDevSignIn}
            disabled={isPending}
            style={{
              padding: "6px 12px",
              borderRadius: 4,
              background: "#FFEA9E",
              color: "#00101A",
              fontSize: 13,
              fontWeight: 700,
              cursor: isPending ? "default" : "pointer",
              opacity: isPending ? 0.6 : 1,
            }}
          >
            Dev Login
          </button>
        </div>
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    // Full-screen relative container for absolute-positioned layers
    <div className="relative min-h-screen flex flex-col" style={{ background: "#00101A" }}>
      {/* Layer C — full-bleed background keyvisual (z-0) */}
      <BackgroundKeyVisual />

      {/* Layer A — sticky header (z-40) */}
      <SiteHeader variant="login" />

      {/* Suspense boundary required by Next.js for useSearchParams usage */}
      <Suspense fallback={<div className="flex-1" />}>
        <LoginContent />
      </Suspense>

      {/* Layer D — footer (z-10) */}
      <SiteFooter variant="login" />
    </div>
  );
}
