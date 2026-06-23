"use client";

// mm:I520:11647;520:9871 — mms_B_Chọn người nhận
// Label "Người nhận" (Montserrat 700 22px #00101A) + * (red #CF1322)
// Search input: border 1px #998C5F | bg #FFF | padding 16px 24px | border-radius 8px | flex justify-between
// Placeholder: Montserrat 700 16px #999, dropdown arrow icon right

import { useTranslations } from "next-intl";
import type { KudosUser } from "./types";
import { IconDown } from "./write-kudos-icons";

interface RecipientSelectProps {
  value: KudosUser | null;
  searchText: string;
  onSearchChange: (text: string) => void;
  onSelect: (user: KudosUser) => void;
  /** Clears the current selection (deselect). */
  onClear?: () => void;
  options: KudosUser[];
  error?: string;
}

export function RecipientSelect({
  value,
  searchText,
  onSearchChange,
  onSelect,
  onClear,
  options,
  error,
}: RecipientSelectProps) {
  const t = useTranslations("sunKudos.writeModal");

  const filtered = searchText.trim()
    ? options.filter((u) =>
        u.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : options;

  const showDropdown = searchText.length > 0 && !value;

  return (
    // mm:I520:11647;520:9871 — mms_B_Chọn người nhận row
    // gap: 16px | flex-row | align-center | height 56px; stacks on mobile
    <div className="flex flex-col sm:flex-row sm:items-center" style={{ gap: 16, width: "100%" }}>
      {/* mm:I520:11647;520:9872 — mms_B.1_Title — "Người nhận" label + * */}
      <div className="flex flex-row items-center shrink-0" style={{ gap: 2, width: 146 }}>
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 22,
            lineHeight: "28px",
            letterSpacing: 0,
            color: "rgba(0, 16, 26, 1)",
            whiteSpace: "nowrap",
          }}
        >
          {t("recipientLabel")}
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

      {/* mm:I520:11647;520:9873 — mms_B.2_Search — input with dropdown arrow */}
      <div className="relative" style={{ flex: "1 0 0" }}>
        <div
          className="flex flex-row items-center justify-between"
          style={{
            border: error ? "1px solid rgba(207, 19, 34, 1)" : "1px solid #998C5F",
            borderRadius: 8,
            background: "#FFF",
            padding: "16px 24px",
            gap: 8,
            cursor: "text",
          }}
        >
          {/* mm:I520:11647;520:9873;186:2758 — Frame 483: icon+text row */}
          <input
            type="text"
            value={value ? value.name : searchText}
            onChange={(e) => {
              if (value) return; // locked when selected
              onSearchChange(e.target.value);
            }}
            placeholder={t("recipientPlaceholder")}
            aria-label={t("recipientLabel")}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              lineHeight: "24px",
              letterSpacing: "0.15px",
              color: value ? "rgba(0, 16, 26, 1)" : "rgba(153, 153, 153, 1)",
            }}
          />
          {/* mm:I520:11647;520:9873;186:2761 — MM_MEDIA_Down icon 24×24 */}
          {/* When a recipient is selected, the chevron acts as a clear/deselect control. */}
          <button
            type="button"
            aria-label={value ? "Clear recipient" : undefined}
            aria-hidden={value ? undefined : true}
            tabIndex={value ? 0 : -1}
            onClick={() => value && onClear?.()}
            style={{
              color: "rgba(153, 140, 95, 1)",
              flexShrink: 0,
              background: "none",
              border: "none",
              padding: 0,
              cursor: value ? "pointer" : "default",
              display: "flex",
            }}
          >
            <IconDown size={24} />
          </button>
        </div>

        {/* Dropdown */}
        {showDropdown && filtered.length > 0 && (
          <div
            className="absolute z-50 w-full mt-1 overflow-y-auto"
            style={{
              background: "#FFF",
              border: "1px solid #998C5F",
              borderRadius: 8,
              maxHeight: 200,
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            }}
          >
            {filtered.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => {
                  onSelect(user);
                  onSearchChange("");
                }}
                className="w-full text-left px-4 py-2 hover:bg-amber-50 transition-colors"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "rgba(0, 16, 26, 1)",
                  lineHeight: "20px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 16px",
                }}
              >
                {user.name}
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: 11,
                    color: "#999",
                    fontWeight: 400,
                  }}
                >
                  {user.department}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 12,
            color: "rgba(207, 19, 34, 1)",
            marginTop: 4,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
