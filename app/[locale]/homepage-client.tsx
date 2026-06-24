"use client";

// Client component: uses countdown hook (client-side timer) and wires
// all homepage body sections with i18n strings + real props.

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCountdown } from "@/lib/use-countdown";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { HeroSection } from "@/components/homepage/hero-section";
import { RootFurtherContent } from "@/components/homepage/root-further-content";
import { AwardsGrid } from "@/components/homepage/awards-grid";
import { KudosBlock } from "@/components/homepage/kudos-block";
import { WidgetButton } from "@/components/homepage/widget-button";
import { TheLeModal } from "@/components/the-le";
import { useKudosBoard } from "@/components/sun-kudos/kudos-board-provider";

interface HomepageClientProps {
  userRole?: "admin" | "user";
  userName?: string;
}

export function HomepageClient({
  userRole = "user",
  userName,
}: HomepageClientProps) {
  const t = useTranslations("homepage");
  const { openModal } = useKudosBoard();
  const [rulesOpen, setRulesOpen] = useState(false);
  // Live countdown from EVENT_DATETIME env var (TC ID-39..43, 56, 57, 60)
  const { days, hours, minutes, showComingSoon } = useCountdown();

  return (
    <div
      className="relative flex flex-col min-h-screen"
      style={{ background: "#00101A" }}
    >
      {/* mm:2167:9027 + 2167:9029 — page-level keyvisual background + gradient cover.
          Spans hero + "ROOT FURTHER" intro (Figma keyvisual 1512×1392), fading to
          #00101A right as the body paragraph begins. Lives here (not in HeroSection)
          so it is not clipped at the hero boundary. */}
      <div
        aria-hidden
        className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none"
        style={{ height: "calc(100vh + 480px)", zIndex: 0 }}
      >
        {/* mm:2167:9028 — MM_MEDIA_Keyvisual BG */}
        <Image
          src="/homepage/keyvisual-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* mm:2167:9029 — Cover gradient (fades keyvisual to #00101A toward the body) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(12deg, #00101A 23.7%, rgba(0, 18, 29, 0.46) 38.34%, rgba(0, 19, 32, 0.00) 48.92%)",
          }}
        />
      </div>

      {/* Shared chrome — home variant */}
      <SiteHeader
        variant="home"
        hasUnreadNotifications={false}
        userRole={userRole}
        userName={userName}
      />

      <main className="relative z-10 flex-1 flex flex-col">
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
        <WidgetButton
          onOpenRules={() => setRulesOpen(true)}
          onWriteKudos={() => openModal()}
        />
      </main>

      <SiteFooter variant="home" />

      {/* Thể lệ rules panel — open state is local to homepage */}
      <TheLeModal
        open={rulesOpen}
        onClose={() => setRulesOpen(false)}
        onWriteKudos={() => {
          setRulesOpen(false);
          openModal();
        }}
      />
    </div>
  );
}
