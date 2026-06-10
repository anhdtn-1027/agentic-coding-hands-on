import { describe, it, expect } from 'vitest';
import { pad, computeCountdown, parseEventDatetime } from './use-countdown';

describe('use-countdown', () => {
  describe('pad()', () => {
    it('pads single digit to 2 chars with leading zero', () => {
      expect(pad(5)).toBe('05');
      expect(pad(9)).toBe('09');
    });

    it('preserves 2-digit numbers', () => {
      expect(pad(10)).toBe('10');
      expect(pad(59)).toBe('59');
      expect(pad(99)).toBe('99');
    });

    it('clamps negative to 00', () => {
      expect(pad(-1)).toBe('00');
      expect(pad(-100)).toBe('00');
    });

    it('handles 0', () => {
      expect(pad(0)).toBe('00');
    });

    it('floors decimal values', () => {
      expect(pad(5.9)).toBe('05');
      expect(pad(9.1)).toBe('09');
    });
  });

  describe('parseEventDatetime()', () => {
    it('parses valid ISO-8601 datetime', () => {
      const result = parseEventDatetime('2025-02-20T15:30:00Z');
      expect(result).toBeGreaterThan(0);
    });

    it('returns null for empty string', () => {
      expect(parseEventDatetime('')).toBeNull();
    });

    it('returns null for undefined', () => {
      expect(parseEventDatetime(undefined)).toBeNull();
    });

    it('returns null for null', () => {
      expect(parseEventDatetime(null)).toBeNull();
    });

    it('returns null for invalid datetime string (TC ID-57)', () => {
      expect(parseEventDatetime('not-a-date')).toBeNull();
      expect(parseEventDatetime('2025-13-45T99:99:99Z')).toBeNull();
    });

    it('parses various ISO-8601 formats', () => {
      const formats = [
        '2025-02-20T15:30:00Z',
        '2025-02-20T15:30:00+00:00',
        '2025-02-20',
        '2025-02-20T15:30:00',
      ];
      formats.forEach((fmt) => {
        const result = parseEventDatetime(fmt);
        expect(result).not.toBeNull();
        expect(typeof result).toBe('number');
      });
    });
  });

  describe('computeCountdown()', () => {
    const baseTime = new Date('2025-02-20T00:00:00Z').getTime();

    it('returns zero state for past event (TC ID-40, 57, 60)', () => {
      const target = baseTime - 1000; // 1 second in past
      const result = computeCountdown(target, baseTime);
      expect(result).toEqual({
        days: '00',
        hours: '00',
        minutes: '00',
        showComingSoon: false,
      });
    });

    it('returns zero state for current time (TC ID-40)', () => {
      const result = computeCountdown(baseTime, baseTime);
      expect(result).toEqual({
        days: '00',
        hours: '00',
        minutes: '00',
        showComingSoon: false,
      });
    });

    it('computes correct remaining time (TC ID-39, 41)', () => {
      // Target: 1 day, 5 hours, 30 minutes in future
      const target = baseTime + (1 * 24 * 60 * 60 * 1000) + (5 * 60 * 60 * 1000) + (30 * 60 * 1000);
      const result = computeCountdown(target, baseTime);
      expect(result.days).toBe('01');
      expect(result.hours).toBe('05');
      expect(result.minutes).toBe('30');
      expect(result.showComingSoon).toBe(true);
    });

    it('zero-pads single digits (TC ID-42, 43)', () => {
      // Target: 5 days, 3 hours, 7 minutes
      const target = baseTime + (5 * 24 * 60 * 60 * 1000) + (3 * 60 * 60 * 1000) + (7 * 60 * 1000);
      const result = computeCountdown(target, baseTime);
      expect(result.days).toBe('05');
      expect(result.hours).toBe('03');
      expect(result.minutes).toBe('07');
      expect(result.showComingSoon).toBe(true);
    });

    it('handles large day counts', () => {
      // Target: 100 days in future
      const target = baseTime + (100 * 24 * 60 * 60 * 1000);
      const result = computeCountdown(target, baseTime);
      expect(result.days).toBe('100'); // pad doesn't cap at 99
      expect(result.hours).toBe('00');
      expect(result.minutes).toBe('00');
      expect(result.showComingSoon).toBe(true);
    });

    it('rounds down to minute granularity (TC ID-56)', () => {
      // Target: 1 day, 1 hour, 1 minute, 59 seconds
      const target = baseTime + (1 * 24 * 60 * 60 * 1000) + (1 * 60 * 60 * 1000) + (1 * 60 * 1000) + 59_000;
      const result = computeCountdown(target, baseTime);
      expect(result.days).toBe('01');
      expect(result.hours).toBe('01');
      expect(result.minutes).toBe('01'); // 59 seconds rounds down to 0 more minutes
    });

    it('handles fractional minutes (round down)', () => {
      // Target: 30.5 minutes
      const target = baseTime + (30.5 * 60 * 1000);
      const result = computeCountdown(target, baseTime);
      expect(result.minutes).toBe('30');
    });

    it('handles sub-minute remaining time gracefully', () => {
      // Target: 59 seconds in future
      const target = baseTime + 59_000;
      const result = computeCountdown(target, baseTime);
      expect(result.days).toBe('00');
      expect(result.hours).toBe('00');
      expect(result.minutes).toBe('00'); // 59 seconds < 1 minute → rounds down
      expect(result.showComingSoon).toBe(true);
    });

    it('sets showComingSoon true only for future events', () => {
      const future = baseTime + (1 * 60 * 1000); // 1 minute
      const resultFuture = computeCountdown(future, baseTime);
      expect(resultFuture.showComingSoon).toBe(true);

      const past = baseTime - (1 * 60 * 1000);
      const resultPast = computeCountdown(past, baseTime);
      expect(resultPast.showComingSoon).toBe(false);
    });

    // Homepage TC ID-56: missing env → fallback (tested via integration with hook)
    // Homepage TC ID-57: invalid datetime → fallback
    // Homepage TC ID-60: graceful fallback on missing/invalid
    it('supports custom "now" parameter for testing (TC ID-56, 57, 60)', () => {
      const target = baseTime + (2 * 60 * 1000); // 2 minutes
      const customNow = baseTime + (1 * 60 * 1000); // 1 minute later
      const result = computeCountdown(target, customNow);
      expect(result.minutes).toBe('01');
      expect(result.showComingSoon).toBe(true);
    });
  });

  describe('integration: parseEventDatetime + computeCountdown', () => {
    it('handles missing env gracefully (TC ID-56)', () => {
      const parsed = parseEventDatetime(undefined);
      expect(parsed).toBeNull(); // Caller should treat as no countdown
    });

    it('handles invalid env gracefully (TC ID-57)', () => {
      const parsed = parseEventDatetime('invalid-date-string');
      expect(parsed).toBeNull();
    });

    it('full flow: valid env → valid countdown (TC ID-39..43)', () => {
      const envValue = '2025-02-20T15:30:00Z';
      const parsed = parseEventDatetime(envValue);
      expect(parsed).not.toBeNull();
      if (parsed) {
        const now = new Date('2025-02-20T00:00:00Z').getTime();
        const result = computeCountdown(parsed, now);
        expect(result.showComingSoon).toBe(true);
        expect(result.days).toMatch(/^\d{2}$/);
        expect(result.hours).toMatch(/^\d{2}$/);
        expect(result.minutes).toMatch(/^\d{2}$/);
      }
    });
  });
});
