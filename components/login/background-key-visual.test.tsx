import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BackgroundKeyVisual } from './background-key-visual';

// Hero background artwork — covers MoMorph TC 5fbe2a18 (key visual presence).
describe('BackgroundKeyVisual', () => {
  it('renders a decorative (aria-hidden) full-bleed container (TC 5fbe2a18)', () => {
    const { container } = render(<BackgroundKeyVisual />);
    const root = container.querySelector('[aria-hidden="true"]');
    expect(root).toBeInTheDocument();
    expect(root).toHaveClass('absolute', 'inset-0');
  });

  it('paints the default key-visual artwork as a background image', () => {
    const { container } = render(<BackgroundKeyVisual />);
    const layer = container.querySelector(
      'div[style*="keyvisual-bg.png"]',
    ) as HTMLElement | null;
    expect(layer).toBeInTheDocument();
    expect(layer?.style.backgroundImage).toContain('/login/keyvisual-bg.png');
  });

  it('accepts a custom image source', () => {
    const { container } = render(
      <BackgroundKeyVisual imageSrc="/custom/bg.png" />,
    );
    expect(
      container.querySelector('div[style*="custom/bg.png"]'),
    ).toBeInTheDocument();
  });
});
