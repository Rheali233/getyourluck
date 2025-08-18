/**
 * 测试模块统计展示组件
 * 显示各测试模块的使用统计、评分和热门程度
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

export interface TestModuleStatsProps extends BaseComponentProps {
  moduleId: string;
  stats?: {
    totalUsers: number;
    averageRating: number;
    completionRate: number;
    popularityScore: number;
    lastUpdated: string;
  };
  showDetails?: boolean;
  variant?: 'card' | 'inline' | 'minimal';
}

export const TestModuleStats: React.FC<TestModuleStatsProps> = ({
  className,
  testId = 'test-module-stats',
  moduleId,
  stats,
  showDetails = true,
  variant = 'card',
  ...props
}) => {
  const { t } = useTranslation('homepage');
  const [isLoading, setIsLoading] = useState(false);
  const [localStats, setLocalStats] = useState(stats);

  // 如果没有传入stats，则从API获取
  useEffect(() => {
    if (!stats && moduleId) {
      fetchModuleStats();
    }
  }, [moduleId, stats]);

  const fetchModuleStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/homepage/modules/${moduleId}/stats`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setLocalStats(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch module stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={cn("animate-pulse", className)} data-testid={testId} {...props}>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!localStats) {
    return null;
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatRating = (rating: number): string => {
    return rating.toFixed(1);
  };

  const formatPercentage = (rate: number): string => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  const getPopularityColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPopularityText = (score: number): string => {
    if (score >= 80) return '非常热门';
    if (score >= 60) return '比较热门';
    if (score >= 40) return '一般';
    return '较少使用';
  };

  // 内联变体
  if (variant === 'inline') {
    return (
      <div className={cn("flex items-center space-x-4 text-sm", className)} data-testid={testId} {...props}>
        <span className="flex items-center space-x-1">
          <span className="text-gray-500">👥</span>
          <span>{formatNumber(localStats.totalUsers)}</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="text-gray-500">⭐</span>
          <span>{formatRating(localStats.averageRating)}</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="text-gray-500">📊</span>
          <span>{formatPercentage(localStats.completionRate)}</span>
        </span>
      </div>
    );
  }

  // 最小化变体
  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center space-x-2 text-xs text-gray-600", className)} data-testid={testId} {...props}>
        <span>{formatNumber(localStats.totalUsers)}人测试</span>
        <span>•</span>
        <span>⭐ {formatRating(localStats.averageRating)}</span>
      </div>
    );
  }

  // 卡片变体（默认）
  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-4", className)} data-testid={testId} {...props}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 总用户数 */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatNumber(localStats.totalUsers)}
          </div>
          <div className="text-sm text-gray-600">总用户数</div>
        </div>

        {/* 平均评分 */}
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {formatRating(localStats.averageRating)}
          </div>
          <div className="text-sm text-gray-600">平均评分</div>
        </div>

        {/* 完成率 */}
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {formatPercentage(localStats.completionRate)}
          </div>
          <div className="text-sm text-gray-600">完成率</div>
        </div>

        {/* 热门程度 */}
        <div className="text-center">
          <div className={cn("text-2xl font-bold", getPopularityColor(localStats.popularityScore))}>
            {localStats.popularityScore}
          </div>
          <div className="text-sm text-gray-600">{getPopularityText(localStats.popularityScore)}</div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>最后更新: {new Date(localStats.lastUpdated).toLocaleDateString()}</span>
            <button
              onClick={fetchModuleStats}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              刷新
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
