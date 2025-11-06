/**
 * 博客页面路由组件
 * 遵循统一开发标准的页面组件规范
 */

import React from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
import { Card, ArticleCard, ArticleMeta, LoadingSpinner, ArticleContent, Select, Input, ArticleCardSkeleton, Navigation, Breadcrumb, Pagination } from '@/components/ui';
import { OptimizedImage } from '@/modules/homepage/components/OptimizedImage';
import { UI_TEXT } from '@/shared/configs/UI_TEXT';
import { useBlogStore } from '@/stores/blogStore';
import { SEOManager } from '@/modules/homepage/components/SEOManager';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { Link } from 'react-router-dom';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';
import { UserBehaviorTracker } from '@/modules/homepage/components/UserBehaviorTracker';
import { cn } from '@/utils/classNames';
import type { BlogArticleSummary } from '@/services/blogService';
import { buildAbsoluteUrl } from '@/config/seo';

interface BlogPageProps extends BaseComponentProps {}

const formatPublishDate = (value?: string): string | undefined => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const formatWordCount = (value?: number): string | undefined => {
  if (typeof value !== 'number' || Number.isNaN(value)) return undefined;
  return `${value.toLocaleString()} words`;
};

export const BlogPage: React.FC<BlogPageProps> = ({
  className,
  testId = 'blog-page',
  ...props
}) => {
  return (
    <div 
      className={className}
      data-testid={testId}
      {...props}
    >
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/page/:page" element={<BlogList />} />
        <Route path="/category/:category/page/:page" element={<BlogList />} />
        <Route path="/tag/:tag/page/:page" element={<BlogList />} />
        <Route path="/search/:keyword/page/:page" element={<BlogList />} />
        {/* slug 访问 */}
        <Route path="/:slug" element={<BlogArticle />} />
      </Routes>
    </div>
  );
};

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const pageParam = Number(params['page'] || 1);
  const category = params['category'] as string | undefined;
  const tag = params['tag'] as string | undefined;
  const keyword = params['keyword'] as string | undefined;
  const { isLoading, error, articles, pagination, fetchArticles } = useBlogStore();

  // suggestions state & debounce
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [typing, setTyping] = React.useState<string>(keyword || '');
  const debounceRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setTyping(keyword || '');
  }, [keyword]);

  const fetchSuggestions = React.useCallback((q: string) => {
    if (!q) { setSuggestions([]); return; }
    import('@/services/apiClient').then(({ apiClient }) =>
      apiClient.get(`/search/suggestions?q=${encodeURIComponent(q)}&lang=en-US&limit=8`)
    ).then((resp: any) => {
      if (resp?.success && Array.isArray(resp.data)) {
        setSuggestions(resp.data.map((s: any) => s.suggestion || s.keyword || ''));
      } else {
        setSuggestions([]);
      }
    }).catch(() => setSuggestions([]));
  }, []);

  const onTypingChange = (v: string) => {
    setTyping(v);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    const trimmed = v.trim();
    // 当用户清空搜索框时，自动返回到列表页（保留当前分类上下文）
    if (trimmed.length === 0) {
      setSuggestions([]);
      if (category) {
      navigate(`/blog/category/${encodeURIComponent(category)}/page/1`);
    } else if (tag) {
      navigate(`/blog/tag/${encodeURIComponent(tag)}/page/1`);
      } else {
        navigate('/blog/');
      }
      return;
    }
    debounceRef.current = window.setTimeout(() => fetchSuggestions(trimmed), 250);
  };

  React.useEffect(() => {
    // 记录博客列表页面访问事件
    const base = buildBaseContext();
    trackEvent({
      eventType: 'page_view',
      ...base,
      data: { 
        route: '/blog', 
        pageType: 'blog',
        category: category || undefined,
        tag: tag || undefined,
        keyword: keyword || undefined
      },
    });
    
    if (keyword && keyword.trim().length > 0) {
      (async () => {
        const resp = await import('@/services/blogService').then(m => m.blogService.searchArticles(keyword, 30));
        if (resp.success && resp.data && Array.isArray(resp.data.results)) {
          (useBlogStore.getState() as any).setData(resp.data.results);
          (useBlogStore.setState as any)({ articles: resp.data.results, pagination: { page: 1, limit: 30, total: resp.data.results.length, totalPages: 1, hasNext: false, hasPrev: false } });
        }
      })();
    } else {
      fetchArticles(pageParam, category, tag);
    }
  }, [pageParam, category, keyword, tag, fetchArticles]);

  const canonical = React.useMemo(() => {
    if (category) return buildAbsoluteUrl(`/blog/category/${encodeURIComponent(category)}/page/${pageParam}`);
    if (tag) return buildAbsoluteUrl(`/blog/tag/${encodeURIComponent(tag)}/page/${pageParam}`);
    if (keyword) return buildAbsoluteUrl(`/blog/search/${encodeURIComponent(keyword)}/page/${pageParam}`);
    if (pageParam && pageParam > 1) return buildAbsoluteUrl(`/blog/page/${pageParam}`);
    return buildAbsoluteUrl('/blog/');
  }, [pageParam, category, tag, keyword]);

  const links = React.useMemo(() => {
    const defs: Array<{ rel: string; href: string }> = [];
    const makeHref = (p: number) => {
      if (category) return buildAbsoluteUrl(`/blog/category/${encodeURIComponent(category)}/page/${p}`);
      if (tag) return buildAbsoluteUrl(`/blog/tag/${encodeURIComponent(tag)}/page/${p}`);
      if (keyword) return buildAbsoluteUrl(`/blog/search/${encodeURIComponent(keyword)}/page/${p}`);
      if (p === 1) return buildAbsoluteUrl('/blog/');
      return buildAbsoluteUrl(`/blog/page/${p}`);
    };
    if (pagination.hasPrev) defs.push({ rel: 'prev', href: makeHref(pagination.page - 1) });
    if (pagination.hasNext) defs.push({ rel: 'next', href: makeHref(pagination.page + 1) });
    return defs;
  }, [pagination, category, tag, keyword]);

  const makeListHref = React.useCallback((p: number) => {
    if (category) return `/blog/category/${encodeURIComponent(category)}/page/${p}`;
    if (tag) return `/blog/tag/${encodeURIComponent(tag)}/page/${p}`;
    if (keyword) return `/blog/search/${encodeURIComponent(keyword)}/page/${p}`;
    if (p === 1) return '/blog/';
    return `/blog/page/${p}`;
  }, [category, tag, keyword]);

  const structuredData = React.useMemo(() => {
    // 有搜索时：注入 SearchAction
    if (keyword && keyword.trim().length > 0) {
      const target = buildAbsoluteUrl('/blog/search/{search_term_string}/page/1');
      return [{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: buildAbsoluteUrl('/blog/'),
        potentialAction: {
          '@type': 'SearchAction',
          target,
          'query-input': 'required name=search_term_string'
        }
      }];
    }
    // 无搜索时：注入 CollectionPage + ItemList（基于当前页文章）
    if (Array.isArray(articles) && articles.length > 0) {
      return [{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Blog Articles',
        description: UI_TEXT.blog.list.subtitle,
        url: buildAbsoluteUrl('/blog/'),
        hasPart: {
          '@type': 'ItemList',
          itemListElement: articles.map((a: any, idx: number) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: a.title,
            url: buildAbsoluteUrl(`/blog/${a.slug}`)
          }))
        }
      }];
    }
    return [] as any[];
  }, [keyword, articles]);

  const metaTitle = React.useMemo(() => {
    const base = `${UI_TEXT.blog.list.title} | SelfAtlas`;
    return pageParam > 1 ? `${base} - Page ${pageParam}` : base;
  }, [pageParam]);

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-300 to-indigo-400"></div>
      <div className="relative z-10">
        <Navigation />
        {/* 用户行为数据收集 */}
        <UserBehaviorTracker 
          pageType="blog"
          autoTrack={true}
        />
      <SEOManager
        pageType="blog"
        metadata={{
          title: metaTitle,
          description: UI_TEXT.blog.list.subtitle,
          canonicalUrl: canonical,
          ogTitle: metaTitle,
          ogDescription: UI_TEXT.blog.list.subtitle,
          twitterTitle: metaTitle,
          twitterDescription: UI_TEXT.blog.list.subtitle,
        }}
        links={links}
        structuredData={structuredData as any}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
        {/* 面包屑导航 */}
        <Breadcrumb items={getBreadcrumbConfig('/blog')} />
        
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {UI_TEXT.blog.list.title}
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">{UI_TEXT.blog.list.subtitle}</p>
        </div>

        {/* Category filter bar + Search */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">{UI_TEXT.blog.common.categories}</label>
            <Select
              value={category || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const value = e.target.value;
                if (!value) {
                  navigate('/blog/');
                } else {
                  navigate(`/blog/category/${encodeURIComponent(value)}/page/1`);
                }
              }}
              options={(() => {
                const dynamic = Array.from(new Set((articles || []).map((a: any) => a.category).filter(Boolean)));
                const list = dynamic.length > 0 ? dynamic : [];
                return [{ label: UI_TEXT.blog.list.categoryAll, value: '' }, ...list.map((c: string) => ({ label: c, value: c }))];
              })()}
            />
          </div>
          <div className="relative flex items-center gap-3 w-full sm:w-80">
            <Input
              placeholder={UI_TEXT.blog.list.searchPlaceholder}
              value={typing}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTypingChange(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                const target = e.target as HTMLInputElement;
                if (e.key === 'Enter') {
                  const q = target.value.trim();
                  if (q) navigate(`/blog/search/${encodeURIComponent(q)}/page/1`);
                }
              }}
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-20">
                <ul className="max-h-64 overflow-auto">
                  {suggestions.map((sug, idx) => (
                    <li key={`${sug}-${idx}`}>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        onClick={() => navigate(`/blog/search/${encodeURIComponent(sug)}/page/1`)}
                      >
                        {sug}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{UI_TEXT.blog.list.errorTitle}</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button onClick={() => fetchArticles(pagination.page, category, tag)} className="btn-primary">{UI_TEXT.blog.list.retry}</button>
          </div>
        ) : (
          <>
            {articles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{UI_TEXT.blog.list.emptyTitle}</h3>
                <p className="text-gray-600">{UI_TEXT.blog.list.emptyDesc}</p>
              </div>
            ) : (
              <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((a: any) => (
                  <ArticleCard
                    key={a['id']}
                    id={a['id']}
                    title={a.title}
                    excerpt={a.excerpt}
                    coverImage={a.coverImage}
                    category={a.category}
                    readTime={a.readTime}
                    author={a.author}
                    readCount={a.readCount}
                      publishDate={a.publishDate}
                      tags={a.tags}
                      wordCount={a.wordCount}
                      isFeatured={a.isFeatured}
                      onClick={() => navigate(`/blog/${a.slug}`)}
                      onCategoryClick={a.category ? () => navigate(`/blog/category/${encodeURIComponent(a.category)}/page/1`) : undefined}
                      onTagClick={(tagValue) => navigate(`/blog/tag/${encodeURIComponent(tagValue)}/page/1`)}
                      ctaLabel={UI_TEXT.blog.card.readMore}
                  />
                ))}
              </div>
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  makeHref={makeListHref}
                  onNavigate={(nextPage) => navigate(makeListHref(nextPage))}
                  prevLabel={UI_TEXT.blog.list.paginationPrev}
                  nextLabel={UI_TEXT.blog.list.paginationNext}
                  className="mt-10"
                />
              </>
            )}

          </>
        )}
      </div>
      </div>
      {/* 底部空白区域 */}
      <div className="h-16"></div>
    </div>
  );
};

