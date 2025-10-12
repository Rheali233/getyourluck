/**
 * About 页面
 * 遵循统一开发标准：React FC + TypeScript + Tailwind + 英文文案集中管理
 */

import React from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { UI_TEXT } from '@/shared/configs/UI_TEXT';
import { SEOManager } from '@/modules/homepage/components/SEOManager';
import { Navigation, Breadcrumb } from '@/components/ui';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { Link } from 'react-router-dom';

interface AboutPageProps extends BaseComponentProps {}

export const AboutPage: React.FC<AboutPageProps> = ({
  className,
  testId = 'about-page',
  ...props
}) => {
  const canonical = `${typeof window !== 'undefined' ? window.location.origin : ''}/about`;

  return (
    <div
      className={`min-h-screen relative ${className || ''}`}
      data-testid={testId}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-300 to-indigo-400"></div>

      <div className="relative z-10">
        <Navigation />
        <SEOManager
          pageType="homepage"
          metadata={{
            title: UI_TEXT.about.seo.title,
            description: UI_TEXT.about.seo.description,
            canonicalUrl: canonical,
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 py-14">
          {/* 面包屑导航 */}
          <Breadcrumb items={getBreadcrumbConfig('/about')} />
          
          {/* Header */}
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {UI_TEXT.about.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              {UI_TEXT.about.subtitle}
            </p>
          </header>

          {/* Overview */}
          <section aria-labelledby="overview-title" className="mb-12">
            <h2 id="overview-title" className="text-2xl font-semibold text-gray-900 mb-4">
              {UI_TEXT.about.sections.overview.title}
            </h2>
            <div className="space-y-4 text-gray-700">
              {UI_TEXT.about.sections.overview.paragraphs.map((p, i) => (
                <p key={`ov-${i}`}>{p}</p>
              ))}
            </div>
          </section>

          {/* Capabilities */}
          <section aria-labelledby="capabilities-title" className="mb-12">
            <h2 id="capabilities-title" className="text-2xl font-semibold text-gray-900 mb-4">
              {UI_TEXT.about.sections.capabilities.title}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-disc pl-6 text-gray-700">
              {UI_TEXT.about.sections.capabilities.items.map((item, idx) => (
                <li key={`cap-${idx}`}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Quality */}
          <section aria-labelledby="quality-title" className="mb-12">
            <h2 id="quality-title" className="text-2xl font-semibold text-gray-900 mb-4">
              {UI_TEXT.about.sections.quality.title}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-disc pl-6 text-gray-700">
              {UI_TEXT.about.sections.quality.items.map((item, idx) => (
                <li key={`qual-${idx}`}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Modules */}
          <section aria-labelledby="modules-title" className="mb-12">
            <h2 id="modules-title" className="text-2xl font-semibold text-gray-900 mb-4">
              {UI_TEXT.about.sections.modules.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {UI_TEXT.about.sections.modules.entries.map((m) => (
                <Link
                  key={m.href}
                  to={m.href}
                  className="block bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 hover:shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <span className="text-gray-900 font-medium">{m.label}</span>
                </Link>
              ))}
            </div>
          </section>

        
        </div>
      </div>
    </div>
  );
};

export default AboutPage;


