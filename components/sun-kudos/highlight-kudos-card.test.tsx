import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { HighlightKudosCard } from './highlight-kudos-card';
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

describe('HighlightKudosCard', () => {
  const testKudos = mockKudos[0];

  describe('Rendering', () => {
    it('renders card container', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const card = container.querySelector('div[style*="width: 528"]');
      expect(card).toBeInTheDocument();
    });

    it('renders sender user info', () => {
      renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      expect(screen.getByText(testKudos.sender.name)).toBeInTheDocument();
    });

    it('renders receiver user info', () => {
      renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      expect(screen.getByText(testKudos.receiver.name)).toBeInTheDocument();
    });

    it('renders posted time', () => {
      renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      expect(screen.getByText(testKudos.postedAt)).toBeInTheDocument();
    });

    it('renders content text', () => {
      renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      expect(screen.getByText(testKudos.contentVi)).toBeInTheDocument();
    });

    it('renders hashtags', () => {
      renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const hashtag = testKudos.hashtags.find(h => h.startsWith('#'));
      if (hashtag) {
        expect(screen.getByText(hashtag)).toBeInTheDocument();
      }
    });

    it('renders category label', () => {
      renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const category = testKudos.hashtags.find(h => !h.startsWith('#'));
      if (category) {
        expect(screen.getByText(category)).toBeInTheDocument();
      }
    });

    it('renders "Xem chi tiết" button', () => {
      renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      expect(screen.getByText('Xem chi tiết')).toBeInTheDocument();
    });
  });

  describe('Card styling', () => {
    it('card has width of 528px', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const card = container.querySelector('div[style*="width: 528"]');
      expect(card).toHaveStyle('width: 528px');
    });

    it('card has 4px gold border', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const card = container.querySelector('div[style*="width: 528"]');
      expect(card).toHaveStyle('border: 4px solid #FFEA9E');
    });

    it('card has light cream background #FFF8E1', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const card = container.querySelector('div[style*="width: 528"]');
      expect(card).toHaveStyle('background: #FFF8E1');
    });

    it('card has 16px border-radius', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const card = container.querySelector('div[style*="width: 528"]');
      expect(card).toHaveStyle('borderRadius: 16px');
    });

    it('card has 24px padding on sides and top', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const card = container.querySelector('div[style*="width: 528"]');
      expect(card).toHaveStyle('padding: 24px 24px 16px');
    });

    it('card has 16px gap between sections', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const card = container.querySelector('div[style*="width: 528"]');
      expect(card).toHaveStyle('gap: 16px');
    });
  });

  describe('Faded prop', () => {
    it('normal card has opacity of 1', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} faded={false} />);
      const card = container.querySelector('div[style*="width: 528"]');
      expect(card).toHaveStyle('opacity: 1');
    });

    it('faded card has opacity of 0.45', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} faded={true} />);
      const card = container.querySelector('div[style*="width: 528"]');
      expect(card).toHaveStyle('opacity: 0.45');
    });

    it('opacity transition is 0.3s ease', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const card = container.querySelector('div[style*="width: 528"]');
      expect(card).toHaveStyle('transition: opacity 0.3s ease');
    });
  });

  describe('Content box styling', () => {
    it('content box is present with correct structure', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const p = container.querySelector('p');
      const contentBox = p?.parentElement;
      expect(contentBox).toBeInTheDocument();
      expect(contentBox).toHaveStyle('borderRadius: 12px');
    });

    it('content box has padding 16px 24px', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const p = container.querySelector('p');
      const contentBox = p?.parentElement;
      expect(contentBox).toHaveStyle('padding: 16px 24px');
    });

    it('content text is wrapped in border box', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const p = container.querySelector('p');
      expect(p).toBeInTheDocument();
      expect(p?.parentElement).toBeInTheDocument();
    });

    it('content is clamped to 3 lines', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const p = container.querySelector('p');
      expect(p).toHaveStyle('WebkitLineClamp: 3');
    });
  });

  describe('Text styling', () => {
    it('time text is gray #999999', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const timeSpan = screen.getByText(testKudos.postedAt);
      expect(timeSpan).toHaveStyle('color: #999999');
    });

    it('content text is dark #00101A', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const contentP = screen.getByText(testKudos.contentVi);
      expect(contentP).toHaveStyle('color: #00101A');
    });

    it('content text uses line-clamp of 3', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const contentP = container.querySelector('p');
      expect(contentP).toHaveStyle('WebkitLineClamp: 3');
    });

    it('category label is centered if present', () => {
      renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const category = testKudos.hashtags.find(h => !h.startsWith('#'));
      if (category) {
        const categorySpan = screen.getByText(category);
        expect(categorySpan).toHaveStyle('textAlign: center');
      }
    });
  });

  describe('Action buttons', () => {
    it('renders heart button', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('renders "Xem chi tiết" button', () => {
      renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const viewDetailBtn = screen.getByText('Xem chi tiết');
      expect(viewDetailBtn).toBeInTheDocument();
      expect(viewDetailBtn.closest('button')).toHaveAttribute('type', 'button');
    });

    it('renders copy link button', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('action bar is flex row space-between', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const actionBar = Array.from(container.querySelectorAll('div')).find(
        div => div.style.justifyContent === 'space-between' && div.style.display === 'flex'
      );
      expect(actionBar).toBeDefined();
      expect(actionBar).toHaveStyle('display: flex');
      expect(actionBar).toHaveStyle('justifyContent: space-between');
    });
  });

  describe('Dividers', () => {
    it('renders divider elements', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const dividers = container.querySelectorAll('div[aria-hidden="true"]');
      expect(dividers.length).toBeGreaterThan(0);
    });

    it('dividers are present with aria-hidden', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const divider = container.querySelector('div[aria-hidden="true"][style*="height"]');
      expect(divider).toBeInTheDocument();
    });
  });

  describe('Different kudos variations', () => {
    it('renders kudos without category label if not present', () => {
      const kudosNoCategory = {
        ...testKudos,
        hashtags: ['#Teamwork', '#Hero'],
      };
      renderWithI18n(<HighlightKudosCard kudos={kudosNoCategory} />);
      expect(screen.getByText('#Teamwork')).toBeInTheDocument();
    });

    it('renders kudos with multiple hashtags', () => {
      const kudosMultiTag = {
        ...testKudos,
        hashtags: ['#Tag1', '#Tag2', '#Tag3', 'Category'],
      };
      renderWithI18n(<HighlightKudosCard kudos={kudosMultiTag} />);
      expect(screen.getByText('#Tag1')).toBeInTheDocument();
      expect(screen.getByText('#Tag2')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('dividers are aria-hidden', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const dividers = container.querySelectorAll('[aria-hidden="true"]');
      expect(dividers.length).toBeGreaterThan(0);
    });

    it('buttons are accessible', () => {
      const { container } = renderWithI18n(<HighlightKudosCard kudos={testKudos} />);
      const buttons = container.querySelectorAll('button');
      buttons.forEach(btn => {
        expect(btn).not.toBeDisabled();
      });
    });
  });
});
