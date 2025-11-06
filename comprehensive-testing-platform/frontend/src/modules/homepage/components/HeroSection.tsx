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

// 默认配置（全英文）- 匹配部署版本
const defaultConfig = {
  title: "Free AI-Powered Self-Discovery Tests",
  subtitle: "Discover tailored assessments that map your personality, strengths, relationships, and career path in minutes.",
  description: "SelfAtlas combines MBTI, career frameworks, tarot, astrology, and numerology into one research-informed journey. Start for free, get instant guidance, and revisit your dashboard anytime.",
  features: [
    "AI-Ready MBTI & Personality Science",
    "Career, Tarot & Astrology Guidance",
    "Start Free — No Account Required"
  ],
  ctaText: "Start Free Test",
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
  const heroConfig = config;

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        "pt-20 pb-12 px-4 sm:px-6 lg:px-8",
        className
      )}
      data-testid={testId}
      {...props}
    >

      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-200/20 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-200/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-pink-200/15 rounded-full blur-xl animate-bounce delay-500"></div>
      </div>

      <div className="relative max-w-6xl mx-auto text-center z-10">
        {/* 主标题 */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
          {heroConfig.title}
        </h1>

        {/* 副标题/描述 */}
        <p className="text-xl sm:text-2xl lg:text-3xl text-primary-600 font-semibold mb-8 animate-fade-in delay-300">
          {heroConfig.subtitle}
        </p>

        {heroConfig.description && (
          <p className="hidden lg:block text-lg text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in delay-500">
            {heroConfig.description}
          </p>
        )}

        {/* CTA 按钮 */}
        <div className="animate-fade-in delay-700">
          <button 
            onClick={onStartTest}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg"
          >
            {heroConfig.ctaText}
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Instant AI Insights
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Research-Informed Models
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Start Free, No Account
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 