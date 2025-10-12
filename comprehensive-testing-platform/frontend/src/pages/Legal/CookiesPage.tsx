import React from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { UI_TEXT } from '@/shared/configs/UI_TEXT';
import { Navigation } from '@/components/ui';
import { SEOManager } from '@/modules/homepage/components/SEOManager';

interface CookiesPageProps extends BaseComponentProps {}

export const CookiesPage: React.FC<CookiesPageProps> = ({ className, testId = 'cookies-page', ...props }) => {
  const canonical = `${typeof window !== 'undefined' ? window.location.origin : ''}/cookies`;
  const C = UI_TEXT.legal.cookies;
  return (
    <div className={`min-h-screen relative ${className || ''}`} data-testid={testId} {...props}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-300 to-indigo-400"></div>
      <div className="relative z-10">
        <Navigation />
        <SEOManager pageType="homepage" metadata={{ title: C.title, description: C.intro, canonicalUrl: canonical }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{C.title}</h1>
          <p className="text-xl text-gray-700 mb-8">{C.intro}</p>
          <div className="space-y-8">
            {C.sections.map((s, i) => (
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

export default CookiesPage;


