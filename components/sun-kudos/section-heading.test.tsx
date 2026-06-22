import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionHeading } from './section-heading';

describe('SectionHeading', () => {
  describe('Rendering', () => {
    it('renders subtitle text', () => {
      render(<SectionHeading subtitle="Sun* Annual Awards 2025" title="HIGHLIGHT KUDOS" />);
      expect(screen.getByText('Sun* Annual Awards 2025')).toBeInTheDocument();
    });

    it('renders title text', () => {
      render(<SectionHeading subtitle="Sun* Annual Awards 2025" title="HIGHLIGHT KUDOS" />);
      expect(screen.getByText('HIGHLIGHT KUDOS')).toBeInTheDocument();
    });

    it('renders divider between subtitle and title', () => {
      const { container } = render(
        <SectionHeading subtitle="Sun* Annual Awards 2025" title="HIGHLIGHT KUDOS" />
      );
      const divider = container.querySelector('div[style*="height: 1"]');
      expect(divider).toBeInTheDocument();
    });
  });

  describe('Subtitle styling', () => {
    it('subtitle uses Montserrat 700 24px white color', () => {
      const { container } = render(
        <SectionHeading subtitle="Sun* Annual Awards 2025" title="ALL KUDOS" />
      );
      const subtitle = screen.getByText('Sun* Annual Awards 2025');
      expect(subtitle).toHaveStyle('fontFamily: Montserrat, sans-serif');
      expect(subtitle).toHaveStyle('fontWeight: 700');
      expect(subtitle).toHaveStyle('fontSize: 24px');
      expect(subtitle).toHaveStyle('lineHeight: 32px');
      expect(subtitle).toHaveStyle('color: #FFFFFF');
    });

    it('subtitle has 0 letter spacing', () => {
      const { container } = render(
        <SectionHeading subtitle="Test Subtitle" title="TEST TITLE" />
      );
      const subtitle = screen.getByText('Test Subtitle');
      expect(subtitle).toHaveStyle('letterSpacing: 0px');
    });
  });

  describe('Divider styling', () => {
    it('divider is 1px solid #2E3940', () => {
      const { container } = render(
        <SectionHeading subtitle="Sun* Annual Awards 2025" title="HIGHLIGHT KUDOS" />
      );
      const divider = container.querySelector('div[style*="height: 1"]');
      expect(divider).toHaveStyle('height: 1px');
      expect(divider).toHaveStyle('background: #2E3940');
    });

    it('divider is full width', () => {
      const { container } = render(
        <SectionHeading subtitle="Sun* Annual Awards 2025" title="HIGHLIGHT KUDOS" />
      );
      const divider = container.querySelector('div[style*="height: 1"]');
      expect(divider).toHaveStyle('width: 100%');
    });

    it('divider is aria-hidden for accessibility', () => {
      const { container } = render(
        <SectionHeading subtitle="Sun* Annual Awards 2025" title="HIGHLIGHT KUDOS" />
      );
      const divider = container.querySelector('div[aria-hidden="true"]');
      expect(divider).toBeInTheDocument();
    });
  });

  describe('Title styling', () => {
    it('title is h2 element', () => {
      render(<SectionHeading subtitle="Sun* Annual Awards 2025" title="HIGHLIGHT KUDOS" />);
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toBeInTheDocument();
    });

    it('title uses Montserrat 700 gold color #FFEA9E', () => {
      const { container } = render(
        <SectionHeading subtitle="Sun* Annual Awards 2025" title="HIGHLIGHT KUDOS" />
      );
      const title = screen.getByText('HIGHLIGHT KUDOS');
      expect(title).toHaveStyle('fontFamily: Montserrat, sans-serif');
      expect(title).toHaveStyle('fontWeight: 700');
      expect(title).toHaveStyle('color: #FFEA9E');
    });

    it('title has -0.25px letter spacing', () => {
      const { container } = render(
        <SectionHeading subtitle="Sun* Annual Awards 2025" title="HIGHLIGHT KUDOS" />
      );
      const title = screen.getByText('HIGHLIGHT KUDOS');
      expect(title).toHaveStyle('letterSpacing: -0.25px');
    });

    it('title uses responsive font size with clamp', () => {
      const { container } = render(
        <SectionHeading subtitle="Sun* Annual Awards 2025" title="HIGHLIGHT KUDOS" />
      );
      const title = screen.getByText('HIGHLIGHT KUDOS');
      expect(title).toHaveStyle('fontSize: clamp(32px, 4vw, 57px)');
    });

    it('title margin is 0', () => {
      const { container } = render(
        <SectionHeading subtitle="Sun* Annual Awards 2025" title="HIGHLIGHT KUDOS" />
      );
      const title = screen.getByText('HIGHLIGHT KUDOS');
      expect(title).toHaveStyle('margin: 0');
    });

    it('title has 1.12 line height ratio', () => {
      const { container } = render(
        <SectionHeading subtitle="Sun* Annual Awards 2025" title="HIGHLIGHT KUDOS" />
      );
      const title = screen.getByText('HIGHLIGHT KUDOS');
      expect(title).toHaveStyle('lineHeight: 1.12');
    });
  });

  describe('Layout', () => {
    it('renders as flex column layout', () => {
      const { container } = render(
        <SectionHeading subtitle="Sun* Annual Awards 2025" title="HIGHLIGHT KUDOS" />
      );
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('flex');
      expect(wrapper).toHaveClass('flex-col');
      expect(wrapper).toHaveClass('w-full');
    });

    it('has 16px gap between elements', () => {
      const { container } = render(
        <SectionHeading subtitle="Sun* Annual Awards 2025" title="HIGHLIGHT KUDOS" />
      );
      const wrapper = container.firstChild;
      expect(wrapper).toHaveStyle('gap: 16px');
    });

    it('uses responsive padding with clamp', () => {
      const { container } = render(
        <SectionHeading subtitle="Sun* Annual Awards 2025" title="HIGHLIGHT KUDOS" />
      );
      const wrapper = container.firstChild;
      expect(wrapper).toHaveStyle('paddingInline: clamp(16px, 10vw, 144px)');
    });
  });

  describe('Multiple sections', () => {
    it('renders different heading variants', () => {
      const { rerender } = render(
        <SectionHeading subtitle="Spotlight" title="SPOTLIGHT BOARD" />
      );
      expect(screen.getByText('Spotlight')).toBeInTheDocument();
      expect(screen.getByText('SPOTLIGHT BOARD')).toBeInTheDocument();

      rerender(<SectionHeading subtitle="Awards" title="AWARD WINNERS" />);
      expect(screen.getByText('Awards')).toBeInTheDocument();
      expect(screen.getByText('AWARD WINNERS')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles long subtitle text', () => {
      render(
        <SectionHeading
          subtitle="Sun* Annual Awards 2025 - Recognition and Appreciation System"
          title="LONG TITLE"
        />
      );
      expect(
        screen.getByText('Sun* Annual Awards 2025 - Recognition and Appreciation System')
      ).toBeInTheDocument();
    });

    it('handles special characters in text', () => {
      render(
        <SectionHeading
          subtitle="Sun* 2025 (ABC)"
          title="GHI NHẬN & CẢM ƠN"
        />
      );
      expect(screen.getByText('Sun* 2025 (ABC)')).toBeInTheDocument();
      expect(screen.getByText('GHI NHẬN & CẢM ƠN')).toBeInTheDocument();
    });
  });
});
