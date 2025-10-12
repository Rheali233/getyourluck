/**
 * Google Search Console集成
 * 用于监控和优化网站在Google搜索结果中的表现
 */

export interface SearchConsoleConfig {
  siteUrl: string;
  verificationCode?: string;
  trackingId?: string;
  enableIndexing?: boolean;
  enablePerformanceTracking?: boolean;
}

export interface SearchConsoleMetrics {
  clicks: number;
  impressions: number;
  ctr: number; // Click-through rate
  position: number; // Average position
  queries: Array<{
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  pages: Array<{
    page: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
}

// 默认配置
const DEFAULT_CONFIG: SearchConsoleConfig = {
  siteUrl: 'https://selfatlas.com',
  enableIndexing: true,
  enablePerformanceTracking: true
};

/**
 * 生成Google Search Console验证代码
 */
export const generateVerificationCode = (config: SearchConsoleConfig = DEFAULT_CONFIG): string => {
  if (!config.verificationCode) {
    return '';
  }
  
  return `<!-- Google Search Console Verification -->
<meta name="google-site-verification" content="${config.verificationCode}" />`;
};

/**
 * 生成Google Analytics集成代码
 */
export const generateAnalyticsCode = (trackingId: string): string => {
  return `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${trackingId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${trackingId}', {
    page_title: document.title,
    page_location: window.location.href
  });
</script>`;
};

/**
 * 生成结构化数据验证代码
 */
export const generateStructuredDataValidation = (): string => {
  return `<!-- Structured Data Validation -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SelfAtlas - Comprehensive Testing Platform",
  "url": "https://selfatlas.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://selfatlas.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>`;
};

/**
 * 生成页面索引控制代码
 */
export const generateIndexingControl = (
  allowIndexing: boolean = true,
  followLinks: boolean = true
): string => {
  const robots = allowIndexing ? 'index' : 'noindex';
  const follow = followLinks ? 'follow' : 'nofollow';
  
  return `<meta name="robots" content="${robots}, ${follow}" />`;
};

/**
 * 生成Google Search Console报告数据
 */
export const generateSearchConsoleReport = (
  metrics: SearchConsoleMetrics,
  config: SearchConsoleConfig = DEFAULT_CONFIG
): string => {
  const report = {
    siteUrl: config.siteUrl,
    reportDate: new Date().toISOString(),
    totalClicks: metrics.clicks,
    totalImpressions: metrics.impressions,
    averageCTR: metrics.ctr,
    averagePosition: metrics.position,
    topQueries: metrics.queries.slice(0, 10),
    topPages: metrics.pages.slice(0, 10),
    recommendations: generateRecommendations(metrics)
  };
  
  return JSON.stringify(report, null, 2);
};

/**
 * 生成SEO优化建议
 */
export const generateRecommendations = (metrics: SearchConsoleMetrics): string[] => {
  const recommendations: string[] = [];
  
  // CTR优化建议
  if (metrics.ctr < 3) {
    recommendations.push('Improve click-through rate by optimizing page titles and meta descriptions');
  }
  
  // 位置优化建议
  if (metrics.position > 10) {
    recommendations.push('Focus on improving search rankings for better visibility');
  }
  
  // 查询优化建议
  const lowCTRQueries = metrics.queries.filter(q => q.ctr < 2);
  if (lowCTRQueries.length > 0) {
    recommendations.push(`Optimize content for queries with low CTR: ${lowCTRQueries.map(q => q.query).join(', ')}`);
  }
  
  // 页面优化建议
  const lowPerformingPages = metrics.pages.filter(p => p.ctr < 2);
  if (lowPerformingPages.length > 0) {
    recommendations.push(`Improve performance of pages: ${lowPerformingPages.map(p => p.page).join(', ')}`);
  }
  
  return recommendations;
};

/**
 * 生成站点地图提交代码
 */
export const generateSitemapSubmission = (config: SearchConsoleConfig = DEFAULT_CONFIG): string => {
  return `<!-- Sitemap Submission -->
<!-- Submit your sitemap to Google Search Console -->
<!-- Sitemap URL: ${config.siteUrl}/sitemap.xml -->
<!-- Instructions: -->
<!-- 1. Go to Google Search Console -->
<!-- 2. Select your property -->
<!-- 3. Go to Sitemaps section -->
<!-- 4. Add sitemap URL: ${config.siteUrl}/sitemap.xml -->
<!-- 5. Click Submit -->`;
};

/**
 * 生成页面性能监控代码
 */
export const generatePerformanceMonitoring = (): string => {
  return `<!-- Page Performance Monitoring -->
<script>
  // Core Web Vitals monitoring
  function sendToAnalytics(name, value) {
    if (typeof gtag !== 'undefined') {
      gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        event_label: name,
        non_interaction: true
      });
    }
  }
  
  // LCP monitoring
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      sendToAnalytics('LCP', entry.startTime);
    }
  }).observe({entryTypes: ['largest-contentful-paint']});
  
  // FID monitoring
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      sendToAnalytics('FID', entry.processingStart - entry.startTime);
    }
  }).observe({entryTypes: ['first-input']});
  
  // CLS monitoring
  let clsValue = 0;
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        sendToAnalytics('CLS', clsValue);
      }
    }
  }).observe({entryTypes: ['layout-shift']});
</script>`;
};

/**
 * 生成完整的Google Search Console集成代码
 */
export const generateCompleteSearchConsoleCode = (
  config: SearchConsoleConfig = DEFAULT_CONFIG
): string => {
  const codes: string[] = [];
  
  // 验证代码
  if (config.verificationCode) {
    codes.push(generateVerificationCode(config));
  }
  
  // Analytics代码
  if (config.trackingId) {
    codes.push(generateAnalyticsCode(config.trackingId));
  }
  
  // 结构化数据
  codes.push(generateStructuredDataValidation());
  
  // 索引控制
  codes.push(generateIndexingControl(config.enableIndexing));
  
  // 性能监控
  if (config.enablePerformanceTracking) {
    codes.push(generatePerformanceMonitoring());
  }
  
  // 站点地图提交
  codes.push(generateSitemapSubmission(config));
  
  return codes.join('\n\n');
};

/**
 * 验证Google Search Console配置
 */
export const validateSearchConsoleConfig = (config: SearchConsoleConfig): string[] => {
  const errors: string[] = [];
  
  if (!config.siteUrl || !config.siteUrl.startsWith('http')) {
    errors.push('Invalid site URL');
  }
  
  if (config.trackingId && !config.trackingId.match(/^G-[A-Z0-9]+$/)) {
    errors.push('Invalid Google Analytics tracking ID format');
  }
  
  if (config.verificationCode && config.verificationCode.length < 20) {
    errors.push('Verification code seems too short');
  }
  
  return errors;
};
