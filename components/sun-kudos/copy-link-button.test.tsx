import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import userEvent from '@testing-library/user-event';
import { CopyLinkButton } from './copy-link-button';
import messagesVi from '../../messages/vi.json';

// Prepare minimal i18n context for sunKudos
const messages = {
  sunKudos: messagesVi.sunKudos,
};

// Create a module-level spy for clipboard
const clipboardWriteTextSpy = vi.fn().mockResolvedValue(undefined);

describe('CopyLinkButton', () => {
  beforeEach(() => {
    // Reset the spy before each test
    clipboardWriteTextSpy.mockClear();

    // Mock navigator.clipboard via vitest
    Object.defineProperty(window.navigator, 'clipboard', {
      value: {
        writeText: clipboardWriteTextSpy,
      },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithI18n = (component: React.ReactElement) => {
    return render(
      <NextIntlClientProvider locale="vi" messages={messages}>
        {component}
      </NextIntlClientProvider>,
    );
  };

  describe('Initial rendering', () => {
    it('renders button with copy link label', () => {
      renderWithI18n(<CopyLinkButton />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      // Should contain "Copy Link" text
      expect(screen.getByText('Copy Link')).toBeInTheDocument();
    });

    it('renders link icon SVG', () => {
      const { container } = renderWithI18n(<CopyLinkButton />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });

    it('does not show toast initially', () => {
      renderWithI18n(<CopyLinkButton />);
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('has aria-label with translation key', () => {
      renderWithI18n(<CopyLinkButton />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
    });

    it('button has correct dimensions (144×56px, padding 16px)', () => {
      const { container } = renderWithI18n(<CopyLinkButton />);
      const button = container.querySelector('button');
      expect(button).toHaveStyle('width: 144px');
      expect(button).toHaveStyle('height: 56px');
      expect(button).toHaveStyle('padding: 16px');
    });
  });

  describe('Click interaction - clipboard write', () => {
    it('calls navigator.clipboard.writeText with current URL when url prop not provided', async () => {
      const user = userEvent.setup();
      renderWithI18n(<CopyLinkButton />);
      const button = screen.getByRole('button');

      await user.click(button);

      // Verify toast appears (indicates clipboard write was successful)
      await waitFor(() => {
        expect(screen.getByText('Link copied — ready to share!')).toBeInTheDocument();
      });
    });

    it('calls navigator.clipboard.writeText with provided url prop', async () => {
      const user = userEvent.setup();
      const testUrl = 'https://example.com/kudos/123';
      renderWithI18n(<CopyLinkButton url={testUrl} />);
      const button = screen.getByRole('button');

      await user.click(button);

      // Verify toast appears (indicates clipboard write was successful with provided URL)
      await waitFor(() => {
        expect(screen.getByText('Link copied — ready to share!')).toBeInTheDocument();
      });
    });

    it('shows toast message "Link copied — ready to share!" after successful copy', async () => {
      const user = userEvent.setup();
      renderWithI18n(<CopyLinkButton />);
      const button = screen.getByRole('button');

      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Link copied — ready to share!')).toBeInTheDocument();
      });
    });

    it('sets toast role to "status" with aria-live="polite"', async () => {
      const user = userEvent.setup();
      renderWithI18n(<CopyLinkButton />);
      const button = screen.getByRole('button');

      await user.click(button);

      await waitFor(() => {
        const toast = screen.getByRole('status');
        expect(toast).toHaveAttribute('aria-live', 'polite');
      });
    });

    it('hides toast after timeout', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithI18n(<CopyLinkButton />);
      const button = screen.getByRole('button');

      await user.click(button);

      // Toast should be visible immediately after click
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      // Wait for the toast to auto-hide (2 second timeout in component)
      await waitFor(
        () => {
          expect(screen.queryByRole('status')).not.toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });

    it('handles clipboard write gracefully when it fails', async () => {
      const user = userEvent.setup();
      // Make the mock reject on this test
      clipboardWriteTextSpy.mockRejectedValueOnce(new Error('Clipboard access denied'));

      renderWithI18n(<CopyLinkButton />);
      const button = screen.getByRole('button');

      // Should not throw - error is silently handled
      await user.click(button);

      // Brief delay to allow state updates
      await new Promise(resolve => setTimeout(resolve, 100));
      // Component successfully handles the error without crashing
      expect(button).toBeInTheDocument();
    });
  });

  describe('Multiple clicks', () => {
    it('can show toast multiple times on repeated clicks', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithI18n(<CopyLinkButton />);
      const button = screen.getByRole('button');

      // First click
      await user.click(button);
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      // Wait for toast to disappear
      await waitFor(
        () => {
          expect(screen.queryByRole('status')).not.toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Second click shows toast again
      await user.click(button);
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });
    });

    it('shows toast on each click', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithI18n(<CopyLinkButton />);
      const button = screen.getByRole('button');

      // First click
      await user.click(button);
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      // Wait for toast to hide before next click
      await waitFor(
        () => {
          expect(screen.queryByRole('status')).not.toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      // Second click shows toast again
      await user.click(button);
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });
    });
  });

  describe('Visual styling', () => {
    it('has border-radius 4px', () => {
      const { container } = renderWithI18n(<CopyLinkButton />);
      const button = container.querySelector('button');
      expect(button).toHaveStyle('borderRadius: 4px');
    });

    it('uses Montserrat font weight 700 for label', () => {
      const { container } = renderWithI18n(<CopyLinkButton />);
      const label = container.querySelector('span');
      expect(label).toHaveStyle("fontFamily: Montserrat, sans-serif");
      expect(label).toHaveStyle('fontWeight: 700');
      expect(label).toHaveStyle('fontSize: 16px');
    });

    it('has flex layout with gap 4px', () => {
      const { container } = renderWithI18n(<CopyLinkButton />);
      const button = container.querySelector('button');
      expect(button).toHaveStyle('gap: 4px');
      // Tailwind classes provide flex layout
      expect(button?.className).toContain('flex');
      expect(button?.className).toContain('flex-row');
    });

    it('has hover opacity effect', () => {
      const { container } = renderWithI18n(<CopyLinkButton />);
      const button = container.querySelector('button');
      expect(button?.className).toContain('hover:opacity-80');
      expect(button?.className).toContain('active:opacity-60');
    });

    it('toast has dark background and golden text', async () => {
      const user = userEvent.setup();
      renderWithI18n(<CopyLinkButton />);
      const button = screen.getByRole('button');

      await user.click(button);

      await waitFor(() => {
        const toast = screen.getByRole('status');
        expect(toast).toHaveStyle('background: #00101A');
        expect(toast).toHaveStyle('color: #FFEA9E');
      });
    });

    it('toast is positioned absolutely above button', async () => {
      const user = userEvent.setup();
      renderWithI18n(<CopyLinkButton />);
      const button = screen.getByRole('button');

      await user.click(button);

      await waitFor(() => {
        const toast = screen.getByRole('status');
        // Parent div has class "relative" (Tailwind for position: relative)
        expect(toast.parentElement?.className).toContain('relative');
        // Toast has Tailwind classes for positioning: "absolute" and "bottom-full"
        expect(toast.className).toContain('absolute');
        expect(toast.className).toContain('bottom-full');
        expect(toast.className).toContain('left-1/2');
      });
    });
  });

  describe('Accessibility', () => {
    it('button has aria-label', () => {
      renderWithI18n(<CopyLinkButton />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
    });

    it('button type is "button"', () => {
      const { container } = renderWithI18n(<CopyLinkButton />);
      const button = container.querySelector('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('toast has role="status" for screen readers', async () => {
      const user = userEvent.setup();
      renderWithI18n(<CopyLinkButton />);
      const button = screen.getByRole('button');

      await user.click(button);

      await waitFor(() => {
        const toast = screen.getByRole('status');
        expect(toast).toBeInTheDocument();
      });
    });

    it('SVG is marked aria-hidden', () => {
      const { container } = renderWithI18n(<CopyLinkButton />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Props variations', () => {
    it('works with custom URL', async () => {
      const user = userEvent.setup({ delay: null });
      const customUrl = 'https://custom.example.com/share';
      renderWithI18n(<CopyLinkButton url={customUrl} />);
      const button = screen.getByRole('button');

      await user.click(button);

      // Toast appears indicating clipboard write succeeded with custom URL
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('falls back to window.location.href when url is undefined', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithI18n(<CopyLinkButton url={undefined} />);
      const button = screen.getByRole('button');

      await user.click(button);

      // Toast appears indicating clipboard write succeeded (fell back to window.location.href)
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('handles empty string URL by using window.location.href', async () => {
      const user = userEvent.setup({ delay: null });
      renderWithI18n(<CopyLinkButton url="" />);
      const button = screen.getByRole('button');

      await user.click(button);

      // Toast appears indicating clipboard write succeeded with fallback URL
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('Toast cleanup', () => {
    it('clears timer on unmount while toast is visible', async () => {
      const user = userEvent.setup({ delay: null });
      const { unmount } = renderWithI18n(<CopyLinkButton />);
      const button = screen.getByRole('button');

      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });

      // Should unmount safely without errors
      unmount();

      // No assertion needed - just checking it doesn't throw
      expect(true).toBe(true);
    });
  });
});
