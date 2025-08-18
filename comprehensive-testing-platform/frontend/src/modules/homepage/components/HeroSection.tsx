/**
 * 英雄区域组件
 * 遵循统一开发标准的首页组件
 */

import React from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { useLanguage } from '@/contexts/LanguageContext';

export interface HeroSectionProps extends BaseComponentProps {
  onStartTest?: () => void;
  config?: {
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    ctaText: string;
    ctaRoute: string;
  };
}

// 默认配置
const defaultConfig = {
  title: "🌟 发现你的内心世界",
  subtitle: "专业的心理测试与占星分析平台",
  description: "通过科学的心理测试、神秘的占星术和塔罗牌，帮助你更好地了解自己，找到人生的方向。我们的平台提供多种测试类型，从心理学到占星学，从职业规划到人际关系，全方位助力你的成长。",
  features: [
    "🔬 科学心理学测试",
    "⭐ 专业占星分析", 
    "🎴 神秘塔罗占卜",
    "💼 职业规划指导",
    "❤️ 人际关系分析",
    "🧠 认知能力评估"
  ],
  ctaText: "开始测试",
  ctaRoute: "/tests"
};

/**
 * 英雄区域组件
 * 展示平台主要介绍和特色，引导用户开始使用
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  className,
  testId = 'hero-section',
  config = defaultConfig,
  onStartTest,
  ...props
}) => {
  const { t } = useLanguage();

  // 使用语言上下文进行配置
  const heroConfig = {
    title: t('hero.title'),
    subtitle: t('hero.subtitle'),
    description: t('hero.description'),
    features: [
      t('hero.feature.psychology'),
      t('hero.feature.astrology'),
      t('hero.feature.tarot'),
      t('hero.feature.career'),
      t('hero.feature.relationship'),
      t('hero.feature.cognitive')
    ],
    ctaText: t('hero.cta.start'),
    ctaRoute: "/tests"
  };

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50",
        "py-20 px-4 sm:px-6 lg:px-8",
        className
      )}
      data-testid={testId}
      {...props}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto text-center">
        {/* 主标题 */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          {heroConfig.title}
        </h1>

        {/* 副标题 */}
        <p className="text-xl sm:text-2xl lg:text-3xl text-primary-600 font-semibold mb-8">
          {heroConfig.subtitle}
        </p>

        {/* 描述 */}
        <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
          {heroConfig.description}
        </p>

        {/* 特色功能 */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {heroConfig.features.map((feature, index) => (
            <span
              key={index}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 shadow-sm"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* 信任标识 */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {t('trust.users')}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            {t('trust.team')}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            {t('trust.ai')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 