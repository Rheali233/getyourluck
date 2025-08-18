/**
 * 主布局组件
 * 遵循统一开发标准的布局组件
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { Navigation, Footer } from '@/components/ui';

export interface MainLayoutProps extends BaseComponentProps {
  showNavigation?: boolean;
  showFooter?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  className,
  testId = 'main-layout',
  showNavigation = true,
  showFooter = true,
  ...props
}) => {
  return (
    <div
      className={cn("main-layout min-h-screen bg-white", className)}
      data-testid={testId}
      {...props}
    >
      {/* 导航栏 */}
      {showNavigation && <Navigation />}

      {/* 主要内容区域 */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* 页脚 */}
      {showFooter && <Footer />}
    </div>
  );
}; 