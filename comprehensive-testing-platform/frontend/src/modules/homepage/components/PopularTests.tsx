/**
 * 热门推荐区组件
 * 展示最受欢迎的测试功能
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
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
      description: 'Discover your true personality type! Are you an INTJ strategist or an ENFP enthusiast? Find out in just 10 minutes with our scientifically-backed assessment.',
      icon: '🧠',
      category: 'Psychology',
      rating: 4.9,
      testCount: 12500,
      isHot: true,
      route: '/psychology/mbti'
    },
    {
      id: 'birth-chart',
      name: 'Birth Chart Analysis',
      description: 'Unlock the secrets of your cosmic blueprint! Get personalized insights about your personality, relationships, and life path based on your exact birth details.',
      icon: '⭐',
      category: 'Astrology',
      rating: 4.8,
      testCount: 8900,
      isHot: true,
      route: '/astrology/birth-chart'
    },
    {
      id: 'tarot-reading',
      name: 'Tarot Card Reading',
      description: 'Seek guidance from the ancient wisdom of tarot! Get answers to your burning questions about love, career, and life decisions through mystical card interpretations.',
      icon: '🔮',
      category: 'Tarot',
      rating: 4.7,
      testCount: 6700,
      isHot: true,
      route: '/tarot'
    },
    {
      id: 'emotional-intelligence',
      name: 'Emotional Intelligence Test',
      description: 'Master your emotions and relationships! Assess your EQ with our comprehensive test that measures self-awareness, empathy, and social skills.',
      icon: '💚',
      category: 'Psychology',
      rating: 4.8,
      testCount: 5400,
      isHot: false,
      route: '/psychology/eq'
    },
    {
      id: 'career-assessment',
      name: 'Career Path Discovery',
      description: 'Find your perfect career match! Discover which professions align with your interests, skills, and values through our comprehensive career assessment.',
      icon: '💼',
      category: 'Career',
      rating: 4.6,
      testCount: 4800,
      isHot: false,
      route: '/career/holland'
    },
    {
      id: 'love-language',
      name: 'Love Language Test',
      description: 'Transform your relationships! Discover how you and your partner express and receive love to build deeper, more meaningful connections.',
      icon: '💕',
      category: 'Relationship',
      rating: 4.7,
      testCount: 3200,
      isHot: false,
      route: '/relationship/love_language'
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
      className={cn("popular-tests py-16 relative overflow-hidden", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title section */}
        <div className="text-left mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Popular Tests
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Handpicked by our experts - these are the most insightful and transformative tests that our users love
          </p>
        </div>

        {/* 热门测试网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
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
                    Take Test Now →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PopularTests;
