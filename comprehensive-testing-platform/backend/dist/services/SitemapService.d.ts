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
export declare class SitemapService {
    private config;
    private db;
    constructor(db: D1Database, config: SitemapConfig);
    /**
     * 生成主sitemap索引
     */
    generateSitemapIndex(): Promise<string>;
    /**
     * 生成首页sitemap
     */
    generateHomepageSitemap(): Promise<string>;
    /**
     * 生成测试模块sitemap
     */
    generateTestModulesSitemap(): Promise<string>;
    /**
     * 生成博客文章sitemap
     */
    generateBlogSitemap(): Promise<string>;
    /**
     * 生成搜索页面sitemap
     */
    generateSearchSitemap(): Promise<string>;
    /**
     * 生成sitemap XML
     */
    private generateSitemapXml;
    /**
     * 获取sitemap列表
     */
    private getSitemapList;
    /**
     * 获取测试模块列表
     */
    private getTestModules;
    /**
     * 获取博客文章列表
     */
    private getBlogArticles;
    /**
     * 获取热门搜索关键词
     */
    private getPopularSearchKeywords;
    /**
     * 提交sitemap到搜索引擎
     */
    submitToSearchEngines(): Promise<{
        google: boolean;
        bing: boolean;
        baidu: boolean;
    }>;
    /**
     * 生成robots.txt内容
     */
    generateRobotsTxt(): string;
}
//# sourceMappingURL=SitemapService.d.ts.map