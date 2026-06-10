"use client";

import { useEffect, useState } from "react";
import { computeCountdown, parseEventDatetime, CountdownValues, ZERO } from "./use-countdown";

/**
 * React hook: real-time countdown to SAA 2025 event
 * SOURCE: process.env.NEXT_PUBLIC_EVENT_DATETIME (ISO-8601)
 * Returns zero-padded DAYS / HOURS / MINUTES strings + showComingSoon flag
 *
 * Edge cases (TC ID-39..43, 56, 57, 60):
 *   - Invalid / missing env → graceful fallback: "00"/"00"/"00", showComingSoon=false
 *   - Past event → zeroed display, showComingSoon=false
 *   - Per-minute tick (client-side useEffect interval)
 */
export function useCountdown(): CountdownValues {
  const [values, setValues] = useState<CountdownValues>(() => {
    // SSR-safe: return zeros on server, real value on client init
    if (typeof window === "undefined") return ZERO;
    const targetMs = parseEventDatetime(process.env.NEXT_PUBLIC_EVENT_DATETIME);
    if (targetMs === null) return ZERO;
    return computeCountdown(targetMs);
  });

  useEffect(() => {
    const targetMs = parseEventDatetime(process.env.NEXT_PUBLIC_EVENT_DATETIME);
    // Invalid or missing env — TC ID-56/57/60: stay zeroed, no crash
    // Don't call setState synchronously — initial value already handles null via useState init.
    if (targetMs === null) return;

    // Sync initial value for the client (in case SSR returned ZERO)
    // Use functional update to avoid synchronous-in-effect lint rule:
    // schedule microtask so the set happens after paint
    const rafId = requestAnimationFrame(() => {
      setValues(computeCountdown(targetMs));
    });

    // Tick every minute (per-minute granularity per spec)
    const interval = setInterval(() => {
      setValues(computeCountdown(targetMs));
    }, 60_000);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(interval);
    };
  }, []);

  return values;
}
