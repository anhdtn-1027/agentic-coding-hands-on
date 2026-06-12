"use client";

// mm:313:8459 — mms_C_Menu list
// award-nav.tsx — sticky left navigation menu with 6 award categories
// Active item: yellow (#FFEA9E) + bottom-border underline + text-shadow
// Inactive item: white, hover highlight

import React from "react";
import { useTranslations } from "next-intl";
import { IconTarget } from "./award-icons";

const NAV_ITEMS = [
  { id: "top-talent", labelKey: "nav.topTalent" },
  { id: "top-project", labelKey: "nav.topProject" },
  { id: "top-project-leader", labelKey: "nav.topProjectLeader" },
  { id: "best-manager", labelKey: "nav.bestManager" },
  { id: "signature-2025-creator", labelKey: "nav.signatureCreator" },
  { id: "mvp", labelKey: "nav.mvp" },
] as const;

interface AwardNavProps {
  activeId: string;
  onSelect: (id: string) => void;
}

export function AwardNav({ activeId, onSelect }: AwardNavProps) {
  const t = useTranslations("awardSystem");

  // Parent (award-system-content) owns scroll + hash + scroll-lock so the
  // IntersectionObserver doesn't override the clicked item mid-animation.
  const handleClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    onSelect(id);
  };

  return (
    // mm:313:8459 — mms_C_Menu list: flex column, gap 16px, width 178px
    <div
      className="flex flex-col"
      style={{ gap: 16, width: 178, flexShrink: 0 }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeId === item.id;
        return (
          // mm:313:8460 pattern — each nav item, padding 16px, borderRadius 4px (inactive)
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(item.id, e)}
            className="flex flex-row items-center transition-colors duration-150"
            style={{
              gap: 4,
              padding: "16px",
              borderRadius: isActive ? 0 : 4,
              // Active: bottom border yellow (spec C.1 active state)
              borderBottom: isActive ? "1px solid #FFEA9E" : undefined,
              backgroundColor: isActive ? undefined : "transparent",
              cursor: "pointer",
              textDecoration: "none",
            }}
            aria-current={isActive ? "location" : undefined}
          >
            {/* mm:I313:8460;186:2013 — Frame 487 icon+label row */}
            <div className="flex flex-row items-center" style={{ gap: 4 }}>
              {/* MM_MEDIA_Target icon — color from Figma fills */}
              {/* mm:I313:8460;186:1745 */}
              <IconTarget
                className="flex-shrink-0"
                style={{ color: isActive ? "#FFEA9E" : "#FFFFFF" }}
              />

              {/* mm:I313:8460;186:1502 — nav label text */}
              <span
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  lineHeight: "20px",
                  letterSpacing: "0.25px",
                  color: isActive ? "#FFEA9E" : "#FFFFFF",
                  textAlign: "center",
                  textShadow: isActive
                    ? "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287"
                    : undefined,
                  whiteSpace: "pre-line",
                }}
              >
                {t(item.labelKey)}
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
