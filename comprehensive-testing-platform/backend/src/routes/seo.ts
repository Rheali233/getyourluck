/**
 * SEO相关API路由
 * 提供sitemap生成、搜索引擎提交等SEO功能
 */

import { Hono } from 'hono';
import { SitemapService } from '../services/SitemapService';
import type { APIResponse } from '../../../shared/types/apiResponse';
import type { Context } from 'hono';
import type { AppContext } from '../types/env';

const seoRoutes = new Hono<AppContext>();

const respondDatabaseUnavailable = (c: Context<AppContext>) => {
  const response: APIResponse = {
    success: false,
    error: 'Database not available',
    message: 'Database connection is required to generate SEO resources',
    timestamp: new Date().toISOString(),
    requestId: c.get('requestId'),
  };

  return c.json(response, 500);
};

// 获取sitemap索引
seoRoutes.get('/sitemap.xml', async (c) => {
  try {
    if (!c.env.DB) {
      return respondDatabaseUnavailable(c);
    }

    const sitemapService = new SitemapService(c.env.DB!, {
      baseUrl: c.req.url.replace('/api/seo/sitemap.xml', ''),
      defaultPriority: 0.5,
      defaultChangefreq: 'weekly',
      maxUrlsPerSitemap: 50000,
      supportedLanguages: ['en-US']
    });

    const sitemapIndex = await sitemapService.generateSitemapIndex();
    
    c.header('Content-Type', 'application/xml');
    c.header('Cache-Control', 'public, max-age=3600'); // 缓存1小时
    
    return c.text(sitemapIndex);
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to generate sitemap',
      message: 'Internal server error'
    }, 500);
  }
});

// 获取首页sitemap
seoRoutes.get('/sitemap-homepage.xml', async (c) => {
  try {
    if (!c.env.DB) {
      return respondDatabaseUnavailable(c);
    }

    const sitemapService = new SitemapService(c.env.DB!, {
      baseUrl: c.req.url.replace('/api/seo/sitemap-homepage.xml', ''),
      defaultPriority: 0.5,
      defaultChangefreq: 'weekly',
      maxUrlsPerSitemap: 50000,
      supportedLanguages: ['en-US']
    });

    const sitemap = await sitemapService.generateHomepageSitemap();
    
    c.header('Content-Type', 'application/xml');
    c.header('Cache-Control', 'public, max-age=3600');
    
    return c.text(sitemap);
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to generate homepage sitemap',
      message: 'Internal server error'
    }, 500);
  }
});

// 获取测试模块sitemap
seoRoutes.get('/sitemap-tests.xml', async (c) => {
  try {
    if (!c.env.DB) {
      return respondDatabaseUnavailable(c);
    }

    const sitemapService = new SitemapService(c.env.DB!, {
      baseUrl: c.req.url.replace('/api/seo/sitemap-tests.xml', ''),
      defaultPriority: 0.5,
      defaultChangefreq: 'weekly',
      maxUrlsPerSitemap: 50000,
      supportedLanguages: ['en-US']
    });

    const sitemap = await sitemapService.generateTestModulesSitemap();
    
    c.header('Content-Type', 'application/xml');
    c.header('Cache-Control', 'public, max-age=3600');
    
    return c.text(sitemap);
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to generate tests sitemap',
      message: 'Internal server error'
    }, 500);
  }
});

// 获取博客sitemap
seoRoutes.get('/sitemap-blog.xml', async (c) => {
  try {
    if (!c.env.DB) {
      return respondDatabaseUnavailable(c);
    }

    const sitemapService = new SitemapService(c.env.DB!, {
      baseUrl: c.req.url.replace('/api/seo/sitemap-blog.xml', ''),
      defaultPriority: 0.5,
      defaultChangefreq: 'weekly',
      maxUrlsPerSitemap: 50000,
      supportedLanguages: ['en-US']
    });

    const sitemap = await sitemapService.generateBlogSitemap();
    
    c.header('Content-Type', 'application/xml');
    c.header('Cache-Control', 'public, max-age=3600');
    
    return c.text(sitemap);
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to generate blog sitemap',
      message: 'Internal server error'
    }, 500);
  }
});

