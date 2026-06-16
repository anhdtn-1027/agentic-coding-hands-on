"use client";

// mm:3204:10152
// RootFurtherContent — decorative ROOT/FURTHER typography + paragraphs + quote block (B4)
// Long-form copy is i18n-driven (homepage.rootFurther) so it switches with the locale.

import Image from "next/image";
import { useTranslations } from "next-intl";

export function RootFurtherContent() {
  const t = useTranslations("homepage.rootFurther");
  return (
    // mm:3204:10152
    <div
      className="flex flex-col items-center w-full mx-auto"
      style={{
        maxWidth: 1152,
        padding: "120px 104px",
        gap: 32,
        borderRadius: 8,
        justifyContent: "center",
      }}
    >
      {/* mm:3204:10153 — Group 434: ROOT + FURTHER decorative text images stacked */}
      <div
        className="relative flex-shrink-0"
        style={{ width: 290, height: 134 }}
      >
        {/* mm:3204:10155 — "ROOT" text image */}
        <Image
          src="/homepage/root-text.png"
          alt="ROOT"
          width={189}
          height={67}
          className="absolute"
          style={{ top: 0, left: 51 }}
        />
        {/* mm:3204:10154 — "FURTHER" text image */}
        <Image
          src="/homepage/further-text.png"
          alt="FURTHER"
          width={290}
          height={67}
          className="absolute"
          style={{ top: 67, left: 0 }}
        />
      </div>

      {/* mm:5001:14827 — mms_B4_content: paragraphs + quote */}
      <div
        className="flex flex-col w-full"
        style={{ gap: 0 }}
      >
        {/* mm:3204:10156 — first paragraph block */}
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 24,
            fontWeight: 700,
            lineHeight: "32px",
            letterSpacing: 0,
            color: "#FFFFFF",
            textAlign: "justify",
            marginBottom: 32,
          }}
        >
          {t("paragraph1")}
        </p>

        {/* mm:3204:10161 — quote */}
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 20,
            fontWeight: 700,
            lineHeight: "32px",
            letterSpacing: 0,
            color: "#FFFFFF",
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          {t("quoteLine")}
          <br />
          {t("quoteAttribution")}
        </p>

        {/* mm:3204:10162 — second paragraph block */}
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 24,
            fontWeight: 700,
            lineHeight: "32px",
            letterSpacing: 0,
            color: "#FFFFFF",
            textAlign: "justify",
          }}
        >
          {t("paragraph2")}
        </p>
      </div>
    </div>
  );
}
