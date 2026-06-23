"use client";

// mm:3127:21871 — C.3_KUDO Post card (680px, #FFF8E1, border-radius 24px)

import Image from "next/image";
import type { Kudos } from "./types";
import { UserInfoBlock } from "./user-info-block";
import { HashtagList } from "./hashtag-list";
import { HeartButton } from "./heart-button";
import { CopyLinkButton } from "./copy-link-button";

interface KudosPostCardProps {
  kudos: Kudos;
}

export function KudosPostCard({ kudos }: KudosPostCardProps) {
  return (
    // mm:3127:21871 — card container
    <article
      style={{
        width: "100%",
        maxWidth: 680,
        padding: "40px 40px 16px 40px",
        borderRadius: 24,
        backgroundColor: "#FFF8E1", // rgba(255, 248, 225, 1)
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxSizing: "border-box",
      }}
    >
      {/* mm:I3127:21871;256:4857 — Info user row: sender + send icon + receiver */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 24,
          width: "100%",
        }}
      >
        {/* C.3.1 Sender */}
        <UserInfoBlock user={kudos.sender} variant="sender" />

        {/* mm:I3127:21871;256:5161 — C.3.2_Icon sent: 32×32px centered in 32×123 column */}
        <div
          style={{
            width: 32,
            height: 123,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          {/* MM_MEDIA_Send — send arrow icon 32×32 */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="sent to"
          >
            <path
              d="M6 16H26M26 16L18 8M26 16L18 24"
              stroke="#00101A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* C.3.3 Receiver */}
        <UserInfoBlock user={kudos.receiver} variant="receiver" />
      </div>

      {/* mm:I3127:21871;256:5229 — C.3.4 Time */}
      <span
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: 16,
          lineHeight: "24px",
          letterSpacing: "0.5px",
          color: "#999999", // rgba(153, 153, 153, 1)
        }}
      >
        {kudos.postedAt}
      </span>

      {/* Award title (Danh hiệu) — shown as the Kudos heading */}
      {kudos.awardTitle && (
        <h3
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 24,
            lineHeight: "32px",
            color: "#00101A",
            margin: 0,
          }}
        >
          {kudos.awardTitle}
        </h3>
      )}

      {/* mm:I3127:21871;256:5155 — C.3.5 Content max 5 lines with line-clamp */}
      <p
        style={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: 20,
          lineHeight: "32px",
          letterSpacing: "0px",
          color: "#00101A", // rgba(0, 16, 26, 1)
          textAlign: "justify",
          margin: 0,
          // CSS line-clamp: show max 5 lines then truncate with "..."
          display: "-webkit-box",
          WebkitLineClamp: 5,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {kudos.contentVi}
      </p>

      {/* mm:I3127:21871;256:5176 — C.3.6 Image gallery (up to 5 thumbnails, omit if empty) */}
      {kudos.imageUrls.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            flexWrap: "nowrap",
            overflowX: "auto",
          }}
        >
          {kudos.imageUrls.slice(0, 5).map((url, idx) => (
            // mm: Image container 88×88px, border 1px solid #998C5F, border-radius 18px
            <div
              key={idx}
              style={{
                width: 88,
                height: 88,
                flexShrink: 0,
                border: "1px solid #998C5F",
                borderRadius: 18,
                overflow: "hidden",
                background: "#FFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "default", // no-op this pass
              }}
              aria-label={`Image ${idx + 1}`}
            >
              {/* mm: inner image border-radius 4px from design */}
              <Image
                src={url}
                alt=""
                width={88}
                height={88}
                style={{
                  width: 88,
                  height: 88,
                  objectFit: "cover",
                  borderRadius: 4,
                  display: "block",
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* mm:I3127:21871;256:5158 — C.3.7 Hashtags */}
      <HashtagList hashtags={kudos.hashtags} maxVisible={5} />

      {/* mm:I3127:21871;256:5194 — C.4 Action bar: space-between HeartButton + CopyLinkButton */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          width: "100%",
          height: 56,
        }}
      >
        {/* C.4.1 Hearts — disabled when kudos.isOwn */}
        <HeartButton
          initialCount={kudos.likeCount}
          initialLiked={kudos.likedByMe}
          disabled={kudos.isOwn}
        />

        {/* C.4.2 Copy Link */}
        <CopyLinkButton />
      </div>
    </article>
  );
}
