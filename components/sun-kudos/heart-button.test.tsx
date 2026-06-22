import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeartButton } from './heart-button';

describe('HeartButton', () => {
  describe('Initial state and rendering', () => {
    it('renders count and heart icon with initial values', () => {
      const { container } = render(<HeartButton initialCount={42} initialLiked={false} />);
      const count = container.querySelector('span')?.textContent;
      expect(count).toBe('42');
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('formats count with Vietnamese locale (1000 → "1.000")', () => {
      const { container } = render(<HeartButton initialCount={1000} initialLiked={false} />);
      const count = container.querySelector('span')?.textContent;
      expect(count).toBe('1.000');
    });

    it('displays filled heart when initially liked', () => {
      const { container } = render(<HeartButton initialCount={5} initialLiked={true} />);
      const svg = container.querySelector('svg');
      // When liked, fill should be set to red color
      expect(svg).toHaveAttribute('fill', '#D4271D');
    });

    it('displays outline heart when initially not liked', () => {
      const { container } = render(<HeartButton initialCount={5} initialLiked={false} />);
      const svg = container.querySelector('svg');
      // When not liked, fill should be "none"
      expect(svg).toHaveAttribute('fill', 'none');
    });

    it('sets aria-label to "Like" when not liked', () => {
      const { container } = render(<HeartButton initialCount={5} initialLiked={false} />);
      const button = container.querySelector('button');
      expect(button).toHaveAttribute('aria-label', 'Like');
    });

    it('sets aria-label to "Unlike" when liked', () => {
      const { container } = render(<HeartButton initialCount={5} initialLiked={true} />);
      const button = container.querySelector('button');
      expect(button).toHaveAttribute('aria-label', 'Unlike');
    });

    it('sets aria-pressed to false when not liked', () => {
      const { container } = render(<HeartButton initialCount={5} initialLiked={false} />);
      const button = container.querySelector('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('sets aria-pressed to true when liked', () => {
      const { container } = render(<HeartButton initialCount={5} initialLiked={true} />);
      const button = container.querySelector('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Click interaction - like behavior', () => {
    it('toggles liked state to true and increments count on click when not liked', async () => {
      const { container } = render(<HeartButton initialCount={5} initialLiked={false} />);
      const button = container.querySelector('button');

      fireEvent.click(button!);

      await waitFor(() => {
        const count = container.querySelector('span')?.textContent;
        expect(count).toBe('6');
      });

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', '#D4271D');
    });

    it('toggles liked state to false and decrements count on second click', async () => {
      const { container } = render(<HeartButton initialCount={5} initialLiked={true} />);
      const button = container.querySelector('button');

      fireEvent.click(button!);

      await waitFor(() => {
        const count = container.querySelector('span')?.textContent;
        expect(count).toBe('4');
      });

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'none');
    });

    it('updates aria-label from "Like" to "Unlike" after click', async () => {
      const { container } = render(<HeartButton initialCount={5} initialLiked={false} />);
      const button = container.querySelector('button');

      expect(button).toHaveAttribute('aria-label', 'Like');

      fireEvent.click(button!);

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-label', 'Unlike');
      });
    });

    it('updates aria-pressed from false to true after click', async () => {
      const { container } = render(<HeartButton initialCount={5} initialLiked={false} />);
      const button = container.querySelector('button');

      expect(button).toHaveAttribute('aria-pressed', 'false');

      fireEvent.click(button!);

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('completes full like/unlike cycle: like then unlike returns to initial state', async () => {
      const { container } = render(<HeartButton initialCount={10} initialLiked={false} />);
      const button = container.querySelector('button');

      // Like
      fireEvent.click(button!);
      await waitFor(() => {
        const count = container.querySelector('span')?.textContent;
        expect(count).toBe('11');
      });

      // Unlike
      fireEvent.click(button!);
      await waitFor(() => {
        const count = container.querySelector('span')?.textContent;
        expect(count).toBe('10');
      });

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'none');
    });
  });

  describe('Disabled state', () => {
    it('does not respond to click when disabled', async () => {
      const { container } = render(<HeartButton initialCount={5} initialLiked={false} disabled={true} />);
      const button = container.querySelector('button');

      fireEvent.click(button!);

      // Count should remain unchanged
      await new Promise(resolve => setTimeout(resolve, 100));
      const count = container.querySelector('span')?.textContent;
      expect(count).toBe('5');
    });

    it('sets cursor to "default" when disabled', () => {
      const { container } = render(<HeartButton initialCount={5} disabled={true} />);
      const button = container.querySelector('button');
      const style = window.getComputedStyle(button!);
      expect(button).toHaveStyle('cursor: default');
    });

    it('sets cursor to "pointer" when enabled', () => {
      const { container } = render(<HeartButton initialCount={5} disabled={false} />);
      const button = container.querySelector('button');
      expect(button).toHaveStyle('cursor: pointer');
    });

    it('grays heart color when disabled', () => {
      const { container } = render(<HeartButton initialCount={5} disabled={true} />);
      const svg = container.querySelector('svg');
      const path = svg?.querySelector('path');
      const stroke = path?.getAttribute('stroke');
      // When disabled, stroke is set to #CCCCCC (the outline color for disabled state)
      expect(stroke).toBe('#CCCCCC');
    });

    it('grays text color when disabled', () => {
      const { container } = render(<HeartButton initialCount={5} disabled={true} />);
      const count = container.querySelector('span');
      expect(count).toHaveStyle('color: #CCCCCC');
    });

    it('does not update liked state when clicking while disabled', async () => {
      const { container } = render(<HeartButton initialCount={5} initialLiked={false} disabled={true} />);
      const button = container.querySelector('button');

      fireEvent.click(button!);
      fireEvent.click(button!);
      fireEvent.click(button!);

      // aria-pressed should still be false
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('disables button element properly', () => {
      const { container } = render(<HeartButton initialCount={5} disabled={true} />);
      const button = container.querySelector('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Count formatting', () => {
    it('formats various large numbers with Vietnamese locale', () => {
      const testCases = [
        { input: 1000, expected: '1.000' },
        { input: 10000, expected: '10.000' },
        { input: 100000, expected: '100.000' },
        { input: 1000000, expected: '1.000.000' },
        { input: 123456, expected: '123.456' },
      ];

      testCases.forEach(({ input, expected }) => {
        const { container } = render(<HeartButton initialCount={input} initialLiked={false} />);
        const count = container.querySelector('span')?.textContent;
        expect(count).toBe(expected);
      });
    });

    it('formats zero correctly', () => {
      const { container } = render(<HeartButton initialCount={0} initialLiked={false} />);
      const count = container.querySelector('span')?.textContent;
      expect(count).toBe('0');
    });

    it('formats single digit without leading zero', () => {
      const { container } = render(<HeartButton initialCount={5} initialLiked={false} />);
      const count = container.querySelector('span')?.textContent;
      expect(count).toBe('5');
    });
  });

  describe('Visual styling', () => {
    it('has heart icon size of 32×32', () => {
      const { container } = render(<HeartButton initialCount={5} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '32');
      expect(svg).toHaveAttribute('height', '32');
    });

    it('uses Montserrat font for count text', () => {
      const { container } = render(<HeartButton initialCount={5} />);
      const count = container.querySelector('span');
      expect(count).toHaveStyle("fontFamily: Montserrat, sans-serif");
    });

    it('uses font weight 700 and size 24px for count', () => {
      const { container } = render(<HeartButton initialCount={5} />);
      const count = container.querySelector('span');
      expect(count).toHaveStyle('fontWeight: 700');
      expect(count).toHaveStyle('fontSize: 24px');
    });

    it('has transition on heart color change', () => {
      const { container } = render(<HeartButton initialCount={5} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveStyle('transition: fill 0.15s ease, stroke 0.15s ease');
    });
  });

  describe('Edge cases', () => {
    it('handles clicking rapidly', async () => {
      const { container } = render(<HeartButton initialCount={5} initialLiked={false} />);
      const button = container.querySelector('button');

      fireEvent.click(button!);
      fireEvent.click(button!);
      fireEvent.click(button!);

      await waitFor(() => {
        const count = container.querySelector('span')?.textContent;
        // First click: 5 → 6 (like)
        // Second click: 6 → 5 (unlike)
        // Third click: 5 → 6 (like)
        expect(count).toBe('6');
      });
    });

    it('maintains count integrity across multiple toggles', async () => {
      const { container } = render(<HeartButton initialCount={100} initialLiked={true} />);
      const button = container.querySelector('button');

      // Cycle: unlike (100→99), like (99→100), unlike (100→99), like (99→100)
      fireEvent.click(button!);
      fireEvent.click(button!);
      fireEvent.click(button!);
      fireEvent.click(button!);

      await waitFor(() => {
        const count = container.querySelector('span')?.textContent;
        expect(count).toBe('100');
      });
    });
  });
});
