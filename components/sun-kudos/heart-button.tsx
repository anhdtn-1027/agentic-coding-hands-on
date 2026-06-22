"use client";

// mm:I3127:21871;256:5175 — C.4.1_Hearts
// Heart icon 32×32px, count text Montserrat 700 24px/32px #00101A
// Active: heart red (#D4271D), Inactive: heart #00101A outline
// Disabled (isOwn): no click, grayed heart

import { useState } from "react";

interface HeartButtonProps {
  initialCount: number;
  initialLiked?: boolean;
  disabled?: boolean;
}

export function HeartButton({
  initialCount,
  initialLiked = false,
  disabled = false,
}: HeartButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  function handleClick() {
    if (disabled) return;
    if (liked) {
      setLiked(false);
      setCount((c) => c - 1);
    } else {
      setLiked(true);
      setCount((c) => c + 1);
    }
  }

  // Format count: 1000 → "1.000" (VN locale)
  const formattedCount = count.toLocaleString("vi-VN");

  const heartColor = disabled
    ? "#CCCCCC"
    : liked
      ? "#D4271D"
      : "#00101A";

  return (
    // mm: C.4.1_Hearts — flex-row, gap 4px, align-center, width 101px, height 32px
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={liked ? "Unlike" : "Like"}
      aria-pressed={liked}
      className="flex flex-row items-center"
      style={{
        gap: 4,
        background: "none",
        border: "none",
        padding: 0,
        cursor: disabled ? "default" : "pointer",
        outline: "none",
      }}
    >
      {/* Count: Montserrat 700 24px/32px */}
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: 24,
          lineHeight: "32px",
          letterSpacing: "0px",
          color: disabled ? "#CCCCCC" : "#00101A",
          minWidth: 40,
          textAlign: "left",
        }}
      >
        {formattedCount}
      </span>

      {/* Heart icon 32×32 — mm:I3127:21871;256:5171 MM_MEDIA_Heart */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill={liked && !disabled ? heartColor : "none"}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{
          flexShrink: 0,
          transition: "fill 0.15s ease, stroke 0.15s ease",
        }}
      >
        <path
          d="M16 27.2S4 20 4 11.6C4 8.5 6.5 6 9.6 6c1.8 0 3.5.9 4.6 2.3L16 10.4l1.8-2.1C18.9 6.9 20.6 6 22.4 6 25.5 6 28 8.5 28 11.6 28 20 16 27.2 16 27.2Z"
          stroke={heartColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
