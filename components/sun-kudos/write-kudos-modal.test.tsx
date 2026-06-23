import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { WriteKudosModal, type WriteKudosFormValues } from "./write-kudos-modal";
import { mockUsers } from "./mock-users";
import { mockHashtags } from "./mock-data";
import messagesVi from "../../messages/vi.json";

const messages = { sunKudos: messagesVi.sunKudos };

beforeAll(() => {
  // jsdom lacks object-URL APIs used by the image uploader.
  global.URL.createObjectURL = vi.fn(() => "blob:mock");
  global.URL.revokeObjectURL = vi.fn();
  // jsdom doesn't define document.execCommand — provide a stub so toolbar tests can spy on it.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (document as any).execCommand = vi.fn(() => true);
});

function renderModal(overrides: Partial<React.ComponentProps<typeof WriteKudosModal>> = {}) {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();
  render(
    <NextIntlClientProvider locale="vi" messages={messages}>
      <WriteKudosModal
        open
        recipientOptions={mockUsers}
        hashtagOptions={mockHashtags}
        onSubmit={onSubmit}
        onCancel={onCancel}
        {...overrides}
      />
    </NextIntlClientProvider>,
  );
  return { onSubmit, onCancel };
}

function setContent(text: string) {
  const editor = screen.getByRole("textbox", { name: "Nội dung" });
  editor.textContent = text;
  fireEvent.input(editor);
  return editor;
}

async function selectRecipient(user: ReturnType<typeof userEvent.setup>, query = "Huỳnh") {
  const input = screen.getByLabelText("Người nhận");
  await user.type(input, query);
  const option = await screen.findByText(mockUsers[0].name);
  await user.click(option);
}

