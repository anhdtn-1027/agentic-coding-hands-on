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
    expect(screen.getByText("Hashtag")).toBeInTheDocument();
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
