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
  '/tests/psychology': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'psychology', current: true }
  ],
  
  // 具体心理测试
  '/tests/psychology/mbti': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'psychology', href: '/tests/psychology' },
    { label: 'mbti', current: true }
  ],
  
  '/tests/psychology/phq9': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'psychology', href: '/tests/psychology' },
    { label: 'phq9', current: true }
  ],
  
  '/tests/psychology/eq': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'psychology', href: '/tests/psychology' },
    { label: 'eq', current: true }
  ],
  
  '/tests/psychology/happiness': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'psychology', href: '/tests/psychology' },
    { label: 'happiness', current: true }
  ],
  
  // 职业发展模块
  '/tests/career': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'career', current: true }
  ],
  
  // 具体职业测试
  '/tests/career/holland': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'career', href: '/tests/career' },
    { label: 'holland', current: true }
  ],
  
  '/tests/career/disc': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'career', href: '/tests/career' },
    { label: 'disc', current: true }
  ],
  
  '/tests/career/leadership': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'career', href: '/tests/career' },
    { label: 'leadership', current: true }
  ],
  
  // 占星模块
  '/tests/astrology': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'astrology', current: true }
  ],
  
  // 占星具体页面
  '/tests/astrology/fortune': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'astrology', href: '/tests/astrology' },
    { label: 'horoscope reading', current: true }
  ],
  
  '/tests/astrology/compatibility': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'astrology', href: '/tests/astrology' },
    { label: 'zodiac compatibility', current: true }
  ],
  
  '/tests/astrology/birth-chart': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'astrology', href: '/tests/astrology' },
    { label: 'birth chart analysis', current: true }
  ],
  
  // 塔罗模块
  '/tests/tarot': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'tarot', current: true }
  ],
  
  // 塔罗具体页面
  '/tests/tarot/recommendation': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'tarot', href: '/tests/tarot' },
    { label: 'choose spread', current: true }
  ],
  
  '/tests/tarot/drawing': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'tarot', href: '/tests/tarot' },
    { label: 'draw cards', current: true }
  ],
  
  // 命理模块
  '/tests/numerology': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'numerology', current: true }
  ],
  
  // 命理具体页面
  '/tests/numerology/bazi': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'numerology', href: '/tests/numerology' },
    { label: 'bazi analysis', current: true }
  ],
  
  '/tests/numerology/zodiac': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'numerology', href: '/tests/numerology' },
    { label: 'chinese zodiac fortune', current: true }
  ],
  
  '/tests/numerology/name': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'numerology', href: '/tests/numerology' },
    { label: 'name recommendation', current: true }
  ],
  
  '/tests/numerology/name/result': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'numerology', href: '/tests/numerology' },
    { label: 'name recommendation', href: '/tests/numerology/name' },
    { label: 'results', current: true }
  ],
  
  '/tests/numerology/ziwei': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'numerology', href: '/tests/numerology' },
    { label: 'ziwei analysis', current: true }
  ],
  
  // 学习能力模块
  '/tests/learning': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'learning', current: true }
  ],
  
  // 具体学习能力测试
  '/tests/learning/vark': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'learning', href: '/tests/learning' },
    { label: 'vark', current: true }
  ],
  
  
  
  // cognitive removed
  
  // 情感关系模块
  '/tests/relationship': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'relationship', current: true }
  ],
  
  '/tests/relationship/love-language': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'relationship', href: '/tests/relationship' },
    { label: 'love-language', current: true }
  ],
  
  '/tests/relationship/love-style': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'relationship', href: '/tests/relationship' },
    { label: 'love-style', current: true }
  ],
  
  '/tests/relationship/interpersonal': [
    { label: 'home', href: '/' },
    { label: 'testcenter', href: '/tests' },
    { label: 'relationship', href: '/tests/relationship' },
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
