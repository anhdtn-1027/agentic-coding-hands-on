"use client";

// mm:2940:13489 — D.1_Thống kê tổng quat
// bg #00070C, border 1px solid #998C5F, border-radius 17px, padding 24px, gap 10px
// Stat row: h-40px, label Montserrat 700 22px/28px #FFF, value 32px/40px #FFEA9E
// Divider: 1px height #2E3940
// Button: bg #FFEA9E, border-radius 8px, padding 16px, h-60px

import { useTranslations } from "next-intl";
import type { KudosStats } from "./types";
import { mockStats } from "./mock-data";

interface KudosStatsBlockProps {
  stats?: KudosStats;
}

interface StatRowProps {
  label: string;
  value: number;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    // mm:2940:13491 — row: flex row, justify-between, align-center, h-40px, gap 8px
    <div
      className="flex flex-row items-center justify-between"
      style={{ gap: 8, width: "100%", height: 40 }}
    >
      {/* mm:I2940:13491;256:6735 — label Montserrat 700 22px/28px #FFF */}
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: 22,
          lineHeight: "28px",
          letterSpacing: 0,
          color: "#FFFFFF",
        }}
      >
        {label}
      </span>

      {/* mm:I2940:13491;256:6753 — value Montserrat 700 32px/40px #FFEA9E */}
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: 32,
          lineHeight: "40px",
          letterSpacing: 0,
          color: "#FFEA9E",
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function KudosStatsBlock({ stats = mockStats }: KudosStatsBlockProps) {
  const t = useTranslations("sunKudos.sidebar");

  return (
    // mm:2940:13489 — card: bg #00070C, border 1px solid #998C5F, br 17px, p-24px, gap 10px
    <div
      style={{
        background: "#00070C",
        border: "1px solid #998C5F",
        borderRadius: 17,
        padding: 24,
        gap: 10,
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {/* mm:2940:13490 — content column: gap 16px */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          width: "100%",
        }}
      >
        {/* mm:2940:13491 — D.1.2 received */}
        <StatRow label={t("statsReceived")} value={stats.received} />

        {/* mm:2940:13492 — D.1.3 sent */}
        <StatRow label={t("statsSent")} value={stats.sent} />

        {/* mm:3241:14882 — D.1.4 hearts */}
        <StatRow label={t("statsHearts")} value={stats.hearts} />

        {/* mm:2940:13494 — D.1.5 divider: 1px height #2E3940 */}
        <div
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "#2E3940",
            flexShrink: 0,
          }}
        />

        {/* mm:2940:13495 — D.1.6 box opened */}
        <StatRow label={t("statsBoxOpened")} value={stats.boxOpened} />

        {/* mm:2940:13496 — D.1.7 box unopened */}
        <StatRow label={t("statsBoxUnopened")} value={stats.boxUnopened} />

        {/* mm:2940:13497 — D.1.8 Button mở quà: bg #FFEA9E, br 8px, p-16px, h-60px */}
        <button
          type="button"
          onClick={() => { /* presentational — no action this pass */ }}
          className="flex flex-row items-center justify-center transition-opacity hover:opacity-90 active:opacity-75"
          style={{
            gap: 8,
            padding: 16,
            borderRadius: 8,
            backgroundColor: "#FFEA9E",
            height: 60,
            width: "100%",
            border: "none",
            cursor: "pointer",
          }}
        >
          {/* mm:I2940:13497;186:1766 — MM_MEDIA_Open Gift icon 24×24 */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M20 12V22H4V12M22 7H2V12H22V7ZM12 22V7M12 7H7.5C6.12 7 5 5.88 5 4.5C5 3.12 6.12 2 7.5 2C9.5 2 12 7 12 7ZM12 7H16.5C17.88 7 19 5.88 19 4.5C19 3.12 17.88 2 16.5 2C14.5 2 12 7 12 7Z"
              stroke="#00101A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: "24px",
              letterSpacing: 0.15,
              color: "#00101A",
            }}
          >
            {t("openGift")}
          </span>
        </button>
      </div>
    </div>
  );
}
