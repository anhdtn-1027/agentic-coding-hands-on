// mm:2167:9035
// CountdownDisplay — presentational only. Accepts pre-computed string values.
// Timer logic lives in lib/use-countdown.ts (Track B). DO NOT add timer logic here.

interface CountdownDisplayProps {
  /** Zero-padded string, e.g. "22" */
  days: string;
  /** Zero-padded string, e.g. "06" */
  hours: string;
  /** Zero-padded string, e.g. "30" */
  minutes: string;
  /** When true, shows comingSoonLabel above the boxes */
  showComingSoon?: boolean;
  /** i18n label for the coming-soon line (e.g. "Sắp ra mắt") */
  comingSoonLabel?: string;
  /** i18n label for days unit (e.g. "Ngày") */
  daysLabel?: string;
  /** i18n label for hours unit (e.g. "Giờ") */
  hoursLabel?: string;
  /** i18n label for minutes unit (e.g. "Phút") */
  minutesLabel?: string;
}

// Single digit box — frosted glass effect from Figma node 186:2616
function DigitBox({ digit }: { digit: string }) {
  return (
    // mm:186:2619
    <div
      className="relative flex items-center justify-center"
      style={{ width: 51, height: 82 }}
    >
      {/* mm:I2167:9040;186:2616 — frosted glass rectangle */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: 8,
          border: "0.5px solid #FFEA9E",
          background:
            "linear-gradient(180deg, #FFF 0%, rgba(255,255,255,0.10) 100%)",
          opacity: 0.5,
          backdropFilter: "blur(16.64px)",
        }}
      />
      {/* mm:I2167:9040;186:2617 — digit text */}
      <span
        className="relative z-10"
        style={{
          fontFamily: '"Digital Numbers", monospace',
          fontSize: 49.15,
          fontWeight: 400,
          color: "#FFFFFF",
          lineHeight: 1,
          letterSpacing: 0,
        }}
      >
        {digit}
      </span>
    </div>
  );
}

// Two-digit group (tens + units) for one time unit
function TimeUnit({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const tens = value.length >= 2 ? value[0] : "0";
  const units = value.length >= 2 ? value[1] : value[0] ?? "0";

  return (
    <div
      className="flex flex-col"
      style={{ gap: 14, width: 116, height: 128, justifyContent: "center" }}
    >
      {/* mm:2167:9039 — two digit boxes row */}
      <div className="flex flex-row items-center" style={{ gap: 14, height: 82 }}>
        <DigitBox digit={tens} />
        <DigitBox digit={units} />
      </div>
      {/* mm:2167:9042 — label text */}
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
        {label}
      </span>
    </div>
  );
}

export function CountdownDisplay({
  days,
  hours,
  minutes,
  showComingSoon = false,
  comingSoonLabel = "Coming Soon",
  daysLabel = "DAYS",
  hoursLabel = "HOURS",
  minutesLabel = "MINUTES",
}: CountdownDisplayProps) {
  return (
    // mm:2167:9035
    <div className="flex flex-col" style={{ gap: 16, width: "100%" }}>
      {/* mm:2167:9036 — coming soon label */}
      {showComingSoon && (
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
          {comingSoonLabel}
        </span>
      )}

      {/* mm:2167:9037 — countdown row: DAYS / HOURS / MINUTES */}
      <div
        className="flex flex-row items-center"
        style={{ gap: 40, width: 429, height: 128 }}
      >
        {/* mm:2167:9038 */}
        <TimeUnit value={days} label={daysLabel} />
        {/* mm:2167:9043 */}
        <TimeUnit value={hours} label={hoursLabel} />
        {/* mm:2167:9048 */}
        <TimeUnit value={minutes} label={minutesLabel} />
      </div>
    </div>
  );
}
