/**
 * 个性化推荐组件
 * 基于用户行为数据和偏好提供智能推荐
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';

export interface PersonalizedRecommendationsProps extends BaseComponentProps {
  userId?: string;
  sessionId?: string;
  maxItems?: number;
  variant?: 'grid' | 'list' | 'carousel';
  showTitle?: boolean;
  showDescription?: boolean;
}

export interface RecommendationItem {
  id: string;
  type: 'test' | 'article' | 'feature';
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  image?: string;
  icon?: string;
  category: string;
  categoryEn: string;
  relevanceScore: number;
  reason: string;
  reasonEn: string;
  metadata?: Record<string, any>;
}

export const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  className,
  testId = 'personalized-recommendations',
  userId,
  sessionId,
  maxItems = 6,
  variant = 'grid',
  showTitle = true,
  showDescription = true,
  ...props
}) => {
  const { t, i18n } = useTranslation('homepage');
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取个性化推荐
  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (sessionId) params.append('sessionId', sessionId);
      params.append('limit', maxItems.toString());

      const response = await fetch(`/api/homepage/recommendations?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      if (data.success) {
        setRecommendations(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch recommendations');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Failed to fetch personalized recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 组件挂载时获取推荐
  useEffect(() => {
    fetchRecommendations();
  }, [userId, sessionId, maxItems]);

  // 获取本地化文本
  const getLocalizedText = (item: RecommendationItem, field: 'title' | 'description' | 'category' | 'reason') => {
    const currentLang = i18n.language;
    const fieldEn = `${field}En` as keyof RecommendationItem;
    
    if (currentLang === 'en' && item[fieldEn]) {
      return item[fieldEn] as string;
    }
    
    return item[field] as string;
  };

  // 获取推荐原因图标
  const getReasonIcon = (reason: string): string => {
    if (reason.includes('热门')) return '🔥';
    if (reason.includes('相似')) return '🔍';
    if (reason.includes('新')) return '🆕';
    if (reason.includes('评分')) return '⭐';
    if (reason.includes('历史')) return '📚';
    return '💡';
  };

  // 获取相关性颜色
  const getRelevanceColor = (score: number): string => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-blue-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-gray-600';
  };

  // 处理推荐项点击
  const handleRecommendationClick = (item: RecommendationItem) => {
    // 记录推荐项点击事件
    recordRecommendationClick(item);
    
    // 根据类型进行导航
    switch (item.type) {
      case 'test':
        window.location.href = `/tests/${item.category}/${item.id}`;
        break;
      case 'article':
        window.location.href = `/blog/${item.id}`;
        break;
      case 'feature':
        // 处理功能推荐
        break;
    }
  };

  // 记录推荐项点击
  const recordRecommendationClick = async (item: RecommendationItem) => {
    try {
      await fetch('/api/homepage/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'recommendation_click',
          recommendationId: item.id,
          userId,
          sessionId,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to record recommendation click:', error);
    }
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className={cn("animate-pulse", className)} data-testid={testId} {...props}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: maxItems }).map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-48"></div>
          ))}
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className={cn("text-center py-8", className)} data-testid={testId} {...props}>
        <div className="text-red-600 mb-4">⚠️ {error}</div>
        <button
          onClick={fetchRecommendations}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  // 没有推荐
  if (recommendations.length === 0) {
    return (
      <div className={cn("text-center py-8 text-gray-500", className)} data-testid={testId} {...props}>
        <div className="text-lg mb-2">暂无个性化推荐</div>
        <div className="text-sm">完成一些测试后，我们将为您提供个性化推荐</div>
      </div>
    );
  }

  // 网格布局
  if (variant === 'grid') {
    return (
      <div className={cn("", className)} data-testid={testId} {...props}>
        {showTitle && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🎯 为您推荐
            </h2>
            {showDescription && (
              <p className="text-gray-600">
                基于您的兴趣和行为，我们为您精选了以下内容
              </p>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => handleRecommendationClick(item)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-2xl">{item.icon || '📋'}</div>
                  <div className={cn("text-sm font-medium", getRelevanceColor(item.relevanceScore))}>
                    {Math.round(item.relevanceScore * 100)}% 匹配
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {getLocalizedText(item, 'title')}
                </h3>
                
                {showDescription && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {getLocalizedText(item, 'description')}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {getLocalizedText(item, 'category')}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <span>{getReasonIcon(item.reason)}</span>
                    <span>{getLocalizedText(item, 'reason')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 列表布局
  if (variant === 'list') {
    return (
      <div className={cn("", className)} data-testid={testId} {...props}>
        {showTitle && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🎯 为您推荐
            </h2>
            {showDescription && (
              <p className="text-gray-600">
                基于您的兴趣和行为，我们为您精选了以下内容
              </p>
            )}
          </div>
        )}
        
        <div className="space-y-4">
          {recommendations.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group p-4"
              onClick={() => handleRecommendationClick(item)}
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{item.icon || '📋'}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {getLocalizedText(item, 'title')}
                  </h3>
                  {showDescription && (
                    <p className="text-gray-600 text-sm mb-2">
                      {getLocalizedText(item, 'description')}
                    </p>
                  )}
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {getLocalizedText(item, 'category')}
                    </span>
                    <span className="text-gray-500">
                      {getReasonIcon(item.reason)} {getLocalizedText(item, 'reason')}
                    </span>
                  </div>
                </div>
                <div className={cn("text-sm font-medium", getRelevanceColor(item.relevanceScore))}>
                  {Math.round(item.relevanceScore * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 轮播布局
  return (
    <div className={cn("", className)} data-testid={testId} {...props}>
      {showTitle && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🎯 为您推荐
          </h2>
          {showDescription && (
            <p className="text-gray-600">
              基于您的兴趣和行为，我们为您精选了以下内容
            </p>
          )}
        </div>
      )}
      
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {recommendations.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-80 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => handleRecommendationClick(item)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-2xl">{item.icon || '📋'}</div>
                  <div className={cn("text-sm font-medium", getRelevanceColor(item.relevanceScore))}>
                    {Math.round(item.relevanceScore * 100)}% 匹配
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {getLocalizedText(item, 'title')}
                </h3>
                
                {showDescription && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {getLocalizedText(item, 'description')}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {getLocalizedText(item, 'category')}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <span>{getReasonIcon(item.reason)}</span>
                    <span>{getLocalizedText(item, 'reason')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
