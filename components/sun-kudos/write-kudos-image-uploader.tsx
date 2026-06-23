"use client";

// mm:I520:11647;520:9896 — mms_F_Frame 537 (Image row)
// mms_F.1_Title: "Image" label Montserrat 700 22px #00101A (no *)
// 5 sample images: 80×80px, border 1px #998C5F, border-radius 18px, bg #FFF
//   Each has a red remove badge (20×20 circle bg #D4271D, top-right corner, white X icon 17×17)
//   Inner image: 80×80 border-radius 4px, border 1px #FFEA9E
// mms_F.5_Frame 542: "+ Image / Tối đa 5" add button
//   border 1px #998C5F, bg #FFF, padding 4px 8px, border-radius 8px, height 48px
//   text: 11px Montserrat 700 letterSpacing 0.5px #999

import { useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { IconCloseTiny, IconPlus } from "./write-kudos-icons";

interface ImageFile {
  id: string;
  url: string;
  alt?: string;
}

interface ImageUploaderProps {
  images: ImageFile[];
  onRemove: (id: string) => void;
  /** Called with the picked files; parent validates type + max + creates URLs. */
  onAddFiles: (files: File[]) => void;
  maxCount?: number;
  /** Validation message, e.g. invalid file type. */
  error?: string;
}

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

// mm:I520:11647;662:9197 — mms_F.2_Image (one image tile)
// outer: 80×80 border 1px #998C5F border-radius 18px bg #FFF relative
// badge (top-right): 20×20 circle bg #D4271D, icon close-tiny 17×17 white
// inner: 80×80 border-radius 4px, border 1px #FFEA9E
function ImageTile({
  image,
  onRemove,
}: {
  image: ImageFile;
  onRemove: () => void;
}) {
  return (
    <div
      className="relative"
      style={{
        width: 60,
        height: 60,
        border: "1px solid #998C5F",
        borderRadius: 14,
        background: "#FFF",
        flexShrink: 0,
      }}
    >
      {/* mm:I520:11647;662:9197;256:4717 — MM_MEDIA_Sample Image */}
      {/* 60×60 border-radius 4px, border 1px #FFEA9E */}
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 4,
          border: "1px solid #FFEA9E",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Image
          src={image.url}
          alt={image.alt ?? "Attached image"}
          fill
          style={{ objectFit: "cover" }}
          sizes="60px"
        />
      </div>

      {/* mm:I520:11647;662:9197;662:9287 — remove badge */}
      {/* 20×20 circle bg #D4271D top-right, slightly outside corner */}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove image"
        style={{
          position: "absolute",
          top: -6,
          right: -6,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "rgba(212, 39, 29, 1)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.43px",
          color: "#FFF",
          zIndex: 1,
        }}
      >
        {/* mm:MM_MEDIA_Close Tiny — 17×17 */}
        <IconCloseTiny size={17} />
      </button>
    </div>
  );
}

export function ImageUploader({
  images,
  onRemove,
  onAddFiles,
  maxCount = 5,
  error,
}: ImageUploaderProps) {
  const t = useTranslations("sunKudos.writeModal");
  const canAdd = images.length < maxCount;
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) onAddFiles(Array.from(e.target.files));
    // Reset so picking the same file again re-triggers change.
    e.target.value = "";
  }

  return (
    // mm:I520:11647;520:9896 — mms_F_Frame 537
    // gap 16px | flex-row | align-center | height 80px
    <div style={{ width: "100%" }}>
    <div
      className="flex flex-row items-center"
      style={{ gap: 16, width: "100%", minHeight: 60, flexWrap: "wrap" }}
    >
      {/* mm:mms_F.1_Title — "Image" label (no asterisk in design) */}
      <div
        className="flex flex-row items-center shrink-0"
        style={{ gap: 2 }}
      >
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 18,
            lineHeight: "24px",
            color: "rgba(0, 16, 26, 1)",
          }}
        >
          {t("imageLabel")}
        </span>
      </div>

      {/* Hidden file input — jpg/png only */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        onChange={handleFiles}
        style={{ display: "none" }}
        aria-label={t("imageAddBtn")}
      />

      {/* Image tiles — with remove badge */}
      {images.map((img) => (
        <ImageTile key={img.id} image={img} onRemove={() => onRemove(img.id)} />
      ))}

      {/* mm:I520:11647;662:9133 — mms_F.5_Frame 542 add button */}
      {/* border 1px #998C5F, bg #FFF, padding 4px 8px, border-radius 8px, height 48px */}
      {canAdd && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label={t("imageAddBtn")}
          className="flex items-center"
          style={{
            gap: 4,
            border: "1px solid #998C5F",
            borderRadius: 8,
            background: "#FFF",
            padding: "4px 8px",
            height: 40,
            cursor: "pointer",
            flexShrink: 0,
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255, 234, 158, 0.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#FFF";
          }}
        >
          {/* mm:I520:11647;662:9133;186:2759 — MM_MEDIA_Plus 24×24 */}
          <span style={{ color: "rgba(153, 153, 153, 1)" }}>
            <IconPlus size={24} />
          </span>
          {/* mm:I520:11647;662:9133;186:2760 — "Image\nTối đa 5" text */}
          {/* Montserrat 700 11px letterSpacing 0.5px #999 */}
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: 11,
              lineHeight: "16px",
              letterSpacing: "0.5px",
              color: "rgba(153, 153, 153, 1)",
              whiteSpace: "pre",
              textAlign: "left",
            }}
          >
            {`${t("imageLabel")}\n${t("imageMax", { max: maxCount })}`}
          </span>
        </button>
      )}
    </div>
      {error && (
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "rgba(207, 19, 34, 1)", marginTop: 6 }}>
          {error}
        </p>
      )}
    </div>
  );
}
