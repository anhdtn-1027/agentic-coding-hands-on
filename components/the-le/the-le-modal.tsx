"use client";

// the-le-modal.tsx — "Thể lệ" (SAA Rules) side panel modal.
// mm:3204:6052 — Thể Lệ frame
//
// Layout (from Figma, screenId b1Filzi9i6):
//   Panel: 553px wide, slides in from right edge of 1440px artboard
//   Background: rgba(0,7,12,1) — deep navy/black
//   Padding: 24px 40px 40px 40px | gap 40px between content and footer
//   flex-col | justify-content space-between | align-items flex-end
//
// Sections:
//   A — A_Nội dung thể lệ: flex-col gap 24px (Title + Người nhận + Người gửi sections)
//   B — B_Button footer: flex-row gap 16px (B.1 Đóng + B.2 Viết KUDOS)
//
// Props:
//   open        — controls visibility
//   onClose     — called when "Đóng" is clicked
//   onWriteKudos — called when "Viết KUDOS" is clicked

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { IconClose, IconPen } from "./the-le-icons";
import { HeroTierRow } from "./the-le-hero-tier-row";
import { CollectibleBadgeItem } from "./the-le-collectible-badge";
import { HERO_TIERS, COLLECTIBLE_BADGES } from "./the-le-data";

export interface TheLeModalProps {
  open: boolean;
  onClose: () => void;
  onWriteKudos: () => void;
}

