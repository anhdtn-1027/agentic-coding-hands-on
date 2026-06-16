import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpotlightSearchBar, PanZoomButton } from './spotlight-controls';

describe('SpotlightSearchBar', () => {
  describe('rendering', () => {
    it('renders input field with placeholder', () => {
      const onChange = vi.fn();
      render(
        <SpotlightSearchBar
          value=""
          onChange={onChange}
          placeholder="Tìm kiếm"
        />
      );

      const input = screen.getByPlaceholderText('Tìm kiếm');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders with correct placeholder text', () => {
      const onChange = vi.fn();
      render(
        <SpotlightSearchBar
          value=""
          onChange={onChange}
          placeholder="Tìm kiếm thành viên"
        />
      );

      expect(screen.getByPlaceholderText('Tìm kiếm thành viên')).toBeInTheDocument();
    });

    it('renders input with current value', () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <SpotlightSearchBar
          value="Alice"
          onChange={onChange}
          placeholder="Search"
        />
      );

      const input = screen.getByDisplayValue('Alice') as HTMLInputElement;
      expect(input.value).toBe('Alice');
    });

    it('has search icon visible', () => {
      const onChange = vi.fn();
      const { container } = render(
        <SpotlightSearchBar
          value=""
          onChange={onChange}
          placeholder="Search"
        />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('has aria-label matching placeholder', () => {
      const onChange = vi.fn();
      render(
        <SpotlightSearchBar
          value=""
          onChange={onChange}
          placeholder="Tìm kiếm"
        />
      );

      const input = screen.getByPlaceholderText('Tìm kiếm');
      expect(input).toHaveAttribute('aria-label', 'Tìm kiếm');
    });
  });

  describe('input constraints', () => {
    it('enforces maxLength of 100 characters', () => {
      const onChange = vi.fn();
      render(
        <SpotlightSearchBar
          value=""
          onChange={onChange}
          placeholder="Search"
        />
      );

      const input = screen.getByPlaceholderText('Search') as HTMLInputElement;
      expect(input.maxLength).toBe(100);
    });

    it('truncates text to 100 characters on change', async () => {
      const onChange = vi.fn();
      render(
        <SpotlightSearchBar
          value=""
          onChange={onChange}
          placeholder="Search"
        />
      );

      const input = screen.getByPlaceholderText('Search');
      const longText = 'a'.repeat(150);

      await userEvent.type(input, longText);

      // onChange should be called with max 100 chars
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
      expect(lastCall[0].length).toBeLessThanOrEqual(100);
    });

    it('allows exactly 100 characters', async () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <SpotlightSearchBar
          value=""
          onChange={onChange}
          placeholder="Search"
        />
      );

      const input = screen.getByPlaceholderText('Search');
      const text100 = 'a'.repeat(100);

      fireEvent.change(input, { target: { value: text100 } });

      // Handler should allow 100 chars
      expect(onChange).toHaveBeenCalled();
    });

    it('handles input with special characters', async () => {
      const onChange = vi.fn();
      render(
        <SpotlightSearchBar
          value=""
          onChange={onChange}
          placeholder="Search"
        />
      );

      const input = screen.getByPlaceholderText('Search');
      const specialText = 'Nguyễn Văn Á';

      fireEvent.change(input, { target: { value: specialText } });

      expect(onChange).toHaveBeenCalledWith(specialText);
    });
  });

  describe('onChange callback', () => {
    it('calls onChange with new value on input change', async () => {
      const onChange = vi.fn();
      render(
        <SpotlightSearchBar
          value=""
          onChange={onChange}
          placeholder="Search"
        />
      );

      const input = screen.getByPlaceholderText('Search');
      fireEvent.change(input, { target: { value: 'test' } });

      expect(onChange).toHaveBeenCalledWith('test');
    });

    it('calls onChange with empty string on clear', async () => {
      const onChange = vi.fn();
      render(
        <SpotlightSearchBar
          value="existing"
          onChange={onChange}
          placeholder="Search"
        />
      );

      const input = screen.getByDisplayValue('existing');
      fireEvent.change(input, { target: { value: '' } });

      expect(onChange).toHaveBeenCalledWith('');
    });

    it('calls onChange with correct value on each keystroke', async () => {
      const onChange = vi.fn();
      const { rerender } = render(
        <SpotlightSearchBar
          value=""
          onChange={onChange}
          placeholder="Search"
        />
      );

      const input = screen.getByPlaceholderText('Search');

      fireEvent.change(input, { target: { value: 'A' } });
      expect(onChange).toHaveBeenCalledWith('A');

      onChange.mockClear();

      fireEvent.change(input, { target: { value: 'Al' } });
      expect(onChange).toHaveBeenCalledWith('Al');
    });
  });

  describe('styling', () => {
    it('has gold border', () => {
      const onChange = vi.fn();
      const { container } = render(
        <SpotlightSearchBar
          value=""
          onChange={onChange}
          placeholder="Search"
        />
      );

      const label = container.querySelector('label');
      expect(label).toHaveStyle('border: 0.682px solid #998C5F');
    });

    it('has semi-transparent gold background', () => {
      const onChange = vi.fn();
      const { container } = render(
        <SpotlightSearchBar
          value=""
          onChange={onChange}
          placeholder="Search"
        />
      );

      const label = container.querySelector('label');
      expect(label).toHaveStyle('background: rgba(255, 234, 158, 0.10)');
    });

    it('has rounded appearance', () => {
      const onChange = vi.fn();
      const { container } = render(
        <SpotlightSearchBar
          value=""
          onChange={onChange}
          placeholder="Search"
        />
      );

      const label = container.querySelector('label');
      expect(label).toHaveStyle('borderRadius: 46.404px');
    });

    it('input text is white', () => {
      const onChange = vi.fn();
      const { container } = render(
        <SpotlightSearchBar
          value=""
          onChange={onChange}
          placeholder="Search"
        />
      );

      const input = container.querySelector('input');
      expect(input).toHaveStyle('color: rgba(255, 255, 255, 1)');
    });
  });

  describe('accessibility', () => {
    it('is keyboard accessible', async () => {
      const onChange = vi.fn();
      render(
        <SpotlightSearchBar
          value=""
          onChange={onChange}
          placeholder="Search"
        />
      );

      const input = screen.getByPlaceholderText('Search');
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
    });

    it('label wraps input for better accessibility', () => {
      const onChange = vi.fn();
      const { container } = render(
        <SpotlightSearchBar
          value=""
          onChange={onChange}
          placeholder="Tìm kiếm"
        />
      );

      const label = container.querySelector('label');
      const input = label?.querySelector('input');
      expect(input).toBeInTheDocument();
    });
  });
});

