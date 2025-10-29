/**
 * 动态Sitemap生成器
 * 用于生成和更新网站地图，提升SEO效果
 */

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export interface SitemapConfig {
  baseUrl: string;
  defaultPriority: number;
  defaultChangeFreq: SitemapUrl['changefreq'];
  excludePaths: string[];
  includePaths: string[];
}

// 默认配置
const DEFAULT_CONFIG: SitemapConfig = {
  baseUrl: 'https://selfatlas.com',
  defaultPriority: 0.5,
  defaultChangeFreq: 'weekly',
  excludePaths: ['/admin', '/api', '/_*', '/404', '/500'],
  includePaths: []
};

// 页面配置
const PAGE_CONFIGS: Record<string, Partial<SitemapUrl>> = {
  // 首页
  '/': {
    priority: 1.0,
    changefreq: 'daily'
  },
  
  // 主要模块页面
  '/tests': {
    priority: 0.9,
    changefreq: 'daily'
  },
  '/tests/psychology': {
    priority: 0.8,
    changefreq: 'weekly'
  },
  '/tests/career': {
    priority: 0.8,
    changefreq: 'weekly'
  },
  '/tests/astrology': {
    priority: 0.8,
    changefreq: 'weekly'
  },
  '/tests/tarot': {
    priority: 0.8,
    changefreq: 'weekly'
  },
  '/tests/numerology': {
    priority: 0.8,
    changefreq: 'weekly'
  },
  '/tests/learning': {
    priority: 0.8,
    changefreq: 'weekly'
  },
  '/tests/relationship': {
    priority: 0.8,
    changefreq: 'weekly'
  },
  
  // 具体测试页面
  '/tests/psychology/mbti': {
    priority: 0.7,
    changefreq: 'monthly'
  },
  '/tests/psychology/eq': {
    priority: 0.7,
    changefreq: 'monthly'
  },
  '/tests/psychology/phq9': {
    priority: 0.7,
    changefreq: 'monthly'
  },
  '/tests/psychology/happiness': {
    priority: 0.7,
    changefreq: 'monthly'
  },
  '/tests/career/holland': {
    priority: 0.7,
    changefreq: 'monthly'
  },
  '/tests/career/disc': {
    priority: 0.7,
    changefreq: 'monthly'
  },
  '/tests/career/leadership': {
    priority: 0.7,
    changefreq: 'monthly'
  },
  '/tests/astrology/fortune': {
    priority: 0.7,
    changefreq: 'daily'
  },
  '/tests/astrology/compatibility': {
    priority: 0.7,
    changefreq: 'monthly'
  },
  '/tests/astrology/birth-chart': {
    priority: 0.7,
    changefreq: 'monthly'
  },
  '/tests/tarot/recommendation': {
    priority: 0.7,
    changefreq: 'monthly'
  },
  '/tests/tarot/drawing': {
    priority: 0.7,
    changefreq: 'monthly'
  },
  '/tests/numerology/bazi': {
    priority: 0.7,
    changefreq: 'monthly'
  },
  '/tests/numerology/zodiac': {
    priority: 0.7,
    changefreq: 'daily'
  },
  '/tests/numerology/name': {
    priority: 0.7,
    changefreq: 'monthly'
  },
  '/tests/numerology/ziwei': {
    priority: 0.7,
    changefreq: 'monthly'
  },
  '/tests/learning/vark': {
    priority: 0.7,
    changefreq: 'monthly'
  },
  // cognitive removed
  '/tests/relationship/love-language': {
    priority: 0.7,
    changefreq: 'monthly'
  },
  '/tests/relationship/love-style': {
    priority: 0.7,
    changefreq: 'monthly'
  },
  '/tests/relationship/interpersonal': {
    priority: 0.7,
    changefreq: 'monthly'
  },
  
  // 其他页面
  '/about': {
    priority: 0.6,
    changefreq: 'monthly'
  },
  '/blog': {
    priority: 0.7,
    changefreq: 'daily'
  },
  '/terms': {
    priority: 0.3,
    changefreq: 'yearly'
  },
  '/privacy': {
    priority: 0.3,
    changefreq: 'yearly'
  },
  '/cookies': {
    priority: 0.3,
    changefreq: 'yearly'
  }
};

