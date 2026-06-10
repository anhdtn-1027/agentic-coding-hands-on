"use client";

// Client component: uses countdown hook (client-side timer) and wires
// all homepage body sections with i18n strings + real props.

import { useTranslations } from "next-intl";
import { useCountdown } from "@/lib/use-countdown";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { HeroSection } from "@/components/homepage/hero-section";
import { RootFurtherContent } from "@/components/homepage/root-further-content";
import { AwardsGrid } from "@/components/homepage/awards-grid";
import { KudosBlock } from "@/components/homepage/kudos-block";
import { WidgetButton } from "@/components/homepage/widget-button";

interface HomepageClientProps {
  userRole?: "admin" | "user";
  userName?: string;
}

export function HomepageClient({
  userRole = "user",
  userName,
}: HomepageClientProps) {
  const t = useTranslations("homepage");
  // Live countdown from EVENT_DATETIME env var (TC ID-39..43, 56, 57, 60)
  const { days, hours, minutes, showComingSoon } = useCountdown();

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "#00101A" }}
    >
      {/* Shared chrome — home variant */}
      <SiteHeader
        variant="home"
        hasUnreadNotifications={false}
        userRole={userRole}
        userName={userName}
      />

      <main className="flex-1 flex flex-col">
        {/* Section B — Hero (keyvisual bg + countdown + event info + CTA) */}
        <HeroSection
          days={days}
          hours={hours}
          minutes={minutes}
          showComingSoon={showComingSoon}
          comingSoonLabel={t("comingSoon")}
          daysLabel={t("days")}
          hoursLabel={t("hours")}
          minutesLabel={t("minutes")}
          // Event info from i18n (specs say 18h30 / Nhà hát nghệ thuật quân đội)
          eventTime={t("eventTime")}
          eventVenue={t("eventLocation")}
          livestreamText={t("eventNote")}
          aboutAwardsHref="/awards-information"
          aboutKudosHref="/sun-kudos"
          aboutAwardsLabel={t("aboutAwards")}
          aboutKudosLabel={t("aboutKudos")}
        />

        {/* Section B4 — ROOT/FURTHER content + paragraphs */}
        <RootFurtherContent />

        {/* Section C — Awards grid */}
        <AwardsGrid />

        {/* Section D1 — Sun* Kudos block */}
        <KudosBlock detailHref="/sun-kudos" />

        {/* Widget floating button (fixed bottom-right) */}
        <WidgetButton onClick={() => {/* no-op per spec */}} />
      </main>

      <SiteFooter variant="home" />
    </div>
  );
}
