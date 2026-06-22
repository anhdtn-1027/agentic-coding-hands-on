import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HashtagList } from './hashtag-list';

const mockHashtags: string[] = [
  '#teamwork',
  '#innovation',
  '#support',
  '#hero',
];

describe('HashtagList', () => {
  describe('Rendering with maxVisible prop', () => {
    it('renders all hashtags when count ≤ maxVisible', () => {
      const hashtags = mockHashtags.slice(0, 3);
      render(<HashtagList hashtags={hashtags} maxVisible={5} />);

      hashtags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });

    it('shows all hashtags when maxVisible equals hashtag count', () => {
      const hashtags = mockHashtags.slice(0, 3);
      render(<HashtagList hashtags={hashtags} maxVisible={3} />);

      hashtags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });

    it('shows truncation ("...") when count > maxVisible', () => {
      render(<HashtagList hashtags={mockHashtags} maxVisible={2} />);

      // Should render first 2 hashtags
      expect(screen.getByText('#teamwork')).toBeInTheDocument();
      expect(screen.getByText('#innovation')).toBeInTheDocument();

      // Should show truncation indicator
      expect(screen.getByText('...')).toBeInTheDocument();

      // Should NOT render tags beyond maxVisible
      expect(screen.queryByText('#support')).not.toBeInTheDocument();
      expect(screen.queryByText('#hero')).not.toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('renders empty list when hashtags array is empty', () => {
      const { container } = render(<HashtagList hashtags={[]} maxVisible={3} />);
      const hasContent = container.textContent?.trim().length ?? 0;
      expect(hasContent).toBe(0);
    });

    it('handles maxVisible of 0 by showing truncation', () => {
      render(<HashtagList hashtags={mockHashtags} maxVisible={0} />);
      expect(screen.getByText('...')).toBeInTheDocument();
    });

    it('handles maxVisible larger than hashtag list', () => {
      const hashtags = mockHashtags.slice(0, 2);
      render(<HashtagList hashtags={hashtags} maxVisible={100} />);

      expect(screen.getByText('#teamwork')).toBeInTheDocument();
      expect(screen.getByText('#innovation')).toBeInTheDocument();
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });

    it('renders single hashtag when list has one item', () => {
      render(<HashtagList hashtags={[mockHashtags[0]]} maxVisible={1} />);
      expect(screen.getByText('#teamwork')).toBeInTheDocument();
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });
  });

  describe('Default maxVisible behavior', () => {
    it('renders all hashtags when maxVisible prop not provided', () => {
      const hashtags = mockHashtags.slice(0, 3);
      render(<HashtagList hashtags={hashtags} />);

      hashtags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });

    it('uses default maxVisible when not provided', () => {
      // Assuming default maxVisible is a reasonable number like 3-5
      const hashtags = mockHashtags.slice(0, 2);
      render(<HashtagList hashtags={hashtags} />);

      hashtags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });
  });
});
