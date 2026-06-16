import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { AbstractIntlMessages } from 'next-intl';
import en from '@/messages/en.json';
import vi from '@/messages/vi.json';
import { EventInfo } from './event-info';

function renderWithLocale(locale: string, messages: AbstractIntlMessages) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <EventInfo />
    </NextIntlClientProvider>,
  );
}

// Regression: the "Thời gian:" / "Địa điểm:" labels were hard-coded and did not
// switch with the locale. They now come from i18n (homepage.eventTimeLabel/...).
describe('EventInfo — locale-driven labels', () => {
  it('renders English labels under the en locale', () => {
    renderWithLocale('en', en as AbstractIntlMessages);
    expect(screen.getByText('Time:')).toBeInTheDocument();
    expect(screen.getByText('Venue:')).toBeInTheDocument();
    expect(screen.queryByText('Thời gian:')).not.toBeInTheDocument();
  });

  it('renders Vietnamese labels under the vi locale', () => {
    renderWithLocale('vi', vi as AbstractIntlMessages);
    expect(screen.getByText('Thời gian:')).toBeInTheDocument();
    expect(screen.getByText('Địa điểm:')).toBeInTheDocument();
  });
});
