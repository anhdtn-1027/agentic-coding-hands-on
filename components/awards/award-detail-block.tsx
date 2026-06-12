// mm:313:8467 pattern — mms_D.1_Top talent through mms_D.6_MVP
// award-detail-block.tsx — single award detail section
// Props: reverse=true → image on RIGHT (even-indexed in design: D.2, D.4, D.6)
//        Signature has two value rows (value1/value2 with "Hoặc" separator)

import type { CSSProperties } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { IconTarget, IconDiamond, IconLicense } from "./award-icons";

// Shared style tokens (Figma values) — extracted to keep this file DRY + under 200 lines.
const FONT = "Montserrat, sans-serif";
const ICON_STYLE: CSSProperties = { flexShrink: 0, color: "#FFEA9E" };
const LABEL_YELLOW: CSSProperties = { fontFamily: FONT, fontSize: 24, fontWeight: 700, lineHeight: "32px", color: "#FFEA9E" };
const AMOUNT: CSSProperties = { fontFamily: FONT, fontSize: 36, fontWeight: 700, lineHeight: "44px", color: "#FFFFFF" };
const SMALL: CSSProperties = { fontFamily: FONT, fontSize: 14, fontWeight: 700, lineHeight: "20px", letterSpacing: "0.1px", color: "#FFFFFF" };
const DESC: CSSProperties = { fontFamily: FONT, fontSize: 16, fontWeight: 700, lineHeight: "24px", letterSpacing: "0.5px", color: "#FFFFFF", textAlign: "justify", margin: 0 };
const DIVIDER: CSSProperties = { width: "100%", height: 1, backgroundColor: "rgba(46,57,64,1)" };

interface AwardValueRow {
  amount: string;
  note?: string;
}

export interface AwardDetailBlockProps {
  /** Section anchor id (must match AwardNav slugs) */
  sectionId: string;
  /** Award badge background image (circular glow frame) */
  badgeBgSrc: string;
  /** Award name overlay image */
  badgeNameSrc?: string;
  badgeNameAlt?: string;
  badgeNameWidth?: number;
  badgeNameHeight?: number;
  /** Award title (yellow, 24px bold) */
  title: string;
  /** Award description paragraph */
  description: string;
  /** Số lượng: count number */
  qty: string;
  /** Số lượng: unit label (e.g. "Cá nhân", "Tập thể") */
  unit: string;
  /** Giá trị: primary value row */
  value: AwardValueRow;
  /** Giá trị: optional second value row (Signature only) */
  value2?: AwardValueRow;
  /** If true, image is on the RIGHT side (alternating layout) */
  reverse?: boolean;
}

// One value row = big amount + optional small note (mm:I313:8467;214:2546/2547)
function ValueAmount({ row }: { row: AwardValueRow }) {
  return (
    <>
      <span style={AMOUNT}>{row.amount}</span>
      {row.note && <span style={SMALL}>{row.note}</span>}
    </>
  );
}

export function AwardDetailBlock({
  sectionId,
  badgeBgSrc,
  badgeNameSrc,
  badgeNameAlt = "",
  badgeNameWidth = 221,
  badgeNameHeight = 35,
  title,
  description,
  qty,
  unit,
  value,
  value2,
  reverse = false,
}: AwardDetailBlockProps) {
  const t = useTranslations("awardSystem");

  // mm:I313:8467;214:2525 — Picture-Award: 336×336, glow shadow, border
  const pictureBlock = (
    <div
      // self-center on mobile (centred in the stacked column), top-aligned on desktop row
      className="relative flex-shrink-0 self-center lg:self-start"
      style={{
        width: 336,
        maxWidth: "100%",
        aspectRatio: "1 / 1",
        borderRadius: 24,
        boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287",
        overflow: "hidden",
        mixBlendMode: "screen",
      }}
    >
      {/* mm:I313:8467;214:2525;81:2442 — background thumbnail */}
      <Image
        src={badgeBgSrc}
        alt=""
        fill
        className="object-cover"
        style={{ borderRadius: 24, border: "0.955px solid #FFEA9E" }}
        sizes="336px"
      />
      {/* mm:I313:8467;214:2525;214:666 — award name overlay */}
      {badgeNameSrc && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ mixBlendMode: "screen" }}
        >
          <Image
            src={badgeNameSrc}
            alt={badgeNameAlt}
            width={badgeNameWidth}
            height={badgeNameHeight}
            className="object-contain"
          />
        </div>
      )}
    </div>
  );

  // mm:I313:8467;214:2526 — mms_D.1.2_Content
  const contentBlock = (
    <div className="flex flex-col flex-1" style={{ gap: 32 }}>
      {/* mm:I313:8467;214:2527 — title + description */}
      <div className="flex flex-col" style={{ gap: 24 }}>
        {/* mm:I313:8467;214:2528 — icon + title row */}
        <div className="flex flex-row items-center" style={{ gap: 16 }}>
          <IconTarget style={ICON_STYLE} />
          <span style={LABEL_YELLOW}>{title}</span>
        </div>
        {/* mm:I313:8467;214:2531 — description paragraph */}
        <p style={DESC}>{description}</p>
      </div>

      <div style={DIVIDER} />

      {/* mm:I313:8467;214:2533 — Số lượng giải thưởng row */}
      <div className="flex flex-row items-center" style={{ gap: 16 }}>
        <IconDiamond style={ICON_STYLE} />
        <span style={LABEL_YELLOW}>{t("qtyLabel")}</span>
        <span style={AMOUNT}>{qty}</span>
        <span style={SMALL}>{unit}</span>
      </div>

      <div style={DIVIDER} />

      {/* mm:I313:8467;214:2540 — Giá trị giải thưởng section */}
      <div className="flex flex-col" style={{ gap: 16 }}>
        {/* mm:I313:8467;214:2542 — icon + label */}
        <div className="flex flex-row items-center" style={{ gap: 16 }}>
          <IconLicense style={ICON_STYLE} />
          <span style={LABEL_YELLOW}>{t("valueLabel")}</span>
        </div>

        <ValueAmount row={value} />

        {/* mm:313:8498 — "Hoặc" separator + second value (Signature only) */}
        {value2 && (
          <>
            <div className="flex flex-row items-center" style={{ gap: 8 }}>
              {/* mm:313:8499 — "Hoặc" text. Design color #2E3940 is ~1.6:1 on the dark bg
                  (illegible); lightened to a muted slate (~6:1, WCAG AA) per accessibility fix. */}
              <span style={{ ...SMALL, color: "#8A98A0", flexShrink: 0 }}>
                {t("or")}
              </span>
              {/* mm:313:8500 — Rectangle 11 line */}
              <div style={{ flex: 1, height: 1, backgroundColor: "rgba(46,57,64,1)" }} />
            </div>
            <ValueAmount row={value2} />
          </>
        )}
      </div>
    </div>
  );

  return (
    // mm:313:8467 — mms_D.1_Top talent wrapper
    <section id={sectionId} className="flex flex-col w-full" style={{ gap: 80, scrollMarginTop: 100 }}>
      {/* mm:I313:8467;214:2803 — image+content row.
          Responsive: stack on mobile (image on top); alternate L/R only on desktop. */}
      <div
        className={`flex flex-col items-center lg:items-start ${
          reverse ? "lg:flex-row-reverse" : "lg:flex-row"
        }`}
        style={{ gap: 40 }}
      >
        {pictureBlock}
        {contentBlock}
      </div>
      {/* mm:I313:8467;214:2771 — section divider */}
      <div style={DIVIDER} />
    </section>
  );
}
