/**
 * 平台特色区组件
 * 展示平台的核心优势和特色
 */

import React from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';


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
      title: '7 Comprehensive Test Modules',
      description: 'Psychology, Astrology, Career, Relationship, Learning, Tarot, and Numerology - covering all aspects of personal development',
      color: 'blue'
    },
    {
      id: 'professional',
      icon: '🔬',
      title: 'Professional & Scientific',
      description: 'Based on MBTI, Big Five, VARK learning styles, and traditional Chinese numerology - ensuring accurate and reliable results',
      color: 'purple'
    },
    {
      id: 'instant',
      icon: '⚡',
      title: 'Instant AI Analysis',
      description: 'Get detailed personality reports, career guidance, and life insights in minutes with our advanced AI analysis engine',
      color: 'green'
    },
    {
      id: 'privacy',
      icon: '🔒',
      title: '100% Anonymous',
      description: 'No registration required, no data collection, completely private testing experience that respects your privacy',
      color: 'yellow'
    },
    {
      id: 'multicultural',
      icon: '🌍',
      title: 'East Meets West',
      description: 'Combining Western psychology with Eastern wisdom - from MBTI to BaZi, Tarot to Zodiac, offering unique insights',
      color: 'indigo'
    },
    {
      id: 'accessible',
      icon: '📱',
      title: 'Accessible Anywhere',
      description: 'Perfect mobile experience, works on all devices - discover yourself during coffee breaks, commutes, or quiet moments',
      color: 'pink'
    }
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;


  return (
    <section
      className={cn("platform-features py-16 relative overflow-hidden", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title section */}
        <div className="text-left mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl">
            Discover yourself through our comprehensive testing platform - where science meets wisdom, and East meets West
          </p>
        </div>

        {/* 特色功能网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayFeatures.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-xl p-8 border border-gray-200 hover:transition-all duration-300 transform hover:-translate-y-1"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformFeatures;
