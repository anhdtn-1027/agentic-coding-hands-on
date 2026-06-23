"use client";

// mm:I520:11647;520:9905 — mms_H_Frame 538 (footer action bar)
// gap 24px | flex-row | align-items flex-start | width 672px | height 60px
//
// mms_H.1_Button — Cancel (Hủy):
//   border 1px #998C5F | bg rgba(255,234,158,0.10) | padding 16px 40px | border-radius 4px
//   Text "Hủy" + close icon (MM_MEDIA_Close 24×24), color dark (#00101A)
//   Flex-row align-center gap 8px | align-self stretch
//
// mms_H.2_Button — Submit (Gửi):
//   width 502px | height 60px | padding 16px | border-radius 8px
//   bg rgba(255,234,158,1) — primary yellow | gap 8px | flex-row align-center justify-center
//   Text "Gửi" + send icon (MM_MEDIA_Send 24×24), color dark (#00101A)

import { useTranslations } from "next-intl";
import { IconClose, IconSend } from "./write-kudos-icons";

interface ModalFooterProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitDisabled?: boolean;
  isSubmitting?: boolean;
}

export function ModalFooter({
  onCancel,
  onSubmit,
  submitDisabled = false,
  isSubmitting = false,
}: ModalFooterProps) {
  const t = useTranslations("sunKudos.writeModal");

  return (
    // mm:I520:11647;520:9905 — mms_H_Frame 538
    // gap 24px | flex-row | align-items flex-start | height 60px
    <div className="flex flex-row items-stretch" style={{ gap: 24, width: "100%" }}>
      {/* mm:mms_H.1_Button — Cancel */}
      {/* border 1px #998C5F | bg rgba(255,234,158,0.10) | padding 16px 40px | border-radius 4px */}
      <button
        type="button"
        onClick={onCancel}
        className="flex flex-row items-center px-5 sm:px-10"
        style={{
          gap: 8,
          border: "1px solid #998C5F",
          borderRadius: 4,
          background: "rgba(255, 234, 158, 0.10)",
          cursor: "pointer",
          color: "rgba(0, 16, 26, 1)",
          flexShrink: 0,
          transition: "background 0.2s ease",
          height: 48,
          paddingTop: 12,
          paddingBottom: 12,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(255, 234, 158, 0.18)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(255, 234, 158, 0.10)";
        }}
      >
        {/* mm:I520:11647;520:9906;186:2758 — Frame 483: text + close icon */}
        {/* gap 4px, text "Hủy" Montserrat 700 22px + icon 24×24 */}
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 18,
            lineHeight: "24px",
            color: "rgba(0, 16, 26, 1)",
          }}
        >
          {t("cancelBtn")}
        </span>
        {/* mm:MM_MEDIA_Close 24×24 */}
        <span style={{ color: "rgba(0, 16, 26, 1)" }}>
          <IconClose size={24} />
        </span>
      </button>

      {/* mm:mms_H.2_Button — Submit (Gửi) */}
      {/* width flex-1 (502px in design) | height 60px | padding 16px | border-radius 8px */}
      {/* bg rgba(255,234,158,1) primary yellow | gap 8px | justify-center */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={submitDisabled || isSubmitting}
        className="flex flex-row items-center justify-center"
        style={{
          flex: 1,
          height: 48,
          gap: 8,
          padding: 12,
          borderRadius: 8,
          background: submitDisabled || isSubmitting
            ? "rgba(255, 234, 158, 0.5)"
            : "rgba(255, 234, 158, 1)",
          border: "none",
          cursor: submitDisabled || isSubmitting ? "not-allowed" : "pointer",
          color: "rgba(0, 16, 26, 1)",
          transition: "background 0.2s ease, opacity 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (!submitDisabled && !isSubmitting) {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255, 240, 180, 1)";
          }
        }}
        onMouseLeave={(e) => {
          if (!submitDisabled && !isSubmitting) {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255, 234, 158, 1)";
          }
        }}
      >
        {/* mm:I520:11647;520:9907;186:1935 — Frame 483: text + send icon */}
        {/* gap 4px | text "Gửi" Montserrat 700 22px + icon 24×24 */}
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 18,
            lineHeight: "24px",
            color: "rgba(0, 16, 26, 1)",
          }}
        >
          {isSubmitting ? t("submittingBtn") : t("submitBtn")}
        </span>
        {/* mm:MM_MEDIA_Send 24×24 */}
        <span style={{ color: "rgba(0, 16, 26, 1)" }}>
          <IconSend size={24} />
        </span>
      </button>
    </div>
  );
}
