import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { KudosLeaderboard } from './kudos-leaderboard';
import { mockLeaderboardGifts, mockLeaderboardRankUp, mockUsers } from './mock-data';
import type { LeaderboardEntry } from './types';
import messages from '@/messages/vi.json';

const createWrapper = () => {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <NextIntlClientProvider locale="vi" messages={messages}>
        {children}
      </NextIntlClientProvider>
    );
  };
};

describe('KudosLeaderboard', () => {
  describe('title rendering', () => {
    it('renders provided title', () => {
      render(
        <KudosLeaderboard
          title="Test Leaderboard Title"
          entries={mockLeaderboardGifts.slice(0, 3)}
        />,
        { wrapper: createWrapper() }
      );
      expect(screen.getByText('Test Leaderboard Title')).toBeInTheDocument();
    });

    it('renders Vietnamese title from mock data', () => {
      const title = '10 SUNNER NHẬN QUÀ MỚI NHẤT';
      render(
        <KudosLeaderboard title={title} entries={mockLeaderboardGifts} />,
        { wrapper: createWrapper() }
      );
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    it('title is h3 element', () => {
      const { container } = render(
        <KudosLeaderboard
          title="Test Title"
          entries={mockLeaderboardGifts.slice(0, 1)}
        />,
        { wrapper: createWrapper() }
      );
      const title = container.querySelector('h3');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Test Title');
    });

    it('title is gold color', () => {
      const { container } = render(
        <KudosLeaderboard
          title="Test Title"
          entries={mockLeaderboardGifts.slice(0, 1)}
        />,
        { wrapper: createWrapper() }
      );
      const title = container.querySelector('h3');
      expect(title).toHaveStyle('color: #FFEA9E');
    });
  });

  describe('entries rendering', () => {
    it('renders one row per entry', () => {
      const testEntries = mockLeaderboardGifts.slice(0, 3);
      const { container } = render(
        <KudosLeaderboard title="Test" entries={testEntries} />,
        { wrapper: createWrapper() }
      );

      // Each entry should have a row with user name
      testEntries.forEach(entry => {
        expect(screen.getByText(entry.user.name)).toBeInTheDocument();
      });
    });

    it('renders avatar alt text with user name', () => {
      const testEntries = mockLeaderboardGifts.slice(0, 2);
      const { container } = render(
        <KudosLeaderboard title="Test" entries={testEntries} />,
        { wrapper: createWrapper() }
      );

      testEntries.forEach(entry => {
        const img = container.querySelector(`img[alt="${entry.user.name}"]`);
        expect(img).toBeInTheDocument();
      });
    });

    it('renders description for each entry', () => {
      const testEntries = mockLeaderboardGifts.slice(0, 2);
      render(
        <KudosLeaderboard title="Test" entries={testEntries} />,
        { wrapper: createWrapper() }
      );

      testEntries.forEach(entry => {
        const descs = screen.queryAllByText(entry.description);
        expect(descs.length).toBeGreaterThan(0);
      });
    });

    it('renders with full mock leaderboard gifts data', () => {
      render(
        <KudosLeaderboard
          title="10 SUNNER NHẬN QUÀ MỚI NHẤT"
          entries={mockLeaderboardGifts}
        />,
        { wrapper: createWrapper() }
      );

      // Use getAllByText for potentially duplicate entries
      mockLeaderboardGifts.forEach(entry => {
        const names = screen.queryAllByText(entry.user.name);
        expect(names.length).toBeGreaterThan(0);
      });
    });

    it('renders with full mock leaderboard rankup data', () => {
      render(
        <KudosLeaderboard
          title="10 SUNNER CÓ SỰ THĂNG HẠNG MỚI NHẤT"
          entries={mockLeaderboardRankUp}
        />,
        { wrapper: createWrapper() }
      );

      // Use getAllByText for potentially duplicate entries
      mockLeaderboardRankUp.forEach(entry => {
        const names = screen.getAllByText(entry.user.name);
        expect(names.length).toBeGreaterThan(0);
      });
    });
  });

  describe('empty state', () => {
    it('renders empty message when entries is empty array', () => {
      render(
        <KudosLeaderboard title="Empty Test" entries={[]} />,
        { wrapper: createWrapper() }
      );
      expect(screen.getByText('Chưa có dữ liệu')).toBeInTheDocument();
    });

    it('does not render entry rows when empty', () => {
      const { container } = render(
        <KudosLeaderboard title="Empty Test" entries={[]} />,
        { wrapper: createWrapper() }
      );

      // Should only have title + empty message, no rows
      const allDivs = container.querySelectorAll('div');
      const rowsWithImages = Array.from(allDivs).filter(
        div => div.querySelector('img')
      );
      expect(rowsWithImages.length).toBe(0);
    });

    it('empty message is gray and centered', () => {
      const { container } = render(
        <KudosLeaderboard title="Empty Test" entries={[]} />,
        { wrapper: createWrapper() }
      );

      const emptyMsg = screen.getByText('Chưa có dữ liệu');
      expect(emptyMsg).toHaveStyle('color: #999999');
      expect(emptyMsg).toHaveStyle('textAlign: center');
    });
  });

  describe('styling and layout', () => {
    it('card has dark background and gold border', () => {
      const { container } = render(
        <KudosLeaderboard
          title="Test"
          entries={mockLeaderboardGifts.slice(0, 1)}
        />,
        { wrapper: createWrapper() }
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle('background: #00070C');
      expect(card).toHaveStyle('border: 1px solid #998C5F');
      expect(card).toHaveStyle('borderRadius: 17px');
      expect(card).toHaveStyle('padding: 24px 16px 24px 24px');
    });

    it('entry rows have correct height', () => {
      const { container } = render(
        <KudosLeaderboard
          title="Test"
          entries={mockLeaderboardGifts.slice(0, 1)}
        />,
        { wrapper: createWrapper() }
      );

      // Find entry rows (flex containers with height 64)
      const allDivs = container.querySelectorAll('div');
      const entryRows = Array.from(allDivs).filter(
        div => div.style.height === '64px'
      );
      expect(entryRows.length).toBeGreaterThan(0);
    });

    it('avatar is 64x64 circle', () => {
      const { container } = render(
        <KudosLeaderboard
          title="Test"
          entries={mockLeaderboardGifts.slice(0, 1)}
        />,
        { wrapper: createWrapper() }
      );

      const avatarDivs = container.querySelectorAll('div');
      const avatarContainer = Array.from(avatarDivs).find(
        div => div.style.width === '64px' && div.style.height === '64px'
      );
      expect(avatarContainer).toBeInTheDocument();
      expect(avatarContainer).toHaveStyle('borderRadius: 50%');
    });

    it('name text is gold', () => {
      const { container } = render(
        <KudosLeaderboard
          title="Test"
          entries={mockLeaderboardGifts.slice(0, 1)}
        />,
        { wrapper: createWrapper() }
      );

      const names = container.querySelectorAll('span');
      const nameSpan = Array.from(names).find(
        span =>
          span.textContent === mockLeaderboardGifts[0].user.name &&
          span.style.color === 'rgb(255, 234, 158)' // Computed color
      );
      expect(nameSpan).toBeInTheDocument();
    });

    it('description text is gray', () => {
      const { container } = render(
        <KudosLeaderboard
          title="Test"
          entries={mockLeaderboardGifts.slice(0, 1)}
        />,
        { wrapper: createWrapper() }
      );

      const descriptions = container.querySelectorAll('span');
      const descSpan = Array.from(descriptions).find(
        span =>
          span.textContent === mockLeaderboardGifts[0].description &&
          span.style.color === 'rgb(153, 153, 153)' // Computed color for #999999
      );
      expect(descSpan).toBeInTheDocument();
    });
  });

  describe('maxHeight prop', () => {
    it('uses default maxHeight of 480px when not provided', () => {
      const { container } = render(
        <KudosLeaderboard
          title="Test"
          entries={mockLeaderboardGifts.slice(0, 3)}
        />,
        { wrapper: createWrapper() }
      );

      // Find the scrollable container
      const allDivs = container.querySelectorAll('div');
      const scrollableDiv = Array.from(allDivs).find(
        div => div.style.maxHeight === '480px'
      );
      expect(scrollableDiv).toBeInTheDocument();
    });

    it('uses custom maxHeight when provided', () => {
      const { container } = render(
        <KudosLeaderboard
          title="Test"
          entries={mockLeaderboardGifts.slice(0, 3)}
          maxHeight={600}
        />,
        { wrapper: createWrapper() }
      );

      // Find the scrollable container
      const allDivs = container.querySelectorAll('div');
      const scrollableDiv = Array.from(allDivs).find(
        div => div.style.maxHeight === '600px'
      );
      expect(scrollableDiv).toBeInTheDocument();
    });

    it('scrollable container has overflow auto', () => {
      const { container } = render(
        <KudosLeaderboard
          title="Test"
          entries={mockLeaderboardGifts.slice(0, 3)}
        />,
        { wrapper: createWrapper() }
      );

      // Find the scrollable container
      const allDivs = container.querySelectorAll('div');
      const scrollableDiv = Array.from(allDivs).find(
        div => div.style.overflowY === 'auto'
      );
      expect(scrollableDiv).toBeInTheDocument();
    });
  });

  describe('single entry', () => {
    it('renders single entry correctly', () => {
      const singleEntry = mockLeaderboardGifts.slice(0, 1);
      render(
        <KudosLeaderboard title="Single Entry" entries={singleEntry} />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText(singleEntry[0].user.name)).toBeInTheDocument();
      expect(screen.getByText(singleEntry[0].description)).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('renders semantic heading for title', () => {
      const { container } = render(
        <KudosLeaderboard
          title="Accessible Title"
          entries={mockLeaderboardGifts.slice(0, 1)}
        />,
        { wrapper: createWrapper() }
      );

      const heading = container.querySelector('h3');
      expect(heading).toBeInTheDocument();
      expect(heading?.textContent).toBe('Accessible Title');
    });

    it('images have alt text with user names', () => {
      const { container } = render(
        <KudosLeaderboard
          title="Test"
          entries={mockLeaderboardGifts.slice(0, 3)}
        />,
        { wrapper: createWrapper() }
      );

      const images = container.querySelectorAll('img');
      expect(images.length).toBeGreaterThan(0);
      images.forEach((img, idx) => {
        expect(img.getAttribute('alt')).toBe(mockLeaderboardGifts[idx].user.name);
      });
    });
  });

  describe('data integrity', () => {
    it('preserves user data throughout rendering', () => {
      const testEntries: LeaderboardEntry[] = [
        {
          user: mockUsers[0],
          description: 'Test Description 1',
        },
        {
          user: mockUsers[1],
          description: 'Test Description 2',
        },
      ];

      const { container } = render(
        <KudosLeaderboard title="Data Test" entries={testEntries} />,
        { wrapper: createWrapper() }
      );

      // Verify all user data is rendered
      testEntries.forEach(entry => {
        expect(screen.queryAllByText(entry.user.name).length).toBeGreaterThan(0);
        expect(screen.getByText(entry.description)).toBeInTheDocument();
      });
    });

    it('handles entries with special characters in names', () => {
      const specialEntries: LeaderboardEntry[] = [
        {
          user: mockUsers[0],
          description: '+12 hạng',
        },
      ];

      render(
        <KudosLeaderboard title="Special Chars" entries={specialEntries} />,
        { wrapper: createWrapper() }
      );

      expect(screen.queryAllByText(mockUsers[0].name).length).toBeGreaterThan(0);
      expect(screen.getByText('+12 hạng')).toBeInTheDocument();
    });
  });
});
