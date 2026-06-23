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
});
