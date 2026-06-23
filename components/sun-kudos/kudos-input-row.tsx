"use client";

// mm:2940:13448 — "Button chuc nang" — 1440×72px row containing two pill inputs
// mm:2940:13449 — A.1_Button ghi nhận — kudos text input pill (738×72px)
//   border: 1px solid #998C5F | bg: rgba(255,234,158,0.10) | border-radius: 68px
//   padding: 24px 16px | gap: 8px
//   inner Frame 483: gap 16px, icon (MM_MEDIA_Pen 24×24) + placeholder text 16px Montserrat 700 white
// mm:2940:13450 — Tìm kiếm sunner — search pill (381×72px)
//   Same border/bg/radius/padding as kudos pill
//   inner Frame 483: gap 16px, icon (MM_MEDIA_Search 24×24) + placeholder text 16px white

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useKudosBoard } from "./kudos-board-provider";

// Inline pen icon (mm:I2940:13449;186:2759 — MM_MEDIA_Pen)
// path from /public/sun-kudos-live-board/icon-pen.svg
function PenIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={{ flexShrink: 0, color: "inherit" }}
    >
      <path
        d="M20.8067 6.72951C21.1967 6.33951 21.1967 5.68951 20.8067 5.31951L18.4667 2.97951C18.0967 2.58951 17.4467 2.58951 17.0567 2.97951L15.2167 4.80951L18.9667 8.55951M3.09668 16.9395V20.6895H6.84668L17.9067 9.61951L14.1567 5.86951L3.09668 16.9395Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Inline search icon (mm:I2940:13450;186:2759 — MM_MEDIA_Search)
// path from /public/sun-kudos-live-board/icon-search.svg
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={{ flexShrink: 0, color: "inherit" }}
    >
      <path
        d="M9.5 3C11.2239 3 12.8772 3.68482 14.0962 4.90381C15.3152 6.12279 16 7.77609 16 9.5C16 11.11 15.41 12.59 14.44 13.73L14.71 14H15.5L20.5 19L19 20.5L14 15.5V14.71L13.73 14.44C12.59 15.41 11.11 16 9.5 16C7.77609 16 6.12279 15.3152 4.90381 14.0962C3.68482 12.8772 3 11.2239 3 9.5C3 7.77609 3.68482 6.12279 4.90381 4.90381C6.12279 3.68482 7.77609 3 9.5 3ZM9.5 5C7 5 5 7 5 9.5C5 12 7 14 9.5 14C12 14 14 12 14 9.5C14 7 12 5 9.5 5Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Shared pill button visual — presentational, uncontrolled
// Shared pill styles from both mm:2940:13449 and mm:2940:13450
interface PillFieldProps {
  icon: React.ReactNode;
  placeholder: string;
  "aria-label": string;
  inputId: string;
  /** When set, the pill acts as a button that opens an action (e.g. write modal). */
  onActivate?: () => void;
}

