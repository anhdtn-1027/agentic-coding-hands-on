// mm:2940:13431 — Sun* Kudos - Live board
// Server component shell. Sections mounted below.
// Background: #00101A (full page)
// Layout:
//   - SiteHeader (sticky)
//   - Banner (full-bleed keyvisual)
//   - Input row (full-width, padding 0 clamp(16,10vw,144))
//   - Highlight Kudos (full-width carousel)
//   - Spotlight Board (full-width word cloud)
//   - Content row: main (ALL KUDOS) + sidebar (422px), stacks < md
//   - SiteFooter

import { setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { KudosBanner } from "@/components/sun-kudos/kudos-banner";
import { KudosInputRow } from "@/components/sun-kudos/kudos-input-row";
import { HighlightKudosSection } from "@/components/sun-kudos/highlight-kudos-section";
import { SpotlightBoard } from "@/components/sun-kudos/spotlight-board";
import { AllKudosSection } from "@/components/sun-kudos/all-kudos-section";
import { KudosSidebar } from "@/components/sun-kudos/kudos-sidebar";

export default async function SunKudosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#00101A" }}>
      {/* ── Sticky header ──────────────────────────────────────────────────── */}
      <SiteHeader variant="home" />

      <main className="flex flex-col flex-1 w-full">
        {/* ── Banner (full-bleed keyvisual) — mm:2940:13437 ─────────────────── */}
        <section aria-label="Banner" className="w-full">
          <KudosBanner />
        </section>

        {/* ── Kudos input + Sunner search — mm:2940:13449 ───────────────────── */}
        {/* paddingInline owned by KudosInputRow — do not add it here to avoid double gutter */}
        <section
          aria-label="Input"
          className="w-full"
          style={{ paddingBlock: "40px 0" }}
        >
          <KudosInputRow />
        </section>

        {/* ── Highlight Kudos carousel — mm:2940:13451 ──────────────────────── */}
        <section aria-label="Highlight Kudos" className="w-full" style={{ marginTop: 64 }}>
          <HighlightKudosSection />
        </section>

        {/* ── Spotlight Board word cloud — mm:2940:14174 ────────────────────── */}
        <section aria-label="Spotlight Board" className="w-full" style={{ marginTop: 120 }}>
          <SpotlightBoard />
        </section>

        {/* ── All Kudos feed + Sidebar — mm:2940:13475 / 2940:13488 ─────────── */}
        <section
          aria-label="All Kudos"
          className="w-full"
          style={{ marginTop: 120, paddingBottom: 120 }}
        >
          <div
            className="flex flex-col lg:flex-row w-full"
            style={{
              paddingInline: "clamp(16px, 10vw, 144px)",
              gap: 80,
              alignItems: "flex-start",
            }}
          >
            {/* Main: ALL KUDOS list — grows; min-w-0 lets it shrink on narrow viewports */}
            <div className="flex-1 min-w-0 w-full">
              <AllKudosSection />
            </div>

            {/* Sidebar — 422px fixed on desktop, full-width stacked below on mobile */}
            <aside className="w-full lg:w-[422px] shrink-0">
              <KudosSidebar />
            </aside>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <SiteFooter variant="home" />
    </div>
  );
}
