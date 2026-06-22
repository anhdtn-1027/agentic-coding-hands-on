import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserInfoBlock } from './user-info-block';
import type { KudosUser } from './types';

const mockUser: KudosUser = {
  id: 'u1',
  name: 'Trần Thị Minh Châu',
  avatarUrl: '/shared/user-profile.svg',
  department: 'CEVC03',
  stars: 5,
  badge: 'gold',
};

describe('UserInfoBlock', () => {
  describe('Rendering', () => {
    it('renders user name', () => {
      render(<UserInfoBlock user={mockUser} />);
      expect(screen.getByText('Trần Thị Minh Châu')).toBeInTheDocument();
    });

    it('renders user department', () => {
      render(<UserInfoBlock user={mockUser} />);
      expect(screen.getByText('CEVC03')).toBeInTheDocument();
    });

    it('renders avatar image', () => {
      render(<UserInfoBlock user={mockUser} />);
      const img = screen.getByAltText('Trần Thị Minh Châu');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/shared/user-profile.svg');
    });

    it('renders avatar with correct dimensions', () => {
      render(<UserInfoBlock user={mockUser} />);
      const img = screen.getByAltText('Trần Thị Minh Châu');
      expect(img).toHaveAttribute('width', '64');
      expect(img).toHaveAttribute('height', '64');
    });
  });

  describe('Avatar styling', () => {
    it('avatar has circular border with white frame', () => {
      const { container } = render(<UserInfoBlock user={mockUser} />);
      const avatarContainer = container.querySelector('[style*="border-radius"]');
      expect(avatarContainer).toHaveStyle('borderRadius: 50%');
      expect(avatarContainer).toHaveStyle('border: 1.869px solid #FFFFFF');
    });

    it('avatar dimensions are 64x64', () => {
      const { container } = render(<UserInfoBlock user={mockUser} />);
      const avatarContainer = container.querySelector('[style*="width: 64"]');
      expect(avatarContainer).toHaveStyle('width: 64px');
      expect(avatarContainer).toHaveStyle('height: 64px');
    });

    it('avatar has light gray background fallback', () => {
      const { container } = render(<UserInfoBlock user={mockUser} />);
      const avatarContainer = container.querySelector('[style*="background"]');
      expect(avatarContainer).toHaveStyle('background: #EEE');
    });
  });

  describe('Typography', () => {
    it('name uses Montserrat 700 16px', () => {
      const { container } = render(<UserInfoBlock user={mockUser} />);
      const nameSpan = container.querySelector('span');
      expect(nameSpan).toHaveStyle('fontFamily: Montserrat, sans-serif');
      expect(nameSpan).toHaveStyle('fontWeight: 700');
      expect(nameSpan).toHaveStyle('fontSize: 16px');
      expect(nameSpan).toHaveStyle('color: #00101A');
    });

    it('department uses Montserrat 700 12px gray', () => {
      const { container } = render(<UserInfoBlock user={mockUser} />);
      const spans = container.querySelectorAll('span');
      const departmentSpan = spans[spans.length - 1]; // Last span is department
      expect(departmentSpan).toHaveStyle('fontWeight: 700');
      expect(departmentSpan).toHaveStyle('fontSize: 12px');
      expect(departmentSpan).toHaveStyle('color: #999999');
    });

    it('text is centered and truncated', () => {
      const { container } = render(<UserInfoBlock user={mockUser} />);
      const nameSpan = container.querySelector('span');
      expect(nameSpan).toHaveStyle('textAlign: center');
      expect(nameSpan).toHaveClass('truncate');
    });
  });

  describe('Layout', () => {
    it('renders with flex column layout centered', () => {
      const { container } = render(<UserInfoBlock user={mockUser} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('flex');
      expect(wrapper).toHaveClass('flex-col');
      expect(wrapper).toHaveClass('items-center');
    });

    it('maintains 235px width', () => {
      const { container } = render(<UserInfoBlock user={mockUser} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveStyle('width: 235px');
    });

    it('has 13px gap between avatar and text', () => {
      const { container } = render(<UserInfoBlock user={mockUser} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveStyle('gap: 13px');
    });
  });

  describe('Variant prop (sender/receiver)', () => {
    it('renders sender variant with correct user name', () => {
      render(<UserInfoBlock user={mockUser} variant="sender" />);
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    });

    it('renders receiver variant with correct user name', () => {
      render(<UserInfoBlock user={mockUser} variant="receiver" />);
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    });

    it('renders same user name for both variants', () => {
      const { unmount: unmount1 } = render(<UserInfoBlock user={mockUser} variant="sender" />);
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
      unmount1();

      render(<UserInfoBlock user={mockUser} variant="receiver" />);
      expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles long names gracefully with truncate', () => {
      const longNameUser: KudosUser = {
        ...mockUser,
        name: 'Nguyễn Thị Thanh Thảo Ngô Trọng Nghĩa Đặng Thị Ngọc Ánh',
      };
      render(<UserInfoBlock user={longNameUser} />);
      const nameSpan = screen.getByText(/Nguyễn/);
      expect(nameSpan).toHaveClass('truncate');
    });

    it('renders user with special characters in name', () => {
      const specialUser: KudosUser = {
        ...mockUser,
        name: 'Huỳnh Dương Xuân Nhật',
      };
      render(<UserInfoBlock user={specialUser} />);
      expect(screen.getByText('Huỳnh Dương Xuân Nhật')).toBeInTheDocument();
    });

    it('renders user with special characters in department', () => {
      const specialDeptUser: KudosUser = {
        ...mockUser,
        department: 'CEVC10-AI/ML',
      };
      render(<UserInfoBlock user={specialDeptUser} />);
      expect(screen.getByText('CEVC10-AI/ML')).toBeInTheDocument();
    });
  });
});
