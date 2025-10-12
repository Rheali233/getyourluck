/**
 * 面包屑导航组件
 * 统一显示在页面标题上方，使用简洁的 home/testcenter/psychology 格式
 */

import React from 'react';
import { Link } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbProps extends BaseComponentProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className,
  testId = 'breadcrumb',
  ...props
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav 
      className={cn("text-xs text-gray-500 mb-2", className)}
      data-testid={testId}
      aria-label="Breadcrumb"
      {...props}
    >
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-1 text-gray-400">/</span>
            )}
            {item.current ? (
              <span className="text-gray-700 font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.href!} 
                className="hover:text-gray-700 hover:underline transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
