/**
 * 平台特色区组件
 * 展示平台的核心优势和特色
 */

import React from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { Card } from '@/components/ui';


export interface PlatformFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface PlatformFeaturesProps extends BaseComponentProps {
  features?: PlatformFeature[];
}

export const PlatformFeatures: React.FC<PlatformFeaturesProps> = ({
  className,
  testId = 'platform-features',
  features = [],
  ...props
}) => {
  // Default platform features data - 结合项目实际情况
  const defaultFeatures: PlatformFeature[] = [
    {
      id: 'comprehensive',
      icon: '🌟',
      title: 'Discover Every Side of You',
      description: '7 comprehensive test categories with multiple assessments revealing your complete personality, career path, and life purpose',
      color: 'blue'
    },
    {
      id: 'professional',
      icon: '🔬',
      title: 'Scientifically Proven Results',
      description: 'Built on decades of research - MBTI, Big Five, and ancient wisdom combined',
      color: 'purple'
    },
    {
      id: 'instant',
      icon: '⚡',
      title: 'Get Answers in Minutes',
      description: 'Advanced AI instantly analyzes your responses and delivers personalized insights',
      color: 'green'
    },
    {
      id: 'personalized',
      icon: '🎯',
      title: 'Your Personal Journey',
      description: 'Track your growth over time with detailed reports and personalized recommendations',
      color: 'yellow'
    },
    {
      id: 'multicultural',
      icon: '🌍',
      title: 'Ancient Wisdom, Modern Science',
      description: 'Where Western psychology meets Eastern philosophy for deeper understanding',
      color: 'indigo'
    },
    {
      id: 'accessible',
      icon: '📱',
      title: 'Test Anytime, Anywhere',
      description: 'Perfect mobile experience - discover yourself during any moment',
      color: 'pink'
    }
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;


  return (
    <section
      className={cn("platform-features py-12 relative overflow-hidden", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Why Choose Us
          </h2>
        </div>

        {/* 特色功能网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayFeatures.map((feature) => (
            <Card
              key={feature.id}
              className="bg-gradient-to-br from-white/70 via-white/60 to-white/50 backdrop-blur-lg p-8 border-0 before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/30 before:to-transparent before:pointer-events-none"
            >
              {/* 图标和标题 */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{feature.icon}</span>
                <h3 className="text-lg font-bold text-gray-900">
                  {feature.title}
                </h3>
              </div>

              {/* 描述 */}
              <p className="text-gray-600 text-xs leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformFeatures;
