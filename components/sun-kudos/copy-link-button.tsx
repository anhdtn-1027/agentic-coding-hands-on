"use client";

// mm:I3127:21871;256:5216 — C.4.2_Copy link button
// Button: 144×56px, padding 16px, border-radius 4px, flex-row gap 4px
// Label: Montserrat 700 16px/24px #00101A
// Icon MM_MEDIA_Link 24×24px

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface CopyLinkButtonProps {
  url?: string;
}

export function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const t = useTranslations("sunKudos.card");
  const [copied, setCopied] = useState(false);

  // Auto-hide toast after ~2s
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleClick() {
    const target = url ?? (typeof window !== "undefined" ? window.location.href : "");
    try {
      await navigator.clipboard.writeText(target);
      setCopied(true);
    } catch {
      // Clipboard write failed silently — no user-visible error for this light interaction
    }
  }

  return (
    <div className="relative inline-flex">
      {/* mm: C.4.2 button — 144×56px, padding 16px, border-radius 4px */}
      <button
        type="button"
        onClick={handleClick}
        className="flex flex-row items-center transition-opacity hover:opacity-80 active:opacity-60"
        style={{
          gap: 4,
          width: 144,
          height: 56,
          padding: 16,
          borderRadius: 4,
          border: "none",
          background: "none",
          cursor: "pointer",
        }}
        aria-label={t("copyLink")}
      >
        {/* Label: Montserrat 700 16px/24px #00101A */}
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            lineHeight: "24px",
            letterSpacing: "0.15px",
            color: "#00101A",
            whiteSpace: "nowrap",
          }}
        >
          {t("copyLink")}
        </span>

        {/* MM_MEDIA_Link icon 24×24 */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{ flexShrink: 0, color: "#00101A" }}
        >
          <path
            d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Transient toast — auto-hides after 2s */}
      {copied && (
        <div
          role="status"
          aria-live="polite"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap pointer-events-none"
          style={{
            background: "#00101A",
            color: "#FFEA9E",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            fontSize: 13,
            lineHeight: "18px",
            padding: "6px 12px",
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            zIndex: 50,
          }}
        >
          {t("copyToast")}
        </div>
      )}
    </div>
  );
}
