"use client";

// mm:2940:14833 — B.7.3 search bar (219×39px, border #998C5F, bg rgba(255,234,158,0.10), radius 46px)
// mm:3007:17479 — B.7.2 Pan/Zoom button (30×30px)
// mm:I2940:14833;186:2759 — MM_MEDIA_Search icon 16×16px (inline SVG, currentColor)

// ── Search icon (mm:16×16px) ──────────────────────────────────────────────
export function SearchIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Pan/Zoom toggle icon (mm:30×30px frame, four-arrow motif) ─────────────
export function PanZoomIcon({ active }: { active: boolean }) {
  const c = active ? "#FFEA9E" : "rgba(255,255,255,0.7)";
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2v16M2 10h16" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 5L10 2l3 3M7 15l3 3 3-3M5 7l-3 3 3 3M15 7l3 3-3 3" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Search bar (B.7.3) ────────────────────────────────────────────────────
interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}

export function SpotlightSearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    // mm:B.7.3 — 219×39px, border 0.682px solid #998C5F, bg rgba(255,234,158,0.10), radius 46.404px
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5.459,
        width: 219,
        height: 39,
        padding: "0 10.919px",
        border: "0.682px solid #998C5F",
        borderRadius: 46.404,
        background: "rgba(255, 234, 158, 0.10)",
        cursor: "text",
        flexShrink: 0,
      }}
    >
      {/* mm:I2940:14833;186:2759 — search icon 16×16, color white/70% */}
      <span style={{ color: "rgba(255,255,255,0.7)", display: "flex" }}>
        <SearchIcon />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 100))}
        placeholder={placeholder}
        maxLength={100}
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 500,
          // mm:I2940:14833;186:2760 — fontSize 10.918px, lineHeight 16.378px, letterSpacing 0.102px
          fontSize: 10.918635,
          lineHeight: "16.378px",
          letterSpacing: "0.102px",
          color: "rgba(255, 255, 255, 1)",
          minWidth: 0,
        }}
        aria-label={placeholder}
      />
    </label>
  );
}

// ── Pan/Zoom button (B.7.2) ───────────────────────────────────────────────
interface PanZoomButtonProps {
  active: boolean;
  label: string;
  onToggle: () => void;
}

export function PanZoomButton({ active, label, onToggle }: PanZoomButtonProps) {
  return (
    // mm:3007:17479 — 30×30px
    <button
      type="button"
      onClick={onToggle}
      title={label}
      aria-label={label}
      aria-pressed={active}
      style={{
        width: 30,
        height: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? "rgba(255, 234, 158, 0.15)" : "transparent",
        border: active ? "1px solid rgba(255, 234, 158, 0.5)" : "1px solid rgba(255,255,255,0.2)",
        borderRadius: 6,
        cursor: "pointer",
        transition: "background 0.2s ease, border-color 0.2s ease",
        flexShrink: 0,
      }}
    >
      <PanZoomIcon active={active} />
    </button>
  );
}
