"use client";

// mm:2940:13458 — Buttons (B.1) filter bar
// mm:2940:13459 — B.1.1_ButtonHashtag: border 1px solid #998C5F, bg rgba(255,234,158,0.10), padding 16px, border-radius 4px, gap 8px
// mm:2940:13460 — B.1.2_Button Phong ban: same style
// Label: Montserrat 700 16px/24px #FFFFFF, Down icon 24×24px

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Hashtag, Department } from "./types";

interface HighlightFiltersProps {
  hashtags: Hashtag[];
  departments: Department[];
}

// mm: chevron down icon — MM_MEDIA_Down 24×24px
function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        flexShrink: 0,
        transition: "transform 0.2s ease",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}

function FilterDropdown({ label, options, selected, onSelect }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const displayLabel = selected ?? label;
  const isActive = selected !== null;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* mm:2940:13459 button: border 1px solid #998C5F, bg rgba(255,234,158,0.10), padding 16px, border-radius 4px, gap 8px */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex flex-row items-center"
        style={{
          gap: 8,
          padding: 16,
          borderRadius: 4,
          border: `1px solid ${isActive ? "#FFEA9E" : "#998C5F"}`,
          background: isActive
            ? "rgba(255,234,158,0.20)"
            : "rgba(255,234,158,0.10)",
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "border-color 0.2s ease, background 0.2s ease",
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {/* mm: label text Montserrat 700 16px/24px #FFFFFF */}
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            lineHeight: "24px",
            letterSpacing: "0.15px",
            color: isActive ? "#FFEA9E" : "#FFFFFF",
          }}
        >
          {displayLabel}
        </span>
        <ChevronDownIcon open={open} />
      </button>

      {/* Dropdown menu */}
      {open && (
        <ul
          role="listbox"
          aria-label={label}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            minWidth: "100%",
            background: "#00101A",
            border: "1px solid #998C5F",
            borderRadius: 4,
            padding: "8px 0",
            margin: 0,
            listStyle: "none",
            zIndex: 50,
            maxHeight: 240,
            overflowY: "auto",
          }}
        >
          {/* Clear option */}
          {selected && (
            <li role="option" aria-selected={false}
              tabIndex={0}
              onClick={() => { onSelect(null); setOpen(false); }}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(null); setOpen(false); } }}
              className="hover:bg-white/10 transition-colors"
              style={{ padding: "10px 16px", fontFamily: "Montserrat, sans-serif",
                fontWeight: 600, fontSize: 14, lineHeight: "20px",
                color: "#999999", cursor: "pointer" }}>
              — Clear filter —
            </li>
          )}
          {options.map((opt) => (
            <li key={opt} role="option" aria-selected={opt === selected}
              tabIndex={0}
              onClick={() => { onSelect(opt); setOpen(false); }}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(opt); setOpen(false); } }}
              className="hover:bg-white/10 transition-colors"
              style={{ padding: "10px 16px", fontFamily: "Montserrat, sans-serif",
                fontWeight: opt === selected ? 700 : 500, fontSize: 14,
                lineHeight: "20px", color: opt === selected ? "#FFEA9E" : "#FFFFFF",
                cursor: "pointer",
                background: opt === selected ? "rgba(255,234,158,0.10)" : "transparent" }}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function HighlightFilters({ hashtags, departments }: HighlightFiltersProps) {
  const t = useTranslations("sunKudos");
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  // Expose selection via data attributes for potential parent reads
  return (
    // mm:2940:13458 Buttons: flex-row, gap 8px, width 302px, height 56px, align-center
    <div
      className="flex flex-row items-center"
      style={{ gap: 8 }}
      data-selected-hashtag={selectedHashtag ?? ""}
      data-selected-dept={selectedDept ?? ""}
    >
      {/* mm:2940:13459 B.1.1_ButtonHashtag */}
      <FilterDropdown
        label={t("highlight.filterHashtag")}
        options={hashtags.map((h) => h.label)}
        selected={selectedHashtag}
        onSelect={setSelectedHashtag}
      />
      {/* mm:2940:13460 B.1.2_Button Phong ban */}
      <FilterDropdown
        label={t("highlight.filterDepartment")}
        options={departments.map((d) => d.name)}
        selected={selectedDept}
        onSelect={setSelectedDept}
      />
    </div>
  );
}
