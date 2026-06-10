"use client";

// mm:hUyaaugye2 (Dropdown-ngôn ngữ) node 525:11713
// Dropdown container: border #998C5F, bg #00070C, border-radius 8px, padding 6px
// VN selected: bg rgba(255,234,158,0.20) border-radius 2px
// EN normal: no bg highlight
// JA added per clarifications (invented, consistent styling)

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { LANGUAGE_OPTIONS, type LanguageOption } from "./language-options";

interface LanguageDropdownProps {
  onClose: () => void;
}

export function LanguageDropdown({ onClose }: LanguageDropdownProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click (TC ID-33)
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  // Close on Escape (TC ID-34)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSelect(option: LanguageOption) {
    if (option.code !== locale) {
      router.replace(pathname, { locale: option.code });
    }
    onClose();
  }

  return (
    // mm:525:11713 — border #998C5F, bg #00070C, border-radius 8px, padding 6px
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-1 z-50 flex flex-col"
      style={{
        border: "1px solid #998C5F",
        background: "#00070C",
        borderRadius: "8px",
        padding: "6px",
        minWidth: "108px",
      }}
      role="listbox"
      aria-label="Select language"
    >
      {LANGUAGE_OPTIONS.map((option) => {
        const isSelected = option.code === locale;
        return (
          <button
            key={option.code}
            role="option"
            aria-selected={isSelected}
            onClick={() => handleSelect(option)}
            // VN selected: bg rgba(255,234,158,0.20), border-radius 2px
            // Normal: transparent bg
            className="flex flex-row items-center justify-between w-full cursor-pointer transition-colors"
            style={{
              padding: "16px",
              borderRadius: "4px",
              gap: "2px",
              backgroundColor: isSelected
                ? "rgba(255, 234, 158, 0.20)"
                : "transparent",
              border: "none",
              outline: "none",
            }}
          >
            <span
              className="flex flex-row items-center"
              style={{ gap: "4px" }}
            >
              {/* Flag icon 24x24 */}
              <Image
                src={option.flagSrc}
                alt={option.flagAlt}
                width={24}
                height={24}
                className="rounded-sm"
              />
              {/* Language code label — Montserrat Bold 16px white */}
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
                {option.label}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
