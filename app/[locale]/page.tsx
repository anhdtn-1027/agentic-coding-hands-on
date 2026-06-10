// app/[locale]/page.tsx — Homepage SAA 2025
// Server component: reads session for header props, delegates client work to HomepageClient

import { auth } from "@/auth";
import { setRequestLocale } from "next-intl/server";
import { HomepageClient } from "./homepage-client";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Read session server-side for account menu role + name
  const session = await auth();
  const userRole = session?.user?.role ?? "user";
  const userName = session?.user?.name ?? undefined;

  return (
    <HomepageClient
      userRole={userRole}
      userName={userName}
    />
  );
}
