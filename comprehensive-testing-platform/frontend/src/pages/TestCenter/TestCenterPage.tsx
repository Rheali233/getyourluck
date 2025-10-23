/**
 * Test Center 页面
 * 统一测试发现与导航入口
 */

import React from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { UI_TEXT } from '@/shared/configs/UI_TEXT';
import { getTestConfigSummary } from '@/shared/configs/testConfigs';
import { SEOManager } from '@/modules/homepage/components/SEOManager';
import { SEOHead } from '@/components/SEOHead';
import { Navigation, Card } from '@/components/ui';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/classNames';
import { useScrollToTop } from '@/hooks/useScrollToTop';

interface TestCenterPageProps extends BaseComponentProps {}

export const TestCenterPage: React.FC<TestCenterPageProps> = ({
  className,
  testId = 'test-center-page',
  ...props
}) => {
  const canonical = `${typeof window !== 'undefined' ? window.location.origin : ''}/tests`;
  const [active, setActive] = React.useState<string>('all');
  const [query, setQuery] = React.useState<string>('');
  // Advanced filters removed per design – keep only category and search

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
        <SEOManager
          pageType="homepage"
          metadata={{
            title: 'Test Center | MBTI, Holland, Tarot, BaZi, Name Recommendation',
            description:
              'Explore MBTI, Emotional Intelligence, Holland Code, Tarot Reading, BaZi (Four Pillars) Analysis, Chinese Name Recommendation and more. Start your self-discovery journey with fast, English-only tests.',
            canonicalUrl: canonical,
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          {/* Structured Data: CollectionPage + ItemList */}
          <SEOHead
            config={{
              title: 'Test Center | MBTI, Holland, Tarot, BaZi, Name Recommendation',
              description:
                'Explore MBTI, Emotional Intelligence, Holland Code, Tarot Reading, BaZi (Four Pillars) Analysis, Chinese Name Recommendation and more.',
              keywords: ['MBTI','Holland Code','Tarot','BaZi','Chinese Name','EQ','Psychology Tests','Career Tests','Numerology'],
              canonical: canonical,
              ogTitle: 'Test Center',
              ogDescription: 'Find and start popular tests across psychology, career, numerology and tarot.',
              structuredData: {
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: 'Test Center',
                description:
                  'Collection of psychology, career, numerology, and tarot tests including MBTI, EQ, Holland, BaZi, Chinese Name Recommendation, and Tarot Reading.',
                hasPart: {
                  '@type': 'ItemList',
                  itemListElement: UI_TEXT.testCenter.tests.map((t, idx) => ({
                    '@type': 'ListItem',
                    position: idx + 1,
                    name: t.title,
                    url: new URL(t.href, typeof window !== 'undefined' ? window.location.origin : 'https://selfatlas.net').toString(),
                  })),
                },
              },
            }}
          />
          {/* 面包屑导航 */}
          <Breadcrumb items={getBreadcrumbConfig('/tests')} />
          
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {UI_TEXT.testCenter.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">{UI_TEXT.testCenter.subtitle}</p>
          </header>

          {/* 过滤与搜索 */}
          <Controls 
            active={active} 
            onChangeActive={setActive} 
            query={query} 
            onChangeQuery={setQuery}
          />

          {/* 测试卡片列表 */}
          <TestList 
            active={active} 
            query={query}
          />
        </div>
      </div>
    </div>
  );
};

export default TestCenterPage;

// 内部控件：筛选与搜索
const Controls: React.FC<{
  active: string;
  onChangeActive: React.Dispatch<React.SetStateAction<string>>;
  query: string;
  onChangeQuery: React.Dispatch<React.SetStateAction<string>>;
}> = ({ 
  active, onChangeActive, query, onChangeQuery
}) => {
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
    <div className="mb-8">
      {/* 领域筛选 + 搜索 同行显示，高度一致 */}
      <section aria-labelledby="test-center-filters" className="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
        {tabs.map(t => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              className={cn(
                "px-4 py-2.5 rounded-full text-sm font-medium transition-colors duration-200",
                isActive
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'bg-white/80 text-gray-700 shadow-sm hover:bg-white'
              )}
              onClick={() => onChangeActive(t.key)}
            >
              {t.label}
            </button>
          );
        })}
        {/* 搜索框与按钮同高、同圆角 */}
        <div className="relative w-full sm:w-80">
          <input
            className="h-[42px] w-full px-4 pl-10 rounded-full bg-white/90 shadow-sm focus:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            placeholder={UI_TEXT.testCenter.searchPlaceholder}
            value={query}
            onChange={(e) => onChangeQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
        </div>
      </section>
    </div>
  );
};

