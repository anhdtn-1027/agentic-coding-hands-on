// mm:2268:35136 — Countdown time block (prelaunch variant)
// Presentational only — accepts pre-computed day/hour/minute strings + labels.
// Orchestrator (Track B) wires the real useCountdown() hook.

import { CountdownDisplay } from "@/components/homepage/countdown-display";

interface PrelaunchCountdownBlockProps {
  /** Zero-padded days string, e.g. "00" */
  days: string;
  /** Zero-padded hours string, e.g. "05" */
  hours: string;
  /** Zero-padded minutes string, e.g. "20" */
  minutes: string;
  /** Title above the timer — mm:2268:35137 */
  title?: string;
  /** Label for days column */
  daysLabel?: string;
  /** Label for hours column */
  hoursLabel?: string;
  /** Label for minutes column */
  minutesLabel?: string;
}

/**
 * Countdown time block for the Prelaunch page.
 * Uses CountdownDisplay variant="prelaunch" (larger digit boxes: 77×123px, 73px font).
 *
 * Layout (mm:2268:35136 — Countdown time):
 *   flex-col, gap 24px, centered, width 1512px in Figma → width 100% in code.
 *   Title: Montserrat 700 36px white, centered.
 *   Timer: CountdownDisplay prelaunch variant, centered.
 */
export function PrelaunchCountdownBlock({
  days,
  hours,
  minutes,
  title = "Sự kiện sẽ bắt đầu sau",
  daysLabel = "DAYS",
  hoursLabel = "HOURS",
  minutesLabel = "MINUTES",
}: PrelaunchCountdownBlockProps) {
  return (
    // mm:2268:35136 — Countdown time: flex-col, gap 24px, alignItems center
    <div
      className="flex flex-col items-center"
      style={{ gap: 24, width: "100%" }}
    >
      {/* mm:2268:35137 — Title text: Montserrat 700 36px, white, centered */}
      <p
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: 36,
          fontWeight: 700,
          lineHeight: "48px",
          letterSpacing: 0,
          color: "#FFFFFF",
          textAlign: "center",
          margin: 0,
        }}
      >
        {title}
      </p>

      {/* mm:2268:35138 — Time row: DAYS / HOURS / MINUTES */}
      <CountdownDisplay
        days={days}
        hours={hours}
        minutes={minutes}
        daysLabel={daysLabel}
        hoursLabel={hoursLabel}
        minutesLabel={minutesLabel}
        variant="prelaunch"
      />
    </div>
  );
}
