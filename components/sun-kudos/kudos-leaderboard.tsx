"use client";

// mm:2940:13510 — D.3_10 SUNNER nhận quà
// bg #00070C, border 1px solid #998C5F, border-radius 17px, padding 24px 16px 24px 24px
// Title: Montserrat 700 22px/28px #FFEA9E, text-center
// Entry row: h-64px, gap 8px, flex-row, align-center
// Avatar: 64×64px circle; name Montserrat 700 white; description Montserrat 400 #999

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { LeaderboardEntry } from "./types";

interface KudosLeaderboardProps {
  title: string;
  entries: LeaderboardEntry[];
  /** Optional max-height for scrollable list. Defaults to 480px. */
  maxHeight?: number;
}

export function KudosLeaderboard({
  title,
  entries,
  maxHeight = 480,
}: KudosLeaderboardProps) {
  const t = useTranslations("sunKudos");

  return (
    // mm:2940:13510 — card: bg #00070C, border 1px solid #998C5F, br 17px
    // padding 24px 16px 24px 24px, gap 10px, flex-col
    <div
      style={{
        background: "#00070C",
        border: "1px solid #998C5F",
        borderRadius: 17,
        padding: "24px 16px 24px 24px",
        gap: 10,
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {/* mm:2940:13513 — D.3.1_title: Montserrat 700 22px/28px #FFEA9E text-center */}
      <h3
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: 22,
          lineHeight: "28px",
          letterSpacing: 0,
          color: "#FFEA9E",
          textAlign: "center",
          margin: 0,
          width: "100%",
        }}
      >
        {title}
      </h3>

      {/* mm:2940:13515 — Frame 548: entries list, scrollable */}
      {entries.length === 0 ? (
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "20px",
            color: "#999999",
            textAlign: "center",
            margin: 0,
            padding: "16px 0",
          }}
        >
          {t("emptyLeaderboard")}
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            overflowY: "auto",
            maxHeight,
          }}
        >
          {entries.map((entry, idx) => (
            <LeaderboardRow key={entry.user.id} rank={idx + 1} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal row component
// mm:2940:13516 — D.3.2_Thông tin Sunner nhận quà
// row: flex-row, align-center, gap 8px, h-64px, w-364px
// Avatar 64×64 circle; name Montserrat 700 16px/24px #FFEA9E; desc 14px/20px #999
// ---------------------------------------------------------------------------

interface LeaderboardRowProps {
  rank: number;
  entry: LeaderboardEntry;
}

function LeaderboardRow({ rank, entry }: LeaderboardRowProps) {
  const { user, description } = entry;
  return (
    // mm:2940:13516 — row: h-64px, gap 8px, flex-row, align-center
    <div
      className="flex flex-row items-center"
      style={{ gap: 8, height: 64, width: "100%" }}
    >
      {/* Rank number — not in design explicitly but implied by list order */}
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: 14,
          lineHeight: "20px",
          color: "#998C5F",
          width: 20,
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {rank}
      </span>

      {/* mm:I2940:13516;256:7460 — MM_MEDIA_Avatar 64×64 circle */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
          background: "#1A2730",
        }}
      >
        <Image
          src={user.avatarUrl}
          alt={user.name}
          width={64}
          height={64}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Name + description column */}
      <div
        className="flex flex-col justify-center"
        style={{ gap: 2, flex: 1, overflow: "hidden" }}
      >
        {/* mm:D.3.2 name Montserrat 700 16px/24px #FFEA9E (gold) */}
        <span
          className="truncate"
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            lineHeight: "24px",
            letterSpacing: 0,
            color: "#FFEA9E",
          }}
        >
          {user.name}
        </span>

        {/* mm:D.3.4 description Montserrat 400 14px/20px muted #999 */}
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "20px",
            color: "#999999",
          }}
        >
          {description}
        </span>
      </div>
    </div>
  );
}
