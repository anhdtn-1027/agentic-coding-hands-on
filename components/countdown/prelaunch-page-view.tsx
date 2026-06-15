"use client";
// mm:2268:35127 — Countdown - Prelaunch page (full-screen)
// Presentational only. Accepts day/hour/minute strings as props.
// Orchestrator (Track B) wires useCountdown() hook before this is rendered.
//
// Layers (bottom → top):
//   z-0  MM_MEDIA_BG Image  — full-bleed background PNG (mm:2268:35129)
//   z-10 Cover              — gradient overlay          (mm:2268:35130)
//   z-20 Bìa               — countdown content block   (mm:2268:35131)
//
// Responsive: .prelaunch-countdown-scaler in globals.css applies CSS `zoom`
// at breakpoints. `zoom` shrinks the layout box together with the visual, so the
// scaled block stays centered without overflow.

import Image from "next/image";
import { PrelaunchCountdownBlock } from "./prelaunch-countdown-block";

interface PrelaunchPageViewProps {
  /** Zero-padded days string, e.g. "00" */
  days: string;
  /** Zero-padded hours string, e.g. "05" */
  hours: string;
  /** Zero-padded minutes string, e.g. "20" */
  minutes: string;
  /** Title above the timer */
  title?: string;
  /** Label for days column */
  daysLabel?: string;
  /** Label for hours column */
  hoursLabel?: string;
  /** Label for minutes column */
  minutesLabel?: string;
}

// Design content width = 3 units×175px + 2 gaps×60px = 645px (mm:2268:35138 Time).
// The wrapper matches this exactly so the centered title and the time row share
// the same horizontal center axis (x=756 on the 1512 canvas), as in the design.
const CONTENT_WIDTH = 645;

/**
 * Full-screen prelaunch countdown page.
 *
 * Background image: /countdown-prelaunch-bg.png (1512×1077)
 * Gradient overlay: linear-gradient(18deg, #00101A 15.48%, ...)
 *
 * Content (mm:2268:35131 Bìa): horizontally centered, vertically upper-center.
 * The design band spans y=218..673 of the 1077 canvas → content center at ~41.3%
 * of viewport height (not 50%). We anchor a top band of height 82.6vh and center
 * within it, so the block sits in the upper-center and the colourful artwork stays
 * visible below-right. CSS `zoom` scales the block down on smaller viewports.
 *
 * Responsive breakpoints (globals.css .prelaunch-countdown-scaler):
 *   < 480px    → zoom 0.48
 *   480-719px  → zoom 0.62
 *   720-1023px → zoom 0.82
 *   ≥ 1024px   → zoom 1
 */
export function PrelaunchPageView({
  days,
  hours,
  minutes,
  title = "Sự kiện sẽ bắt đầu sau",
  daysLabel = "DAYS",
  hoursLabel = "HOURS",
  minutesLabel = "MINUTES",
}: PrelaunchPageViewProps) {
  return (
    // mm:2268:35127 — root: full viewport, dark base
    <div
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100vh", background: "#00101A" }}
    >
      {/* mm:2268:35129 — MM_MEDIA_BG Image (z-0): full-bleed background */}
      <Image
        src="/countdown-prelaunch-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center top", zIndex: 0 }}
        aria-hidden="true"
      />

      {/* mm:2268:35130 — Cover (z-10): dark gradient overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(18deg, #00101A 15.48%, rgba(0, 18, 29, 0.46) 52.13%, rgba(0, 19, 32, 0.00) 63.41%)",
        }}
        aria-hidden="true"
      />

      {/* mm:2268:35131 — Bìa (z-20): content band, upper-center (center ≈ 41.3vh) */}
      <div
        className="absolute inset-x-0 top-0 z-20 flex flex-col items-center justify-center"
        style={{ height: "82.6vh" }}
      >
        {/* Scaler: fixed layout width = CONTENT_WIDTH px, centered by the parent.
            .prelaunch-countdown-scaler applies CSS `zoom` per breakpoint. */}
        <div
          className="prelaunch-countdown-scaler flex flex-col items-center"
          style={{ width: CONTENT_WIDTH }}
        >
          {/* mm:2268:35136 — Countdown time block */}
          <PrelaunchCountdownBlock
            days={days}
            hours={hours}
            minutes={minutes}
            title={title}
            daysLabel={daysLabel}
            hoursLabel={hoursLabel}
            minutesLabel={minutesLabel}
          />
        </div>
      </div>
    </div>
  );
}
