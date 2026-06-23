import { test, expect } from '@playwright/test';

// E2E coverage of the multi-language switcher (MoMorph screen hUyaaugye2,
// "Dropdown-ngôn ngữ"). Per design the dropdown offers VN/EN only.
// Exercised on the public /login route (no auth needed) — the switcher lives in
// the shared site header. Default locale is Vietnamese (vi, unprefixed).

const VI_WELCOME = 'Bắt đầu hành trình của bạn cùng SAA 2025.';
const EN_WELCOME = 'Begin your journey with SAA 2025.';

test.describe('Language switcher — multi-language', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('defaults to Vietnamese with Vietnamese copy (TC 5f1cbabd)', async ({
    page,
  }) => {
    await page.goto('/login');
    await expect(page.getByRole('button', { name: /vn/i })).toBeVisible();
    await expect(page.getByText(VI_WELCOME)).toBeVisible();
  });

  test('dropdown opens with exactly VN and EN options (TC 20d87e28)', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /vn/i }).click();

    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible();
    await expect(page.getByRole('option')).toHaveCount(2);
    await expect(page.getByRole('option', { name: /vn/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /en/i })).toBeVisible();
  });

  test('selecting EN switches locale, URL and interface copy', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /vn/i }).click();
    await page.getByRole('option', { name: /en/i }).click();

    // URL gains the /en prefix and the UI re-renders in English.
    await expect(page).toHaveURL(/\/en\/login$/);
    await expect(page.getByText(EN_WELCOME)).toBeVisible();
    // Scope to the header — bare /en/i also matches the Next.js Dev Tools button
    // ("OpEN NExt.js Dev Tools"), which mounts asynchronously and causes a flaky
    // strict-mode collision once it appears.
    await expect(
      page.getByRole('banner').getByRole('button', { name: /en/i }),
    ).toBeVisible();
  });

  test('selecting VN from English returns to the default (unprefixed) locale', async ({
    page,
  }) => {
    await page.goto('/en/login');
    await expect(page.getByText(EN_WELCOME)).toBeVisible();

    await page.getByRole('banner').getByRole('button', { name: /en/i }).click();
    await page.getByRole('option', { name: /vn/i }).click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page).not.toHaveURL(/\/en\//);
    await expect(page.getByText(VI_WELCOME)).toBeVisible();
  });

  test('dropdown closes on outside click', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /vn/i }).click();
    await expect(page.getByRole('listbox')).toBeVisible();

    // Click a neutral area away from the dropdown.
    await page.mouse.click(5, 5);
    await expect(page.getByRole('listbox')).toBeHidden();
  });

  test('clicking the trigger button again closes the dropdown (regression)', async ({
    page,
  }) => {
    await page.goto('/login');
    const btn = page.getByRole('button', { name: /vn/i });
    await btn.click();
    await expect(page.getByRole('listbox')).toBeVisible();
    await btn.click();
    await expect(page.getByRole('listbox')).toBeHidden();
  });

  test('dropdown closes on Escape', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /vn/i }).click();
    await expect(page.getByRole('listbox')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('listbox')).toBeHidden();
  });
});
