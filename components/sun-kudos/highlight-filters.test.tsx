import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import userEvent from '@testing-library/user-event';
import { HighlightFilters } from './highlight-filters';
import type { Hashtag, Department } from './types';
import messagesVi from '../../messages/vi.json';

const messages = {
  sunKudos: messagesVi.sunKudos,
};

const mockHashtags: Hashtag[] = [
  { id: '1', label: '#teamwork', count: 42 },
  { id: '2', label: '#innovation', count: 38 },
  { id: '3', label: '#support', count: 25 },
];

const mockDepartments: Department[] = [
  { id: '1', name: 'Engineering' },
  { id: '2', name: 'Product' },
  { id: '3', name: 'Design' },
];

const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="vi" messages={messages}>
      {component}
    </NextIntlClientProvider>,
  );
};

describe('HighlightFilters', () => {
  describe('Rendering', () => {
    it('renders two filter buttons (hashtag and department)', () => {
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(2);
    });

    it('renders hashtag filter button with label', () => {
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);
      expect(screen.getByText('Hashtag')).toBeInTheDocument();
    });

    it('renders department filter button with label', () => {
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);
      expect(screen.getByText('Phòng ban')).toBeInTheDocument();
    });

    it('renders chevron down icons in buttons', () => {
      const { container } = renderWithI18n(
        <HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />,
      );
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThanOrEqual(2);
    });

    it('has both buttons with aria-haspopup="listbox"', () => {
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach(btn => {
        expect(btn).toHaveAttribute('aria-haspopup', 'listbox');
      });
    });

    it('both buttons initially have aria-expanded="false"', () => {
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach(btn => {
        expect(btn).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });

  describe('Hashtag filter dropdown', () => {
    it('opens hashtag dropdown when button clicked', async () => {
      const user = userEvent.setup();
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];

      await user.click(hashtagButton);

      const listboxes = screen.getAllByRole('listbox');
      expect(listboxes.length).toBeGreaterThan(0);
    });

    it('shows all hashtag options in dropdown', async () => {
      const user = userEvent.setup();
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];

      await user.click(hashtagButton);

      mockHashtags.forEach(tag => {
        expect(screen.getByText(tag.label)).toBeInTheDocument();
      });
    });

    it('closes dropdown when option selected', async () => {
      const user = userEvent.setup();
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];

      await user.click(hashtagButton);
      await user.click(screen.getByText('#teamwork'));

      await waitFor(() => {
        const listboxes = screen.queryAllByRole('listbox');
        // Hashtag dropdown should be closed
        expect(listboxes.length).toBe(0);
      });
    });

    it('marks selected option as active with aria-selected', async () => {
      const user = userEvent.setup();
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];

      await user.click(hashtagButton);
      const option = screen.getByRole('option', { name: '#teamwork' });

      expect(option).toHaveAttribute('aria-selected', 'false');

      await user.click(option);

      // Reopen dropdown
      await user.click(hashtagButton);

      const updatedOption = screen.getByRole('option', { name: '#teamwork' });
      expect(updatedOption).toHaveAttribute('aria-selected', 'true');
    });

    it('button label changes to selected hashtag', async () => {
      const user = userEvent.setup();
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];

      expect(hashtagButton).toHaveTextContent('Hashtag');

      await user.click(hashtagButton);
      await user.click(screen.getByText('#innovation'));

      expect(hashtagButton).toHaveTextContent('#innovation');
    });

    it('shows "Clear filter" option when selection made', async () => {
      const user = userEvent.setup();
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];

      await user.click(hashtagButton);
      await user.click(screen.getByText('#support'));

      // Reopen
      await user.click(hashtagButton);

      expect(screen.getByText('— Clear filter —')).toBeInTheDocument();
    });

    it('clears hashtag selection when "Clear filter" clicked', async () => {
      const user = userEvent.setup();
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];

      await user.click(hashtagButton);
      await user.click(screen.getByText('#support'));

      expect(hashtagButton).toHaveTextContent('#support');

      await user.click(hashtagButton);
      await user.click(screen.getByText('— Clear filter —'));

      expect(hashtagButton).toHaveTextContent('Hashtag');
    });
  });

  describe('Department filter dropdown', () => {
    it('opens department dropdown when button clicked', async () => {
      const user = userEvent.setup();
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);

      const buttons = screen.getAllByRole('button');
      const deptButton = buttons[1];

      await user.click(deptButton);

      const listboxes = screen.getAllByRole('listbox');
      expect(listboxes.length).toBeGreaterThan(0);
    });

    it('shows all department options in dropdown', async () => {
      const user = userEvent.setup();
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);

      const buttons = screen.getAllByRole('button');
      const deptButton = buttons[1];

      await user.click(deptButton);

      mockDepartments.forEach(dept => {
        expect(screen.getByText(dept.name)).toBeInTheDocument();
      });
    });

    it('closes dropdown when option selected', async () => {
      const user = userEvent.setup();
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);

      const buttons = screen.getAllByRole('button');
      const deptButton = buttons[1];

      await user.click(deptButton);
      await user.click(screen.getByText('Engineering'));

      await waitFor(() => {
        const deptOptions = screen.queryAllByText('Engineering');
        // Only button text should remain, dropdown closed
        expect(deptOptions.length).toBe(1);
      });
    });

    it('marks selected department as active', async () => {
      const user = userEvent.setup();
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);

      const buttons = screen.getAllByRole('button');
      const deptButton = buttons[1];

      await user.click(deptButton);
      const option = screen.getByRole('option', { name: 'Product' });

      await user.click(option);

      // Reopen
      await user.click(deptButton);

      const updatedOption = screen.getByRole('option', { name: 'Product' });
      expect(updatedOption).toHaveAttribute('aria-selected', 'true');
    });

    it('button label changes to selected department', async () => {
      const user = userEvent.setup();
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);

      const buttons = screen.getAllByRole('button');
      const deptButton = buttons[1];

      expect(deptButton).toHaveTextContent('Phòng ban');

      await user.click(deptButton);
      await user.click(screen.getByText('Design'));

      expect(deptButton).toHaveTextContent('Design');
    });
  });

  describe('Outside click closes dropdown', () => {
    it('closes hashtag dropdown on outside click', async () => {
      const user = userEvent.setup();
      const { container } = renderWithI18n(
        <HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />,
      );

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];

      await user.click(hashtagButton);

      let listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();

      // Click outside
      fireEvent.mouseDown(container);

      await waitFor(() => {
        const listboxes = screen.queryAllByRole('listbox');
        expect(listboxes.length).toBe(0);
      });
    });

    it('closes department dropdown on outside click', async () => {
      const user = userEvent.setup();
      const { container } = renderWithI18n(
        <HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />,
      );

      const buttons = screen.getAllByRole('button');
      const deptButton = buttons[1];

      await user.click(deptButton);

      let listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();

      // Click outside
      fireEvent.mouseDown(container);

      await waitFor(() => {
        const listboxes = screen.queryAllByRole('listbox');
        expect(listboxes.length).toBe(0);
      });
    });

    it('does not close dropdown when clicking inside it', async () => {
      const user = userEvent.setup();
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];

      await user.click(hashtagButton);

      const listbox = screen.getByRole('listbox');
      fireEvent.mouseDown(listbox);

      // Dropdown should still be open
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('Independent filter state', () => {
    it('opening hashtag dropdown does not affect department dropdown', async () => {
      const user = userEvent.setup();
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];
      const deptButton = buttons[1];

      await user.click(hashtagButton);

      // Department button should still be closed
      expect(deptButton).toHaveAttribute('aria-expanded', 'false');

      const listboxes = screen.getAllByRole('listbox');
      expect(listboxes.length).toBe(1);
    });

    it('selecting hashtag does not affect department', async () => {
      const user = userEvent.setup();
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];
      const deptButton = buttons[1];

      await user.click(hashtagButton);
      await user.click(screen.getByText('#teamwork'));

      expect(hashtagButton).toHaveTextContent('#teamwork');
      expect(deptButton).toHaveTextContent('Phòng ban');
    });

    it('can have both hashtag and department selected simultaneously', async () => {
      const user = userEvent.setup();
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];
      const deptButton = buttons[1];

      await user.click(hashtagButton);
      await user.click(screen.getByText('#innovation'));

      await user.click(deptButton);
      await user.click(screen.getByText('Product'));

      expect(hashtagButton).toHaveTextContent('#innovation');
      expect(deptButton).toHaveTextContent('Product');
    });

    it('clearing one filter does not affect other', async () => {
      const user = userEvent.setup();
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />);

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];
      const deptButton = buttons[1];

      // Select both
      await user.click(hashtagButton);
      await user.click(screen.getByText('#support'));

      await user.click(deptButton);
      await user.click(screen.getByText('Engineering'));

      expect(hashtagButton).toHaveTextContent('#support');
      expect(deptButton).toHaveTextContent('Engineering');

      // Clear hashtag
      await user.click(hashtagButton);
      await user.click(screen.getByText('— Clear filter —'));

      expect(hashtagButton).toHaveTextContent('Hashtag');
      expect(deptButton).toHaveTextContent('Engineering'); // Still selected
    });
  });

  describe('Visual styling based on selection state', () => {
    it('button border color changes to #FFEA9E when active', async () => {
      const user = userEvent.setup();
      const { container } = renderWithI18n(
        <HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />,
      );

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];

      // Initially has border color #998C5F
      expect(hashtagButton).toHaveStyle('border: 1px solid #998C5F');

      await user.click(hashtagButton);
      await user.click(screen.getByText('#teamwork'));

      // After selection, border should be #FFEA9E
      expect(hashtagButton).toHaveStyle('border: 1px solid #FFEA9E');
    });

    it('button background changes when active', async () => {
      const user = userEvent.setup();
      const { container } = renderWithI18n(
        <HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />,
      );

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];

      expect(hashtagButton).toHaveStyle('background: rgba(255,234,158,0.10)');

      await user.click(hashtagButton);
      await user.click(screen.getByText('#teamwork'));

      expect(hashtagButton).toHaveStyle('background: rgba(255,234,158,0.20)');
    });

    it('text color changes when button is active', async () => {
      const user = userEvent.setup();
      const { container } = renderWithI18n(
        <HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />,
      );

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];

      await user.click(hashtagButton);
      const option = screen.getByRole('option', { name: '#support' });
      await user.click(option);

      // Button should now have text color #FFEA9E (active)
      await user.click(hashtagButton);

      const selectedOption = screen.getByRole('option', { name: '#support' });
      expect(selectedOption).toHaveStyle('color: #FFEA9E');
      expect(selectedOption).toHaveStyle('fontWeight: 700');
    });
  });

  describe('Chevron icon rotation', () => {
    it('chevron rotates when dropdown opens', async () => {
      const user = userEvent.setup();
      const { container } = renderWithI18n(
        <HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />,
      );

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];

      await user.click(hashtagButton);

      // Find SVG within button (chevron icon)
      const svg = hashtagButton.querySelector('svg');
      expect(svg).toHaveStyle('transform: rotate(180deg)');
    });

    it('chevron rotates back when dropdown closes', async () => {
      const user = userEvent.setup();
      const { container } = renderWithI18n(
        <HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />,
      );

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];

      await user.click(hashtagButton);

      const svg = hashtagButton.querySelector('svg');
      expect(svg).toHaveStyle('transform: rotate(180deg)');

      await user.click(screen.getByText('#teamwork'));

      await waitFor(() => {
        // Chevron should be back to 0deg
        expect(svg).toHaveStyle('transform: rotate(0deg)');
      });
    });
  });

  describe('Data attributes for parent access', () => {
    it('exposes selected hashtag via data-selected-hashtag', async () => {
      const user = userEvent.setup();
      const { container } = renderWithI18n(
        <HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />,
      );

      const rootDiv = container.firstChild;

      // Initially empty
      expect(rootDiv).toHaveAttribute('data-selected-hashtag', '');

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];

      await user.click(hashtagButton);
      await user.click(screen.getByText('#innovation'));

      // Should update after selection
      expect(rootDiv).toHaveAttribute('data-selected-hashtag', '#innovation');
    });

    it('exposes selected department via data-selected-dept', async () => {
      const user = userEvent.setup();
      const { container } = renderWithI18n(
        <HighlightFilters hashtags={mockHashtags} departments={mockDepartments} />,
      );

      const rootDiv = container.firstChild;

      expect(rootDiv).toHaveAttribute('data-selected-dept', '');

      const buttons = screen.getAllByRole('button');
      const deptButton = buttons[1];

      await user.click(deptButton);
      await user.click(screen.getByText('Design'));

      expect(rootDiv).toHaveAttribute('data-selected-dept', 'Design');
    });
  });

  describe('Empty filter lists', () => {
    it('handles empty hashtag list gracefully', () => {
      renderWithI18n(<HighlightFilters hashtags={[]} departments={mockDepartments} />);
      expect(screen.getByText('Hashtag')).toBeInTheDocument();
    });

    it('handles empty department list gracefully', () => {
      renderWithI18n(<HighlightFilters hashtags={mockHashtags} departments={[]} />);
      expect(screen.getByText('Phòng ban')).toBeInTheDocument();
    });

    it('opens empty hashtag dropdown without error', async () => {
      const user = userEvent.setup();
      renderWithI18n(<HighlightFilters hashtags={[]} departments={mockDepartments} />);

      const buttons = screen.getAllByRole('button');
      const hashtagButton = buttons[0];

      await user.click(hashtagButton);

      // Should show only "Clear filter" option (if nothing selected)
      // or be empty
      const listbox = screen.queryByRole('listbox');
      expect(listbox).toBeInTheDocument();
    });
  });
});