// 获取搜索sitemap
seoRoutes.get('/sitemap-search.xml', async (c) => {
  try {
    if (!c.env.DB) {
      return respondDatabaseUnavailable(c);
    }

    const sitemapService = new SitemapService(c.env.DB!, {
      baseUrl: c.req.url.replace('/api/seo/sitemap-search.xml', ''),
      defaultPriority: 0.5,
      defaultChangefreq: 'weekly',
      maxUrlsPerSitemap: 50000,
      supportedLanguages: ['en-US']
    });

    const sitemap = await sitemapService.generateSearchSitemap();
    
    c.header('Content-Type', 'application/xml');
    c.header('Cache-Control', 'public, max-age=3600');
    
    return c.text(sitemap);
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to generate search sitemap',
      message: 'Internal server error'
    }, 500);
  }
});

// 获取robots.txt
seoRoutes.get('/robots.txt', async (c) => {
  try {
    if (!c.env.DB) {
      return respondDatabaseUnavailable(c);
    }

    const sitemapService = new SitemapService(c.env.DB!, {
      baseUrl: c.req.url.replace('/api/seo/robots.txt', ''),
      defaultPriority: 0.5,
      defaultChangefreq: 'weekly',
      maxUrlsPerSitemap: 50000,
      supportedLanguages: ['en-US']
    });

    const robotsTxt = sitemapService.generateRobotsTxt();
    
    c.header('Content-Type', 'text/plain');
    c.header('Cache-Control', 'public, max-age=86400'); // 缓存24小时
    
    return c.text(robotsTxt);
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to generate robots.txt',
      message: 'Internal server error'
    }, 500);
  }
});

// 提交sitemap到搜索引擎
seoRoutes.post('/submit', async (c) => {
  try {
    if (!c.env.DB) {
      return respondDatabaseUnavailable(c);
    }

    const sitemapService = new SitemapService(c.env.DB!, {
      baseUrl: c.req.url.replace('/api/seo/submit', ''),
      defaultPriority: 0.5,
      defaultChangefreq: 'weekly',
      maxUrlsPerSitemap: 50000,
      supportedLanguages: ['en-US']
    });

    const results = await sitemapService.submitToSearchEngines();
    
    return c.json({
      success: true,
      data: results,
      message: 'Sitemap submission completed',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId'),
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to submit sitemap',
      message: 'Internal server error'
    }, 500);
  }
});

// 获取SEO统计信息
seoRoutes.get('/stats', async (c) => {
  try {
    if (!c.env.DB) {
      return respondDatabaseUnavailable(c);
    }

    const sitemapService = new SitemapService(c.env.DB!, {
      baseUrl: c.req.url.replace('/api/seo/stats', ''),
      defaultPriority: 0.5,
      defaultChangefreq: 'weekly',
      maxUrlsPerSitemap: 50000,
      supportedLanguages: ['en-US']
    });

    // 获取各种sitemap的URL数量
    const homepageUrls = await sitemapService.generateHomepageSitemap();
    const testUrls = await sitemapService.generateTestModulesSitemap();
    const blogUrls = await sitemapService.generateBlogSitemap();
    const searchUrls = await sitemapService.generateSearchSitemap();

    const stats = {
      totalUrls: homepageUrls.split('<url>').length - 1 + 
                 testUrls.split('<url>').length - 1 + 
                 blogUrls.split('<url>').length - 1 + 
                 searchUrls.split('<url>').length - 1,
      sitemaps: {
        homepage: homepageUrls.split('<url>').length - 1,
        tests: testUrls.split('<url>').length - 1,
        blog: blogUrls.split('<url>').length - 1,
        search: searchUrls.split('<url>').length - 1
      },
      lastUpdated: new Date().toISOString(),
      supportedLanguages: ['en-US']
    };

    return c.json({
      success: true,
      data: stats,
      message: 'SEO statistics retrieved successfully',
      timestamp: new Date().toISOString(),
      requestId: c.get('requestId'),
    });
  } catch (error) {
    return c.json({
      success: false,
      error: 'Failed to get SEO stats',
      message: 'Internal server error'
    }, 500);
  }
});

export default seoRoutes;
