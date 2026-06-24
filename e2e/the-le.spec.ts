import { test, expect } from '@playwright/test';
import { ROUTES } from './support/routes';

/**
 * E2E coverage — Thể lệ (SAA Rules) modal + FAB expanded menu on Homepage.
 * Public page — no auth required.
 *
 * Scenarios:
 *  (a) Click FAB pill → expanded menu shows "Thể lệ" + "Viết KUDOS" + cancel button
 *  (b) Click "Thể lệ" → rules dialog visible with title + Đóng/Viết KUDOS buttons
 *  (c) Click modal "Viết KUDOS" → Write Kudos modal opens; rules modal closes
 *  (d) Reopen rules, click "Đóng" → dialog closes
 *  (e) FAB cancel "Hủy" collapses the expanded menu
 */

// i18n strings used in assertions (VI default locale)
const VI = {
  widgetAria:       'Viết Kudos / Thể lệ SAA',
  widgetRulesLabel: 'Thể lệ',
  widgetWriteLabel: 'Viết KUDOS',
  widgetCancelAria: 'Đóng menu',
  modalAriaLabel:   'Thể lệ',
  modalTitle:       'Thể lệ',
  modalCloseBtn:    'Đóng',
  modalWriteBtn:    'Viết KUDOS',
  writeKudosDialog: 'Viết Kudo',
};

test.describe('Thể lệ modal + FAB — Homepage (public)', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  // (a) Click collapsed FAB pill → expanded menu appears
  test('(a) FAB pill expands to show Thể lệ, Viết KUDOS, and Hủy buttons', async ({ page }) => {
    await page.goto(ROUTES.HOME);

    // Collapsed pill is visible
    const pill = page.getByRole('button', { name: VI.widgetAria });
    await expect(pill).toBeVisible();

    // Click to expand
    await pill.click();

    // Expanded menu items appear
    await expect(page.getByRole('button', { name: VI.widgetRulesLabel })).toBeVisible();
    await expect(page.getByRole('button', { name: VI.widgetWriteLabel })).toBeVisible();
    await expect(page.getByRole('button', { name: VI.widgetCancelAria })).toBeVisible();

    // Collapsed pill is gone
    await expect(page.getByRole('button', { name: VI.widgetAria })).not.toBeVisible();
  });

  // (b) Click "Thể lệ" in expanded menu → rules dialog opens
  test('(b) Clicking Thể lệ button opens the rules dialog with title and action buttons', async ({ page }) => {
    await page.goto(ROUTES.HOME);

    await page.getByRole('button', { name: VI.widgetAria }).click();
    await page.getByRole('button', { name: VI.widgetRulesLabel }).click();

    // Dialog is visible
    const dialog = page.getByRole('dialog', { name: VI.modalAriaLabel });
    await expect(dialog).toBeVisible();

    // Title is rendered inside the dialog
    await expect(dialog.getByRole('heading', { name: VI.modalTitle })).toBeVisible();

    // Footer buttons present
    await expect(dialog.getByRole('button', { name: VI.modalCloseBtn })).toBeVisible();
    await expect(dialog.getByRole('button', { name: VI.modalWriteBtn })).toBeVisible();
  });

  // (c) Click "Viết KUDOS" inside the rules modal → Write Kudos dialog opens
  test('(c) Clicking Viết KUDOS in rules modal opens the Write Kudos modal', async ({ page }) => {
    await page.goto(ROUTES.HOME);

    await page.getByRole('button', { name: VI.widgetAria }).click();
    await page.getByRole('button', { name: VI.widgetRulesLabel }).click();

    const rulesDialog = page.getByRole('dialog', { name: VI.modalAriaLabel });
    await expect(rulesDialog).toBeVisible();

    // Click "Viết KUDOS" inside the rules dialog
    await rulesDialog.getByRole('button', { name: VI.modalWriteBtn }).click();

    // Rules dialog closes
    await expect(rulesDialog).not.toBeVisible();

    // Write Kudos modal opens
    await expect(page.getByRole('dialog', { name: VI.writeKudosDialog })).toBeVisible();
  });

  // (d) Reopen rules, click "Đóng" → dialog closes
  test('(d) Clicking Đóng closes the rules dialog', async ({ page }) => {
    await page.goto(ROUTES.HOME);

    await page.getByRole('button', { name: VI.widgetAria }).click();
    await page.getByRole('button', { name: VI.widgetRulesLabel }).click();

    const dialog = page.getByRole('dialog', { name: VI.modalAriaLabel });
    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', { name: VI.modalCloseBtn }).click();
    await expect(dialog).not.toBeVisible();
  });

  // (e) FAB cancel "Hủy" collapses the expanded menu back to pill
  test('(e) Clicking Hủy collapses the FAB expanded menu', async ({ page }) => {
    await page.goto(ROUTES.HOME);

    await page.getByRole('button', { name: VI.widgetAria }).click();

    // Expanded
    await expect(page.getByRole('button', { name: VI.widgetCancelAria })).toBeVisible();

    await page.getByRole('button', { name: VI.widgetCancelAria }).click();

    // Menu collapses — cancel button gone, pill back
    await expect(page.getByRole('button', { name: VI.widgetCancelAria })).not.toBeVisible();
    await expect(page.getByRole('button', { name: VI.widgetAria })).toBeVisible();
  });
});
