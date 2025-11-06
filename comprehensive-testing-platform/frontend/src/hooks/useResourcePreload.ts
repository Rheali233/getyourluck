/**
 * 资源预加载Hook
 * 智能预加载关键资源以提升性能
 */

import { useCallback, useState } from 'react';

interface PreloadOptions {
  priority?: 'high' | 'low';
  timeout?: number;
  retries?: number;
}

interface PreloadResult {
  success: boolean;
  error?: Error;
  loadTime?: number;
}

export function useResourcePreload() {
  const [preloadedResources, setPreloadedResources] = useState<Set<string>>(new Set());
  const [loadingResources, setLoadingResources] = useState<Set<string>>(new Set());

  // 预加载图片
  const preloadImage = useCallback(async (
    src: string,
    options: PreloadOptions = {}
  ): Promise<PreloadResult> => {
    const { priority = 'low', timeout = 5000, retries = 3 } = options;
    
    if (preloadedResources.has(src)) {
      return { success: true };
    }

    if (loadingResources.has(src)) {
      return { success: false, error: new Error('Already loading') };
    }

    setLoadingResources(prev => new Set([...prev, src]));

    const startTime = performance.now();

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await new Promise<PreloadResult>((resolve, reject) => {
          const img = new Image();
          const timeoutId = setTimeout(() => {
            reject(new Error('Timeout'));
          }, timeout);

          img.onload = () => {
            clearTimeout(timeoutId);
            const loadTime = performance.now() - startTime;
            setPreloadedResources(prev => new Set([...prev, src]));
            resolve({ success: true, loadTime });
          };

          img.onerror = () => {
            clearTimeout(timeoutId);
            reject(new Error('Failed to load image'));
          };

          // 设置优先级
          if (priority === 'high') {
            img.loading = 'eager';
          } else {
            img.loading = 'lazy';
          }

          img.src = src;
        });

        setLoadingResources(prev => {
          const newSet = new Set(prev);
          newSet.delete(src);
          return newSet;
        });

        return result;
      } catch (error) {
        if (attempt === retries) {
          setLoadingResources(prev => {
            const newSet = new Set(prev);
            newSet.delete(src);
            return newSet;
          });
          return { success: false, error: error as Error };
        }
        
        // 重试前等待
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }

    return { success: false, error: new Error('Max retries exceeded') };
  }, [preloadedResources, loadingResources]);

  // 预加载脚本
  const preloadScript = useCallback(async (
    src: string,
    options: PreloadOptions = {}
  ): Promise<PreloadResult> => {
    const { timeout = 10000 } = options;
    
    if (preloadedResources.has(src)) {
      return { success: true };
    }

    setLoadingResources(prev => new Set([...prev, src]));

    const startTime = performance.now();

    try {
      const result = await new Promise<PreloadResult>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        
        const timeoutId = setTimeout(() => {
          reject(new Error('Timeout'));
        }, timeout);

        script.onload = () => {
          clearTimeout(timeoutId);
          const loadTime = performance.now() - startTime;
          setPreloadedResources(prev => new Set([...prev, src]));
          resolve({ success: true, loadTime });
        };

        script.onerror = () => {
          clearTimeout(timeoutId);
          reject(new Error('Failed to load script'));
        };

        document.head.appendChild(script);
      });

      setLoadingResources(prev => {
        const newSet = new Set(prev);
        newSet.delete(src);
        return newSet;
      });

      return result;
    } catch (error) {
      setLoadingResources(prev => {
        const newSet = new Set(prev);
        newSet.delete(src);
        return newSet;
      });
      return { success: false, error: error as Error };
    }
  }, [preloadedResources, loadingResources]);

  // 预加载样式表
  const preloadStylesheet = useCallback(async (
    href: string,
    options: PreloadOptions = {}
  ): Promise<PreloadResult> => {
    const { timeout = 5000 } = options;
    
    if (preloadedResources.has(href)) {
      return { success: true };
    }

    setLoadingResources(prev => new Set([...prev, href]));

    const startTime = performance.now();

    try {
      const result = await new Promise<PreloadResult>((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        
        const timeoutId = setTimeout(() => {
          reject(new Error('Timeout'));
        }, timeout);

        link.onload = () => {
          clearTimeout(timeoutId);
          const loadTime = performance.now() - startTime;
          setPreloadedResources(prev => new Set([...prev, href]));
          resolve({ success: true, loadTime });
        };

        link.onerror = () => {
          clearTimeout(timeoutId);
          reject(new Error('Failed to load stylesheet'));
        };

        document.head.appendChild(link);
      });

      setLoadingResources(prev => {
        const newSet = new Set(prev);
        newSet.delete(href);
        return newSet;
      });

      return result;
    } catch (error) {
      setLoadingResources(prev => {
        const newSet = new Set(prev);
        newSet.delete(href);
        return newSet;
      });
      return { success: false, error: error as Error };
    }
  }, [preloadedResources, loadingResources]);

  // 预加载字体
  const preloadFont = useCallback(async (
    href: string,
    options: PreloadOptions = {}
  ): Promise<PreloadResult> => {
    const { timeout = 5000 } = options;
    
    if (preloadedResources.has(href)) {
      return { success: true };
    }

    setLoadingResources(prev => new Set([...prev, href]));

    const startTime = performance.now();

    try {
      const result = await new Promise<PreloadResult>((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        link.href = href;
        
        const timeoutId = setTimeout(() => {
          reject(new Error('Timeout'));
        }, timeout);

        link.onload = () => {
          clearTimeout(timeoutId);
          const loadTime = performance.now() - startTime;
          setPreloadedResources(prev => new Set([...prev, href]));
          resolve({ success: true, loadTime });
        };

        link.onerror = () => {
          clearTimeout(timeoutId);
          reject(new Error('Failed to load font'));
        };

        document.head.appendChild(link);
      });

      setLoadingResources(prev => {
        const newSet = new Set(prev);
        newSet.delete(href);
        return newSet;
      });

      return result;
    } catch (error) {
      setLoadingResources(prev => {
        const newSet = new Set(prev);
        newSet.delete(href);
        return newSet;
      });
      return { success: false, error: error as Error };
    }
  }, [preloadedResources, loadingResources]);

  // 批量预加载
  const preloadBatch = useCallback(async (
    resources: Array<{
      type: 'image' | 'script' | 'stylesheet' | 'font';
      src: string;
      options?: PreloadOptions;
    }>
  ): Promise<PreloadResult[]> => {
    const results = await Promise.allSettled(
      resources.map(async ({ type, src, options }) => {
        switch (type) {
          case 'image':
            return preloadImage(src, options);
          case 'script':
            return preloadScript(src, options);
          case 'stylesheet':
            return preloadStylesheet(src, options);
          case 'font':
            return preloadFont(src, options);
          default:
            throw new Error(`Unknown resource type: ${type}`);
        }
      })
    );

    return results.map(result => 
      result.status === 'fulfilled' 
        ? result.value 
        : { success: false, error: result.reason }
    );
  }, [preloadImage, preloadScript, preloadStylesheet, preloadFont]);

  // 智能预加载 - 基于用户行为预测
  const smartPreload = useCallback((currentPath: string) => {
    const preloadMap: Record<string, Array<{ type: 'image' | 'script' | 'stylesheet' | 'font'; src: string }>> = {
      '/': [
        { type: 'image', src: '/images/psychology-bg.jpg' },
        { type: 'image', src: '/images/astrology-bg.jpg' },
        { type: 'image', src: '/images/tarot-bg.jpg' }
      ],
      '/tests/psychology': [
        { type: 'image', src: '/images/mbti-icon.svg' },
        { type: 'image', src: '/images/eq-icon.svg' }
      ],
      '/tests/astrology': [
        { type: 'image', src: '/images/astrology-chart.jpg' },
        { type: 'image', src: '/images/zodiac-icons.svg' }
      ]
    };

    const resourcesToPreload = preloadMap[currentPath] || [];
    
    if (resourcesToPreload.length > 0) {
      preloadBatch(resourcesToPreload.map(resource => ({
        ...resource,
        options: { priority: 'low' }
      })));
    }
  }, [preloadBatch]);

  return {
    preloadImage,
    preloadScript,
    preloadStylesheet,
    preloadFont,
    preloadBatch,
    smartPreload,
    preloadedResources,
    loadingResources
  };
}
