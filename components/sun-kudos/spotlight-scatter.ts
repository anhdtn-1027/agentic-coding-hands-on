// mm:2940:14174 — B.7_Spotlight scatter utilities
// Deterministic pseudo-random position generation from node index + label.
// NEVER uses Math.random() — stable across renders.

import type { SpotlightNode } from "./types";

const CANVAS_W = 1157; // mm:B.7 width
const CANVAS_H = 548;  // mm:B.7 height

// Font-size tiers: mapped from kudos ratio (design sizes: ~6.66/7.94/10.2/11.34px at canvas scale)
const FONT_TIERS = [
  { minRatio: 0.75, size: 20 },
  { minRatio: 0.5,  size: 14 },
  { minRatio: 0.25, size: 10 },
  { minRatio: 0,    size: 8  },
] as const;

export function getFontSize(node: SpotlightNode, maxCount: number): number {
  const ratio = maxCount > 0 ? node.kudosCount / maxCount : 0;
  for (const tier of FONT_TIERS) {
    if (ratio >= tier.minRatio) return tier.size;
  }
  return FONT_TIERS[FONT_TIERS.length - 1].size;
}

export function deterministicPos(
  index: number,
  total: number,
  fontSize: number,
  label: string
): { x: number; y: number } {
  let hash = index * 2654435761;
  for (let i = 0; i < label.length; i++) {
    hash = (hash ^ label.charCodeAt(i)) * 1664525 + 1013904223;
  }
  hash = hash >>> 0;

  const col = 5;
  const row = Math.ceil(total / col);
  const colIdx = index % col;
  const rowIdx = Math.floor(index / col);

  const jitterX = ((hash & 0xffff) / 0xffff - 0.5) * (CANVAS_W / (col * 2));
  const jitterY = (((hash >> 16) & 0xffff) / 0xffff - 0.5) * (CANVAS_H / (row * 2));

  const cellW = CANVAS_W / col;
  const cellH = CANVAS_H / row;
  const x = colIdx * cellW + cellW / 2 + jitterX;
  const y = rowIdx * cellH + cellH / 2 + jitterY;

  const margin = fontSize + 4;
  return {
    x: Math.max(margin, Math.min(CANVAS_W - margin, x)),
    y: Math.max(margin, Math.min(CANVAS_H - margin, y)),
  };
}

export type PositionedNode = SpotlightNode & {
  x: number;
  y: number;
  fontSize: number;
  dimmed: boolean;
};

export function buildPositionedNodes(
  nodes: SpotlightNode[],
  searchQuery: string
): PositionedNode[] {
  const maxCount = nodes.length > 0 ? Math.max(...nodes.map((n) => n.kudosCount)) : 1;
  const q = searchQuery.trim().toLowerCase();

  return nodes.map((node, i) => {
    const fontSize = getFontSize(node, maxCount);
    const pos = deterministicPos(i, nodes.length, fontSize, node.name);
    const dimmed = q.length > 0 && !node.name.toLowerCase().includes(q);
    return { ...node, ...pos, fontSize, dimmed };
  });
}

export const CANVAS_DIMS = { w: CANVAS_W, h: CANVAS_H } as const;
// mm:TEXT color (normal) — rgba(255, 255, 255, 1)
export const COLOR_NORMAL = "rgba(255, 255, 255, 1)" as const;
// mm:Nguyễn Hoàng Linh highlighted — rgba(241, 118, 118, 1)
export const COLOR_HIGHLIGHTED = "rgba(241, 118, 118, 1)" as const;
export const FONT_FAMILY = "Montserrat, sans-serif" as const;
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 2.5;
export const ZOOM_STEP = 0.1;
