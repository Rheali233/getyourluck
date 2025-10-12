/**
 * SEO管理Hook
 * 统一管理页面SEO元数据
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSEOConfig, generateStructuredData, type SEOConfig } from '../config/seo';

interface UseSEOOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  testType?: string;
  testId?: string;
  structuredData?: any;
  customConfig?: Partial<SEOConfig>;
}

export function useSEO(options: UseSEOOptions = {}) {
  const location = useLocation();
  
  // 获取基础SEO配置
  const baseConfig = getSEOConfig(location.pathname, options.testType, options.testId);
  
  // 合并自定义配置
  const seoConfig: SEOConfig = {
    ...baseConfig,
    ...options.customConfig,
    title: options.title || baseConfig.title,
    description: options.description || baseConfig.description,
    keywords: options.keywords || baseConfig.keywords,
    structuredData: options.structuredData || baseConfig.structuredData
  };

  // 生成结构化数据
  const structuredData = seoConfig.structuredData || generateStructuredData(
    location.pathname.includes('/result') ? 'test-result' : 'test',
    {
      title: seoConfig.title,
      description: seoConfig.description,
      testType: options.testType,
      testId: options.testId,
      url: window.location.href
    }
  );

  return {
    ...seoConfig,
    structuredData,
    canonical: seoConfig.canonical || window.location.href
  };
}

// 页面标题管理Hook
export function usePageTitle(title?: string) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);
}

// 页面描述管理Hook
export function usePageDescription(description?: string) {
  useEffect(() => {
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }
    }
  }, [description]);
}
