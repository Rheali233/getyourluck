/**
 * 博客推荐组件
 * 展示热门文章和最新内容
 */

import React from 'react';
import { Link } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
import { cn } from '@/utils/classNames';
import { useLanguage } from '@/contexts/LanguageContext';

export interface BlogArticle {
  id: string;
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
  showFeatured?: boolean;
  onArticleClick?: (article: BlogArticle) => void;
}

export const BlogRecommendations: React.FC<BlogRecommendationsProps> = ({
  className,
  testId = 'blog-recommendations',
  articles = [],
  title,
  subtitle,
  showFeatured = true,
  onArticleClick,
  ...props
}) => {
  const { t } = useLanguage();
  
  // 使用语言上下文的标题和副标题
  const displayTitle = title || t('blog.title');
  const displaySubtitle = subtitle || t('blog.subtitle');

  // 默认博客文章数据
  const defaultArticles: BlogArticle[] = [
    {
      id: 'mbti-guide',
      title: 'MBTI性格测试完全指南：16种性格类型详解',
      excerpt: '深入了解MBTI性格测试的科学原理，探索16种性格类型的特点，帮助你更好地认识自己和他人...',
      coverImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1CVEkgR3VpZGU8L3RleHQ+PC9zdmc+',
      category: '心理学',
      readTime: '8分钟',
      publishDate: '2024-01-15',
      author: '心理学专家',
      readCount: 12500,
      tags: ['MBTI', '性格测试', '心理学'],
    },
    {
      id: 'career-planning',
      title: '如何通过职业测试找到最适合的工作？',
      excerpt: '职业规划测试不仅能帮你了解自己的职业倾向，还能为你的职业发展提供科学指导...',
      coverImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhcmVlciBQbGFubmluZzwvdGV4dD48L3N2Zz4=',
      category: '职业发展',
      readTime: '6分钟',
      publishDate: '2024-01-12',
      author: '职业规划师',
      readCount: 8900,
      tags: ['职业规划', '职业测试', '个人发展'],
    },
    {
      id: 'relationship-communication',
      title: '改善人际关系的5个心理学技巧',
      excerpt: '人际关系是人生的重要组成部分，掌握这些心理学技巧，让你的社交更加顺畅...',
      coverImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlJlbGF0aW9uc2hpcDwvdGV4dD48L3N2Zz4=',
      category: '人际关系',
      readTime: '10分钟',
      publishDate: '2024-01-10',
      author: '心理咨询师',
      readCount: 15600,
      tags: ['人际关系', '沟通技巧', '心理学'],
    },
    {
      id: 'stress-management',
      title: '现代人压力管理：从心理学角度解读',
      excerpt: '在快节奏的现代生活中，压力管理变得越来越重要。了解压力的心理学机制...',
      coverImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlN0cmVzcyBNYW5hZ2VtZW50PC90ZXh0Pjwvc3ZnPg==',
      category: '心理健康',
      readTime: '7分钟',
      publishDate: '2024-01-08',
      author: '心理健康专家',
      readCount: 11200,
      tags: ['压力管理', '心理健康', '心理学'],
    },
  ];

  // 按日期排序，新到旧
  const sortedArticles = articles.length > 0 ? articles : defaultArticles;
  const blogArticles = sortedArticles.sort((a, b) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  return (
    <section
      className={cn("blog-recommendations py-16 bg-gray-50", className)}
      data-testid={testId}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="text-left mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {displayTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            {displaySubtitle}
          </p>
        </div>

        {/* 博客文章内容 */}
        {blogArticles.length > 0 ? (
          <>
            {/* 特色文章 */}
            {showFeatured && (
              <div className="mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {blogArticles.slice(0, 2).map((article) => (
                    <article
                      key={article.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                      onClick={() => onArticleClick?.(article)}
                    >
                      <div className="aspect-video bg-gray-200 overflow-hidden">
                        <img
                          src={article.coverImage}
                          alt={article.title}
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
                            {article.category}
                          </span>
                          <span className="text-sm text-gray-500">{article.readTime}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{article.author}</span>
                          <span>{article.readCount.toLocaleString()} 阅读</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* 文章列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogArticles.slice(2).map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  onClick={() => onArticleClick?.(article)}
                >
                  <div className="aspect-square bg-gray-200 overflow-hidden">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500">{article.readTime}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{article.author}</span>
                      <span>{article.readCount.toLocaleString()} 阅读</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* 查看更多按钮 */}
            <div className="text-center mt-12">
              <Link
                to="/blog"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200"
              >
                查看更多文章
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无博客文章</h3>
            <p className="text-gray-600">我们正在准备精彩的内容，敬请期待！</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogRecommendations;
