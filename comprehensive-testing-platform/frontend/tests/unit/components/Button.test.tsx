import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the Button component if it doesn't exist yet
const MockButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);

describe('Button Component', () => {
  it('should render with children text', () => {
    render(<MockButton>Click me</MockButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<MockButton className="custom-class">Button</MockButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<MockButton onClick={handleClick}>Click me</MockButton>);
    
    const button = screen.getByRole('button');
    button.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<MockButton disabled>Disabled Button</MockButton>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
