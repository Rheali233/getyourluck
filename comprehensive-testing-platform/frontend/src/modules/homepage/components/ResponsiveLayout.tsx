/**
 * 响应式布局工具
 * 支持不同屏幕尺寸的布局适配
 */

import React from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

export interface ResponsiveLayoutProps extends BaseComponentProps {
  children: React.ReactNode;
  columns?: {
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
  padding?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
  };
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  className,
  testId = 'responsive-layout',
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3, large: 4 },
  gap = { mobile: '4', tablet: '6', desktop: '8', large: '10' },
  padding = { mobile: '4', tablet: '6', desktop: '8', large: '12' },
  ...props
}) => {
  const gridClasses = cn(
    // 移动端
    `grid grid-cols-${columns.mobile} gap-${gap.mobile} p-${padding.mobile}`,
    // 平板
    `sm:grid-cols-${columns.tablet} sm:gap-${gap.tablet} sm:p-${padding.tablet}`,
    // 桌面端
    `lg:grid-cols-${columns.desktop} lg:gap-${gap.desktop} lg:p-${padding.desktop}`,
    // 大屏幕
    `xl:grid-cols-${columns.large} xl:gap-${gap.large} xl:p-${padding.large}`,
    className
  );

  return (
    <div className={gridClasses} data-testid={testId} {...props}>
      {children}
    </div>
  );
};

// 响应式容器组件
export interface ResponsiveContainerProps extends BaseComponentProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  padding?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
  };
  center?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  className,
  testId = 'responsive-container',
  children,
  maxWidth = '7xl',
  padding = { mobile: '4', tablet: '6', desktop: '8', large: '12' },
  center = true,
  ...props
}) => {
  const containerClasses = cn(
    `max-w-${maxWidth}`,
    center && 'mx-auto',
    `px-${padding.mobile}`,
    `sm:px-${padding.tablet}`,
    `lg:px-${padding.desktop}`,
    `xl:px-${padding.large}`,
    className
  );

  return (
    <div className={containerClasses} data-testid={testId} {...props}>
      {children}
    </div>
  );
};

// 响应式文本组件
export interface ResponsiveTextProps extends BaseComponentProps {
  children: React.ReactNode;
  size?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
  };
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  className,
  testId = 'responsive-text',
  children,
  size = { mobile: 'base', tablet: 'lg', desktop: 'xl', large: '2xl' },
  weight = 'normal',
  color = 'text-gray-900',
  align = 'left',
  ...props
}) => {
  const textClasses = cn(
    // 字体大小
    `text-${size.mobile}`,
    `sm:text-${size.tablet}`,
    `lg:text-${size.desktop}`,
    `xl:text-${size.large}`,
    // 字体粗细
    `font-${weight}`,
    // 颜色
    color,
    // 对齐
    `text-${align}`,
    className
  );

  return (
    <div className={textClasses} data-testid={testId} {...props}>
      {children}
    </div>
  );
};

// 响应式间距组件
export interface ResponsiveSpacingProps extends BaseComponentProps {
  children: React.ReactNode;
  margin?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
  };
  padding?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    large?: string;
  };
}

export const ResponsiveSpacing: React.FC<ResponsiveSpacingProps> = ({
  className,
  testId = 'responsive-spacing',
  children,
  margin = { mobile: '0', tablet: '0', desktop: '0', large: '0' },
  padding = { mobile: '0', tablet: '0', desktop: '0', large: '0' },
  ...props
}) => {
  const spacingClasses = cn(
    // 外边距
    `m-${margin.mobile}`,
    `sm:m-${margin.tablet}`,
    `lg:m-${margin.desktop}`,
    `xl:m-${margin.large}`,
    // 内边距
    `p-${padding.mobile}`,
    `sm:p-${padding.tablet}`,
    `lg:p-${padding.desktop}`,
    `xl:p-${padding.large}`,
    className
  );

  return (
    <div className={spacingClasses} data-testid={testId} {...props}>
      {children}
    </div>
  );
};

// 响应式隐藏/显示组件
export interface ResponsiveVisibilityProps extends BaseComponentProps {
  children: React.ReactNode;
  hideOn?: ('mobile' | 'tablet' | 'desktop' | 'large')[];
  showOn?: ('mobile' | 'tablet' | 'desktop' | 'large')[];
}

export const ResponsiveVisibility: React.FC<ResponsiveVisibilityProps> = ({
  className,
  testId = 'responsive-visibility',
  children,
  hideOn = [],
  showOn = [],
  ...props
}) => {
  const visibilityClasses = cn(
    // 隐藏类
    hideOn.includes('mobile') && 'hidden',
    hideOn.includes('tablet') && 'sm:hidden',
    hideOn.includes('desktop') && 'lg:hidden',
    hideOn.includes('large') && 'xl:hidden',
    // 显示类
    showOn.includes('mobile') && 'block',
    showOn.includes('tablet') && 'sm:block',
    showOn.includes('desktop') && 'lg:block',
    showOn.includes('large') && 'xl:block',
    className
  );

  return (
    <div className={visibilityClasses} data-testid={testId} {...props}>
      {children}
    </div>
  );
};
