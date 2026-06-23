"use client";

// mm:520:11647 — Viết KUDO modal (componentId: 520:10673)
// Cream/ivory dialog centered on dark overlay.
// Container: width 752px | padding 40px | gap 32px | border-radius 24px
//   bg rgba(255,248,225,1) — cream/ivory
// Sections top→bottom:
//   A — Title "Gửi lời cám ơn và ghi nhận đến đồng đội" (Montserrat 700 32px #00101A centered)
//   B — Recipient select row
//   Frame 552 — Danh hiệu (award title) field + helper text
//   C+D — Rich-text toolbar + textarea (content entry)
//   E — Hashtag picker row
//   F — Image uploader row
//   G — Anonymous checkbox
//   H — Footer action bar (Hủy / Gửi)

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { KudosUser, Hashtag } from "./types";
import { RecipientSelect } from "./write-kudos-recipient-select";
import { AwardTitleField } from "./write-kudos-award-title-field";
import { RichTextArea } from "./write-kudos-rich-text-area";
import { HashtagPicker } from "./write-kudos-hashtag-picker";
import { ImageUploader, ACCEPTED_IMAGE_TYPES } from "./write-kudos-image-uploader";
import { AnonymousCheckbox } from "./write-kudos-anonymous-checkbox";
import { ModalFooter } from "./write-kudos-modal-footer";

const MAX_HASHTAGS = 5;
const MAX_IMAGES = 5;
const MAX_CONTENT = 500;

// ── Public prop interfaces ─────────────────────────────────────────────────

export interface WriteKudosFormValues {
  recipient: KudosUser | null;
  awardTitle: string;
  /** Plain-text content for the board (compose-time formatting is not persisted). */
  content: string;
  hashtags: Hashtag[];
  /** URLs of attached images */
  imageUrls: string[];
  isAnonymous: boolean;
  /** Optional display name supplied when sending anonymously. */
  anonymousName?: string;
}

export interface WriteKudosModalProps {
  /** Modal open state */
  open: boolean;
  /** Available recipient options (pass mockUsers or real API data) */
  recipientOptions: KudosUser[];
  /** Available hashtag options (pass mockHashtags or real API data) */
  hashtagOptions: Hashtag[];
  /** Sample/initial images to pre-populate (from design mock) */
  initialImages?: { id: string; url: string; alt?: string }[];
  /** Whether the submit action is in-flight */
  isSubmitting?: boolean;
  /** Called when user clicks Hủy or the backdrop */
  onCancel: () => void;
  /** Called when user clicks Gửi with all form values */
  onSubmit: (values: WriteKudosFormValues) => void;
}

// ── Internal image state shape ─────────────────────────────────────────────

interface ImageFile {
  id: string;
  url: string;
  alt?: string;
}

// ── Backdrop overlay ───────────────────────────────────────────────────────

function Backdrop({ onClick }: { onClick: () => void }) {
  return (
    // Dark semi-transparent overlay behind the modal (mm:520:11646 Mask)
    <div
      aria-hidden="true"
      onClick={onClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 16, 26, 0.72)",
        zIndex: 40,
      }}
    />
  );
}

// ── Main modal ─────────────────────────────────────────────────────────────

