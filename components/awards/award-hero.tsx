// mm:313:8437 + mm:313:8449 (KV + Title sections)
// award-hero.tsx — keyvisual banner: Root Further logo + title block

import Image from "next/image";
import { useTranslations } from "next-intl";

export function AwardHero() {
  const t = useTranslations("awardSystem");

  return (
    // mm:313:8449 — outer container, 1440 frame, padding 96px 144px
    <div
      className="w-full flex flex-col"
      style={{ gap: 120, paddingTop: 0 }}
    >
      {/* mm:313:8450 — KV: Root Further logo area (1152×150) */}
      {/* mm:313:8451 — Frame 482 */}
      <div
        className="w-full flex flex-row items-start"
        style={{ height: 150 }}
      >
        {/* mm:2789:12915 — MM_MEDIA_Root Further Logo 338×150 */}
        <Image
          src="/homepage/root-further-logo.png"
          alt="Root Further"
          width={338}
          height={150}
          className="object-contain"
          style={{ flexShrink: 0 }}
        />
      </div>

      {/* mm:313:8453 — mms_A_Title hệ thống giải thưởng */}
      <div
        className="w-full flex flex-col"
        style={{ gap: 16 }}
      >
        {/* mm:313:8454 — "Sun* Annual Awards 2025" caption */}
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 24,
            fontWeight: 700,
            lineHeight: "32px",
            letterSpacing: 0,
            color: "#FFFFFF",
            textAlign: "center",
            display: "block",
            width: "100%",
          }}
        >
          {t("caption")}
        </span>

        {/* mm:313:8455 — Rectangle 26 divider */}
        <div
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "rgba(46, 57, 64, 1)",
          }}
        />

        {/* mm:313:8456 — Frame 488: main title row */}
        <div
          className="flex flex-row items-center justify-center"
          style={{ gap: 32 }}
        >
          {/* mm:313:8457 — "Hệ thống giải thưởng SAA 2025" */}
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 57,
              fontWeight: 700,
              lineHeight: "64px",
              letterSpacing: -0.25,
              color: "#FFEA9E",
            }}
          >
            {t("title")}
          </span>
        </div>
      </div>
    </div>
  );
}
