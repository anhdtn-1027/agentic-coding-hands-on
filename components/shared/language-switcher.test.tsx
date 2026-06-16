import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSwitcher } from './language-switcher';

// next-intl + locale-aware navigation are server/runtime concerns; stub them so
// the switcher renders standalone under jsdom.
vi.mock('next-intl', () => ({ useLocale: () => 'vi' }));
// Also satisfies LanguageDropdown's transitive import of useRouter/usePathname
// (rendered when the switcher opens) — not used by the switcher itself.
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/',
}));

// Language control — covers MoMorph TCs:
//   5f1cbabd  default language Vietnamese ("VN")
//   98e20775  flag (left) + chevron (right) display
//   20d87e28 / 4426635b  dropdown opens on click
describe('LanguageSwitcher', () => {
  it('defaults to Vietnamese with flag and chevron (TC 5f1cbabd, 98e20775)', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText('VN')).toBeInTheDocument();
    expect(screen.getByAltText('Tiếng Việt')).toBeInTheDocument();
    expect(
      document.querySelector('img[src="/shared/chevron-down.svg"]'),
    ).toBeInTheDocument();
  });

  it('is collapsed initially (aria-expanded=false, no listbox)', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens the language dropdown on click (TC 20d87e28, 4426635b)', async () => {
    render(<LanguageSwitcher />);
    await userEvent.click(screen.getByRole('button', { name: /vn/i }));

    expect(screen.getByRole('button', { name: /vn/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();
    // All three locale options are offered (VN/EN/JP).
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('closes the dropdown on outside click', async () => {
    render(<LanguageSwitcher />);
    await userEvent.click(screen.getByRole('button', { name: /vn/i }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.click(document.body);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes the dropdown on Escape', async () => {
    render(<LanguageSwitcher />);
    await userEvent.click(screen.getByRole('button', { name: /vn/i }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
