import { test, expect } from '@playwright/test';
import { applyStubSession, ROUTES } from './support/routes';

/**
 * E2E coverage of the Award System (Hệ thống giải) page.
 * Route: /awards-information (VI, default locale), /en/awards-information (EN).
 * Auth-gated: proxy.ts redirects unauthenticated → /login.
 *
 * TC IDs map to the 15 MoMorph TCs (ID-0..ID-14) defined in
 * plans/260623-1516-e2e-homepage-awards-prelaunch/phase-03-award-system-e2e.md
 */

// i18n strings from messages/vi.json → awardSystem.*
const VI_CAPTION = 'Sun* Annual Awards 2025';
const VI_TITLE = 'Hệ thống giải thưởng SAA 2025';
const VI_KUDOS_CTA = 'Chi tiết';
const VI_KUDOS_TITLE = 'Sun* Kudos';

// Ordered section IDs from award-data.ts AWARDS array
const SECTION_IDS = [
  'top-talent',
  'top-project',
  'top-project-leader',
  'best-manager',
  'signature-2025-creator',
  'mvp',
] as const;

// Nav labels from messages/vi.json → awardSystem.nav.*
// (newlines are collapsed by the DOM to whitespace; match with regex)
const NAV_LABELS = [
  'Top Talent',
  'Top Project',
  'Top Project',   // Top Project\nLeader — matches substring
  'Best Manager',
  'Signature 2025', // Signature 2025 \nCreator
  'MVP',
];

// Badge image alt texts from award-data.ts
const BADGE_ALTS = [
  'Top Talent',
  'Top Project',
  'Top Project Leader',
  'Best Manager',
  'Signature 2025 - Creator',
  'MVP (Most Valuable Person)',
];

// ── Auth Guard ────────────────────────────────────────────────────────────────

test.describe('Awards Information — Auth Guard', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('unauthenticated user is redirected to /login (TC ID-1)', async ({ page }) => {
    await page.goto(ROUTES.AWARDS);
    await expect(page).toHaveURL(/\/login\?callbackUrl=/);
  });
});

// ── Authenticated helpers ─────────────────────────────────────────────────────

test.describe('Awards Information — Layout & GUI (authenticated, VI locale)', () => {
  test.beforeEach(async ({ context, page }) => {
    await applyStubSession(context);
    await page.goto(ROUTES.AWARDS);
  });

  test('authenticated user loads /awards-information successfully (TC ID-0)', async ({ page }) => {
    await expect(page).toHaveURL(/\/awards-information/);
    // Page is rendered (no blank/error page)
    await expect(page.locator('body')).toBeVisible();
  });

  // ID-2: navigation from another page is effectively the same as a direct
  // authed load (cross-page nav tested in homepage spec). Assert direct load here.
  test('direct authed navigation arrives at awards page (TC ID-2)', async ({ page }) => {
    await expect(page).toHaveURL(/\/awards-information/);
    await expect(page.getByText(VI_TITLE)).toBeVisible();
  });

  test('page structure: hero, left nav (desktop), 6 award blocks, kudos banner (TC ID-3)', async ({
    page,
  }) => {
    // Hero subtitle
    await expect(page.getByText(VI_CAPTION).first()).toBeVisible();
    // Left nav — hidden lg:block, visible at default desktop viewport
    await expect(page.locator('a[href="#top-talent"]').first()).toBeVisible();
    // 6 award blocks (each section id anchors)
    for (const id of SECTION_IDS) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
    // Kudos banner with "Chi tiết" CTA
    await expect(page.getByRole('link', { name: VI_KUDOS_CTA })).toBeVisible();
  });

  test('hero: caption "Sun* Annual Awards 2025" + main title "Hệ thống giải thưởng SAA 2025" (TC ID-4)', async ({
    page,
  }) => {
    await expect(page.getByText(VI_CAPTION).first()).toBeVisible();
    await expect(page.getByText(VI_TITLE)).toBeVisible();
  });

  test('left nav has exactly 6 items in correct order (TC ID-5)', async ({ page }) => {
    // Scope to the sticky left-nav container (hidden lg:block) so the count can't
    // be inflated by a future second nav surface (e.g. a mobile drawer).
    const nav = page.locator('div.sticky.hidden');
    const sectionAnchors = nav.locator(
      SECTION_IDS.map((id) => `a[href="#${id}"]`).join(', '),
    );
    await expect(sectionAnchors).toHaveCount(6);

    // Verify order: first anchor is top-talent, last is mvp
    await expect(sectionAnchors.nth(0)).toHaveAttribute('href', '#top-talent');
    await expect(sectionAnchors.nth(5)).toHaveAttribute('href', '#mvp');
  });

  test('all 6 award blocks render with section IDs present (TC ID-6)', async ({ page }) => {
    for (const id of SECTION_IDS) {
      const section = page.locator(`#${id}`);
      await expect(section).toBeAttached();
      // Each block should be visible (requires scroll — use toBeAttached for DOM presence;
      // scroll to first and last to confirm render)
    }
    // Scroll to mvp section to trigger lazy-render if any
    await page.locator('#mvp').scrollIntoViewIfNeeded();
    await expect(page.locator('#mvp')).toBeVisible();
  });

  test('each award block has a badge image with non-empty alt text (TC ID-7)', async ({ page }) => {
    for (const alt of BADGE_ALTS) {
      const img = page.getByAltText(alt);
      await expect(img.first()).toBeAttached();
    }
  });

  test('kudos banner shows "Sun* Kudos" image alt and "Chi tiết" link (TC ID-8)', async ({
    page,
  }) => {
    await expect(page.getByAltText(VI_KUDOS_TITLE)).toBeVisible();
    await expect(page.getByRole('link', { name: VI_KUDOS_CTA })).toBeVisible();
  });
});

