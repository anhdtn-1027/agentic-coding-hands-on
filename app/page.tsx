// Root page — next-intl middleware handles locale redirect (/ → /vi or /en).
// This file satisfies Next.js App Router path resolution for the root segment.
// In practice, the middleware rewrites / to /[locale]/ before this renders.
import { redirect } from "next/navigation";

export default function RootPage() {
  // Fallback: redirect to vi (default locale) if middleware hasn't handled it
  redirect("/vi");
}
