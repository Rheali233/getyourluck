/**
 * SEO元数据管理组件
 * 负责管理页面的SEO元数据、结构化数据和SEO优化
 */

import React, { useEffect, useMemo, useState } from 'react';

import type { BaseComponentProps } from '@/types/componentTypes';

export interface SEOMetadata {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  keywords: string[];
  keywordsEn: string[];
  canonicalUrl: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  [key: string]: any;
}

export interface SEOManagerProps extends BaseComponentProps {
  pageType?: 'homepage' | 'test' | 'blog';
  structuredData?: StructuredData[];
}

export const SEOManager: React.FC<SEOManagerProps> = ({
  structuredData = []
}) => {


  // 默认元数据
  const defaultMetadata = useMemo(() => ({
    title: 'Comprehensive Testing Platform - Personality, Psychology & Astrology Tests',
    description: 'Discover yourself with our comprehensive testing platform. Take personality tests, psychological assessments, astrology readings, and more.',
    keywords: 'personality test, psychology test, astrology, numerology, tarot, self-discovery',
    canonicalUrl: window.location.href,
    ogTitle: 'Comprehensive Testing Platform',
    ogDescription: 'Discover yourself with personality, psychology, and astrology tests',
    ogType: 'website',
    ogImage: '',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Comprehensive Testing Platform',
    twitterDescription: 'Discover yourself with personality, psychology, and astrology tests',
    twitterImage: ''
  }), []);

  const [currentMetadata] = useState(defaultMetadata);

  // 更新页面标题
  useEffect(() => {
    if (currentMetadata.title) {
      document.title = currentMetadata.title;
    }
  }, [currentMetadata.title]);

  // 更新meta标签
  useEffect(() => {
    updateMetaTags();
  }, [currentMetadata]);

  // 更新结构化数据
  useEffect(() => {
    updateStructuredData();
  }, [structuredData]);

  // 更新meta标签
  const updateMetaTags = () => {
    // 更新description
    updateMetaTag('description', currentMetadata.description);
    
    // 更新keywords
    updateMetaTag('keywords', currentMetadata.keywords);
    
    // 更新canonical URL
    updateCanonicalUrl(defaultMetadata.canonicalUrl);
    
    // 更新Open Graph标签
    updateOpenGraphTags();
    
    // 更新Twitter Card标签
    updateTwitterCardTags();
    
    // 更新robots标签
    updateRobotsTags();
    

  };

  // 更新单个meta标签
  const updateMetaTag = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  // 更新canonical URL
  const updateCanonicalUrl = (url: string) => {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  };

  // 更新Open Graph标签
  const updateOpenGraphTags = () => {
    const ogTags = [
      { property: 'og:title', content: defaultMetadata.ogTitle || currentMetadata.title },
      { property: 'og:description', content: defaultMetadata.ogDescription || currentMetadata.description },
      { property: 'og:url', content: defaultMetadata.canonicalUrl },
      { property: 'og:type', content: defaultMetadata.ogType || 'website' },
      { property: 'og:locale', content: 'zh-CN' }, // 假设默认语言是中文
      { property: 'og:site_name', content: '综合测试平台' }
    ];

    if (defaultMetadata.ogImage) {
      ogTags.push({ property: 'og:image', content: defaultMetadata.ogImage });
    }

    ogTags.forEach(tag => {
      updateMetaTagByProperty(tag.property, tag.content);
    });
  };

  // 更新Twitter Card标签
  const updateTwitterCardTags = () => {
    const twitterTags = [
      { name: 'twitter:card', content: defaultMetadata.twitterCard || 'summary_large_image' },
      { name: 'twitter:title', content: defaultMetadata.twitterTitle || currentMetadata.title },
      { name: 'twitter:description', content: defaultMetadata.twitterDescription || currentMetadata.description },
      { name: 'twitter:site', content: '@testplatform' }
    ];

    if (defaultMetadata.twitterImage) {
      twitterTags.push({ name: 'twitter:image', content: defaultMetadata.twitterImage });
    }

    twitterTags.forEach(tag => {
      updateMetaTag(tag.name, tag.content);
    });
  };

  // 更新robots标签
  const updateRobotsTags = () => {
    let robots = 'index'; // 默认允许索引
    
    updateMetaTag('robots', robots);
  };

  // 设置HTML语言属性
  useEffect(() => {
    document.documentElement.lang = 'en';
  }, []);

  // 更新meta标签（通过property属性）
  const updateMetaTagByProperty = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  // 更新结构化数据
  const updateStructuredData = () => {
    // 移除现有的结构化数据
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());
    
    // 添加新的结构化数据
    structuredData.forEach(data => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });
  };

  // 组件挂载时初始化
  useEffect(() => {
    // 初始化SEO设置
    updateMetaTags();
  }, []);

  // 这个组件不渲染任何UI，只负责SEO管理
  return null;
};
