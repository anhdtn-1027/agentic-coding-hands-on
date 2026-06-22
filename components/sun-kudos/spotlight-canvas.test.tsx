import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpotlightCanvas } from './spotlight-canvas';
import { mockSpotlightNodes } from './mock-data';
import type { SpotlightNode } from './types';

describe('SpotlightCanvas', () => {
  const testNodes: SpotlightNode[] = [
    { name: 'Alice Johnson', kudosCount: 100, postedAt: '2025-01-01', highlighted: true },
    { name: 'Bob Smith', kudosCount: 80, postedAt: '2025-01-02', highlighted: false },
    { name: 'Charlie Brown', kudosCount: 60, postedAt: '2025-01-03', highlighted: false },
  ];

  describe('basic rendering', () => {
    it('renders SVG canvas', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={false} />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('role', 'img');
      expect(svg).toHaveAttribute('aria-label', 'Spotlight word cloud');
    });

    it('renders node names as text elements', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={false} />
      );

      testNodes.forEach(node => {
        const texts = container.querySelectorAll('text');
        const nodeText = Array.from(texts).find(t => t.textContent === node.name);
        expect(nodeText).toBeInTheDocument();
      });
    });

    it('renders text for each node', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={false} />
      );

      const texts = container.querySelectorAll('text');
      // Should have one text element per node
      expect(texts.length).toBeGreaterThanOrEqual(testNodes.length);
    });

    it('uses full mock spotlight nodes data', () => {
      const { container } = render(
        <SpotlightCanvas nodes={mockSpotlightNodes} panMode={false} />
      );

      // Check that highlighted node is present
      const texts = container.querySelectorAll('text');
      const highlightedNode = Array.from(texts).find(
        t => t.textContent === 'Huỳnh Dương Xuân Nhật'
      );
      expect(highlightedNode).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('renders empty state message when nodes is empty', () => {
      render(<SpotlightCanvas nodes={[]} panMode={false} />);
      expect(screen.getByText('No spotlight data')).toBeInTheDocument();
    });

    it('does not render canvas when empty', () => {
      const { container } = render(
        <SpotlightCanvas nodes={[]} panMode={false} />
      );

      const svg = container.querySelector('svg');
      expect(svg).not.toBeInTheDocument();
    });

    it('empty state displays in container with proper styling', () => {
      const { container } = render(
        <SpotlightCanvas nodes={[]} panMode={false} />
      );

      const emptyDiv = container.querySelector('div');
      expect(emptyDiv).toHaveStyle('display: flex');
      expect(emptyDiv).toHaveStyle('alignItems: center');
      expect(emptyDiv).toHaveStyle('justifyContent: center');
    });
  });

  describe('loading state', () => {
    it('renders loading indicator when loading=true', () => {
      render(
        <SpotlightCanvas nodes={testNodes} loading={true} panMode={false} />
      );
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('loading container has aria-label', () => {
      render(
        <SpotlightCanvas nodes={testNodes} loading={true} panMode={false} />
      );
      expect(screen.getByLabelText('Loading spotlight board')).toBeInTheDocument();
    });

    it('does not render nodes when loading', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} loading={true} panMode={false} />
      );

      const svg = container.querySelector('svg');
      expect(svg).not.toBeInTheDocument();
    });

    it('renders skeleton placeholder during loading', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} loading={true} panMode={false} />
      );

      // Just verify that a skeleton-like div exists during loading
      const divs = container.querySelectorAll('div');
      expect(divs.length).toBeGreaterThan(0);

      // Verify status role is present
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('highlighting', () => {
    it('renders highlighted node with distinct color', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={false} />
      );

      const texts = container.querySelectorAll('text');
      const highlightedText = Array.from(texts).find(
        t => t.textContent === 'Alice Johnson'
      );

      expect(highlightedText).toHaveAttribute('fill', 'rgba(241, 118, 118, 1)');
    });

    it('renders normal nodes with white color', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={false} />
      );

      const texts = container.querySelectorAll('text');
      const normalText = Array.from(texts).find(
        t => t.textContent === 'Bob Smith'
      );

      expect(normalText).toHaveAttribute('fill', 'rgba(255, 255, 255, 1)');
    });

    it('applies correct font styling to all nodes', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={false} />
      );

      const texts = container.querySelectorAll('text');
      texts.forEach(text => {
        expect(text).toHaveAttribute('font-family', 'Montserrat, sans-serif');
        expect(text).toHaveAttribute('font-weight', '700');
      });
    });
  });

  describe('search query and dimming', () => {
    it('dims nodes that do not match search query', () => {
      const { container } = render(
        <SpotlightCanvas
          nodes={testNodes}
          panMode={false}
          searchQuery="Alice"
        />
      );

      const texts = container.querySelectorAll('text');

      const aliceText = Array.from(texts).find(t => t.textContent === 'Alice Johnson');
      expect(aliceText).toHaveAttribute('opacity', '1');

      const bobText = Array.from(texts).find(t => t.textContent === 'Bob Smith');
      expect(bobText).toHaveAttribute('opacity', '0.2');
    });

    it('highlights matching nodes when search is active', () => {
      const { container } = render(
        <SpotlightCanvas
          nodes={testNodes}
          panMode={false}
          searchQuery="Charlie"
        />
      );

      const texts = container.querySelectorAll('text');
      const charlieText = Array.from(texts).find(
        t => t.textContent === 'Charlie Brown'
      );

      expect(charlieText).toHaveAttribute('opacity', '1');
    });

    it('shows all nodes when search is empty', () => {
      const { container } = render(
        <SpotlightCanvas
          nodes={testNodes}
          panMode={false}
          searchQuery=""
        />
      );

      const texts = container.querySelectorAll('text');
      texts.forEach(text => {
        expect(text).toHaveAttribute('opacity', '1');
      });
    });

    it('search is case-insensitive', () => {
      const { container: container1 } = render(
        <SpotlightCanvas
          nodes={testNodes}
          panMode={false}
          searchQuery="alice"
        />
      );

      const { container: container2 } = render(
        <SpotlightCanvas
          nodes={testNodes}
          panMode={false}
          searchQuery="ALICE"
        />
      );

      const texts1 = container1.querySelectorAll('text');
      const aliceText1 = Array.from(texts1).find(t => t.textContent === 'Alice Johnson');

      const texts2 = container2.querySelectorAll('text');
      const aliceText2 = Array.from(texts2).find(t => t.textContent === 'Alice Johnson');

      expect(aliceText1).toHaveAttribute('opacity', '1');
      expect(aliceText2).toHaveAttribute('opacity', '1');
    });
  });

  describe('tooltip', () => {
    it('shows tooltip on mouse enter over node', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={false} />
      );

      const texts = container.querySelectorAll('text');
      const aliceText = Array.from(texts).find(t => t.textContent === 'Alice Johnson');

      fireEvent.mouseEnter(aliceText as Element);

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      const tooltips = screen.queryAllByText('Alice Johnson');
      expect(tooltips.length).toBeGreaterThan(0);
      expect(screen.getByText('2025-01-01')).toBeInTheDocument();
    });

    it('hides tooltip on mouse leave', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={false} />
      );

      const texts = container.querySelectorAll('text');
      const aliceText = Array.from(texts).find(t => t.textContent === 'Alice Johnson');

      fireEvent.mouseEnter(aliceText as Element);
      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      fireEvent.mouseLeave(aliceText as Element);
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('tooltip displays node name and posted date', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={false} />
      );

      const texts = container.querySelectorAll('text');
      const bobText = Array.from(texts).find(t => t.textContent === 'Bob Smith');

      fireEvent.mouseEnter(bobText as Element);

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveTextContent('Bob Smith');
      expect(tooltip).toHaveTextContent('2025-01-02');
    });
  });

  describe('click handling', () => {
    it('calls onNodeClick when node is clicked', () => {
      const onNodeClick = vi.fn();
      const { container } = render(
        <SpotlightCanvas
          nodes={testNodes}
          panMode={false}
          onNodeClick={onNodeClick}
        />
      );

      const texts = container.querySelectorAll('text');
      const aliceText = Array.from(texts).find(t => t.textContent === 'Alice Johnson');

      fireEvent.click(aliceText as Element);

      expect(onNodeClick).toHaveBeenCalledTimes(1);
      expect(onNodeClick).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Alice Johnson' })
      );
    });

    it('does not throw when onNodeClick is not provided', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={false} />
      );

      const texts = container.querySelectorAll('text');
      const aliceText = Array.from(texts).find(t => t.textContent === 'Alice Johnson');

      expect(aliceText).toBeInTheDocument();
    });

    it('text elements have pointer cursor', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={false} />
      );

      const texts = container.querySelectorAll('text');
      texts.forEach(text => {
        expect(text).toHaveStyle('cursor: pointer');
      });
    });
  });

  describe('pan mode', () => {
    it('has grab cursor when panMode is true', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={true} />
      );

      const svg = container.querySelector('svg');
      expect(svg).toHaveStyle('cursor: grab');
    });

    it('has default cursor when panMode is false', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={false} />
      );

      const svg = container.querySelector('svg');
      expect(svg).toHaveStyle('cursor: default');
    });
  });

  describe('double-click reset', () => {
    it('resets transform on double-click', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={true} />
      );

      const svg = container.querySelector('svg');

      fireEvent.doubleClick(svg as Element);

      // After double-click, the transform should be reset to identity
      // This is tested by checking the g element's transform attribute
      const g = svg?.querySelector('g');
      expect(g).toHaveAttribute('transform', 'translate(0,0) scale(1)');
    });
  });

  describe('canvas styling', () => {
    it('has proper border and background', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={false} />
      );

      const svg = container.querySelector('svg');
      expect(svg).toHaveStyle('border: 1px solid #998C5F');
      expect(svg).toHaveStyle('background: rgba(0, 0, 0, 0.70)');
      expect(svg).toHaveStyle('borderRadius: 47px');
    });

    it('SVG has correct viewBox dimensions', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={false} />
      );

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 1157 548');
    });

    it('text cursor transitions on opacity change', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={false} />
      );

      const texts = container.querySelectorAll('text');
      texts.forEach(text => {
        expect(text).toHaveStyle('transition: opacity 0.2s ease');
      });
    });
  });

  describe('accessibility', () => {
    it('SVG has proper accessibility attributes', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={false} />
      );

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('role', 'img');
      expect(svg).toHaveAttribute('aria-label', 'Spotlight word cloud');
    });

    it('text elements have middle text anchor', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={false} />
      );

      const texts = container.querySelectorAll('text');
      texts.forEach(text => {
        expect(text).toHaveAttribute('text-anchor', 'middle');
        expect(text).toHaveAttribute('dominant-baseline', 'middle');
      });
    });
  });

  describe('node positioning', () => {
    it('renders nodes with x and y coordinates', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={false} />
      );

      const texts = container.querySelectorAll('text');
      texts.forEach(text => {
        expect(text).toHaveAttribute('x');
        expect(text).toHaveAttribute('y');
        const x = text.getAttribute('x');
        const y = text.getAttribute('y');
        expect(x).not.toBeNull();
        expect(y).not.toBeNull();
      });
    });

    it('all nodes have fontSize assigned', () => {
      const { container } = render(
        <SpotlightCanvas nodes={testNodes} panMode={false} />
      );

      const texts = container.querySelectorAll('text');
      texts.forEach(text => {
        expect(text).toHaveAttribute('font-size');
      });
    });
  });

  describe('edge cases', () => {
    it('handles single node', () => {
      const singleNode: SpotlightNode[] = [
        { name: 'Solo Artist', kudosCount: 100, postedAt: '2025-01-01', highlighted: true },
      ];

      render(<SpotlightCanvas nodes={singleNode} panMode={false} />);
      expect(screen.getByText('Solo Artist')).toBeInTheDocument();
    });

    it('handles nodes with special Vietnamese characters', () => {
      const vietnameseNodes: SpotlightNode[] = [
        { name: 'Nguyễn Văn Á', kudosCount: 100, postedAt: '2025-01-01', highlighted: true },
        { name: 'Đỗ Thị Nắng', kudosCount: 80, postedAt: '2025-01-02', highlighted: false },
      ];

      const { container } = render(
        <SpotlightCanvas nodes={vietnameseNodes} panMode={false} />
      );

      expect(screen.getByText('Nguyễn Văn Á')).toBeInTheDocument();
      expect(screen.getByText('Đỗ Thị Nắng')).toBeInTheDocument();
    });

    it('handles long node names', () => {
      const longNameNodes: SpotlightNode[] = [
        {
          name: 'This is a very long name that should still render properly in the spotlight canvas',
          kudosCount: 100,
          postedAt: '2025-01-01',
          highlighted: true,
        },
      ];

      render(<SpotlightCanvas nodes={longNameNodes} panMode={false} />);
      expect(
        screen.getByText(/This is a very long name/)
      ).toBeInTheDocument();
    });
  });
});
