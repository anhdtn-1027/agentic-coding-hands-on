/**
 * BackgroundKeyVisual — Section C (node 662:14388 + 662:14390)
 *
 * Full-screen background composed of:
 *   1. bg image (662:14389) — fills viewport, object-cover
 *   2. dark gradient overlay (662:14390) — linear-gradient(0deg, #00101A 22.48%, transparent 51.74%)
 *
 * Asset to download (signed URL expires — re-fetch from MoMorph if needed):
 *   Source node: 662:14389 (image 1 — the bg photo)
 *   Expected path: /login/saa-bg.jpg  (or .png — download from Figma bg node)
 *   Note: The design uses a photo background. The node style was:
 *     background: url(<path>) lightgray -440px -217.975px / 159.763% 133.371% no-repeat
 *   We use object-cover + object-position to replicate the crop.
 *
 * This is a layout-only presentational component; no state or logic.
 */

export interface BackgroundKeyVisualProps {
  /** Path to the background photo asset. Defaults to /login/saa-bg.jpg */
  imageSrc?: string;
  className?: string;
}

export function BackgroundKeyVisual({
  imageSrc = "/login/saa-bg.jpg",
  className = "",
}: BackgroundKeyVisualProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Background photo — node 662:14389 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ aspectRatio: "141/100" }}
      />

      {/* Dark gradient overlay — node 662:14390
          linear-gradient(0deg, #00101A 22.48%, rgba(0,19,32,0) 51.74%) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, #00101A 22.48%, rgba(0, 19, 32, 0.00) 51.74%)",
        }}
      />
    </div>
  );
}
