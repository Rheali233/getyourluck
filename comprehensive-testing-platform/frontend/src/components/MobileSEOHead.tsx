/**
 * 移动端SEO Head组件
 * 专门为移动端优化的SEO元标签管理
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useMobileSEO } from '@/hooks/useMobileSEO';
import { MOBILE_SEO_META, MOBILE_STRUCTURED_DATA } from '@/config/mobileSEO';

interface MobileSEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: any;
  className?: string;
}

export const MobileSEOHead: React.FC<MobileSEOHeadProps> = ({
  title = 'SelfAtlas - Mobile Testing Platform',
  description = 'Take professional psychological tests, career assessments, and more on your mobile device. Optimized for mobile experience.',
  keywords = 'mobile psychological tests, smartphone personality test, mobile career assessment, mobile astrology, mobile tarot',
  canonicalUrl,
  ogImage = 'https://selfatlas.com/images/mobile-og-image.jpg',
  structuredData,
  className
}) => {
  const { isMobile, isTablet, touchSupport } = useMobileSEO();

  // 生成移动端特定的标题
  const mobileTitle = isMobile ? `${title} - Mobile` : title;
  
  // 生成移动端特定的描述
  const mobileDescription = isMobile 
    ? `${description} Optimized for mobile devices.`
    : description;

  // 生成移动端关键词
  const mobileKeywords = isMobile
    ? `${keywords}, mobile friendly, touch optimized, responsive design`
    : keywords;

  // 生成结构化数据
  const mobileStructuredData = {
    ...MOBILE_STRUCTURED_DATA.WebSite,
    ...MOBILE_STRUCTURED_DATA.MobileApplication,
    ...structuredData
  };

  return (
    <Helmet>
      {/* 基础SEO标签 */}
      <title>{mobileTitle}</title>
      <meta name="description" content={mobileDescription} />
      <meta name="keywords" content={mobileKeywords} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* 移动端特定meta标签 */}
      <meta name="viewport" content={MOBILE_SEO_META.viewport} />
      <meta name="theme-color" content={MOBILE_SEO_META.themeColor} />
      <meta name="mobile-web-app-capable" content={MOBILE_SEO_META.mobileWebAppCapable} />
      <meta name="apple-mobile-web-app-capable" content={MOBILE_SEO_META.appleMobileWebAppCapable} />
      <meta name="apple-mobile-web-app-status-bar-style" content={MOBILE_SEO_META.appleMobileWebAppStatusBarStyle} />
      <meta name="format-detection" content={MOBILE_SEO_META.formatDetection} />

      {/* 设备特定优化 */}
      {isMobile && (
        <>
          <meta name="HandheldFriendly" content="true" />
          <meta name="MobileOptimized" content="320" />
          <meta name="apple-touch-fullscreen" content="yes" />
        </>
      )}

      {isTablet && (
        <>
          <meta name="HandheldFriendly" content="true" />
          <meta name="MobileOptimized" content="768" />
        </>
      )}

      {/* 触摸支持检测 */}
      {touchSupport && (
        <meta name="touch-action" content="manipulation" />
      )}

      {/* Open Graph标签 */}
      <meta property="og:title" content={mobileTitle} />
      <meta property="og:description" content={mobileDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="GetYourLuck" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* 移动端Open Graph标签 */}
      <meta property="og:locale" content="en_US" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={mobileTitle} />

      {/* Twitter Card标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={mobileTitle} />
      <meta name="twitter:description" content={mobileDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* 移动端特定Twitter标签 */}
      {isMobile && (
        <>
          <meta name="twitter:app:country" content="US" />
          <meta name="twitter:app:name:iphone" content="GetYourLuck" />
          <meta name="twitter:app:name:ipad" content="GetYourLuck" />
          <meta name="twitter:app:name:googleplay" content="GetYourLuck" />
        </>
      )}

      {/* 结构化数据 */}
      <script type="application/ld+json">
        {JSON.stringify(mobileStructuredData)}
      </script>

      {/* 移动端性能优化标签 */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />

      {/* 预加载关键资源 */}
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/images/logo-mobile.png" as="image" />

      {/* 移动端样式优化 */}
      <style>
        {`
          /* 移动端基础样式优化 */
          @media (max-width: 768px) {
            body {
              -webkit-text-size-adjust: 100%;
              -webkit-tap-highlight-color: transparent;
              -webkit-touch-callout: none;
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }
            
            /* 触摸目标优化 */
            button, a, input, select, textarea {
              min-height: 44px;
              min-width: 44px;
            }
            
            /* 滚动优化 */
            .mobile-scroll {
              -webkit-overflow-scrolling: touch;
              overflow-scrolling: touch;
            }
            
            /* 图片优化 */
            img {
              max-width: 100%;
              height: auto;
            }
            
            /* 字体优化 */
            body {
              font-size: 16px;
              line-height: 1.5;
            }
          }
          
          /* 平板优化 */
          @media (min-width: 768px) and (max-width: 1024px) {
            body {
              font-size: 18px;
              line-height: 1.6;
            }
          }
          
          /* 减少动画偏好 */
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </style>
    </Helmet>
  );
};

/**
 * 移动端性能监控Head组件
 */
interface MobilePerformanceHeadProps {
  enableMonitoring?: boolean;
  enableOptimization?: boolean;
}

export const MobilePerformanceHead: React.FC<MobilePerformanceHeadProps> = ({
  enableMonitoring = true,
  enableOptimization = true
}) => {
  const { isMobile, performance } = useMobileSEO();

  if (!isMobile) return null;

  return (
    <Helmet>
      {enableMonitoring && (
        <script>
          {`
            // 移动端性能监控
            (function() {
              // Core Web Vitals监控
              function sendToAnalytics(name, value) {
                if (typeof gtag !== 'undefined') {
                  gtag('event', name, {
                    event_category: 'Mobile Web Vitals',
                    value: Math.round(name === 'CLS' ? value * 1000 : value),
                    event_label: name,
                    non_interaction: true
                  });
                }
              }
              
              // LCP监控
              new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                  sendToAnalytics('LCP', entry.startTime);
                }
              }).observe({entryTypes: ['largest-contentful-paint']});
              
              // FID监控
              new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                  sendToAnalytics('FID', entry.processingStart - entry.startTime);
                }
              }).observe({entryTypes: ['first-input']});
              
              // CLS监控
              let clsValue = 0;
              new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                  if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    sendToAnalytics('CLS', clsValue);
                  }
                }
              }).observe({entryTypes: ['layout-shift']});
            })();
          `}
        </script>
      )}

      {enableOptimization && (
        <script>
          {`
            // 移动端优化脚本
            (function() {
              // 触摸延迟优化
              let touchStartTime = 0;
              document.addEventListener('touchstart', function() {
                touchStartTime = Date.now();
              }, {passive: true});
              
              document.addEventListener('touchend', function(e) {
                const touchDuration = Date.now() - touchStartTime;
                if (touchDuration < 300) {
                  e.preventDefault();
                }
              }, {passive: false});
              
              // 图片懒加载优化
              if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      const img = entry.target;
                      img.src = img.dataset.src;
                      img.classList.remove('lazy');
                      observer.unobserve(img);
                    }
                  });
                });
                
                document.querySelectorAll('img[data-src]').forEach(img => {
                  imageObserver.observe(img);
                });
              }
            })();
          `}
        </script>
      )}
    </Helmet>
  );
};
