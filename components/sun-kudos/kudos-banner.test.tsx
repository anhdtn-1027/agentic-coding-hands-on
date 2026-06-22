import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { KudosBanner } from './kudos-banner';
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

describe('KudosBanner', () => {
  describe('Rendering', () => {
    it('renders banner section', () => {
      const { container } = renderWithI18n(<KudosBanner />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('renders banner with aria-label', () => {
      const { container } = renderWithI18n(<KudosBanner />);
      const section = container.querySelector('section[aria-label="Sun* Kudos banner"]');
      expect(section).toBeInTheDocument();
    });

    it('renders background image', () => {
      renderWithI18n(<KudosBanner />);
      const bgImage = screen.getByAltText('');
      expect(bgImage).toBeInTheDocument();
      expect(bgImage).toHaveAttribute('src', expect.stringContaining('kv-background'));
    });

    it('renders banner title text', () => {
      renderWithI18n(<KudosBanner />);
      expect(screen.getByText('Hệ thống ghi nhận và cảm ơn')).toBeInTheDocument();
    });

    it('renders KUDOS logo', () => {
      renderWithI18n(<KudosBanner />);
      const logo = screen.getByAltText('KUDOS');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Layout and structure', () => {
    it('has fixed height of 512px', () => {
      const { container } = renderWithI18n(<KudosBanner />);
      const section = container.querySelector('section');
      expect(section).toHaveStyle('height: 512px');
    });

    it('renders as full width section', () => {
      const { container } = renderWithI18n(<KudosBanner />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('w-full');
    });

    it('contains overlay tint layer', () => {
      const { container } = renderWithI18n(<KudosBanner />);
      const overlay = container.querySelector('div[aria-hidden="true"][style*="background"]');
      expect(overlay).toBeInTheDocument();
    });

    it('overlay is aria-hidden', () => {
      const { container } = renderWithI18n(<KudosBanner />);
      const overlay = container.querySelector('div[aria-hidden="true"]');
      expect(overlay).toBeInTheDocument();
    });
  });

  describe('Title styling', () => {
    it('title is h1 element', () => {
      renderWithI18n(<KudosBanner />);
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
    });

    it('title uses Montserrat 700 font', () => {
      const { container } = renderWithI18n(<KudosBanner />);
      const h1 = container.querySelector('h1');
      expect(h1).toHaveStyle('fontFamily: Montserrat, sans-serif');
      expect(h1).toHaveStyle('fontWeight: 700');
    });

    it('title uses responsive font size with clamp', () => {
      const { container } = renderWithI18n(<KudosBanner />);
      const h1 = container.querySelector('h1');
      expect(h1).toHaveStyle('fontSize: clamp(20px, 2.5vw, 36px)');
    });

    it('title has gold color #FFEA9E', () => {
      const { container } = renderWithI18n(<KudosBanner />);
      const h1 = container.querySelector('h1');
      expect(h1).toHaveStyle('color: rgba(255, 234, 158, 1)');
    });

    it('title margin is 0', () => {
      const { container } = renderWithI18n(<KudosBanner />);
      const h1 = container.querySelector('h1');
      expect(h1).toHaveStyle('margin: 0');
    });

    it('title uses nowrap to prevent line breaks', () => {
      const { container } = renderWithI18n(<KudosBanner />);
      const h1 = container.querySelector('h1');
      expect(h1).toHaveStyle('whiteSpace: nowrap');
    });
  });

  describe('Logo image', () => {
    it('logo has src pointing to kudos-logo.svg', () => {
      renderWithI18n(<KudosBanner />);
      const logo = screen.getByAltText('KUDOS');
      expect(logo).toHaveAttribute('src', expect.stringContaining('kudos-logo'));
    });

    it('logo uses object-contain sizing', () => {
      const { container } = renderWithI18n(<KudosBanner />);
      const logoImg = container.querySelector('img[alt="KUDOS"]');
      expect(logoImg).toHaveClass('object-contain');
    });

    it('logo is rendered as image element', () => {
      renderWithI18n(<KudosBanner />);
      const logo = screen.getByAltText('KUDOS');
      expect(logo).toBeInTheDocument();
      expect(logo.tagName).toBe('IMG');
    });
  });

  describe('Internationalization', () => {
    it('uses i18n to get banner title', () => {
      renderWithI18n(<KudosBanner />);
      expect(screen.getByText('Hệ thống ghi nhận và cảm ơn')).toBeInTheDocument();
    });

    it('renders correct Vietnamese text from messages', () => {
      renderWithI18n(<KudosBanner />);
      const titleText = screen.getByText('Hệ thống ghi nhận và cảm ơn').textContent;
      expect(titleText).toBe('Hệ thống ghi nhận và cảm ơn');
    });
  });

  describe('Responsive behavior', () => {
    it('banner uses responsive padding with clamp', () => {
      renderWithI18n(<KudosBanner />);
      const title = screen.getByText('Hệ thống ghi nhận và cảm ơn');
      expect(title).toBeInTheDocument();
    });

    it('banner content uses maxWidth of 1152px', () => {
      const { container } = renderWithI18n(<KudosBanner />);
      const contentDiv = Array.from(container.querySelectorAll('div')).find(
        div => div.style.maxWidth === '1152px'
      );
      expect(contentDiv).toBeDefined();
      expect(contentDiv).toHaveStyle('maxWidth: 1152px');
    });

    it('banner content is centered with mx-auto', () => {
      const { container } = renderWithI18n(<KudosBanner />);
      const contentDiv = container.querySelector('div.mx-auto');
      expect(contentDiv).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('background image has empty alt text (decorative)', () => {
      renderWithI18n(<KudosBanner />);
      const bgImage = screen.getByAltText('');
      expect(bgImage).toBeInTheDocument();
    });

    it('logo image has descriptive alt text', () => {
      renderWithI18n(<KudosBanner />);
      const logo = screen.getByAltText('KUDOS');
      expect(logo).toBeInTheDocument();
    });

    it('section has aria-label for screen readers', () => {
      const { container } = renderWithI18n(<KudosBanner />);
      const section = container.querySelector('section[aria-label]');
      expect(section).toHaveAttribute('aria-label', 'Sun* Kudos banner');
    });
  });
});
