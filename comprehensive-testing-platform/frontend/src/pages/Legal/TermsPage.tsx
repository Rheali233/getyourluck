import React from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { UI_TEXT } from '@/shared/configs/UI_TEXT';
import { Navigation, Breadcrumb } from '@/components/ui';
import { SEOManager } from '@/modules/homepage/components/SEOManager';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { useScrollToTop } from '@/hooks/useScrollToTop';

interface TermsPageProps extends BaseComponentProps {}

export const TermsPage: React.FC<TermsPageProps> = ({ className, testId = 'terms-page', ...props }) => {
  const canonical = `${typeof window !== 'undefined' ? window.location.origin : ''}/terms`;
  const T = UI_TEXT.legal.terms;

  // 确保页面滚动到顶部
  useScrollToTop({
    enabled: true,
    behavior: 'smooth',
    delay: 50
  });
  return (
    <div className={`min-h-screen relative ${className || ''}`} data-testid={testId} {...props}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-300 to-indigo-400"></div>
      <div className="relative z-10">
        <Navigation />
        <SEOManager pageType="homepage" metadata={{ title: T.title, description: T.intro, canonicalUrl: canonical }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          {/* 面包屑导航 */}
          <Breadcrumb items={getBreadcrumbConfig('/terms')} />
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{T.title}</h1>
          <p className="text-xl text-gray-700 mb-8">{T.intro}</p>
          <div className="space-y-8">
            {T.sections.map((s, i) => (
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

export default TermsPage;


