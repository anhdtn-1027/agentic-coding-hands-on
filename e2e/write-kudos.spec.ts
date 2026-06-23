import { test, expect } from "@playwright/test";
import { applyStubSession } from "./auth-stub";

/**
 * E2E coverage of the "Viết Kudo" (Write Kudos) modal (MoMorph screen ihQ26W78P2).
 * Flow: open from the Live Board input row → fill → submit → new card on the feed.
 */

const KUDOS_INPUT_PLACEHOLDER = "Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?";
const RECIPIENT_NAME = "Huỳnh Dương Xuân Nhật";
const AWARD_TITLE = "Người truyền cảm hứng E2E";

test.describe("Write Kudo modal", () => {
  test.beforeEach(async ({ context }) => {
    await applyStubSession(context);
  });

  test("opens from the input row and blocks submit until valid (TC ID-0/48)", async ({ page }) => {
    await page.goto("/sun-kudos");
    await page.getByPlaceholder(KUDOS_INPUT_PLACEHOLDER).click();

    const dialog = page.getByRole("dialog", { name: "Viết Kudo" });
    await expect(dialog).toBeVisible();
    // Submit disabled with empty required fields.
    await expect(dialog.getByRole("button", { name: "Gửi" })).toBeDisabled();
  });

  test("submits a valid kudos and shows it at the top of the feed (TC ID-46)", async ({ page }) => {
    await page.goto("/sun-kudos");
    await page.getByPlaceholder(KUDOS_INPUT_PLACEHOLDER).click();
    const dialog = page.getByRole("dialog", { name: "Viết Kudo" });

    // Recipient
    await dialog.getByLabel("Người nhận").fill("Huỳnh");
    await page.getByRole("button", { name: new RegExp(RECIPIENT_NAME) }).click();

    // Award title (Danh hiệu)
    await dialog.getByLabel("Danh hiệu").fill(AWARD_TITLE);

    // Content (contentEditable)
    const editor = dialog.getByRole("textbox", { name: "Nội dung" });
    await editor.click();
    await page.keyboard.type("Cảm ơn bạn rất nhiều vì đã hỗ trợ team!");

    // Hashtag — focus the add control to reveal the dropdown, pick one
    await dialog.getByRole("button", { name: "+ Hashtag" }).click();
    await dialog.getByRole("button", { name: "#Dedicated" }).click();

    const submit = dialog.getByRole("button", { name: "Gửi" });
    await expect(submit).toBeEnabled();
    await submit.click();

    // Modal closes and the new kudos appears as a heading in the feed.
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("heading", { name: AWARD_TITLE })).toBeVisible();
  });

  test("cancel discards the draft (TC ID-45)", async ({ page }) => {
    await page.goto("/sun-kudos");
    await page.getByPlaceholder(KUDOS_INPUT_PLACEHOLDER).click();
    const dialog = page.getByRole("dialog", { name: "Viết Kudo" });

    await dialog.getByLabel("Danh hiệu").fill("Should not persist");
    await dialog.getByRole("button", { name: /Hủy/ }).click();

    await expect(dialog).toBeHidden();
    await expect(page.getByRole("heading", { name: "Should not persist" })).toHaveCount(0);
  });

  test("unauthenticated user is redirected to /login (TC ID-1)", async ({ context }) => {
    // Clear cookies to simulate unauthenticated state
    await context.clearCookies();

    const page = await context.newPage();
    await page.goto("/sun-kudos");

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
    await page.close();
  });

  test("bold formatting applies bold styling with execCommand (TC ID-27)", async ({ page }) => {
    await page.goto("/sun-kudos");
    await page.getByPlaceholder(KUDOS_INPUT_PLACEHOLDER).click();
    const dialog = page.getByRole("dialog", { name: "Viết Kudo" });

    const editor = dialog.getByRole("textbox", { name: "Nội dung" });
    await editor.click();
    await page.keyboard.type("formatme");

    // Select all text
    await page.keyboard.press("Control+A");

    const before = await editor.innerHTML();
    // Click bold button
    await dialog.getByRole("button", { name: /bold|tô đậm/i }).click();

    // Real execCommand('bold') injects bold markup. NOTE: the editor's base font-weight
    // is 700, so toggling can emit `font-weight: normal` rather than <b> — either way a
    // font-weight declaration / wrapper appears. Content is "formatme" (no trigger words).
    const after = await editor.innerHTML();
    expect(after).not.toBe(before);
    const hasBoldMarkup =
      /font-weight/i.test(after) || /<(b|strong|span)[\s>]/i.test(after);
    expect(hasBoldMarkup).toBe(true);
  });

  test("italic formatting applies italic styling with execCommand (TC ID-28)", async ({ page }) => {
    await page.goto("/sun-kudos");
    await page.getByPlaceholder(KUDOS_INPUT_PLACEHOLDER).click();
    const dialog = page.getByRole("dialog", { name: "Viết Kudo" });

    const editor = dialog.getByRole("textbox", { name: "Nội dung" });
    await editor.click();
    await page.keyboard.type("formatme");

    // Select all text
    await page.keyboard.press("Control+A");

    // Click italic button
    await dialog.getByRole("button", { name: /italic|nghiêng/i }).click();

    // Real execCommand('italic') wraps the selection in <i>/<em> or font-style markup.
    const editorContent = await editor.innerHTML();
    const hasItalicFormatting =
      /<(i|em)[\s>]/i.test(editorContent) || /font-style:\s*italic/i.test(editorContent);
    expect(hasItalicFormatting).toBe(true);
  });

  test("adds 5 hashtags and blocks the 6th with max message (TC ID-16/17/53)", async ({
    page,
  }) => {
    await page.goto("/sun-kudos");
    await page.getByPlaceholder(KUDOS_INPUT_PLACEHOLDER).click();
    const dialog = page.getByRole("dialog", { name: "Viết Kudo" });

    // Open hashtag dropdown
    await dialog.getByRole("button", { name: "+ Hashtag" }).click();

    // Add 5 hashtags
    const hashtagInput = dialog.getByPlaceholder(/nhập hashtag/i);
    for (let i = 1; i <= 5; i++) {
      await hashtagInput.fill(`tag${i}`);
      await page.keyboard.press("Enter");
    }

    // Try to add a 6th — max message should appear
    await hashtagInput.fill("tag6");
    await page.keyboard.press("Enter");

    await expect(page.getByText(/tối đa 5 hashtag/i)).toBeVisible();
  });

  test("uploads 5 images and hides '+ Image' button (TC ID-19/20)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1100 });
    await page.goto("/sun-kudos");
    await page.getByPlaceholder(KUDOS_INPUT_PLACEHOLDER).click();
    const dialog = page.getByRole("dialog", { name: "Viết Kudo" });

    await expect(dialog.getByRole("button", { name: "+ Image" })).toBeVisible();

    // Minimal valid 1×1 PNG bytes.
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      "base64",
    );
    const files = Array.from({ length: 5 }, (_, i) => ({
      name: `photo${i}.png`,
      mimeType: "image/png",
      buffer: png,
    }));
    await dialog.locator('input[type="file"]').setInputFiles(files);

    // At 5 images the add button is removed (TC ID-20: cannot add a 6th).
    await expect(dialog.getByRole("button", { name: "+ Image" })).toHaveCount(0);
  });

  test("anonymous checkbox reveals name field and hides on uncheck (TC ID-43/44)", async ({
    page,
  }) => {
    await page.goto("/sun-kudos");
    await page.getByPlaceholder(KUDOS_INPUT_PLACEHOLDER).click();
    const dialog = page.getByRole("dialog", { name: "Viết Kudo" });

    // Checkbox not checked initially
    const anonCheckbox = dialog.getByLabel(/ẩn danh/i);
    await expect(anonCheckbox).not.toBeChecked();

    // Name field should not exist
    await expect(dialog.getByLabel(/tên hiển thị/i)).not.toBeVisible();

    // Check the anonymous checkbox
    await anonCheckbox.check();

    // Name field should appear
    await expect(dialog.getByLabel(/tên hiển thị/i)).toBeVisible();

    // Uncheck
    await anonCheckbox.uncheck();

    // Name field should disappear
    await expect(dialog.getByLabel(/tên hiển thị/i)).not.toBeVisible();
  });

  test("submits kudos anonymously with display name (TC ID-43)", async ({ page }) => {
    await page.goto("/sun-kudos");
    await page.getByPlaceholder(KUDOS_INPUT_PLACEHOLDER).click();
    const dialog = page.getByRole("dialog", { name: "Viết Kudo" });

    // Select recipient
    await dialog.getByLabel("Người nhận").fill("Huỳnh");
    await page.getByRole("button", { name: new RegExp(RECIPIENT_NAME) }).click();

    // Fill award title
    await dialog.getByLabel("Danh hiệu").fill("Secret Hero");

    // Fill content
    const editor = dialog.getByRole("textbox", { name: "Nội dung" });
    await editor.click();
    await page.keyboard.type("Great work in secret!");

    // Add hashtag
    await dialog.getByRole("button", { name: "+ Hashtag" }).click();
    await dialog.getByRole("button", { name: "#Dedicated" }).click();

    // Check anonymous
    await dialog.getByLabel(/ẩn danh/i).check();

    // Fill anonymous name
    const anonNameField = dialog.getByLabel(/tên hiển thị/i);
    await anonNameField.fill("Mystery Sender");

    // Submit
    const submit = dialog.getByRole("button", { name: "Gửi" });
    await expect(submit).toBeEnabled();
    await submit.click();

    // Wait for dialog to close and the new card to appear
    await expect(dialog).toBeHidden({ timeout: 10000 });

    // The provider uses the supplied display name as the anonymous sender, so the
    // new card's sender must read "Mystery Sender" (not the real user name).
    await expect(page.getByText("Mystery Sender").first()).toBeVisible();
    await expect(page.getByText(RECIPIENT_NAME).first()).toBeVisible(); // recipient still shown
  });

  test("@ mention shows a dropdown and inserts the chosen name (TC ID-12/13/33)", async ({
    page,
  }) => {
    await page.goto("/sun-kudos");
    await page.getByPlaceholder(KUDOS_INPUT_PLACEHOLDER).click();
    const dialog = page.getByRole("dialog", { name: "Viết Kudo" });

    const editor = dialog.getByRole("textbox", { name: "Nội dung" });
    await editor.click();
    await page.keyboard.type("Cảm ơn @Huỳnh");

    // Mention dropdown lists the matching user; clicking inserts "@<name> ".
    const option = dialog.getByRole("button", { name: new RegExp(RECIPIENT_NAME) });
    await expect(option).toBeVisible();
    await option.click();

    await expect(editor).toContainText(`@${RECIPIENT_NAME}`);
  });
});
