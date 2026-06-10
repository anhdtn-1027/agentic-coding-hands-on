// mm:2167:9062
// CtaButtons — "ABOUT AWARDS" (yellow fill) + "ABOUT KUDOS" (outline) CTA pair

interface CtaButtonsProps {
  aboutAwardsHref?: string;
  aboutKudosHref?: string;
  aboutAwardsLabel?: string;
  aboutKudosLabel?: string;
}

export function CtaButtons({
  aboutAwardsHref = "#",
  aboutKudosHref = "#",
  aboutAwardsLabel = "ABOUT AWARDS",
  aboutKudosLabel = "ABOUT KUDOS",
}: CtaButtonsProps) {
  return (
    // mm:2167:9062
    <div className="flex flex-row flex-wrap items-center" style={{ gap: 40 }}>
      {/* mm:2167:9063 — primary yellow button */}
      <a
        href={aboutAwardsHref}
        className="inline-flex flex-row items-center transition-opacity hover:opacity-90 active:opacity-75"
        style={{
          gap: 8,
          padding: "16px 24px",
          borderRadius: 8,
          backgroundColor: "#FFEA9E",
          textDecoration: "none",
          width: 276,
          height: 60,
        }}
      >
        {/* mm:I2167:9063;186:1935 */}
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 24,
            fontWeight: 700,
            lineHeight: "28px",
            color: "#00101A",
            letterSpacing: 0,
            whiteSpace: "nowrap",
          }}
        >
          {aboutAwardsLabel}
        </span>
        {/* mm:I2167:9063;186:1766 — up-arrow icon (chevron right) */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0, color: "#00101A" }}
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

      {/* mm:2167:9064 — outline/glass secondary button */}
      <a
        href={aboutKudosHref}
        className="inline-flex flex-row items-center transition-opacity hover:opacity-90 active:opacity-75"
        style={{
          gap: 8,
          padding: "16px 24px",
          borderRadius: 8,
          border: "1px solid #998C5F",
          background: "rgba(255, 234, 158, 0.10)",
          textDecoration: "none",
          height: 60,
        }}
      >
        {/* mm:I2167:9064;186:2758 */}
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 24,
            fontWeight: 700,
            lineHeight: "28px",
            color: "#FFFFFF",
            letterSpacing: 0,
            whiteSpace: "nowrap",
          }}
        >
          {aboutKudosLabel}
        </span>
        {/* mm:I2167:9064;186:2761 — up-arrow icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0, color: "#FFFFFF" }}
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
  );
}
