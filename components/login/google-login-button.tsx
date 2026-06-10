/**
 * GoogleLoginButton — Section B.3 (node 662:14425 → 662:14426 "Button-IC About")
 *
 * Design values from Figma (node 662:14426):
 *   width: 305px · height: 60px
 *   bg: rgba(255, 234, 158, 1) = #FFEA9E (yellow)
 *   border-radius: 8px
 *   padding: 16px 24px
 *   gap: 8px
 *   flex-direction: row · align-items: center · justify-content: flex-start
 *
 * Label text (node I662:14426;186:1568):
 *   "LOGIN With Google "
 *   font-family: Montserrat · font-weight: 700 · font-size: 22px · line-height: 28px
 *   color: rgba(0, 16, 26, 1) = #00101A
 *
 * Google icon (node I662:14426;186:1766 = MM_MEDIA_Google):
 *   24×24px · positioned after the label text
 *   Asset path: /login/google-icon.svg
 *   Download URL (expires — re-fetch from MoMorph MCP if stale):
 *     node I662:14426;186:1766 → media_files.json key "I662:14426;186:1766"
 *
 * Interactive states (hover/active/disabled/loading) are driven by props + CSS only.
 * No auth logic here — onClick is a prop no-op by default.
 */

import Image from "next/image";

export interface GoogleLoginButtonProps {
  /** Called when the button is clicked. Default: no-op. */
  onClick?: () => void;
  /** Shows a spinner and disables the button when true. Default: false. */
  loading?: boolean;
  /** Disables the button (no spinner). Default: false. */
  disabled?: boolean;
  /**
   * Button label text. Accepts i18n string at integration time.
   * Default matches Figma text exactly.
   */
  label?: string;
  /** Path to the Google icon asset. Default: /login/google-icon.svg */
  iconSrc?: string;
}

export function GoogleLoginButton({
  onClick,
  loading = false,
  disabled = false,
  label = "LOGIN With Google",
  iconSrc = "/login/google-icon.svg",
}: GoogleLoginButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      className={[
        // Base layout — matches Figma exactly
        "inline-flex items-center justify-start flex-row",
        "gap-2 px-6 py-4",
        "rounded-lg",
        "w-[305px] h-[60px]",
        // Colors
        "bg-[#FFEA9E]",
        // Typography — Montserrat 700 22px/28px dark
        "font-['Montserrat'] font-bold text-[22px] leading-[28px] text-[#00101A]",
        // Interactive states
        !isDisabled
          ? "cursor-pointer hover:brightness-105 hover:shadow-[0_4px_16px_rgba(255,234,158,0.5)] active:scale-[0.97] active:brightness-95 transition-all duration-200 ease-in-out"
          : "cursor-not-allowed opacity-50",
      ].join(" ")}
    >
      {/* Label */}
      <span className="flex-1 text-center whitespace-nowrap">{label}</span>

      {/* Google icon (24×24) or loading spinner */}
      <span className="shrink-0 w-6 h-6 flex items-center justify-center">
        {loading ? (
          <svg
            className="animate-spin w-5 h-5 text-[#00101A]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
            />
          </svg>
        ) : (
          <Image
            src={iconSrc}
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
          />
        )}
      </span>
    </button>
  );
}
