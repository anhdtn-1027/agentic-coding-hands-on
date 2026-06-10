"use client";

// mm:5005:14974
// AwardsGrid — 6-card responsive grid (3-col desktop / 2-col tablet / 1-col mobile)
// plus section header (C1 + C2)

import { useTranslations } from "next-intl";
import { AwardCard } from "./award-card";

interface AwardsGridProps {
  /** Override hrefs for each card. Order: starOfTheYear, bestLeader, riseOfTheYear, bestTeam, innovationAward, customerChampion */
  cardHrefs?: [string, string, string, string, string, string];
}

// Visual-only metadata (images, dimensions) — text comes from i18n
const AWARD_VISUALS = [
  { key: "starOfTheYear", awardNameSrc: "/homepage/top-talent.png", awardNameAlt: "Star of the Year", awardNameWidth: 221, awardNameHeight: 35 },
  { key: "bestLeader", awardNameSrc: "/homepage/top-project.png", awardNameAlt: "Best Leader", awardNameWidth: 232, awardNameHeight: 35 },
  { key: "riseOfTheYear", awardNameSrc: "/homepage/top-project-leader.png", awardNameAlt: "Rise of the Year", awardNameWidth: 232, awardNameHeight: 64 },
  { key: "bestTeam", awardNameSrc: "/homepage/best-manager.png", awardNameAlt: "Best Team", awardNameWidth: 232, awardNameHeight: 30 },
  { key: "innovationAward", awardNameSrc: "/homepage/signature-2025-creator.png", awardNameAlt: "Innovation Award", awardNameWidth: 232, awardNameHeight: 54 },
  { key: "customerChampion", awardNameSrc: "/homepage/mvp.png", awardNameAlt: "Customer Champion", awardNameWidth: 116, awardNameHeight: 52 },
] as const;

const DEFAULT_HREFS: [string, string, string, string, string, string] = [
  "#", "#", "#", "#", "#", "#",
];

export function AwardsGrid({ cardHrefs = DEFAULT_HREFS }: AwardsGridProps) {
  const t = useTranslations("homepage");

  return (
    // mm:2167:9068
    <div className="flex flex-col w-full" style={{ gap: 80 }}>
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

      {/* mm:5005:14974 — C2 award card grid: responsive 1→2→3 col */}
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 40,
        }}
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
            href={cardHrefs[i as 0 | 1 | 2 | 3 | 4 | 5]}
          />
        ))}
      </div>
    </div>
  );
}
