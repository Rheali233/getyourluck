/**
 * SEO Head组件
 * 使用React Helmet管理页面SEO元数据
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { buildAbsoluteUrl, type SEOConfig } from '@/config/seo';

interface SEOHeadProps {
  config: SEOConfig;
  children?: React.ReactNode;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ config, children }) => {
  const {
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    structuredData
  } = config;

  return (
    <Helmet>
      {/* 基础SEO标签 */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical || (typeof window !== 'undefined' ? buildAbsoluteUrl(window.location.pathname) : buildAbsoluteUrl('/'))} />
      
      {/* Open Graph标签 */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter Card标签 */}
      <meta name="twitter:card" content={twitterCard || 'summary_large_image'} />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* 移动端优化 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#3b82f6" />
      
      {/* 结构化数据 */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* 其他SEO标签 */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="author" content="Comprehensive Testing Platform" />
      <meta name="generator" content="React + Vite" />
      
      {/* 语言标签 */}
      <meta httpEquiv="content-language" content="en" />
      <html lang="en" />
      
      {children}
    </Helmet>
  );
};

// 简化的SEO组件，用于快速使用
interface SimpleSEOProps {
  title: string;
  description: string;
}

export const SimpleSEO: React.FC<SimpleSEOProps> = ({ 
  title, 
  description
}) => {
  const config: SEOConfig = {
    title,
    description,
    canonical: typeof window !== 'undefined' ? buildAbsoluteUrl(window.location.pathname) : buildAbsoluteUrl('/'),
    ogTitle: title,
    ogDescription: description,
    ogImage: buildAbsoluteUrl('/og-image.jpg'),
    twitterCard: 'summary_large_image'
  };

  return <SEOHead config={config} />;
};
