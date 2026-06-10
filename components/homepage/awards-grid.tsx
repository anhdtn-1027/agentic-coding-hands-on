"use client";

// mm:5005:14974
// AwardsGrid — 6-card responsive grid (3-col desktop / 2-col tablet / 1-col mobile)
// plus section header (C1 + C2)

import { useTranslations } from "next-intl";
import { AwardCard } from "./award-card";

interface AwardsGridProps {
  /** Override hrefs for each card. Order: topTalent, topProject, topProjectLeader, bestManager, signatureCreator, mvp */
  cardHrefs?: [string, string, string, string, string, string];
}

// Visual-only metadata (images, dimensions, anchor slug) — text comes from i18n.
// Award names/order match Figma assets + specs C2.1–C2.6 (mm:5005:14974).
const AWARD_VISUALS = [
  { key: "topTalent", slug: "top-talent", awardNameSrc: "/homepage/top-talent.png", awardNameAlt: "Top Talent", awardNameWidth: 221, awardNameHeight: 35 },
  { key: "topProject", slug: "top-project", awardNameSrc: "/homepage/top-project.png", awardNameAlt: "Top Project", awardNameWidth: 232, awardNameHeight: 35 },
  { key: "topProjectLeader", slug: "top-project-leader", awardNameSrc: "/homepage/top-project-leader.png", awardNameAlt: "Top Project Leader", awardNameWidth: 232, awardNameHeight: 64 },
  { key: "bestManager", slug: "best-manager", awardNameSrc: "/homepage/best-manager.png", awardNameAlt: "Best Manager", awardNameWidth: 232, awardNameHeight: 30 },
  { key: "signatureCreator", slug: "signature-2025-creator", awardNameSrc: "/homepage/signature-2025-creator.png", awardNameAlt: "Signature 2025 - Creator", awardNameWidth: 232, awardNameHeight: 54 },
  { key: "mvp", slug: "mvp", awardNameSrc: "/homepage/mvp.png", awardNameAlt: "MVP (Most Valuable Person)", awardNameWidth: 116, awardNameHeight: 52 },
] as const;

// Each card links to Awards Information with a category hash anchor (specs C2 / TC ID-47..52)
const DEFAULT_HREFS = AWARD_VISUALS.map(
  (a) => `/awards-information#${a.slug}`,
) as unknown as [string, string, string, string, string, string];

export function AwardsGrid({ cardHrefs = DEFAULT_HREFS }: AwardsGridProps) {
  const t = useTranslations("homepage");

  return (
    // mm:2167:9068 — centered content container, 144px side gutter on desktop
    // (matches hero/root-further; design content width 1152 within 1440 frame)
    <div
      className="flex flex-col w-full mx-auto"
      style={{
        gap: 80,
        maxWidth: 1152,
        paddingInline: 24,
      }}
    >
      {/* mm:2167:9069 — C1 section header */}
      <div className="flex flex-col" style={{ gap: 16 }}>
        {/* mm:2167:9070 — caption */}
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 24,
            fontWeight: 700,
            lineHeight: "32px",
            letterSpacing: 0,
            color: "#FFFFFF",
          }}
        >
          {t("awardsCaption")}
        </span>

        {/* mm:2167:9071 — divider */}
        <div
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "rgba(46, 57, 64, 1)",
          }}
        />

        {/* mm:2167:9072 — main title row */}
        <div className="flex flex-row items-center" style={{ gap: 32 }}>
          {/* mm:2167:9073 */}
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 57,
              fontWeight: 700,
              lineHeight: "64px",
              letterSpacing: -0.25,
              color: "#FFEA9E",
            }}
          >
            {t("awardsTitle")}
          </span>
        </div>
      </div>

      {/* mm:5005:14974 — C2 award card grid: 2-col tablet/mobile, 3-col desktop
          (spec C2 + TC ID-15/16) */}
      <div
        className="grid w-full grid-cols-2 lg:grid-cols-3"
        style={{ gap: 40 }}
      >
        {AWARD_VISUALS.map((award, i) => (
          // mm:2167:9075 pattern — each card
          <AwardCard
            key={award.key}
            thumbnailSrc="/homepage/award-bg.png"
            awardNameSrc={award.awardNameSrc}
            awardNameAlt={award.awardNameAlt}
            awardNameWidth={award.awardNameWidth}
            awardNameHeight={award.awardNameHeight}
            title={t(`awards.${award.key}.title`)}
            description={t(`awards.${award.key}.description`)}
            detailLabel={t("detailLink")}
            href={cardHrefs[i as 0 | 1 | 2 | 3 | 4 | 5]}
          />
        ))}
      </div>
    </div>
  );
}
