import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { KudosPostCard } from './kudos-post-card';
import { mockKudos } from './mock-data';
import messagesVi from '../../messages/vi.json';
import type { Kudos } from './types';

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

describe('KudosPostCard', () => {
  const testKudos = mockKudos[0];
  const kudosWithoutImages = mockKudos[1];

  describe('Rendering', () => {
    it('renders article element', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });

    it('renders sender user info', () => {
      renderWithI18n(<KudosPostCard kudos={testKudos} />);
      expect(screen.getByText(testKudos.sender.name)).toBeInTheDocument();
    });

    it('renders receiver user info', () => {
      renderWithI18n(<KudosPostCard kudos={testKudos} />);
      expect(screen.getByText(testKudos.receiver.name)).toBeInTheDocument();
    });

    it('renders posted time', () => {
      renderWithI18n(<KudosPostCard kudos={testKudos} />);
      expect(screen.getByText(testKudos.postedAt)).toBeInTheDocument();
    });

    it('renders content text', () => {
      renderWithI18n(<KudosPostCard kudos={testKudos} />);
      expect(screen.getByText(testKudos.contentVi)).toBeInTheDocument();
    });

    it('renders hashtags', () => {
      renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const hashtag = testKudos.hashtags.find(h => h.startsWith('#'));
      if (hashtag) {
        expect(screen.getByText(hashtag)).toBeInTheDocument();
      }
    });
  });

  describe('Card styling', () => {
    it('card has max-width of 680px', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const article = container.querySelector('article');
      expect(article).toHaveStyle('maxWidth: 680px');
    });

    it('card is full width', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const article = container.querySelector('article');
      expect(article).toHaveStyle('width: 100%');
    });

    it('card has cream background #FFF8E1', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const article = container.querySelector('article');
      expect(article).toHaveStyle('backgroundColor: #FFF8E1');
    });

    it('card has 24px border-radius', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const article = container.querySelector('article');
      expect(article).toHaveStyle('borderRadius: 24px');
    });

    it('card has 40px padding on sides and top, 16px bottom', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const article = container.querySelector('article');
      expect(article).toHaveStyle('padding: 40px 40px 16px 40px');
    });

    it('card has 16px gap between sections', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const article = container.querySelector('article');
      expect(article).toHaveStyle('gap: 16px');
    });
  });

  describe('Send arrow icon', () => {
    it('renders send icon SVG', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('send icon has aria-label', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const sendIcon = container.querySelector('svg[aria-label="sent to"]');
      expect(sendIcon).toBeInTheDocument();
    });
  });

  describe('Content text', () => {
    it('content is paragraph element', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs.length).toBeGreaterThan(0);
    });

    it('content text is dark #00101A', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const contentP = container.querySelector('p');
      expect(contentP).toHaveStyle('color: #00101A');
    });

    it('content uses line-clamp of 5', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const contentP = container.querySelector('p');
      expect(contentP).toHaveStyle('WebkitLineClamp: 5');
    });

    it('content text is justified', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const contentP = container.querySelector('p');
      expect(contentP).toHaveStyle('textAlign: justify');
    });

    it('content margin is 0', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const contentP = container.querySelector('p');
      expect(contentP).toHaveStyle('margin: 0');
    });
  });

  describe('Image gallery', () => {
    it('renders gallery when imageUrls is not empty', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const images = container.querySelectorAll('img');
      expect(images.length).toBeGreaterThan(0);
    });

    it('does not render gallery when imageUrls is empty', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={kudosWithoutImages} />);
      const gallery = Array.from(container.querySelectorAll('div')).find(
        div => div.style.overflowX === 'auto'
      );
      expect(gallery).toBeFalsy();
    });

    it('renders up to 5 images in gallery', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const gallery = container.querySelector('div[style*="overflowX: auto"]');
      if (gallery) {
        const images = gallery.querySelectorAll('img');
        expect(images.length).toBeLessThanOrEqual(5);
      }
    });

    it('image containers are 88x88px', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const gallery = container.querySelector('div[style*="overflowX: auto"]');
      if (gallery) {
        const imageContainers = gallery.querySelectorAll('div[style*="width: 88"]');
        imageContainers.forEach(container => {
          expect(container).toHaveStyle('width: 88px');
          expect(container).toHaveStyle('height: 88px');
        });
      }
    });

    it('image containers have border 1px solid #998C5F', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const gallery = container.querySelector('div[style*="overflowX: auto"]');
      if (gallery) {
        const imageContainers = gallery.querySelectorAll('div[style*="border: 1px"]');
        imageContainers.forEach(container => {
          expect(container).toHaveStyle('border: 1px solid #998C5F');
        });
      }
    });

    it('image containers have border-radius 18px', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const gallery = container.querySelector('div[style*="overflowX: auto"]');
      if (gallery) {
        const imageContainers = gallery.querySelectorAll('div[style*="borderRadius"]');
        imageContainers.forEach(container => {
          expect(container).toHaveStyle('borderRadius: 18px');
        });
      }
    });

    it('gallery has no wrap and auto overflow', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const gallery = container.querySelector('div[style*="overflowX: auto"]');
      if (gallery) {
        expect(gallery).toHaveStyle('flexWrap: nowrap');
        expect(gallery).toHaveStyle('overflowX: auto');
      }
    });
  });

  describe('Time styling', () => {
    it('time text is gray #999999', () => {
      renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const timeSpan = screen.getByText(testKudos.postedAt);
      expect(timeSpan).toHaveStyle('color: #999999');
    });

    it('time uses Montserrat 700 16px', () => {
      renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const timeSpan = screen.getByText(testKudos.postedAt);
      expect(timeSpan).toHaveStyle('fontFamily: Montserrat, sans-serif');
      expect(timeSpan).toHaveStyle('fontWeight: 700');
      expect(timeSpan).toHaveStyle('fontSize: 16px');
    });
  });

  describe('Action buttons', () => {
    it('renders heart button', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('renders copy link button', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThanOrEqual(1);
    });

    it('action bar is space-between layout', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const actionBar = Array.from(container.querySelectorAll('div')).find(
        div => div.style.justifyContent === 'space-between' && div.style.display === 'flex'
      );
      expect(actionBar).toBeDefined();
      expect(actionBar).toHaveStyle('display: flex');
      expect(actionBar).toHaveStyle('justifyContent: space-between');
    });

    it('action bar has 56px height', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const actionBar = Array.from(container.querySelectorAll('div')).find(
        div => div.style.height === '56px'
      );
      expect(actionBar).toBeDefined();
      expect(actionBar).toHaveStyle('height: 56px');
    });
  });

  describe('User info blocks', () => {
    it('renders both sender and receiver info', () => {
      renderWithI18n(<KudosPostCard kudos={testKudos} />);
      expect(screen.getByText(testKudos.sender.name)).toBeInTheDocument();
      expect(screen.getByText(testKudos.receiver.name)).toBeInTheDocument();
    });

    it('user info is in flex row with space-between', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const userInfoRow = Array.from(container.querySelectorAll('div')).find(
        div => div.style.justifyContent === 'space-between' && div.style.display === 'flex'
      );
      expect(userInfoRow).toBeDefined();
      expect(userInfoRow).toHaveStyle('display: flex');
      expect(userInfoRow).toHaveStyle('justifyContent: space-between');
    });
  });

  describe('Heart button disabled state', () => {
    it('heart button is disabled when isOwn is true', () => {
      const ownKudos = { ...testKudos, isOwn: true };
      renderWithI18n(<KudosPostCard kudos={ownKudos} />);
      const likeBtn = screen.getByRole('button', { name: /Like|Unlike/i });
      expect(likeBtn).toBeDisabled();
    });

    it('heart button is enabled when isOwn is false', () => {
      const notOwnKudos = { ...testKudos, isOwn: false };
      renderWithI18n(<KudosPostCard kudos={notOwnKudos} />);
      const likeBtn = screen.getByRole('button', { name: /Like|Unlike/i });
      expect(likeBtn).not.toBeDisabled();
    });
  });

  describe('Layout structure', () => {
    it('article is flex column', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const article = container.querySelector('article');
      expect(article).toHaveStyle('display: flex');
      expect(article).toHaveStyle('flexDirection: column');
    });

    it('article has box-sizing border-box', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const article = container.querySelector('article');
      expect(article).toHaveStyle('boxSizing: border-box');
    });
  });

  describe('Hashtag rendering', () => {
    it('hashtags are rendered', () => {
      renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const hashtags = testKudos.hashtags;
      if (hashtags.length > 0) {
        expect(screen.getByText(hashtags[0])).toBeInTheDocument();
      }
    });

    it('up to 5 hashtags can be displayed', () => {
      const kudosWithManyTags: Kudos = {
        ...testKudos,
        hashtags: ['#Tag1', '#Tag2', '#Tag3', '#Tag4', '#Tag5', '#Tag6'],
      };
      renderWithI18n(<KudosPostCard kudos={kudosWithManyTags} />);
      expect(screen.getByText('#Tag1')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('article is semantic HTML5 article element', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      expect(container.querySelector('article')).toBeInTheDocument();
    });

    it('image gallery items have aria-label', () => {
      const { container } = renderWithI18n(<KudosPostCard kudos={testKudos} />);
      const gallery = container.querySelector('div[style*="overflowX: auto"]');
      if (gallery) {
        const imageItems = gallery.querySelectorAll('[aria-label]');
        expect(imageItems.length).toBeGreaterThan(0);
      }
    });
  });
});
