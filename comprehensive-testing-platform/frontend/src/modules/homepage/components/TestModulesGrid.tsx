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
  // eslint-disable-next-line no-unused-vars
  onModuleClick?: (module: TestModule) => void;
}

// 主题色彩映射配置 - 匹配对应模块页面的渐变背景色
const getThemeColors = (theme: TestModule['theme']) => {
  const themeConfigs = {
    psychology: {
      // 白色背景，黑色文字，蓝色主题圆点
      background: 'bg-white',
      title: 'text-black group-hover:text-gray-800',
      description: 'text-gray-700',
      stats: 'text-gray-600',
      features: 'bg-white text-gray-800 border border-gray-200',
      primaryDot: 'bg-blue-600',
      secondaryDot: 'bg-blue-500'
    },
    astrology: {
      // 白色背景，黑色文字，紫色主题圆点
      background: 'bg-white',
      title: 'text-black group-hover:text-gray-800',
      description: 'text-gray-700',
      stats: 'text-gray-600',
      features: 'bg-white text-gray-800 border border-gray-200',
      primaryDot: 'bg-purple-600',
      secondaryDot: 'bg-purple-500'
    },
    career: {
      // 白色背景，黑色文字，绿色主题圆点
      background: 'bg-white',
      title: 'text-black group-hover:text-gray-800',
      description: 'text-gray-700',
      stats: 'text-gray-600',
      features: 'bg-white text-gray-800 border border-gray-200',
      primaryDot: 'bg-green-600',
      secondaryDot: 'bg-green-500'
    },
    relationship: {
      // 白色背景，黑色文字，粉色主题圆点
      background: 'bg-white',
      title: 'text-black group-hover:text-gray-800',
      description: 'text-gray-700',
      stats: 'text-gray-600',
      features: 'bg-white text-gray-800 border border-gray-200',
      primaryDot: 'bg-pink-600',
      secondaryDot: 'bg-pink-500'
    },
    learning: {
      // 白色背景，黑色文字，黄色主题圆点
      background: 'bg-white',
      title: 'text-black group-hover:text-gray-800',
      description: 'text-gray-700',
      stats: 'text-gray-600',
      features: 'bg-white text-gray-800 border border-gray-200',
      primaryDot: 'bg-yellow-600',
      secondaryDot: 'bg-yellow-500'
    },
    tarot: {
      // 白色背景，黑色文字，灰色主题圆点
      background: 'bg-white',
      title: 'text-black group-hover:text-gray-800',
      description: 'text-gray-700',
      stats: 'text-gray-600',
      features: 'bg-white text-gray-800 border border-gray-200',
      primaryDot: 'bg-gray-600',
      secondaryDot: 'bg-gray-500'
    },
    numerology: {
      // 白色背景，黑色文字，橙色主题圆点
      background: 'bg-white',
      title: 'text-black group-hover:text-gray-800',
      description: 'text-gray-700',
      stats: 'text-gray-600',
      features: 'bg-white text-gray-800 border border-gray-200',
      primaryDot: 'bg-orange-600',
      secondaryDot: 'bg-orange-500'
    }
  };

  return themeConfigs[theme] || themeConfigs.psychology;
};

