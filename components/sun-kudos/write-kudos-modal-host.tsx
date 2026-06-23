"use client";

// Bridges the board provider state to the Write-Kudo modal.
// Mounted once inside KudosBoardProvider on the Live Board page.

import { WriteKudosModal, type WriteKudosFormValues } from "./write-kudos-modal";
import { useKudosBoard } from "./kudos-board-provider";
import { mockUsers } from "./mock-users";
import { mockHashtags } from "./mock-data";

export function WriteKudosModalHost() {
  const { isModalOpen, closeModal, addKudos } = useKudosBoard();

  function handleSubmit(values: WriteKudosFormValues) {
    if (!values.recipient) return;
    addKudos({
      receiver: values.recipient,
      awardTitle: values.awardTitle,
      contentVi: values.content,
      hashtags: values.hashtags.map((h) => h.label),
      imageUrls: values.imageUrls,
      anonymous: values.isAnonymous,
      anonymousName: values.anonymousName,
    });
    closeModal();
  }

  return (
    <WriteKudosModal
      open={isModalOpen}
      recipientOptions={mockUsers}
      hashtagOptions={mockHashtags}
      onCancel={closeModal}
      onSubmit={handleSubmit}
    />
  );
}
