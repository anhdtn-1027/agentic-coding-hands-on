"use client";

// mm:I520:11647;520:9890 — mms_E_Frame 536 (Hashtag row)
// mms_E.1_Title: "Hashtag" Montserrat 700 22px #00101A + * red
// mms_E.2_Tag Group: gap 8px flex-row align-center
//   "+ Hashtag" button: border 1px #998C5F, bg #FFF, padding 4px 8px, border-radius 8px
//   label: Montserrat 700 11px letterSpacing 0.5px color #999, "Hashtag\nTối đa 5"
// Chip: selected hashtag displayed inline, removable

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Hashtag } from "./types";
import { IconPlus, IconCloseTiny } from "./write-kudos-icons";

interface HashtagPickerProps {
  selected: Hashtag[];
  options: Hashtag[];
  onAdd: (hashtag: Hashtag) => void;
  onRemove: (id: string) => void;
  maxCount?: number;
  error?: string;
  /** Shown when the user tries to exceed maxCount. */
  maxReachedError?: string | null;
}

function toHashtag(raw: string): Hashtag | null {
  const label = raw.trim().replace(/^#+/, "");
  if (!label) return null;
  return { id: `custom-${label.toLowerCase()}`, label: `#${label}`, count: 0 };
}

// Hashtag chip — selected tag with remove button
function HashtagChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <div
      className="flex items-center"
      style={{
        gap: 4,
        padding: "4px 10px",
        border: "1px solid #998C5F",
        borderRadius: 8,
        background: "rgba(255, 234, 158, 0.15)",
        flexShrink: 0,
        height: 32,
      }}
    >
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: 14,
          lineHeight: "20px",
          color: "rgba(0, 16, 26, 1)",
        }}
      >
        {label}
      </span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          color: "rgba(153, 153, 153, 1)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconCloseTiny size={14} />
      </button>
    </div>
  );
}

export function HashtagPicker({
  selected,
  options,
  onAdd,
  onRemove,
  maxCount = 5,
  error,
  maxReachedError,
}: HashtagPickerProps) {
  const t = useTranslations("sunKudos.writeModal");
  const [draft, setDraft] = useState("");
  const available = options.filter((o) => !selected.find((s) => s.id === o.id));
  const canAdd = selected.length < maxCount;

  function commitDraft() {
    const tag = toHashtag(draft);
    if (tag && !selected.find((s) => s.id === tag.id)) {
      onAdd(tag);
      setDraft("");
    }
  }

  return (
    // mm:I520:11647;520:9890 — mms_E_Frame 536
    // gap 16px | flex-row | align-items flex-start | height 48px (shrinks to content); stacks on mobile
    <div
      className="flex flex-col sm:flex-row sm:items-start"
      style={{ gap: 16, width: "100%", minHeight: 48 }}
    >
      {/* mm:mms_E.1_Title — "Hashtag" label + * */}
      <div
        className="flex flex-row items-center shrink-0"
        style={{ gap: 2, paddingTop: 10 }}
      >
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 22,
            lineHeight: "28px",
            color: "rgba(0, 16, 26, 1)",
            whiteSpace: "nowrap",
          }}
        >
          {t("hashtagLabel")}
        </span>
        <span
          style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            lineHeight: "20px",
            color: "rgba(207, 19, 34, 1)",
          }}
        >
          *
        </span>
      </div>

      {/* mm:mms_E.2_Tag Group — chips + add button */}
      <div
        className="flex flex-row flex-wrap items-center"
        style={{ gap: 8, flex: 1 }}
      >
        {/* Selected chips */}
        {selected.map((tag) => (
          <HashtagChip
            key={tag.id}
            label={tag.label}
            onRemove={() => onRemove(tag.id)}
          />
        ))}

        {/* mm:I520:11647;662:8911 — "+ Hashtag" add button (stays visible per TC ID-16) */}
        {/* border 1px #998C5F, bg #FFF, padding 4px 8px, border-radius 8px, height 48px */}
        {(
          <div
            className="relative"
            style={{
              border: error ? "1px solid rgba(207, 19, 34, 1)" : "1px solid #998C5F",
              borderRadius: 8,
              background: "#FFF",
              padding: "4px 8px",
              height: 48,
              display: "flex",
              alignItems: "center",
              opacity: canAdd ? 1 : 0.6,
            }}
          >
            {/* mm:I520:11647;662:8911;186:2758 — Frame 483 */}
            {/* Inner row: plus icon 24×24 + text "Hashtag\nTối đa 5" 11px */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center"
                style={{
                  gap: 4,
                  background: "none",
                  border: "none",
                  cursor: canAdd ? "pointer" : "not-allowed",
                  padding: 0,
                  color: "rgba(153, 153, 153, 1)",
                  height: 38,
                }}
                aria-label={t("hashtagAddBtn")}
                disabled={!canAdd}
              >
                {/* mm:I520:11647;662:8911;186:2759 — MM_MEDIA_Plus icon */}
                <span style={{ color: "rgba(153, 153, 153, 1)" }}>
                  <IconPlus size={24} />
                </span>
                {/* mm:I520:11647;662:8911;186:2760 — "Hashtag\nTối đa 5" text */}
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
                  {`${t("hashtagLabel")}\n${t("hashtagMax", { max: maxCount })}`}
                </span>
              </button>

              {/* Dropdown: type-to-create input + available options */}
              <div
                className="absolute left-0 top-full mt-1 z-50 hidden group-focus-within:block"
                style={{
                  background: "#FFF",
                  border: "1px solid #998C5F",
                  borderRadius: 8,
                  minWidth: 200,
                  maxHeight: 240,
                  overflowY: "auto",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                }}
              >
                  {/* Type-to-create custom hashtag (TC ID-34: "chọn hoặc nhập") */}
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        commitDraft();
                      }
                    }}
                    placeholder={t("hashtagInputPlaceholder")}
                    aria-label={t("hashtagInputPlaceholder")}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "8px 16px",
                      border: "none",
                      borderBottom: "1px solid #EEE",
                      outline: "none",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      fontSize: 14,
                      color: "rgba(0, 16, 26, 1)",
                      boxSizing: "border-box",
                    }}
                  />
                  {available.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => onAdd(tag)}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 16px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        fontSize: 14,
                        lineHeight: "20px",
                        color: "rgba(0, 16, 26, 1)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          "rgba(255, 234, 158, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          "transparent";
                      }}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
            </div>
          </div>
        )}
        {maxReachedError && (
          <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: 12, color: "rgba(207, 19, 34, 1)", alignSelf: "center" }}>
            {maxReachedError}
          </span>
        )}
      </div>
    </div>
  );
}
