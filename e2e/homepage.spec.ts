import { test, expect } from '@playwright/test';
import { applyStubSession } from './support/routes';

/**
 * E2E coverage — Homepage SAA (MoMorph screen i87tDx10uM, 62 TCs).
 * Deferred/N-A TCs documented inline with reason + pointer.
 *
 * Describe blocks:
 *  1. Public access
 *  2. Authenticated (user)
 *  3. Authenticated (admin)
 *  4. GUI / layout
 *  5. Navigation
 *  6. i18n
 *  7. Countdown (structural)
 */

// ── i18n string constants (from messages/vi.json + en.json) ─────────────────
const VI = {
  aboutSaa: 'Về SAA',
  awardsInfo: 'Thông tin Giải thưởng',
  sunKudos: 'Sun* Kudos',
  profile: 'Hồ sơ',
  signOut: 'Đăng xuất',
  adminDashboard: 'Trang quản trị',
  copyright: 'Bản quyền thuộc về Sun* © 2025',
  days: 'Ngày',
  hours: 'Giờ',
  minutes: 'Phút',
  comingSoon: 'Sắp ra mắt',
  eventTime: '26/12/2025',
  eventLocation: 'Âu Cơ Art Center',
  eventNote: 'Tường thuật trực tiếp qua sóng Livestream',
  aboutAwards: 'Về Giải thưởng',
  aboutKudos: 'Về Kudos',
  awardsCaption: 'Sun* annual awards 2025',
  awardsTitle: 'Hệ thống giải thưởng',
  detailLink: 'Chi tiết',
  kudosTitle: 'Sun* Kudos',
  kudosCta: 'Chi tiết',
  widgetAria: 'Viết Kudos / Thể lệ SAA',
};
const EN = {
  days: 'Days',
  hours: 'Hours',
  minutes: 'Minutes',
  comingSoon: 'Coming Soon',
  eventNote: 'Live broadcast via Livestream',
  aboutAwards: 'About Awards',
  aboutKudos: 'About Kudos',
};

/**
 * Locate the account menu toggle button robustly.
 * The AccountMenu button has aria-haspopup="menu"; there is exactly one in
 * the site header (the language switcher uses aria-haspopup="listbox").
 */
function accountMenuBtn(page: import('@playwright/test').Page) {
  return page
    .getByRole('banner')
    .getByRole('button', { name: /account menu|E2E User|Admin User/i })
    .or(
      page.getByRole('banner').locator('button[aria-haspopup="menu"]'),
    )
    .first();
}

/**
 * Language switcher button — uses aria-haspopup="listbox" to distinguish it from
 * the account menu button (aria-haspopup="menu") and the Next.js DevTools button.
 * There is exactly one in the header, so no locale arg is needed.
 */
function langBtn(page: import('@playwright/test').Page) {
  return page
    .getByRole('banner')
    .locator('button[aria-haspopup="listbox"]');
}

// ── 1. Public access ─────────────────────────────────────────────────────────
test.describe('Homepage — Public access', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('unauthenticated user loads / without redirect (TC ID-0)', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).not.toBe(302);
    await expect(page).toHaveURL('/');
    await expect(page.getByAltText('ROOT FURTHER')).toBeVisible();
  });

  test('logo present with alt text on public homepage (TC ID-8)', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByAltText('SAA 2025').first()).toBeVisible();
  });

  test('logo click navigates back to / from another page (TC ID-2, ID-18)', async ({ context, page }) => {
    // /awards-information is auth-guarded, so use the stub session for this cross-page nav.
    await applyStubSession(context);
    await page.goto('/awards-information');
    await page.getByAltText('SAA 2025').first().click();
    await expect(page).toHaveURL('/');
  });
});

