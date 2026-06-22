import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { HighlightKudosSection } from './highlight-kudos-section';
import messagesVi from '../../messages/vi.json';

const messages = {
  sunKudos: messagesVi.sunKudos,
};

const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="vi" messages={messages}>
      {component}
    </NextIntlClientProvider>,
  );
};

describe('HighlightKudosSection', () => {
  describe('Rendering', () => {
    it('renders section element', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('renders with aria-label from i18n', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const section = container.querySelector('section[aria-label]');
      expect(section).toHaveAttribute('aria-label', 'HIGHLIGHT KUDOS');
    });

    it('renders section subtitle', () => {
      renderWithI18n(<HighlightKudosSection />);
      expect(screen.getByText('Sun* Annual Awards 2025')).toBeInTheDocument();
    });

    it('renders "HIGHLIGHT KUDOS" title', () => {
      renderWithI18n(<HighlightKudosSection />);
      expect(screen.getByText('HIGHLIGHT KUDOS')).toBeInTheDocument();
    });

    it('renders divider', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const divider = container.querySelector('div[style*="height: 1"]');
      expect(divider).toBeInTheDocument();
    });

    it('renders filter buttons', () => {
      renderWithI18n(<HighlightKudosSection />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('renders section title in container', () => {
      renderWithI18n(<HighlightKudosSection />);
      expect(screen.getByText('HIGHLIGHT KUDOS')).toBeInTheDocument();
    });
  });

  describe('Title styling', () => {
    it('subtitle uses Montserrat 700 24px white', () => {
      renderWithI18n(<HighlightKudosSection />);
      const subtitle = screen.getByText('Sun* Annual Awards 2025');
      expect(subtitle).toHaveStyle('fontFamily: Montserrat, sans-serif');
      expect(subtitle).toHaveStyle('fontWeight: 700');
      expect(subtitle).toHaveStyle('fontSize: 24px');
      expect(subtitle).toHaveStyle('color: #FFFFFF');
    });

    it('main title is h2 element', () => {
      renderWithI18n(<HighlightKudosSection />);
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveTextContent('HIGHLIGHT KUDOS');
    });

    it('main title uses responsive font with clamp', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const title = screen.getByText('HIGHLIGHT KUDOS');
      expect(title).toHaveStyle('fontSize: clamp(32px, 4vw, 57px)');
    });

    it('main title is gold #FFEA9E', () => {
      renderWithI18n(<HighlightKudosSection />);
      const title = screen.getByText('HIGHLIGHT KUDOS');
      expect(title).toHaveStyle('color: #FFEA9E');
    });

    it('main title has 0 margin', () => {
      renderWithI18n(<HighlightKudosSection />);
      const title = screen.getByText('HIGHLIGHT KUDOS');
      expect(title).toHaveStyle('margin: 0');
    });
  });

  describe('Section structure', () => {
    it('section is flex column layout', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const section = container.querySelector('section');
      expect(section).toHaveStyle('display: flex');
      expect(section).toHaveStyle('flexDirection: column');
    });

    it('section has 40px gap', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const section = container.querySelector('section');
      expect(section).toHaveStyle('gap: 40px');
    });

    it('section is full width', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const section = container.querySelector('section');
      expect(section).toHaveStyle('width: 100%');
    });

    it('section has overflow hidden', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const section = container.querySelector('section');
      expect(section).toHaveStyle('overflow: hidden');
    });
  });

  describe('Header layout', () => {
    it('header is flex column layout', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const section = container.querySelector('section');
      const headerDiv = section?.children[0];
      expect(headerDiv).toHaveStyle('flexDirection: column');
    });

    it('header has 16px gap', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const section = container.querySelector('section');
      const headerDiv = section?.children[0];
      expect(headerDiv).toHaveStyle('gap: 16px');
    });

    it('header uses responsive padding', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const section = container.querySelector('section');
      const firstChild = section?.firstElementChild;
      expect(firstChild).toHaveStyle('paddingInline: clamp(16px, 10vw, 144px)');
    });
  });

  describe('Title and filters row', () => {
    it('renders title and filters in space-between layout', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const h2 = screen.getByText('HIGHLIGHT KUDOS');
      const titleRow = h2.parentElement;
      expect(titleRow).toHaveStyle('justifyContent: space-between');
    });

    it('filters are right-aligned with title on left', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const h2 = screen.getByText('HIGHLIGHT KUDOS');
      const titleRow = h2.parentElement;
      expect(titleRow).toHaveStyle('display: flex');
      expect(titleRow).toHaveStyle('flexDirection: row');
      expect(titleRow).toHaveStyle('alignItems: center');
    });

    it('title does not shrink in row', () => {
      renderWithI18n(<HighlightKudosSection />);
      const title = screen.getByText('HIGHLIGHT KUDOS');
      expect(title).toHaveStyle('flexShrink: 0');
    });
  });

  describe('Divider styling', () => {
    it('divider is 1px height', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const divider = container.querySelector('div[style*="height: 1"]');
      expect(divider).toHaveStyle('height: 1px');
    });

    it('divider background is #2E3940', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const divider = container.querySelector('div[style*="height: 1"]');
      expect(divider).toHaveStyle('background: #2E3940');
    });

    it('divider is aria-hidden', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const divider = container.querySelector('div[aria-hidden="true"][style*="height: 1"]');
      expect(divider).toBeInTheDocument();
    });
  });

  describe('Filter buttons', () => {
    it('renders hashtag filter button', () => {
      renderWithI18n(<HighlightKudosSection />);
      const buttons = screen.getAllByRole('button');
      // At minimum: 2 filter buttons in header
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('filter buttons render with aria-haspopup', () => {
      renderWithI18n(<HighlightKudosSection />);
      const buttons = screen.getAllByRole('button').filter(btn =>
        btn.hasAttribute('aria-haspopup')
      );
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('filters display closed state initially', () => {
      renderWithI18n(<HighlightKudosSection />);
      const buttons = screen.getAllByRole('button').filter(btn =>
        btn.hasAttribute('aria-haspopup')
      );
      // Verify filter buttons have aria-expanded set to false initially
      buttons.forEach(btn => {
        expect(btn).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });

  describe('Carousel integration', () => {
    it('renders section with carousel container', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('carousel is after header section', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const section = container.querySelector('section');
      const children = section?.children;
      expect(children?.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Spacing', () => {
    it('header and carousel have 40px gap', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const section = container.querySelector('section');
      expect(section).toHaveStyle('gap: 40px');
    });

    it('title and filters have 32px gap', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const titleFilterRow = Array.from(container.querySelectorAll('div')).find(
        div => div.style.gap === '32px'
      );
      expect(titleFilterRow).toBeDefined();
      expect(titleFilterRow).toHaveStyle('gap: 32px');
    });
  });

  describe('Accessibility', () => {
    it('section is properly labeled', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const section = container.querySelector('section[aria-label]');
      expect(section).toHaveAttribute('aria-label');
    });

    it('title is semantic h2', () => {
      renderWithI18n(<HighlightKudosSection />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('divider is hidden from accessibility tree', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const divider = container.querySelector('[aria-hidden="true"][style*="height: 1"]');
      expect(divider).toBeInTheDocument();
    });
  });

  describe('Responsive behavior', () => {
    it('header padding is responsive with clamp', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const headerDiv = Array.from(container.querySelectorAll('div')).find(
        div => div.style.paddingInline?.includes('clamp')
      );
      expect(headerDiv).toBeDefined();
      expect(headerDiv?.style.paddingInline).toMatch(/clamp/);
    });

    it('box-sizing is border-box', () => {
      const { container } = renderWithI18n(<HighlightKudosSection />);
      const headerDiv = Array.from(container.querySelectorAll('div')).find(
        div => div.style.boxSizing === 'border-box'
      );
      expect(headerDiv).toBeDefined();
      expect(headerDiv).toHaveStyle('boxSizing: border-box');
    });
  });
});
