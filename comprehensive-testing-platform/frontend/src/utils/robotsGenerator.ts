/**
 * Robots.txt生成器
 * 用于生成和优化robots.txt文件，控制搜索引擎爬虫行为
 */

export interface RobotsConfig {
  baseUrl: string;
  sitemapUrl: string;
  allowPaths: string[];
  disallowPaths: string[];
  crawlDelay?: number;
  userAgents: {
    name: string;
    allow?: string[];
    disallow?: string[];
    crawlDelay?: number;
  }[];
}

// 默认配置
const DEFAULT_CONFIG: RobotsConfig = {
  baseUrl: 'https://selfatlas.com',
  sitemapUrl: 'https://selfatlas.com/sitemap.xml',
  allowPaths: [
    '/',
    '/tests',
    '/psychology',
    '/career',
    '/astrology',
    '/tarot',
    '/numerology',
    '/learning',
    '/relationship',
    '/about',
    '/blog',
    '/terms',
    '/privacy',
    '/cookies'
  ],
  disallowPaths: [
    '/admin',
    '/api',
    '/_*',
    '/404',
    '/500',
    '/test-results',
    '/user-data',
    '/private',
    '/temp',
    '/cache',
    '/logs',
    '*.json',
    '*.xml',
    '*.txt',
    '*.log'
  ],
  crawlDelay: 1,
  userAgents: [
    {
      name: '*',
      disallow: [
        '/admin',
        '/api',
        '/_*',
        '/404',
        '/500',
        '/test-results',
        '/user-data',
        '/private',
        '/temp',
        '/cache',
        '/logs'
      ]
    },
    {
      name: 'Googlebot',
      allow: [
        '/',
        '/tests',
        '/psychology',
        '/career',
        '/astrology',
        '/tarot',
        '/numerology',
        '/learning',
        '/relationship',
        '/about',
        '/blog'
      ],
      disallow: [
        '/admin',
        '/api',
        '/_*',
        '/404',
        '/500',
        '/test-results',
        '/user-data',
        '/private',
        '/temp',
        '/cache',
        '/logs'
      ],
      crawlDelay: 1
    },
    {
      name: 'Bingbot',
      allow: [
        '/',
        '/tests',
        '/psychology',
        '/career',
        '/astrology',
        '/tarot',
        '/numerology',
        '/learning',
        '/relationship',
        '/about',
        '/blog'
      ],
      disallow: [
        '/admin',
        '/api',
        '/_*',
        '/404',
        '/500',
        '/test-results',
        '/user-data',
        '/private',
        '/temp',
        '/cache',
        '/logs'
      ],
      crawlDelay: 1
    },
    {
      name: 'Slurp',
      allow: [
        '/',
        '/tests',
        '/psychology',
        '/career',
        '/astrology',
        '/tarot',
        '/numerology',
        '/learning',
        '/relationship',
        '/about',
        '/blog'
      ],
      disallow: [
        '/admin',
        '/api',
        '/_*',
        '/404',
        '/500',
        '/test-results',
        '/user-data',
        '/private',
        '/temp',
        '/cache',
        '/logs'
      ],
      crawlDelay: 2
    }
  ]
};

/**
 * 生成robots.txt内容
 */
export const generateRobotsTxt = (config: RobotsConfig = DEFAULT_CONFIG): string => {
  const lines: string[] = [];
  
  // 添加用户代理规则
  config.userAgents.forEach(userAgent => {
    lines.push(`User-agent: ${userAgent.name}`);
    
    // 添加允许规则
    if (userAgent.allow && userAgent.allow.length > 0) {
      userAgent.allow.forEach(path => {
        lines.push(`Allow: ${path}`);
      });
    }
    
    // 添加禁止规则
    if (userAgent.disallow && userAgent.disallow.length > 0) {
      userAgent.disallow.forEach(path => {
        lines.push(`Disallow: ${path}`);
      });
    }
    
    // 添加爬取延迟
    if (userAgent.crawlDelay) {
      lines.push(`Crawl-delay: ${userAgent.crawlDelay}`);
    }
    
    lines.push(''); // 空行分隔
  });
  
  // 添加全局爬取延迟
  if (config.crawlDelay) {
    lines.push(`Crawl-delay: ${config.crawlDelay}`);
    lines.push('');
  }
  
  // 添加站点地图
  lines.push(`Sitemap: ${config.sitemapUrl}`);
  
  return lines.join('\n');
};