// 内部组件：测试列表
const TestList: React.FC<{ 
  active: string; 
  query: string; 
}> = ({ active, query }) => {
  const normalizeId = (id: string): string => {
    // 将 UI_TEXT 中的 id 转换为 testConfigs 的 id 约定
    // 例：love_language -> loveLanguage (URL 保持连字符，但内部标识仍可能使用下划线)
    return id.includes('_')
      ? id.split('_').map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1))).join('')
      : id;
  };

  const list = React.useMemo(() => {
    const q = (query || '').toLowerCase();
    let filtered = [...UI_TEXT.testCenter.tests].filter(t => {
      const byType = active === 'all' || t.module === active;
      const byQuery = !q || t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q);

      return byType && byQuery;
    });

    // 用测试配置覆盖前端常量的时长/题数，保证与测试准备页一致
    filtered = filtered.map((t: any) => {
      const summary = getTestConfigSummary(normalizeId(t.id));
      // 规范路由映射（确保 numerology/name 等正确）
      const routeOverrides: Record<string, string> = {
        name: '/numerology/name',
        bazi: '/numerology/bazi',
        zodiac: '/numerology/zodiac',
        ziwei: '/numerology/ziwei',
        holland: '/career/holland',
        disc: '/career/disc',
        leadership: '/career/leadership',
        vark: '/learning/vark',
      };
      // 标题不做覆盖，严格使用 UI_TEXT 中的 title
      const normId = normalizeId(t.id);

      return {
        ...t,
        title: t.title,
        href: routeOverrides[normId] || t.href,
        duration: summary?.duration ? String(summary.duration) : t.duration,
        questions: summary?.questionCount ? String(summary.questionCount) : t.questions,
      };
    });

    // 按人气排序（字符串参与人数转为数字）
    filtered.sort((a: any, b: any) => (parseInt(b.participants || '0', 10) - parseInt(a.participants || '0', 10)));

    return filtered;
  }, [active, query]);

  if (!list.length) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No matching tests found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <section aria-labelledby="test-center-list" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {list.map((t: any) => (
        <TestCard key={t.id} test={t} />
      ))}
    </section>
  );
};

// 测试卡片组件
const TestCard: React.FC<{ test: any }> = ({ test }) => {
  const moduleConfig = getModuleConfig(test.module);
  
  return (
    <Link 
      to={test.href} 
      className="block relative overflow-hidden rounded-xl"
    >
      <Card className={cn(
        "relative bg-gradient-to-br from-white/70 via-white/60 to-white/50 backdrop-blur-lg p-6 h-full border-0",
        "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/30 before:to-transparent before:pointer-events-none"
      )}>
        {/* 热门标识 */}
        {test.isHot && (
          <div className="absolute top-2 right-2 z-10 select-none pointer-events-none">
            <div className="origin-top-right rotate-6 bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white text-[10px] font-semibold px-2 py-0.5 tracking-wide uppercase shadow rounded-sm">
              hot
            </div>
          </div>
        )}

        {/* 类型标签在标题上方 */}
        <div className="mb-2">
          <span className={cn(
            "text-xs px-3 py-1.5 rounded-full font-medium border",
            moduleConfig.labelBg,
            moduleConfig.labelText
          )}>
            {labelOfModule(test.module)}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          {test.title}
        </h3>

        {/* 描述 - 去掉结尾句号 */}
        <p className="text-gray-600 text-xs leading-relaxed mb-4">
          {(test.description || '').replace(/\.\s*$/, '')}
        </p>

        {/* 测试信息 - 底部对齐 */}
        <div className="mt-auto">
          <div className="flex items-center text-xs text-gray-500 gap-4">
            <span className="flex items-center gap-1">
              <span>⏱️</span>
              <span>{test.duration || '10-15'} min</span>
            </span>
            <span className="flex items-center gap-1">
              <span>📝</span>
              <span>{test.questions || '15-20'}</span>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

// 模块配置
const getModuleConfig = (module: string) => {
  const configs = {
    psychology: {
      icon: '🧠',
      borderColor: 'border-blue-200 hover:border-blue-300',
      labelBg: 'bg-blue-100 border-blue-200',
      labelText: 'text-blue-800'
    },
    career: {
      icon: '💼',
      borderColor: 'border-green-200 hover:border-green-300',
      labelBg: 'bg-green-100 border-green-200',
      labelText: 'text-green-800'
    },
    astrology: {
      icon: '⭐',
      borderColor: 'border-purple-200 hover:border-purple-300',
      labelBg: 'bg-purple-100 border-purple-200',
      labelText: 'text-purple-800'
    },
    tarot: {
      icon: '🔮',
      borderColor: 'border-indigo-200 hover:border-indigo-300',
      labelBg: 'bg-indigo-100 border-indigo-200',
      labelText: 'text-indigo-800'
    },
    numerology: {
      icon: '🔢',
      borderColor: 'border-orange-200 hover:border-orange-300',
      labelBg: 'bg-orange-100 border-orange-200',
      labelText: 'text-orange-800'
    },
    relationship: {
      icon: '💕',
      borderColor: 'border-pink-200 hover:border-pink-300',
      labelBg: 'bg-pink-100 border-pink-200',
      labelText: 'text-pink-800'
    },
    learning: {
      icon: '📚',
      borderColor: 'border-teal-200 hover:border-teal-300',
      labelBg: 'bg-teal-100 border-teal-200',
      labelText: 'text-teal-800'
    }
  };
  return configs[module as keyof typeof configs] || configs.psychology;
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


