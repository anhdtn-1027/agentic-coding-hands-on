import { describe, it, expect } from 'vitest';
import {
  getFontSize,
  deterministicPos,
  buildPositionedNodes,
  CANVAS_DIMS,
  COLOR_NORMAL,
  COLOR_HIGHLIGHTED,
  FONT_FAMILY,
  MIN_ZOOM,
  MAX_ZOOM,
  ZOOM_STEP,
} from './spotlight-scatter';
import type { SpotlightNode } from './types';

describe('spotlight-scatter utilities', () => {
  describe('CANVAS_DIMS', () => {
    it('exports correct canvas dimensions', () => {
      expect(CANVAS_DIMS.w).toBe(1157);
      expect(CANVAS_DIMS.h).toBe(548);
    });
  });

  describe('color constants', () => {
    it('exports COLOR_NORMAL as white rgba', () => {
      expect(COLOR_NORMAL).toBe('rgba(255, 255, 255, 1)');
    });

    it('exports COLOR_HIGHLIGHTED as red rgba', () => {
      expect(COLOR_HIGHLIGHTED).toBe('rgba(241, 118, 118, 1)');
    });

    it('exports FONT_FAMILY', () => {
      expect(FONT_FAMILY).toBe('Montserrat, sans-serif');
    });
  });

  describe('zoom constants', () => {
    it('exports MIN_ZOOM as 0.5', () => {
      expect(MIN_ZOOM).toBe(0.5);
    });

    it('exports MAX_ZOOM as 2.5', () => {
      expect(MAX_ZOOM).toBe(2.5);
    });

    it('exports ZOOM_STEP as 0.1', () => {
      expect(ZOOM_STEP).toBe(0.1);
    });
  });

  describe('getFontSize', () => {
    it('returns size 20 for ratio >= 0.75 (top tier)', () => {
      const node: SpotlightNode = { name: 'Test', kudosCount: 100, postedAt: '2025-01-01', highlighted: false };
      const fontSize = getFontSize(node, 100); // ratio = 1.0
      expect(fontSize).toBe(20);
    });

    it('returns size 14 for ratio >= 0.5 && < 0.75', () => {
      const node: SpotlightNode = { name: 'Test', kudosCount: 60, postedAt: '2025-01-01', highlighted: false };
      const fontSize = getFontSize(node, 100); // ratio = 0.6
      expect(fontSize).toBe(14);
    });

    it('returns size 10 for ratio >= 0.25 && < 0.5', () => {
      const node: SpotlightNode = { name: 'Test', kudosCount: 30, postedAt: '2025-01-01', highlighted: false };
      const fontSize = getFontSize(node, 100); // ratio = 0.3
      expect(fontSize).toBe(10);
    });

    it('returns size 8 for ratio < 0.25 (smallest)', () => {
      const node: SpotlightNode = { name: 'Test', kudosCount: 10, postedAt: '2025-01-01', highlighted: false };
      const fontSize = getFontSize(node, 100); // ratio = 0.1
      expect(fontSize).toBe(8);
    });

    it('returns size 8 when maxCount is 0 (ratio = 0)', () => {
      const node: SpotlightNode = { name: 'Test', kudosCount: 0, postedAt: '2025-01-01', highlighted: false };
      const fontSize = getFontSize(node, 0); // ratio = 0 / 0 = 0
      expect(fontSize).toBe(8);
    });

    it('handles exact tier boundary (0.75)', () => {
      const node: SpotlightNode = { name: 'Test', kudosCount: 75, postedAt: '2025-01-01', highlighted: false };
      const fontSize = getFontSize(node, 100); // ratio = 0.75
      expect(fontSize).toBe(20);
    });

    it('handles exact tier boundary (0.5)', () => {
      const node: SpotlightNode = { name: 'Test', kudosCount: 50, postedAt: '2025-01-01', highlighted: false };
      const fontSize = getFontSize(node, 100); // ratio = 0.5
      expect(fontSize).toBe(14);
    });

    it('handles exact tier boundary (0.25)', () => {
      const node: SpotlightNode = { name: 'Test', kudosCount: 25, postedAt: '2025-01-01', highlighted: false };
      const fontSize = getFontSize(node, 100); // ratio = 0.25
      expect(fontSize).toBe(10);
    });
  });

  describe('deterministicPos', () => {
    it('returns position within canvas bounds', () => {
      const pos = deterministicPos(0, 10, 20, 'Test');
      expect(pos.x).toBeGreaterThanOrEqual(20 + 4); // margin = fontSize + 4
      expect(pos.x).toBeLessThanOrEqual(CANVAS_DIMS.w - (20 + 4));
      expect(pos.y).toBeGreaterThanOrEqual(20 + 4);
      expect(pos.y).toBeLessThanOrEqual(CANVAS_DIMS.h - (20 + 4));
    });

    it('is deterministic - same inputs produce same output', () => {
      const index = 5;
      const total = 40;
      const fontSize = 14;
      const label = 'Nguyễn Văn A';

      const pos1 = deterministicPos(index, total, fontSize, label);
      const pos2 = deterministicPos(index, total, fontSize, label);

      expect(pos1.x).toBe(pos2.x);
      expect(pos1.y).toBe(pos2.y);
    });

    it('produces different positions for different indices', () => {
      const total = 40;
      const fontSize = 14;
      const label = 'Test';

      const pos0 = deterministicPos(0, total, fontSize, label);
      const pos1 = deterministicPos(1, total, fontSize, label);

      // Different indices should generally produce different positions
      expect(pos0.x !== pos1.x || pos0.y !== pos1.y).toBe(true);
    });

    it('produces different positions for different labels', () => {
      const index = 5;
      const total = 40;
      const fontSize = 14;

      const posA = deterministicPos(index, total, fontSize, 'Alice');
      const posB = deterministicPos(index, total, fontSize, 'Bob');

      // Different labels should generally produce different positions
      expect(posA.x !== posB.x || posA.y !== posB.y).toBe(true);
    });

    it('respects fontSize margin - larger font needs more margin', () => {
      const index = 5;
      const total = 40;

      const posSmall = deterministicPos(index, total, 8, 'Test');
      const posLarge = deterministicPos(index, total, 20, 'Test');

      // Both should be within bounds but with different margins
      expect(posSmall.x).toBeGreaterThanOrEqual(8 + 4);
      expect(posLarge.x).toBeGreaterThanOrEqual(20 + 4);
    });

    it('distributes positions across grid cells', () => {
      const fontSize = 14;
      const total = 10;
      const positions = Array.from({ length: total }, (_, i) =>
        deterministicPos(i, total, fontSize, `Name${i}`)
      );

      // Should have variety in x and y positions
      const xValues = new Set(positions.map(p => Math.round(p.x / 50))); // Bucket by 50px
      const yValues = new Set(positions.map(p => Math.round(p.y / 50)));

      expect(xValues.size).toBeGreaterThan(1);
      expect(yValues.size).toBeGreaterThan(1);
    });

    it('never uses Math.random - called twice returns same result', () => {
      const call1 = deterministicPos(3, 20, 12, 'DeterministicTest');
      const call2 = deterministicPos(3, 20, 12, 'DeterministicTest');
      const call3 = deterministicPos(3, 20, 12, 'DeterministicTest');

      expect(call1.x).toBe(call2.x);
      expect(call2.x).toBe(call3.x);
      expect(call1.y).toBe(call2.y);
      expect(call2.y).toBe(call3.y);
    });
  });

  describe('buildPositionedNodes', () => {
    const mockNodes: SpotlightNode[] = [
      { name: 'Alice', kudosCount: 100, postedAt: '2025-01-01', highlighted: true },
      { name: 'Bob', kudosCount: 50, postedAt: '2025-01-02', highlighted: false },
      { name: 'Charlie', kudosCount: 25, postedAt: '2025-01-03', highlighted: false },
    ];

    it('returns array with same length as input', () => {
      const positioned = buildPositionedNodes(mockNodes, '');
      expect(positioned).toHaveLength(3);
    });

    it('preserves node data in output', () => {
      const positioned = buildPositionedNodes(mockNodes, '');
      expect(positioned[0].name).toBe('Alice');
      expect(positioned[0].kudosCount).toBe(100);
      expect(positioned[0].highlighted).toBe(true);
    });

    it('adds x, y, fontSize to each node', () => {
      const positioned = buildPositionedNodes(mockNodes, '');
      positioned.forEach(node => {
        expect(node).toHaveProperty('x');
        expect(node).toHaveProperty('y');
        expect(node).toHaveProperty('fontSize');
        expect(typeof node.x).toBe('number');
        expect(typeof node.y).toBe('number');
        expect(typeof node.fontSize).toBe('number');
      });
    });

    it('sets dimmed=false when searchQuery is empty', () => {
      const positioned = buildPositionedNodes(mockNodes, '');
      positioned.forEach(node => {
        expect(node.dimmed).toBe(false);
      });
    });

    it('dims nodes that do not match searchQuery', () => {
      const positioned = buildPositionedNodes(mockNodes, 'alice');
      expect(positioned[0].dimmed).toBe(false); // Alice matches (case-insensitive)
      expect(positioned[1].dimmed).toBe(true); // Bob doesn't match
      expect(positioned[2].dimmed).toBe(true); // Charlie doesn't match
    });

    it('is case-insensitive for search', () => {
      const positioned1 = buildPositionedNodes(mockNodes, 'alice');
      const positioned2 = buildPositionedNodes(mockNodes, 'ALICE');
      const positioned3 = buildPositionedNodes(mockNodes, 'AlIcE');

      expect(positioned1[0].dimmed).toBe(false);
      expect(positioned2[0].dimmed).toBe(false);
      expect(positioned3[0].dimmed).toBe(false);
    });

    it('trims whitespace in searchQuery', () => {
      const positioned1 = buildPositionedNodes(mockNodes, '  alice  ');
      expect(positioned1[0].dimmed).toBe(false);
    });

    it('searches partial name match', () => {
      const positioned = buildPositionedNodes(mockNodes, 'Bob');
      expect(positioned[1].dimmed).toBe(false); // Bob contains 'bob'
    });

    it('handles empty node array', () => {
      const positioned = buildPositionedNodes([], '');
      expect(positioned).toHaveLength(0);
    });

    it('assigns correct font sizes based on kudos ratio', () => {
      const positioned = buildPositionedNodes(mockNodes, '');
      // Alice (100/100 = 1.0) → size 20
      // Bob (50/100 = 0.5) → size 14
      // Charlie (25/100 = 0.25) → size 10
      expect(positioned[0].fontSize).toBe(20);
      expect(positioned[1].fontSize).toBe(14);
      expect(positioned[2].fontSize).toBe(10);
    });

    it('all positions are within canvas bounds with margins', () => {
      const positioned = buildPositionedNodes(mockNodes, '');
      positioned.forEach(node => {
        const margin = node.fontSize + 4;
        expect(node.x).toBeGreaterThanOrEqual(margin);
        expect(node.x).toBeLessThanOrEqual(CANVAS_DIMS.w - margin);
        expect(node.y).toBeGreaterThanOrEqual(margin);
        expect(node.y).toBeLessThanOrEqual(CANVAS_DIMS.h - margin);
      });
    });

    it('deterministic output - same input always produces same positions', () => {
      const result1 = buildPositionedNodes(mockNodes, 'Bob');
      const result2 = buildPositionedNodes(mockNodes, 'Bob');

      result1.forEach((node, i) => {
        expect(node.x).toBe(result2[i].x);
        expect(node.y).toBe(result2[i].y);
        expect(node.fontSize).toBe(result2[i].fontSize);
        expect(node.dimmed).toBe(result2[i].dimmed);
      });
    });

    it('handles single node', () => {
      const positioned = buildPositionedNodes([mockNodes[0]], '');
      expect(positioned).toHaveLength(1);
      expect(positioned[0].name).toBe('Alice');
      expect(positioned[0].fontSize).toBe(20); // only node, ratio = 1.0
    });

    it('handles multiple nodes with same kudos count', () => {
      const nodes = [
        { name: 'A', kudosCount: 50, postedAt: '2025-01-01', highlighted: false },
        { name: 'B', kudosCount: 50, postedAt: '2025-01-02', highlighted: false },
      ];
      const positioned = buildPositionedNodes(nodes, '');
      // Both have kudosCount 50, maxCount is 50, so ratio = 1.0 → fontSize 20
      expect(positioned[0].fontSize).toBe(20);
      expect(positioned[1].fontSize).toBe(20);
    });

    it('all nodes match when searchQuery is substring in all', () => {
      const nodes = [
        { name: 'Alice Apple', kudosCount: 100, postedAt: '2025-01-01', highlighted: false },
        { name: 'Bob Apple', kudosCount: 50, postedAt: '2025-01-02', highlighted: false },
      ];
      const positioned = buildPositionedNodes(nodes, 'Apple');
      expect(positioned[0].dimmed).toBe(false);
      expect(positioned[1].dimmed).toBe(false);
    });
  });
});
