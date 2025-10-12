/**
 * 通用分数展示组件
 * 适用于所有测试类型的分数展示
 * 
 * @example
 * // 心理学测试使用
 * <ScoreDisplay 
 *   score={75} 
 *   maxScore={100} 
 *   label="Extraversion" 
 *   theme="psychology" 
 * />
 * 
 * // 职业测试使用
 * <ScoreDisplay 
 *   score={8} 
 *   maxScore={10} 
 *   label="Realistic" 
 *   theme="career" 
 * />
 * 
 * @param score - 当前分数
 * @param maxScore - 最大分数
 * @param label - 分数标签
 * @param theme - 主题配置
 */

import React from 'react';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';

export interface ScoreDisplayProps extends BaseComponentProps {
  score: number;
  maxScore: number;
  label: string;
  theme?: string;
  showPercentage?: boolean;
  showProgressBar?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'circular' | 'bar';
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  maxScore,
  label,
  theme = 'psychology',
  showPercentage = true,
  showProgressBar = true,
  size = 'medium',
  variant = 'default',
  className,
  testId = 'score-display',
  ...props
}) => {
  // 当前组件未直接使用 themeConfig
  const percentage = (score / maxScore) * 100;

  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (variant === 'circular') {
    return (
      <div 
        className={cn("text-center", className)}
        data-testid={testId}
        {...props}
      >
        <div className="relative inline-flex items-center justify-center w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-gray-200"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - percentage / 100)}`}
              className={cn("transition-all duration-1000 ease-in-out", getScoreColor(percentage))}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn("font-bold", sizeClasses[size], getScoreColor(percentage))}>
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
        <div className="mt-2">
          <div className={cn("font-medium text-gray-900", sizeClasses[size])}>{label}</div>
          <div className="text-sm text-gray-600">{score}/{maxScore}</div>
        </div>
      </div>
    );
  }

  if (variant === 'bar') {
    return (
      <div 
        className={cn("", className)}
        data-testid={testId}
        {...props}
      >
        <div className="flex justify-between items-center mb-2">
          <span className={cn("font-medium text-gray-900", sizeClasses[size])}>{label}</span>
          <span className={cn("font-bold", sizeClasses[size], getScoreColor(percentage))}>
            {score}/{maxScore}
          </span>
        </div>
        {showProgressBar && (
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={cn(
                "h-3 rounded-full transition-all duration-500 ease-out",
                getProgressColor(percentage)
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
        {showPercentage && (
          <div className="text-right mt-1">
            <span className={cn("text-sm", getScoreColor(percentage))}>
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
    );
  }

  // 默认样式
  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-md p-6 text-center",
        className
      )}
      data-testid={testId}
      {...props}
    >
      <div className="mb-4">
        <div className={cn("text-3xl font-bold mb-2", getScoreColor(percentage))}>
          {score}
        </div>
        <div className="text-sm text-gray-600">out of {maxScore}</div>
      </div>
      
      <div className="mb-4">
        <div className={cn("font-semibold text-gray-900 mb-2", sizeClasses[size])}>
          {label}
        </div>
        {showPercentage && (
          <div className={cn("text-lg font-bold", getScoreColor(percentage))}>
            {Math.round(percentage)}%
          </div>
        )}
      </div>

      {showProgressBar && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className={cn(
              "h-2 rounded-full transition-all duration-500 ease-out",
              getProgressColor(percentage)
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      <div className="text-xs text-gray-500">
        {percentage >= 80 && "Excellent"}
        {percentage >= 60 && percentage < 80 && "Good"}
        {percentage >= 40 && percentage < 60 && "Average"}
        {percentage < 40 && "Below Average"}
      </div>
    </div>
  );
};
