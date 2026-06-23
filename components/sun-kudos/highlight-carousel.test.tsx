import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { HighlightCarousel } from './highlight-carousel';
import type { Kudos } from './types';
import messagesVi from '../../messages/vi.json';

const messages = {
  sunKudos: messagesVi.sunKudos,
};

const mockKudos: Kudos[] = [
  {
    id: '1',
    sender: { id: '1', name: 'Alice', avatarUrl: '', department: 'Engineering', stars: 0, badge: '' },
    receiver: { id: '2', name: 'Bob', avatarUrl: '', department: 'Engineering', stars: 0, badge: '' },
    awardTitle: 'Team Player',
    contentVi: 'Great work!',
    hashtags: ['#teamwork'],
    imageUrls: [],
    likeCount: 5,
    likedByMe: false,
    isOwn: false,
    postedAt: new Date().toISOString(),
  },
  {
    id: '2',
    sender: { id: '3', name: 'Charlie', avatarUrl: '', department: 'Product', stars: 0, badge: '' },
    receiver: { id: '4', name: 'David', avatarUrl: '', department: 'Product', stars: 0, badge: '' },
    awardTitle: 'Innovator',
    contentVi: 'Amazing contribution',
    hashtags: ['#innovation'],
    imageUrls: [],
    likeCount: 8,
    likedByMe: false,
    isOwn: false,
    postedAt: new Date().toISOString(),
  },
  {
    id: '3',
    sender: { id: '5', name: 'Eve', avatarUrl: '', department: 'Support', stars: 0, badge: '' },
    receiver: { id: '6', name: 'Frank', avatarUrl: '', department: 'Support', stars: 0, badge: '' },
    awardTitle: 'Helper',
    contentVi: 'Thank you!',
    hashtags: ['#support'],
    imageUrls: [],
    likeCount: 3,
    likedByMe: false,
    isOwn: false,
    postedAt: new Date().toISOString(),
  },
];

const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="vi" messages={messages}>
      {component}
    </NextIntlClientProvider>,
  );
};

