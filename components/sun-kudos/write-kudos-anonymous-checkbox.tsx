"use client";

// mm:I520:11647;520:14099 — mms_G_Gửi ẩn danh (anonymous send checkbox)
// Check box: 24×24 border 1px #999, bg #FFF, border-radius 4px, unchecked by default
// Label text: "Gửi lời cám ơn và ghi nhận ẩn danh"
//   Montserrat 700 22px lineHeight 28px color #999 (secondary text colour when unchecked)
// Row: gap 16px, flex-row, align-center, width 672px

import { useTranslations } from "next-intl";

interface AnonymousCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function AnonymousCheckbox({ checked, onChange }: AnonymousCheckboxProps) {
  const t = useTranslations("sunKudos.writeModal");

  return (
    // mm:I520:11647;520:14099 — mms_G_Gửi ẩn danh
    // gap 16px | flex-row | align-center | width 672px | height 28px
    <label
      className="flex flex-row items-center"
      style={{ gap: 16, cursor: "pointer", userSelect: "none" }}
    >
      {/* mm:I520:11647;520:14099;520:14097 — Check box */}
      {/* 24×24 | border 1px #999 | bg #FFF | border-radius 4px */}
      <div
        style={{
          width: 20,
          height: 20,
          border: checked ? "1px solid #998C5F" : "1px solid rgba(153, 153, 153, 1)",
          borderRadius: 4,
          background: checked ? "rgba(255, 234, 158, 0.3)" : "#FFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background 0.15s ease, border-color 0.15s ease",
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{
            position: "absolute",
            opacity: 0,
            width: 20,
            height: 20,
            margin: 0,
            cursor: "pointer",
          }}
        />
        {checked && (
          // Checkmark tick
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M13.5 4L6.5 11L3 7.5"
              stroke="rgba(153, 140, 95, 1)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* mm:I520:11647;520:14099;520:14095 — Label text */}
      {/* Montserrat 700 22px lineHeight 28px color #999 */}
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: 16,
          lineHeight: "22px",
          letterSpacing: 0,
          color: "rgba(153, 153, 153, 1)",
        }}
      >
        {t("anonymousLabel")}
      </span>
    </label>
  );
}
