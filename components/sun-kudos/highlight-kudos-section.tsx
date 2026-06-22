// mm:2940:13451 — B_Highlight
// Full section: width 1440px, height 786px, flex-col, gap 40px
// B.1_header: padding 0 144px, flex-col gap 40px
//   Row: SectionHeading (left) + Buttons filter (right aligned, row space-between)
// B.2 carousel + B.5 slide nav: HighlightCarousel
//
// Server component — no "use client" needed; children handle their own client state.

import { useTranslations } from "next-intl";
import { mockKudos, mockHashtags, mockDepartments } from "./mock-data";
import { HighlightFilters } from "./highlight-filters";
import { HighlightCarousel } from "./highlight-carousel";

export function HighlightKudosSection() {
  const t = useTranslations("sunKudos");

  return (
    // mm:2940:13451 B_Highlight: flex-col, gap 40px, width 100%
    <section
      aria-label={t("highlight.title")}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 40,
        overflow: "hidden",
      }}
    >
      {/* mm:2940:13452 B.1_header: padding 0 144px, flex-col gap 16px (matches SectionHeading) */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          paddingInline: "clamp(16px, 10vw, 144px)",
          boxSizing: "border-box",
        }}
      >
        {/* mm:2940:13453 Header Giải thưởng inner:
            Row 1 — subtitle text (from SectionHeading)
            Row 2 — divider (from SectionHeading)
            Row 3 — title + filter buttons, flex-row space-between */}

        {/* Subtitle row: Montserrat 700 24px/32px #FFFFFF */}
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 24,
            lineHeight: "32px",
            letterSpacing: "0px",
            color: "#FFFFFF",
          }}
        >
          {t("sectionSubtitle")}
        </span>

        {/* Divider 1px solid #2E3940 */}
        <div
          style={{ width: "100%", height: 1, background: "#2E3940", flexShrink: 0 }}
          aria-hidden="true"
        />

        {/* mm:2940:13456 Frame 488 — flex-row, justify space-between, align-center, gap 32px */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 32,
          }}
        >
          {/* mm:2940:13457 HIGHLIGHT KUDOS — Montserrat 700 57px/64px letter-spacing -0.25px #FFEA9E */}
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(32px, 4vw, 57px)",
              lineHeight: "1.12",
              letterSpacing: "-0.25px",
              color: "#FFEA9E",
              margin: 0,
              flexShrink: 0,
            }}
          >
            {t("highlight.title")}
          </h2>

          {/* mm:2940:13458 Buttons — filter dropdowns, right-aligned */}
          <HighlightFilters
            hashtags={mockHashtags}
            departments={mockDepartments}
          />
        </div>
      </div>

      {/* mm:2940:13461+2940:13471 B.2 carousel + B.5 slide nav */}
      <HighlightCarousel kudos={mockKudos} />
    </section>
  );
}
