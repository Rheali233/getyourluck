/**
 * Sitemap生成服务
 * 负责生成网站地图和搜索引擎提交
 */

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  hreflang?: Array<{
    lang: string;
    url: string;
  }>;
}

export interface SitemapConfig {
  baseUrl: string;
  defaultPriority: number;
  defaultChangefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  maxUrlsPerSitemap: number;
  supportedLanguages: string[];
}

export class SitemapService {
  private config: SitemapConfig;
  private db: D1Database;

  constructor(db: D1Database, config: SitemapConfig) {
    this.db = db;
    this.config = config;
  }

  /**
   * 生成主sitemap索引
   */
  async generateSitemapIndex(): Promise<string> {
    try {
      const sitemaps = await this.getSitemapList();
      
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      for (const sitemap of sitemaps) {
        xml += '  <sitemap>\n';
        xml += `    <loc>${sitemap.loc}</loc>\n`;
        if (sitemap.lastmod) {
          xml += `    <lastmod>${sitemap.lastmod}</lastmod>\n`;
        }
        xml += '  </sitemap>\n';
      }
      
      xml += '</sitemapindex>';
      
      return xml;
    } catch (error) {
      console.error('Failed to generate sitemap index:', error);
      throw error;
    }
  }

  /**
   * 生成首页sitemap
   */
  async generateHomepageSitemap(): Promise<string> {
    try {
      const urls: SitemapUrl[] = [
        {
          loc: this.config.baseUrl,
          lastmod: new Date().toISOString(),
          changefreq: 'daily',
          priority: 1.0,
          hreflang: this.config.supportedLanguages.map(lang => ({
            lang,
            url: `${this.config.baseUrl}/${lang}`
          }))
        }
      ];

      return this.generateSitemapXml(urls);
    } catch (error) {
      console.error('Failed to generate homepage sitemap:', error);
      throw error;
    }
  }

  /**
   * 生成测试模块sitemap
   */
  async generateTestModulesSitemap(): Promise<string> {
    try {
      const urls: SitemapUrl[] = [];
      
      // 获取所有测试模块
      const modules = await this.getTestModules();
      
      for (const module of modules) {
        // 为每种语言生成URL
        for (const lang of this.config.supportedLanguages) {
          urls.push({
            loc: `${this.config.baseUrl}/${lang}/tests/${module.id}`,
            lastmod: module.updatedAt || new Date().toISOString(),
            changefreq: 'weekly',
            priority: 0.8,
            hreflang: this.config.supportedLanguages.map(l => ({
              lang: l,
              url: `${this.config.baseUrl}/${l}/tests/${module.id}`
            }))
          });
        }
      }

      return this.generateSitemapXml(urls);
    } catch (error) {
      console.error('Failed to generate test modules sitemap:', error);
      throw error;
    }
  }

  /**
   * 生成博客文章sitemap
   */
  async generateBlogSitemap(): Promise<string> {
    try {
      const urls: SitemapUrl[] = [];
      
      // 获取所有博客文章
      const articles = await this.getBlogArticles();
      
      for (const article of articles) {
        // 为每种语言生成URL
        for (const lang of this.config.supportedLanguages) {
          urls.push({
            loc: `${this.config.baseUrl}/${lang}/blog/${article.slug}`,
            lastmod: article.updatedAt || new Date().toISOString(),
            changefreq: 'monthly',
            priority: 0.6,
            hreflang: this.config.supportedLanguages.map(l => ({
              lang: l,
              url: `${this.config.baseUrl}/${l}/blog/${article.slug}`
            }))
          });
        }
      }

      return this.generateSitemapXml(urls);
    } catch (error) {
      console.error('Failed to generate blog sitemap:', error);
      throw error;
    }
  }

  /**
   * 生成搜索页面sitemap
   */
  async generateSearchSitemap(): Promise<string> {
    try {
      const urls: SitemapUrl[] = [];
      
      // 获取热门搜索关键词
      const keywords = await this.getPopularSearchKeywords();
      
      for (const keyword of keywords) {
        // 为每种语言生成URL
        for (const lang of this.config.supportedLanguages) {
          urls.push({
            loc: `${this.config.baseUrl}/${lang}/search?q=${encodeURIComponent(keyword.keyword)}`,
            lastmod: new Date().toISOString(),
            changefreq: 'weekly',
            priority: 0.5,
            hreflang: this.config.supportedLanguages.map(l => ({
              lang: l,
              url: `${this.config.baseUrl}/${l}/search?q=${encodeURIComponent(keyword.keyword)}`
            }))
          });
        }
      }

      return this.generateSitemapXml(urls);
    } catch (error) {
      console.error('Failed to generate search sitemap:', error);
      throw error;
    }
  }