/**
 * 验证robots.txt配置
 */
export const validateRobotsConfig = (config: RobotsConfig): string[] => {
  const errors: string[] = [];
  
  if (!config.baseUrl || !config.baseUrl.startsWith('http')) {
    errors.push('Invalid base URL');
  }
  
  if (!config.sitemapUrl || !config.sitemapUrl.startsWith('http')) {
    errors.push('Invalid sitemap URL');
  }
  
  if (!config.userAgents || config.userAgents.length === 0) {
    errors.push('At least one user agent must be specified');
  }
  
  config.userAgents.forEach((userAgent, index) => {
    if (!userAgent.name) {
      errors.push(`User agent ${index + 1} must have a name`);
    }
    
    if (userAgent.crawlDelay && (userAgent.crawlDelay < 0 || userAgent.crawlDelay > 10)) {
      errors.push(`User agent ${index + 1} crawl delay must be between 0 and 10`);
    }
  });
  
  return errors;
};

/**
 * 生成并保存robots.txt文件
 */
export const generateAndSaveRobotsTxt = async (
  config: RobotsConfig = DEFAULT_CONFIG
): Promise<string> => {
  const errors = validateRobotsConfig(config);
  if (errors.length > 0) {
    throw new Error(`Robots.txt validation failed: ${errors.join(', ')}`);
  }
  
  const content = generateRobotsTxt(config);
  
  // 在浏览器环境中，可以下载文件
  if (typeof window !== 'undefined') {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  return content;
};

/**
 * 检查路径是否被允许
 */
export const isPathAllowed = (
  path: string,
  userAgent: string = '*',
  config: RobotsConfig = DEFAULT_CONFIG
): boolean => {
  const userAgentConfig = config.userAgents.find(ua => 
    ua.name === userAgent || ua.name === '*'
  );
  
  if (!userAgentConfig) {
    return true; // 默认允许
  }
  
  // 检查禁止规则
  if (userAgentConfig.disallow) {
    for (const disallowPath of userAgentConfig.disallow) {
      if (path.startsWith(disallowPath) || path.includes(disallowPath)) {
        return false;
      }
    }
  }
  
  // 检查允许规则
  if (userAgentConfig.allow) {
    for (const allowPath of userAgentConfig.allow) {
      if (path.startsWith(allowPath)) {
        return true;
      }
    }
  }
  
  return true; // 默认允许
};

/**
 * 生成SEO友好的robots.txt
 */
export const generateSEOOptimizedRobotsTxt = (): string => {
  const seoConfig: RobotsConfig = {
    ...DEFAULT_CONFIG,
    userAgents: [
      {
        name: '*',
        disallow: [
          '/admin',
          '/api',
          '/_*',
          '/404',
          '/500',
          '/test-results',
          '/user-data',
          '/private',
          '/temp',
          '/cache',
          '/logs',
          '*.json',
          '*.xml',
          '*.txt',
          '*.log'
        ]
      },
      {
        name: 'Googlebot',
        allow: [
          '/',
          '/tests',
          '/psychology',
          '/career',
          '/astrology',
          '/tarot',
          '/numerology',
          '/learning',
          '/relationship',
          '/about',
          '/blog'
        ],
        disallow: [
          '/admin',
          '/api',
          '/_*',
          '/404',
          '/500',
          '/test-results',
          '/user-data',
          '/private',
          '/temp',
          '/cache',
          '/logs'
        ],
        crawlDelay: 1
      }
    ]
  };
  
  return generateRobotsTxt(seoConfig);
};
