/**
 * Google Analytics Integration Component
 * 集成Google Analytics 4到应用中
 */

import { useEffect } from 'react';
import { getGoogleAnalyticsId } from '@/config/environment';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GoogleAnalytics: React.FC = () => {
  useEffect(() => {
    const gaId = getGoogleAnalyticsId();
    
    if (!gaId) {
      console.log('Google Analytics ID not configured');
      return;
    }

    // 加载Google Analytics脚本
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script1);

    // 初始化gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', gaId, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true
    });

    // 监听路由变化（用于SPA）
    const handleRouteChange = () => {
      gtag('config', gaId, {
        page_title: document.title,
        page_location: window.location.href
      });
    };

    // 监听popstate事件（浏览器前进/后退）
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return null;
};

// 导出gtag函数供其他组件使用
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', getGoogleAnalyticsId(), {
      page_path: pagePath,
      page_title: pageTitle || document.title
    });
  }
};
