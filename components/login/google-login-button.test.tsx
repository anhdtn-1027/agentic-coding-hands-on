import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GoogleLoginButton } from './google-login-button';

// Login button component — covers MoMorph TCs:
//   6ae76d15  label + Google icon visible
//   37eae882  disabled + loading indicator during authentication
//   60bc5bbb  click triggers handler (Google auth flow entry point)
//   c18649fa  hover shadow/elevation effect
describe('GoogleLoginButton', () => {
  it('renders default label and Google icon (TC 6ae76d15)', () => {
    render(<GoogleLoginButton />);
    expect(
      screen.getByRole('button', { name: /login with google/i }),
    ).toBeInTheDocument();
    const icon = document.querySelector('img[src="/login/google-icon.svg"]');
    expect(icon).toBeInTheDocument();
  });

  it('renders a custom label', () => {
    render(<GoogleLoginButton label="Đăng nhập với Google" />);
    expect(
      screen.getByRole('button', { name: /đăng nhập với google/i }),
    ).toBeInTheDocument();
  });

  it('disables and shows a loading spinner while authenticating (TC 37eae882)', () => {
    render(<GoogleLoginButton loading />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    // Spinner replaces the icon while loading.
    expect(button.querySelector('svg.animate-spin')).toBeInTheDocument();
    expect(
      document.querySelector('img[src="/login/google-icon.svg"]'),
    ).not.toBeInTheDocument();
  });

  it('fires onClick when enabled (TC 60bc5bbb)', async () => {
    const onClick = vi.fn();
    render(<GoogleLoginButton onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick while loading or disabled', async () => {
    const onClick = vi.fn();
    const { rerender } = render(<GoogleLoginButton onClick={onClick} loading />);
    await userEvent.click(screen.getByRole('button'));
    rerender(<GoogleLoginButton onClick={onClick} disabled />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
    // Disabled (not loading) → no busy state advertised to assistive tech.
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy', 'true');
  });

  it('exposes a hover shadow/elevation effect when enabled (TC c18649fa)', () => {
    render(<GoogleLoginButton />);
    // Hover elevation is CSS-driven; assert the Tailwind hover:shadow class is present.
    expect(screen.getByRole('button').className).toContain('hover:shadow');
  });
});