export function WriteKudosModal({
  open,
  recipientOptions,
  hashtagOptions,
  initialImages = [],
  isSubmitting = false,
  onCancel,
  onSubmit,
}: WriteKudosModalProps) {
  const t = useTranslations("sunKudos.writeModal");

  // ── Form state ─────────────────────────────────────────────────────────
  const [recipient, setRecipient] = useState<KudosUser | null>(null);
  const [recipientSearch, setRecipientSearch] = useState("");
  const [awardTitle, setAwardTitle] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [contentText, setContentText] = useState("");
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [images, setImages] = useState<ImageFile[]>(initialImages);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [anonymousName, setAnonymousName] = useState("");

  // ── Validation / field errors ────────────────────────────────────────────
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [hashtagMaxError, setHashtagMaxError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // ── Focus management (a11y): autofocus on open, restore on close ──────────
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement | null;
    const first = dialogRef.current?.querySelector<HTMLElement>(
      'input, [contenteditable="true"], button',
    );
    first?.focus();
    return () => lastFocused.current?.focus?.();
  }, [open]);

  if (!open) return null;

  // ── Handlers ───────────────────────────────────────────────────────────

  // Clears all fields; revokes attached blob URLs only when discarding (cancel),
  // not on submit — the feed takes ownership of submitted image URLs.
  function clearFields(revokeImages: boolean) {
    if (revokeImages) {
      images.forEach((i) => i.url.startsWith("blob:") && URL.revokeObjectURL(i.url));
    }
    setRecipient(null);
    setRecipientSearch("");
    setAwardTitle("");
    setContentHtml("");
    setContentText("");
    setHashtags([]);
    setImages([]);
    setIsAnonymous(false);
    setAnonymousName("");
    setErrors({});
    setHashtagMaxError(null);
    setImageError(null);
  }

  function handleCancel() {
    clearFields(true);
    onCancel();
  }

  // Focus trap + Escape (a11y): keep Tab within the dialog, Esc discards.
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      handleCancel();
      return;
    }
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'input, [contenteditable="true"], button, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute("disabled"));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function handleAddHashtag(tag: Hashtag) {
    if (hashtags.length >= MAX_HASHTAGS) {
      setHashtagMaxError(t("hashtagMaxReached", { max: MAX_HASHTAGS }));
      return;
    }
    setHashtagMaxError(null);
    setHashtags((prev) =>
      prev.find((h) => h.id === tag.id) ? prev : [...prev, tag],
    );
    setErrors((e) => ({ ...e, hashtags: undefined }));
  }

  function handleRemoveHashtag(id: string) {
    setHashtags((prev) => prev.filter((h) => h.id !== id));
    setHashtagMaxError(null);
  }

  function handleRemoveImage(id: string) {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.url.startsWith("blob:")) URL.revokeObjectURL(target.url);
      return prev.filter((img) => img.id !== id);
    });
    setImageError(null);
  }

  function handleAddFiles(files: File[]) {
    const valid = files.filter((f) => ACCEPTED_IMAGE_TYPES.includes(f.type));
    const rejected = valid.length < files.length;
    setImages((prev) => {
      let next = prev;
      for (const f of valid) {
        if (next.length >= MAX_IMAGES) break;
        next = [
          ...next,
          { id: `img-${Date.now()}-${next.length}`, url: URL.createObjectURL(f), alt: f.name },
        ];
      }
      return next;
    });
    setImageError(rejected ? t("errorImageType") : null);
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!recipient) next.recipient = t("errorRecipientRequired");
    if (!awardTitle.trim()) next.awardTitle = t("errorAwardTitleRequired");
    if (!contentText.trim()) next.content = t("errorContentRequired");
    if (hashtags.length === 0) next.hashtags = t("errorHashtagRequired");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit({
      recipient,
      awardTitle,
      content: contentText,
      hashtags,
      imageUrls: images.map((img) => img.url),
      isAnonymous,
      anonymousName: isAnonymous ? anonymousName.trim() || undefined : undefined,
    });
    // Clear the draft (don't revoke blobs — the feed now owns those URLs).
    clearFields(false);
  }

  const submitDisabled =
    !recipient ||
    !awardTitle.trim() ||
    !contentText.trim() ||
    contentText.trim().length > MAX_CONTENT ||
    hashtags.length === 0;

  return (
    <>
      {/* ── Backdrop ────────────────────────────────────────────────────── */}
      <Backdrop onClick={handleCancel} />

      {/* ── Modal dialog ────────────────────────────────────────────────── */}
      {/* mm:520:11647 — absolute center of viewport, z-50 above backdrop */}
      {/* width 752px | padding 40px | gap 32px | border-radius 24px */}
      {/* bg rgba(255,248,225,1) cream/ivory */}
      <style>{`
        .write-kudos-dialog {
          padding: 24px 32px;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .write-kudos-dialog {
            padding: 16px;
            gap: 14px;
          }
        }
      `}</style>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("dialogLabel")}
        className="write-kudos-dialog"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 50,
          width: "min(752px, calc(100vw - 32px))",
          maxHeight: "calc(100vh - 32px)",
          overflowY: "auto",
          borderRadius: 24,
          background: "rgba(255, 248, 225, 1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          boxSizing: "border-box",
        }}
        // Stop backdrop click propagating through the card
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* ── A — Title ──────────────────────────────────────────────────── */}
        {/* mm:I520:11647;520:9870 — "Gửi lời cám ơn và ghi nhận đến đồng đội" */}
        {/* Montserrat 700 32px lineHeight 40px letterSpacing 0px #00101A centered */}
        <h2
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 24,
            lineHeight: "30px",
            letterSpacing: 0,
            color: "rgba(0, 16, 26, 1)",
            textAlign: "center",
            width: "100%",
            margin: 0,
          }}
        >
          {t("title")}
        </h2>

        {/* ── B — Recipient select ─────────────────────────────────────── */}
        {/* mm:I520:11647;520:9871 — mms_B_Chọn người nhận */}
        <RecipientSelect
          value={recipient}
          searchText={recipientSearch}
          onSearchChange={setRecipientSearch}
          onSelect={(user) => {
            setRecipient(user);
            setErrors((e) => ({ ...e, recipient: undefined }));
          }}
          onClear={() => {
            setRecipient(null);
            setRecipientSearch("");
          }}
          options={recipientOptions}
          error={errors.recipient}
        />

        {/* ── Frame 552 — Danh hiệu (award title) ─────────────────────── */}
        {/* mm:I520:11647;1688:10448 — award title input + helper */}
        <AwardTitleField
          value={awardTitle}
          onChange={(v) => {
            setAwardTitle(v);
            setErrors((e) => ({ ...e, awardTitle: undefined }));
          }}
          error={errors.awardTitle}
        />

        {/* ── C+D — Rich-text toolbar + textarea ──────────────────────── */}
        {/* mm:I520:11647;520:9875 — Nhập kudo (toolbar + textarea + hint) */}
        <RichTextArea
          value={contentHtml}
          onChange={(html, text) => {
            setContentHtml(html);
            setContentText(text);
            setErrors((e) => ({ ...e, content: undefined }));
          }}
          mentionOptions={recipientOptions}
          error={errors.content}
        />

        {/* ── E — Hashtag picker ───────────────────────────────────────── */}
        {/* mm:I520:11647;520:9890 — mms_E_Frame 536 */}
        <HashtagPicker
          selected={hashtags}
          options={hashtagOptions}
          onAdd={handleAddHashtag}
          onRemove={handleRemoveHashtag}
          maxCount={MAX_HASHTAGS}
          error={errors.hashtags}
          maxReachedError={hashtagMaxError}
        />

        {/* ── F — Image uploader ───────────────────────────────────────── */}
        {/* mm:I520:11647;520:9896 — mms_F_Frame 537 */}
        <ImageUploader
          images={images}
          onRemove={handleRemoveImage}
          onAddFiles={handleAddFiles}
          maxCount={MAX_IMAGES}
          error={imageError ?? undefined}
        />

        {/* ── G — Anonymous checkbox + optional name field ─────────────── */}
        {/* mm:I520:11647;520:14099 — mms_G_Gửi ẩn danh (TC ID-43/44) */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
          <AnonymousCheckbox checked={isAnonymous} onChange={setIsAnonymous} />
          {isAnonymous && (
            <input
              type="text"
              value={anonymousName}
              onChange={(e) => setAnonymousName(e.target.value)}
              placeholder={t("anonymousNamePlaceholder")}
              aria-label={t("anonymousNamePlaceholder")}
              style={{
                width: "100%",
                border: "1px solid #998C5F",
                borderRadius: 8,
                background: "#FFF",
                padding: "12px 24px",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: "rgba(0, 16, 26, 1)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          )}
        </div>

        {/* ── H — Footer (Hủy / Gửi) ──────────────────────────────────── */}
        {/* mm:I520:11647;520:9905 — mms_H_Frame 538 */}
        <ModalFooter
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitDisabled={submitDisabled}
          isSubmitting={isSubmitting}
        />
      </div>
    </>
  );
}
