// the-le-data.ts — Static structural data for the Thể lệ (SAA Rules) modal.
// Display strings (condition, description, label) have been moved to messages/{vi,en}.json
// under the "theLe" namespace. Only non-display fields remain here.

// ── Hero tier badge data (Người nhận section) ─────────────────────────────
// Extracted from nodes 3204:6163, 3204:6172, 3204:6181, 3204:6190
// Badge pill: border 0.579px solid #FFEA9E, border-radius 55.579px, 126x22px

export interface HeroTier {
  /** Node id of the MM_MEDIA_* pill badge */
  nodeId: string;
  /** i18n key within theLe.heroTiers — drives condition + description text */
  i18nKey: "newHero" | "risingHero" | "superHero" | "legendHero";
  /** Badge label text (brand name, not translated) */
  label: string;
}

export const HERO_TIERS: HeroTier[] = [
  { nodeId: "3204:6163", i18nKey: "newHero",     label: "New Hero"    },
  { nodeId: "3204:6172", i18nKey: "risingHero",  label: "Rising Hero" },
  { nodeId: "3204:6181", i18nKey: "superHero",   label: "Super Hero"  },
  { nodeId: "3204:6190", i18nKey: "legendHero",  label: "Legend Hero" },
];

// ── Collectible icon badge data (Người gửi section) ──────────────────────
// Extracted from nodes 3204:6082, 3204:6087, 3204:6086, 3204:6083, 3204:6084, 3204:6088
// Badge circle: 64x64px | border 2px solid #FFF | border-radius 100px
// Image asset path: public/the-le/{slug}.png (placeholder until Figma assets upload)

export interface CollectibleBadge {
  /** Node id of the MM_MEDIA_ Badge * instance */
  nodeId: string;
  /** i18n key within theLe.badges — drives label text */
  i18nKey: "revival" | "touchOfLight" | "stayGold" | "flowToHorizon" | "beyondTheBoundary" | "rootFurther";
  /** kebab-case asset slug — file at /the-le/{slug}.png when uploaded */
  slug: string;
}

export const COLLECTIBLE_BADGES: CollectibleBadge[] = [
  { nodeId: "3204:6082", i18nKey: "revival",            slug: "badge-revival"             },
  { nodeId: "3204:6087", i18nKey: "touchOfLight",       slug: "badge-touch-of-light"      },
  { nodeId: "3204:6086", i18nKey: "stayGold",           slug: "badge-stay-gold"           },
  { nodeId: "3204:6083", i18nKey: "flowToHorizon",      slug: "badge-flow-to-horizon"     },
  { nodeId: "3204:6084", i18nKey: "beyondTheBoundary",  slug: "badge-beyond-the-boundary" },
  { nodeId: "3204:6088", i18nKey: "rootFurther",        slug: "badge-root-further"        },
];
