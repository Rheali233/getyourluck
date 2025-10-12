/**
 * 英雄区域组件
 * 遵循统一开发标准的首页组件
 */

import React from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';


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
  // Hero section configuration
  const heroConfig = {
    title: "Discover Your True Self, Meet a Better Future",
    subtitle: "🌟 Get your personality code in 3 minutes through fun psychological tests and AI intelligent analysis!",
    description: "Still confused about \"who am I?\" Want to know what career suits you best? No registration needed, just take the test and get a professional report instantly ✨",
    features: [
      "🔬 Scientific & Reliable",
      "🎯 Accurate & Insightful", 
      "🔒 Privacy Protected",
      "⚡ Instant Results",
      "📱 Access Anywhere"
    ],
    ctaText: "Start Testing",
    ctaRoute: "/tests"
  };

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        "py-20 px-4 sm:px-6 lg:px-8",
        className
      )}
      data-testid={testId}
      {...props}
    >

      <div className="relative max-w-6xl mx-auto text-center">
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
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/80 border border-gray-200 text-gray-700 shadow-sm"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Trusted by 10,000+ Users
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Professional Team
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            AI-Powered Analysis
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 