const BlogArticle: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { isLoading, error, currentArticle, fetchArticle } = useBlogStore();
  type HeadingItem = { id: string; text: string; level: number };
  const [headings, setHeadings] = React.useState<HeadingItem[]>([]);
  const [readingProgress, setReadingProgress] = React.useState(0);
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const articleRef = React.useRef<HTMLDivElement | null>(null);

  const handleHeadingsChange = React.useCallback((items: HeadingItem[]) => {
    setHeadings(items);
  }, []);

  const scrollToHeading = React.useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const offset = 96;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  }, []);

  const handleBackToTop = React.useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCategoryNavigate = React.useCallback((categoryValue: string) => {
    navigate(`/blog/category/${encodeURIComponent(categoryValue)}/page/1`);
  }, [navigate]);

  const handleTagNavigate = React.useCallback((tagValue: string) => {
    navigate(`/blog/tag/${encodeURIComponent(tagValue)}/page/1`);
  }, [navigate]);

  const handleBackToBlogNavigate = React.useCallback(() => {
    navigate('/blog/');
  }, [navigate]);

  React.useEffect(() => {
    const handleScroll = () => {
      const container = articleRef.current;
      if (!container) return;

      const viewportHeight = window.innerHeight || 1;
      const contentHeight = container.offsetHeight;
      const contentTop = container.getBoundingClientRect().top + window.scrollY;
      const currentScroll = window.scrollY;
      const totalScrollable = Math.max(contentHeight - viewportHeight, 1);

      let progress = 0;
      if (currentScroll > contentTop) {
        progress = Math.min((currentScroll - contentTop) / totalScrollable, 1);
      }

      setReadingProgress(progress);
      setShowBackToTop(currentScroll > contentTop + 320);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const formattedPublishDate = React.useMemo(() => formatPublishDate(currentArticle?.publishDate), [currentArticle?.publishDate]);
  const wordCountLabel = React.useMemo(() => formatWordCount(currentArticle?.wordCount), [currentArticle?.wordCount]);
  const tagList = React.useMemo(() => {
    if (!currentArticle || !Array.isArray(currentArticle.tags)) return [] as string[];
    return currentArticle.tags.filter((tagItem): tagItem is string => Boolean(tagItem));
  }, [currentArticle]);
  const hasHeadings = headings.length > 0;
  const hasTags = tagList.length > 0;
  const relatedArticles = React.useMemo(() => {
    if (!currentArticle || !Array.isArray(currentArticle.relatedArticles)) {
      return [] as Array<Pick<BlogArticleSummary, 'id' | 'slug' | 'title'>>;
    }
    return currentArticle.relatedArticles.filter(
      (item): item is Pick<BlogArticleSummary, 'id' | 'slug' | 'title'> => Boolean(item)
    );
  }, [currentArticle]);
  const hasRelated = relatedArticles.length > 0;
  const progressPercentage = Math.min(100, Math.max(0, Math.round(readingProgress * 100)));

  React.useEffect(() => {
    const slug = params['slug'] as string | undefined;
    if (slug) {
      fetchArticle(slug);
      // 记录博客文章页面访问事件
      const base = buildBaseContext();
      trackEvent({
        eventType: 'page_view',
        ...base,
        data: { 
          route: `/blog/${slug}`, 
          pageType: 'blog_article',
          articleSlug: slug
        },
      });
    }
  }, [params['slug']]);

  // Increase view count after article is loaded (use slug endpoint)
  React.useEffect(() => {
    if (currentArticle && currentArticle.slug) {
      // 记录文章访问事件
      const base = buildBaseContext();
      trackEvent({
        eventType: 'article_view',
        ...base,
        data: { 
          articleSlug: currentArticle.slug,
          articleTitle: currentArticle.title
        },
      });
      
      // 增加阅读次数
      const updateViewCount = async () => {
        try {
          const { blogService } = await import('@/services/blogService');
          await blogService.incrementViewCountBySlug(currentArticle.slug as string);
          // 注意：不在这里重新获取文章数据，避免无限循环
          // 浏览量会在下次访问时正确显示
        } catch (error) {
          // Error logging would be implemented here
        }
      };
      
      updateViewCount();
    }
  }, [currentArticle?.slug]); // 只依赖 slug，避免无限循环

  const canonical = React.useMemo(() => {
    const slug = (params['slug'] as string | undefined) || (currentArticle?.slug as string | undefined);
    return slug ? buildAbsoluteUrl(`/blog/${slug}`) : buildAbsoluteUrl('/blog/');
  }, [params['slug'], currentArticle?.slug]);

  // JSON-LD 结构化数据
  const structuredData = React.useMemo(() => {
    if (!currentArticle) return [] as any[];
    const articleLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: currentArticle.title,
      description: currentArticle.excerpt,
      image: currentArticle.ogImage || currentArticle.coverImage || '',
      author: { '@type': 'Person', name: currentArticle.author || 'Author' },
      datePublished: currentArticle.publishDate,
      dateModified: currentArticle.updatedAt || currentArticle.publishDate,
      mainEntityOfPage: canonical,
      wordCount: currentArticle.wordCount || undefined,
    };
    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: buildAbsoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: buildAbsoluteUrl('/blog/') },
        currentArticle.category ? { '@type': 'ListItem', position: 3, name: currentArticle.category, item: buildAbsoluteUrl(`/blog/category/${currentArticle.category}`) } : undefined,
        { '@type': 'ListItem', position: currentArticle.category ? 4 : 3, name: currentArticle.title, item: canonical },
      ].filter(Boolean),
    } as any;
    return [articleLd, breadcrumbLd];
  }, [currentArticle, canonical]);

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-300 to-indigo-400"></div>
      <div className="relative z-10">
        {/* 用户行为数据收集 */}
        <UserBehaviorTracker 
          pageType="blog"
          autoTrack={true}
        />
      <SEOManager
        pageType="blog"
        metadata={{
          title: currentArticle?.metaTitle || currentArticle?.title || UI_TEXT.blog.detail.titleFallback,
          description: currentArticle?.metaDescription || currentArticle?.excerpt || UI_TEXT.blog.detail.notFoundDesc,
          canonicalUrl: canonical,
          ogTitle: (currentArticle?.ogTitle || currentArticle?.title || UI_TEXT.blog.detail.titleFallback) as string,
          ogDescription: (currentArticle?.ogDescription || currentArticle?.excerpt || UI_TEXT.blog.detail.notFoundDesc) as string,
          ogImage: (currentArticle?.ogImage || currentArticle?.coverImage || '') as string,
          twitterTitle: (currentArticle?.ogTitle || currentArticle?.title || UI_TEXT.blog.detail.titleFallback) as string,
          twitterDescription: (currentArticle?.ogDescription || currentArticle?.excerpt || UI_TEXT.blog.detail.notFoundDesc) as string,
          twitterImage: (currentArticle?.ogImage || currentArticle?.coverImage || '') as string,
        }}
        robots={error ? 'noindex,nofollow' : 'index,follow'}
        structuredData={structuredData as any}
      />
      <div className="fixed top-0 left-0 right-0 z-40">
        <div className="h-1 bg-white/20">
          <div
            className="h-full bg-primary-600 transition-[width] duration-200"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-label={UI_TEXT.blog.detail.readingProgress}
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 pb-24 pt-16">
        {isLoading ? (
          <div className="flex justify-center py-16"><LoadingSpinner /></div>
        ) : error ? (
          <Card title={UI_TEXT.blog.detail.notFoundTitle} description={UI_TEXT.blog.detail.notFoundDesc}>
            <div className="mt-6 text-center">
              <button className="btn-primary" onClick={() => navigate('/blog')}>{UI_TEXT.blog.detail.backToList}</button>
            </div>
          </Card>
        ) : currentArticle ? (
          <>
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
              <div ref={articleRef}>
                <nav className="mb-3 text-sm text-gray-600" aria-label="Breadcrumb">
              <ol className="flex items-center gap-1">
                <li><Link className="hover:underline" to="/">Home</Link></li>
                <li>/</li>
                <li><Link className="hover:underline" to="/blog/">Blog</Link></li>
                    {currentArticle.category && (
                      <>
                  <li>/</li>
                        <li>
                          <Link
                            className="hover:underline"
                            to={`/blog/category/${encodeURIComponent(currentArticle.category)}/page/1`}
                          >
                            {currentArticle.category}
                          </Link>
                        </li>
                      </>
                    )}
              </ol>
            </nav>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {currentArticle.title || UI_TEXT.blog.detail.titleFallback}
            </h1>
            <ArticleMeta
              author={currentArticle.author || ''}
                  publishDate={formattedPublishDate}
                  readTime={currentArticle.readTime || undefined}
              views={currentArticle.readCount ?? 0}
                  className="mt-4"
                />
                {(wordCountLabel || currentArticle.category) && (
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    {wordCountLabel ? <span>{wordCountLabel}</span> : null}
                    {currentArticle.category ? (
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 hover:bg-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                        onClick={() => handleCategoryNavigate(currentArticle.category as string)}
                      >
                        {currentArticle.category}
                      </button>
                    ) : null}
                  </div>
                )}
                {hasTags ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tagList.map((tagValue) => (
                      <button
                        key={tagValue}
                        type="button"
                        className="inline-flex items-center rounded-full bg-gray-900/5 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                        onClick={() => handleTagNavigate(tagValue)}
                      >
                        #{tagValue}
                      </button>
                    ))}
                  </div>
                ) : null}
            {currentArticle.coverImage || currentArticle.ogImage ? (
              <>
                <link rel="preload" as="image" href={(currentArticle.coverImage || currentArticle.ogImage) as string} />
                    <div className="mt-6 aspect-video overflow-hidden rounded-xl bg-gray-100">
                  <OptimizedImage
                    src={(currentArticle.coverImage || currentArticle.ogImage) as string}
                    alt={currentArticle.title}
                    width={1280}
                    height={720}
                    priority
                    responsive
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover"
                    fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y3ZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=="
                  />
                </div>
              </>
            ) : null}
                {hasHeadings ? (
                  <div className="mt-10 lg:hidden">
                    <details className="rounded-xl border border-white/60 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
                      <summary className="cursor-pointer text-sm font-semibold text-gray-700">
                        {UI_TEXT.blog.detail.tocTitle}
                      </summary>
                      <ul className="mt-4 space-y-2 text-sm text-gray-700">
                        {headings.map((heading) => (
                          <li key={heading.id}>
                            <button
                              type="button"
                              onClick={() => scrollToHeading(heading.id)}
                              className={cn(
                                'w-full text-left transition hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                                heading.level === 3 ? 'pl-4 text-gray-600' : ''
                              )}
                            >
                              {heading.text}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                ) : null}
            {(currentArticle as any).contentHtml ? (
                  <ArticleContent html={(currentArticle as any).contentHtml} className="mt-8" onHeadingsChange={handleHeadingsChange} />
            ) : currentArticle.content ? (
                  <ArticleContent html={currentArticle.content} className="mt-8" onHeadingsChange={handleHeadingsChange} />
            ) : (
                  <div className="mt-8 rounded-xl border border-white/60 bg-white/80 p-6 text-gray-600">
                    {UI_TEXT.blog.detail.notFoundDesc}
                  </div>
                )}
              </div>
              <aside className="hidden lg:block">
                <div className="sticky top-28 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                    {UI_TEXT.blog.detail.tocTitle}
                  </h2>
                  {hasHeadings ? (
                    <ul className="mt-4 space-y-2 text-sm text-gray-700">
                      {headings.map((heading) => (
                        <li key={heading.id}>
                          <button
                            type="button"
                            onClick={() => scrollToHeading(heading.id)}
                            className={cn(
                              'w-full text-left transition hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                              heading.level === 3 ? 'pl-4 text-gray-500' : ''
                            )}
                          >
                            {heading.text}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-gray-500">{UI_TEXT.blog.detail.tocEmpty}</p>
                  )}
                </div>
              </aside>
            </div>
            <section className="mt-16 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">{UI_TEXT.blog.detail.relatedTitle}</h2>
                <button
                  type="button"
                  className="text-sm font-semibold text-primary-700 hover:text-primary-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  onClick={() => navigate('/blog/')}
                >
                  {UI_TEXT.blog.detail.continueExploring}
                </button>
          </div>
              {hasRelated ? (
                <ul className="mt-6 space-y-3">
                  {relatedArticles.map((item) => (
                    <li key={item.slug || item.id}>
                      <button
                        type="button"
                        className="w-full text-left text-sm text-gray-700 transition hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                        onClick={() => navigate(`/blog/${encodeURIComponent(item.slug || item.id)}`)}
                      >
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-gray-600">{UI_TEXT.blog.detail.relatedEmpty}</p>
              )}
            </section>
          </>
        ) : (
          <Card title={UI_TEXT.blog.detail.notFoundTitle} description={UI_TEXT.blog.detail.notFoundDesc}>
            <div className="mt-6 text-center">
              <button className="btn-primary" onClick={() => navigate('/blog')}>{UI_TEXT.blog.detail.backToList}</button>
            </div>
          </Card>
        )}
      </div>
      {showBackToTop && (
        <div className="fixed bottom-6 right-6 z-50 flex items-stretch gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-primary-600 bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
            onClick={handleBackToBlogNavigate}
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20">↩</span>
            {UI_TEXT.blog.detail.backToList}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-primary-700 shadow-lg backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
            onClick={handleBackToTop}
            aria-label={UI_TEXT.blog.detail.backToTop}
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-primary-700">↑</span>
            {UI_TEXT.blog.detail.backToTop}
          </button>
        </div>
      )}
      </div>
    </div>
  );
};