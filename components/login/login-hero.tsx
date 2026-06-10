/**
 * LoginHero — Section B composition (node 662:14393 "mms_B_Bìa")
 *
 * Composes:
 *   B.1 — ROOT FURTHER key visual (node 662:14395 / MM_MEDIA_Root Further Logo 2939:9548)
 *   B.2 — WelcomeText (node 662:14753)
 *   B.3 — GoogleLoginButton (node 662:14425)
 *
 * Figma layout (mms_B_Bìa 662:14393):
 *   position: absolute · top: 88px (startY) · left: 0
 *   width: 1440px · height: 845px
 *   padding: 96px 144px
 *   flex-direction: column · gap: 120px · align-items: flex-start
 *
 * Inner Frame 487 (662:14394):
 *   width: 1152px · height: 653px
 *   flex-direction: column · gap: 80px · align-items: flex-start · justify-content: center
 *
 * B.1 Key Visual frame (662:14395):
 *   width: 1152px · height: 200px
 *   ROOT FURTHER logo image: 451×200px (aspect-ratio: 115/51)
 *
 * Frame 550 (662:14755) — contains B.2 + B.3:
 *   width: 496px · height: 164px
 *   padding-left: 16px · flex-direction: column · gap: 24px
 *
 * Asset:
 *   ROOT FURTHER logo: /login/root-further-logo.png (node 2939:9548)
 *   Download from MoMorph media_files.json key "2939:9548" if file missing.
 */

import Image from "next/image";
import { WelcomeText, type WelcomeTextProps } from "./welcome-text";
import {
  GoogleLoginButton,
  type GoogleLoginButtonProps,
} from "./google-login-button";

export interface LoginHeroProps {
  /** Props forwarded to WelcomeText — pass i18n strings at integration. */
  welcomeText?: WelcomeTextProps;
  /** Props forwarded to GoogleLoginButton — wire onClick/loading/disabled at integration. */
  loginButton?: GoogleLoginButtonProps;
  /** Path to the ROOT FURTHER logo asset. Default: /login/root-further-logo.png */
  rootFurtherLogoSrc?: string;
}

export function LoginHero({
  welcomeText,
  loginButton,
  rootFurtherLogoSrc = "/login/root-further-logo.png",
}: LoginHeroProps) {
  return (
    /* mms_B_Bìa — absolute, full width, padded */
    <div
      className="absolute left-0 w-full flex flex-col items-start"
      style={{
        top: "88px",
        padding: "96px 144px",
        gap: "120px",
        minHeight: "845px",
      }}
    >
      {/* Frame 487 — inner column */}
      <div
        className="flex flex-col items-start justify-center"
        style={{ width: "1152px", gap: "80px" }}
      >
        {/* B.1 — ROOT FURTHER key visual (662:14395) */}
        <div
          className="flex flex-col items-start"
          style={{ width: "1152px", height: "200px", gap: "24px" }}
        >
          <Image
            src={rootFurtherLogoSrc}
            alt="Root Further"
            width={451}
            height={200}
            style={{ aspectRatio: "115/51", objectFit: "cover" }}
            priority
          />
        </div>

        {/* Frame 550 — B.2 + B.3 (662:14755) */}
        <div
          className="flex flex-col items-start"
          style={{
            width: "496px",
            paddingLeft: "16px",
            gap: "24px",
          }}
        >
          {/* B.2 — Welcome text */}
          <WelcomeText {...welcomeText} />

          {/* B.3 — Google login button */}
          <div className="flex flex-row items-start" style={{ gap: "40px" }}>
            <GoogleLoginButton {...loginButton} />
          </div>
        </div>
      </div>
    </div>
  );
}
