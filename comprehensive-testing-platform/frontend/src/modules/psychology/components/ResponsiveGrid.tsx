/**
 * Responsive grid layout component
 * Optimizes display of PHQ-9 test results across different screen sizes
 */

import React from 'react';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';

interface ResponsiveGridProps extends BaseComponentProps {
  children: React.ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    large?: number;
  };
  gap?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
  };
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  className,
  testId = 'responsive-grid',
  children,
  cols = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    large: 4
  },
  gap = {
    mobile: 'gap-4',
    tablet: 'gap-6',
    desktop: 'gap-8',
    large: 'gap-8'
  },
  ...props
}) => {
  // Build responsive grid class names
  const gridClasses = cn(
    'grid',
    // Mobile
    `grid-cols-${cols.mobile || 1}`,
    gap.mobile || 'gap-4',
    // Tablet
    `sm:grid-cols-${cols.tablet || cols.mobile || 1}`,
    `sm:${gap.tablet || gap.mobile || 'gap-4'}`,
    // Desktop
    `lg:grid-cols-${cols.desktop || cols.tablet || cols.mobile || 1}`,
    `lg:${gap.desktop || gap.tablet || gap.mobile || 'gap-4'}`,
    // Large screen
    `xl:grid-cols-${cols.large || cols.desktop || cols.tablet || cols.mobile || 1}`,
    `xl:${gap.large || gap.desktop || gap.tablet || gap.mobile || 'gap-4'}`,
    className
  );

  return (
    <div
      className={gridClasses}
      data-testid={testId}
      {...props}
    >
      {children}
    </div>
  );
};

// Predefined grid layouts
export const GridLayouts = {
  // Symptom analysis grid
  symptoms: {
    cols: { mobile: 1, tablet: 2, desktop: 2, large: 2 },
    gap: { mobile: 'gap-3', tablet: 'gap-4', desktop: 'gap-6', large: 'gap-6' }
  },
  // Suggestions and help grid
  recommendations: {
    cols: { mobile: 1, tablet: 2, desktop: 2, large: 2 },
    gap: { mobile: 'gap-4', tablet: 'gap-6', desktop: 'gap-8', large: 'gap-8' }
  },
  // Risk level grid
  riskLevels: {
    cols: { mobile: 1, tablet: 2, desktop: 2, large: 2 },
    gap: { mobile: 'gap-3', tablet: 'gap-4', desktop: 'gap-6', large: 'gap-6' }
  },
  // Statistical summary grid
  stats: {
    cols: { mobile: 2, tablet: 4, desktop: 4, large: 4 },
    gap: { mobile: 'gap-2', tablet: 'gap-3', desktop: 'gap-4', large: 'gap-4' }
  }
};
