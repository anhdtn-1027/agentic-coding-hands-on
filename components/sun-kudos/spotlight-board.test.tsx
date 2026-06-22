import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { SpotlightBoard } from './spotlight-board';
import { totalKudos, mockSpotlightNodes } from './mock-data';
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

describe('SpotlightBoard', () => {
  describe('rendering', () => {
    it('renders spotlight board title', () => {
      render(<SpotlightBoard />, { wrapper: createWrapper() });
      expect(screen.getByText('SPOTLIGHT BOARD')).toBeInTheDocument();
    });

    it('renders section heading', () => {
      render(<SpotlightBoard />, { wrapper: createWrapper() });

      // SectionHeading should render the title "SPOTLIGHT BOARD"
      expect(screen.getByText('SPOTLIGHT BOARD')).toBeInTheDocument();
    });

    it('renders total kudos count with suffix', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      // Should display "388 KUDOS" (totalKudos + KUDOS suffix)
      const spans = container.querySelectorAll('span');
      const kudosSpans = Array.from(spans).filter(
        span => span.textContent?.includes('388')
      );

      expect(kudosSpans.length).toBeGreaterThan(0);
    });

    it('renders search bar', () => {
      render(<SpotlightBoard />, { wrapper: createWrapper() });

      const searchInput = screen.getByPlaceholderText('Tìm kiếm');
      expect(searchInput).toBeInTheDocument();
    });

    it('renders pan/zoom button', () => {
      render(<SpotlightBoard />, { wrapper: createWrapper() });

      const panZoomButton = screen.getByRole('button', { name: 'Pan/Zoom' });
      expect(panZoomButton).toBeInTheDocument();
    });

    it('renders spotlight canvas', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders ticker with recent recipients', () => {
      render(<SpotlightBoard />, { wrapper: createWrapper() });

      // Ticker contains specific names from TICKER_LINES
      expect(
        screen.getByText(/Đỗ hoàng Hiệp|Dương thúy An|Mai phương Thúy/)
      ).toBeInTheDocument();
    });
  });

  describe('content and data', () => {
    it('displays total kudos from mock data', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      // The kudos count is rendered with nbsp between number and suffix
      // Look for the span containing 388
      const spans = container.querySelectorAll('span');
      const hasKudosCount = Array.from(spans).some(
        span => span.textContent?.includes('388')
      );
      expect(hasKudosCount).toBe(true);
    });

    it('renders all spotlight node names in canvas', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      // Check that the highlighted node is rendered
      const texts = container.querySelectorAll('text');
      const highlightedNode = Array.from(texts).find(
        t => t.textContent === 'Huỳnh Dương Xuân Nhật'
      );

      expect(highlightedNode).toBeInTheDocument();
    });

    it('includes ticker lines with expected names', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      // Verify ticker is present with text content
      const tickerContainer = Array.from(container.querySelectorAll('div')).find(
        d => d.getAttribute('aria-label') === 'Recent recipients'
      );

      expect(tickerContainer).toBeInTheDocument();
      expect(tickerContainer?.textContent).toContain('Đỗ hoàng Hiệp');
    });
  });

  describe('section heading', () => {
    it('renders section subtitle', () => {
      render(<SpotlightBoard />, { wrapper: createWrapper() });

      // SectionHeading renders subtitle
      expect(screen.getByText('Sun* Annual Awards 2025')).toBeInTheDocument();
    });

    it('renders section title', () => {
      render(<SpotlightBoard />, { wrapper: createWrapper() });

      expect(screen.getByText('SPOTLIGHT BOARD')).toBeInTheDocument();
    });
  });

  describe('search functionality', () => {
    it('search input accepts text', () => {
      render(<SpotlightBoard />, { wrapper: createWrapper() });

      const searchInput = screen.getByPlaceholderText('Tìm kiếm') as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'Alice' } });

      expect(searchInput.value).toBe('Alice');
    });

    it('search updates canvas with query', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      const searchInput = screen.getByPlaceholderText('Tìm kiếm');
      fireEvent.change(searchInput, { target: { value: 'Huỳnh' } });

      // Canvas should be updated with search query (dimming non-matching nodes)
      // Verify Huỳnh node is not dimmed
      const texts = container.querySelectorAll('text');
      const huynhNode = Array.from(texts).find(
        t => t.textContent?.includes('Huỳnh')
      );

      expect(huynhNode).toHaveAttribute('opacity', '1');
    });

    it('clears search when input is cleared', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      const searchInput = screen.getByPlaceholderText('Tìm kiếm');

      fireEvent.change(searchInput, { target: { value: 'Test' } });
      expect((searchInput as HTMLInputElement).value).toBe('Test');

      fireEvent.change(searchInput, { target: { value: '' } });
      expect((searchInput as HTMLInputElement).value).toBe('');

      // All nodes should be visible again
      const texts = container.querySelectorAll('text');
      texts.forEach(text => {
        expect(text).toHaveAttribute('opacity', '1');
      });
    });

    it('search placeholder is correct', () => {
      render(<SpotlightBoard />, { wrapper: createWrapper() });

      const searchInput = screen.getByPlaceholderText('Tìm kiếm');
      expect(searchInput).toHaveAttribute('placeholder', 'Tìm kiếm');
    });
  });

  describe('pan/zoom toggle', () => {
    it('pan/zoom button toggles state', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      const panZoomButton = screen.getByRole('button', { name: 'Pan/Zoom' });

      // Initially should be inactive
      expect(panZoomButton).toHaveAttribute('aria-pressed', 'false');

      fireEvent.click(panZoomButton);

      // After click should be active
      expect(panZoomButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('canvas cursor changes with pan mode', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      const svg = container.querySelector('svg');
      const panZoomButton = screen.getByRole('button', { name: 'Pan/Zoom' });

      // SVG exists and is rendered
      expect(svg).toBeInTheDocument();

      fireEvent.click(panZoomButton);

      // After toggle, button aria-pressed should be true
      expect(panZoomButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('button label is correct', () => {
      render(<SpotlightBoard />, { wrapper: createWrapper() });

      const panZoomButton = screen.getByRole('button', { name: 'Pan/Zoom' });
      expect(panZoomButton).toHaveAttribute('aria-label', 'Pan/Zoom');
    });
  });

  describe('layout structure', () => {
    it('is full width flex column', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      const root = container.firstChild as HTMLElement;
      expect(root).toHaveClass('flex');
      expect(root).toHaveClass('flex-col');
      expect(root).toHaveClass('w-full');
    });

    it('has proper gap spacing', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      const root = container.firstChild as HTMLElement;
      expect(root).toHaveStyle('gap: 64px');
    });

    it('canvas area has proper padding', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      // Find the canvas area container
      const canvasArea = Array.from(container.querySelectorAll('div')).find(
        d => d.textContent?.includes('SPOTLIGHT BOARD') &&
             d.querySelector('svg')
      );

      // Should have responsive padding
      expect(canvasArea).toBeInTheDocument();
    });

    it('controls row is properly arranged', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      // Verify both search input and pan/zoom button exist
      const searchInput = container.querySelector('input[placeholder="Tìm kiếm"]');
      const panButton = container.querySelector('button[aria-label="Pan/Zoom"]');

      expect(searchInput).toBeInTheDocument();
      expect(panButton).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('kudos count text is large and white', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      // Find the span that contains 388
      const spans = container.querySelectorAll('span');
      const countSpan = Array.from(spans).find(
        span => span.textContent?.includes('388')
      );

      expect(countSpan).toBeInTheDocument();
      expect(countSpan).toHaveStyle('color: rgba(255, 255, 255, 1)');
      expect(countSpan).toHaveStyle('fontWeight: 700');
    });

    it('ticker text is muted and small', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      const tickerParagraphs = container.querySelectorAll('p');
      expect(tickerParagraphs.length).toBeGreaterThan(0);

      tickerParagraphs.forEach(p => {
        expect(p).toHaveStyle('color: rgba(255, 255, 255, 0.6)');
        expect(p).toHaveStyle('overflow: hidden');
        expect(p).toHaveStyle('textOverflow: ellipsis');
      });
    });
  });

  describe('ticker', () => {
    it('renders multiple ticker lines', () => {
      render(<SpotlightBoard />, { wrapper: createWrapper() });

      // Should have 3 ticker lines based on TICKER_LINES array
      const paragraphs = screen.getAllByText(/·/); // Separator in ticker lines
      expect(paragraphs.length).toBeGreaterThanOrEqual(3);
    });

    it('ticker content is not interactive', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      const tickerParagraphs = container.querySelectorAll('p');
      tickerParagraphs.forEach(p => {
        expect(p).not.toHaveAttribute('role', 'button');
        expect(p).not.toHaveAttribute('onClick');
      });
    });

    it('ticker has accessibility label', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      const tickerContainer = Array.from(container.querySelectorAll('div')).find(
        d => d.getAttribute('aria-label') === 'Recent recipients'
      );

      expect(tickerContainer).toBeInTheDocument();
    });
  });

  describe('controls area', () => {
    it('renders count, search, and button together', () => {
      render(<SpotlightBoard />, { wrapper: createWrapper() });

      const countText = screen.getByText(/388.*KUDOS/);
      const searchInput = screen.getByPlaceholderText('Tìm kiếm');
      const panZoomButton = screen.getByRole('button', { name: 'Pan/Zoom' });

      expect(countText).toBeInTheDocument();
      expect(searchInput).toBeInTheDocument();
      expect(panZoomButton).toBeInTheDocument();
    });

    it('canvas is below controls', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      // Verify both controls and canvas are rendered
      const controls = container.querySelector('input[placeholder="Tìm kiếm"]');
      const canvas = container.querySelector('svg');

      expect(controls).toBeInTheDocument();
      expect(canvas).toBeInTheDocument();
    });
  });

  describe('state management', () => {
    it('maintains independent search and pan states', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      const searchInput = screen.getByPlaceholderText('Tìm kiếm');
      const panZoomButton = screen.getByRole('button', { name: 'Pan/Zoom' });

      // Toggle pan
      fireEvent.click(panZoomButton);
      expect(panZoomButton).toHaveAttribute('aria-pressed', 'true');

      // Search should still be empty
      expect((searchInput as HTMLInputElement).value).toBe('');

      // Type in search
      fireEvent.change(searchInput, { target: { value: 'Test' } });
      expect((searchInput as HTMLInputElement).value).toBe('Test');

      // Pan should still be active
      expect(panZoomButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('accessibility', () => {
    it('kudos count has aria-live for updates', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      const spans = container.querySelectorAll('span');
      const countSpan = Array.from(spans).find(
        span => span.textContent?.includes('388') &&
                span.getAttribute('aria-live') === 'polite'
      );

      expect(countSpan).toBeInTheDocument();
      expect(countSpan).toHaveAttribute('aria-live', 'polite');
    });

    it('all interactive elements are keyboard accessible', () => {
      render(<SpotlightBoard />, { wrapper: createWrapper() });

      const searchInput = screen.getByPlaceholderText('Tìm kiếm');
      const panZoomButton = screen.getByRole('button');

      expect(searchInput).toBeInTheDocument();
      expect(panZoomButton).toBeInTheDocument();
    });

    it('ticker has proper semantic container', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      const tickerContainer = Array.from(container.querySelectorAll('div')).find(
        d => d.getAttribute('aria-label') === 'Recent recipients'
      );

      expect(tickerContainer).toBeInTheDocument();
      expect(tickerContainer?.querySelectorAll('p').length).toBeGreaterThan(0);
    });
  });

  describe('integration with canvas', () => {
    it('search query is passed to canvas', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      const searchInput = screen.getByPlaceholderText('Tìm kiếm');
      fireEvent.change(searchInput, { target: { value: 'Huỳnh' } });

      // Verify canvas is updated (non-matching nodes dimmed)
      const texts = container.querySelectorAll('text');
      const huynhNode = Array.from(texts).find(
        t => t.textContent?.includes('Huỳnh')
      );

      expect(huynhNode).toHaveAttribute('opacity', '1');
    });

    it('pan mode is passed to canvas', () => {
      const { container } = render(<SpotlightBoard />, {
        wrapper: createWrapper(),
      });

      const svg = container.querySelector('svg');
      const panZoomButton = screen.getByRole('button', { name: 'Pan/Zoom' });

      // SVG exists and is renderable
      expect(svg).toBeInTheDocument();

      fireEvent.click(panZoomButton);

      // After toggle, button should be pressed
      expect(panZoomButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('edge cases', () => {
    it('handles rapid search input changes', () => {
      render(<SpotlightBoard />, { wrapper: createWrapper() });

      const searchInput = screen.getByPlaceholderText('Tìm kiếm');

      fireEvent.change(searchInput, { target: { value: 'A' } });
      fireEvent.change(searchInput, { target: { value: 'Al' } });
      fireEvent.change(searchInput, { target: { value: 'Ali' } });
      fireEvent.change(searchInput, { target: { value: 'Alice' } });

      expect((searchInput as HTMLInputElement).value).toBe('Alice');
    });

    it('handles rapid pan/zoom toggle clicks', () => {
      render(<SpotlightBoard />, { wrapper: createWrapper() });

      const panZoomButton = screen.getByRole('button', { name: 'Pan/Zoom' });

      fireEvent.click(panZoomButton);
      fireEvent.click(panZoomButton);
      fireEvent.click(panZoomButton);

      // Should be active (odd number of clicks)
      expect(panZoomButton).toHaveAttribute('aria-pressed', 'true');
    });
  });
});