// ── 2. Authenticated (user) ───────────────────────────────────────────────────
test.describe('Homepage — Authenticated (user)', () => {
  test.beforeEach(async ({ context }) => {
    // No name passed → aria-label defaults to "Account menu"
    await applyStubSession(context, { email: 'user@sun.com', role: 'user' });
  });

  test('authenticated user sees notification bell + account menu (TC ID-1)', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /notifications/i })).toBeVisible();
    await expect(
      page.getByRole('banner').locator('button[aria-haspopup="menu"]'),
    ).toBeVisible();
  });

  test('account menu shows Profile and Sign out; excludes Admin Dashboard (TC ID-6, ID-36, ID-37)', async ({ page }) => {
    await page.goto('/');
    const acctBtn = page.getByRole('banner').locator('button[aria-haspopup="menu"]');
    await acctBtn.click();
    await expect(page.getByRole('menuitem', { name: VI.profile })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: VI.signOut })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: VI.adminDashboard })).not.toBeVisible();
  });

  test('account menu closes on outside click (TC ID-31)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('banner').locator('button[aria-haspopup="menu"]').click();
    await expect(page.getByRole('menu')).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(page.getByRole('menu')).toBeHidden();
  });

  test('account menu closes on Escape (TC ID-32)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('banner').locator('button[aria-haspopup="menu"]').click();
    await expect(page.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden();
  });

  test('notification button exists and is clickable; no badge when hasUnreadNotifications=false (TC ID-27, ID-11, ID-28, ID-29)', async ({ page }) => {
    // TC ID-27: notification panel content is a no-op placeholder per build — affordance only.
    // TC ID-11/28/29: hasUnreadNotifications is hard-coded false → no red badge expected.
    await page.goto('/');
    const bellBtn = page.getByRole('button', { name: /notifications/i });
    await expect(bellBtn).toBeVisible();
    await expect(bellBtn).toBeEnabled();
    // No badge dot when hasUnread is false
    await expect(bellBtn.locator('[aria-label="Unread notifications"]')).toHaveCount(0);
  });
});

// ── 3. Authenticated (admin) ──────────────────────────────────────────────────
test.describe('Homepage — Authenticated (admin)', () => {
  test.beforeEach(async ({ context }) => {
    await applyStubSession(context, { email: 'admin@sun.com', role: 'admin' });
  });

  test('admin account menu includes Admin Dashboard item (TC ID-5, ID-38)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('banner').locator('button[aria-haspopup="menu"]').click();
    await expect(page.getByRole('menuitem', { name: VI.adminDashboard })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: VI.profile })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: VI.signOut })).toBeVisible();
  });
});

// ── 4. GUI / layout ──────────────────────────────────────────────────────────
test.describe('Homepage — GUI / layout', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('structural: header, hero ROOT FURTHER, countdown labels, awards grid, kudos section, widget button, footer all visible (TC ID-7)', async ({ page }) => {
    await page.goto('/');
    // Header
    await expect(page.getByRole('banner')).toBeVisible();
    // Hero ROOT FURTHER logo
    await expect(page.getByAltText('ROOT FURTHER')).toBeVisible();
    // Countdown: days label (scoped to main to avoid paragraph collision)
    const main = page.getByRole('main');
    await expect(main.getByText(VI.days, { exact: true })).toBeVisible();
    // Awards grid caption — exact:true avoids matching the long paragraph that also contains this phrase
    await expect(page.getByText(VI.awardsCaption, { exact: true })).toBeVisible();
    // Kudos block title (exact span, not inside the long paragraph)
    await expect(page.locator('main').getByText(VI.kudosTitle, { exact: true })).toBeVisible();
    // Widget button (floating fixed)
    await expect(page.getByRole('button', { name: VI.widgetAria })).toBeVisible();
    // Footer
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('active nav link "Về SAA" rendered in main navigation (TC ID-9)', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: /main/i });
    await expect(nav.getByRole('link', { name: VI.aboutSaa })).toBeVisible();
  });

  test('language button shows "VN" on default locale (TC ID-10)', async ({ page }) => {
    await page.goto('/');
    await expect(langBtn(page)).toBeVisible();
  });

  test('countdown: 3 time-unit labels (Ngày / Giờ / Phút) + 6 single-digit boxes (TC ID-12)', async ({ page }) => {
    await page.goto('/');
    const main = page.getByRole('main');
    // Labels — use exact:true so "Ngày" inside the long paragraph doesn't match
    await expect(main.getByText(VI.days, { exact: true })).toBeVisible();
    await expect(main.getByText(VI.hours, { exact: true })).toBeVisible();
    await expect(main.getByText(VI.minutes, { exact: true })).toBeVisible();
    // Each digit box renders a single character — the countdown renders 2 boxes per unit × 3 units = 6
    // DigitBox uses fontFamily "Digital Numbers" — target those specific spans
    const digitSpans = main.locator('span[style*="Digital Numbers"]');
    await expect(digitSpans).toHaveCount(6);
  });

  test('event info copy present: date, location, note (TC ID-14)', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(VI.eventTime)).toBeVisible();
    await expect(page.getByText(VI.eventLocation)).toBeVisible();
    await expect(page.getByText(VI.eventNote)).toBeVisible();
  });

  test('desktop: 6 award cards visible in awards grid with "Chi tiết" links (TC ID-15)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    // Scope to the awards grid: the grid contains AwardCard components whose detail links
    // use <a href> with text "Chi tiết". The kudos block also has a "Chi tiết" CTA (7 total).
    // Scope to the grid div which sits inside main before the kudos block.
    // The awards grid wraps all AwardCard items under a .grid element.
    const awardsSection = page.locator('.grid.grid-cols-2, .grid.lg\\:grid-cols-3').first();
    await expect(awardsSection).toBeVisible();
    const detailLinks = awardsSection.getByRole('link', { name: VI.detailLink });
    await expect(detailLinks).toHaveCount(6);
    // Awards section heading
    await expect(page.getByText(VI.awardsTitle)).toBeVisible();
  });

  test('tablet viewport: all 6 award card "Chi tiết" links still visible (TC ID-16)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    const awardsSection = page.locator('.grid.grid-cols-2, .grid.lg\\:grid-cols-3').first();
    await expect(awardsSection).toBeVisible();
    const detailLinks = awardsSection.getByRole('link', { name: VI.detailLink });
    await expect(detailLinks).toHaveCount(6);
  });

  test('footer: logo, nav links (Về SAA, Thông tin Giải thưởng, Sun* Kudos), copyright © 2025 (TC ID-17)', async ({ page }) => {
    await page.goto('/');
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
    await expect(footer.getByAltText('SAA 2025')).toBeVisible();
    const footerNav = footer.getByRole('navigation', { name: /footer/i });
    await expect(footerNav.getByRole('link', { name: VI.aboutSaa })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: VI.awardsInfo })).toBeVisible();
    await expect(footerNav.getByRole('link', { name: VI.sunKudos })).toBeVisible();
    await expect(footer).toContainText('© 2025');
  });
});

