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
      title: 'All-In-One Test Center',
      description: '7 comprehensive modules covering MBTI, career, astrology, tarot, numerology, learning, and relationships for a 360° self-profile',
      color: 'blue'
    },
    {
      id: 'professional',
      icon: '🔬',
      title: 'Research-Informed Guidance',
      description: 'Built on Big Five, EQ, Holland, DISC, and traditional wisdom systems so every insight is grounded in proven frameworks',
      color: 'purple'
    },
    {
      id: 'instant',
      icon: '⚡',
      title: 'Instant AI Insights',
      description: 'Advanced AI instantly analyzes your responses, highlighting strengths, blind spots, and next-step coaching tips',
      color: 'green'
    },
    {
      id: 'personalized',
      icon: '🎯',
      title: 'Personalized Action Plans',
      description: 'Track your growth over time with downloadable reports, habit prompts, and tailored recommendations you can act on right away',
      color: 'yellow'
    },
    {
      id: 'multicultural',
      icon: '🌍',
      title: 'East Meets West Perspectives',
      description: 'Blend Western psychology with Eastern astrology and numerology for deeper, multicultural self-understanding',
      color: 'indigo'
    },
    {
      id: 'accessible',
      icon: '📱',
      title: 'Mobile-Optimized Experience',
      description: 'Take assessments on any device with auto-saved progress, making self-discovery possible on the go',
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
            Why Choose SelfAtlas
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