// 测试模块卡片组件
const TestModuleCard: React.FC<{
  module: TestModule;
  // eslint-disable-next-line no-unused-vars
  onClick: (module: TestModule) => void;
}> = ({ module, onClick }) => {
  const themeColors = getThemeColors(module.theme);
  
  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:-translate-y-1 border-0",
        themeColors.background,
        !module.isActive && "opacity-60"
      )}
      onClick={() => onClick(module)}
    >
      <div className="p-6 text-center">
        {/* 标题 */}
        <h3 className={cn("text-lg font-bold mb-2 transition-colors duration-200", themeColors.title)}>
          {module.name}
        </h3>
        
        {/* 描述 */}
        <p className={cn("mb-3 text-xs leading-relaxed", themeColors.description)}>
          {module.description}
        </p>
        
        {/* Statistics */}
        <div className={cn("flex justify-center items-center space-x-4 text-xs mb-3", themeColors.stats)}>
          <span className="flex items-center">
            <span className={cn("w-2 h-2 rounded-full mr-1", themeColors.primaryDot)}></span>
            {module.testCount} tests
          </span>
          <span className="flex items-center">
            <span className={cn("w-2 h-2 rounded-full mr-1", themeColors.secondaryDot)}></span>
            {module.rating} rating
          </span>
        </div>
        
        {/* 特色功能 */}
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {module.features.slice(0, 2).map((feature, index) => (
            <span
              key={index}
              className={cn("px-3 py-1 text-xs rounded-full", themeColors.features)}
            >
              {feature}
            </span>
          ))}
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
      testCount: 4,
      rating: 4.8,
      isActive: true,
      route: '/psychology',
      features: ['🧠 Personality Discovery', '💙 Mental Wellness', '❤️ Emotional Intelligence'],
      estimatedTime: '10-15 minutes'
    },
    {
      id: 'astrology',
      name: 'Astrology & Fortune',
      description: 'Professional astrological analysis, decode your zodiac secrets and predict future fortune',
      icon: '⭐',
      theme: 'astrology',
      testCount: 6,
      rating: 4.7,
      isActive: true,
      route: '/astrology',
      features: ['⭐ Daily Guidance', '🔮 Future Insights', '✨ Cosmic Wisdom'],
      estimatedTime: '5-8 minutes'
    },
    {
      id: 'career',
      name: 'Career Planning',
      description: 'Scientific career assessment to help you find the most suitable career development direction',
      icon: '💼',
      theme: 'career',
      testCount: 3,
      rating: 4.9,
      isActive: true,
      route: '/career',
      features: ['💼 Dream Job Match', '🚀 Leadership Skills', '🎯 Career Path'],
      estimatedTime: '15-20 minutes'
    },
    {
      id: 'relationship',
      name: 'Interpersonal Relationships',
      description: 'In-depth analysis of your interpersonal relationship patterns to improve social skills',
      icon: '❤️',
      theme: 'relationship',
      testCount: 3,
      rating: 4.6,
      isActive: true,
      route: '/relationship',
      features: ['💕 Love Language', '💝 Relationship Style', '🤝 Social Skills'],
      estimatedTime: '8-12 minutes'
    },
    {
      id: 'learning',
      name: 'Learning Ability',
      description: 'Assess your learning style and cognitive abilities to optimize learning methods',
      icon: '📚',
      theme: 'learning',
      testCount: 3,
      rating: 4.5,
      isActive: true,
      route: '/learning',
      features: ['🎓 Learning Style', '🧩 Intelligence Test', '⚡ Brain Power'],
      estimatedTime: '12-18 minutes'
    },
    {
      id: 'tarot',
      name: 'Tarot Reading',
      description: 'Discover your destiny through ancient tarot card wisdom and mystical insights',
      icon: '🔮',
      theme: 'tarot',
      testCount: 6,
      rating: 4.6,
      isActive: true,
      route: '/tarot',
      features: ['🔮 Mystical Cards', '✨ Future Vision', '🌟 Spiritual Journey'],
      estimatedTime: '8-12 minutes'
    },
    {
      id: 'numerology',
      name: 'Traditional Numerology',
      description: 'Combining traditional culture to decode your numerological code and life trajectory',
      icon: '🔢',
      theme: 'numerology',
      testCount: 5,
      rating: 4.4,
      isActive: true,
      route: '/numerology',
      features: [ '🐲 Zodiac Fortune', '📝 Name Magic'],
      estimatedTime: '10-15 minutes'
    }
  ];

  // 使用传入的modules或默认数据
  const displayModules = modules.length > 0 ? modules : defaultModules;

  const handleModuleClick = (module: TestModule) => {
    // 检查是否有对应的测试界面
    if (module.route && module.isActive) {
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
      className={cn("py-16 relative overflow-hidden", className)}
      data-testid={testId}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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