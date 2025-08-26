/**
 * 热门推荐区组件
 * 展示最受欢迎的测试功能
 */

import React from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';


export interface PopularTest {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rating: number;
  testCount: number;
  isHot: boolean;
  route: string;
}

export interface PopularTestsProps extends BaseComponentProps {
  tests?: PopularTest[];
  onTestClick?: (test: PopularTest) => void;
}

export const PopularTests: React.FC<PopularTestsProps> = ({
  className,
  testId = 'popular-tests',
  tests = [],
  onTestClick,
  ...props
}) => {
  // Default popular tests data
  const defaultTests: PopularTest[] = [
    {
      id: 'mbti-personality',
      name: 'MBTI Personality Test',
      description: 'Want to know your personality type? This interesting test will tell you whether you are introverted or extroverted, rational or emotional.',
      icon: '🧠',
      category: 'Psychology',
      rating: 4.9,
      testCount: 12500,
      isHot: true,
      route: '/tests/mbti'
    },
    {
      id: 'daily-horoscope',
      name: 'Daily Horoscope',
      description: 'What should you do today? How is your love fortune? Will work go smoothly? Spend 1 minute each day checking your zodiac fortune.',
      icon: '⭐',
      category: 'Astrology',
      rating: 4.8,
      testCount: 8900,
      isHot: true,
      route: '/tests/horoscope'
    },
    {
      id: 'tarot-love',
      name: 'Tarot Love Reading',
      description: 'Have someone in mind but don\'t know how they feel about you? Confused about relationships? Let the mysterious tarot cards guide you.',
      icon: '🎴',
      category: 'Tarot',
      rating: 4.7,
      testCount: 6700,
      isHot: true,
      route: '/tests/tarot'
    },
    {
      id: 'mental-health',
      name: 'Mental Health Assessment',
      description: 'Feeling tired lately? Emotions not great? This gentle test helps you understand your mental state.',
      icon: '💚',
      category: 'Mental Health',
      rating: 4.8,
      testCount: 5400,
      isHot: false,
      route: '/tests/mental-health'
    },
    {
      id: 'career-interest',
      name: 'Career Interest Exploration',
      description: 'Don\'t know what job suits you? Confused about future career planning? This test will help you discover your interests and talents.',
      icon: '💼',
      category: 'Career Planning',
      rating: 4.6,
      testCount: 4800,
      isHot: false,
      route: '/tests/career'
    }
  ];

  const displayTests = tests.length > 0 ? tests : defaultTests;

  const handleTestClick = (test: PopularTest) => {
    if (onTestClick) {
      onTestClick(test);
    }
  };

  return (
    <section
      className={cn("popular-tests py-16 bg-white", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title section */}
        <div className="text-left mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            🔥 Popular Tests
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Try our most popular tests and discover your true self
          </p>
        </div>

        {/* 热门测试网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => handleTestClick(test)}
            >
              {/* 热门标识 */}
              {test.isHot && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    🔥 Hot
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* 测试图标和分类 */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{test.icon}</span>
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                      {test.category}
                    </span>
                  </div>
                </div>

                {/* 测试名称 */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {test.name}
                </h3>

                {/* 测试描述 */}
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {test.description}
                </p>

                {/* 评分和测试次数 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "text-lg",
                          i < Math.floor(test.rating) ? "text-yellow-400" : "text-gray-300"
                        )}
                      >
                        ⭐
                      </span>
                    ))}
                    <span className="text-sm text-gray-500 ml-2">
                      {test.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {test.testCount.toLocaleString()} tests
                  </span>
                </div>

                {/* 行动按钮 */}
                <button className="w-full bg-primary-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-0">
                  Start Test
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 查看更多按钮 */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200 focus:outline-none focus:ring-0">
            View More Tests
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularTests;
