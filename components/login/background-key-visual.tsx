/**
 * BackgroundKeyVisual — Section C (node 662:14388 + 662:14390)
 *
 * Full-screen background composed of:
 *   1. bg image (662:14389 "image 1") — the ROOT FURTHER colour key-visual, fills
 *      viewport, object-cover. Node 662:14389 is an image-fill rectangle that the
 *      MoMorph API cannot export (get_media_file / get_design_item_image both fail),
 *      so we reuse the same brand key-visual asset that ships with the homepage.
 *   2. dark gradient overlay (662:14390) — linear-gradient(0deg, #00101A 22.48%, transparent 51.74%)
 *
 * Asset: /login/keyvisual-bg.png (same artwork as /homepage/keyvisual-bg.png).
 *
 * This is a layout-only presentational component; no state or logic.
 */

export interface BackgroundKeyVisualProps {
  /** Path to the background key-visual asset. Defaults to /login/keyvisual-bg.png */
  imageSrc?: string;
  className?: string;
}

export function BackgroundKeyVisual({
  imageSrc = "/login/keyvisual-bg.png",
  className = "",
}: BackgroundKeyVisualProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Background key-visual — node 662:14389 (authoritative crop).
          The login design enlarges + crops the artwork (homepage shows it full).
          Figma node style: url() … -440px -217.975px / 159.763% 133.371% no-repeat
          on a 1441×1022 box. Reproduced responsively in %:
            size     = 159.763% 133.371%  (verbatim from the node)
            position = offset / (container − image):
              x = -440      / (1441 − 1.59763·1441) = 51.09%
              y = -217.975  / (1022 − 1.33371·1022) = 63.92%
          → art sweeps in from the right, darker area sits behind ROOT FURTHER. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "51.09% 63.92%",
          backgroundSize: "159.763% 133.371%",
        }}
      />

      {/* Dark gradient overlay — node 662:14390 "Cover".
          The Figma Cover is 1093px tall on a 1024px frame with top at y=138, so
          its bottom ~207px overflows below the frame and is CLIPPED. With the
          gradient anchored at the element's bottom (0deg → opaque at bottom),
          that clipping pushes the solid band down to a thin strip at the very
          bottom — the artwork stays visible above it.
          We reproduce that geometry in % (responsive) instead of inset-0, which
          would otherwise darken the whole lower half of the viewport.
            top    = 138 / 1024  = 13.48%
            height = 1093 / 1024 = 106.74%  (overflow clipped by parent) */}
      <div
        className="absolute left-0 w-full"
        style={{
          top: "13.48%",
          height: "106.74%",
          background:
            "linear-gradient(0deg, #00101A 22.48%, rgba(0, 19, 32, 0.00) 51.74%)",
        }}
      />
    </div>
  );
}
