"use client";

// mm:313:9139
// WidgetButton — floating bottom-right FAB with two states:
//   collapsed: yellow pill (pen / kudos icons)
//   expanded: vertical stack — A "Thể lệ" + B "Viết KUDOS" + C "Hủy" (red circle cancel)
// Expand/collapse toggled by local useState; action props delegated to parent.

import { useState } from "react";
import { useTranslations } from "next-intl";

interface WidgetButtonProps {
  /** Called when user clicks "Thể lệ" (A button) */
  onOpenRules?: () => void;
  /** Called when user clicks "Viết KUDOS" (B button) */
  onWriteKudos?: () => void;
}

export function WidgetButton({
  onOpenRules,
  onWriteKudos,
}: WidgetButtonProps) {
  const t = useTranslations("homepage");
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(true);
  };

  const handleCollapse = () => setExpanded(false);

  const handleRules = () => {
    setExpanded(false);
    onOpenRules?.();
  };

  const handleWriteKudos = () => {
    setExpanded(false);
    onWriteKudos?.();
  };

  return (
    // mm:313:9139 — fixed anchor, bottom:32 right:19 (same anchor as collapsed pill)
    <div
      className="fixed z-50"
      style={{ bottom: 32, right: 19 }}
    >
      {expanded ? (
        // mm:313:9140 — expanded Widget Button: 214×224px, gap 20px, col flex end-aligned
        <div
          className="flex flex-col items-end"
          style={{ gap: 20, width: 214 }}
        >
          {/* mm:I313:9140;214:3799 — A: "Thể lệ" 149×64px, pale yellow, rounded-4 */}
          <button
            type="button"
            onClick={handleRules}
            className="flex flex-row items-center transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFEA9E]"
            style={{
              gap: 8,
              width: 149,
              height: 64,
              padding: 16,
              borderRadius: 4,
              backgroundColor: "#FFEA9E",
              border: "none",
              cursor: "pointer",
            }}
            aria-label={t("widgetRulesAria")}
          >
            {/* mm:I313:9140;214:3799;186:1935 — icon + label row, gap 8 */}
            <div
              className="flex flex-row items-center"
              style={{ gap: 8, width: 108, height: 32 }}
            >
              {/* mm:I313:9140;214:3799;186:1763 — MM_MEDIA_LOGO: lightning bolt 24×24, red */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                style={{ flexShrink: 0 }}
              >
                <path
                  d="M13 2L4.5 13H11L10 22L19.5 11H13L13 2Z"
                  fill="#E73928"
                />
              </svg>
              {/* mm:I313:9140;214:3799;186:1568 — "Thể lệ" text */}
              <span
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 24,
                  fontWeight: 700,
                  lineHeight: "32px",
                  letterSpacing: 0,
                  color: "#00101A",
                  whiteSpace: "nowrap",
                }}
              >
                {t("widgetRulesLabel")}
              </span>
            </div>
          </button>

          {/* mm:I313:9140;214:3732 — B: "Viết KUDOS" 214×64px, pale yellow, rounded-4 */}
          <button
            type="button"
            onClick={handleWriteKudos}
            className="flex flex-row items-center transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFEA9E]"
            style={{
              gap: 8,
              width: 214,
              height: 64,
              padding: 16,
              borderRadius: 4,
              backgroundColor: "#FFEA9E",
              border: "none",
              cursor: "pointer",
            }}
            aria-label={t("widgetWriteKudosAria")}
          >
            {/* mm:I313:9140;214:3732;186:1935 — icon + label row */}
            <div
              className="flex flex-row items-center"
              style={{ gap: 8, width: 182, height: 32 }}
            >
              {/* mm:I313:9140;214:3732;186:1763 — MM_MEDIA_Pen: pen icon 24×24, dark */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                style={{ flexShrink: 0 }}
              >
                <path
                  d="M20.8067 6.72951C21.1967 6.33951 21.1967 5.68951 20.8067 5.31951L18.4667 2.97951C18.0967 2.58951 17.4467 2.58951 17.0567 2.97951L15.2167 4.80951L18.9667 8.55951M3.09668 16.9395V20.6895H6.84668L17.9067 9.61951L14.1567 5.86951L3.09668 16.9395Z"
                  fill="#00101A"
                />
              </svg>
              {/* mm:I313:9140;214:3732;186:1568 — "Viết KUDOS" text */}
              <span
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 24,
                  fontWeight: 700,
                  lineHeight: "32px",
                  letterSpacing: 0,
                  color: "#00101A",
                  whiteSpace: "nowrap",
                }}
              >
                {t("widgetWriteKudosLabel")}
              </span>
            </div>
          </button>

          {/* mm:I313:9140;214:3827 — C: "Hủy" 56×56px, red circle, white × */}
          <button
            type="button"
            onClick={handleCollapse}
            className="flex items-center justify-center transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4271D]"
            style={{
              width: 56,
              height: 56,
              borderRadius: 100,
              backgroundColor: "rgba(212, 39, 29, 1)",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 8px 0 rgba(212,39,29,0.4)",
            }}
            aria-label={t("widgetCancelAria")}
          >
            {/* mm:I313:9140;214:3827;186:1766 — MM_MEDIA_Close: × icon 24×24, white */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      ) : (
        // Collapsed: original yellow pill (pen + "/" + kudos logo)
        // mm:I5022:15169;214:3839 — yellow pill button
        <button
          type="button"
          onClick={handleExpand}
          className="flex flex-row items-center transition-opacity hover:opacity-90 active:opacity-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFEA9E]"
          style={{
            gap: 8,
            width: 106,
            height: 64,
            padding: 16,
            borderRadius: 100,
            backgroundColor: "#FFEA9E",
            boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287",
            border: "none",
            cursor: "pointer",
          }}
          aria-label={t("widgetAria")}
          aria-haspopup="menu"
          aria-expanded={expanded}
        >
          {/* Icon group: pen + "/" */}
          <div
            className="flex flex-row items-center"
            style={{ gap: 4, width: 42, height: 32 }}
          >
            {/* Pen icon (inline SVG for color control) */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: "#00101A", flexShrink: 0 }}
              aria-hidden="true"
            >
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* "/" separator */}
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 24,
                fontWeight: 700,
                lineHeight: "32px",
                letterSpacing: 0,
                color: "#00101A",
              }}
            >
              /
            </span>
          </div>

          {/* Kudos logo icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: "#00101A", flexShrink: 0 }}
            aria-hidden="true"
          >
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
