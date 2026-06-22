// mm:I2940:13470;186:1420 MM_MEDIA_Left — carousel nav arrows
// mm:I2940:13468;186:1420 MM_MEDIA_Right
// Sizes: 60px (overlay buttons B.2.1/B.2.2) | 28px (slide nav B.5.1/B.5.3)

export function LeftArrowIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M17.5 21L10.5 14L17.5 7" stroke="#FFFFFF" strokeWidth="2.333"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RightArrowIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M10.5 7L17.5 14L10.5 21" stroke="#FFFFFF" strokeWidth="2.333"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// mm:I2940:13465;335:9444 B.3.4_Icon mũi tên — 32×32px sender→receiver arrow in card
export function CardArrowIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"
      style={{ flexShrink: 0 }}>
      <path d="M6.667 16h18.666M18.667 9.333 25.333 16l-6.666 6.667"
        stroke="#FFEA9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
