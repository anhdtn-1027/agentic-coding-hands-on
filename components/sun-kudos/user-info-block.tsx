// mm:I3127:21871;256:4858 (sender) / I3127:21871;256:4860 (receiver)
// C.3.1_Thông tin người gửi / C.3.3_Thông tin người nhận
// Avatar 64×64px, border 1.869px solid #FFF, border-radius 64px
// Name: Montserrat 700 16px/24px #00101A
// Department: Montserrat 700 14px/20px #999

import Image from "next/image";
import type { KudosUser } from "./types";

interface UserInfoBlockProps {
  user: KudosUser;
  /** "sender" aligns content center-column; "receiver" is identical layout */
  variant?: "sender" | "receiver";
}

export function UserInfoBlock({ user }: UserInfoBlockProps) {
  return (
    // mm: width 235px, height 123px, gap 13px, flex-col center
    <div
      className="flex flex-col items-center"
      style={{ width: 235, gap: 13 }}
    >
      {/* mm: Avatar ELLIPSE 64×64px, border 1.869px solid #FFF, border-radius 64px */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "1.869px solid #FFFFFF",
          overflow: "hidden",
          flexShrink: 0,
          background: "#EEE",
        }}
      >
        <Image
          src={user.avatarUrl}
          alt={user.name}
          width={64}
          height={64}
          className="object-cover w-full h-full"
        />
      </div>

      {/* mm: Frame 477 — name + badge row, gap 2px, flex-col */}
      <div className="flex flex-col items-center w-full" style={{ gap: 2 }}>
        {/* Name: Montserrat 700 16px/24px #00101A */}
        <span
          className="truncate w-full"
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            lineHeight: "24px",
            letterSpacing: "0.1px",
            color: "#00101A",
            textAlign: "center",
          }}
        >
          {user.name}
        </span>

        {/* Department + stars row */}
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 12,
            lineHeight: "16px",
            color: "#999999",
            textAlign: "center",
            width: "100%",
          }}
        >
          {user.department}
        </span>
      </div>
    </div>
  );
}
