/**
 * 博客推荐组件
 * 展示热门文章和最新内容 - 左右滑动轮播
 */

import React, { useState, useRef, useEffect } from 'react';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { useNavigate } from 'react-router-dom';
import { blogService } from '@/services/blogService';


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
  subtitle?: string;
  onArticleClick?: (article: BlogArticle) => void; // eslint-disable-line no-unused-vars
}

export const BlogRecommendations: React.FC<BlogRecommendationsProps> = ({
  className,
  testId = 'blog-recommendations',
  articles,
  title,
  subtitle,
  onArticleClick,
  ...props
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 当未传入 articles 时，从 blog 模块实时拉取
  const [loadedArticles, setLoadedArticles] = useState<BlogArticle[]>(articles || []);

  useEffect(() => {
    if (articles && articles.length > 0) {
      setLoadedArticles(articles);
      return;
    }
    
    // 延迟加载，避免阻塞首屏
    const timer = setTimeout(async () => {
      try {
        const resp = await blogService.getArticles(1, 6);
        const list = (resp as any).data || [];
        const mapped: BlogArticle[] = list.map((a: any) => ({
          id: a.id,
          slug: a.slug || a.id,
          title: a.title,
          excerpt: a.excerpt || '',
          coverImage: a.coverImage || '',
          category: a.category || 'Blog',
          readTime: a.readTime || '',
          publishDate: a.publishedAt || a.publishDate || '',
          author: a.author || '',
          readCount: a.readCount || 0,
          tags: a.tags || [],
        }));
        setLoadedArticles(mapped);
      } catch (error) {
        console.warn('Failed to load blog articles, using fallback:', error);
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

  // Title and subtitle configuration
  const displayTitle = title || 'Latest Insights & Articles';
  const displaySubtitle = subtitle || 'Discover valuable insights about psychology, career, and personal development';

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
      className={cn("blog-recommendations py-16 relative overflow-hidden", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title section */}
        <div className="text-left mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {displayTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            {displaySubtitle}
          </p>
        </div>

        {/* 博客文章轮播 */}
        {blogArticles.length > 0 ? (
          <>
          <div className="relative">
            {/* 轮播容器 */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {blogArticles.map((a) => (
                <article
                  key={a.id}
                  className="flex-shrink-0 w-80 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer"
                  onClick={() => {
                    if (onArticleClick) {
                      onArticleClick(a);
                    }
                    // 无论是否有回调函数，都要进行导航
                    if (a.slug) {
                      navigate(`/blog/${a.slug}`);
                    }
                  }}
                >
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={a.coverImage}
                      alt={a.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                        {a.category}
                      </span>
                      <span className="text-xs text-gray-500">{a.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {a.title}
                    </h3>
                    <p className="text-gray-600 mb-3 text-xs line-clamp-3">
                      {a.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{a.author}</span>
                      <span>{a.readCount.toLocaleString()} reads</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

          </div>
          <div className="mt-10 text-center">
            <button
              type="button"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition"
              onClick={() => navigate('/blog/')}
            >
              View more articles
            </button>
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
