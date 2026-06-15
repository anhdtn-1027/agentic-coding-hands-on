// mm:2167:9035
// CountdownDisplay — presentational only. Accepts pre-computed string values.
// Timer logic lives in lib/use-countdown.ts (Track B). DO NOT add timer logic here.
//
// variant="default"   — homepage style   (51×82px boxes, 14px gap, 49px font)
// variant="prelaunch" — prelaunch page   (77×123px boxes, 21px gap, 73px font)
//   Figma node: 2268:35138 (Time frame) / component 186:2619

import { splitDigits } from "@/lib/use-countdown";

type CountdownVariant = "default" | "prelaunch";

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
  /**
   * Visual variant.
   * "default"   = homepage sizing (small)
   * "prelaunch" = prelaunch page sizing (large) — Figma node 2268:35138
   */
  variant?: CountdownVariant;
}

// Size tokens per variant — sourced from Figma MCP node data
const VARIANT_SIZES = {
  default: {
    // mm:I2167:9040;186:2616
    boxW: 51, boxH: 82,
    borderRadius: 8, borderWidth: "0.5px",
    blur: "16.64px",
    // mm:I2167:9040;186:2617
    fontSize: 49.15,
    boxGap: 14,
    labelFontSize: 24, labelLineHeight: "32px",
    unitGap: 40,
    unitW: 116, unitH: 128,
  },
  prelaunch: {
    // mm:I2268:35141;186:2616 — 76.8×122.88px rounded to 77×123
    boxW: 77, boxH: 123,
    borderRadius: 12, borderWidth: "0.75px",
    blur: "24.96px",
    // mm:I2268:35141;186:2617 — fontSize 73.728
    fontSize: 73.728,
    // mm:2268:35140 — Frame 485 gap: 21px
    boxGap: 21,
    // mm:2268:35143 — label fontSize 36px / lineHeight 48px
    labelFontSize: 36, labelLineHeight: "48px",
    // mm:2268:35138 — Time frame gap: 60px
    unitGap: 60,
    unitW: 175, unitH: 192,
  },
} as const;

// Single digit box — frosted glass effect from Figma component 186:2619
function DigitBox({ digit, variant = "default" }: { digit: string; variant?: CountdownVariant }) {
  const s = VARIANT_SIZES[variant];
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: s.boxW, height: s.boxH, flexShrink: 0 }}
    >
      {/* Frosted glass rectangle — mm:I2167:9040;186:2616 / mm:I2268:35141;186:2616 */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: s.borderRadius,
          border: `${s.borderWidth} solid #FFEA9E`,
          background: "linear-gradient(180deg, #FFF 0%, rgba(255,255,255,0.10) 100%)",
          opacity: 0.5,
          backdropFilter: `blur(${s.blur})`,
        }}
      />
      {/* Digit text — mm:I2167:9040;186:2617 / mm:I2268:35141;186:2617 */}
      <span
        className="relative z-10"
        style={{
          fontFamily: '"Digital Numbers", monospace',
          fontSize: s.fontSize,
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
  variant = "default",
}: {
  value: string;
  label: string;
  variant?: CountdownVariant;
}) {
  const s = VARIANT_SIZES[variant];
  // Two LED boxes per unit → clamp to 00–99, zero-pad single digits.
  const [tens, units] = splitDigits(value);

  return (
    <div
      className="flex flex-col"
      style={{ gap: s.boxGap, width: s.unitW, height: s.unitH, justifyContent: "center", flexShrink: 0 }}
    >
      {/* Two digit boxes row — mm:2167:9039 / mm:2268:35140 */}
      <div className="flex flex-row items-center" style={{ gap: s.boxGap, height: s.boxH }}>
        <DigitBox digit={tens} variant={variant} />
        <DigitBox digit={units} variant={variant} />
      </div>
      {/* Label — mm:2167:9042 / mm:2268:35143 */}
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: s.labelFontSize,
          fontWeight: 700,
          lineHeight: s.labelLineHeight,
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
  variant = "default",
}: CountdownDisplayProps) {
  const s = VARIANT_SIZES[variant];
  return (
    // mm:2167:9035 / mm:2268:35136
    <div className="flex flex-col" style={{ gap: 16, width: "100%" }}>
      {/* Coming soon label — mm:2167:9036 */}
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

      {/* Countdown row: DAYS / HOURS / MINUTES — mm:2167:9037 / mm:2268:35138 */}
      <div
        className="flex flex-row items-center"
        style={{ gap: s.unitGap }}
      >
        {/* mm:2167:9038 / mm:2268:35139 */}
        <TimeUnit value={days} label={daysLabel} variant={variant} />
        {/* mm:2167:9043 / mm:2268:35144 */}
        <TimeUnit value={hours} label={hoursLabel} variant={variant} />
        {/* mm:2167:9048 / mm:2268:35149 */}
        <TimeUnit value={minutes} label={minutesLabel} variant={variant} />
      </div>
    </div>
  );
}
