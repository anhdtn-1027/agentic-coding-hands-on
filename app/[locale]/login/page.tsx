"use client";

// app/[locale]/login/page.tsx
// SiteHeader(login) + BackgroundKeyVisual + LoginHero(wired) + SiteFooter(login)
// Guard: if session exists → redirect to / (handled in middleware)
// Google button → signIn('google'), loading/disabled during pending (TC 37eae882, c18649fa)

import { Suspense, useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

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
        const result = await signIn("google", {
          redirect: false,
          callbackUrl: safeCallbackUrl,
        });
        if (result?.error) {
          setError("Sign in failed. Please try again.");
        } else if (result?.url) {
          router.push(safeCallbackUrl);
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
    </>
  );
}

export default function LoginPage() {
  return (
    // Full-screen relative container for absolute-positioned layers
    <div className="relative min-h-screen flex flex-col" style={{ background: "#00101A" }}>
      {/* Layer C — full-bleed background keyvisual (z-0) */}
      {/* saa-bg.jpg unavailable from Figma API; dark gradient fallback applied */}
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
