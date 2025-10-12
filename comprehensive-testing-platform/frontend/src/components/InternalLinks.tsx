/**
 * 内部链接组件
 * 用于优化内部链接策略，提升SEO效果
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/classNames';
import { INTERNAL_LINKING_CONFIG, RELATED_CONTENT_CONFIG } from '@/config/contentSEO';

interface InternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  keywords?: string[];
  title?: string;
  rel?: string;
}

/**
 * 优化的内部链接组件
 */
export const InternalLink: React.FC<InternalLinkProps> = ({
  href,
  children,
  className,
  keywords,
  title,
  rel,
  ...props
}) => {
  return (
    <Link
      to={href}
      className={cn(
        'text-blue-600 hover:text-blue-800 hover:underline transition-colors',
        className
      )}
      title={title}
      rel={rel}
      {...props}
    >
      {children}
    </Link>
  );
};

/**
 * 关键词链接组件
 */
interface KeywordLinkProps {
  keyword: string;
  href: string;
  children?: React.ReactNode;
  className?: string;
}

export const KeywordLink: React.FC<KeywordLinkProps> = ({
  keyword,
  href,
  children,
  className,
}) => {
  return (
    <InternalLink
      href={href}
      className={cn('font-medium', className)}
      keywords={[keyword]}
      title={`Learn more about ${keyword}`}
    >
      {children || keyword}
    </InternalLink>
  );
};

/**
 * 相关测试推荐组件
 */
interface RelatedTestsProps {
  testType: string;
  className?: string;
  maxItems?: number;
}

export const RelatedTests: React.FC<RelatedTestsProps> = ({
  testType,
  className,
  maxItems = 3,
}) => {
  const recommendations = RELATED_CONTENT_CONFIG.TEST_RESULT_RECOMMENDATIONS[testType as keyof typeof RELATED_CONTENT_CONFIG.TEST_RESULT_RECOMMENDATIONS];
  
  if (!recommendations) return null;

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold text-gray-900">Related Tests</h3>
      <div className="grid gap-3">
        {recommendations.slice(0, maxItems).map((item, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Link
              to={item.path}
              className="block"
            >
              <h4 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {item.reason}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 模块推荐组件
 */
interface ModuleRecommendationsProps {
  moduleType: string;
  className?: string;
  maxItems?: number;
}

export const ModuleRecommendations: React.FC<ModuleRecommendationsProps> = ({
  moduleType,
  className,
  maxItems = 3,
}) => {
  const recommendations = RELATED_CONTENT_CONFIG.MODULE_RECOMMENDATIONS[moduleType as keyof typeof RELATED_CONTENT_CONFIG.MODULE_RECOMMENDATIONS];
  
  if (!recommendations) return null;

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
      <div className="grid gap-3">
        {recommendations.slice(0, maxItems).map((item, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
            <Link
              to={item.path}
              className="block"
            >
              <h4 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {item.description}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 面包屑导航增强组件
 */
interface EnhancedBreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
    current?: boolean;
    keywords?: string[];
  }>;
  className?: string;
}

export const EnhancedBreadcrumb: React.FC<EnhancedBreadcrumbProps> = ({
  items,
  className,
}) => {
  return (
    <nav className={cn('text-sm text-gray-500 mb-4', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <li className="text-gray-400">/</li>}
            <li>
              {item.current ? (
                <span className="font-medium text-gray-700">{item.label}</span>
              ) : (
                <InternalLink
                  href={item.href || '#'}
                  keywords={item.keywords}
                  className="hover:text-gray-700"
                >
                  {item.label}
                </InternalLink>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

/**
 * 上下文链接组件
 */
interface ContextualLinksProps {
  context: 'homepage' | 'module' | 'test' | 'result';
  moduleType?: string;
  testType?: string;
  className?: string;
}

export const ContextualLinks: React.FC<ContextualLinksProps> = ({
  context,
  moduleType,
  testType,
  className,
}) => {
  let links: Array<{ path: string; text: string; keywords: string[] }> = [];

  switch (context) {
    case 'homepage':
      links = INTERNAL_LINKING_CONFIG.HOMEPAGE_LINKS.primaryModules;
      break;
    case 'module':
      if (moduleType) {
        links = INTERNAL_LINKING_CONFIG.MODULE_PAGE_LINKS[moduleType as keyof typeof INTERNAL_LINKING_CONFIG.MODULE_PAGE_LINKS] || [];
      }
      break;
    case 'test':
      // 测试页面的相关链接
      links = [
        { path: '/tests', text: 'All Tests', keywords: ['comprehensive tests'] },
        { path: '/blog', text: 'Test Guides', keywords: ['test guides', 'how to'] }
      ];
      break;
    case 'result':
      // 结果页面的相关链接
      if (testType) {
        const recommendations = RELATED_CONTENT_CONFIG.TEST_RESULT_RECOMMENDATIONS[testType as keyof typeof RELATED_CONTENT_CONFIG.TEST_RESULT_RECOMMENDATIONS];
        if (recommendations) {
          links = recommendations.map(rec => ({
            path: rec.path,
            text: rec.title,
            keywords: [rec.title.toLowerCase()]
          }));
        }
      }
      break;
  }

  if (links.length === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-lg font-semibold text-gray-900">
        {context === 'homepage' ? 'Explore Our Tests' :
         context === 'module' ? 'Popular Tests' :
         context === 'test' ? 'Related Content' :
         'You Might Also Like'}
      </h3>
      <div className="flex flex-wrap gap-2">
        {links.map((link, index) => (
          <KeywordLink
            key={index}
            keyword={link.text}
            href={link.path}
            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
          />
        ))}
      </div>
    </div>
  );
};
