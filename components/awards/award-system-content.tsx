"use client";

// mm:313:8458 — mms_B_Hệ thống giải thưởng
// award-system-content.tsx — orchestrates nav + 6 detail blocks + KudosBlock.
// Scroll-spy via IntersectionObserver: active nav item updates as the user scrolls.
// Section IDs match homepage deep-links exactly (see award-data.ts).

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { AwardNav } from "./award-nav";
import { AwardDetailBlock } from "./award-detail-block";
import { AwardHero } from "./award-hero";
import { AWARDS, SECTION_IDS } from "./award-data";
import { KudosBlock } from "@/components/homepage/kudos-block";

const isSectionId = (v: string) => SECTION_IDS.includes(v);

export function AwardSystemContent() {
  const t = useTranslations("awardSystem");
  const [activeId, setActiveId] = useState<string>(SECTION_IDS[0]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  // While a programmatic (click/hash) smooth-scroll is in flight, suppress the
  // observer so intermediate sections don't override the chosen item.
  const scrollLockRef = useRef(false);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Navigate to a section: lock the observer, set active, update the URL hash,
  // smooth-scroll, then release the lock after the animation settles.
  const goToSection = useCallback((id: string) => {
    if (!isSectionId(id)) return;
    scrollLockRef.current = true;
    setActiveId(id);
    history.replaceState(null, "", `#${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => {
      scrollLockRef.current = false;
    }, 800);
  }, []);

  // Scroll-spy: track which section is most visible in the viewport.
  const setupObserver = useCallback(() => {
    observerRef.current?.disconnect();
    const visibility = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (scrollLockRef.current) return; // ignore while click/hash scroll in flight
        entries.forEach((e) => visibility.set(e.target.id, e.intersectionRatio));
        let bestId = "";
        let bestRatio = -1;
        visibility.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestId && bestRatio > 0) setActiveId(bestId);
      },
      { rootMargin: "-80px 0px -40% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0] }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });
  }, []);

  useEffect(() => {
    setupObserver();
    return () => {
      observerRef.current?.disconnect();
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, [setupObserver]);

  // Honor an initial hash (e.g. /awards-information#mvp from a homepage card).
  // Deferred out of the effect body (project lint: no sync setState in effect).
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!isSectionId(hash)) return;
    const timer = setTimeout(() => goToSection(hash), 100);
    return () => clearTimeout(timer);
  }, [goToSection]);

  return (
    // mm:313:8449 — Bìa outer, padding 96px 144px
    <div
      className="w-full flex flex-col mx-auto"
      style={{ maxWidth: 1440, padding: "96px clamp(16px, 10vw, 144px)", gap: 120 }}
    >
      {/* mm:313:8450 + mm:313:8453 — KV + Title (AwardHero) */}
      <AwardHero />

      {/* mm:313:8458 — nav LEFT + detail blocks RIGHT.
          Responsive: nav hidden on mobile/tablet, blocks stack full-width (clarification). */}
      <div
        className="flex flex-col lg:flex-row items-start justify-between w-full"
        style={{ gap: 80 }}
      >
        {/* mm:313:8459 — mms_C_Menu list: sticky left nav (desktop only) */}
        <div className="hidden lg:block sticky" style={{ top: 100, alignSelf: "flex-start" }}>
          <AwardNav activeId={activeId} onSelect={goToSection} />
        </div>

        {/* mm:313:8466 — D.Danh sách giải thưởng: 6 award blocks, gap 80px */}
        <div className="flex flex-col flex-1" style={{ gap: 80 }}>
          {AWARDS.map((award) => (
            <AwardDetailBlock
              key={award.sectionId}
              sectionId={award.sectionId}
              badgeBgSrc={award.badgeBgSrc}
              badgeNameSrc={award.badgeNameSrc}
              badgeNameAlt={award.badgeNameAlt}
              badgeNameWidth={award.badgeNameWidth}
              badgeNameHeight={award.badgeNameHeight}
              title={t(award.titleKey)}
              description={t(award.descKey)}
              qty={award.qty}
              unit={t(award.unitKey)}
              value={{
                amount: award.valueAmount,
                note: award.valueNoteKey ? t(award.valueNoteKey) : undefined,
              }}
              value2={
                award.value2Amount
                  ? {
                      amount: award.value2Amount,
                      note: award.value2NoteKey ? t(award.value2NoteKey) : undefined,
                    }
                  : undefined
              }
              reverse={award.reverse}
            />
          ))}
        </div>
      </div>

      {/* mm:335:12023 — mms_D1_Sunkudos — KudosBlock */}
      <KudosBlock detailHref="/sun-kudos" />
    </div>
  );
}
