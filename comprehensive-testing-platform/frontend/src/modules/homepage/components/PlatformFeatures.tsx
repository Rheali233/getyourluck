/**
 * 平台特色区组件
 * 展示平台的核心优势和特色
 */

import React from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { useLanguage } from '@/contexts/LanguageContext';

export interface PlatformFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface PlatformFeaturesProps extends BaseComponentProps {
  features?: PlatformFeature[];
}

export const PlatformFeatures: React.FC<PlatformFeaturesProps> = ({
  className,
  testId = 'platform-features',
  features = [],
  ...props
}) => {
  const { t } = useLanguage();

  // 默认平台特色数据
  const defaultFeatures: PlatformFeature[] = [
    {
      id: 'scientific',
      icon: '🔬',
      title: '科学专业',
      description: '基于权威心理学理论和标准化量表，确保测试结果的科学性和准确性',
      color: 'blue'
    },
    {
      id: 'ai-powered',
      icon: '🤖',
      title: 'AI智能分析',
      description: '采用先进人工智能技术，提供个性化深度分析报告和专业建议',
      color: 'purple'
    },
    {
      id: 'privacy',
      icon: '🔒',
      title: '隐私安全',
      description: '无需注册登录，数据加密保护，完全匿名使用，保障用户隐私安全',
      color: 'green'
    },
    {
      id: 'fast',
      icon: '⚡',
      title: '即测即得',
      description: '快速完成测试，实时生成专业报告，节省时间提高效率',
      color: 'yellow'
    },
    {
      id: 'responsive',
      icon: '📱',
      title: '多端适配',
      description: '支持手机、平板、电脑等多种设备，随时随地进行心理测试',
      color: 'indigo'
    },
    {
      id: 'personalized',
      icon: '🎯',
      title: '个性化推荐',
      description: '根据测试结果和用户偏好，智能推荐相关测试和改善建议',
      color: 'pink'
    }
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      pink: 'bg-pink-50 text-pink-700 border-pink-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <section
      className={cn("platform-features py-16 bg-gray-50", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            🌟 {t('featuresSection.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('featuresSection.subtitle')}
          </p>
        </div>

        {/* 特色功能网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayFeatures.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* 图标 */}
              <div className="text-4xl mb-4">{feature.icon}</div>

              {/* 标题 */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>

              {/* 描述 */}
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* 特色标签 */}
              <div className="mt-4">
                <span className={cn(
                  "inline-block px-3 py-1 text-xs font-medium rounded-full border",
                  getColorClasses(feature.color)
                )}>
                  {feature.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 底部说明 */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('featuresSection.bottomTitle')}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              {t('featuresSection.bottomDescription')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                🔒 {t('featuresSection.security')}
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                ⚡ {t('featuresSection.fast')}
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                🎯 {t('featuresSection.accurate')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformFeatures;