export function TheLeModal({ open, onClose, onWriteKudos }: TheLeModalProps) {
  const t = useTranslations("theLe");
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  // Focus management: autofocus first button on open, restore on close
  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement | null;
    const first = panelRef.current?.querySelector<HTMLElement>("button");
    first?.focus();
    return () => lastFocused.current?.focus?.();
  }, [open]);

  // Focus trap + Escape: keep Tab within the panel, Esc closes.
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute("disabled"));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (!open) return null;

  // Split badges into two rows: [3] + [3]
  const badgesRow1 = COLLECTIBLE_BADGES.slice(0, 3);
  const badgesRow2 = COLLECTIBLE_BADGES.slice(3);

  return (
    <>
      {/* Backdrop — clicking outside closes the panel */}
      {/* mm:3204:6051 root overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 7, 12, 0.60)",
          zIndex: 40,
        }}
      />

      {/* mm:3204:6052 — Thể Lệ panel */}
      {/* 553px wide | right-anchored | full viewport height | scrollable */}
      {/* bg rgba(0,7,12,1) | padding 24px 40px 40px 40px | gap 40px */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="the-le-modal-title"
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          width: "min(553px, 100vw)",
          overflowY: "auto",
          background: "rgba(0, 7, 12, 1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding: "24px 40px 40px 40px",
          gap: 40,
          boxSizing: "border-box",
        }}
      >
        {/* ── A — A_Nội dung thể lệ ─────────────────────────────────────── */}
        {/* mm:3204:6053 | flex-col gap 24px | width 100% */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            width: "100%",
            alignItems: "flex-start",
          }}
        >
          {/* ── Title ───────────────────────────────────────────────────── */}
          {/* mm:3204:6054 — "Thể lệ" */}
          {/* Montserrat 700 45px | color #FFEA9E | line-height 52px */}
          <div style={{ width: "100%" }}>
            {/* mm:3204:6055 */}
            <h2
              id="the-le-modal-title"
              style={{
                margin: 0,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 45,
                lineHeight: "52px",
                letterSpacing: 0,
                color: "rgba(255, 234, 158, 1)",
              }}
            >
              {t("title")}
            </h2>
          </div>

          {/* ── Người gửi outer frame (contains both Người nhận + Người gửi) */}
          {/* mm:3204:6076 | flex-col gap 16px */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              width: "100%",
            }}
          >
            {/* ── Người nhận section ──────────────────────────────────── */}
            {/* mm:3204:6131 | flex-col gap 16px */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                width: "100%",
              }}
            >
              {/* Section heading */}
              {/* mm:3204:6132 | Montserrat 700 22px | #FFEA9E | line-height 28px */}
              <h3
                style={{
                  margin: 0,
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  lineHeight: "28px",
                  letterSpacing: 0,
                  color: "rgba(255, 234, 158, 1)",
                }}
              >
                {t("recipientHeading")}
              </h3>

              {/* Intro text */}
              {/* mm:3204:6133 | Montserrat 700 16px | #FFF | line-height 24px | justify */}
              <p
                style={{
                  margin: 0,
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  lineHeight: "24px",
                  letterSpacing: "0.5px",
                  color: "#FFF",
                  textAlign: "justify",
                }}
              >
                {t("recipientIntro")}
              </p>

              {/* 4 hero tier rows */}
              {HERO_TIERS.map((tier) => (
                <HeroTierRow key={tier.nodeId} tier={tier} />
              ))}
            </div>

            {/* ── Người gửi section heading ───────────────────────────── */}
            {/* mm:3204:6077 | Montserrat 700 22px | #FFEA9E */}
            <h3
              style={{
                margin: 0,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 22,
                lineHeight: "28px",
                letterSpacing: 0,
                color: "rgba(255, 234, 158, 1)",
              }}
            >
              {t("senderHeading")}
            </h3>

            {/* Sender intro text */}
            {/* mm:3204:6078 | Montserrat 700 16px | #FFF | line-height 24px | justify */}
            <p
              style={{
                margin: 0,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 16,
                lineHeight: "24px",
                letterSpacing: "0.5px",
                color: "#FFF",
                textAlign: "justify",
              }}
            >
              {t("senderIntro")}
            </p>

            {/* ── Danh sách huy hiệu (6 collectible badges) ────────────── */}
            {/* mm:3204:6079 | padding 0px 24px | flex-col gap 24px */}
            <div
              style={{
                paddingLeft: 24,
                paddingRight: 24,
                display: "flex",
                flexDirection: "column",
                gap: 24,
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {/* mm:3204:6080 | flex-col gap 16px */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {/* mm:3204:6081 — Frame 511: row of 3 badges (REVIVAL, TOUCH OF LIGHT, STAY GOLD) */}
                {/* flex-row | justify-content space-between | height 104px */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 16,
                  }}
                >
                  {badgesRow1.map((badge) => (
                    <CollectibleBadgeItem key={badge.nodeId} badge={badge} />
                  ))}
                </div>

                {/* mm:3204:6085 — Frame 513: row of 3 badges (FLOW TO HORIZON, BEYOND THE BOUNDARY, ROOT FURTHER) */}
                {/* flex-row | justify-content space-between | height 120px */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 16,
                  }}
                >
                  {badgesRow2.map((badge) => (
                    <CollectibleBadgeItem key={badge.nodeId} badge={badge} />
                  ))}
                </div>
              </div>
            </div>

            {/* Secret box outcome text */}
            {/* mm:3204:6089 | Montserrat 700 16px | #FFF | justify */}
            <p
              style={{
                margin: 0,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 16,
                lineHeight: "24px",
                letterSpacing: "0.5px",
                color: "#FFF",
                textAlign: "justify",
              }}
            >
              {t("secretBoxOutcome")}
            </p>

            {/* ── KUDOS QUỐC DÂN section ──────────────────────────────── */}
            {/* mm:3204:6090 | Montserrat 700 24px | #FFEA9E | line-height 32px */}
            <h3
              style={{
                margin: 0,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 24,
                lineHeight: "32px",
                letterSpacing: 0,
                color: "rgba(255, 234, 158, 1)",
              }}
            >
              {t("kudosQuocDanHeading")}
            </h3>

            {/* mm:3204:6091 | Montserrat 700 16px | #FFF | justify */}
            <p
              style={{
                margin: 0,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 16,
                lineHeight: "24px",
                letterSpacing: "0.5px",
                color: "#FFF",
                textAlign: "justify",
              }}
            >
              {t("kudosQuocDanBody")}
            </p>
          </div>
        </div>

        {/* ── B — B_Button footer ───────────────────────────────────────── */}
        {/* mm:3204:6092 | flex-row gap 16px | width 100% | height 56px */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 16,
            width: "100%",
            alignItems: "stretch",
            flexShrink: 0,
          }}
        >
          {/* ── B.1 — Đóng button ──────────────────────────────────────── */}
          {/* mm:3204:6093 | border 1px solid #998C5F | bg rgba(255,234,158,0.10) */}
          {/* padding 16px | border-radius 4px | flex-row center gap 8px */}
          <button
            type="button"
            onClick={onClose}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: 16,
              border: "1px solid #998C5F",
              borderRadius: 4,
              background: "rgba(255, 234, 158, 0.10)",
              cursor: "pointer",
              color: "#FFF",
              flexShrink: 0,
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255, 234, 158, 0.18)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255, 234, 158, 0.10)";
            }}
          >
            {/* mm:I3204:6093;186:2758 — Frame 483: close icon + text */}
            {/* mm:I3204:6093;186:2759 — MM_MEDIA_Close 24×24 */}
            <span style={{ color: "#FFF", display: "flex" }}>
              <IconClose size={24} />
            </span>
            {/* mm:I3204:6093;186:2760 — "Đóng" | Montserrat 700 16px | #FFF */}
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 16,
                lineHeight: "24px",
                letterSpacing: "0.5px",
                color: "#FFF",
                whiteSpace: "nowrap",
              }}
            >
              {t("closeBtn")}
            </span>
          </button>

          {/* ── B.2 — Viết KUDOS button ────────────────────────────────── */}
          {/* mm:3204:6094 | bg rgba(255,234,158,1) | padding 16px | border-radius 4px */}
          {/* flex-row center gap 8px | flex-1 (363px in design) */}
          <button
            type="button"
            onClick={onWriteKudos}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: 16,
              border: "none",
              borderRadius: 4,
              background: "rgba(255, 234, 158, 1)",
              cursor: "pointer",
              color: "rgba(0, 16, 26, 1)",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255, 240, 180, 1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255, 234, 158, 1)";
            }}
          >
            {/* mm:I3204:6094;186:1935 — Frame 483: pen icon + text */}
            {/* mm:I3204:6094;186:1763 — MM_MEDIA_Pen 24×24 */}
            <span style={{ color: "rgba(0, 16, 26, 1)", display: "flex" }}>
              <IconPen size={24} />
            </span>
            {/* mm:I3204:6094;186:1568 — "Viết KUDOS" | Montserrat 700 16px | #00101A */}
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 16,
                lineHeight: "24px",
                letterSpacing: "0.5px",
                color: "rgba(0, 16, 26, 1)",
                whiteSpace: "nowrap",
              }}
            >
              {t("writeKudosBtn")}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