describe("WriteKudosModal", () => {
  it("does not render when closed", () => {
    renderModal({ open: false });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders title and required field labels", () => {
    renderModal();
    expect(screen.getByText("Gửi lời cám ơn và ghi nhận đến đồng đội")).toBeInTheDocument();
    expect(screen.getByText("Người nhận")).toBeInTheDocument();
    expect(screen.getByText("Danh hiệu")).toBeInTheDocument();
    // "Hashtag" appears as both the section label and the "+ Hashtag" button label.
    expect(screen.getAllByText("Hashtag").length).toBeGreaterThan(0);
  });

  it("disables submit until required fields are filled (TC ID-48)", () => {
    renderModal();
    expect(screen.getByRole("button", { name: "Gửi" })).toBeDisabled();
  });

  it("keeps submit disabled while any required field is missing (TC ID-56)", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderModal();
    // Fill everything EXCEPT the hashtag — submit must stay disabled.
    await selectRecipient(user);
    await user.type(screen.getByLabelText("Danh hiệu"), "Người hùng");
    setContent("Cảm ơn bạn!");
    expect(screen.getByRole("button", { name: "Gửi" })).toBeDisabled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("disables submit when content exceeds the 500-char limit (TC ID-48)", async () => {
    const user = userEvent.setup();
    renderModal();
    await selectRecipient(user);
    await user.type(screen.getByLabelText("Danh hiệu"), "Người hùng");
    await user.click(screen.getByText(mockHashtags[0].label));
    setContent("a".repeat(501));
    expect(screen.getByRole("button", { name: "Gửi" })).toBeDisabled();
  });

  it("deselects a recipient via the clear control (H-2)", async () => {
    const user = userEvent.setup();
    renderModal();
    await selectRecipient(user);
    expect(screen.getByLabelText("Người nhận")).toHaveValue(mockUsers[0].name);
    await user.click(screen.getByRole("button", { name: "Clear recipient" }));
    expect(screen.getByLabelText("Người nhận")).toHaveValue("");
  });

  it("clears the draft on cancel (H-1)", async () => {
    const user = userEvent.setup();
    const { onCancel } = renderModal();
    await user.type(screen.getByLabelText("Danh hiệu"), "Draft title");
    await user.click(screen.getByRole("button", { name: /Hủy/ }));
    expect(onCancel).toHaveBeenCalled();
    // Modal stays mounted in the test (open prop fixed) — fields must be reset.
    expect(screen.getByLabelText("Danh hiệu")).toHaveValue("");
  });

  it("selects a recipient via autocomplete (TC ID-8/26)", async () => {
    const user = userEvent.setup();
    renderModal();
    await selectRecipient(user);
    expect(screen.getByLabelText("Người nhận")).toHaveValue(mockUsers[0].name);
  });

  it("adds a hashtag from the option list and removes it (TC ID-34/36)", async () => {
    const user = userEvent.setup();
    renderModal();
    const tagLabel = mockHashtags[0].label;
    await user.click(screen.getByText(tagLabel)); // option in dropdown (visible in jsdom)
    // chip rendered with remove button
    const remove = screen.getByRole("button", { name: `Remove ${tagLabel}` });
    expect(remove).toBeInTheDocument();
    await user.click(remove);
    expect(screen.queryByRole("button", { name: `Remove ${tagLabel}` })).not.toBeInTheDocument();
  });

  it("creates a custom hashtag by typing (TC ID-34)", async () => {
    const user = userEvent.setup();
    renderModal();
    const draft = screen.getByLabelText("Nhập hashtag");
    await user.type(draft, "TeamWork{Enter}");
    expect(screen.getByRole("button", { name: "Remove #TeamWork" })).toBeInTheDocument();
  });

  it("blocks the 6th hashtag with a max message (TC ID-17/53)", async () => {
    const user = userEvent.setup();
    renderModal();
    const draft = screen.getByLabelText("Nhập hashtag");
    for (const tag of ["a", "b", "c", "d", "e"]) {
      await user.type(draft, `${tag}{Enter}`);
    }
    await user.type(draft, "f{Enter}");
    expect(screen.getByText(/Tối đa 5 hashtag/)).toBeInTheDocument();
  });

  it("uploads jpg images and rejects invalid types (TC ID-21/23)", async () => {
    const { container } = renderModalWithContainer();
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    // fireEvent.change bypasses the accept-attribute filter so we can exercise
    // the validation safety-net (a real browser also allows drag-drop of any type).
    const jpg = new File(["x"], "photo.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [jpg] } });
    expect(screen.getByAltText("photo.jpg")).toBeInTheDocument();

    const pdf = new File(["x"], "doc.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [pdf] } });
    expect(screen.getByText(/Định dạng file không hợp lệ/)).toBeInTheDocument();
  });

  it("reveals the anonymous name field when checked (TC ID-43/44)", async () => {
    const user = userEvent.setup();
    renderModal();
    expect(screen.queryByLabelText(/Tên hiển thị/)).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("Gửi lời cám ơn và ghi nhận ẩn danh"));
    expect(screen.getByLabelText(/Tên hiển thị/)).toBeInTheDocument();
    await user.click(screen.getByLabelText("Gửi lời cám ơn và ghi nhận ẩn danh"));
    expect(screen.queryByLabelText(/Tên hiển thị/)).not.toBeInTheDocument();
  });

  it("enables submit and submits mapped values when valid (TC ID-46/47)", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderModal();

    await selectRecipient(user);
    await user.type(screen.getByLabelText("Danh hiệu"), "Người hùng");
    setContent("Cảm ơn bạn rất nhiều!");
    await user.click(screen.getByText(mockHashtags[0].label));

    const submit = screen.getByRole("button", { name: "Gửi" });
    expect(submit).toBeEnabled();
    await user.click(submit);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const values = onSubmit.mock.calls[0][0] as WriteKudosFormValues;
    expect(values.recipient?.name).toBe(mockUsers[0].name);
    expect(values.awardTitle).toBe("Người hùng");
    expect(values.content).toContain("Cảm ơn bạn");
    expect(values.hashtags).toHaveLength(1);
  });

  it("calls onCancel from the Hủy button (TC ID-45)", async () => {
    const user = userEvent.setup();
    const { onCancel } = renderModal();
    await user.click(screen.getByRole("button", { name: /Hủy/ }));
    expect(onCancel).toHaveBeenCalled();
  });

  // ── New GUI tests (gaps) ──────────────────────────────────────────────────

  it("displays recipient input placeholder 'Tìm kiếm' (TC ID-4)", () => {
    renderModal();
    const input = screen.getByLabelText("Người nhận");
    expect(input).toHaveAttribute("placeholder", "Tìm kiếm");
  });

  it("shows content placeholder when empty (TC ID-5)", () => {
    renderModal();
    expect(screen.getByText(/Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!/)).toBeInTheDocument();
  });

  it("shows anonymous checkbox unchecked by default (TC ID-6)", () => {
    renderModal();
    const checkbox = screen.getByLabelText("Gửi lời cám ơn và ghi nhận ẩn danh");
    expect(checkbox).not.toBeChecked();
  });

  it("displays character counter starting at 0/500 (GUI char counter)", () => {
    renderModal();
    expect(screen.getByText(/0\/500/)).toBeInTheDocument();
  });

  // ── New hashtag tests (gaps) ──────────────────────────────────────────────

  it("adds 3 distinct hashtag chips, each with remove button (TC ID-35)", async () => {
    const user = userEvent.setup();
    renderModal();
    const tags = [mockHashtags[0].label, mockHashtags[1].label, mockHashtags[2].label];

    for (const tag of tags) {
      await user.click(screen.getByText(tag));
    }

    // Exactly 3 hashtag chips, each with its own "Remove <tag>" button.
    // (No images in this test, so only hashtag-chip remove buttons match.)
    const removeButtons = screen.getAllByRole("button", { name: /^Remove / });
    expect(removeButtons).toHaveLength(3);
  });

  it("keeps submit disabled with 0 hashtags even if other fields filled (TC ID-15)", async () => {
    const user = userEvent.setup();
    renderModal();
    // Fill all required fields EXCEPT hashtag
    await selectRecipient(user);
    await user.type(screen.getByLabelText("Danh hiệu"), "Người hùng");
    setContent("Cảm ơn bạn!");
    // Submit still disabled
    expect(screen.getByRole("button", { name: "Gửi" })).toBeDisabled();
  });

  // ── New image tests (gaps) ──────────────────────────────────────────────

  it("uploads png images and shows thumbnail (TC ID-22)", async () => {
    const { container } = renderModalWithContainer();
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    const png = new File(["x"], "photo.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [png] } });
    expect(screen.getByAltText("photo.png")).toBeInTheDocument();
  });

  it("rejects .txt files with error message (TC ID-24)", async () => {
    const { container } = renderModalWithContainer();
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    const txt = new File(["text"], "file.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [txt] } });
    expect(screen.getByText(/Định dạng file không hợp lệ/)).toBeInTheDocument();
  });

  it("rejects .mp4 files with error message (TC ID-55)", async () => {
    const { container } = renderModalWithContainer();
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    const mp4 = new File(["video"], "video.mp4", { type: "video/mp4" });
    fireEvent.change(fileInput, { target: { files: [mp4] } });
    expect(screen.getByText(/Định dạng file không hợp lệ/)).toBeInTheDocument();
  });

  it("hides the '+ Image' add button when 5 images uploaded (TC ID-19/38)", async () => {
    const { container } = renderModalWithContainer();
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    // The add button (a real <button aria-label="+ Image">) is present initially.
    expect(screen.getByRole("button", { name: "+ Image" })).toBeInTheDocument();

    for (let i = 0; i < 5; i++) {
      const jpg = new File(["x"], `photo${i}.jpg`, { type: "image/jpeg" });
      fireEvent.change(fileInput, { target: { files: [jpg] } });
    }

    expect(screen.getAllByRole("img").filter((img) => img.getAttribute("alt")?.includes("photo"))).toHaveLength(5);
    // At max, the add button is removed (TC ID-20: cannot add a 6th).
    expect(screen.queryByRole("button", { name: "+ Image" })).not.toBeInTheDocument();
  });

  it("re-shows the '+ Image' button after removing one of 5 images (TC ID-40)", async () => {
    const { container } = renderModalWithContainer();
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const user = userEvent.setup();

    for (let i = 0; i < 5; i++) {
      const jpg = new File(["x"], `photo${i}.jpg`, { type: "image/jpeg" });
      fireEvent.change(fileInput, { target: { files: [jpg] } });
    }
    expect(screen.queryByRole("button", { name: "+ Image" })).not.toBeInTheDocument();

    // Remove one image via its "Remove image" badge.
    const removeButtons = screen.getAllByRole("button", { name: /remove image/i });
    expect(removeButtons).toHaveLength(5);
    await user.click(removeButtons[0]);

    expect(screen.getAllByRole("img").filter((img) => img.getAttribute("alt")?.includes("photo"))).toHaveLength(4);
    // Below max, the add button reappears.
    expect(screen.getByRole("button", { name: "+ Image" })).toBeInTheDocument();
  });

  // ── New rich-text toolbar tests (gaps) ─────────────────────────────────
  // Each toolbar button must invoke document.execCommand with the right command id.
  // jsdom can't actually format text, so we spy on execCommand (real formatting is
  // covered by the e2e suite). @mention insertion is also deferred to e2e (jsdom's
  // Selection/caret handling inside contentEditable is unreliable).

  it.each([
    ["Bold", "bold", "TC ID-27"],
    ["Italic", "italic", "TC ID-28"],
    ["Strikethrough", "strikeThrough", "TC ID-29"],
    ["Numbered list", "insertOrderedList", "TC ID-30"],
    ["Quote", "formatBlock", "TC ID-32"],
  ])("toolbar %s button calls execCommand('%s') (%s)", async (label, command) => {
    const user = userEvent.setup();
    const execSpy = vi.spyOn(document, "execCommand").mockReturnValue(true);
    renderModal();
    await user.click(screen.getByRole("button", { name: new RegExp(label, "i") }));
    // The command id is the first execCommand arg (some commands pass no 3rd arg).
    expect(execSpy.mock.calls.map((c) => c[0])).toContain(command);
    execSpy.mockRestore();
  });

  it("toolbar Link button prompts for a URL then calls execCommand('createLink') (TC ID-31)", async () => {
    const user = userEvent.setup();
    const execSpy = vi.spyOn(document, "execCommand").mockReturnValue(true);
    const promptSpy = vi.spyOn(window, "prompt").mockReturnValue("https://example.com");
    renderModal();
    await user.click(screen.getByRole("button", { name: /link/i }));
    expect(promptSpy).toHaveBeenCalled();
    expect(execSpy).toHaveBeenCalledWith("createLink", false, "https://example.com");
    execSpy.mockRestore();
    promptSpy.mockRestore();
  });
});

// Variant that also returns the container for querying the hidden file input.
function renderModalWithContainer() {
  const result = render(
    <NextIntlClientProvider locale="vi" messages={messages}>
      <WriteKudosModal
        open
        recipientOptions={mockUsers}
        hashtagOptions={mockHashtags}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    </NextIntlClientProvider>,
  );
  void within;
  return result;
}
