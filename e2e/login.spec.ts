import { test, expect } from '@playwright/test';
import { applyStubSession } from './auth-stub';

// E2E coverage of the MoMorph Login screen (GzbNeVGJHz).
// Auth is stubbed (no real Google OAuth) per project decision.

test.describe('Login screen — unauthenticated', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('renders header, hero, login button and footer (TC 5fbe2a18, 42b82364, 6ae76d15, 33a1dacf)', async ({
    page,
  }) => {
    await page.goto('/login');

    // Header logo + ROOT FURTHER key visual present
    await expect(page.getByAltText('SAA 2025').first()).toBeVisible();
    await expect(page.getByAltText('Root Further')).toBeVisible();

    // Hero welcome description
    await expect(
      page.getByText('Bắt đầu hành trình của bạn cùng SAA 2025.'),
    ).toBeVisible();

    // Google login button
    await expect(
      page.getByRole('button', { name: /login with google/i }),
    ).toBeVisible();

    // Footer copyright
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('Sun*');
    await expect(footer).toContainText('2025');
  });

  test('positions logo left and language control right (TC b9805e65, 8415b629)', async ({
    page,
  }) => {
    await page.goto('/login');
    const logoBox = await page.getByAltText('SAA 2025').first().boundingBox();
    const langBox = await page
      .getByRole('button', { name: /vn/i })
      .boundingBox();
    expect(logoBox).not.toBeNull();
    expect(langBox).not.toBeNull();
    expect(logoBox!.x).toBeLessThan(langBox!.x);
  });

  test('language dropdown opens on click (TC 20d87e28, 4426635b)', async ({
    page,
  }) => {
    await page.goto('/login');
    const langBtn = page.getByRole('button', { name: /vn/i });
    await expect(langBtn).toHaveAttribute('aria-expanded', 'false');
    await langBtn.click();
    await expect(langBtn).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('listbox')).toBeVisible();
    await expect(page.getByRole('option')).toHaveCount(2);
  });

  test('clicking Google login starts the auth flow (TC 60bc5bbb, e76aa170)', async ({
    page,
  }) => {
    // Block the outbound Google redirect so the page stays on the app.
    await page.route(/accounts\.google\.com/, (route) => route.abort());
    await page.goto('/login');

    const signinRequest = page.waitForRequest(/\/api\/auth\/signin\/google/, {
      timeout: 15_000,
    });
    await page.getByRole('button', { name: /login with google/i }).click();
    // Direct await — throws if the signin request never fires within the timeout.
    await signinRequest;
  });

  test('guarded route redirects unauthenticated users to /login (TC 45278c06)', async ({
    page,
  }) => {
    await page.goto('/awards-information');
    await expect(page).toHaveURL(/\/login\?callbackUrl=/);
  });
});

test.describe('Login screen — authenticated', () => {
  test('authenticated user is redirected away from /login (TC f62b0c97, 45278c06)', async ({
    context,
    page,
  }) => {
    await applyStubSession(context);
    await page.goto('/login');
    // Middleware redirects authed users on /login to the homepage.
    await expect(page).not.toHaveURL(/\/login/);
  });
});
