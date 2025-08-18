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
        
        {/* 统计信息 */}
        <div className="flex justify-center items-center space-x-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
            {module.testCount} 个测试
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
            {module.rating} 分
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
        
        {/* 预计时间 */}
        <div className="text-xs text-gray-500">
          预计用时: {module.estimatedTime}
        </div>
        
        {/* 状态标识 */}
        {!module.isActive && (
          <div className="mt-3">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
              🚧 开发中
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

  // 默认测试模块数据
  const defaultModules: TestModule[] = [
    {
      id: 'psychology',
      name: '心理学测试',
      description: '专业的心理测评，帮助你了解自己的性格、情绪和认知特点',
      icon: '🧠',
      theme: 'psychology',
      testCount: 15,
      rating: 4.8,
      isActive: true,
      route: '/tests/psychology',
      features: ['MBTI性格测试', '抑郁筛查', '情商评估'],
      estimatedTime: '10-15分钟'
    },
    {
      id: 'astrology',
      name: '占星运势',
      description: '专业的占星分析，解读你的星座密码，预测未来运势',
      icon: '⭐',
      theme: 'astrology',
      testCount: 12,
      rating: 4.7,
      isActive: true,
      route: '/tests/astrology',
      features: ['星座运势', '星盘解读', '运势预测'],
      estimatedTime: '5-8分钟'
    },
    {
      id: 'career',
      name: '职业规划',
      description: '科学的职业测评，帮你找到最适合的职业发展方向',
      icon: '💼',
      theme: 'career',
      testCount: 18,
      rating: 4.9,
      isActive: true,
      route: '/tests/career',
      features: ['职业兴趣', '能力评估', '职业规划'],
      estimatedTime: '15-20分钟'
    },
    {
      id: 'relationship',
      name: '人际关系',
      description: '深入分析你的人际关系模式，提升社交能力',
      icon: '❤️',
      theme: 'relationship',
      testCount: 10,
      rating: 4.6,
      isActive: true,
      route: '/tests/relationship',
      features: ['恋爱类型', '沟通方式', '关系模式'],
      estimatedTime: '8-12分钟'
    },
    {
      id: 'learning',
      name: '学习能力',
      description: '评估你的学习风格和认知能力，优化学习方法',
      icon: '📚',
      theme: 'learning',
      testCount: 14,
      rating: 4.5,
      isActive: true,
      route: '/tests/learning',
      features: ['学习风格', '认知能力', '学习方法'],
      estimatedTime: '12-18分钟'
    },
    {
      id: 'numerology',
      name: '传统命理',
      description: '结合传统文化，解读你的命理密码和人生轨迹',
      icon: '🔢',
      theme: 'numerology',
      testCount: 8,
      rating: 4.4,
      isActive: false,
      route: '/tests/numerology',
      features: ['八字分析', '生肖解读', '姓名学'],
      estimatedTime: '10-15分钟'
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
        navigate(module.route);
      }
    } else {
      // 显示友好提示弹窗
      setModalMessage(`"${module.name}" 测试功能正在开发中，敬请期待！`);
      setShowModal(true);
    }
  };

  return (
    <section
      className={cn("py-16 px-4 sm:px-6 lg:px-8 bg-gray-50", className)}
      data-testid={testId}
    >
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <div className="text-left mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            测试模块
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            这里汇集了各种类型的测试，帮助你更好地了解自己。
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

        {/* 底部提示 */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            更多测试模块正在开发中，敬请期待！
          </p>
        </div>

        {/* 友好提示弹窗 */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
              <div className="text-center">
                <div className="text-4xl mb-4">🚧</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  功能开发中
                </h3>
                <p className="text-gray-600 mb-6">
                  {modalMessage}
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  知道了
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