"use client";

// Client wrapper for the Prelaunch page.
// Wires the live countdown (useCountdown → NEXT_PUBLIC_EVENT_DATETIME, per-minute
// tick) and the localized title into the presentational PrelaunchPageView.
//
// On completion / invalid env the hook returns "00"/"00"/"00" (frozen at zero) —
// the page stays put, no redirect (per clarifications.md). Unit labels stay in
// English (DAYS/HOURS/MINUTES) as the design shows, via PrelaunchPageView defaults.

import { useTranslations } from "next-intl";
import { useCountdown } from "@/lib/use-countdown";
import { PrelaunchPageView } from "./prelaunch-page-view";

export function PrelaunchClient() {
  const t = useTranslations("prelaunch");
  const { days, hours, minutes } = useCountdown();

  return (
    <PrelaunchPageView
      days={days}
      hours={hours}
      minutes={minutes}
      title={t("title")}
    />
  );
}
