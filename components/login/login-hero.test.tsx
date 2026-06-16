import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoginHero } from './login-hero';

// Hero composition — covers MoMorph TCs 42b82364 (title + descriptions) and
// 6ae76d15 (login button presence) wired together.
describe('LoginHero', () => {
  it('composes ROOT FURTHER logo, welcome text and login button', () => {
    const { container } = render(
      <LoginHero
        welcomeText={{ line1: 'Line one.', line2: 'Line two.' }}
        loginButton={{ label: 'LOGIN With Google' }}
      />,
    );

    // ROOT FURTHER key visual (image alt)
    expect(screen.getByAltText('Root Further')).toBeInTheDocument();
    // Welcome descriptions (rendered in one <p> split by <br>)
    expect(container.textContent).toContain('Line one.');
    expect(container.textContent).toContain('Line two.');
    // Login button
    expect(
      screen.getByRole('button', { name: /login with google/i }),
    ).toBeInTheDocument();
  });
});