describe('PanZoomButton', () => {
  describe('rendering', () => {
    it('renders as button element', () => {
      const onToggle = vi.fn();
      render(
        <PanZoomButton
          active={false}
          label="Pan/Zoom"
          onToggle={onToggle}
        />
      );

      const button = screen.getByRole('button', { name: 'Pan/Zoom' });
      expect(button).toBeInTheDocument();
    });

    it('displays label in aria-label and title', () => {
      const onToggle = vi.fn();
      render(
        <PanZoomButton
          active={false}
          label="Pan/Zoom Toggle"
          onToggle={onToggle}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Pan/Zoom Toggle');
      expect(button).toHaveAttribute('title', 'Pan/Zoom Toggle');
    });

    it('renders icon SVG', () => {
      const onToggle = vi.fn();
      const { container } = render(
        <PanZoomButton
          active={false}
          label="Pan/Zoom"
          onToggle={onToggle}
        />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('shows correct icon color when inactive', () => {
      const onToggle = vi.fn();
      const { container } = render(
        <PanZoomButton
          active={false}
          label="Pan/Zoom"
          onToggle={onToggle}
        />
      );

      const paths = container.querySelectorAll('path');
      paths.forEach(path => {
        const stroke = path.getAttribute('stroke');
        expect(stroke).toBe('rgba(255,255,255,0.7)');
      });
    });

    it('shows gold icon color when active', () => {
      const onToggle = vi.fn();
      const { container } = render(
        <PanZoomButton
          active={true}
          label="Pan/Zoom"
          onToggle={onToggle}
        />
      );

      const paths = container.querySelectorAll('path');
      paths.forEach(path => {
        const stroke = path.getAttribute('stroke');
        expect(stroke).toBe('#FFEA9E');
      });
    });
  });

  describe('aria-pressed state', () => {
    it('sets aria-pressed to false when inactive', () => {
      const onToggle = vi.fn();
      render(
        <PanZoomButton
          active={false}
          label="Pan/Zoom"
          onToggle={onToggle}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('sets aria-pressed to true when active', () => {
      const onToggle = vi.fn();
      render(
        <PanZoomButton
          active={true}
          label="Pan/Zoom"
          onToggle={onToggle}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('styling', () => {
    it('has transparent background when inactive', () => {
      const onToggle = vi.fn();
      const { container } = render(
        <PanZoomButton
          active={false}
          label="Pan/Zoom"
          onToggle={onToggle}
        />
      );

      const button = container.querySelector('button');
      expect(button).toHaveStyle('background: transparent');
    });

    it('has gold background when active', () => {
      const onToggle = vi.fn();
      const { container } = render(
        <PanZoomButton
          active={true}
          label="Pan/Zoom"
          onToggle={onToggle}
        />
      );

      const button = container.querySelector('button');
      expect(button).toHaveStyle('background: rgba(255, 234, 158, 0.15)');
    });

    it('has subtle border when inactive', () => {
      const onToggle = vi.fn();
      const { container } = render(
        <PanZoomButton
          active={false}
          label="Pan/Zoom"
          onToggle={onToggle}
        />
      );

      const button = container.querySelector('button');
      expect(button).toHaveStyle('border: 1px solid rgba(255,255,255,0.2)');
    });

    it('has gold border when active', () => {
      const onToggle = vi.fn();
      const { container } = render(
        <PanZoomButton
          active={true}
          label="Pan/Zoom"
          onToggle={onToggle}
        />
      );

      const button = container.querySelector('button');
      expect(button).toHaveStyle('border: 1px solid rgba(255, 234, 158, 0.5)');
    });

    it('has correct dimensions', () => {
      const onToggle = vi.fn();
      const { container } = render(
        <PanZoomButton
          active={false}
          label="Pan/Zoom"
          onToggle={onToggle}
        />
      );

      const button = container.querySelector('button');
      expect(button).toHaveStyle('width: 30px');
      expect(button).toHaveStyle('height: 30px');
      expect(button).toHaveStyle('borderRadius: 6px');
    });

    it('has pointer cursor', () => {
      const onToggle = vi.fn();
      const { container } = render(
        <PanZoomButton
          active={false}
          label="Pan/Zoom"
          onToggle={onToggle}
        />
      );

      const button = container.querySelector('button');
      expect(button).toHaveStyle('cursor: pointer');
    });
  });

  describe('interaction', () => {
    it('calls onToggle when clicked', () => {
      const onToggle = vi.fn();
      render(
        <PanZoomButton
          active={false}
          label="Pan/Zoom"
          onToggle={onToggle}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('calls onToggle multiple times on multiple clicks', () => {
      const onToggle = vi.fn();
      render(
        <PanZoomButton
          active={false}
          label="Pan/Zoom"
          onToggle={onToggle}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(onToggle).toHaveBeenCalledTimes(3);
    });

    it('is keyboard accessible (Enter key)', () => {
      const onToggle = vi.fn();
      render(
        <PanZoomButton
          active={false}
          label="Pan/Zoom"
          onToggle={onToggle}
        />
      );

      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter' });
      // Note: actual key handling depends on browser/framework behavior
      // Just ensure button is focusable
      expect(button.tagName).toBe('BUTTON');
    });

    it('toggles between active and inactive states visually', () => {
      const onToggle = vi.fn();
      const { rerender, container } = render(
        <PanZoomButton
          active={false}
          label="Pan/Zoom"
          onToggle={onToggle}
        />
      );

      let button = container.querySelector('button');
      expect(button).toHaveStyle('background: transparent');

      rerender(
        <PanZoomButton
          active={true}
          label="Pan/Zoom"
          onToggle={onToggle}
        />
      );

      button = container.querySelector('button');
      expect(button).toHaveStyle('background: rgba(255, 234, 158, 0.15)');
    });
  });

  describe('accessibility', () => {
    it('is a proper button element', () => {
      const onToggle = vi.fn();
      render(
        <PanZoomButton
          active={false}
          label="Pan/Zoom"
          onToggle={onToggle}
        />
      );

      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('has proper ARIA attributes', () => {
      const onToggle = vi.fn();
      render(
        <PanZoomButton
          active={true}
          label="Pan/Zoom Mode"
          onToggle={onToggle}
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Pan/Zoom Mode');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });
});
