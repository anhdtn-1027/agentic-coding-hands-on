"use client";

// mm:2940:13488 — D_Thống menu phải
// width 422px (desktop), flex-col, gap 24px
// Stacks: KudosStatsBlock + two KudosLeaderboard instances

import { useTranslations } from "next-intl";
import { KudosStatsBlock } from "./kudos-stats-block";
import { KudosLeaderboard } from "./kudos-leaderboard";
import { mockLeaderboardRankUp, mockLeaderboardGifts, mockStats } from "./mock-data";
import type { KudosStats, LeaderboardEntry } from "./types";

interface KudosSidebarProps {
  stats?: KudosStats;
  rankUpEntries?: LeaderboardEntry[];
  giftsEntries?: LeaderboardEntry[];
}

export function KudosSidebar({
  stats = mockStats,
  rankUpEntries = mockLeaderboardRankUp,
  giftsEntries = mockLeaderboardGifts,
}: KudosSidebarProps) {
  const t = useTranslations("sunKudos.sidebar");

  return (
    // mm:2940:13488 — D sidebar: width 422px desktop, full-width mobile, gap 24px, flex-col
    <div
      className="flex flex-col w-full"
      style={{ gap: 24 }}
    >
      {/* mm:2940:13489 — D.1 stats block */}
      <KudosStatsBlock stats={stats} />

      {/* mm:2940:13510 — D.3 leaderboard gifts "10 SUNNER NHẬN QUÀ MỚI NHẤT" */}
      <KudosLeaderboard
        title={t("leaderboardGifts")}
        entries={giftsEntries}
      />

      {/* leaderboard rank-up "10 SUNNER CÓ SỰ THĂNG HẠNG MỚI NHẤT" */}
      <KudosLeaderboard
        title={t("leaderboardRankUp")}
        entries={rankUpEntries}
      />
    </div>
  );
}
