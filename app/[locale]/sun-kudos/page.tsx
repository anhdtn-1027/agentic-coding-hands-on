// Placeholder — Sun* Kudos page (out of scope per clarifications)
import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";

export default async function SunKudosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#00101A" }}>
      <SiteHeader variant="home" />
      <main className="flex-1 flex items-center justify-center">
        <p style={{ color: "#FFFFFF", fontFamily: "Montserrat, sans-serif" }}>
          Sun* Kudos — Coming Soon
        </p>
      </main>
      <SiteFooter variant="home" />
    </div>
  );
}
