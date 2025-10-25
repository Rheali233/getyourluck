/**
 * 博客推荐组件
 * 展示热门文章和最新内容 - 左右滑动轮播
 */

import React, { useState, useRef, useEffect } from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { useNavigate } from 'react-router-dom';
import { blogService } from '@/services/blogService';
import { getCdnBaseUrl } from '@/config/environment';


export interface BlogArticle {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  readTime: string;
  publishDate: string;
  author: string;
  readCount: number;
  tags: string[];
}

export interface BlogRecommendationsProps extends BaseComponentProps {
  articles?: BlogArticle[];
  title?: string;
  onArticleClick?: (article: BlogArticle) => void; // eslint-disable-line no-unused-vars
}

export const BlogRecommendations: React.FC<BlogRecommendationsProps> = ({
  className,
  testId = 'blog-recommendations',
  articles,
  title,
  onArticleClick,
  ...props
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  // 🔥 修复：处理图片URL，为相对路径添加CDN前缀
  const processImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl; // 外部链接直接返回
    if (imageUrl.startsWith('/')) {
      return `${getCdnBaseUrl()}${imageUrl}`;
    }
    return imageUrl;
  };

  // 当未传入 articles 时，从 blog 模块实时拉取
  const [loadedArticles, setLoadedArticles] = useState<BlogArticle[]>(articles || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 标记已挂载，用于触发进入动画
    setMounted(true);

    if (articles && articles.length > 0) {
      setLoadedArticles(articles);
      return;
    }
    
    // 检查缓存
    const cacheKey = 'blog_recommendations_homepage';
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
    
    // 如果缓存存在且未过期（15分钟内）
    if (cachedData && cacheTimestamp) {
      const now = Date.now();
      const cacheTime = parseInt(cacheTimestamp);
      const isExpired = (now - cacheTime) > 900000; // 15分钟
      
      if (!isExpired) {
        const cached = JSON.parse(cachedData);
        setLoadedArticles(cached);
        return;
      }
    }
    
    // 延迟加载，避免阻塞首屏
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const resp = await blogService.getArticles(1, 6);
        const list = (resp as any).data || [];
        const mapped: BlogArticle[] = list.map((a: any) => ({
          id: a.id,
          slug: a.slug || a.id,
          title: a.title,
          excerpt: a.excerpt || '',
          coverImage: a.coverImage ? (a.coverImage.startsWith('http') ? a.coverImage : a.coverImage) : 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&h=200&q=80',
          category: a.category || 'Blog',
          readTime: a.readTime || '5 min read', // 默认阅读时间
          publishDate: a.publishedAt || a.publishDate || a.createdAt || '',
          author: a.author || 'SelfAtlas Team',
          readCount: a.readCount || a.viewCount || 0,
          tags: a.tags || [],
        }));
        
        // 缓存数据
        localStorage.setItem(cacheKey, JSON.stringify(mapped));
        localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
        
        setLoadedArticles(mapped);
        setIsLoading(false);
      } catch (error) {
        // Error handling for production
        setError('Failed to load blog articles');
        setIsLoading(false);
        
        // Failed to load blog articles, using fallback
        // 使用默认文章作为降级方案
        setLoadedArticles([
          {
            id: '1',
            slug: 'welcome-to-our-platform',
            title: 'Welcome to Our Testing Platform',
            excerpt: 'Discover the power of self-discovery through our comprehensive testing platform.',
            coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&h=200&q=80',
            category: 'Platform',
            readTime: '2 min read',
            publishDate: new Date().toISOString(),
            author: 'Platform Team',
            readCount: 0,
            tags: ['welcome', 'platform'],
          }
        ]);
      }
    }, 1000); // 延迟1秒加载

    return () => clearTimeout(timer);
  }, [articles]);

  // Title configuration
  const displayTitle = title || 'Blog Recommendations';

  // 默认兜底数据
  const defaultArticles: BlogArticle[] = [
    {
      id: 'mbti-guide',
      title: 'Complete Guide to MBTI Personality Test: 16 Personality Types Explained',
      excerpt: 'Deep dive into the scientific principles of MBTI personality test, explore the characteristics of 16 personality types, helping you better understand yourself and others...',
      coverImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1CVEkgR3VpZGU8L3RleHQ+PC9zdmc+',
      category: 'Psychology',
      readTime: '8 min',
      publishDate: '2024-01-15',
      author: 'Psychology Expert',
      readCount: 12500,
      tags: ['MBTI', 'Personality Test', 'Psychology'],
    },
    {
      id: 'career-planning',
      title: 'How to Find Your Perfect Job Through Career Tests?',
      excerpt: 'Career planning tests not only help you understand your career inclinations but also provide scientific guidance for your career development...',
      coverImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhcmVlciBQbGFubmluZzwvdGV4dD48L3N2Zz4=',
      category: 'Career Development',
      readTime: '6 min',
      publishDate: '2024-01-12',
      author: 'Career Counselor',
      readCount: 8900,
      tags: ['Career Planning', 'Career Test', 'Personal Development'],
    },
    {
      id: 'relationship-communication',
      title: '5 Psychology Tips to Improve Interpersonal Relationships',
      excerpt: 'Interpersonal relationships are an important part of life. Master these psychology techniques to make your social interactions smoother...',
      coverImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlJlbGF0aW9uc2hpcDwvdGV4dD48L3N2Zz4=',
      category: 'Interpersonal',
      readTime: '10 min',
      publishDate: '2024-01-10',
      author: 'Counseling Psychologist',
      readCount: 15600,
      tags: ['Interpersonal', 'Communication Skills', 'Psychology'],
    },
    {
      id: 'stress-management',
      title: 'Modern Stress Management: A Psychological Perspective',
      excerpt: 'In the fast-paced modern life, stress management is becoming increasingly important. Understand the psychological mechanisms of stress...',
      coverImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlN0cmVzcyBNYW5hZ2VtZW50PC90ZXh0Pjwvc3ZnPg==',
      category: 'Mental Health',
      readTime: '7 min',
      publishDate: '2024-01-08',
      author: 'Mental Health Expert',
      readCount: 11200,
      tags: ['Stress Management', 'Mental Health', 'Psychology'],
    },
  ];

  // 按日期排序，新到旧
  const baseArticles = loadedArticles.length > 0 ? loadedArticles : defaultArticles;
  const blogArticles = baseArticles.sort((a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  // 轮播控制函数
  // 简化：暂不渲染左右按钮，仅依赖容器自然滚动

  // 预留轮播控制（当前未显示箭头按钮）

  return (
    <section
      className={cn("blog-recommendations py-12 relative overflow-hidden", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title section with action on the right */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {displayTitle}
          </h2>
        </div>

        {/* 加载状态 */}
        {isLoading ? (
          <div className="flex gap-6 overflow-x-auto">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-80 h-72 rounded-xl bg-gray-200 animate-pulse"
                style={{ animationDelay: `${idx * 100}ms` }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">⚠️ {error}</div>
            <button
              onClick={() => {
                setError(null);
                // 重新触发加载
                const cacheKey = 'blog_recommendations_homepage';
                localStorage.removeItem(cacheKey);
                localStorage.removeItem(`${cacheKey}_timestamp`);
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : blogArticles.length > 0 ? (
          <>
          <div className="relative">
            {/* 轮播容器 */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {blogArticles.map((a, idx) => (
                <article
                  key={a.id}
                  className={
                    "group relative flex-shrink-0 w-80 h-72 rounded-xl overflow-hidden shadow-sm transition duration-300 ease-out will-change-transform cursor-pointer " +
                    (mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")
                  }
                  style={{ transitionDelay: `${Math.min(idx * 80, 240)}ms` }}
                  onClick={() => {
                    if (onArticleClick) {
                      onArticleClick(a);
                    }
                    if (a.slug) {
                      navigate(`/blog/${a.slug}`);
                    }
                  }}
                >
                  {/* 背景大图填满 */}
                  <div className="absolute inset-0">
                    <img
                      src={processImageUrl(a.coverImage)}
                      alt={a.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // 🔥 修复：错误时先尝试原始路径，再使用fallback
                        if (!target.src.includes('unsplash.com')) {
                          target.src = a.coverImage.startsWith('/') 
                            ? `${window.location.origin}${a.coverImage}`
                            : 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&h=200&q=80';
                        } else {
                          target.src = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&h=200&q=80';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
                  </div>

                  {/* 文字半透明覆盖层（等宽并贴底） */}
                  <div className="absolute inset-x-0 bottom-0">
                    <div className="bg-black/55 backdrop-blur-sm px-4 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 text-[11px] font-medium bg-white/20 text-white rounded-full">
                          {a.category}
                        </span>
                        <span className="text-[11px] text-white/80">{a.readTime}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-1 line-clamp-2">
                        {a.title}
                      </h3>
                      <p className="text-white/85 text-[12px] line-clamp-2 leading-snug">
                        {a.excerpt}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

          </div>
          
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Blog Articles Available</h3>
            <p className="text-gray-600">We are preparing exciting content, stay tuned!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogRecommendations;
