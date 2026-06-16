import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { WelcomeText } from './welcome-text';

// Hero description text — covers MoMorph TC 42b82364 (the two intro lines).
// Both lines live in one <p> separated by <br>, so assert on the paragraph's
// combined text content rather than per-line element matches.
describe('WelcomeText', () => {
  it('renders the default two-line welcome message (TC 42b82364)', () => {
    const { container } = render(<WelcomeText />);
    const text = container.querySelector('p')?.textContent ?? '';
    expect(text).toContain('Bắt đầu hành trình của bạn cùng SAA 2025.');
    expect(text).toContain('Đăng nhập để khám phá!');
  });

  it('renders custom i18n lines', () => {
    const { container } = render(
      <WelcomeText line1="Start your journey." line2="Sign in!" />,
    );
    const text = container.querySelector('p')?.textContent ?? '';
    expect(text).toContain('Start your journey.');
    expect(text).toContain('Sign in!');
  });
});
