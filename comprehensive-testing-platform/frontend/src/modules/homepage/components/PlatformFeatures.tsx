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
  // Default platform features data
  const defaultFeatures: PlatformFeature[] = [
    {
      id: 'scientific',
      icon: '🔬',
      title: 'Scientific & Professional',
      description: 'Based on authoritative psychological theories and standardized scales, ensuring scientific and accurate test results',
      color: 'blue'
    },
    {
      id: 'ai-powered',
      icon: '🤖',
      title: 'AI-Powered Analysis',
      description: 'Using advanced artificial intelligence technology to provide personalized in-depth analysis reports and professional advice',
      color: 'purple'
    },
    {
      id: 'privacy',
      icon: '🔒',
      title: 'Privacy & Security',
      description: 'No registration required, data encryption protection, completely anonymous use, ensuring user privacy and security',
      color: 'green'
    },
    {
      id: 'fast',
      icon: '⚡',
      title: 'Instant Results',
      description: 'Complete tests quickly, generate professional reports in real-time, save time and improve efficiency',
      color: 'yellow'
    },
    {
      id: 'responsive',
      icon: '📱',
      title: 'Multi-Device Support',
      description: 'Support for mobile, tablet, computer and other devices, conduct psychological tests anytime, anywhere',
      color: 'indigo'
    },
    {
      id: 'personalized',
      icon: '🎯',
      title: 'Personalized Recommendations',
      description: 'Intelligently recommend related tests and improvement suggestions based on test results and user preferences',
      color: 'pink'
    }
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      pink: 'bg-pink-50 text-pink-700 border-pink-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <section
      className={cn("platform-features py-16 bg-gray-50", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            🌟 Why Choose Us
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Professional testing platform, worthy of your trust
          </p>
        </div>

        {/* 特色功能网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayFeatures.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* 图标 */}
              <div className="text-4xl mb-4">{feature.icon}</div>

              {/* 标题 */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>

              {/* 描述 */}
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* 特色标签 */}
              <div className="mt-4">
                <span className={cn(
                  "inline-block px-3 py-1 text-xs font-medium rounded-full border",
                  getColorClasses(feature.color)
                )}>
                  {feature.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom description */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Start Your Journey Today
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Join thousands of users who have discovered their true potential through our professional testing platform
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                🔒 Privacy Protected
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                ⚡ Fast Results
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                🎯 Accurate Analysis
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformFeatures;
