"use client";

// mm:I662:14391;186:1696 / I2167:9091;186:1696
// Button: 108×56px, padding 16px, border-radius 4px, gap 2px
// Contents: flag(24x24) + code text + chevron-down(24x24)

import Image from "next/image";
import { useRef, useState } from "react";
import { useLocale } from "next-intl";
import { LanguageDropdown } from "./language-dropdown";
import { LANGUAGE_OPTIONS } from "./language-options";

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  // Wraps trigger + dropdown; passed to the dropdown for outside-click scoping.
  const wrapperRef = useRef<HTMLDivElement>(null);

  const current =
    LANGUAGE_OPTIONS.find((o) => o.code === locale) ?? LANGUAGE_OPTIONS[0];

  return (
    <div
      ref={wrapperRef}
      className="relative"
      style={{ width: "108px", height: "56px" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex flex-row items-center justify-between w-full h-full"
        style={{
          padding: "16px",
          borderRadius: "4px",
          gap: "2px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        {/* Flag + code */}
        <span className="flex flex-row items-center" style={{ gap: "4px" }}>
          <Image
            src={current.flagSrc}
            alt={current.flagAlt}
            width={24}
            height={24}
            className="rounded-sm"
          />
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0.15px",
              color: "#FFFFFF",
            }}
          >
            {current.label}
          </span>
        </span>

        {/* Chevron down — mm:186:1441 MM_MEDIA_Down 24x24 */}
        <Image
          src="/shared/chevron-down.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden
          style={{
            transition: "transform 0.15s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {open && (
        <LanguageDropdown
          onClose={() => setOpen(false)}
          containerRef={wrapperRef}
        />
      )}
    </div>
  );
}
