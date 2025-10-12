/**
 * 热门推荐区域组件
 * 展示具体的测试功能和推荐内容
 */

import React from 'react';
import { Link } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
// import type { HomepageModule } from '@/shared/types/homepage';
import { cn } from '@/utils/classNames';

export interface FeaturedTestsProps extends BaseComponentProps {
  featuredTests?: any[]; // HomepageModule[];
  title?: string;
  subtitle?: string;
}

export const FeaturedTests: React.FC<FeaturedTestsProps> = ({
  className,
  testId = 'featured-tests',
  featuredTests = [],
  title = '🔥 热门推荐',
  subtitle = '精选最受欢迎的测试，快来体验吧！',
  ...props
}) => {
  // 默认热门测试数据
  const defaultFeaturedTests: any[] = [ // HomepageModule[]
    {
      id: 'mbti-personality',
      name: 'MBTI性格测试',
      description: '揭秘你的性格密码，了解真实的自己',
      icon: '🧠',
      theme: 'psychology',
      testCount: 15600,
      rating: 4.9,
      isActive: true,
              route: '/psychology/mbti',
      features: ['16种性格类型', '详细分析报告', '职业建议'],
      estimatedTime: '8-12分钟',
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'love-compatibility',
      name: '爱情匹配测试',
      description: '测试你们的爱情契合度，找到真爱密码',
      icon: '💕',
      theme: 'relationship',
      testCount: 8900,
      rating: 4.8,
      isActive: true,
      route: '/relationship',
      features: ['契合度分析', '沟通建议', '关系提升'],
      estimatedTime: '5-8分钟',
      sortOrder: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'career-path',
      name: '职业规划测试',
      description: '找到最适合你的职业道路，规划美好未来',
      icon: '📊',
      theme: 'career',
      testCount: 12300,
      rating: 4.7,
      isActive: true,
      route: '/career',
      features: ['职业倾向', '技能分析', '发展建议'],
      estimatedTime: '10-15分钟',
      sortOrder: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const tests = featuredTests.length > 0 ? featuredTests : defaultFeaturedTests;

  return (
    <section
      className={cn("featured-tests py-16 bg-gradient-to-br from-blue-50 to-indigo-100", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* 热门测试网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-xl hover:transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* 测试卡片头部 */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl">{test.icon}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {test.name}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {test.theme} • {test.estimatedTime}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {test.description}
                </p>
              </div>

              {/* 测试特性 */}
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {test.features.map((feature: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mr-2 mb-2"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* 统计信息 */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>👥 {test.testCount.toLocaleString()} 人已测试</span>
                  <span>⭐ {test.rating} 分</span>
                </div>

                {/* 行动按钮 */}
                <Link
                  to={test.route}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-center block"
                >
                  立即测试
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 查看更多按钮 */}
        <div className="text-center mt-12">
          <Link
            to="/tests"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
          >
            查看更多测试
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};
