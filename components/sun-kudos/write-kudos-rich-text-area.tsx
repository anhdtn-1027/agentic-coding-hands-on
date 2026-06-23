"use client";

// mm:I520:11647;520:9876 — Nhập nội dung (content entry section)
// mms_C_Chức năng: toolbar row height 40px, 6 icon buttons left + "Tiêu chuẩn cộng đồng" link right
// mms_D_text filed: contentEditable editor, border 1px #998C5F, bg #FFF, min-height 120px
// Lightweight rich text: execCommand formatting (bold/italic/strike/list/link/quote) + @mention.
// Board stores PLAIN TEXT (formatting is compose-time); onChange emits (html, plainText).

import { useRef, useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { KudosUser } from "./types";
import {
  IconBold,
  IconItalic,
  IconStrikethrough,
  IconNumberList,
  IconLink,
  IconQuote,
} from "./write-kudos-icons";

interface RichTextAreaProps {
  /** Current HTML value (controlled — only used to detect an external reset to ""). */
  value: string;
  /** Emits (html, plainText) on every edit. */
  onChange: (html: string, text: string) => void;
  /** Users available for @mention. */
  mentionOptions: KudosUser[];
  /** Max plain-text length. */
  maxLength?: number;
  error?: string;
}

// mms_C toolbar button (reused ×6) — border 1px #998C5F, 40px height, padding 10px 16px
function ToolbarBtn({
  onClick,
  icon,
  label,
  style,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      // Prevent the editor losing selection before the command runs.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 40,
        padding: "10px 16px",
        border: "1px solid #998C5F",
        background: "rgba(0, 0, 0, 0.00)",
        color: "rgba(0, 16, 26, 1)",
        cursor: "pointer",
        flexShrink: 0,
        transition: "background 0.15s ease",
        ...style,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(153, 140, 95, 0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "rgba(0, 0, 0, 0.00)";
      }}
    >
      {icon}
    </button>
  );
}

