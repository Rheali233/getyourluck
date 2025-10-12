/**
 * Test Center 页面
 * 统一测试发现与导航入口
 */

import React from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { UI_TEXT } from '@/shared/configs/UI_TEXT';
import { SEOManager } from '@/modules/homepage/components/SEOManager';
import { Navigation } from '@/components/ui';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { Link } from 'react-router-dom';

interface TestCenterPageProps extends BaseComponentProps {}

export const TestCenterPage: React.FC<TestCenterPageProps> = ({
  className,
  testId = 'test-center-page',
  ...props
}) => {
  const canonical = `${typeof window !== 'undefined' ? window.location.origin : ''}/tests`;
  const [active, setActive] = React.useState<string>('all');
  const [query, setQuery] = React.useState<string>('');

  return (
    <div className={`min-h-screen relative ${className || ''}`} data-testid={testId} {...props}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-300 to-indigo-400"></div>
      <div className="relative z-10">
        <Navigation />
        <SEOManager
          pageType="homepage"
          metadata={{
            title: UI_TEXT.testCenter.seo.title,
            description: UI_TEXT.testCenter.seo.description,
            canonicalUrl: canonical,
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          {/* 面包屑导航 */}
          <Breadcrumb items={getBreadcrumbConfig('/tests')} />
          
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {UI_TEXT.testCenter.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">{UI_TEXT.testCenter.subtitle}</p>
          </header>

          {/* 过滤与搜索 */}
          <Controls active={active} onChangeActive={setActive} query={query} onChangeQuery={setQuery} />

          {/* 测试卡片列表 */}
          <TestList active={active} query={query} />
        </div>
      </div>
    </div>
  );
};

export default TestCenterPage;

// 内部控件：筛选与搜索
const Controls: React.FC<{
  active: string;
  onChangeActive: (val: string) => void;
  query: string;
  onChangeQuery: (val: string) => void;
}> = ({ active, onChangeActive, query, onChangeQuery }) => {
  const tabs = [
    { key: 'all', label: UI_TEXT.testCenter.categories.all },
    { key: 'psychology', label: UI_TEXT.testCenter.categories.psychology },
    { key: 'career', label: UI_TEXT.testCenter.categories.career },
    { key: 'astrology', label: UI_TEXT.testCenter.categories.astrology },
    { key: 'tarot', label: UI_TEXT.testCenter.categories.tarot },
    { key: 'numerology', label: UI_TEXT.testCenter.categories.numerology },
    { key: 'relationship', label: UI_TEXT.testCenter.categories.relationship },
    { key: 'learning', label: UI_TEXT.testCenter.categories.learning },
  ];

  return (
    <div className="mb-6 flex flex-col lg:flex-row items-stretch lg:items-center gap-4 justify-between">
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${active===t.key ? 'bg-gray-900 text-white border-gray-900 shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            onClick={() => onChangeActive(t.key)}
          >{t.label}</button>
        ))}
      </div>
      <div className="relative w-full lg:w-80">
        <input
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder={UI_TEXT.testCenter.searchPlaceholder}
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

// 内部组件：测试列表
const TestList: React.FC<{ active: string; query: string }> = ({ active, query }) => {
  const list = React.useMemo(() => {
    const q = (query || '').toLowerCase();
    return [...UI_TEXT.testCenter.tests].filter(t => {
      const byType = active === 'all' || t.module === active;
      const byQuery = !q || t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q);
      return byType && byQuery;
    });
  }, [active, query]);

  if (!list.length) {
    return <div className="text-gray-600 py-12">No matching tests found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {list.map((t: any) => (
        <Link key={t.id} to={t.href} className="group block bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition transform">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
              {labelOfModule(t.module)}
            </span>
            <span className="opacity-0 group-hover:opacity-100 transition text-gray-400">→</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{t.title}</h3>
          <p className="text-sm text-gray-600">{t.description}</p>
        </Link>
      ))}
    </div>
  );
};

function labelOfModule(module: string): string {
  const map: Record<string, string> = {
    all: UI_TEXT.testCenter.categories.all,
    psychology: UI_TEXT.testCenter.categories.psychology,
    career: UI_TEXT.testCenter.categories.career,
    astrology: UI_TEXT.testCenter.categories.astrology,
    tarot: UI_TEXT.testCenter.categories.tarot,
    numerology: UI_TEXT.testCenter.categories.numerology,
    relationship: UI_TEXT.testCenter.categories.relationship,
    learning: UI_TEXT.testCenter.categories.learning,
  };
  return map[module] || module;
}


