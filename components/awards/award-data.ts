// award-data.ts — static award catalogue for the Award System page.
// Text comes from i18n keys (awardSystem namespace); numeric qty/value strings and
// image metadata are extracted verbatim from the Figma design (specs D.1–D.6).
// Order + sectionId slugs MUST match the homepage award-card deep-links.

export interface AwardItem {
  /** Section anchor id — must match AwardNav slugs and homepage deep-links */
  sectionId: string;
  badgeBgSrc: string;
  badgeNameSrc: string;
  badgeNameAlt: string;
  badgeNameWidth: number;
  badgeNameHeight: number;
  titleKey: string;
  descKey: string;
  qty: string;
  unitKey: string;
  valueAmount: string;
  valueNoteKey?: string;
  /** Signature only — second value row (cá nhân vs tập thể) */
  value2Amount?: string;
  value2NoteKey?: string;
  /** true → image on the RIGHT (alternating layout on desktop) */
  reverse: boolean;
}

const BADGE_BG = "/homepage/award-bg.png";

export const AWARDS: AwardItem[] = [
  {
    sectionId: "top-talent",
    badgeBgSrc: BADGE_BG,
    badgeNameSrc: "/homepage/top-talent.png",
    badgeNameAlt: "Top Talent",
    badgeNameWidth: 221,
    badgeNameHeight: 35,
    titleKey: "awards.topTalent.title",
    descKey: "awards.topTalent.description",
    qty: "10",
    unitKey: "awards.topTalent.unit",
    valueAmount: "7.000.000 VNĐ",
    valueNoteKey: "awards.topTalent.valueNote",
    reverse: false,
  },
  {
    sectionId: "top-project",
    badgeBgSrc: BADGE_BG,
    badgeNameSrc: "/homepage/top-project.png",
    badgeNameAlt: "Top Project",
    badgeNameWidth: 232,
    badgeNameHeight: 35,
    titleKey: "awards.topProject.title",
    descKey: "awards.topProject.description",
    qty: "02",
    unitKey: "awards.topProject.unit",
    valueAmount: "15.000.000 VNĐ",
    valueNoteKey: "awards.topProject.valueNote",
    reverse: true,
  },
  {
    sectionId: "top-project-leader",
    badgeBgSrc: BADGE_BG,
    badgeNameSrc: "/homepage/top-project-leader.png",
    badgeNameAlt: "Top Project Leader",
    badgeNameWidth: 232,
    badgeNameHeight: 64,
    titleKey: "awards.topProjectLeader.title",
    descKey: "awards.topProjectLeader.description",
    qty: "03",
    unitKey: "awards.topProjectLeader.unit",
    valueAmount: "7.000.000 VNĐ",
    valueNoteKey: "awards.topProjectLeader.valueNote",
    reverse: false,
  },
  {
    sectionId: "best-manager",
    badgeBgSrc: BADGE_BG,
    badgeNameSrc: "/homepage/best-manager.png",
    badgeNameAlt: "Best Manager",
    badgeNameWidth: 232,
    badgeNameHeight: 30,
    titleKey: "awards.bestManager.title",
    descKey: "awards.bestManager.description",
    qty: "01",
    unitKey: "awards.bestManager.unit",
    valueAmount: "10.000.000 VNĐ",
    reverse: true,
  },
  {
    sectionId: "signature-2025-creator",
    badgeBgSrc: BADGE_BG,
    badgeNameSrc: "/homepage/signature-2025-creator.png",
    badgeNameAlt: "Signature 2025 - Creator",
    badgeNameWidth: 232,
    badgeNameHeight: 54,
    titleKey: "awards.signatureCreator.title",
    descKey: "awards.signatureCreator.description",
    qty: "01",
    unitKey: "awards.signatureCreator.unit",
    valueAmount: "5.000.000 VNĐ",
    valueNoteKey: "awards.signatureCreator.valueNote1",
    value2Amount: "8.000.000 VNĐ",
    value2NoteKey: "awards.signatureCreator.valueNote2",
    reverse: false,
  },
  {
    sectionId: "mvp",
    badgeBgSrc: BADGE_BG,
    badgeNameSrc: "/homepage/mvp.png",
    badgeNameAlt: "MVP (Most Valuable Person)",
    badgeNameWidth: 116,
    badgeNameHeight: 52,
    titleKey: "awards.mvp.title",
    descKey: "awards.mvp.description",
    qty: "01",
    unitKey: "awards.mvp.unit",
    valueAmount: "15.000.000 VNĐ",
    reverse: true,
  },
];

export const SECTION_IDS = AWARDS.map((a) => a.sectionId);
