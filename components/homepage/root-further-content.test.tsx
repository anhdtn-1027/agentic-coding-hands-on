import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { AbstractIntlMessages } from 'next-intl';
import en from '@/messages/en.json';
import vi from '@/messages/vi.json';
import { RootFurtherContent } from './root-further-content';

function renderWithLocale(locale: string, messages: AbstractIntlMessages) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <RootFurtherContent />
    </NextIntlClientProvider>,
  );
}

// Regression: the long "Root Further" copy was hard-coded in Vietnamese and did
// NOT switch when the user changed locale. It must now resolve from i18n
// (homepage.rootFurther), so English renders English and the VN source is gone.
describe('RootFurtherContent — locale-driven copy', () => {
  it('renders English copy under the en locale (no Vietnamese leakage)', () => {
    renderWithLocale('en', en as AbstractIntlMessages);
    expect(screen.getByText(/In the face of the AI era/i)).toBeInTheDocument();
    expect(
      screen.getByText(/A tree with deep roots fears no storm/i),
    ).toBeInTheDocument();
    // The hard-coded Vietnamese source string must not appear under en.
    expect(screen.queryByText(/Đứng trước bối cảnh/)).not.toBeInTheDocument();
  });

  it('renders Vietnamese copy under the vi locale', () => {
    renderWithLocale('vi', vi as AbstractIntlMessages);
    expect(
      screen.getByText(/Đứng trước bối cảnh thay đổi/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Trước giông bão, chỉ những tán cây/),
    ).toBeInTheDocument();
  });
});
