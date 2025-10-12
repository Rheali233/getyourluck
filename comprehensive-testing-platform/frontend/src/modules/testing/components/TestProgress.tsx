/**
 * Test Progress Component
 * Shows test progress and allows navigation between questions
 */

import React from 'react';

interface TestProgressProps {
  current: number;
  total: number;
  progress: number;
  onGoToQuestion: (index: number) => void;
  className?: string;
  theme?: {
    primary: string;
    secondary: string;
    textPrimary: string;
    textSecondary: string;
  };
}

export const TestProgress: React.FC<TestProgressProps> = ({
  current,
  total,
  progress,
  // onGoToQuestion,
  className = '',
  theme
}) => {

  // Default theme colors
  const defaultTheme = {
    primary: 'blue-600',
    secondary: 'indigo-500',
    textPrimary: 'gray-700',
    textSecondary: 'gray-500'
  };

  const colors = theme || defaultTheme;

  return (
    <div className={`test-progress ${className}`}>
      {/* Progress bar */}
      <div className="progress-bar">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium text-${colors.textPrimary}`}>
            Progress: {Math.round(progress)}%
          </span>
          <span className={`text-sm text-${colors.textSecondary}`}>
            {current} of {total} questions
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`bg-${colors.primary} h-2 rounded-full transition-all duration-300 ease-out`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
