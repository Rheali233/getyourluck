import React from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { UI_TEXT } from '@/shared/configs/UI_TEXT';
import { Navigation } from '@/components/ui';
import { SEOManager } from '@/modules/homepage/components/SEOManager';

interface PrivacyPageProps extends BaseComponentProps {}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ className, testId = 'privacy-page', ...props }) => {
  const canonical = `${typeof window !== 'undefined' ? window.location.origin : ''}/privacy`;
  const P = UI_TEXT.legal.privacy;
  return (
    <div className={`min-h-screen relative ${className || ''}`} data-testid={testId} {...props}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-300 to-indigo-400"></div>
      <div className="relative z-10">
        <Navigation />
        <SEOManager pageType="homepage" metadata={{ title: P.title, description: P.intro, canonicalUrl: canonical }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{P.title}</h1>
          <p className="text-xl text-gray-700 mb-8">{P.intro}</p>
          <div className="space-y-8">
            {P.sections.map((s, i) => (
              <section key={`${s.title}-${i}`}>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{s.title}</h2>
                <p className="text-gray-700 leading-relaxed">{s.content}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;


