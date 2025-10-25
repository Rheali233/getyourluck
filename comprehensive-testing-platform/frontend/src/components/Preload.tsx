/**
 * 预加载组件
 * 用于预加载关键资源，提升用户体验
 */

import React, { useEffect } from 'react';

interface PreloadProps {
  href: string;
  as: 'script' | 'style' | 'image' | 'font' | 'fetch';
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
  media?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * 预加载单个资源
 */
export const Preload: React.FC<PreloadProps> = ({
  href,
  as,
  type,
  crossOrigin,
  media,
  onLoad,
  onError,
}) => {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    
    if (type) link.type = type;
    if (crossOrigin) link.crossOrigin = crossOrigin;
    if (media) link.media = media;
    
    link.onload = () => onLoad?.();
    link.onerror = () => onError?.();
    
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, [href, as, type, crossOrigin, media, onLoad, onError]);

  return null;
};

/**
 * 预加载关键模块
 */
export const PreloadCriticalModules: React.FC = () => {
  useEffect(() => {
    // 预加载关键路由
    const criticalRoutes = [
      '/psychology',
      '/career',
      '/astrology',
      '/tarot',
      '/numerology',
    ];

    criticalRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });

    // 预加载关键API（使用后端已存在且为GET的方法）
    const criticalAPIs = [
      // Psychology-related tests
      '/psychology/questions/mbti',
      '/psychology/questions/phq9',
      '/psychology/questions/eq',
      // Career-related tests
      '/career/questions/holland',
      '/career/questions/disc',
      '/career/questions/leadership',
      // Astrology
      '/astrology/zodiac-signs',
    ];

    criticalAPIs.forEach(api => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = api;
      document.head.appendChild(link);
    });
  }, []);

  return null;
};

/**
 * 预加载图片
 */
interface PreloadImageProps {
  src: string;
  webpSrc?: string;
  sizes?: string;
}

export const PreloadImage: React.FC<PreloadImageProps> = ({
  src,
  webpSrc,
  sizes,
}) => {
  useEffect(() => {
    // 预加载WebP格式（如果支持）
    if (webpSrc) {
      const webpLink = document.createElement('link');
      webpLink.rel = 'preload';
      webpLink.href = webpSrc;
      webpLink.as = 'image';
      webpLink.type = 'image/webp';
      if (sizes) webpLink.media = sizes;
      document.head.appendChild(webpLink);
    }

    // 预加载原始格式
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    if (sizes) link.media = sizes;
    document.head.appendChild(link);

    return () => {
      if (webpSrc) {
        const webpLink = document.querySelector(`link[href="${webpSrc}"]`);
        if (webpLink) document.head.removeChild(webpLink);
      }
      const originalLink = document.querySelector(`link[href="${src}"]`);
      if (originalLink) document.head.removeChild(originalLink);
    };
  }, [src, webpSrc, sizes]);

  return null;
};

/**
 * 预加载字体
 */
interface PreloadFontProps {
  href: string;
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

export const PreloadFont: React.FC<PreloadFontProps> = ({
  href,
  type = 'font/woff2',
  crossOrigin = 'anonymous',
}) => {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = 'font';
    link.type = type;
    link.crossOrigin = crossOrigin;
    document.head.appendChild(link);

    return () => {
      const existingLink = document.querySelector(`link[href="${href}"]`);
      if (existingLink) document.head.removeChild(existingLink);
    };
  }, [href, type, crossOrigin]);

  return null;
};