function PillField({
  icon,
  placeholder,
  "aria-label": ariaLabel,
  inputId,
  onActivate,
}: PillFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    // mm:2940:13449 / mm:2940:13450 pill wrapper
    // border: 1px solid #998C5F | bg: rgba(255,234,158,0.10) | radius: 68px
    // padding: 24px 16px | height: 72px | gap: 8px
    <label
      htmlFor={inputId}
      className="flex items-center cursor-text transition-all"
      style={{
        gap: 8,
        padding: "24px 16px",
        width: "100%", // fill the parent pill container so the input isn't clipped
        height: 72,
        border: focused
          ? "1px solid rgba(255, 234, 158, 0.80)" // focus: brighter gold
          : "1px solid #998C5F", // mm:2940:13449 border colour
        borderRadius: 68, // mm:2940:13449 border-radius
        background: focused
          ? "rgba(255, 234, 158, 0.15)" // focus: slightly more opaque
          : "rgba(255, 234, 158, 0.10)", // mm:2940:13449 background
        color: "#FFFFFF",
        flexShrink: 0,
        // Hover: subtly brighten border
        // (handled via CSS transition on border-color)
        transition: "border-color 0.2s ease, background 0.2s ease",
      }}
    >
      {/* mm:I2940:13449;186:2758 / I2940:13450;186:2758 — Frame 483 row */}
      {/* gap: 16px between icon and text */}
      <div
        className="flex items-center"
        style={{ gap: 16, overflow: "hidden", flex: 1, minWidth: 0 }}
      >
        {/* 24×24 icon — mm:I2940:13449;186:2759 (Pen) / I2940:13450;186:2759 (Search) */}
        <span style={{ flexShrink: 0, lineHeight: 0 }}>{icon}</span>

        {/* mm:I2940:13449;186:2760 — placeholder text */}
        {/* fontSize: 16px | Montserrat 700 | lineHeight: 24px | letterSpacing: 0.15px | color white */}
        <input
          id={inputId}
          type="text"
          placeholder={placeholder}
          aria-label={ariaLabel}
          readOnly={!!onActivate}
          onClick={onActivate}
          // Open on click / keyboard activation — NOT on focus, so restoring focus
          // to this trigger after the modal closes doesn't immediately reopen it.
          onKeyDown={(e) => {
            if (onActivate && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              onActivate();
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "Montserrat, sans-serif",
            fontSize: 16,
            fontWeight: 700,
            lineHeight: "24px",
            letterSpacing: "0.15px",
            color: "#FFFFFF",
            width: "100%",
            minWidth: 0,
          }}
          // Placeholder matches design text colour (white, semi-opaque via CSS below)
          className="kudos-pill-input"
        />
      </div>
    </label>
  );
}

export function KudosInputRow() {
  const t = useTranslations("sunKudos");
  const { openModal } = useKudosBoard();

  return (
    <>
      {/* Placeholder colour: design shows rgba(255,255,255,1) — use 0.5 opacity for UX */}
      <style>{`
        .kudos-pill-input::placeholder {
          color: rgba(255, 255, 255, 0.60);
          font-weight: 700;
        }
        .kudos-pill-input:hover::placeholder {
          color: rgba(255, 255, 255, 0.80);
        }
      `}</style>

      {/* mm:2940:13448 — "Button chuc nang" — full-width row */}
      {/* Design: absolute 0–1440px wide, children at x:144 and x:914 */}
      {/* Responsive: max-w 1152 centred with px padding, flex-wrap on small screens */}
      <div
        className="w-full"
        style={{
          // Background: none on container (transparent in design)
          paddingInline: "clamp(16px, 10vw, 144px)",
        }}
        // mm:2940:13448
      >
        <div
          className="flex flex-row flex-wrap items-center"
          style={{
            gap: "clamp(8px, 1.4vw, 20px)",
            maxWidth: 1152,
            marginInline: "auto",
          }}
        >
          {/* mm:2940:13449 — A.1_Button ghi nhận — kudos text input */}
          {/* Design width: 738px (of 1152 usable = ~64%) */}
          <div style={{ flex: "1 1 400px", maxWidth: 738 }}>
            <PillField
              inputId="kudos-write-input"
              icon={<PenIcon />}
              placeholder={t("input.placeholder")}
              aria-label={t("input.placeholder")}
              onActivate={openModal}
            />
          </div>

          {/* mm:2940:13450 — Tìm kiếm sunner — search field */}
          {/* Design width: 381px (of 1152 usable = ~33%) */}
          <div style={{ flex: "1 1 200px", maxWidth: 381 }}>
            <PillField
              inputId="kudos-search-input"
              icon={<SearchIcon />}
              placeholder={t("input.searchPlaceholder")}
              aria-label={t("input.searchPlaceholder")}
            />
          </div>
        </div>
      </div>
    </>
  );
}
