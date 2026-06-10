"use client";

// mm:662:14391 (login variant) — mms_A_Header component 186:1602
// mm:2167:9091 (home variant) — mms_A1_Header
//
// Login: 1440×80px, bg rgba(11,15,18,0.8), padding 12px 144px
//   Left: LOGO 52×48px | Right: LanguageSwitcher 108×56
//
// Home: 1512×80px (desktop), bg rgba(16,20,23,0.8), padding 12px 144px
//   Left: LOGO + nav links (About SAA 2025 selected/hover/normal) gap 64px
//   Right: LanguageSwitcher + NotificationButton(40×40) + AccountMenu(40×40) gap 16px

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { NotificationButton } from "./notification-button";
import { AccountMenu } from "./account-menu";

interface SiteHeaderProps {
  variant: "login" | "home";
  /** Home variant only — mock unread notifications flag */
  hasUnreadNotifications?: boolean;
  /** Home variant only — current user role for account menu */
  userRole?: "admin" | "user";
  /** Home variant only — current user name */
  userName?: string;
}

// Nav link component (home variant only)
// Selected: yellow (#FFEA9E), font-weight 700, bottom border 1px yellow, text-shadow
// Hover: bg rgba(255,234,158,0.08), border-radius 4px (inferred from hover-state node)
// Normal: white, font-weight 700, no decoration
function NavLink({
  href,
  label,
  selected = false,
}: {
  href: string;
  label: string;
  selected?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "16px",
        borderRadius: selected ? undefined : "4px",
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 700,
        fontSize: "14px",
        lineHeight: "20px",
        letterSpacing: "0.1px",
        color: selected ? "#FFEA9E" : "#FFFFFF",
        textDecoration: "none",
        whiteSpace: "nowrap",
        // Selected: bottom border yellow + text-shadow (mm:I2167:9091;186:1579)
        borderBottom: selected ? "1px solid #FFEA9E" : undefined,
        textShadow: selected
          ? "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287"
          : undefined,
        transition: "background 0.12s ease",
      }}
      className={selected ? "" : "hover:bg-[rgba(255,234,158,0.08)]"}
    >
      {label}
    </Link>
  );
}

export function SiteHeader({
  variant,
  hasUnreadNotifications = false,
  userRole = "user",
  userName,
}: SiteHeaderProps) {
  const t = useTranslations("header");
  const pathname = usePathname();

  // Determine which nav link is active (simple path-based)
  const isAboutSelected = pathname === "/" || pathname === "";

  const bgColor =
    variant === "login"
      ? "rgba(11, 15, 18, 0.8)" // mm:662:14391
      : "rgba(16, 20, 23, 0.8)"; // mm:2167:9091

  return (
    // Sticky top, full-width, z-40 over page content
    <header
      className="sticky top-0 z-40 w-full flex flex-row items-center justify-between"
      style={{
        height: "80px",
        // Responsive side padding: 144px on desktop (design), shrinks on smaller
        // viewports so the fixed-width nav/controls don't force horizontal scroll.
        padding: "12px clamp(16px, 9.52vw, 144px)",
        backgroundColor: bgColor,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {/* ---- LEFT SIDE ---- */}
      <div className="flex flex-row items-center" style={{ gap: "64px" }}>
        {/* mm:I662:14391;178:1033 / I2167:9091;178:1033 — LOGO 52×48 */}
        <Link href="/" aria-label="Sun* Annual Awards 2025 home">
          <Image
            src="/shared/saa-logo.png"
            alt="SAA 2025"
            width={52}
            height={48}
            priority
            className="object-contain"
          />
        </Link>

        {/* Nav links — home variant only (mm:I2167:9091;178:653) */}
        {variant === "home" && (
          <nav
            className="flex flex-row items-center"
            style={{ gap: "0px" }}
            aria-label="Main navigation"
          >
            {/* About SAA 2025 — selected state (mm:I2167:9091;186:1579) */}
            <NavLink
              href="/"
              label={t("nav.aboutSaa")}
              selected={isAboutSelected}
            />
            {/* Awards Information — hover state node (mm:I2167:9091;186:1587) */}
            <NavLink href="/awards-information" label={t("nav.awardsInfo")} />
            {/* Sun* Kudos — normal state (mm:I2167:9091;186:1593) */}
            <NavLink href="/sun-kudos" label={t("nav.sunKudos")} />
          </nav>
        )}
      </div>

      {/* ---- RIGHT SIDE ---- */}
      <div className="flex flex-row items-center" style={{ gap: "16px" }}>
        {/* Home variant: notification bell + account icon (mm:I2167:9091;186:1601) */}
        {variant === "home" && (
          <>
            {/* mm:I2167:9091;186:2101 — NotificationButton */}
            <NotificationButton hasUnread={hasUnreadNotifications} />
            {/* mm:I2167:9091;186:1597 — AccountMenu */}
            <AccountMenu role={userRole} userName={userName} />
          </>
        )}

        {/* Language switcher — both variants (mm:I662:14391;186:1696 / I2167:9091;186:1696) */}
        <LanguageSwitcher />
      </div>
    </header>
  );
}