describe('HighlightCarousel', () => {
  describe('Empty state', () => {
    it('renders empty message when no kudos provided', () => {
      renderWithI18n(<HighlightCarousel kudos={[]} />);
      expect(screen.getByText('Hiện tại chưa có Kudos nào.')).toBeInTheDocument();
    });

    it('renders empty message with correct dimensions (100% width, 525px height)', () => {
      const { container } = renderWithI18n(<HighlightCarousel kudos={[]} />);
      const emptyDiv = container.querySelector('div[style*="height: 525"]');
      expect(emptyDiv).toBeInTheDocument();
    });
  });

  describe('Single kudos', () => {
    it('renders single kudos card', () => {
      renderWithI18n(<HighlightCarousel kudos={[mockKudos[0]]} />);
      // Component renders card through HighlightKudosCard child
      const navButtons = screen.getAllByRole('button');
      expect(navButtons.length).toBeGreaterThan(0);
    });

    it('disables prev button at first (and only) index', () => {
      renderWithI18n(<HighlightCarousel kudos={[mockKudos[0]]} />);
      const prevButtons = screen.getAllByLabelText('Previous kudos');
      prevButtons.forEach(btn => {
        expect(btn).toBeDisabled();
      });
    });

    it('disables next button at first (and only) index', () => {
      renderWithI18n(<HighlightCarousel kudos={[mockKudos[0]]} />);
      const nextButtons = screen.getAllByLabelText('Next kudos');
      nextButtons.forEach(btn => {
        expect(btn).toBeDisabled();
      });
    });

    it('shows pagination label "1/1"', () => {
      renderWithI18n(<HighlightCarousel kudos={[mockKudos[0]]} />);
      expect(screen.getByText('1/1')).toBeInTheDocument();
    });
  });

  describe('Multiple kudos navigation', () => {
    it('disables prev button at first index', () => {
      renderWithI18n(<HighlightCarousel kudos={mockKudos} />);
      const prevButtons = screen.getAllByLabelText('Previous kudos');
      prevButtons.forEach(btn => {
        expect(btn).toBeDisabled();
      });
    });

    it('enables next button at first index', () => {
      renderWithI18n(<HighlightCarousel kudos={mockKudos} />);
      const nextButtons = screen.getAllByLabelText('Next kudos');
      expect(nextButtons.length).toBeGreaterThan(0);
      nextButtons.forEach(btn => {
        // At least one next button should be enabled
        if (btn.getAttribute('aria-label') === 'Next kudos') {
          // Check if it's not disabled by looking for opacity style
          const style = (btn as HTMLElement).style;
          expect(style.opacity).not.toBe('0.3');
        }
      });
    });

    it('shows pagination label "1/3" initially', () => {
      renderWithI18n(<HighlightCarousel kudos={mockKudos} />);
      expect(screen.getByText('1/3')).toBeInTheDocument();
    });

    it('advances to next kudos and updates pagination', async () => {
      renderWithI18n(<HighlightCarousel kudos={mockKudos} />);
      const nextButtons = screen.getAllByLabelText('Next kudos');
      const nextButton = nextButtons[nextButtons.length - 1]; // Last next button (nav bar)

      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('2/3')).toBeInTheDocument();
      });
    });

    it('disables next button at last index', async () => {
      renderWithI18n(<HighlightCarousel kudos={mockKudos} />);
      const nextButtons = screen.getAllByLabelText('Next kudos');
      const nextButton = nextButtons[nextButtons.length - 1];

      // Click to last
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('3/3')).toBeInTheDocument();
      });

      nextButtons.forEach(btn => {
        if (btn.getAttribute('aria-label') === 'Next kudos') {
          expect(btn).toBeDisabled();
        }
      });
    });

    it('enables prev button after advancing past first index', async () => {
      renderWithI18n(<HighlightCarousel kudos={mockKudos} />);
      const nextButtons = screen.getAllByLabelText('Next kudos');
      const nextButton = nextButtons[nextButtons.length - 1];

      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('2/3')).toBeInTheDocument();
        const prevButtons = screen.getAllByLabelText('Previous kudos');
        expect(prevButtons.length).toBeGreaterThan(0);
        // At least one prev should be enabled
        prevButtons.forEach(btn => {
          if (btn.getAttribute('aria-label') === 'Previous kudos') {
            expect(btn).not.toBeDisabled();
          }
        });
      });
    });

    it('goes back to previous kudos on prev click', async () => {
      renderWithI18n(<HighlightCarousel kudos={mockKudos} />);

      // Navigate forward twice
      const nextButtons = screen.getAllByLabelText('Next kudos');
      const nextButton = nextButtons[nextButtons.length - 1];
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('3/3')).toBeInTheDocument();
      });

      // Navigate back
      const prevButtons = screen.getAllByLabelText('Previous kudos');
      const prevButton = prevButtons[prevButtons.length - 1];
      fireEvent.click(prevButton);

      await waitFor(() => {
        expect(screen.getByText('2/3')).toBeInTheDocument();
      });
    });

    it('handles rapid prev/next clicks correctly', async () => {
      renderWithI18n(<HighlightCarousel kudos={mockKudos} />);
      const nextButtons = screen.getAllByLabelText('Next kudos');
      const prevButtons = screen.getAllByLabelText('Previous kudos');
      const nextButton = nextButtons[nextButtons.length - 1];
      const prevButton = prevButtons[prevButtons.length - 1];

      // Rapid navigation: forward, forward, back, forward
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(prevButton);
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('3/3')).toBeInTheDocument();
      });
    });

    it('clamps index to valid range (no negative, no over-max)', async () => {
      renderWithI18n(<HighlightCarousel kudos={mockKudos} />);
      const nextButtons = screen.getAllByLabelText('Next kudos');
      const prevButtons = screen.getAllByLabelText('Previous kudos');
      const nextButton = nextButtons[nextButtons.length - 1];
      const prevButton = prevButtons[prevButtons.length - 1];

      // Try to go before first
      fireEvent.click(prevButton);
      fireEvent.click(prevButton);

      await waitFor(() => {
        expect(screen.getByText('1/3')).toBeInTheDocument();
      });

      // Try to go past last
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('3/3')).toBeInTheDocument();
      });
    });
  });

  describe('Pagination labels', () => {
    it('shows correct format "currentIndex/total"', () => {
      renderWithI18n(<HighlightCarousel kudos={mockKudos} />);
      const label = screen.getByText('1/3');
      expect(label).toBeInTheDocument();
      expect(label.textContent).toMatch(/^\d+\/\d+$/);
    });

    it('updates pagination after each navigation', async () => {
      renderWithI18n(<HighlightCarousel kudos={mockKudos} />);
      const nextButtons = screen.getAllByLabelText('Next kudos');
      const nextButton = nextButtons[nextButtons.length - 1];

      expect(screen.getByText('1/3')).toBeInTheDocument();

      fireEvent.click(nextButton);
      await waitFor(() => expect(screen.getByText('2/3')).toBeInTheDocument());

      fireEvent.click(nextButton);
      await waitFor(() => expect(screen.getByText('3/3')).toBeInTheDocument());
    });
  });

  describe('Button accessibility', () => {
    it('has proper aria-labels for navigation buttons', () => {
      renderWithI18n(<HighlightCarousel kudos={mockKudos} />);
      const prevLabels = screen.getAllByLabelText('Previous kudos');
      const nextLabels = screen.getAllByLabelText('Next kudos');
      expect(prevLabels.length).toBeGreaterThan(0);
      expect(nextLabels.length).toBeGreaterThan(0);
    });

    it('buttons are keyboard accessible (type="button")', () => {
      const { container } = renderWithI18n(<HighlightCarousel kudos={mockKudos} />);
      const buttons = container.querySelectorAll('button');
      buttons.forEach(btn => {
        expect(btn.getAttribute('type')).toBe('button');
      });
    });
  });

  describe('Visual structure', () => {
    it('renders carousel viewport with overflow hidden', () => {
      const { container } = renderWithI18n(<HighlightCarousel kudos={mockKudos} />);
      const viewport = container.querySelector('[style*="overflow: hidden"]');
      expect(viewport).toBeInTheDocument();
      expect(viewport).toHaveStyle('height: 525px');
    });

    it('has left and right gradient overlays', () => {
      const { container } = renderWithI18n(<HighlightCarousel kudos={mockKudos} />);
      const divs = container.querySelectorAll('div[style*="position: absolute"]');
      // Should have left overlay, right overlay
      expect(divs.length).toBeGreaterThanOrEqual(2);
    });

    it('pagination nav displays with proper alignment', () => {
      const { container } = renderWithI18n(<HighlightCarousel kudos={mockKudos} />);
      const allDivs = container.querySelectorAll('div');
      let navDiv = null;
      allDivs.forEach(div => {
        const style = div.getAttribute('style');
        if (style && style.includes('justify-content') && style.includes('gap: 32')) {
          navDiv = div;
        }
      });
      expect(navDiv).toBeInTheDocument();
      expect(navDiv).toHaveStyle('gap: 32px');
      expect(navDiv).toHaveStyle('height: 52px');
    });

    it('cards are rendered as children', () => {
      const { container } = renderWithI18n(<HighlightCarousel kudos={mockKudos} />);
      // HighlightKudosCard components should be rendered
      const track = container.querySelector('[style*="display: flex"]');
      expect(track).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles two kudos correctly', async () => {
      const twoKudos = mockKudos.slice(0, 2);
      renderWithI18n(<HighlightCarousel kudos={twoKudos} />);

      expect(screen.getByText('1/2')).toBeInTheDocument();

      const nextButtons = screen.getAllByLabelText('Next kudos');
      const nextButton = nextButtons[nextButtons.length - 1];
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('2/2')).toBeInTheDocument();
      });

      const nextButtonsAfter = screen.getAllByLabelText('Next kudos');
      expect(nextButtonsAfter[nextButtonsAfter.length - 1]).toBeDisabled();
    });

    it('handles large number of kudos (10+)', () => {
      const manyKudos = Array.from({ length: 15 }, (_, i) => ({
        ...mockKudos[0],
        id: `${i}`,
      }));

      renderWithI18n(<HighlightCarousel kudos={manyKudos} />);
      expect(screen.getByText('1/15')).toBeInTheDocument();
    });

    it('correctly updates state on prop change', async () => {
      const { rerender } = renderWithI18n(<HighlightCarousel kudos={mockKudos} />);

      expect(screen.getByText('1/3')).toBeInTheDocument();

      // Rerender with different kudos (size change)
      const newKudos = mockKudos.slice(0, 1);
      rerender(
        <NextIntlClientProvider locale="vi" messages={messages}>
          <HighlightCarousel kudos={newKudos} />
        </NextIntlClientProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('1/1')).toBeInTheDocument();
      });
    });
  });

  describe('Button state transitions', () => {
    it('button opacity reflects disabled state visually', async () => {
      renderWithI18n(<HighlightCarousel kudos={mockKudos} />);
      const prevButtons = screen.getAllByLabelText('Previous kudos');

      prevButtons.forEach(btn => {
        // At start, prev buttons should have opacity 0.3 (disabled)
        const style = (btn as HTMLElement).style;
        expect(style.opacity).toBe('0.3');
      });
    });

    it('enables/disables buttons appropriately on navigation', async () => {
      renderWithI18n(<HighlightCarousel kudos={mockKudos} />);
      const nextButtons = screen.getAllByLabelText('Next kudos');
      const nextButton = nextButtons[nextButtons.length - 1];

      // At position 1, next is enabled
      expect(nextButton).not.toBeDisabled();

      // Navigate to position 3
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      await waitFor(() => {
        const updatedNextButtons = screen.getAllByLabelText('Next kudos');
        const updatedNextButton = updatedNextButtons[updatedNextButtons.length - 1];
        expect(updatedNextButton).toBeDisabled();
      });
    });
  });
});
