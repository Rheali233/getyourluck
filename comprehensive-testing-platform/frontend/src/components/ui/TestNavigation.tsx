/**
 * Universal Test Navigation Component
 * Applicable to all test interface top navigation
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/classNames';

export interface TestNavigationProps {
  /** Current module name for back button text */
  moduleName: string;
  /** Back path */
  backPath: string;
  /** Additional CSS class names */
  className?: string;
  /** Whether to show reset test button */
  showResetButton?: boolean;
  /** Reset test callback function */
  onReset?: () => void;
}

export const TestNavigation: React.FC<TestNavigationProps> = ({
  moduleName,
  backPath,
  className,
  showResetButton = false,
  onReset
}) => {
  const navigate = useNavigate();

  return (
    <div className={cn("bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 sticky top-0 z-50", className)}>
      <div className="flex justify-between items-center h-16">
        {/* Left: Logo and Name */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl">🌟</span>
            <span className="text-xl font-bold text-gray-900">getyourluck</span>
          </button>
        </div>
        
        {/* Right: Button Group */}
        <div className="flex items-center space-x-3">
          {showResetButton && onReset && (
            <button
              onClick={onReset}
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
            >
              Reset Test
            </button>
          )}
          <button
            onClick={() => navigate(backPath)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Back to {moduleName}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestNavigation;
