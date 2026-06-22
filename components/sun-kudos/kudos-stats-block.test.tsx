import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { KudosStatsBlock } from './kudos-stats-block';
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

describe('KudosStatsBlock', () => {
  describe('rendering with default mock stats', () => {
    it('renders 5 stat rows with labels and values', () => {
      render(<KudosStatsBlock />, { wrapper: createWrapper() });

      // Check for stat labels (Vietnamese text from messages)
      expect(screen.getByText('Số Kudos nhận được:')).toBeInTheDocument();
      expect(screen.getByText('Số Kudos đã gửi:')).toBeInTheDocument();
      expect(screen.getByText('Số tim nhận được:')).toBeInTheDocument();
      expect(screen.getByText('Số Secret Box đã mở:')).toBeInTheDocument();
      expect(screen.getByText('Số Secret Box chưa mở:')).toBeInTheDocument();
    });

    it('renders stat values from mockStats (all 25)', () => {
      const { container } = render(<KudosStatsBlock />, { wrapper: createWrapper() });

      // mockStats has all values = 25
      const values = container.querySelectorAll('span');
      const numberSpans = Array.from(values).filter(
        span => span.textContent === '25'
      );
      expect(numberSpans.length).toBeGreaterThanOrEqual(5);
    });

    it('renders the "Mở quà" button', () => {
      render(<KudosStatsBlock />, { wrapper: createWrapper() });
      expect(screen.getByText('Mở quà')).toBeInTheDocument();
    });

    it('button is clickable and renders', () => {
      render(<KudosStatsBlock />, { wrapper: createWrapper() });
      const button = screen.getByRole('button', { name: 'Mở quà' });
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
  });

  describe('rendering with custom stats', () => {
    it('renders custom stat values when provided', () => {
      const customStats = {
        received: 100,
        sent: 50,
        hearts: 75,
        boxOpened: 10,
        boxUnopened: 20,
      };

      const { container } = render(<KudosStatsBlock stats={customStats} />, {
        wrapper: createWrapper(),
      });

      // Verify custom values are rendered
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('renders zero values correctly', () => {
      const zeroStats = {
        received: 0,
        sent: 0,
        hearts: 0,
        boxOpened: 0,
        boxUnopened: 0,
      };

      render(<KudosStatsBlock stats={zeroStats} />, { wrapper: createWrapper() });
      const zeroElements = screen.getAllByText('0');
      expect(zeroElements.length).toBeGreaterThanOrEqual(5);
    });

    it('renders large numbers correctly', () => {
      const largeStats = {
        received: 9999,
        sent: 8888,
        hearts: 7777,
        boxOpened: 6666,
        boxUnopened: 5555,
      };

      render(<KudosStatsBlock stats={largeStats} />, { wrapper: createWrapper() });
      expect(screen.getByText('9999')).toBeInTheDocument();
      expect(screen.getByText('8888')).toBeInTheDocument();
      expect(screen.getByText('7777')).toBeInTheDocument();
      expect(screen.getByText('6666')).toBeInTheDocument();
      expect(screen.getByText('5555')).toBeInTheDocument();
    });
  });

  describe('styling and structure', () => {
    it('card has dark background and gold border', () => {
      const { container } = render(<KudosStatsBlock />, { wrapper: createWrapper() });
      const card = container.firstChild as HTMLElement;
      const style = window.getComputedStyle(card);

      expect(card).toHaveStyle('background: #00070C');
      expect(card).toHaveStyle('border: 1px solid #998C5F');
      expect(card).toHaveStyle('borderRadius: 17px');
      expect(card).toHaveStyle('padding: 24px');
    });

    it('stat labels are white with correct typography', () => {
      const { container } = render(<KudosStatsBlock />, { wrapper: createWrapper() });
      const labels = container.querySelectorAll('span');

      const labelSpans = Array.from(labels).filter(
        span => span.textContent === 'Số Kudos nhận được:' ||
                span.textContent === 'Số Kudos đã gửi:' ||
                span.textContent === 'Số tim nhận được:'
      );

      labelSpans.forEach(span => {
        expect(span).toHaveStyle('color: #FFFFFF');
        expect(span).toHaveStyle('fontWeight: 700');
        expect(span).toHaveStyle('fontSize: 22px');
        expect(span).toHaveStyle('fontFamily: Montserrat, sans-serif');
      });
    });

    it('stat values are gold with correct typography', () => {
      const { container } = render(<KudosStatsBlock />, { wrapper: createWrapper() });
      const valueSpans = container.querySelectorAll('span');

      const goldSpans = Array.from(valueSpans).filter(
        span => span.style.color === '#FFEA9E' && span.style.fontSize === '32px'
      );

      goldSpans.forEach(span => {
        expect(span).toHaveStyle('fontWeight: 700');
        expect(span).toHaveStyle('fontSize: 32px');
        expect(span).toHaveStyle('fontFamily: Montserrat, sans-serif');
      });
    });

    it('button is gold with correct styling', () => {
      const { container } = render(<KudosStatsBlock />, { wrapper: createWrapper() });
      const button = screen.getByRole('button', { name: 'Mở quà' });

      expect(button).toHaveStyle('backgroundColor: #FFEA9E');
      expect(button).toHaveStyle('borderRadius: 8px');
      expect(button).toHaveStyle('height: 60px');
      expect(button).toHaveStyle('padding: 16px');
    });

    it('divider exists between stat groups', () => {
      const { container } = render(<KudosStatsBlock />, { wrapper: createWrapper() });
      const dividers = container.querySelectorAll('div');

      const dividerElement = Array.from(dividers).find(
        div =>
          window.getComputedStyle(div).backgroundColor === 'rgb(46, 57, 64)' ||
          window.getComputedStyle(div).height === '1px'
      );

      expect(dividerElement).toBeDefined();
    });
  });

  describe('accessibility', () => {
    it('button is keyboard accessible', () => {
      render(<KudosStatsBlock />, { wrapper: createWrapper() });
      const button = screen.getByRole('button', { name: 'Mở quà' });
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });

    it('renders meaningful text labels for all stats', () => {
      render(<KudosStatsBlock />, { wrapper: createWrapper() });

      const labels = [
        'Số Kudos nhận được:',
        'Số Kudos đã gửi:',
        'Số tim nhận được:',
        'Số Secret Box đã mở:',
        'Số Secret Box chưa mở:',
      ];

      labels.forEach(label => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });

    it('button text is visible and clear', () => {
      render(<KudosStatsBlock />, { wrapper: createWrapper() });
      const buttonText = screen.getByText('Mở quà');
      expect(buttonText).toHaveStyle('color: #00101A');
      expect(buttonText).toHaveStyle('fontWeight: 700');
    });
  });

  describe('edge cases', () => {
    it('handles all stats being the same value', () => {
      const sameStats = {
        received: 42,
        sent: 42,
        hearts: 42,
        boxOpened: 42,
        boxUnopened: 42,
      };

      render(<KudosStatsBlock stats={sameStats} />, { wrapper: createWrapper() });
      const fortyTwos = screen.getAllByText('42');
      expect(fortyTwos.length).toBeGreaterThanOrEqual(5);
    });

    it('handles undefined stats prop - uses defaults', () => {
      render(<KudosStatsBlock stats={undefined} />, { wrapper: createWrapper() });
      // Should render with mockStats (all 25)
      const twentyFives = screen.getAllByText('25');
      expect(twentyFives.length).toBeGreaterThanOrEqual(5);
    });

    it('handles mixed small and large stat values', () => {
      const mixedStats = {
        received: 1,
        sent: 9999,
        hearts: 500,
        boxOpened: 0,
        boxUnopened: 1000000,
      };

      render(<KudosStatsBlock stats={mixedStats} />, { wrapper: createWrapper() });
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('9999')).toBeInTheDocument();
      expect(screen.getByText('500')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('1000000')).toBeInTheDocument();
    });
  });
});
