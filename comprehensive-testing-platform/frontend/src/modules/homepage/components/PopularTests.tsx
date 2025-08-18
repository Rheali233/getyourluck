/**
 * 热门推荐区组件
 * 展示最受欢迎的测试功能
 */

import React from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();

  // 默认热门测试数据
  const defaultTests: PopularTest[] = [
    {
      id: 'mbti-personality',
      name: 'MBTI性格测试',
      description: '想知道自己是什么性格吗？这个有趣的测试会告诉你，你是内向还是外向，是理性还是感性。',
      icon: '🧠',
      category: '心理学',
      rating: 4.9,
      testCount: 12500,
      isHot: true,
      route: '/tests/mbti'
    },
    {
      id: 'daily-horoscope',
      name: '今日星座运势',
      description: '今天适合做什么？爱情运势如何？工作会顺利吗？每天花1分钟看看你的星座运势。',
      icon: '⭐',
      category: '占星学',
      rating: 4.8,
      testCount: 8900,
      isHot: true,
      route: '/tests/horoscope'
    },
    {
      id: 'tarot-love',
      name: '塔罗爱情占卜',
      description: '心里有个人却不知道ta对你的感觉？感情遇到困惑不知道怎么办？让神秘的塔罗牌为你指点迷津。',
      icon: '🎴',
      category: '塔罗牌',
      rating: 4.7,
      testCount: 6700,
      isHot: true,
      route: '/tests/tarot'
    },
    {
      id: 'mental-health',
      name: '心理健康小测试',
      description: '最近感觉有点累？情绪不太好？这个温和的小测试帮你了解自己的心理状态。',
      icon: '💚',
      category: '心理健康',
      rating: 4.8,
      testCount: 5400,
      isHot: false,
      route: '/tests/mental-health'
    },
    {
      id: 'career-interest',
      name: '职业兴趣探索',
      description: '不知道自己适合什么工作？对未来职业规划感到迷茫？这个测试会帮你发现自己的兴趣和天赋。',
      icon: '💼',
      category: '职业规划',
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
        {/* 标题区域 */}
        <div className="text-left mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            🔥 {t('popularSection.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            {t('popularSection.subtitle')}
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
                    🔥 热门
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
                    {test.testCount.toLocaleString()} 次测试
                  </span>
                </div>

                {/* 行动按钮 */}
                <button className="w-full bg-primary-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-0">
                  {t('popularSection.cta')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 查看更多按钮 */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200 focus:outline-none focus:ring-0">
            {t('popularSection.viewMore')}
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
