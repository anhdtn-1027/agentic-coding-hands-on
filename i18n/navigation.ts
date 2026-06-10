import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware wrappers for Next.js navigation primitives.
// Use these instead of next/link and next/navigation throughout the app.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
