/**
 * 博客页面路由组件
 * 遵循统一开发标准的页面组件规范
 */

import React from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import type { BaseComponentProps } from '@/types/componentTypes';
import { Card, ArticleCard, ArticleMeta, LoadingSpinner, ArticleContent, Select, Input, ArticleCardSkeleton, Navigation, Breadcrumb } from '@/components/ui';
import { OptimizedImage } from '@/modules/homepage/components/OptimizedImage';
import { UI_TEXT } from '@/shared/configs/UI_TEXT';
import { useBlogStore } from '@/stores/blogStore';
import { SEOManager } from '@/modules/homepage/components/SEOManager';
import { getBreadcrumbConfig } from '@/utils/breadcrumbConfig';
import { Link } from 'react-router-dom';
import { trackEvent, buildBaseContext } from '@/services/analyticsService';
import { UserBehaviorTracker } from '@/modules/homepage/components/UserBehaviorTracker';

interface BlogPageProps extends BaseComponentProps {}

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
        navigate(`/blog/category/${category}/page/1`);
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
      fetchArticles(pageParam, category);
    }
  }, [pageParam, category, keyword, fetchArticles]);

  const canonical = React.useMemo(() => {
    const base = `${window.location.origin}/blog`;
    if (category) return `${base}/category/${category}/page/${pageParam}`;
    if (tag) return `${base}/tag/${tag}/page/${pageParam}`;
    if (keyword) return `${base}/search/${encodeURIComponent(keyword)}/page/${pageParam}`;
    if (pageParam && pageParam > 1) return `${base}/page/${pageParam}`;
    return `${base}/`;
  }, [pageParam, category, tag, keyword]);

  const links = React.useMemo(() => {
    const defs: Array<{ rel: string; href: string }> = [];
    const base = `${window.location.origin}/blog`;
    const makeHref = (p: number) => {
      if (category) return `${base}/category/${category}/page/${p}`;
      if (tag) return `${base}/tag/${tag}/page/${p}`;
      if (keyword) return `${base}/search/${encodeURIComponent(keyword)}/page/${p}`;
      if (p === 1) return `${base}/`;
      return `${base}/page/${p}`;
    };
    if (pagination.hasPrev) defs.push({ rel: 'prev', href: makeHref(pagination.page - 1) });
    if (pagination.hasNext) defs.push({ rel: 'next', href: makeHref(pagination.page + 1) });
    return defs;
  }, [pagination, category, tag, keyword]);

  const structuredData = React.useMemo(() => {
    // 有搜索时：注入 SearchAction
    if (keyword && keyword.trim().length > 0) {
      const target = `${window.location.origin}/blog/search/{search_term_string}/page/1`;
      return [{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: `${window.location.origin}/blog/`,
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
        url: `${window.location.origin}/blog/`,
        hasPart: {
          '@type': 'ItemList',
          itemListElement: articles.map((a: any, idx: number) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: a.title,
            url: `${window.location.origin}/blog/${a.slug || a.id}`
          }))
        }
      }];
    }
    return [] as any[];
  }, [keyword, articles]);

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
          title: `${UI_TEXT.blog.list.title}${pageParam && pageParam > 1 ? ` - Page ${pageParam}` : ''}`,
          description: UI_TEXT.blog.list.subtitle,
          canonicalUrl: canonical,
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
                  navigate(`/blog/category/${value}/page/1`);
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
            <button onClick={() => fetchArticles(pagination.page)} className="btn-primary">{UI_TEXT.blog.list.retry}</button>
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
                    onClick={(id) => navigate(`/blog/${a.slug || id}`)}
                  />
                ))}
              </div>
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
    const base = `${window.location.origin}/blog`;
    return slug ? `${base}/${slug}` : `${base}/`;
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
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${window.location.origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${window.location.origin}/blog/` },
        currentArticle.category ? { '@type': 'ListItem', position: 3, name: currentArticle.category, item: `${window.location.origin}/blog/category/${currentArticle.category}` } : undefined,
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
      <div className="max-w-4xl mx-auto px-4 pt-16">
        {isLoading ? (
          <div className="flex justify-center py-16"><LoadingSpinner /></div>
        ) : error ? (
          <Card title={UI_TEXT.blog.detail.notFoundTitle} description={UI_TEXT.blog.detail.notFoundDesc}>
            <div className="mt-6 text-center">
              <button className="btn-primary" onClick={() => navigate('/blog')}>{UI_TEXT.blog.detail.backToList}</button>
            </div>
          </Card>
        ) : currentArticle ? (
          <div>
            {/* Breadcrumbs */}
            <nav className="mb-2 text-sm text-gray-600" aria-label="Breadcrumb">
              <ol className="flex items-center gap-1">
                <li><Link className="hover:underline" to="/">Home</Link></li>
                <li>/</li>
                <li><Link className="hover:underline" to="/blog/">Blog</Link></li>
                {currentArticle.category && (<>
                  <li>/</li>
                  <li><Link className="hover:underline" to={`/blog/category/${currentArticle.category}/page/1`}>{currentArticle.category}</Link></li>
                </>)}
              </ol>
            </nav>
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {currentArticle.title || UI_TEXT.blog.detail.titleFallback}
            </h1>
            <ArticleMeta
              author={currentArticle.author || ''}
              publishDate={currentArticle.publishDate || ''}
              readTime={currentArticle.readTime || ''}
              views={currentArticle.readCount ?? 0}
              className="mb-6"
            />
            {currentArticle.coverImage || currentArticle.ogImage ? (
              <>
                {/* Preload for LCP image */}
                <link rel="preload" as="image" href={(currentArticle.coverImage || currentArticle.ogImage) as string} />
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6">
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
            {(currentArticle as any).contentHtml ? (
              <ArticleContent html={(currentArticle as any).contentHtml} className="mt-2" />
            ) : currentArticle.content ? (
              <ArticleContent html={currentArticle.content} className="mt-2" />
            ) : (
              <div className="prose max-w-none">
                <p className="text-gray-600">{UI_TEXT.blog.detail.notFoundDesc}</p>
              </div>
            )}

            {/* 文章交互功能 - 暂时隐藏 */}
            {/* <ArticleInteractions
              slug={currentArticle.slug || currentArticle.id}
              likeCount={currentArticle.readCount || 0}
              commentCount={0} // Comment count will be fetched from API
              className="mt-8"
            /> */}
          </div>
        ) : (
          <Card title={UI_TEXT.blog.detail.notFoundTitle} description={UI_TEXT.blog.detail.notFoundDesc}>
            <div className="mt-6 text-center">
              <button className="btn-primary" onClick={() => navigate('/blog')}>{UI_TEXT.blog.detail.backToList}</button>
            </div>
          </Card>
        )}
      </div>
      </div>
    </div>
  );
};