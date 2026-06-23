"use client";

// mm:2940:13475 — C_All kudos section
// Layout: flex-col gap 40px, width 1440px
// C.1 header via SectionHeading
// C.2 list: width 680px, flex-col gap 24px (per design mm:2940:13482)
// Padding: 0 144px (outer), responsive clamped

import { useTranslations } from "next-intl";
import { SectionHeading } from "./section-heading";
import { KudosPostCard } from "./kudos-post-card";
import { useKudosBoard } from "./kudos-board-provider";

export function AllKudosSection() {
  const t = useTranslations("sunKudos");
  const { kudos: mockKudos } = useKudosBoard();

  return (
    // mm:2940:13475 — C_All kudos, flex-col gap 40px, full width
    <section
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 40,
      }}
    >
      {/* mm:2940:14221 — C.1_Header: SectionHeading with subtitle + "ALL KUDOS" title */}
      <SectionHeading
        subtitle={t("sectionSubtitle")}
        title={t("allKudos.title")}
      />

      {/* mm:2940:13481 — Frame 502: list column within the padded All-Kudos flex row */}
      {/* paddingInline owned by the parent row in page.tsx — do not add here (would double-pad) */}
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* mm:2940:13482 — C.2_Danh sách lời cảm ơn: flex-col gap 24px, width 680px */}
        {mockKudos.length === 0 ? (
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: "24px",
              color: "#999999",
            }}
          >
            {t("emptyKudos")}
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24, // mm: C.2 gap 24px between cards
              width: "100%",
              maxWidth: 680,
            }}
          >
            {mockKudos.map((kudos) => (
              <KudosPostCard key={kudos.id} kudos={kudos} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
