"use client";

// mm:662:14447 (login variant) — mms_D_Footer component 342:1427
// mm:5001:14800 (home variant) — mms_7_Footer
//
// Both: padding 40px 90px, border-top 1px solid #2E3940, flex row space-between
//
// Login: copyright text only, centered
//   "Bản quyền thuộc về Sun* © 2025" — Montserrat Alternates Bold 16px white
//
// Home: left = LOGO(69×64) + nav links (gap 80px, gap 48px between links)
//       right = copyright text

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface SiteFooterProps {
  variant: "login" | "home";
}

export function SiteFooter({ variant }: SiteFooterProps) {
  const t = useTranslations("footer");

  const copyright = (
    // mm:I662:14447;342:1413 — Montserrat Alternates Bold 16px #FFFFFF
    <span
      style={{
        fontFamily: "'Montserrat Alternates', sans-serif",
        fontWeight: 700,
        fontSize: "16px",
        lineHeight: "24px",
        color: "#FFFFFF",
        whiteSpace: "nowrap",
      }}
    >
      {t("copyright")}
    </span>
  );

  return (
    <footer
      className="w-full flex flex-row items-center justify-between"
      style={{
        padding: "40px 90px",
        borderTop: "1px solid #2E3940",
      }}
    >
      {variant === "login" ? (
        // Login: copyright only, full-width centered
        // mm:662:14447 — single text node centred within the footer
        <div className="w-full flex items-center justify-center">
          {copyright}
        </div>
      ) : (
        // Home: left = logo + nav, right = copyright
        // mm:5001:14800
        <>
          {/* Left: logo + nav links — mm:I5001:14800;342:1407 gap 80px */}
          <div
            className="flex flex-row items-center"
            style={{ gap: "80px" }}
          >
            {/* mm:I5001:14800;342:1408 — mms_7.1_LOGO 69×64 */}
            <Link href="/" aria-label="Sun* Annual Awards 2025 home">
              <Image
                src="/shared/saa-logo-footer.png"
                alt="SAA 2025"
                width={69}
                height={64}
                className="object-contain"
              />
            </Link>

            {/* Nav links — mm:I5001:14800;342:1409 gap 48px */}
            <nav
              className="flex flex-row items-center"
              style={{ gap: "0px" }}
              aria-label="Footer navigation"
            >
              {/* mm:I5001:14800;342:1410 — normal button */}
              <Link
                href="/"
                style={{
                  padding: "16px",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "20px",
                  letterSpacing: "0.1px",
                  color: "#FFFFFF",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {t("links.aboutSaa")}
              </Link>
              {/* mm:I5001:14800;342:1411 — highlighted button (rgba(255,234,158,0.10) bg) */}
              <Link
                href="/awards-information"
                style={{
                  padding: "16px",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "20px",
                  letterSpacing: "0.1px",
                  color: "#FFFFFF",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  backgroundColor: "rgba(255, 234, 158, 0.10)",
                  borderRadius: "0px",
                }}
              >
                {t("links.awardsInfo")}
              </Link>
              {/* mm:I5001:14800;342:1412 — normal button */}
              <Link
                href="/sun-kudos"
                style={{
                  padding: "16px",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "20px",
                  letterSpacing: "0.1px",
                  color: "#FFFFFF",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {t("links.sunKudos")}
              </Link>
              {/* mm:I5001:14800;1161:9487 — 4th footer link (About SAA repeated) */}
              <Link
                href="/"
                style={{
                  padding: "16px",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "20px",
                  letterSpacing: "0.1px",
                  color: "#FFFFFF",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {t("links.aboutSaa")}
              </Link>
            </nav>
          </div>

          {/* Right: copyright */}
          {copyright}
        </>
      )}
    </footer>
  );
}
