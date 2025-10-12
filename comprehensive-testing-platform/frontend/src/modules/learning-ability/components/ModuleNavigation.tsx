/**
 * Learning Ability Module Navigation Component
 * Provides internal navigation within the learning ability module
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LEARNING_NAVIGATION_ITEMS } from '../routes';
import { cn } from '@/utils/classNames';

export interface ModuleNavigationProps {
  className?: string;
  testId?: string;
  showDescriptions?: boolean;
  variant?: 'horizontal' | 'vertical' | 'cards';
}

export const ModuleNavigation: React.FC<ModuleNavigationProps> = ({
  className,
  testId = 'module-navigation',
  showDescriptions = true,
  variant = 'horizontal'
}) => {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    if (path === '/learning') {
      return location.pathname === '/learning';
    }
    return location.pathname.startsWith(path);
  };

  if (variant === 'cards') {
    return (
      <nav
        className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}
        data-testid={testId}
      >
        {LEARNING_NAVIGATION_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "block p-6 rounded-lg border-2 transition-all duration-200",
              "hover:hover:-translate-y-1",
              isActiveRoute(item.path)
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-gray-200 bg-white hover:border-primary-200 text-gray-700 hover:text-primary-600"
            )}
          >
            <div className="text-center">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold mb-2">{item.name}</h3>
              {showDescriptions && (
                <p className="text-sm text-gray-600">{item.description}</p>
              )}
            </div>
          </Link>
        ))}
      </nav>
    );
  }

  if (variant === 'vertical') {
    return (
      <nav
        className={cn("space-y-2", className)}
        data-testid={testId}
      >
        {LEARNING_NAVIGATION_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
              "hover:bg-gray-50",
              isActiveRoute(item.path)
                ? "bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                : "text-gray-700 hover:text-primary-600"
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <div>
              <div className="font-medium">{item.name}</div>
              {showDescriptions && (
                <div className="text-sm text-gray-500">{item.description}</div>
              )}
            </div>
          </Link>
        ))}
      </nav>
    );
  }

  // Default horizontal navigation
  return (
    <nav
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
      data-testid={testId}
    >
      {LEARNING_NAVIGATION_ITEMS.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200",
            "hover:bg-gray-50",
            isActiveRoute(item.path)
              ? "bg-primary-100 text-primary-700 font-medium"
              : "text-gray-700 hover:text-primary-600"
          )}
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default ModuleNavigation;
