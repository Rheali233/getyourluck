import React from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { LoadingSpinner } from './LoadingSpinner';

interface SuspenseFallbackProps extends BaseComponentProps {
  message?: string;
  description?: string;
}

/**
 * 可访问的 Suspense 占位组件
 * 在保持原有渐变背景的同时，提供语义化的加载提示
 */
export const SuspenseFallback: React.FC<SuspenseFallbackProps> = ({
  className,
  testId = 'suspense-fallback',
  message = 'Loading content, please wait…',
  description = 'We are preparing the requested content and will display it shortly.'
}) => {
  return (
    <div
      className={cn(
        'min-h-screen relative flex items-center justify-center overflow-hidden',
        'bg-gradient-to-br from-blue-200 via-purple-300 to-indigo-400',
        className
      )}
      data-testid={testId}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" aria-hidden="true" />
      <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center text-sky-900">
        <LoadingSpinner size="large" />
        <p className="text-lg font-semibold" data-testid={`${testId}-message`}>
          {message}
        </p>
        <p className="text-sm text-sky-900/80 max-w-md" data-testid={`${testId}-description`}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default SuspenseFallback;
