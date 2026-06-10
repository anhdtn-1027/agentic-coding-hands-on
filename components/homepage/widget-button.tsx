// mm:5022:15169
// WidgetButton — floating bottom-right pill (yellow, pen icon + "/" + kudos logo icon)
// Fixed-position overlay; onClick passed by integration layer.

interface WidgetButtonProps {
  onClick?: () => void;
}

export function WidgetButton({ onClick }: WidgetButtonProps) {
  return (
    // mm:5022:15169
    <div
      className="fixed z-50"
      style={{
        bottom: 32,
        right: 19,
      }}
    >
      {/* mm:I5022:15169;214:3839 — yellow pill button */}
      <button
        type="button"
        onClick={onClick}
        className="flex flex-row items-center transition-opacity hover:opacity-90 active:opacity-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFEA9E]"
        style={{
          gap: 8,
          width: 106,
          height: 64,
          padding: 16,
          borderRadius: 100,
          backgroundColor: "#FFEA9E",
          boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287",
          border: "none",
          cursor: "pointer",
        }}
        aria-label="Viết Kudos / Thể lệ SAA"
      >
        {/* mm:I5022:15169;214:3839;186:1935 — icon group: pen + "/" */}
        <div
          className="flex flex-row items-center"
          style={{ gap: 4, width: 42, height: 32 }}
        >
          {/* mm:I5022:15169;214:3839;186:1763 — pen icon (inline SVG for color control) */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: "#00101A", flexShrink: 0 }}
            aria-hidden="true"
          >
            <path
              d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* mm:I5022:15169;214:3839;186:1568 — "/" separator */}
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 24,
              fontWeight: 700,
              lineHeight: "32px",
              letterSpacing: 0,
              color: "#00101A",
            }}
          >
            /
          </span>
        </div>

        {/* mm:I5022:15169;214:3839;186:1766 — kudos logo icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ color: "#00101A", flexShrink: 0 }}
          aria-hidden="true"
        >
          {/* Generic award/star icon as placeholder for kudos logo SVG asset */}
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