// ── Nav Interactions ──────────────────────────────────────────────────────────

test.describe('Awards Information — Nav Interactions (authenticated, VI locale)', () => {
  test.beforeEach(async ({ context, page }) => {
    await applyStubSession(context);
    await page.goto(ROUTES.AWARDS);
  });

  test('clicking each of 6 nav items sets aria-current="location" + URL hash (TC ID-9)', async ({
    page,
  }) => {
    for (const id of SECTION_IDS) {
      const anchor = page.locator(`a[href="#${id}"]`).first();
      await anchor.click();
      // goToSection calls history.replaceState — toHaveURL auto-retries
      await expect(page).toHaveURL(new RegExp(`#${id}`));
      await expect(anchor).toHaveAttribute('aria-current', 'location');
    }
  });

  // TC ID-10: hover nav item → visual highlight is pure CSS (color/shadow change).
  // Asserting computed CSS in Playwright is fragile across headless/headed modes.
  // Verified: hovering does not throw a JS error. Visual diff deferred to design review.
  test('hovering a nav item does not cause a JS error (TC ID-10 — visual deferred)', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    const anchor = page.locator('a[href="#top-project"]').first();
    await anchor.hover();
    // Brief settle; no hard wait needed
    await page.waitForTimeout(100);

    expect(errors).toHaveLength(0);
  });

  test('active-state exclusivity: last clicked item is the only one with aria-current (TC ID-11)', async ({
    page,
  }) => {
    // Click Top Talent first
    await page.locator('a[href="#top-talent"]').first().click();
    await expect(page.locator('a[href="#top-talent"]').first()).toHaveAttribute(
      'aria-current',
      'location',
    );

    // Now click MVP
    await page.locator('a[href="#mvp"]').first().click();
    await expect(page).toHaveURL(/#mvp/);

    // Only MVP should be active
    await expect(page.locator('a[href="#mvp"]').first()).toHaveAttribute(
      'aria-current',
      'location',
    );
    // Top Talent must no longer be active
    await expect(page.locator('a[href="#top-talent"]').first()).not.toHaveAttribute(
      'aria-current',
      'location',
    );
  });

  test('"Chi tiết" kudos link navigates to /sun-kudos (TC ID-12)', async ({ page }) => {
    const ctaLink = page.getByRole('link', { name: VI_KUDOS_CTA });
    await ctaLink.click();
    await expect(page).toHaveURL(/\/sun-kudos/);
  });

  test('navigating to an invalid section hash does not cause a JS console error (TC ID-13)', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    // Directly set an invalid hash — goToSection guards against unknown ids
    await page.evaluate(() => {
      window.location.hash = 'invalid-section-does-not-exist';
    });
    await page.waitForTimeout(200);

    expect(errors).toHaveLength(0);
    // Page should still be stable
    await expect(page.getByText(VI_TITLE)).toBeVisible();
  });

  /**
   * TC ID-14: network fault / 404 page handling.
   * Out of e2e scope — requires network-level interception to serve a 404 for the
   * awards route, which conflicts with the app's own error boundary behaviour.
   * Covered by: manual test + Next.js error-boundary unit test.
   */
  test.skip('TC ID-14 — failed nav / 404 handling (manual / covered-elsewhere)', () => {});
});

// ── Kudos Banner ─────────────────────────────────────────────────────────────

test.describe('Awards Information — Kudos Banner (authenticated)', () => {
  test.beforeEach(async ({ context, page }) => {
    await applyStubSession(context);
    await page.goto(ROUTES.AWARDS);
  });

  test('kudos banner "Chi tiết" navigates to /sun-kudos (TC ID-12 — banner describe)', async ({
    page,
  }) => {
    // Scroll down to the kudos block first (it is below the 6 award blocks)
    const cta = page.getByRole('link', { name: VI_KUDOS_CTA });
    await cta.scrollIntoViewIfNeeded();
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/sun-kudos/);
  });
});
