"use client";

// the-le-hero-tier-row.tsx — One row in the "Người nhận" section.
// mm:3204:6161 / 3204:6170 / 3204:6179 / 3204:6188 (content frames)
//
// Layout (from Figma): 400×72px, flex-row, no gap
//   Left: pill badge (126×22px | border 0.579px solid #FFEA9E | border-radius 55.579px)
//   Middle: condition text (Montserrat 700 16px | #FFF | flex-1)
//   Below both: description text (Montserrat 700 14px | #FFF | line-height 20px)

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { HeroTier } from "./the-le-data";

interface HeroTierRowProps {
  tier: HeroTier;
}

export function HeroTierRow({ tier }: HeroTierRowProps) {
  const t = useTranslations("theLe");
  // Show the real pill image; fall back to the styled text pill if it fails to load.
  const [imgFailed, setImgFailed] = useState(false);

  return (
    // mm:{tier.nodeId} — content frame (400px wide, flex-col, gap ~8px)
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      {/* Top row: pill badge + condition text */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* mm:{tier.nodeId} — Hero pill badge (126×22px). Real asset at
            /the-le/{slug}.png; styled text pill is the onError fallback. */}
        {imgFailed ? (
          <div
            aria-label={tier.label}
            style={{
              width: 126,
              minWidth: 126,
              height: 22,
              borderRadius: 55.579,
              border: "0.579px solid #FFEA9E",
              background:
                "linear-gradient(135deg, rgba(9,36,50,0.9) 0%, rgba(0,7,12,0.95) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 13,
                lineHeight: "19px",
                letterSpacing: "0.094px",
                color: "#FFF",
                whiteSpace: "nowrap",
              }}
            >
              {tier.label}
            </span>
          </div>
        ) : (
          <div
            style={{
              position: "relative",
              width: 126,
              minWidth: 126,
              height: 22,
              flexShrink: 0,
            }}
          >
            <Image
              src={`/the-le/${tier.slug}.png`}
              alt={tier.label}
              fill
              sizes="126px"
              style={{ objectFit: "contain", objectPosition: "left center" }}
              onError={() => setImgFailed(true)}
            />
          </div>
        )}

        {/* Condition text — from i18n */}
        {/* Montserrat 700 16px | #FFF | line-height 24px | letterSpacing 0.5px */}
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            lineHeight: "24px",
            letterSpacing: "0.5px",
            color: "#FFF",
            flex: 1,
          }}
        >
          {t(`heroTiers.${tier.i18nKey}.condition`)}
        </span>
      </div>

      {/* Description text — from i18n | 14px, line-height 20px, letterSpacing 0.1px */}
      <p
        style={{
          margin: 0,
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: 14,
          lineHeight: "20px",
          letterSpacing: "0.1px",
          color: "#FFF",
          textAlign: "justify",
        }}
      >
        {t(`heroTiers.${tier.i18nKey}.description`)}
      </p>
    </div>
  );
}
