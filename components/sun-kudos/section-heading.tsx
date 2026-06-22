// mm:2940:13476 — B.6_Header Giải thưởng (Spotlight heading pattern)
// mm:2940:14221 — C.1_Header Giải thưởng (All Kudos heading pattern)
//
// Layout: padding 0 144px, flex-col gap 16px
//   Subtitle: Montserrat 700 24px/32px #FFFFFF
//   Divider:  1px solid #2E3940
//   Title:    Montserrat 700 57px/64px letter-spacing -0.25px #FFEA9E

interface SectionHeadingProps {
  /** Small subtitle above divider. e.g. "Sun* Annual Awards 2025" */
  subtitle: string;
  /** Large gold title below divider. e.g. "HIGHLIGHT KUDOS" */
  title: string;
}

export function SectionHeading({ subtitle, title }: SectionHeadingProps) {
  return (
    // mm: width 1440px, height 129px, padding 0 144px, flex-col, gap 16px
    <div
      className="flex flex-col w-full"
      style={{ gap: 16, paddingInline: "clamp(16px, 10vw, 144px)" }}
    >
      {/* Subtitle: Montserrat 700 24px/32px white */}
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: 24,
          lineHeight: "32px",
          letterSpacing: "0px",
          color: "#FFFFFF",
        }}
      >
        {subtitle}
      </span>

      {/* Divider 1px #2E3940 */}
      <div
        style={{ width: "100%", height: 1, background: "#2E3940", flexShrink: 0 }}
        aria-hidden="true"
      />

      {/* Title: Montserrat 700 57px/64px gold */}
      <h2
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: "clamp(32px, 4vw, 57px)",
          lineHeight: "1.12",
          letterSpacing: "-0.25px",
          color: "#FFEA9E",
          margin: 0,
        }}
      >
        {title}
      </h2>
    </div>
  );
}
