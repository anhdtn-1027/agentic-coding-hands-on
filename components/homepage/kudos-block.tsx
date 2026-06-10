"use client";

// mm:3390:10349
// KudosBlock — Sun* Kudos promo section (D1/D2)

import Image from "next/image";
import { useTranslations } from "next-intl";

interface KudosBlockProps {
  detailHref?: string;
}

export function KudosBlock({
  detailHref = "#",
}: KudosBlockProps) {
  const t = useTranslations("homepage.kudos");
  return (
    // mm:3390:10349
    <div className="flex flex-col items-center justify-center w-full" style={{ gap: 10 }}>
      {/* mm:I3390:10349;313:8415 — SunKudos group */}
      <div
        className="relative"
        style={{
          width: 1120,
          height: 500,
          maxWidth: "100%",
        }}
      >
        {/* mm:I3390:10349;313:8416 — background image */}
        <Image
          src="/homepage/kudos-background.png"
          alt=""
          fill
          className="object-cover"
          style={{ borderRadius: 16 }}
          sizes="1120px"
        />

        {/* mm:I3390:10349;313:8419 — D2 content panel (left side) */}
        <div
          className="absolute flex flex-col justify-center"
          style={{
            left: 64,
            top: 46,
            width: 457,
            height: 408,
            gap: 32,
          }}
        >
          {/* mm:I3390:10349;313:8420 — text stack */}
          <div className="flex flex-col" style={{ gap: 16 }}>
            {/* mm:I3390:10349;313:8421 — label */}
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 24,
                fontWeight: 700,
                lineHeight: "32px",
                letterSpacing: 0,
                color: "#FFFFFF",
              }}
            >
              {t("label")}
            </span>

            {/* mm:I3390:10349;313:8422 — title */}
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

            {/* mm:I3390:10349;313:8423 — description */}
            <p
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 16,
                fontWeight: 700,
                lineHeight: "24px",
                letterSpacing: 0.5,
                color: "#FFFFFF",
                textAlign: "justify",
                margin: 0,
                whiteSpace: "pre-line",
              }}
            >
              {t("detail")}
            </p>
          </div>

          {/* mm:I3390:10349;313:8424 — button row */}
          <div className="flex flex-col" style={{ gap: 24 }}>
            {/* mm:I3390:10349;313:8426 — "Chi tiết" button */}
            <a
              href={detailHref}
              className="inline-flex flex-row items-center transition-opacity hover:opacity-90 active:opacity-75"
              style={{
                gap: 8,
                padding: 16,
                borderRadius: 4,
                backgroundColor: "#FFEA9E",
                textDecoration: "none",
                width: 126,
                height: 56,
              }}
            >
              <span
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: "24px",
                  letterSpacing: 0.15,
                  color: "#00101A",
                }}
              >
                {t("description")}
              </span>
              {/* mm:I3390:10349;313:8426;186:1766 — arrow icon */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: "#00101A", flexShrink: 0 }}
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

        {/* mm:I3390:10349;329:2948 — Kudos logo (right side) */}
        <div
          className="absolute"
          style={{
            right: 64,
            top: "50%",
            transform: "translateY(-50%)",
            width: 364,
            height: 72,
          }}
        >
          <Image
            src="/homepage/kudos-logo.svg"
            alt="Sun* Kudos"
            width={364}
            height={72}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
