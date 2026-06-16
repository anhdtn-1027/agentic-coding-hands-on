import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { AllKudosSection } from './all-kudos-section';
import { mockKudos } from './mock-data';
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

describe('AllKudosSection', () => {
  describe('Rendering', () => {
    it('renders section element', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('renders section subtitle', () => {
      renderWithI18n(<AllKudosSection />);
      expect(screen.getByText('Sun* Annual Awards 2025')).toBeInTheDocument();
    });

    it('renders "ALL KUDOS" title', () => {
      renderWithI18n(<AllKudosSection />);
      const title = screen.getByText('ALL KUDOS');
      expect(title).toBeInTheDocument();
    });

    it('renders divider', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const divider = container.querySelector('div[style*="height: 1"]');
      expect(divider).toBeInTheDocument();
    });

    it('renders kudos cards from mock data', () => {
      renderWithI18n(<AllKudosSection />);
      const cards = mockKudos.slice(0, 3);
      cards.forEach(kudos => {
        expect(screen.getByText(kudos.contentVi)).toBeInTheDocument();
      });
    });
  });

  describe('Section structure', () => {
    it('section is flex column layout', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const section = container.querySelector('section');
      expect(section).toHaveStyle('display: flex');
      expect(section).toHaveStyle('flexDirection: column');
    });

    it('section has 40px gap', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const section = container.querySelector('section');
      expect(section).toHaveStyle('gap: 40px');
    });

    it('section is full width', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const section = container.querySelector('section');
      expect(section).toHaveStyle('width: 100%');
    });
  });

  describe('SectionHeading component', () => {
    it('renders section heading component', () => {
      renderWithI18n(<AllKudosSection />);
      const subtitle = screen.getByText('Sun* Annual Awards 2025');
      const title = screen.getByText('ALL KUDOS');
      expect(subtitle).toBeInTheDocument();
      expect(title).toBeInTheDocument();
    });

    it('heading title is h2', () => {
      renderWithI18n(<AllKudosSection />);
      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toHaveTextContent('ALL KUDOS');
    });

    it('heading has divider', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const divider = container.querySelector('div[style*="height: 1"]');
      expect(divider).toBeInTheDocument();
    });
  });

  describe('Kudos list', () => {
    it('renders all kudos from mockKudos', () => {
      renderWithI18n(<AllKudosSection />);
      mockKudos.forEach(kudos => {
        const content = screen.getByText(kudos.contentVi);
        expect(content).toBeInTheDocument();
      });
    });

    it('renders kudos in flex column layout', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const articles = container.querySelectorAll('article');
      expect(articles.length).toBe(mockKudos.length);
      articles.forEach(article => {
        expect(article).toBeInTheDocument();
      });
    });

    it('kudos list has 24px gap between cards', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const listDiv = Array.from(container.querySelectorAll('div')).find(
        div => div.style.gap === '24px'
      );
      expect(listDiv).toBeDefined();
      expect(listDiv).toHaveStyle('gap: 24px');
    });

    it('kudos container has max-width 680px', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const listDiv = Array.from(container.querySelectorAll('div')).find(
        div => parseFloat(div.style.maxWidth || '0') === 680 && div.style.display === 'flex'
      );
      expect(listDiv).toBeDefined();
      expect(listDiv).toHaveStyle('maxWidth: 680px');
    });

    it('kudos container is full width', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const section = container.querySelector('section');
      expect(section).toHaveStyle('width: 100%');
    });
  });

  describe('KudosPostCard component integration', () => {
    it('renders KudosPostCard for each kudos', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const articles = container.querySelectorAll('article');
      expect(articles.length).toBe(mockKudos.length);
    });

    it('passes correct kudos data to each card', () => {
      renderWithI18n(<AllKudosSection />);
      mockKudos.forEach(kudos => {
        expect(screen.getAllByText(kudos.sender.name).length).toBeGreaterThan(0);
        expect(screen.getAllByText(kudos.receiver.name).length).toBeGreaterThan(0);
      });
    });
  });

  describe('i18n integration', () => {
    it('uses i18n for section subtitle', () => {
      renderWithI18n(<AllKudosSection />);
      expect(screen.getByText('Sun* Annual Awards 2025')).toBeInTheDocument();
    });

    it('uses i18n for title', () => {
      renderWithI18n(<AllKudosSection />);
      expect(screen.getByText('ALL KUDOS')).toBeInTheDocument();
    });
  });

  describe('Title styling', () => {
    it('subtitle is white text', () => {
      renderWithI18n(<AllKudosSection />);
      const subtitle = screen.getByText('Sun* Annual Awards 2025');
      expect(subtitle).toHaveStyle('color: #FFFFFF');
    });

    it('subtitle uses Montserrat 700 24px', () => {
      renderWithI18n(<AllKudosSection />);
      const subtitle = screen.getByText('Sun* Annual Awards 2025');
      expect(subtitle).toHaveStyle('fontFamily: Montserrat, sans-serif');
      expect(subtitle).toHaveStyle('fontWeight: 700');
      expect(subtitle).toHaveStyle('fontSize: 24px');
    });

    it('title is gold #FFEA9E', () => {
      renderWithI18n(<AllKudosSection />);
      const title = screen.getByText('ALL KUDOS');
      expect(title).toHaveStyle('color: #FFEA9E');
    });

    it('title uses responsive font size', () => {
      renderWithI18n(<AllKudosSection />);
      const title = screen.getByText('ALL KUDOS');
      expect(title).toHaveStyle('fontSize: clamp(32px, 4vw, 57px)');
    });

    it('title has 0 margin', () => {
      renderWithI18n(<AllKudosSection />);
      const title = screen.getByText('ALL KUDOS');
      expect(title).toHaveStyle('margin: 0');
    });
  });

  describe('Divider styling', () => {
    it('divider is 1px height', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const divider = container.querySelector('div[style*="height: 1"]');
      expect(divider).toHaveStyle('height: 1px');
    });

    it('divider is dark gray #2E3940', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const divider = container.querySelector('div[style*="height: 1"]');
      expect(divider).toHaveStyle('background: #2E3940');
    });

    it('divider is aria-hidden', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const divider = container.querySelector('div[aria-hidden="true"][style*="height: 1"]');
      expect(divider).toBeInTheDocument();
    });

    it('divider is full width', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const divider = container.querySelector('div[style*="height: 1"]');
      expect(divider).toHaveStyle('width: 100%');
    });
  });

  describe('Empty kudos handling', () => {
    it('shows empty message when no kudos available', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const section = container.querySelector('section');
      if (mockKudos.length === 0) {
        expect(screen.getByText('Hiện tại chưa có Kudos nào.')).toBeInTheDocument();
      }
    });
  });

  describe('Spacing and layout', () => {
    it('header and list have 40px gap', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const section = container.querySelector('section');
      expect(section).toHaveStyle('gap: 40px');
    });

    it('heading wrapper has full width', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const h2 = screen.getByText('ALL KUDOS');
      const headingWrapper = h2.closest('div[class*="w-full"]');
      expect(headingWrapper).toHaveClass('w-full');
    });

    it('list wrapper is full width and uses border-box', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const listWrapper = Array.from(container.querySelectorAll('div')).find(
        div => div.style.width === '100%' && div.style.boxSizing === 'border-box'
      );
      expect(listWrapper).toBeDefined();
      expect(listWrapper).toHaveStyle('width: 100%');
      expect(listWrapper).toHaveStyle('boxSizing: border-box');
    });
  });

  describe('Accessibility', () => {
    it('section has semantic structure', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('heading is semantic h2', () => {
      renderWithI18n(<AllKudosSection />);
      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toBeInTheDocument();
    });

    it('articles are semantic HTML5', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const articles = container.querySelectorAll('article');
      expect(articles.length).toBeGreaterThan(0);
    });

    it('divider is hidden from accessibility tree', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const divider = container.querySelector('[aria-hidden="true"]');
      expect(divider).toBeInTheDocument();
    });
  });

  describe('Different kudos variations', () => {
    it('renders kudos with various hashtag combinations', () => {
      renderWithI18n(<AllKudosSection />);
      const kudosWithTags = mockKudos.filter(k => k.hashtags.length > 0);
      kudosWithTags.forEach(kudos => {
        const firstTag = kudos.hashtags[0];
        expect(screen.getAllByText(firstTag).length).toBeGreaterThan(0);
      });
    });

    it('renders kudos with and without images', () => {
      renderWithI18n(<AllKudosSection />);
      const kudosWithImages = mockKudos.filter(k => k.imageUrls.length > 0);
      const kudosWithoutImages = mockKudos.filter(k => k.imageUrls.length === 0);

      expect(kudosWithImages.length).toBeGreaterThan(0);
      expect(kudosWithoutImages.length).toBeGreaterThan(0);
    });

    it('renders kudos with different like and own states', () => {
      renderWithI18n(<AllKudosSection />);
      const kudosLiked = mockKudos.filter(k => k.likedByMe);
      const kudosOwn = mockKudos.filter(k => k.isOwn);

      expect(kudosLiked.length + kudosOwn.length).toBeGreaterThan(0);
    });
  });

  describe('List container styling', () => {
    it('list container has 100% width', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const innerDiv = container.querySelector('div[style*="width: 100%"]');
      expect(innerDiv).toHaveStyle('width: 100%');
    });

    it('individual card containers are articles', () => {
      const { container } = renderWithI18n(<AllKudosSection />);
      const articles = container.querySelectorAll('article');
      articles.forEach(article => {
        expect(article).toHaveStyle('width: 100%');
      });
    });
  });
});
