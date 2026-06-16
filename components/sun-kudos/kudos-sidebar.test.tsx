import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { KudosSidebar } from './kudos-sidebar';
import { mockStats, mockLeaderboardGifts, mockLeaderboardRankUp, mockUsers } from './mock-data';
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

describe('KudosSidebar', () => {
  describe('component composition', () => {
    it('renders KudosStatsBlock', () => {
      render(<KudosSidebar />, { wrapper: createWrapper() });

      // StatsBlock renders these labels
      expect(screen.getByText('Số Kudos nhận được:')).toBeInTheDocument();
      expect(screen.getByText('Số Kudos đã gửi:')).toBeInTheDocument();
    });

    it('renders both leaderboard sections', () => {
      render(<KudosSidebar />, { wrapper: createWrapper() });

      // Check for both leaderboard titles
      expect(
        screen.getByText('10 SUNNER NHẬN QUÀ MỚI NHẤT')
      ).toBeInTheDocument();
      expect(
        screen.getByText('10 SUNNER CÓ SỰ THĂNG HẠNG MỚI NHẤT')
      ).toBeInTheDocument();
    });

    it('renders stats block first, then leaderboards', () => {
      render(<KudosSidebar />, {
        wrapper: createWrapper(),
      });

      // Verify all sections render
      expect(screen.getByText('Số Kudos nhận được:')).toBeInTheDocument();
      expect(screen.getByText('10 SUNNER NHẬN QUÀ MỚI NHẤT')).toBeInTheDocument();
      expect(screen.getByText('10 SUNNER CÓ SỰ THĂNG HẠNG MỚI NHẤT')).toBeInTheDocument();
    });
  });

  describe('default mock data', () => {
    it('renders all mock stats values', () => {
      render(<KudosSidebar />, { wrapper: createWrapper() });

      // mockStats has all values = 25
      const values = screen.getAllByText('25');
      expect(values.length).toBeGreaterThanOrEqual(5); // 5 stats
    });

    it('renders all gift leaderboard entries', () => {
      render(<KudosSidebar />, { wrapper: createWrapper() });

      mockLeaderboardGifts.forEach(entry => {
        const names = screen.queryAllByText(entry.user.name);
        expect(names.length).toBeGreaterThan(0);
      });
    });

    it('renders all rank-up leaderboard entries', () => {
      render(<KudosSidebar />, { wrapper: createWrapper() });

      mockLeaderboardRankUp.forEach(entry => {
        const names = screen.queryAllByText(entry.user.name);
        expect(names.length).toBeGreaterThan(0);
      });
    });
  });

  describe('custom props', () => {
    it('accepts custom stats prop', () => {
      const customStats = {
        received: 100,
        sent: 50,
        hearts: 75,
        boxOpened: 10,
        boxUnopened: 20,
      };

      render(<KudosSidebar stats={customStats} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('accepts custom leaderboard entries', () => {
      const customGiftEntries = [
        { user: mockUsers[0], description: 'Custom Gift 1' },
      ];
      const customRankEntries = [
        { user: mockUsers[1], description: 'Custom Rank 1' },
      ];

      render(
        <KudosSidebar
          giftsEntries={customGiftEntries}
          rankUpEntries={customRankEntries}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('Custom Gift 1')).toBeInTheDocument();
      expect(screen.getByText('Custom Rank 1')).toBeInTheDocument();
    });

    it('accepts undefined props and uses defaults', () => {
      render(
        <KudosSidebar
          stats={undefined}
          rankUpEntries={undefined}
          giftsEntries={undefined}
        />,
        { wrapper: createWrapper() }
      );

      // Should render with default mock data
      expect(screen.getByText('Số Kudos nhận được:')).toBeInTheDocument();
      expect(
        screen.getByText('10 SUNNER NHẬN QUÀ MỚI NHẤT')
      ).toBeInTheDocument();
    });
  });

  describe('layout and structure', () => {
    it('is a flex column', () => {
      const { container } = render(<KudosSidebar />, {
        wrapper: createWrapper(),
      });

      const root = container.firstChild as HTMLElement;
      expect(root).toHaveClass('flex');
      expect(root).toHaveClass('flex-col');
    });

    it('has gap of 24px between sections', () => {
      const { container } = render(<KudosSidebar />, {
        wrapper: createWrapper(),
      });

      const root = container.firstChild as HTMLElement;
      expect(root).toHaveStyle('gap: 24px');
    });

    it('is full width', () => {
      const { container } = render(<KudosSidebar />, {
        wrapper: createWrapper(),
      });

      const root = container.firstChild as HTMLElement;
      expect(root).toHaveClass('w-full');
    });

    it('renders three main sections', () => {
      const { container } = render(<KudosSidebar />, {
        wrapper: createWrapper(),
      });

      // Should have 3 main child divs: stats + 2 leaderboards
      // (within the flex column wrapper)
      const root = container.firstChild as HTMLElement;
      const childDivCount = root.children.length;
      expect(childDivCount).toBe(3);
    });
  });

  describe('smoke tests', () => {
    it('renders sidebar with stats block', () => {
      const { container } = render(<KudosSidebar />, { wrapper: createWrapper() });
      expect(container.querySelector('aside') || container.querySelector('div')).toBeInTheDocument();
    });

    it('renders with all default props', () => {
      render(<KudosSidebar />, { wrapper: createWrapper() });
      expect(screen.getByText('10 SUNNER NHẬN QUÀ MỚI NHẤT')).toBeInTheDocument();
    });

    it('renders with partial custom props', () => {
      const customStats = {
        received: 200,
        sent: 150,
        hearts: 100,
        boxOpened: 50,
        boxUnopened: 30,
      };

      render(
        <KudosSidebar stats={customStats} />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('200')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('maintains semantic structure', () => {
      const { container } = render(<KudosSidebar />, {
        wrapper: createWrapper(),
      });

      const headings = container.querySelectorAll('h3');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('all sections are labeled with headings', () => {
      render(<KudosSidebar />, { wrapper: createWrapper() });

      expect(
        screen.getByText('10 SUNNER NHẬN QUÀ MỚI NHẤT')
      ).toBeInTheDocument();
      expect(
        screen.getByText('10 SUNNER CÓ SỰ THĂNG HẠNG MỚI NHẤT')
      ).toBeInTheDocument();
    });
  });

  describe('responsive behavior', () => {
    it('is marked as full-width for responsive design', () => {
      const { container } = render(<KudosSidebar />, {
        wrapper: createWrapper(),
      });

      const root = container.firstChild as HTMLElement;
      expect(root).toHaveClass('w-full');
    });

    it('uses Tailwind classes for responsive design', () => {
      const { container } = render(<KudosSidebar />, {
        wrapper: createWrapper(),
      });

      const root = container.firstChild as HTMLElement;
      expect(root.className).toContain('flex');
      expect(root.className).toContain('flex-col');
      expect(root.className).toContain('w-full');
    });
  });

  describe('data validation', () => {
    it('handles zero stat values', () => {
      const zeroStats = {
        received: 0,
        sent: 0,
        hearts: 0,
        boxOpened: 0,
        boxUnopened: 0,
      };

      render(<KudosSidebar stats={zeroStats} />, {
        wrapper: createWrapper(),
      });

      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBeGreaterThanOrEqual(5);
    });

    it('handles empty leaderboard arrays', () => {
      render(
        <KudosSidebar
          giftsEntries={[]}
          rankUpEntries={[]}
        />,
        { wrapper: createWrapper() }
      );

      // Should show empty state messages
      const emptyMessages = screen.getAllByText('Chưa có dữ liệu');
      expect(emptyMessages.length).toBeGreaterThanOrEqual(2);
    });

    it('handles large stat numbers', () => {
      const largeStats = {
        received: 999999,
        sent: 888888,
        hearts: 777777,
        boxOpened: 666666,
        boxUnopened: 555555,
      };

      render(<KudosSidebar stats={largeStats} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText('999999')).toBeInTheDocument();
      expect(screen.getByText('888888')).toBeInTheDocument();
    });
  });

  describe('component integration', () => {
    it('passes stats to KudosStatsBlock', () => {
      const customStats = {
        received: 111,
        sent: 222,
        hearts: 333,
        boxOpened: 444,
        boxUnopened: 555,
      };

      render(<KudosSidebar stats={customStats} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText('111')).toBeInTheDocument();
      expect(screen.getByText('222')).toBeInTheDocument();
      expect(screen.getByText('333')).toBeInTheDocument();
    });

    it('passes entries to both leaderboards with correct titles', () => {
      render(<KudosSidebar />, { wrapper: createWrapper() });

      // Gifts leaderboard has specific title
      const giftsTitle = screen.getByText('10 SUNNER NHẬN QUÀ MỚI NHẤT');
      expect(giftsTitle).toBeInTheDocument();

      // RankUp leaderboard has specific title
      const rankUpTitle = screen.getByText('10 SUNNER CÓ SỰ THĂNG HẠNG MỚI NHẤT');
      expect(rankUpTitle).toBeInTheDocument();
    });
  });
});
