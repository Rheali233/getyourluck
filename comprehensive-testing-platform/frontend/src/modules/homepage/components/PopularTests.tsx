/**
 * 热门推荐区组件
 * 展示最受欢迎的测试功能
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { Card } from '@/components/ui';


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
      description: 'Discover your MBTI personality type with AI commentary that highlights strengths, blind spots, and collaboration tips in under 10 minutes.',
      icon: '🧠',
      category: 'Psychology',
      rating: 4.9,
      testCount: 12500,
      isHot: true,
      route: '/tests/psychology/mbti'
    },
    {
      id: 'birth-chart',
      name: 'Birth Chart Analysis',
      description: 'Unlock your cosmic blueprint with detailed birth chart, zodiac compatibility, and timing insights tailored to your exact birth details.',
      icon: '⭐',
      category: 'Astrology',
      rating: 4.8,
      testCount: 8900,
      isHot: true,
      route: '/tests/astrology/birth-chart'
    },
    {
      id: 'tarot-reading',
      name: 'Tarot Card Reading',
      description: 'Explore interactive tarot spreads that surface guidance for love, career, and everyday decisions with reflective prompts you can act on.',
      icon: '🔮',
      category: 'Tarot',
      rating: 4.7,
      testCount: 6700,
      isHot: true,
      route: '/tests/tarot'
    },
    {
      id: 'emotional-intelligence',
      name: 'Emotional Intelligence Test',
      description: 'Measure self-awareness, empathy, and social navigation skills while receiving practical coaching tips to strengthen emotional intelligence.',
      icon: '💚',
      category: 'Psychology',
      rating: 4.8,
      testCount: 5400,
      isHot: false,
      route: '/tests/psychology/eq'
    },
    {
      id: 'career-assessment',
      name: 'Career Path Discovery',
      description: 'Match your strengths with ideal roles using Holland code, DISC insights, and curated career roadmaps designed for rapid planning.',
      icon: '💼',
      category: 'Career',
      rating: 4.6,
      testCount: 4800,
      isHot: false,
      route: '/tests/career/holland'
    },
    {
      id: 'love-language',
      name: 'Love Language Test',
      description: 'Discover your primary love languages and receive actionable tips to build deeper, more meaningful romantic and family connections.',
      icon: '💕',
      category: 'Relationship',
      rating: 4.7,
      testCount: 3200,
      isHot: false,
      route: '/tests/relationship/love-language'
    }
  ];

  const displayTests = tests.length > 0 ? tests : defaultTests;
  const navigate = useNavigate();

  const handleTestClick = (test: PopularTest) => {
    if (onTestClick) {
      onTestClick(test);
    } else {
      // 直接导航到对应的测试页面
      navigate(test.route);
    }
  };

  return (
    <section
      className={cn("popular-tests py-12 relative overflow-hidden", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Popular AI-Powered Tests
          </h2>
        </div>

        {/* 热门测试网格 */}
        <div className="space-y-6">
          {/* 第一行：两个卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayTests.slice(0, 2).map((test) => (
              <Card
                key={test.id}
                className={cn(
                  "group cursor-pointer transition-all duration-300 hover:-translate-y-2 border-0 shadow-xl hover:shadow-2xl ring-1 ring-white/20 hover:ring-white/30 transform hover:rotate-1 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/30 before:to-transparent before:pointer-events-none",
                  "bg-gradient-to-br from-white/70 via-white/60 to-white/50 backdrop-blur-lg"
                )}
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
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {test.name}
                </h3>

                {/* 测试描述 */}
                <p className="text-gray-600 mb-3 text-xs line-clamp-3 leading-relaxed">
                  {test.description}
                </p>

                {/* 评分和测试次数 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "text-sm",
                          i < Math.floor(test.rating) ? "text-yellow-400" : "text-gray-300"
                        )}
                      >
                        ⭐
                      </span>
                    ))}
                    <span className="text-xs text-gray-500 ml-2">
                      {test.rating}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {test.testCount.toLocaleString()} tests
                  </span>
                </div>

                {/* 行动按钮 */}
                <div className="text-center">
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-0">
                    Start This Test →
                  </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* 第二行：三个卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTests.slice(2, 5).map((test) => (
              <Card
                key={test.id}
                className={cn(
                  "group cursor-pointer transition-all duration-300 hover:-translate-y-2 border-0 shadow-xl hover:shadow-2xl ring-1 ring-white/20 hover:ring-white/30 transform hover:rotate-1 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/30 before:to-transparent before:pointer-events-none",
                  "bg-gradient-to-br from-white/70 via-white/60 to-white/50 backdrop-blur-lg"
                )}
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
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {test.name}
                  </h3>

                  {/* 测试描述 */}
                  <p className="text-gray-600 mb-3 text-xs line-clamp-3 leading-relaxed">
                    {test.description}
                  </p>

                  {/* 评分和测试次数 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={cn(
                            "text-sm",
                            i < Math.floor(test.rating) ? "text-yellow-400" : "text-gray-300"
                          )}
                        >
                          ⭐
                        </span>
                      ))}
                      <span className="text-xs text-gray-500 ml-2">
                        {test.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {test.testCount.toLocaleString()} tests
                    </span>
                  </div>

                  {/* 行动按钮 */}
                  <div className="text-center">
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-0">
                    Start This Test →
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default PopularTests;
