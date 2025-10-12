/**
 * Progress Bar Component
 * Reusable progress indicator with customizable styling
 */

import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  height?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  showLabel?: boolean;
  animated?: boolean;
  testId?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = '',
  height = 'md',
  color = 'blue',
  showLabel = false,
  animated = true,
  testId = 'progress-bar'
}) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const getHeightClasses = () => {
    switch (height) {
      case 'sm':
        return 'h-1';
      case 'md':
        return 'h-2';
      case 'lg':
        return 'h-3';
      default:
        return 'h-2';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-600';
      case 'green':
        return 'bg-green-600';
      case 'purple':
        return 'bg-purple-600';
      case 'red':
        return 'bg-red-600';
      case 'yellow':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-600';
    }
  };

  const getBackgroundClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100';
      case 'green':
        return 'bg-green-100';
      case 'purple':
        return 'bg-purple-100';
      case 'red':
        return 'bg-red-100';
      case 'yellow':
        return 'bg-yellow-100';
      default:
        return 'bg-blue-100';
    }
  };

  return (
    <div className={`w-full ${className}`} data-testid={testId}>
      {/* Progress Bar Container */}
      <div className={`w-full ${getBackgroundClasses()} rounded-full overflow-hidden`}>
        <div
          className={`${getHeightClasses()} ${getColorClasses()} rounded-full transition-all duration-500 ${
            animated ? 'ease-out' : ''
          }`}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Optional Label */}
      {showLabel && (
        <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
          <span>Progress</span>
          <span className="font-medium">{Math.round(clampedProgress)}%</span>
        </div>
      )}
    </div>
  );
};

// Specialized Progress Bar Variants
export const TestProgressBar: React.FC<{
  currentQuestion: number;
  totalQuestions: number;
  className?: string;
  testId?: string;
}> = ({ currentQuestion, totalQuestions, className = '', testId = 'test-progress-bar' }) => {
  const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;

  return (
    <div className={className} data-testid={testId}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
        <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
      </div>
      <ProgressBar
        progress={progress}
        height="md"
        color="blue"
        animated={true}
        testId={`${testId}-bar`}
      />
    </div>
  );
};

export const TimeProgressBar: React.FC<{
  timeRemaining: number;
  totalTime: number;
  className?: string;
  testId?: string;
}> = ({ timeRemaining, totalTime, className = '', testId = 'time-progress-bar' }) => {
  const progress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;
  const isLowTime = timeRemaining < totalTime * 0.2; // Less than 20% remaining

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={className} data-testid={testId}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Time Remaining</span>
        <span className={`text-sm font-mono ${
          isLowTime ? 'text-red-600 font-bold' : 'text-gray-500'
        }`}>
          {formatTime(timeRemaining)}
        </span>
      </div>
      <ProgressBar
        progress={progress}
        height="sm"
        color={isLowTime ? 'red' : 'blue'}
        animated={true}
        testId={`${testId}-bar`}
      />
    </div>
  );
};

export const CircularProgressBar: React.FC<{
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  strokeWidth?: number;
  color?: 'blue' | 'green' | 'purple' | 'red';
  className?: string;
  testId?: string;
}> = ({ 
  progress, 
  size = 'md', 
  strokeWidth = 4, 
  color = 'blue',
  className = '',
  testId = 'circular-progress-bar'
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-16 h-16';
      case 'md':
        return 'w-24 h-24';
      case 'lg':
        return 'w-32 h-32';
      default:
        return 'w-24 h-24';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'text-blue-600';
      case 'green':
        return 'text-green-600';
      case 'purple':
        return 'text-purple-600';
      case 'red':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const radius = (size === 'sm' ? 32 : size === 'md' ? 48 : 64) - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} data-testid={testId}>
      <svg className={`${getSizeClasses()} transform -rotate-90`}>
        {/* Background Circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        {/* Progress Circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className={getColorClasses()}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.5s ease-in-out'
          }}
        />
      </svg>
      
      {/* Center Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-700">
          {Math.round(clampedProgress)}%
        </span>
      </div>
    </div>
  );
};