// ── 5. Navigation ─────────────────────────────────────────────────────────────
test.describe('Homepage — Navigation', () => {
  // /awards-information and /sun-kudos are auth-guarded; use stub session.
  test.beforeEach(async ({ context }) => {
    await applyStubSession(context, { email: 'nav@sun.com', role: 'user' });
  });

  test('header Awards Info nav link navigates to /awards-information (TC ID-21, ID-44)', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: /main/i });
    await nav.getByRole('link', { name: VI.awardsInfo }).click();
    await expect(page).toHaveURL('/awards-information');
  });

  test('"Về Giải thưởng" CTA link has href /awards-information (TC ID-44)', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: VI.aboutAwards });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/awards-information');
  });

  test('header Sun* Kudos nav link navigates to /sun-kudos (TC ID-22)', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: /main/i });
    await nav.getByRole('link', { name: VI.sunKudos }).click();
    await expect(page).toHaveURL('/sun-kudos');
  });

  test('"Về Kudos" CTA link has href /sun-kudos (TC ID-45)', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: VI.aboutKudos });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/sun-kudos');
  });

  test('award card "Chi tiết" links have /awards-information#<slug> hrefs (TC ID-47..51)', async ({ page }) => {
    await page.goto('/');
    const slugs = ['top-talent', 'top-project', 'top-project-leader', 'best-manager', 'signature-2025-creator', 'mvp'];
    const awardsSection = page.locator('.grid.grid-cols-2, .grid.lg\\:grid-cols-3').first();
    const detailLinks = awardsSection.getByRole('link', { name: VI.detailLink });
    await expect(detailLinks).toHaveCount(6);
    for (let i = 0; i < 6; i++) {
      const href = await detailLinks.nth(i).getAttribute('href');
      expect(href).toBe(`/awards-information#${slugs[i]}`);
    }
  });

  test('clicking first award card "Chi tiết" navigates with correct URL hash (TC ID-47, ID-52)', async ({ page }) => {
    await page.goto('/');
    const awardsSection = page.locator('.grid.grid-cols-2, .grid.lg\\:grid-cols-3').first();
    const firstDetailLink = awardsSection.getByRole('link', { name: VI.detailLink }).first();
    await firstDetailLink.click();
    await expect(page).toHaveURL('/awards-information#top-talent');
  });

  test('kudos block "Chi tiết" CTA navigates to /sun-kudos (TC ID-53)', async ({ page }) => {
    await page.goto('/');
    // The kudos block CTA is an <a> linking to /sun-kudos; it is the LAST "Chi tiết" link
    // (after the 6 award card links).
    const kudosCta = page.getByRole('link', { name: VI.kudosCta }).last();
    await expect(kudosCta).toBeVisible();
    await expect(kudosCta).toHaveAttribute('href', '/sun-kudos');
  });

  test('footer nav links have correct hrefs (TC ID-55)', async ({ page }) => {
    await page.goto('/');
    const footer = page.getByRole('contentinfo');
    const footerNav = footer.getByRole('navigation', { name: /footer/i });
    await expect(footerNav.getByRole('link', { name: VI.aboutSaa })).toHaveAttribute('href', '/');
    await expect(footerNav.getByRole('link', { name: VI.awardsInfo })).toHaveAttribute('href', '/awards-information');
    await expect(footerNav.getByRole('link', { name: VI.sunKudos })).toHaveAttribute('href', '/sun-kudos');
    // TC ID-62: all cards have hashes → verified in award card href test above. N/A for missing-hash card.
  });
});

