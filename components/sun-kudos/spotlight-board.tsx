"use client";

// mm:2940:13476 — B.6_Header (section heading for spotlight)
// mm:2940:14174 — B.7_Spotlight (canvas frame + controls row + ticker)
// mm:3007:17482 — B.7.1 "388 KUDOS" Montserrat 700 36px/44px white
// mm:2940:14833 — B.7.3 search bar
// mm:3007:17479 — B.7.2 Pan/Zoom button

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { SectionHeading } from "./section-heading";
import { SpotlightCanvas } from "./spotlight-canvas";
import { SpotlightSearchBar, PanZoomButton } from "./spotlight-controls";
import { mockSpotlightNodes, totalKudos } from "./mock-data";
import type { SpotlightNode } from "./types";

// ---------------------------------------------------------------------------
// Ticker lines — recent recipient names visible in B.7 design text nodes
// ---------------------------------------------------------------------------
const TICKER_LINES = [
  "Đỗ hoàng Hiệp · Dương thúy An · Mai phương Thúy · Lê Kiều Trang",
  "Nguyễn Văn Quy · Nguyễn Hoàng Linh · Trần Thị Minh Châu · Vũ Minh Tuấn",
  "Bùi Thanh Hà · Phạm Hoàng Anh · Đặng Thị Ngọc Ánh · Ngô Trọng Nghĩa",
];

// ---------------------------------------------------------------------------
// SpotlightBoard — full section (heading + canvas + controls + ticker)
// ---------------------------------------------------------------------------
export function SpotlightBoard() {
  const t = useTranslations("sunKudos");
  const [panMode, setPanMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNodeClick = useCallback((_node: SpotlightNode) => {
    // Presentational — no navigation this pass
  }, []);

  return (
    // mm:Frame 552 — full width, flex-col
    <div className="flex flex-col w-full" style={{ gap: 64 }}>

      {/* ── B.6 Section heading ─────────────────────────────────────────── */}
      {/* mm:2940:13476 — padding 0 144px, Montserrat subtitle 24px + title 57px gold */}
      <SectionHeading
        subtitle={t("sectionSubtitle")}
        title={t("spotlight.title")}
      />

      {/* ── B.7 Canvas area (padded to match design inset) ──────────────── */}
      <div
        className="flex flex-col w-full"
        style={{ paddingInline: "clamp(16px, 10vw, 144px)", gap: 16 }}
      >
        {/* Controls row: count (B.7.1) | search (B.7.3) + pan/zoom (B.7.2) */}
        <div
          className="flex flex-row items-center flex-wrap"
          style={{ gap: 16, justifyContent: "space-between" }}
        >
          {/* B.7.1 — "388 KUDOS": Montserrat 700 36px/44px rgba(255,255,255,1) */}
          <span
            aria-live="polite"
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(22px, 3vw, 36px)",
              lineHeight: "44px",
              color: "rgba(255, 255, 255, 1)",
              letterSpacing: "0px",
              whiteSpace: "nowrap",
            }}
          >
            {totalKudos}&nbsp;{t("spotlight.countSuffix")}
          </span>

          {/* Right: search + pan/zoom */}
          <div className="flex flex-row items-center" style={{ gap: 12 }}>
            {/* B.7.3 — search bar */}
            <SpotlightSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t("spotlight.searchPlaceholder")}
            />
            {/* B.7.2 — pan/zoom toggle */}
            <PanZoomButton
              active={panMode}
              label={t("spotlight.panZoom")}
              onToggle={() => setPanMode((v) => !v)}
            />
          </div>
        </div>

        {/* mm:2940:14174 — word-cloud canvas: 1157×548px, radius 47px, border #998C5F */}
        <SpotlightCanvas
          nodes={mockSpotlightNodes}
          loading={false}
          panMode={panMode}
          onNodeClick={handleNodeClick}
          searchQuery={searchQuery}
        />

        {/* Ticker — recent recipient name strip (from B.7 design text nodes) */}
        <div
          className="flex flex-col"
          style={{ gap: 4, overflow: "hidden" }}
          aria-label="Recent recipients"
        >
          {TICKER_LINES.map((line, i) => (
            <p
              key={i}
              style={{
                margin: 0,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                // mm:TEXT nodes in B.7 — fontSize ~6.66px, color white
                fontSize: "clamp(6px, 0.6vw, 7px)",
                color: "rgba(255, 255, 255, 0.6)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
