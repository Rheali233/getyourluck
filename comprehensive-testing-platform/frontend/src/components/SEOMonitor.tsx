/**
 * SEO监控组件
 * 监控页面SEO指标和性能
 */

import React, { useEffect } from 'react';

interface SEOMonitorProps {
  pageTitle: string;
  pageDescription: string;
  testType?: string;
  testId?: string;
}

export const SEOMonitor: React.FC<SEOMonitorProps> = ({
  pageTitle,
  pageDescription,
  testType,
  testId
}) => {
  useEffect(() => {
    // 监控页面标题和描述
    if (document.title !== pageTitle) {
      console.warn('SEO Warning: Page title mismatch', {
        expected: pageTitle,
        actual: document.title
      });
    }

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && metaDescription.getAttribute('content') !== pageDescription) {
      console.warn('SEO Warning: Meta description mismatch', {
        expected: pageDescription,
        actual: metaDescription.getAttribute('content')
      });
    }

    // 监控Core Web Vitals
    if ('web-vital' in window) {
      // 这里可以集成web-vitals库
      console.log('Core Web Vitals monitoring enabled');
    }

    // 监控页面加载性能
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log('Page Load Performance:', {
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
            totalTime: navEntry.loadEventEnd - navEntry.fetchStart
          });
        }
      }
    });

    observer.observe({ entryTypes: ['navigation'] });

    // 监控图片加载
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt) {
        console.warn(`SEO Warning: Image ${index} missing alt attribute`);
      }
    });

    // 监控链接可访问性
    const links = document.querySelectorAll('a');
    links.forEach((link, index) => {
      if (!link.textContent?.trim() && !link.getAttribute('aria-label')) {
        console.warn(`SEO Warning: Link ${index} missing accessible text`);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [pageTitle, pageDescription, testType, testId]);

  // 开发环境下显示SEO信息
  if (process.env['NODE_ENV'] === 'development') {
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px'
      }}>
        <div><strong>SEO Monitor</strong></div>
        <div>Title: {pageTitle}</div>
        <div>Description: {pageDescription.substring(0, 50)}...</div>
        {testType && <div>Test Type: {testType}</div>}
        {testId && <div>Test ID: {testId}</div>}
      </div>
    );
  }

  return null;
};
