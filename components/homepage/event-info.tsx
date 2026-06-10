// mm:2167:9053
// EventInfo — presentational event detail block under countdown

interface EventInfoProps {
  /** Time/date value shown in yellow — Figma: "26/12/2025"; integration may override with "18h30" etc. */
  time?: string;
  venue?: string;
  livestreamText?: string;
}

export function EventInfo({
  time = "26/12/2025",
  venue = "Âu Cơ Art Center",
  livestreamText = "Tường thuật trực tiếp qua sóng Livestream",
}: EventInfoProps) {
  return (
    // mm:2167:9053
    <div
      className="flex flex-col"
      style={{ gap: 8, width: "100%" }}
    >
      {/* mm:2167:9054 — row: time + venue */}
      <div
        className="flex flex-row items-center"
        style={{ gap: 60 }}
      >
        {/* mm:2167:9055 — time group */}
        <div className="flex flex-row items-baseline" style={{ gap: 4 }}>
          {/* mm:2167:9056 */}
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              lineHeight: "24px",
              letterSpacing: 0.15,
              color: "#FFFFFF",
            }}
          >
            Thời gian:{" "}
          </span>
          {/* mm:2167:9057 */}
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 24,
              fontWeight: 700,
              lineHeight: "32px",
              letterSpacing: 0,
              color: "#FFEA9E",
            }}
          >
            {time}
          </span>
        </div>

        {/* mm:2167:9058 — venue group */}
        <div className="flex flex-row items-baseline" style={{ gap: 4 }}>
          {/* mm:2167:9060 */}
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              lineHeight: "24px",
              letterSpacing: 0.15,
              color: "#FFFFFF",
            }}
          >
            Địa điểm:
          </span>
          {/* mm:2167:9059 */}
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 24,
              fontWeight: 700,
              lineHeight: "32px",
              letterSpacing: 0,
              color: "#FFEA9E",
            }}
          >
            {venue}
          </span>
        </div>
      </div>

      {/* mm:2167:9061 — livestream line */}
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: 16,
          fontWeight: 700,
          lineHeight: "24px",
          letterSpacing: 0.5,
          color: "#FFFFFF",
        }}
      >
        {livestreamText}
      </span>
    </div>
  );
}
