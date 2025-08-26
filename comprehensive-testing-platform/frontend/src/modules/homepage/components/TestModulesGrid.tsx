/**
 * 测试模块网格组件
 * 遵循统一开发标准的首页组件
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui';
import type { TestModule } from '../types';
import { cn } from '@/utils/classNames';

export interface TestModulesGridProps {
  className?: string;
  testId?: string;
  modules?: TestModule[];
  onModuleClick?: (module: TestModule) => void;
}

// 测试模块卡片组件
const TestModuleCard: React.FC<{
  module: TestModule;
  onClick: (module: TestModule) => void;
}> = ({ module, onClick }) => {
  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        "border-2 hover:border-primary-200",
        !module.isActive && "opacity-60"
      )}
      onClick={() => onClick(module)}
    >
      <div className="p-6 text-center">
        {/* 图标 */}
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {module.icon}
        </div>
        
        {/* 标题 */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
          {module.name}
        </h3>
        
        {/* 描述 */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {module.description}
        </p>
        
        {/* Statistics */}
        <div className="flex justify-center items-center space-x-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
            {module.testCount} tests
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
            {module.rating} rating
          </span>
        </div>
        
        {/* 特色功能 */}
        <div className="flex flex-wrap justify-center gap-1 mb-4">
          {module.features.slice(0, 2).map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
        
        {/* Estimated time */}
        <div className="text-xs text-gray-500">
          Estimated time: {module.estimatedTime}
        </div>
        
        {/* Status indicator */}
        {!module.isActive && (
          <div className="mt-3">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              🚧 In Development
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

/**
 * 测试模块网格组件
 * 展示所有可用的测试模块
 */
export const TestModulesGrid: React.FC<TestModulesGridProps> = ({
  className,
  testId = 'test-modules-grid',
  modules = [],
  onModuleClick
}) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Default test modules data
  const defaultModules: TestModule[] = [
    {
      id: 'psychology',
      name: 'Psychology Tests',
      description: 'Professional psychological assessments to help you understand your personality, emotions, and cognitive traits',
      icon: '🧠',
      theme: 'psychology',
      testCount: 15,
      rating: 4.8,
      isActive: true,
      route: '/psychology',
      features: ['MBTI Personality Test', 'Depression Screening', 'EQ Assessment'],
      estimatedTime: '10-15 minutes'
    },
    {
      id: 'astrology',
      name: 'Astrology & Fortune',
      description: 'Professional astrological analysis, decode your zodiac secrets and predict future fortune',
      icon: '⭐',
      theme: 'astrology',
      testCount: 12,
      rating: 4.7,
      isActive: true,
      route: '/tests/astrology',
      features: ['Horoscope', 'Chart Reading', 'Fortune Prediction'],
      estimatedTime: '5-8 minutes'
    },
    {
      id: 'career',
      name: 'Career Planning',
      description: 'Scientific career assessment to help you find the most suitable career development direction',
      icon: '💼',
      theme: 'career',
      testCount: 18,
      rating: 4.9,
      isActive: true,
      route: '/tests/career',
      features: ['Career Interests', 'Ability Assessment', 'Career Planning'],
      estimatedTime: '15-20 minutes'
    },
    {
      id: 'relationship',
      name: 'Interpersonal Relationships',
      description: 'In-depth analysis of your interpersonal relationship patterns to improve social skills',
      icon: '❤️',
      theme: 'relationship',
      testCount: 10,
      rating: 4.6,
      isActive: true,
      route: '/relationship',
      features: ['Love Type', 'Communication Style', 'Relationship Pattern'],
      estimatedTime: '8-12 minutes'
    },
    {
      id: 'learning',
      name: 'Learning Ability',
      description: 'Assess your learning style and cognitive abilities to optimize learning methods',
      icon: '📚',
      theme: 'learning',
      testCount: 14,
      rating: 4.5,
      isActive: true,
      route: '/tests/learning',
      features: ['Learning Style', 'Cognitive Ability', 'Learning Method'],
      estimatedTime: '12-18 minutes'
    },
    {
      id: 'numerology',
      name: 'Traditional Numerology',
      description: 'Combining traditional culture to decode your numerological code and life trajectory',
      icon: '🔢',
      theme: 'numerology',
      testCount: 8,
      rating: 4.4,
      isActive: false,
      route: '/tests/numerology',
      features: ['Eight Characters', 'Zodiac Reading', 'Name Study'],
      estimatedTime: '10-15 minutes'
    }
  ];

  // 使用传入的modules或默认数据
  const displayModules = modules.length > 0 ? modules : defaultModules;

  const handleModuleClick = (module: TestModule) => {
    // 检查是否有对应的测试界面
    if (module.route && module.route !== '/tests/placeholder') {
      if (onModuleClick) {
        onModuleClick(module);
      } else {
        // 直接导航到对应的测试模块
        navigate(module.route);
      }
    } else {
      // Show friendly notice popup
      setModalMessage(`"${module.name}" test feature is under development, stay tuned!`);
      setShowModal(true);
    }
  };

  return (
    <section
      className={cn("py-16 px-4 sm:px-6 lg:px-8 bg-gray-50", className)}
      data-testid={testId}
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-left mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Test Modules
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover various types of tests that help you better understand yourself.
          </p>
        </div>

        {/* 模块网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayModules.map((module) => (
            <TestModuleCard
              key={module.id}
              module={module}
              onClick={handleModuleClick}
            />
          ))}
        </div>

        {/* Bottom notice */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            More test modules are under development, stay tuned!
          </p>
        </div>

        {/* Friendly notice popup */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
              <div className="text-center">
                <div className="text-4xl mb-4">🚧</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Feature Under Development
                </h3>
                <p className="text-gray-600 mb-6">
                  {modalMessage}
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestModulesGrid; 