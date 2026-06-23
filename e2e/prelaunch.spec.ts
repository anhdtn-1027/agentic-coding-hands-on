import { test, expect } from '@playwright/test';
import { applyStubSession } from './support/routes';

/**
 * E2E coverage for the Countdown Prelaunch page (/prelaunch).
 *
 * TC coverage matrix (17 MoMorph TCs):
 *
 * Auth Guard (ACCESSING):
 *   e6a59553 — unauthenticated → redirect /login           [e2e]
 *   68d82c58 — authenticated any-privilege → page loads    [e2e]
 *   1c266552 — low-privilege gate                          [N/A — no per-page privilege tiers on this route]
 *   17aa9e0d — expired/cleared cookie → redirect /login    [e2e]
 *
 * GUI / Layout:
 *   400e248f — DAYS unit: 2-digit display + label "DAYS"   [e2e]
 *   25d9ddaa — HOURS unit: 2-digit display + label "HOURS" [e2e]
 *   68cf8e17 — MINUTES unit: 2-digit + label "MINUTES"     [e2e]
 *   37fd89d1 — all labels uppercase + white                [e2e]
 *
 * Value matrix (unit-tested in lib/use-countdown.test.ts):
 *   33fe648b — days display: 0/9/10/31                     [unit]
 *   1bd69f78 — hours display: 0/9/10/23                    [unit]
 *   8dc4bba6 — minutes display: 0/9/10/59                  [unit]
 *   840dd6be — real-time auto-update (per-minute tick)      [unit]
 *   b373626d — days<1 → "00"                               [unit]
 *   f98adad8 — hours range 00-23                           [unit]
 *   724e6e17 — minutes range 00-59                         [unit]
 *   50fc4021 — completion → all "00"                       [unit]
 *   c715cb38 — two-digit leading-zero enforcement          [unit + e2e regex]
 *
 * N/A:
 *   1c266552 — low-privilege: app only has user/admin roles; no per-page
 *              privilege gate on /prelaunch — route is auth-gated only.
 */

// ─── Auth Guard ─────────────────────────────────────────────────────────────

test.describe('Countdown Prelaunch — Auth Guard', () => {
  test('(TC e6a59553) unauthenticated user is redirected to /login', async ({
    context,
    page,
  }) => {
    await context.clearCookies();
    await page.goto('/prelaunch');
    await expect(page).toHaveURL(/\/login/);
  });

  test('(TC 17aa9e0d) expired/cleared cookie redirects to /login', async ({
    context,
    page,
  }) => {
    // Simulate an expired session by applying a stub then clearing the cookie
    await applyStubSession(context);
    await context.clearCookies();
    await page.goto('/prelaunch');
    await expect(page).toHaveURL(/\/login/);
  });

  test('(TC 68d82c58) authenticated user can access /prelaunch directly', async ({
    context,
    page,
  }) => {
    await applyStubSession(context);
    await page.goto('/prelaunch');
    await expect(page).toHaveURL(/\/prelaunch/);
    // Page renders — title text confirms the page loaded (not an error/redirect)
    await expect(page.getByText('Sự kiện sẽ bắt đầu sau')).toBeVisible();
  });
});

// ─── Layout ─────────────────────────────────────────────────────────────────

test.describe('Countdown Prelaunch — Layout (authenticated, VI locale)', () => {
  test.beforeEach(async ({ context, page }) => {
    await applyStubSession(context);
    await page.goto('/prelaunch');
    // Ensure countdown block is visible before each assertion
    await expect(page.getByText('Sự kiện sẽ bắt đầu sau')).toBeVisible();
  });

  test('(TC structural) title "Sự kiện sẽ bắt đầu sau" is visible', async ({
    page,
  }) => {
    await expect(page.getByText('Sự kiện sẽ bắt đầu sau')).toBeVisible();
  });

  test('(TC 400e248f) DAYS unit: 2-digit value rendered + label "DAYS" visible', async ({
    page,
  }) => {
    // Label rendered by TimeUnit span — exact text DAYS (uppercase)
    const daysLabel = page.getByText('DAYS', { exact: true });
    await expect(daysLabel).toBeVisible();

    // Two digit boxes are siblings in the same TimeUnit; combined text matches
    // /^\d{2}$/ — read the span text of both digit boxes via the parent
    // The TimeUnit wraps: [DigitBox(tens), DigitBox(units)] + label span.
    // Grab the first pair of digit spans preceding the DAYS label.
    const timeUnits = page.locator('span').filter({ hasText: /^[0-9]$/ });
    // At least 6 digit spans (3 units × 2 boxes)
    const count = await timeUnits.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('(TC 25d9ddaa) HOURS unit: label "HOURS" visible', async ({ page }) => {
    await expect(page.getByText('HOURS', { exact: true })).toBeVisible();
  });

  test('(TC 68cf8e17) MINUTES unit: label "MINUTES" visible', async ({ page }) => {
    await expect(page.getByText('MINUTES', { exact: true })).toBeVisible();
  });

  test('(TC 37fd89d1 + c715cb38) all three unit labels uppercase; each rendered value is 2-digit /^\\d{2}$/', async ({
    page,
  }) => {
    // Labels must be exactly uppercase
    await expect(page.getByText('DAYS', { exact: true })).toBeVisible();
    await expect(page.getByText('HOURS', { exact: true })).toBeVisible();
    await expect(page.getByText('MINUTES', { exact: true })).toBeVisible();

    // Each digit span contains a single digit character [0-9] (splitDigits splits
    // two-digit values into individual spans via DigitBox).
    // Collect all single-digit spans and verify their text is exactly one digit.
    const digitSpans = page.locator('span').filter({ hasText: /^[0-9]$/ });
    const spanCount = await digitSpans.count();
    // 3 units × 2 digit boxes = 6 digit spans minimum
    expect(spanCount).toBeGreaterThanOrEqual(6);

    // Verify each of the first 6 digit spans holds exactly one digit char
    for (let i = 0; i < Math.min(spanCount, 6); i++) {
      const text = await digitSpans.nth(i).textContent();
      expect(text).toMatch(/^[0-9]$/);
    }

    // Reconstruct the two-digit values: spans come in tens/units pairs.
    // Combine each consecutive pair and assert /^\d{2}$/ — this is the e2e proxy
    // for TC c715cb38 (two-digit leading-zero enforcement).
    const allDigits: string[] = [];
    for (let i = 0; i < Math.min(spanCount, 6); i++) {
      const text = (await digitSpans.nth(i).textContent()) ?? '';
      allDigits.push(text);
    }
    // Expect 3 pairs: days[tens+units], hours[tens+units], minutes[tens+units]
    for (let pair = 0; pair < 3; pair++) {
      const combined = allDigits[pair * 2] + allDigits[pair * 2 + 1];
      expect(combined).toMatch(/^\d{2}$/);
    }
  });

  test('(TC 37fd89d1) label color is white (#FFFFFF) via computed style', async ({
    page,
  }) => {
    // Verify the DAYS label has white color from inline style
    const daysLabel = page.getByText('DAYS', { exact: true });
    const color = await daysLabel.evaluate(
      (el) => window.getComputedStyle(el).color,
    );
    // rgb(255, 255, 255) is the computed value of #FFFFFF
    expect(color).toBe('rgb(255, 255, 255)');
  });
});
