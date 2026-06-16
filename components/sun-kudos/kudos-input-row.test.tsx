import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { KudosInputRow } from './kudos-input-row';
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

describe('KudosInputRow', () => {
  describe('Rendering', () => {
    it('renders two input pills', () => {
      renderWithI18n(<KudosInputRow />);
      const inputs = screen.getAllByRole('textbox');
      expect(inputs).toHaveLength(2);
    });

    it('renders kudos input with correct placeholder', () => {
      renderWithI18n(<KudosInputRow />);
      const kudosInput = screen.getByPlaceholderText(/Hôm nay/);
      expect(kudosInput).toBeInTheDocument();
    });

    it('renders search input with correct placeholder', () => {
      renderWithI18n(<KudosInputRow />);
      const searchInput = screen.getByPlaceholderText(/Tìm kiếm/);
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('renders pen icon in kudos input', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const kudosInput = screen.getByPlaceholderText(/Hôm nay/);
      const label = kudosInput.closest('label');
      const svg = label?.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders search icon in search input', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const searchInput = screen.getByPlaceholderText(/Tìm kiếm/);
      const label = searchInput.closest('label');
      const svg = label?.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('icons have aria-hidden', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const svgs = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(svgs.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Input styling', () => {
    it('inputs have gold border #998C5F', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const labels = container.querySelectorAll('label');
      labels.forEach((label) => {
        expect(label).toHaveStyle('border: 1px solid #998C5F');
      });
    });

    it('inputs have gold background with low opacity', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const labels = container.querySelectorAll('label');
      labels.forEach((label) => {
        expect(label).toHaveStyle('background: rgba(255, 234, 158, 0.10)');
      });
    });

    it('inputs have border-radius of 68px', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const labels = container.querySelectorAll('label');
      labels.forEach((label) => {
        expect(label).toHaveStyle('borderRadius: 68px');
      });
    });

    it('inputs have padding 24px 16px', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const labels = container.querySelectorAll('label');
      labels.forEach((label) => {
        expect(label).toHaveStyle('padding: 24px 16px');
      });
    });

    it('inputs have height of 72px', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const labels = container.querySelectorAll('label');
      labels.forEach((label) => {
        expect(label).toHaveStyle('height: 72px');
      });
    });

    it('inputs have white text color', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const labels = container.querySelectorAll('label');
      labels.forEach((label) => {
        expect(label).toHaveStyle('color: #FFFFFF');
      });
    });
  });

  describe('Focus behavior', () => {
    it('border brightens on focus', async () => {
      const user = userEvent.setup();
      const { container } = renderWithI18n(<KudosInputRow />);
      const inputs = screen.getAllByRole('textbox');
      const kudosInput = inputs[0];

      const label = kudosInput.closest('label');
      expect(label).toHaveStyle('border: 1px solid #998C5F');

      await user.click(kudosInput);

      expect(label).toHaveStyle('border: 1px solid rgba(255, 234, 158, 0.80)');
    });

    it('background brightens on focus', async () => {
      const user = userEvent.setup();
      const { container } = renderWithI18n(<KudosInputRow />);
      const inputs = screen.getAllByRole('textbox');
      const kudosInput = inputs[0];

      const label = kudosInput.closest('label');
      expect(label).toHaveStyle('background: rgba(255, 234, 158, 0.10)');

      await user.click(kudosInput);

      expect(label).toHaveStyle('background: rgba(255, 234, 158, 0.15)');
    });

    it('returns to normal state on blur', async () => {
      const user = userEvent.setup();
      const { container } = renderWithI18n(<KudosInputRow />);
      const inputs = screen.getAllByRole('textbox');
      const kudosInput = inputs[0];
      const label = kudosInput.closest('label');

      await user.click(kudosInput);
      expect(label).toHaveStyle('border: 1px solid rgba(255, 234, 158, 0.80)');

      await user.tab();
      expect(label).toHaveStyle('border: 1px solid #998C5F');
    });
  });

  describe('Text input properties', () => {
    it('inputs are text type', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const inputs = container.querySelectorAll('input[type="text"]');
      expect(inputs.length).toBeGreaterThan(0);
      inputs.forEach((input) => {
        expect(input).toHaveAttribute('type', 'text');
      });
    });

    it('inputs use Montserrat 700 16px', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        expect(input).toHaveStyle('fontFamily: Montserrat, sans-serif');
        expect(input).toHaveStyle('fontWeight: 700');
        expect(input).toHaveStyle('fontSize: 16px');
      });
    });

    it('inputs have transparent background', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        expect(input).toHaveStyle('background: transparent');
      });
    });

    it('inputs have border set to none or zero', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        const style = window.getComputedStyle(input);
        // border should be none or 0 width
        const borderValue = style.border || style.borderWidth;
        expect(['none', '0px', '0'].some(v => borderValue?.includes(v) || style.border === 'none')).toBeTruthy();
      });
    });

    it('inputs have no outline', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        expect(input).toHaveStyle('outline: none');
      });
    });

    it('inputs have 100% width', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        expect(input).toHaveStyle('width: 100%');
      });
    });
  });

  describe('Aria labels', () => {
    it('kudos input has aria-label', () => {
      renderWithI18n(<KudosInputRow />);
      const kudosInput = screen.getByPlaceholderText(/Hôm nay/);
      expect(kudosInput).toHaveAttribute('aria-label');
    });

    it('search input has aria-label', () => {
      renderWithI18n(<KudosInputRow />);
      const searchInput = screen.getByPlaceholderText(/Tìm kiếm/);
      expect(searchInput).toHaveAttribute('aria-label');
    });
  });

  describe('Layout', () => {
    it('renders as flex row', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const flexRow = container.querySelector('div.flex-row');
      expect(flexRow).toBeInTheDocument();
      expect(flexRow).toHaveClass('flex-row');
    });

    it('pills have gap between them', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const flexRow = container.querySelector('div.flex-row');
      expect(flexRow).toHaveStyle('gap: clamp(8px, 1.4vw, 20px)');
    });

    it('container has responsive padding', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const outerDiv = Array.from(container.querySelectorAll('div')).find(
        div => div.style.paddingInline?.includes('clamp')
      );
      expect(outerDiv).toBeDefined();
      expect(outerDiv?.style.paddingInline).toMatch(/clamp/);
    });

    it('flex row is centered with max-width 1152', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const flexRow = Array.from(container.querySelectorAll('div')).find(
        div => div.style.maxWidth === '1152px'
      );
      expect(flexRow).toBeDefined();
      expect(flexRow).toHaveStyle('maxWidth: 1152px');
    });
  });

  describe('Placeholder styling', () => {
    it('placeholders are semi-transparent white', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const style = container.querySelector('style');
      expect(style?.textContent).toContain('rgba(255, 255, 255, 0.60)');
    });

    it('placeholders brighten on hover', () => {
      const { container } = renderWithI18n(<KudosInputRow />);
      const style = container.querySelector('style');
      expect(style?.textContent).toContain('rgba(255, 255, 255, 0.80)');
    });
  });

  describe('User interaction', () => {
    it('allows typing in kudos input', async () => {
      const user = userEvent.setup();
      renderWithI18n(<KudosInputRow />);
      const kudosInput = screen.getByPlaceholderText(/Hôm nay/);

      await user.type(kudosInput, 'Test message');
      expect(kudosInput).toHaveValue('Test message');
    });

    it('allows typing in search input', async () => {
      const user = userEvent.setup();
      renderWithI18n(<KudosInputRow />);
      const searchInput = screen.getByPlaceholderText(/Tìm kiếm/);

      await user.type(searchInput, 'John Doe');
      expect(searchInput).toHaveValue('John Doe');
    });

    it('inputs maintain separate values', async () => {
      const user = userEvent.setup();
      renderWithI18n(<KudosInputRow />);
      const inputs = screen.getAllByRole('textbox');
      const kudosInput = inputs[0];
      const searchInput = inputs[1];

      await user.type(kudosInput, 'Kudos text');
      await user.type(searchInput, 'Search text');

      expect(kudosInput).toHaveValue('Kudos text');
      expect(searchInput).toHaveValue('Search text');
    });
  });
});
