/**
 * WelcomeText — Section B.2 (node 662:14753 "mms_B.2_content")
 *
 * Design values from Figma:
 *   width: 480px · height: 80px
 *   font-family: Montserrat · font-weight: 700 · font-size: 20px
 *   line-height: 40px · letter-spacing: 0.5px · text-align: left
 *   color: rgba(255, 255, 255, 1) = white
 *   parent padding-left: 16px (Frame 550 node 662:14755)
 *
 * Figma text (used as default — override with i18n prop at integration):
 *   "Bắt đầu hành trình của bạn cùng SAA 2025.\nĐăng nhập để khám phá!"
 *
 * Note: backgroundColor in Figma node was rgba(255,255,255,1) which is the
 * FILL color of the text (white text), not the container bg.
 */

export interface WelcomeTextProps {
  /**
   * Line 1 of the welcome message.
   * Default matches Figma text exactly (use i18n key at integration).
   */
  line1?: string;
  /**
   * Line 2 of the welcome message.
   * Default matches Figma text exactly (use i18n key at integration).
   */
  line2?: string;
}

export function WelcomeText({
  line1 = "Bắt đầu hành trình của bạn cùng SAA 2025.",
  line2 = "Đăng nhập để khám phá!",
}: WelcomeTextProps) {
  return (
    <p
      className="text-white font-['Montserrat'] font-bold text-[20px] leading-[40px] tracking-[0.5px] text-left w-[480px]"
      style={{ maxWidth: "480px" }}
    >
      {line1}
      <br />
      {line2}
    </p>
  );
}
