"use client";

// mm:I2167:9091;186:2101 — mms_A1.6_Notification
// Button: 40×40px, padding 10px, border-radius 4px, transparent bg
// Badge/Dot: 8×8px, border-radius 100px, bg #D4271D (--color-saa-notification)
// Positioned top-right of the bell at absolute offset

import Image from "next/image";

interface NotificationButtonProps {
  hasUnread?: boolean;
  onClick?: () => void;
}

export function NotificationButton({
  hasUnread = false,
  onClick,
}: NotificationButtonProps) {
  return (
    // mm:I2167:9091;186:2101 — 40×40 instance wrapper
    <div className="relative" style={{ width: "40px", height: "40px" }}>
      <button
        onClick={onClick}
        aria-label="Notifications"
        className="flex items-center justify-center"
        style={{
          width: "40px",
          height: "40px",
          padding: "10px",
          borderRadius: "4px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        {/* mm:I2167:9091;186:2101;186:2020;186:1420 — MM_MEDIA_Noti?=True 24×24 */}
        <Image
          src="/shared/bell.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden
        />
      </button>

      {/* mm:I2167:9091;186:2101;186:2089 — Badge/Dot 8×8 at top-right */}
      {hasUnread && (
        <span
          className="absolute pointer-events-none"
          style={{
            top: "9px",
            right: "9px",
            width: "8px",
            height: "8px",
            borderRadius: "100px",
            backgroundColor: "#D4271D",
            display: "block",
          }}
          aria-label="Unread notifications"
        />
      )}
    </div>
  );
}
