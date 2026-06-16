// mm:2940:13465 — B.3_KUDO - Highlight
// Card: 528px wide, border 4px solid #FFEA9E, bg #FFF8E1, padding 24px 24px 16px,
//   border-radius 16px, gap 16px, flex-col
// Content box: border 1px solid #FFEA9E, bg rgba(255,234,158,0.40), border-radius 12px

import { useTranslations } from "next-intl";
import type { Kudos } from "./types";
import { UserInfoBlock } from "./user-info-block";
import { HashtagList } from "./hashtag-list";
import { HeartButton } from "./heart-button";
import { CopyLinkButton } from "./copy-link-button";
import { CardArrowIcon } from "./carousel-arrow-icons";

interface HighlightKudosCardProps {
  kudos: Kudos;
  /** Reduced opacity for non-center cards in carousel */
  faded?: boolean;
}

const DIVIDER = (
  <div style={{ width: "100%", height: 1, background: "#FFEA9E", flexShrink: 0 }} aria-hidden="true" />
);

export function HighlightKudosCard({ kudos, faded = false }: HighlightKudosCardProps) {
  const t = useTranslations("sunKudos");
  const categoryLabel = kudos.hashtags.find((h) => !h.startsWith("#"));
  const tagList = kudos.hashtags.filter((h) => h.startsWith("#"));

  return (
    <div style={{
      width: 528, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16,
      padding: "24px 24px 16px", border: "4px solid #FFEA9E", borderRadius: 16,
      background: "#FFF8E1", opacity: faded ? 0.45 : 1, transition: "opacity 0.3s ease",
      boxSizing: "border-box",
    }}>

      {/* mm:I2940:13465;335:9442 sender → arrow → receiver, gap 24px */}
      <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start",
        justifyContent: "space-between", gap: 24, width: "100%" }}>
        <UserInfoBlock user={kudos.sender} variant="sender" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 123, flexShrink: 0 }}>
          <CardArrowIcon />
        </div>
        <UserInfoBlock user={kudos.receiver} variant="receiver" />
      </div>

      {DIVIDER}

      {/* mm:I2940:13465;335:9448 B.4_Nội dung — flex-col gap 16px */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>

        {/* mm:B.4.1 time — Montserrat 700 16px/24px #999 letterSpacing 0.5px */}
        <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 16,
          lineHeight: "24px", letterSpacing: "0.5px", color: "#999999" }}>
          {kudos.postedAt}
        </span>

        {/* mm:I2940:13465;1810:19718 category label — 16px/24px #00101A centered */}
        {categoryLabel && (
          <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 16,
            lineHeight: "24px", letterSpacing: "0.5px", color: "#00101A",
            textAlign: "center", width: "100%" }}>
            {categoryLabel}
          </span>
        )}

        {/* mm:I2940:13465;662:12221 content box — 1px #FFEA9E border, rgba(255,234,158,0.40) bg, r-12, p-16 24 */}
        <div style={{ border: "1px solid #FFEA9E", borderRadius: 12,
          background: "rgba(255,234,158,0.40)", padding: "16px 24px" }}>
          {/* Montserrat 700 20px/32px #00101A, max 3 lines */}
          <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 20,
            lineHeight: "32px", color: "#00101A", margin: 0,
            display: "-webkit-box", WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {kudos.contentVi}
          </p>
        </div>

        {/* mm:I2940:13465;335:9458 B.4.3_Hashtag */}
        <HashtagList hashtags={tagList} maxVisible={3} />
      </div>

      {DIVIDER}

      {/* mm:I2940:13465;335:9461 B.4.4_Action — flex-row, gap 24px, h 56px, space-between */}
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center",
        justifyContent: "space-between", gap: 24, height: 56 }}>
        <HeartButton initialCount={kudos.likeCount} initialLiked={kudos.likedByMe}
          disabled={kudos.isOwn} />

        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
          <CopyLinkButton />
          {/* mm:I2940:13465;335:9663 Xem chi tiết — Montserrat 700 16px/24px #00101A */}
          <button type="button"
            className="flex flex-row items-center transition-opacity hover:opacity-80 active:opacity-60"
            style={{ gap: 4, height: 56, padding: 16, borderRadius: 4,
              border: "none", background: "none", cursor: "pointer", flexShrink: 0 }}>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700,
              fontSize: 16, lineHeight: "24px", letterSpacing: "0.15px",
              color: "#00101A", whiteSpace: "nowrap" }}>
              {t("card.viewDetail")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