  /**
   * 生成sitemap XML
   */
  private generateSitemapXml(urls: SitemapUrl[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
    xml += 'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
    
    for (const url of urls) {
      xml += '  <url>\n';
      xml += `    <loc>${url.loc}</loc>\n`;
      
      if (url.lastmod) {
        xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      }
      
      if (url.changefreq) {
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      }
      
      if (url.priority) {
        xml += `    <priority>${url.priority}</priority>\n`;
      }
      
      // 添加hreflang标签
      if (url.hreflang) {
        for (const hreflang of url.hreflang) {
          xml += '    <xhtml:link\n';
          xml += `      rel="alternate"\n`;
          xml += `      hreflang="${hreflang.lang}"\n`;
          xml += `      href="${hreflang.url}"\n`;
          xml += '    />\n';
        }
      }
      
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';
    
    return xml;
  }

  /**
   * 获取sitemap列表
   */
  private async getSitemapList(): Promise<SitemapUrl[]> {
    const baseUrl = this.config.baseUrl;
    const now = new Date().toISOString();
    
    return [
      {
        loc: `${baseUrl}/sitemap-homepage.xml`,
        lastmod: now
      },
      {
        loc: `${baseUrl}/sitemap-tests.xml`,
        lastmod: now
      },
      {
        loc: `${baseUrl}/sitemap-blog.xml`,
        lastmod: now
      },
      {
        loc: `${baseUrl}/sitemap-search.xml`,
        lastmod: now
      }
    ];
  }

  /**
   * 获取测试模块列表
   */
  private async getTestModules(): Promise<Array<{ id: string; updatedAt?: string }>> {
    try {
      const result = await this.db.prepare(`
        SELECT id, updated_at as updatedAt
        FROM homepage_modules 
        WHERE is_active = 1
        ORDER BY updated_at DESC
      `).all();
      
      return result.results || [];
    } catch (error) {
      console.error('Failed to get test modules:', error);
      return [];
    }
  }

  /**
   * 获取博客文章列表
   */
  private async getBlogArticles(): Promise<Array<{ slug: string; updatedAt?: string }>> {
    try {
      // 这里应该从博客模块获取数据
      // 暂时返回模拟数据
      return [
        {
          slug: 'mbti-personality-test',
          updatedAt: new Date().toISOString()
        },
        {
          slug: 'career-planning-guide',
          updatedAt: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Failed to get blog articles:', error);
      return [];
    }
  }

  /**
   * 获取热门搜索关键词
   */
  private async getPopularSearchKeywords(): Promise<Array<{ keyword: string }>> {
    try {
      const result = await this.db.prepare(`
        SELECT keyword
        FROM popular_search_keywords 
        ORDER BY search_count DESC 
        LIMIT 100
      `).all();
      
      return result.results || [];
    } catch (error) {
      console.error('Failed to get popular search keywords:', error);
      return [];
    }
  }

  /**
   * 提交sitemap到搜索引擎
   */
  async submitToSearchEngines(): Promise<{
    google: boolean;
    bing: boolean;
    baidu: boolean;
  }> {
    const results = {
      google: false,
      bing: false,
      baidu: false
    };

    try {
      // 提交到Google Search Console
      if (process.env.GOOGLE_SEARCH_CONSOLE_URL) {
        const googleUrl = `${process.env.GOOGLE_SEARCH_CONSOLE_URL}/sitemap`;
        const googleResponse = await fetch(googleUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/xml' },
          body: await this.generateSitemapIndex()
        });
        results.google = googleResponse.ok;
      }

      // 提交到Bing Webmaster Tools
      if (process.env.BING_WEBMASTER_URL) {
        const bingUrl = `${process.env.BING_WEBMASTER_URL}/sitemap`;
        const bingResponse = await fetch(bingUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/xml' },
          body: await this.generateSitemapIndex()
        });
        results.bing = bingResponse.ok;
      }

      // 提交到百度站长平台
      if (process.env.BAIDU_WEBMASTER_URL) {
        const baiduUrl = `${process.env.BAIDU_WEBMASTER_URL}/sitemap`;
        const baiduResponse = await fetch(baiduUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/xml' },
          body: await this.generateSitemapIndex()
        });
        results.baidu = baiduResponse.ok;
      }
    } catch (error) {
      console.error('Failed to submit sitemap to search engines:', error);
    }

    return results;
  }

  /**
   * 生成robots.txt内容
   */
  generateRobotsTxt(): string {
    let robots = 'User-agent: *\n';
    robots += 'Allow: /\n\n';
    
    // 添加sitemap链接
    robots += `Sitemap: ${this.config.baseUrl}/sitemap.xml\n`;
    
    // 添加特定规则
    robots += '\n# 禁止爬取管理页面\n';
    robots += 'Disallow: /admin/\n';
    robots += 'Disallow: /api/\n';
    robots += 'Disallow: /_next/\n';
    
    return robots;
  }
}
