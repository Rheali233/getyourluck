/**
 * 测试模块网格组件
 * 遵循统一开发标准的首页组件
 */

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui';
import type { TestModule } from '../types';
import { cn } from '@/utils/classNames';


import { getApiBaseUrl } from '@/config/environment';
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
      // 白色背景（首页毛玻璃），黑色文字，蓝色主题圆点
      background: 'bg-gradient-to-br from-white/70 via-white/60 to-white/50 backdrop-blur-lg',
      title: 'text-black group-hover:text-gray-800',
      description: 'text-gray-700',
      stats: 'text-gray-600',
      features: 'bg-gradient-to-b from-white to-gray-50 text-gray-800 border border-gray-200 shadow-md hover:shadow-lg',
      primaryDot: 'bg-blue-600',
      secondaryDot: 'bg-blue-500',
      titleBackground: 'bg-gradient-to-r from-blue-100 to-blue-200'
    },
    astrology: {
      // 白色背景（首页毛玻璃），黑色文字，紫色主题圆点
      background: 'bg-gradient-to-br from-white/70 via-white/60 to-white/50 backdrop-blur-lg',
      title: 'text-black group-hover:text-gray-800',
      description: 'text-gray-700',
      stats: 'text-gray-600',
      features: 'bg-gradient-to-b from-white to-gray-50 text-gray-800 border border-gray-200 shadow-md hover:shadow-lg',
      primaryDot: 'bg-purple-600',
      secondaryDot: 'bg-purple-500',
      titleBackground: 'bg-gradient-to-r from-purple-100 to-purple-200'
    },
    career: {
      // 白色背景（首页毛玻璃），黑色文字，绿色主题圆点
      background: 'bg-gradient-to-br from-white/70 via-white/60 to-white/50 backdrop-blur-lg',
      title: 'text-black group-hover:text-gray-800',
      description: 'text-gray-700',
      stats: 'text-gray-600',
      features: 'bg-gradient-to-b from-white to-gray-50 text-gray-800 border border-gray-200 shadow-md hover:shadow-lg',
      primaryDot: 'bg-green-600',
      secondaryDot: 'bg-green-500',
      titleBackground: 'bg-gradient-to-r from-green-100 to-emerald-200'
    },
    relationship: {
      // 白色背景（首页毛玻璃），黑色文字，粉色主题圆点
      background: 'bg-gradient-to-br from-white/70 via-white/60 to-white/50 backdrop-blur-lg',
      title: 'text-black group-hover:text-gray-800',
      description: 'text-gray-700',
      stats: 'text-gray-600',
      features: 'bg-gradient-to-b from-white to-gray-50 text-gray-800 border border-gray-200 shadow-md hover:shadow-lg',
      primaryDot: 'bg-pink-600',
      secondaryDot: 'bg-pink-500',
      titleBackground: 'bg-gradient-to-r from-pink-100 to-rose-200'
    },
    learning: {
      // 白色背景（首页毛玻璃），黑色文字，黄色主题圆点
      background: 'bg-gradient-to-br from-white/70 via-white/60 to-white/50 backdrop-blur-lg',
      title: 'text-black group-hover:text-gray-800',
      description: 'text-gray-700',
      stats: 'text-gray-600',
      features: 'bg-gradient-to-b from-white to-gray-50 text-gray-800 border border-gray-200 shadow-md hover:shadow-lg',
      primaryDot: 'bg-yellow-600',
      secondaryDot: 'bg-yellow-500',
      titleBackground: 'bg-gradient-to-r from-sky-100 to-cyan-200'
    },
    tarot: {
      // 白色背景（首页毛玻璃），黑色文字，灰色主题圆点
      background: 'bg-gradient-to-br from-white/70 via-white/60 to-white/50 backdrop-blur-lg',
      title: 'text-black group-hover:text-gray-800',
      description: 'text-gray-700',
      stats: 'text-gray-600',
      features: 'bg-gradient-to-b from-white to-gray-50 text-gray-800 border border-gray-200 shadow-md hover:shadow-lg',
      primaryDot: 'bg-gray-600',
      secondaryDot: 'bg-gray-500',
      titleBackground: 'bg-gradient-to-r from-violet-200 to-violet-300'
    },
    numerology: {
      // 白色背景（首页毛玻璃），黑色文字，橙色主题圆点
      background: 'bg-gradient-to-br from-white/70 via-white/60 to-white/50 backdrop-blur-lg',
      title: 'text-black group-hover:text-gray-800',
      description: 'text-gray-700',
      stats: 'text-gray-600',
      features: 'bg-gradient-to-b from-white to-gray-50 text-gray-800 border border-gray-200 shadow-md hover:shadow-lg',
      primaryDot: 'bg-orange-600',
      secondaryDot: 'bg-orange-500',
      titleBackground: 'bg-gradient-to-r from-red-600 to-red-700'
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
        "group cursor-pointer transition-all duration-300 hover:-translate-y-2 border-0 shadow-xl hover:shadow-2xl ring-1 ring-white/20 hover:ring-white/30 transform hover:rotate-1 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/30 before:to-transparent before:pointer-events-none",
        themeColors.background,
        !module.isActive && "opacity-60"
      )}
      onClick={() => onClick(module)}
    >
      <div className="p-4 md:p-5 flex flex-col h-full">
        {/* 标题 */}
        <div className={cn("inline-block px-3 py-1.5 rounded-lg mb-3 self-start", themeColors.titleBackground)}>
          <h3 className={cn("text-base font-bold transition-colors duration-200", themeColors.title)}>
            {module.name}
          </h3>
        </div>
        
        {/* 描述 */}
        <p className={cn("mb-3 text-xs leading-relaxed flex-grow", themeColors.description)}>
          {module.description}
        </p>
        
        {/* 底部信息区域 */}
        <div className="mt-auto">
          {/* Statistics */}
          <div className={cn("flex items-center space-x-4 text-xs mb-3", themeColors.stats)}>
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
          <div className="flex flex-wrap gap-1.5">
            {module.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className={cn("px-2 py-1 text-xs rounded-full", themeColors.features)}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
        
        {/* Status indicator */}
        {!module.isActive && (
          <div className="mt-3">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              🚧 In Development
            </span>
          </div>
        )}
        
        {/* Hover tooltip */}
        <div className="absolute bottom-3 right-2 bg-black/70 text-white text-sm px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
          Click to Try
        </div>
        
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
  const [serverModules, setServerModules] = useState<TestModule[] | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Default test modules data
  const defaultModules: TestModule[] = [
    {
      id: 'psychology',
      name: 'Personality & Mind',
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
      name: 'Career & Development',
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
      name: 'Relationships & Communication',
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
      name: 'Learning & Intelligence',
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
      name: 'Tarot & Divination',
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
      name: 'Numerology & Destiny',
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

  // 后端优先加载模块列表，失败时回退默认或外部传入
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/homepage/modules`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data?.success && Array.isArray(data.data)) {
          setServerModules(
            data.data.map((m: any) => ({
              id: m.id,
              name: m.nameEn || m.name,
              description: m.descriptionEn || m.description,
              icon: m.icon || '',
              theme: m.theme || (m.id as TestModule['theme']),
              testCount: m.testCount ?? 0,
              rating: m.rating ?? 4.5,
              isActive: m.isActive ?? true,
              route: m.route,
              features: Array.isArray(m.featuresEn)
                ? m.featuresEn
                : Array.isArray(m.features)
                ? m.features
                : [],
              estimatedTime: m.estimatedTime || '10-15 minutes',
            }))
          );
        }
      } catch (_) {
        // silent fallback
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayModules = serverModules ?? (modules.length > 0 ? modules : defaultModules);

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
      className={cn("py-12 relative overflow-hidden", className)}
      data-testid={testId}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 模块网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="under-dev-title"
          >
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
              <div className="text-center">
                <div className="text-4xl mb-4" aria-hidden="true">🚧</div>
                <h3 id="under-dev-title" className="text-lg font-semibold text-gray-900 mb-2">
                  Feature Under Development
                </h3>
                <p className="text-gray-600 mb-6">
                  {modalMessage}
                </p>
                <button
                  ref={closeButtonRef}
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