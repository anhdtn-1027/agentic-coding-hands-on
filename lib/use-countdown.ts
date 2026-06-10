/**
 * Pure countdown logic (testable, no React/client dependencies)
 * Extracted for unit testing per phase-08
 */

export interface CountdownValues {
  days: string;
  hours: string;
  minutes: string;
  /** true = event has not started yet; false = past or invalid */
  showComingSoon: boolean;
}

export const ZERO: CountdownValues = {
  days: "00",
  hours: "00",
  minutes: "00",
  showComingSoon: false,
};

/**
 * Zero-pad a number to 2 digits
 * @param n numeric value
 * @returns string: "00".."99" (clamped to 0)
 */
export function pad(n: number): string {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

/**
 * Compute countdown from target millisecond timestamp to current time
 * @param targetMs target time in milliseconds
 * @param now current time (defaults to Date.now()) — for testing
 * @returns CountdownValues with zero-padded days/hours/minutes
 *
 * Edge cases:
 *   - targetMs <= now → returns ZERO with showComingSoon=false
 *   - remaining < 60 min → pads to "00":".."59"
 */
export function computeCountdown(targetMs: number, now: number = Date.now()): CountdownValues {
  const diffMs = targetMs - now;
  if (diffMs <= 0) return ZERO;

  const totalMinutes = diffMs / 60_000;
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = Math.floor(totalMinutes % 60);

  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    showComingSoon: true,
  };
}

/**
 * Parse ISO-8601 datetime string to milliseconds
 * @param raw ISO-8601 string (e.g. "2025-02-20T15:30:00Z")
 * @returns milliseconds since epoch, or null if invalid/missing
 */
export function parseEventDatetime(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const ms = Date.parse(raw);
  // Date.parse returns NaN on invalid input (TC ID-57)
  if (isNaN(ms)) return null;
  return ms;
}

export { useCountdown } from "./use-countdown-hook";
