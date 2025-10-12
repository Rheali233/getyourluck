/**
 * 面包屑导航配置
 * 定义各页面的面包屑路径
 */

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export const BREADCRUMB_CONFIG: Record<string, BreadcrumbItem[]> = {
  // 测试中心
  '/tests': [
    { label: 'home', href: '/' },
    { label: 'testcenter', current: true }
  ],
  
  // 心理测试模块
  '/psychology': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'psychology', current: true }
  ],
  
  // 具体心理测试
  '/psychology/mbti': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'psychology', href: '/psychology' },
    { label: 'mbti', current: true }
  ],
  
  '/psychology/phq9': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'psychology', href: '/psychology' },
    { label: 'phq9', current: true }
  ],
  
  '/psychology/eq': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'psychology', href: '/psychology' },
    { label: 'eq', current: true }
  ],
  
  '/psychology/happiness': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'psychology', href: '/psychology' },
    { label: 'happiness', current: true }
  ],
  
  // 职业发展模块
  '/career': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'career', current: true }
  ],
  
  // 具体职业测试
  '/career/holland': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'career', href: '/career' },
    { label: 'holland', current: true }
  ],
  
  '/career/disc': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'career', href: '/career' },
    { label: 'disc', current: true }
  ],
  
  '/career/leadership': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'career', href: '/career' },
    { label: 'leadership', current: true }
  ],
  
  // 占星模块
  '/astrology': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'astrology', current: true }
  ],
  
  // 占星具体页面
  '/astrology/fortune': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'astrology', href: '/astrology' },
    { label: 'horoscope reading', current: true }
  ],
  
  '/astrology/compatibility': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'astrology', href: '/astrology' },
    { label: 'zodiac compatibility', current: true }
  ],
  
  '/astrology/birth-chart': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'astrology', href: '/astrology' },
    { label: 'birth chart analysis', current: true }
  ],
  
  // 塔罗模块
  '/tarot': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'tarot', current: true }
  ],
  
  // 塔罗具体页面
  '/tarot/recommendation': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'tarot', href: '/tarot' },
    { label: 'choose spread', current: true }
  ],
  
  '/tarot/drawing': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'tarot', href: '/tarot' },
    { label: 'draw cards', current: true }
  ],
  
  // 命理模块
  '/numerology': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'numerology', current: true }
  ],
  
  // 命理具体页面
  '/numerology/bazi': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'numerology', href: '/numerology' },
    { label: 'bazi analysis', current: true }
  ],
  
  '/numerology/zodiac': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'numerology', href: '/numerology' },
    { label: 'chinese zodiac fortune', current: true }
  ],
  
  '/numerology/name': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'numerology', href: '/numerology' },
    { label: 'name recommendation', current: true }
  ],
  
  '/numerology/name/result': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'numerology', href: '/numerology' },
    { label: 'name recommendation', href: '/numerology/name' },
    { label: 'results', current: true }
  ],
  
  '/numerology/ziwei': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'numerology', href: '/numerology' },
    { label: 'ziwei analysis', current: true }
  ],
  
  // 学习能力模块
  '/learning': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'learning', current: true }
  ],
  
  // 具体学习能力测试
  '/learning/vark': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'learning', href: '/learning' },
    { label: 'vark', current: true }
  ],
  
  
  
  // cognitive removed
  
  // 情感关系模块
  '/relationship': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'relationship', current: true }
  ],
  
  '/relationship/love_language': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'relationship', href: '/relationship' },
    { label: 'love_language', current: true }
  ],
  
  '/relationship/love_style': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'relationship', href: '/relationship' },
    { label: 'love_style', current: true }
  ],
  
  '/relationship/interpersonal': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'relationship', href: '/relationship' },
    { label: 'interpersonal', current: true }
  ],
  
  // 博客页面
  '/blog': [
    { label: 'home', href: '/' },
    { label: 'blog', current: true }
  ],
  
  // 关于页面
  '/about': [
    { label: 'home', href: '/' },
    { label: 'about', current: true }
  ],
  
  // 法律页面
  '/terms': [
    { label: 'home', href: '/' },
    { label: 'terms', current: true }
  ],
  
  '/privacy': [
    { label: 'home', href: '/' },
    { label: 'privacy', current: true }
  ],
  
  '/cookies': [
    { label: 'home', href: '/' },
    { label: 'cookies', current: true }
  ]
} as const;

/**
 * 根据路径获取面包屑配置
 */
export function getBreadcrumbConfig(path: string): BreadcrumbItem[] {
  return BREADCRUMB_CONFIG[path] || [
    { label: 'home', href: '/' },
    { label: 'page', current: true }
  ];
}
