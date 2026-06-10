// AwardCard — single award card with thumbnail, award-name image, title, description, "Chi tiết" link
// mm:2167:9075 (pattern repeats for all 6 cards)

import Image from "next/image";

interface AwardCardProps {
  /** Award background thumbnail — same shared asset for all cards */
  thumbnailSrc?: string;
  /** Award name image (e.g. "Top Talent" logo image) */
  awardNameSrc?: string;
  /** Award name image alt text */
  awardNameAlt?: string;
  /** Award name image dimensions */
  awardNameWidth?: number;
  awardNameHeight?: number;
  /** Human-readable award title text shown below thumbnail */
  title: string;
  /** Short description (1-2 lines) */
  description: string;
  /** "Chi tiết" link href */
  href?: string;
  /** Link label */
  detailLabel?: string;
}

export function AwardCard({
  thumbnailSrc = "/homepage/award-bg.png",
  awardNameSrc,
  awardNameAlt = "",
  awardNameWidth = 221,
  awardNameHeight = 35,
  title,
  description,
  href = "#",
  detailLabel = "Chi tiết",
}: AwardCardProps) {
  return (
    // mm:2167:9075
    <div
      className="flex flex-col group w-full"
      style={{ gap: 24, maxWidth: 336 }}
    >
      {/* mm:I2167:9075;214:1019 — picture area with glow shadow */}
      <div
        className="relative w-full flex-shrink-0 transition-transform duration-200 group-hover:-translate-y-2"
        style={{
          aspectRatio: "1 / 1",
          borderRadius: 24,
          boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287",
          overflow: "hidden",
        }}
      >
        {/* mm:I2167:9075;214:1019;81:2442 — background image */}
        <Image
          src={thumbnailSrc}
          alt=""
          fill
          className="object-cover"
          style={{ borderRadius: 24, border: "0.955px solid #FFEA9E" }}
          sizes="336px"
        />

        {/* mm:I2167:9075;214:1019;214:666 — award name overlay image */}
        {awardNameSrc && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ mixBlendMode: "screen" }}
          >
            <Image
              src={awardNameSrc}
              alt={awardNameAlt}
              width={awardNameWidth}
              height={awardNameHeight}
              className="object-contain"
            />
          </div>
        )}
      </div>

      {/* mm:I2167:9075;214:1020 — text content below image */}
      <div className="flex flex-col w-full" style={{ gap: 4 }}>
        {/* mm:I2167:9075;214:1021 — award title */}
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 24,
            fontWeight: 400,
            lineHeight: "32px",
            letterSpacing: 0,
            color: "#FFEA9E",
          }}
        >
          {title}
        </span>

        {/* mm:I2167:9075;214:1022 — description */}
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 16,
            fontWeight: 400,
            lineHeight: "24px",
            letterSpacing: 0.5,
            color: "#FFFFFF",
          }}
        >
          {description}
        </span>

        {/* mm:I2167:9075;214:1023 — "Chi tiết" link button */}
        <a
          href={href}
          className="inline-flex flex-row items-center transition-opacity hover:opacity-75"
          style={{
            gap: 4,
            padding: "16px 0",
            textDecoration: "none",
          }}
        >
          {/* mm:I2167:9075;214:1023;186:1439 */}
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 16,
              fontWeight: 500,
              lineHeight: "24px",
              letterSpacing: 0.15,
              color: "#FFFFFF",
            }}
          >
            {detailLabel}
          </span>
          {/* mm:I2167:9075;214:1023;186:1441 — arrow icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: "#FFFFFF", flexShrink: 0 }}
            aria-hidden="true"
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
