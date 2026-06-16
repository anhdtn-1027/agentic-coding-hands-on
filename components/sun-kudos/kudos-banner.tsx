// mm:2940:13437 — A_KV Kudos banner section
// Rendered on top of the Keyvisual background image (mm:I2940:13432;2167:5141)
// Full-width hero: 1440×512px bg image, centred 1152px content column
// Children:
//   - Title text group   (mm:2940:13438 — "Hệ thống ghi nhận và cảm ơn")
//   - Kudos logo         (mm:2940:13440 — MM_MEDIA_Kudos logo, 593×104)

import Image from "next/image";
import { useTranslations } from "next-intl";

export function KudosBanner() {
  const t = useTranslations("sunKudos");

  return (
    // mm:2940:13432 — full-width Keyvisual frame 1440×512px
    // Background image covers full width; content is centred inside.
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 512 }}
      aria-label="Sun* Kudos banner"
    >
      {/* mm:I2940:13432;2167:5141 — MM_MEDIA_KV Background — 1440×512 cover */}
      <Image
        src="/sun-kudos-live-board/kv-background.png"
        alt=""
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Overlay tint to match design dark depth */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,16,26,0.35)" }}
        aria-hidden="true"
      />

      {/* mm:2940:13437 — A_KV Kudos — 1152×160px centred column, absolute pos 144–1296 / 184–344 */}
      {/* Translate to responsive: max-w 1152, centred, px-gutter on small screens */}
      <div
        className="relative z-10 mx-auto flex flex-col"
        style={{
          maxWidth: 1152,
          // Design: top 184px within 512px frame → 35.9% from top
          paddingTop: "clamp(80px, 35.9%, 184px)",
          // mm:A_KV Kudos starts at x:144 within 1440px frame — same gutter as all other sections
          paddingLeft: "clamp(16px, 10vw, 144px)",
          paddingRight: "clamp(16px, 10vw, 144px)",
          gap: 10,
        }}
      >
        {/* mm:2940:13438 — Group 424 — title text */}
        {/* mm:2940:13439 — TEXT 559×44px */}
        <h1
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "clamp(20px, 2.5vw, 36px)",
            fontWeight: 700,
            lineHeight: "44px",
            letterSpacing: 0,
            color: "rgba(255, 234, 158, 1)", // #FFEA9E — from node backgroundColor
            margin: 0,
            whiteSpace: "nowrap",
          }}
        >
          {/* i18n value = "Hệ thống ghi nhận và cảm ơn" — matches node character exactly */}
          {t("banner.title")}
        </h1>

        {/* mm:2940:13440 — MM_MEDIA_Kudos logo — 593×104px */}
        {/* Rendered as <Image>; src will resolve once asset downloads (background job) */}
        <div
          className="relative"
          style={{
            width: "clamp(280px, 51.8vw, 593px)",
            height: "clamp(50px, 9.1vw, 104px)",
          }}
        >
          {/* Use the existing kudos-logo.svg from /public/homepage as fallback;
              the full-size kv version (kudos-logo-kv.svg) will be downloaded to
              /public/sun-kudos-live-board/kudos-logo.svg by the background job.
              Design node 2940:13441 text: "KUDOS" — SVN-Gotham 139px, color rgba(219,209,193,1)
              That is the Kudos wordmark. We use the existing /homepage/kudos-logo.svg
              which is the same asset already in the project. */}
          <Image
            src="/homepage/kudos-logo.svg"
            alt="KUDOS"
            fill
            className="object-contain object-left"
            sizes="(max-width: 768px) 280px, 593px"
          />
        </div>
      </div>
    </section>
  );
}
