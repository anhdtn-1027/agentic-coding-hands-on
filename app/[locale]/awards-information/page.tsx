// app/[locale]/awards-information/page.tsx — Award System page
// Server component: sets locale, renders Header + AwardSystemContent + Footer
// Mirrors structure of app/[locale]/page.tsx

import Image from "next/image";
import { auth } from "@/auth";
import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { AwardSystemContent } from "@/components/awards/award-system-content";

export default async function AwardsInformationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  const userRole = session?.user?.role ?? "user";
  const userName = session?.user?.name ?? undefined;

  return (
    <div className="relative flex flex-col min-h-screen" style={{ background: "#00101A" }}>
      {/* mm:313:8437 mms_3_Keyvisual — full-width colorful keyvisual banner behind the
          header + hero, fading to #00101A (same treatment as the homepage). */}
      <div
        aria-hidden
        className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none"
        style={{ height: 880, zIndex: 0 }}
      >
        <Image
          src="/homepage/keyvisual-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
        {/* Cover gradient — keeps artwork vibrant at top, fades to #00101A by the hero base */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,16,26,0.10) 0%, rgba(0,16,26,0.55) 58%, #00101A 92%)",
          }}
        />
      </div>

      {/* mm:313:8440 — Header (home variant, "Awards Information" nav active) */}
      <SiteHeader variant="home" userRole={userRole} userName={userName} />

      {/* mm:313:8449 — main content */}
      <main className="relative z-10 flex-1">
        <AwardSystemContent />
      </main>

      {/* mm:354:4323 — Footer (home variant) */}
      <SiteFooter variant="home" />
    </div>
  );
}
