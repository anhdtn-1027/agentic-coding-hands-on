import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  KudosBoardProvider,
  useKudosBoard,
  type NewKudosInput,
} from "./kudos-board-provider";
import { mockKudos } from "./mock-data";
import { mockUsers } from "./mock-users";

const sampleInput: NewKudosInput = {
  receiver: mockUsers[0],
  awardTitle: "Người hùng thầm lặng",
  contentVi: "Cảm ơn bạn rất nhiều!",
  hashtags: ["#Teamwork"],
  imageUrls: [],
};

function Harness({ input = sampleInput }: { input?: NewKudosInput }) {
  const { kudos, addKudos, isModalOpen, openModal, closeModal } = useKudosBoard();
  return (
    <div>
      <span data-testid="count">{kudos.length}</span>
      <span data-testid="first-award">{kudos[0]?.awardTitle}</span>
      <span data-testid="first-sender">{kudos[0]?.sender.name}</span>
      <span data-testid="modal-open">{String(isModalOpen)}</span>
      <button onClick={() => addKudos(input)}>add</button>
      <button onClick={openModal}>open</button>
      <button onClick={closeModal}>close</button>
    </div>
  );
}

describe("KudosBoardProvider", () => {
  it("seeds the feed from mock data", () => {
    render(
      <KudosBoardProvider>
        <Harness />
      </KudosBoardProvider>,
    );
    expect(screen.getByTestId("count").textContent).toBe(String(mockKudos.length));
  });

  it("addKudos prepends a new kudos with the award title as heading", async () => {
    const user = userEvent.setup();
    render(
      <KudosBoardProvider>
        <Harness />
      </KudosBoardProvider>,
    );
    await user.click(screen.getByText("add"));
    expect(screen.getByTestId("count").textContent).toBe(String(mockKudos.length + 1));
    expect(screen.getByTestId("first-award").textContent).toBe("Người hùng thầm lặng");
  });

  it("uses an anonymous sender name when sent anonymously", async () => {
    const user = userEvent.setup();
    render(
      <KudosBoardProvider>
        <Harness input={{ ...sampleInput, anonymous: true, anonymousName: "Ẩn danh A" }} />
      </KudosBoardProvider>,
    );
    await user.click(screen.getByText("add"));
    expect(screen.getByTestId("first-sender").textContent).toBe("Ẩn danh A");
  });

  it("toggles modal open/close state", async () => {
    const user = userEvent.setup();
    render(
      <KudosBoardProvider>
        <Harness />
      </KudosBoardProvider>,
    );
    expect(screen.getByTestId("modal-open").textContent).toBe("false");
    await user.click(screen.getByText("open"));
    expect(screen.getByTestId("modal-open").textContent).toBe("true");
    await user.click(screen.getByText("close"));
    expect(screen.getByTestId("modal-open").textContent).toBe("false");
  });

  it("falls back to read-only mock data outside a provider", () => {
    render(<Harness />);
    expect(screen.getByTestId("count").textContent).toBe(String(mockKudos.length));
  });
});