/**
 * 生成单个URL的sitemap条目
 */
export const generateSitemapUrl = (
  path: string,
  config: SitemapConfig = DEFAULT_CONFIG,
  customConfig?: Partial<SitemapUrl>
): SitemapUrl => {
  const pageConfig = PAGE_CONFIGS[path] || {};
  const mergedConfig = { ...pageConfig, ...customConfig };
  
  return {
    loc: `${config.baseUrl || 'https://example.com'}${path}` as string,
    lastmod: new Date().toISOString().split('T')[0] as string,
    changefreq: (mergedConfig.changefreq || config.defaultChangeFreq || 'weekly') as 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
    priority: parseFloat(String(mergedConfig.priority || config.defaultPriority || '0.5'))
  };
};

/**
 * 生成完整sitemap
 */
export const generateSitemap = (
  paths: string[],
  config: SitemapConfig = DEFAULT_CONFIG
): SitemapUrl[] => {
  const filteredPaths = paths.filter(path => {
    // 排除不需要的路径
    return !config.excludePaths.some(excludePath => 
      path.startsWith(excludePath) || path.includes(excludePath)
    );
  });

  return filteredPaths.map(path => generateSitemapUrl(path, config));
};

/**
 * 生成XML格式的sitemap
 */
export const generateSitemapXML = (
  urls: SitemapUrl[]
): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  const urlsetClose = '</urlset>';
  
  const urlEntries = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');
  
  return `${xmlHeader}
${urlsetOpen}${urlEntries}
${urlsetClose}`;
};

/**
 * 获取所有页面路径
 */
export const getAllPagePaths = (): string[] => {
  return [
    // 主要页面
    '/',
    '/tests',
    '/about',
    '/blog',
    
    // 模块页面
    '/tests/psychology',
    '/tests/career',
    '/tests/astrology',
    '/tests/tarot',
    '/tests/numerology',
    '/tests/learning',
    '/tests/relationship',
    
    // 心理测试页面
    '/tests/psychology/mbti',
    '/tests/psychology/eq',
    '/tests/psychology/phq9',
    '/tests/psychology/happiness',
    
    // 职业测试页面
    '/tests/career/holland',
    '/tests/career/disc',
    '/tests/career/leadership',
    
    // 占星页面
    '/tests/astrology/fortune',
    '/tests/astrology/compatibility',
    '/tests/astrology/birth-chart',
    
    // 塔罗页面
    '/tests/tarot/recommendation',
    '/tests/tarot/drawing',
    
    // 命理页面
    '/tests/numerology/bazi',
    '/tests/numerology/zodiac',
    '/tests/numerology/name',
    '/tests/numerology/ziwei',
    
    // 学习能力页面
    '/tests/learning/vark',
    // cognitive removed
    
    // 情感关系页面
    '/tests/relationship/love-language',
    '/tests/relationship/love-style',
    '/tests/relationship/interpersonal',
    
    // 法律页面
    '/terms',
    '/privacy',
    '/cookies'
  ];
};

/**
 * 生成并保存sitemap文件
 */
export const generateAndSaveSitemap = async (
  config: SitemapConfig = DEFAULT_CONFIG
): Promise<string> => {
  const paths = getAllPagePaths();
  const urls = generateSitemap(paths, config);
  const xml = generateSitemapXML(urls);
  
  // 在浏览器环境中，可以下载文件
  if (typeof window !== 'undefined') {
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  return xml;
};

/**
 * 验证sitemap URL
 */
export const validateSitemapUrl = (url: SitemapUrl): string[] => {
  const errors: string[] = [];
  
  if (!url.loc || !url.loc.startsWith('http')) {
    errors.push('Invalid URL location');
  }
  
  if (!url.lastmod || isNaN(Date.parse(url.lastmod))) {
    errors.push('Invalid lastmod date');
  }
  
  if (url.priority < 0 || url.priority > 1) {
    errors.push('Priority must be between 0 and 1');
  }
  
  const validChangeFreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
  if (!validChangeFreqs.includes(url.changefreq)) {
    errors.push('Invalid changefreq value');
  }
  
  return errors;
};