export function RichTextArea({
  value,
  onChange,
  mentionOptions,
  maxLength = 500,
  error,
}: RichTextAreaProps) {
  const t = useTranslations("sunKudos.writeModal");
  const editorRef = useRef<HTMLDivElement>(null);
  const [charCount, setCharCount] = useState(0);
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");

  // Clear the editor DOM when the parent resets value to "" (after submit/cancel).
  useEffect(() => {
    if (value === "" && editorRef.current && editorRef.current.innerHTML !== "") {
      editorRef.current.innerHTML = "";
      setCharCount(0);
    }
  }, [value]);

  const emit = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const text = typeof el.innerText === "string" ? el.innerText : el.textContent ?? "";
    setCharCount(text.trim().length);
    onChange(el.innerHTML, text.trim() ? text : "");
  }, [onChange]);

  const exec = useCallback(
    (command: string, arg?: string) => {
      editorRef.current?.focus();
      document.execCommand(command, false, arg);
      emit();
    },
    [emit],
  );

  const handleLink = useCallback(() => {
    const url = window.prompt(t("linkPrompt"));
    // Only allow http(s) links — blocks javascript:/data: URLs.
    if (url && /^https?:\/\//i.test(url.trim())) exec("createLink", url.trim());
  }, [exec, t]);

  // Detect "@query" immediately before the caret to drive the mention dropdown.
  const detectMention = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      setMentionOpen(false);
      return;
    }
    const node = sel.anchorNode;
    const offset = sel.anchorOffset;
    const textBefore = node?.textContent?.slice(0, offset) ?? "";
    const match = /@([\p{L}\p{N} ]{0,30})$/u.exec(textBefore);
    if (match) {
      setMentionQuery(match[1].trim());
      setMentionOpen(true);
    } else {
      setMentionOpen(false);
    }
  }, []);

  const handleInput = useCallback(() => {
    emit();
    detectMention();
  }, [emit, detectMention]);

  const insertMention = useCallback(
    (user: KudosUser) => {
      const el = editorRef.current;
      if (!el) return;
      el.focus();
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const node = sel.anchorNode;
        const offset = sel.anchorOffset;
        const textBefore = node?.textContent?.slice(0, offset) ?? "";
        const at = textBefore.lastIndexOf("@");
        if (at >= 0 && node) {
          // Select from the "@" to the caret, then replace with "@Name ".
          const range = document.createRange();
          range.setStart(node, at);
          range.setEnd(node, offset);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
      document.execCommand("insertText", false, `@${user.name} `);
      setMentionOpen(false);
      emit();
    },
    [emit],
  );

  const filteredMentions = mentionQuery
    ? mentionOptions.filter((u) =>
        u.name.toLowerCase().includes(mentionQuery.toLowerCase()),
      )
    : mentionOptions;

  return (
    <div style={{ width: "100%" }}>
      {/* mms_C_Chức năng toolbar row */}
      <div className="flex flex-row items-center" style={{ width: "100%", height: 40, overflowX: "auto" }}>
        <ToolbarBtn onClick={() => exec("bold")} icon={<IconBold size={24} />} label="Bold" style={{ borderRadius: "8px 0 0 0" }} />
        <ToolbarBtn onClick={() => exec("italic")} icon={<IconItalic size={24} />} label="Italic" style={{ borderLeft: "none" }} />
        <ToolbarBtn onClick={() => exec("strikeThrough")} icon={<IconStrikethrough size={24} />} label="Strikethrough" style={{ borderLeft: "none" }} />
        <ToolbarBtn onClick={() => exec("insertOrderedList")} icon={<IconNumberList size={24} />} label="Numbered list" style={{ borderLeft: "none" }} />
        <ToolbarBtn onClick={handleLink} icon={<IconLink size={24} />} label="Link" style={{ borderLeft: "none" }} />
        <ToolbarBtn onClick={() => exec("formatBlock", "blockquote")} icon={<IconQuote size={24} />} label="Quote" style={{ borderLeft: "none" }} />

        {/* community standards button */}
        <div
          className="flex items-center justify-end"
          style={{ flex: 1, height: 40, padding: "10px 16px", border: "1px solid #998C5F", borderLeft: "none", borderRadius: "0 8px 0 0", background: "rgba(0, 0, 0, 0.00)" }}
        >
          <button
            type="button"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 16, lineHeight: "24px", letterSpacing: "0.15px", color: "rgba(228, 96, 96, 1)", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}
          >
            {t("communityStandards")}
          </button>
        </div>
      </div>

      {/* mms_D — contentEditable editor */}
      <div className="relative" style={{ width: "100%" }}>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label={t("contentLabel")}
          data-placeholder={t("contentPlaceholder")}
          onInput={handleInput}
          onKeyUp={detectMention}
          onBlur={() => window.setTimeout(() => setMentionOpen(false), 150)}
          style={{
            width: "100%",
            minHeight: 96,
            height: 112,
            overflowY: "auto",
            border: error ? "1px solid rgba(207, 19, 34, 1)" : "1px solid #998C5F",
            borderTop: "none",
            borderRadius: "0 0 8px 8px",
            background: "#FFF",
            padding: "12px 16px",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            lineHeight: "24px",
            letterSpacing: "0.15px",
            color: "rgba(0, 16, 26, 1)",
            outline: "none",
            boxSizing: "border-box",
            textAlign: "left",
          }}
          className="write-kudos-editor"
        />

        {/* @mention dropdown */}
        {mentionOpen && filteredMentions.length > 0 && (
          <div
            style={{ position: "absolute", left: 24, bottom: 8, zIndex: 60, background: "#FFF", border: "1px solid #998C5F", borderRadius: 8, minWidth: 220, maxHeight: 200, overflowY: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}
          >
            {filteredMentions.slice(0, 6).map((user) => (
              <button
                key={user.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => insertMention(user)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 16px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 14, color: "rgba(0, 16, 26, 1)" }}
              >
                {user.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .write-kudos-editor:empty:before {
          content: attr(data-placeholder);
          color: rgba(153, 153, 153, 1);
          pointer-events: none;
        }
        .write-kudos-editor:focus { outline: 2px solid rgba(153, 140, 95, 0.4); outline-offset: -1px; }
        .write-kudos-editor blockquote { border-left: 3px solid #998C5F; margin: 4px 0; padding-left: 12px; color: #555; }
      `}</style>

      {/* mms_D.1_Gợi ý hint + char counter */}
      <div className="flex flex-row items-center justify-between" style={{ marginTop: 4, gap: 8 }}>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 16, lineHeight: "24px", letterSpacing: "0.15px", color: "rgba(153, 153, 153, 1)", margin: 0, flex: 1, textAlign: "center" }}>
          {t("contentMentionHint")}
        </p>
        <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, color: charCount > maxLength ? "rgba(207, 19, 34, 1)" : "rgba(153, 153, 153, 1)", flexShrink: 0 }} aria-label="character count">
          {charCount}/{maxLength}
        </span>
      </div>
    </div>
  );
}
