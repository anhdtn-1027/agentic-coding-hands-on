// mm:2167:9030 (Bìa frame — hero + root-further-content + widget)
// HeroSection — bg keyvisual + dark cover + ROOT FURTHER title + coming-soon + countdown display
// + event info + CTA buttons. Countdown DISPLAY only — logic injected via props.

import Image from "next/image";
import { CountdownDisplay } from "./countdown-display";
import { EventInfo } from "./event-info";
import { CtaButtons } from "./cta-buttons";

interface HeroSectionProps {
  /** Countdown values — zero-padded strings, supplied by use-countdown hook in integration */
  days?: string;
  hours?: string;
  minutes?: string;
  showComingSoon?: boolean;
  /** i18n labels for countdown display */
  comingSoonLabel?: string;
  daysLabel?: string;
  hoursLabel?: string;
  minutesLabel?: string;
  /** Event info overrides */
  eventTime?: string;
  eventVenue?: string;
  livestreamText?: string;
  /** CTA hrefs */
  aboutAwardsHref?: string;
  aboutKudosHref?: string;
  aboutAwardsLabel?: string;
  aboutKudosLabel?: string;
}

export function HeroSection({
  days = "22",
  hours = "06",
  minutes = "30",
  showComingSoon = true,
  comingSoonLabel,
  daysLabel,
  hoursLabel,
  minutesLabel,
  eventTime = "26/12/2025",
  eventVenue = "Âu Cơ Art Center",
  livestreamText = "Tường thuật trực tiếp qua sóng Livestream",
  aboutAwardsHref = "#",
  aboutKudosHref = "#",
  aboutAwardsLabel = "ABOUT AWARDS",
  aboutKudosLabel = "ABOUT KUDOS",
}: HeroSectionProps) {
  return (
    // mm:2167:9026 outer — hero content wrapper.
    // NOTE: keyvisual background (2167:9027) + gradient cover (2167:9029) are
    // page-level layers in homepage-client — in Figma they span the hero AND the
    // "ROOT FURTHER" intro (keyvisual 1512×1392), so they must NOT be clipped here.
    <div className="relative w-full">
      {/* mm:2167:9030 — Bìa content frame */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{ padding: "clamp(48px, 6.35vw, 96px) clamp(24px, 9.52vw, 144px)", gap: 120 }}
      >
        {/* mm:2167:9031 — Frame 487: ROOT FURTHER logo + countdown + event info + CTA */}
        <div
          className="flex flex-col w-full mx-auto"
          style={{ maxWidth: 1224, gap: 40 }}
        >
          {/* mm:2167:9032 — Frame 482: ROOT FURTHER logo */}
          <div style={{ width: 451, height: 200 }}>
            {/* mm:2788:12911 — MM_MEDIA_Root Further Logo */}
            <Image
              src="/homepage/root-further-logo.png"
              alt="ROOT FURTHER"
              width={451}
              height={200}
              priority
              className="object-contain object-left"
            />
          </div>

          {/* mm:2167:9034 — Frame 523: countdown + event info */}
          <div className="flex flex-col" style={{ gap: 16, width: "100%" }}>
            {/* mm:2167:9035 — mms_B1_Countdown time */}
            <CountdownDisplay
              days={days}
              hours={hours}
              minutes={minutes}
              showComingSoon={showComingSoon}
              comingSoonLabel={comingSoonLabel}
              daysLabel={daysLabel}
              hoursLabel={hoursLabel}
              minutesLabel={minutesLabel}
            />

            {/* mm:2167:9053 — mms_B2_Thông tin sự kiện */}
            <EventInfo
              time={eventTime}
              venue={eventVenue}
              livestreamText={livestreamText}
            />
          </div>

          {/* mm:2167:9062 — mms_B3_Call-To-Action */}
          <CtaButtons
            aboutAwardsHref={aboutAwardsHref}
            aboutKudosHref={aboutKudosHref}
            aboutAwardsLabel={aboutAwardsLabel}
            aboutKudosLabel={aboutKudosLabel}
          />
        </div>
      </div>
    </div>
  );
}
