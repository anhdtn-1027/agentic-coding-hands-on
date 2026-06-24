"use client";

// the-le-collectible-badge.tsx — One circular badge item in the 6-icon collection grid.
// mm:3204:6082 / 3204:6087 / 3204:6086 / 3204:6083 / 3204:6084 / 3204:6088
//
// From Figma:
//   Outer container: 80×88-120px | flex-col | align-center | gap 8px
//   Circle "Huy hiệu": 64×64px | border 2px solid #FFF | border-radius 100px
//     bg: badge image (url from public/the-le/{slug}.png) — fallback dark placeholder
//   Label: Montserrat 700 | 11-12px | #FFF | text-center | line-height 16px

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { CollectibleBadge } from "./the-le-data";

interface CollectibleBadgeItemProps {
  badge: CollectibleBadge;
}

export function CollectibleBadgeItem({ badge }: CollectibleBadgeItemProps) {
  const t = useTranslations("theLe");
  const imageSrc = `/the-le/${badge.slug}.png`;

  return (
    // mm:{badge.nodeId} — outer badge container (80px wide, flex-col, gap 8px)
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        width: 80,
      }}
    >
      {/* mm:{badge.nodeId} — "Huy hiệu" circle: 64×64 | border 2px solid #FFF | radius 100px */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "100px",
          border: "2px solid #FFF",
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
          background:
            "linear-gradient(135deg, rgba(9,36,50,0.95) 0%, rgba(0,7,12,1) 100%)",
        }}
      >
        <Image
          src={imageSrc}
          alt={t(`badges.${badge.i18nKey}`)}
          fill
          sizes="64px"
          style={{ objectFit: "cover" }}
          // Suppress 404 until real assets land in public/the-le/
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Label text — from i18n | Montserrat 700 11-12px | #FFF | centered | line-height 16px */}
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: 11,
          lineHeight: "16px",
          letterSpacing: "0.5px",
          color: "#FFF",
          textAlign: "center",
          width: "100%",
        }}
      >
        {t(`badges.${badge.i18nKey}`)}
      </span>
    </div>
  );
}
