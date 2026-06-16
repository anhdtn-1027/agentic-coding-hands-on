"use client";

// mm:2940:13461 B.2 carousel + mm:2940:13471 B.5 slide nav
// Cards: 528px wide, gap 24px. Center card full opacity, sides at 0.45.
// Left overlay: 400px, gradient 90deg #00101A→transparent, prev button 80×80px
// Right overlay: 400px, gradient 270deg #00101A→transparent, next button 80×80px
// Slide nav: flex-row center, gap 32px, h 52px; prev/next 48×48px; label Montserrat 700 28px/36px #999

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Kudos } from "./types";
import { HighlightKudosCard } from "./highlight-kudos-card";
import { LeftArrowIcon, RightArrowIcon } from "./carousel-arrow-icons";

interface HighlightCarouselProps {
  kudos: Kudos[];
}

// Shared nav button style factory
function navBtnStyle(size: number, disabled: boolean, extra?: React.CSSProperties): React.CSSProperties {
  return {
    width: size, height: size, padding: 10, borderRadius: 4,
    border: "none", background: "transparent",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.3 : 1,
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "opacity 0.2s ease", flexShrink: 0,
    ...extra,
  };
}

export function HighlightCarousel({ kudos }: HighlightCarouselProps) {
  const t = useTranslations("sunKudos");
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = kudos.length;

  if (total === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: "100%", height: 525 }}>
        <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700,
          fontSize: 20, lineHeight: "32px", color: "#999999" }}>
          {t("emptyKudos")}
        </span>
      </div>
    );
  }

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(total - 1, i + 1));
  const atStart = currentIndex === 0;
  const atEnd = currentIndex === total - 1;

  return (
    <div style={{ width: "100%", position: "relative" }}>

      {/* mm:2940:13463 card viewport — overflow hidden, height 525px */}
      <div style={{ width: "100%", height: 525, position: "relative",
        overflow: "hidden", display: "flex", alignItems: "center" }}>

        {/* Sliding cards track — translate to keep center card visible */}
        <div style={{
          display: "flex", flexDirection: "row", alignItems: "center", gap: 24,
          transform: `translateX(calc(50% - 264px - ${currentIndex * 552}px))`,
          transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}>
          {kudos.map((k, idx) => (
            <HighlightKudosCard key={k.id} kudos={k} faded={idx !== currentIndex} />
          ))}
        </div>

        {/* mm:2940:13469 left gradient overlay — max 400px, clamped to 30vw on narrow viewports */}
        <div style={{ position: "absolute", left: 0, top: 0, width: "min(400px, 30vw)", height: "100%",
          background: "linear-gradient(90deg, #00101A 50%, rgba(0,16,26,0) 100%)",
          display: "flex", alignItems: "center",
          padding: "186px 161px 186px 80px", boxSizing: "border-box",
          pointerEvents: "none", zIndex: 10 }}>
          {/* mm:2940:13470 B.2.1 prev button — 80×80px */}
          <button type="button" onClick={prev} disabled={atStart} aria-label="Previous kudos"
            style={navBtnStyle(80, atStart, { pointerEvents: "auto" })}>
            <LeftArrowIcon size={60} />
          </button>
        </div>

        {/* mm:2940:13467 right gradient overlay — max 400px, clamped to 30vw on narrow viewports */}
        <div style={{ position: "absolute", right: 0, top: 0, width: "min(400px, 30vw)", height: "100%",
          background: "linear-gradient(270deg, #00101A 50%, rgba(0,16,26,0) 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "186px 40px 186px 80px", boxSizing: "border-box",
          pointerEvents: "none", zIndex: 10 }}>
          {/* mm:2940:13468 B.2.2 next button — 80×80px */}
          <button type="button" onClick={next} disabled={atEnd} aria-label="Next kudos"
            style={navBtnStyle(80, atEnd, { pointerEvents: "auto" })}>
            <RightArrowIcon size={60} />
          </button>
        </div>
      </div>

      {/* mm:2940:13471 B.5_slide nav — flex-row center, gap 32px, h 52px, mt 40px */}
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center",
        justifyContent: "center", gap: 32, height: 52, width: "100%",
        boxSizing: "border-box", marginTop: 40 }}>

        {/* mm:2940:13472 B.5.1 prev — 48×48px */}
        <button type="button" onClick={prev} disabled={atStart} aria-label="Previous kudos"
          style={navBtnStyle(48, atStart)}>
          <LeftArrowIcon size={28} />
        </button>

        {/* mm:2940:13473 B.5.2 page label — Montserrat 700 28px/36px #999 */}
        <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700,
          fontSize: 28, lineHeight: "36px", color: "#999999",
          minWidth: 60, textAlign: "center" }}>
          {currentIndex + 1}/{total}
        </span>

        {/* mm:2940:13474 B.5.3 next — 48×48px */}
        <button type="button" onClick={next} disabled={atEnd} aria-label="Next kudos"
          style={navBtnStyle(48, atEnd)}>
          <RightArrowIcon size={28} />
        </button>
      </div>
    </div>
  );
}
