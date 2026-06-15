// app/[locale]/prelaunch/page.tsx — Countdown / Prelaunch page
// Server component: sets the request locale, delegates the live timer + i18n
// title to PrelaunchClient. Auth is enforced by proxy.ts (this route is not in
// the public allow-list, so unauthenticated users are redirected to /login).

import { setRequestLocale } from "next-intl/server";
import { PrelaunchClient } from "@/components/countdown/prelaunch-client";

export default async function PrelaunchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PrelaunchClient />;
}
