// mm:I3127:21871;256:5158 — C.3.7_Hash tag
// Hashtag text: Montserrat 700 16px/24px #D4271D (red)
// Max 5 shown, then "..."

interface HashtagListProps {
  hashtags: string[];
  /** Max tags to show before truncating. Default 5. */
  maxVisible?: number;
}

export function HashtagList({ hashtags, maxVisible = 5 }: HashtagListProps) {
  const visible = hashtags.slice(0, maxVisible);
  const overflow = hashtags.length > maxVisible;

  return (
    // mm: height 48px, flex-row, align-center, gap ~4px, wrap
    <div
      className="flex flex-row flex-wrap items-center"
      style={{ gap: "6px", minHeight: 24 }}
    >
      {visible.map((tag) => (
        <span
          key={tag}
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            lineHeight: "24px",
            letterSpacing: "0.5px",
            color: "#D4271D",
            whiteSpace: "nowrap",
          }}
        >
          {tag}
        </span>
      ))}
      {overflow && (
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            lineHeight: "24px",
            color: "#D4271D",
          }}
        >
          ...
        </span>
      )}
    </div>
  );
}
