"use client";

// Client-side state for the Sun* Kudos Live Board.
// Holds the kudos feed (seeded from mock data) + the Write-Kudo modal open state.
// No backend: a submitted kudos is optimistically prepended to the feed.

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { Kudos, KudosUser } from "./types";
import { mockKudos } from "./mock-data";
import { mockUsers } from "./mock-users";

// Current signed-in Sunner fixture (no auth-user wiring in this mock app).
export const currentUser: KudosUser = mockUsers[5]; // Đặng Thị Ngọc Ánh

// Placeholder identity shown when a kudos is sent anonymously.
const anonymousUser: KudosUser = {
  id: "anonymous",
  name: "Ẩn danh",
  avatarUrl: "/shared/user-profile.svg",
  department: "",
  stars: 0,
  badge: "",
};

/** Fields the Write-Kudo form supplies; the provider fills the rest. */
export interface NewKudosInput {
  receiver: KudosUser;
  awardTitle: string;
  contentVi: string;
  hashtags: string[];
  imageUrls: string[];
  anonymous?: boolean;
  anonymousName?: string;
}

interface KudosBoardValue {
  kudos: Kudos[];
  addKudos: (input: NewKudosInput) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const KudosBoardContext = createContext<KudosBoardValue | null>(null);

// "HH:mm - M/D/YYYY" to match the existing mock postedAt format.
function formatPostedAt(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm} - ${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

export function KudosBoardProvider({ children }: { children: ReactNode }) {
  const [kudos, setKudos] = useState<Kudos[]>(mockKudos);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const addKudos = useCallback(
    (input: NewKudosInput) => {
      const sender: KudosUser =
        input.anonymous
          ? { ...anonymousUser, name: input.anonymousName?.trim() || anonymousUser.name }
          : currentUser;

      const next: Kudos = {
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? `new-${crypto.randomUUID()}`
            : `new-${Date.now()}-${Math.round(performance.now())}`,
        sender,
        receiver: input.receiver,
        awardTitle: input.awardTitle.trim(),
        contentVi: input.contentVi,
        hashtags: input.hashtags,
        imageUrls: input.imageUrls,
        likeCount: 0,
        likedByMe: false,
        isOwn: !input.anonymous,
        postedAt: formatPostedAt(new Date()),
        anonymous: input.anonymous,
        anonymousName: input.anonymousName?.trim() || undefined,
      };
      setKudos((prev) => [next, ...prev]);
    },
    [],
  );

  const value = useMemo(
    () => ({ kudos, addKudos, isModalOpen, openModal, closeModal }),
    [kudos, addKudos, isModalOpen, openModal, closeModal],
  );

  return (
    <KudosBoardContext.Provider value={value}>
      {children}
    </KudosBoardContext.Provider>
  );
}

/** Access board state. Falls back to read-only mock data outside a provider. */
export function useKudosBoard(): KudosBoardValue {
  const ctx = useContext(KudosBoardContext);
  if (ctx) return ctx;
  return {
    kudos: mockKudos,
    addKudos: () => {},
    isModalOpen: false,
    openModal: () => {},
    closeModal: () => {},
  };
}
