import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageDropdown } from './language-dropdown';

// Locale-aware navigation is a runtime concern; capture router.replace so we can
// assert the locale-switch contract without a real next-intl router.
const replace = vi.fn();
vi.mock('next-intl', () => ({ useLocale: () => 'vi' }));
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => '/',
}));

// Harness mirrors how LanguageSwitcher mounts the dropdown: the wrapper ref
// encloses the dropdown, and a sibling button sits OUTSIDE that wrapper so the
// outside-click path can be exercised faithfully.
function DropdownHarness({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div>
      <div ref={ref}>
        <LanguageDropdown onClose={onClose} containerRef={ref} />
      </div>
      <button>outside</button>
    </div>
  );
}

// Language dropdown — design hUyaaugye2 (Dropdown-ngôn ngữ), node 525:11713.
// Specs: shows VN (selected) + EN; click an option → switch locale + close menu.
describe('LanguageDropdown', () => {
  beforeEach(() => {
    replace.mockClear();
  });

  it('renders exactly the VN and EN options with flags (design: VN/EN only)', () => {
    render(<DropdownHarness onClose={vi.fn()} />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(2);
    expect(options.map((o) => o.textContent)).toEqual(['VN', 'EN']);
    expect(screen.getByAltText('Tiếng Việt')).toBeInTheDocument();
    expect(screen.getByAltText('English')).toBeInTheDocument();
  });

  it('marks the current locale (VN) as selected and EN as not selected', () => {
    render(<DropdownHarness onClose={vi.fn()} />);
    expect(screen.getByRole('option', { name: /vn/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('option', { name: /en/i })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('selecting EN switches the locale and closes the menu (specs: update + close)', async () => {
    const onClose = vi.fn();
    render(<DropdownHarness onClose={onClose} />);
    await userEvent.click(screen.getByRole('option', { name: /en/i }));
    expect(replace).toHaveBeenCalledWith('/', { locale: 'en' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('selecting the current locale (VN) closes without re-navigating', async () => {
    const onClose = vi.fn();
    render(<DropdownHarness onClose={onClose} />);
    await userEvent.click(screen.getByRole('option', { name: /vn/i }));
    expect(replace).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape (TC ID-34)', async () => {
    const onClose = vi.fn();
    render(<DropdownHarness onClose={onClose} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on outside click (TC ID-33)', async () => {
    const onClose = vi.fn();
    render(<DropdownHarness onClose={onClose} />);
    await userEvent.click(screen.getByText('outside'));
    expect(onClose).toHaveBeenCalled();
  });
});
