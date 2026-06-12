// award-icons.tsx — shared inline SVG icons for the Award System page.
// Color is driven by `currentColor`, so callers set the color via style/className.
// Extracted to de-duplicate IconTarget (used by both award-nav and award-detail-block)
// and keep award-detail-block under the 200-line file limit.

import React from "react";

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

// MM_MEDIA_Target — concentric target rings (nav items + award title rows)
// mm:I313:8460;186:1745 / mm:I313:8467;214:2529
export function IconTarget({ className, style }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

// MM_MEDIA_Diamond — "Số lượng giải thưởng" row icon
// mm:I313:8467;214:2535
export function IconDiamond({ className, style }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M12 2L2 9L12 22L22 9L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// MM_MEDIA_License — "Giá trị giải thưởng" row icon
// mm:I313:8467;214:2543
export function IconLicense({ className, style }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8 8H16M8 12H16M8 16H12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
