"use client";

// mm:I520:11647;1688:10448 — Frame 552 (Danh hiệu / award-title section)
// mms_B-style Title component: "Danh hiệu" Montserrat 700 22px #00101A + * red
// Input: border 1px #998C5F, bg #FFF, padding 16px 24px, border-radius 8px
//   Placeholder: Montserrat 700 16px letterSpacing 0.15px #999
//   (Per spec: free-text input — NO dropdown arrow icon)
// Helper text below input:
//   "Ví dụ: Người truyền động lực cho tôi.\nDanh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn."
//   Montserrat 700 16px lineHeight 24px letterSpacing 0.15px color #999

import { useTranslations } from "next-intl";

interface AwardTitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function AwardTitleField({ value, onChange, error }: AwardTitleFieldProps) {
  const t = useTranslations("sunKudos.writeModal");

  return (
    // mm:I520:11647;1688:10448 — Frame 552
    // width 672px, height 104px — vertical stack, no explicit gap
    <div style={{ width: "100%" }}>
      {/* Row: label left, input right; stacks on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center" style={{ gap: 16 }}>
        {/* mm:I520:11647;1688:10436 — Title component "Danh hiệu" + * */}
        {/* width 139px, gap 2px, flex-row align-center */}
        <div className="flex flex-row items-center shrink-0" style={{ gap: 2, width: 139 }}>
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: 22,
              lineHeight: "28px",
              letterSpacing: 0,
              color: "rgba(0, 16, 26, 1)",
              whiteSpace: "nowrap",
            }}
          >
            {t("awardTitleLabel")}
          </span>
          <span
            style={{
              fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: "20px",
              color: "rgba(207, 19, 34, 1)",
            }}
          >
            *
          </span>
        </div>

        {/* mm:I520:11647;1688:10437 — Button/input (514px) */}
        {/* border 1px #998C5F, bg #FFF, padding 16px 24px, border-radius 8px, flex justify-between */}
        <div
          className="flex flex-row items-center justify-between"
          style={{
            flex: 1,
            border: error ? "1px solid rgba(207, 19, 34, 1)" : "1px solid #998C5F",
            borderRadius: 8,
            background: "#FFF",
            padding: "16px 24px",
            gap: 8,
          }}
        >
          {/* mm:I520:11647;1688:10437;186:2758 — Frame 483 (337px) */}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t("awardTitlePlaceholder")}
            aria-label={t("awardTitleLabel")}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: "24px",
              letterSpacing: "0.15px",
              color: "rgba(0, 16, 26, 1)",
              minWidth: 0,
            }}
            className="award-title-input"
          />
        </div>
      </div>

      {/* mm:I520:11647;1688:10447 — helper text below input */}
      {/* Montserrat 700 16px lineHeight 24px letterSpacing 0.15px color #999 */}
      {/* On desktop: indent by label width + gap so it aligns under the input */}
      {/* On mobile: no indent (label stacks above) */}
      <style>{`
        .award-title-helper { padding-left: ${139 + 16}px; }
        @media (max-width: 639px) { .award-title-helper { padding-left: 0; } }
      `}</style>
      <div className="award-title-helper">
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            lineHeight: "24px",
            letterSpacing: "0.15px",
            color: "rgba(153, 153, 153, 1)",
            margin: "6px 0 0 0",
            whiteSpace: "pre-line",
          }}
        >
          {t("awardTitleHelper")}
        </p>
      </div>

      <style>{`
        .award-title-input::placeholder {
          color: rgba(153, 153, 153, 1);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