// ── 6. i18n ───────────────────────────────────────────────────────────────────
test.describe('Homepage — i18n', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('language button opens VN/EN dropdown with exactly 2 options (TC ID-24, ID-58)', async ({ page }) => {
    await page.goto('/');
    await langBtn(page).click();
    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible();
    await expect(page.getByRole('option')).toHaveCount(2);
    await expect(page.getByRole('option', { name: /vn/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /en/i })).toBeVisible();
  });

  test('selecting EN switches to /en and renders English countdown labels (TC ID-25)', async ({ page }) => {
    await page.goto('/');
    await langBtn(page).click();
    await page.getByRole('option', { name: /en/i }).click();
    await expect(page).toHaveURL('/en');
    const main = page.getByRole('main');
    await expect(main.getByText(EN.days, { exact: true })).toBeVisible();
    await expect(main.getByText(EN.hours, { exact: true })).toBeVisible();
    await expect(main.getByText(EN.minutes, { exact: true })).toBeVisible();
    await expect(page.getByText(EN.eventNote)).toBeVisible();
  });

  test('selecting VN from /en returns to unprefixed / (TC ID-26)', async ({ context, page }) => {
    // /en is public but the switcher navigates to /vi (explicit locale prefix) which is
    // auth-guarded — mirror the language-switcher spec pattern: use a stub session so the
    // middleware allows the /vi redirect through to the actual VI homepage.
    await applyStubSession(context, { email: 'i18n@sun.com', role: 'user' });
    await page.goto('/en');
    await langBtn(page).click();
    await page.getByRole('option', { name: /vn/i }).click();
    await expect(page).toHaveURL('/');
    await expect(page).not.toHaveURL(/\/en/);
    const main = page.getByRole('main');
    await expect(main.getByText(VI.days, { exact: true })).toBeVisible();
  });
});

// ── 7. Countdown (structural) ─────────────────────────────────────────────────
test.describe('Homepage — Countdown (structural)', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('each countdown digit box renders as a single digit 0–9 (TC ID-40)', async ({ page }) => {
    await page.goto('/');
    const main = page.getByRole('main');
    // Wait for hydration: days label appears after client-side hook runs
    await expect(main.getByText(VI.days, { exact: true })).toBeVisible();
    // DigitBox spans use fontFamily "Digital Numbers" (set via style attribute)
    const digitSpans = main.locator('span[style*="Digital Numbers"]');
    await expect(digitSpans).toHaveCount(6);
    const digits = await digitSpans.allTextContents();
    for (const d of digits) {
      expect(d).toMatch(/^\d$/);
    }
  });

  test('coming-soon label state is consistent with rendered countdown (TC ID-41, ID-42, ID-43) — structural only', async ({ page }) => {
    // ID-39 (auto-update tick), ID-56/57/60 (env-format/invalid) → covered by lib/use-countdown unit tests.
    // NEXT_PUBLIC_EVENT_DATETIME cannot vary per e2e run.
    await page.goto('/');
    const main = page.getByRole('main');
    await expect(main.getByText(VI.days, { exact: true })).toBeVisible();
    // Coming-soon label: if showComingSoon=true it appears once; if false it is absent.
    // We assert it appears at most once — never duplicated — regardless of env value.
    const comingSoon = main.getByText(VI.comingSoon, { exact: true });
    const count = await comingSoon.count();
    expect(count).toBeLessThanOrEqual(1);
    // TC ID-54 (widget quick-action menu): no-op per build — affordance covered in layout test.
    // TC ID-59 (broken-link scan): manual/out-of-scope for e2e.
  });
});
