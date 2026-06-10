"use client";

// mm:I2167:9091;186:1597 — mms_A1.8_Button-IC
// Account button: 40×40px, border 1px solid #998C5F, border-radius 4px, padding 10px
// Dropdown: Profile / Sign out / (Admin Dashboard if role=admin) — TC ID-36..38

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface AccountMenuProps {
  role?: "admin" | "user";
  userName?: string;
}

export function AccountMenu({ role = "user", userName }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("header.account");

  // Close on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  async function handleSignOut() {
    setOpen(false);
    await signOut({ callbackUrl: "/login" });
  }

  const menuItemStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    padding: "10px 16px",
    background: "transparent",
    border: "none",
    textAlign: "left",
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "20px",
    color: "#FFFFFF",
    cursor: "pointer",
    whiteSpace: "nowrap",
    borderRadius: "4px",
    transition: "background 0.12s ease",
  };

  return (
    <div ref={menuRef} className="relative">
      {/* mm:I2167:9091;186:1597 — account icon button 40×40 */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={userName ?? "Account menu"}
        style={{
          width: "40px",
          height: "40px",
          padding: "10px",
          border: "1px solid #998C5F",
          borderRadius: "4px",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* mm:I2167:9091;186:1597;186:1420 — MM_MEDIA_User Profile 24×24 */}
        <Image
          src="/shared/user-profile.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            background: "#0B0F12",
            border: "1px solid #2E3940",
            borderRadius: "8px",
            padding: "6px",
            minWidth: "180px",
            zIndex: 60,
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {/* Profile — TC ID-36 */}
          <Link
            href="#"
            role="menuitem"
            onClick={() => setOpen(false)}
            style={menuItemStyle}
          >
            {t("profile")}
          </Link>

          {/* Admin Dashboard — only if role=admin, TC ID-38 */}
          {role === "admin" && (
            <Link
              href="#"
              role="menuitem"
              onClick={() => setOpen(false)}
              style={menuItemStyle}
            >
              {t("adminDashboard")}
            </Link>
          )}

          {/* Divider */}
          <div
            style={{ height: "1px", background: "#2E3940", margin: "2px 0" }}
          />

          {/* Sign out — TC ID-37 */}
          <button
            role="menuitem"
            onClick={handleSignOut}
            style={menuItemStyle}
          >
            {t("signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
