/**
 * 移动端SEO配置
 * 专门针对移动端搜索优化的配置和工具
 */

// 移动端断点配置
export const MOBILE_BREAKPOINTS = {
  mobile: '320px',
  mobileLarge: '480px',
  tablet: '768px',
  tabletLarge: '1024px',
  desktop: '1280px'
} as const;

// 移动端SEO元标签配置
export const MOBILE_SEO_META = {
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes',
  themeColor: '#6366f1',
  mobileWebAppCapable: 'yes',
  appleMobileWebAppCapable: 'yes',
  appleMobileWebAppStatusBarStyle: 'default',
  formatDetection: 'telephone=no'
} as const;

// 移动端性能优化配置
export const MOBILE_PERFORMANCE_CONFIG = {
  // 图片优化
  imageOptimization: {
    maxWidth: 800,
    quality: 85,
    formats: ['webp', 'avif', 'jpg'],
    lazyLoading: true,
    placeholder: 'blur'
  },
  
  // 字体优化
  fontOptimization: {
    preload: true,
    display: 'swap',
    fallback: 'system-ui, -apple-system, sans-serif'
  },
  
  // 资源优化
  resourceOptimization: {
    criticalCSS: true,
    deferNonCritical: true,
    minifyHTML: true,
    compressAssets: true
  },
  
  // 缓存策略
  caching: {
    staticAssets: '1y',
    apiResponses: '1h',
    images: '30d',
    fonts: '1y'
  }
} as const;

// 移动端触摸目标配置
export const MOBILE_TOUCH_TARGETS = {
  minSize: 44, // 最小触摸目标尺寸 (px)
  minSpacing: 8, // 最小间距 (px)
  recommendedSize: 48, // 推荐触摸目标尺寸 (px)
  recommendedSpacing: 12 // 推荐间距 (px)
} as const;

// 移动端导航配置
export const MOBILE_NAVIGATION_CONFIG = {
  hamburgerMenu: {
    enabled: true,
    position: 'top-right',
    animation: 'slide'
  },
  bottomNavigation: {
    enabled: false,
    items: []
  },
  breadcrumbs: {
    enabled: true,
    maxItems: 3,
    separator: '>'
  }
} as const;

// 移动端表单配置
export const MOBILE_FORM_CONFIG = {
  inputTypes: {
    email: 'email',
    phone: 'tel',
    number: 'number',
    date: 'date',
    time: 'time'
  },
  validation: {
    realTime: true,
    showErrors: true,
    errorPosition: 'below'
  },
  autocomplete: {
    enabled: true,
    suggestions: 5
  }
} as const;

// 移动端SEO关键词配置
export const MOBILE_SEO_KEYWORDS = {
  primary: [
    'mobile psychological tests',
    'phone personality test',
    'mobile career assessment',
    'smartphone astrology',
    'mobile tarot reading'
  ],
  secondary: [
    'responsive design',
    'mobile friendly',
    'touch optimized',
    'mobile app alternative',
    'on-the-go testing'
  ],
  longTail: [
    'best mobile psychological tests',
    'free mobile personality assessment',
    'mobile career guidance app',
    'smartphone astrology reading',
    'mobile tarot card reading'
  ]
} as const;

// 移动端结构化数据配置
export const MOBILE_STRUCTURED_DATA = {
  WebSite: {
    '@type': 'WebSite',
    name: 'SelfAtlas - Mobile Testing Platform',
    url: 'https://selfatlas.net',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://selfatlas.net/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  },
  MobileApplication: {
    '@type': 'MobileApplication',
    name: 'SelfAtlas',
    operatingSystem: 'Web Browser',
    applicationCategory: 'LifestyleApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  }
} as const;

// 移动端性能监控配置
export const MOBILE_PERFORMANCE_MONITORING = {
  // Core Web Vitals 移动端阈值
  thresholds: {
    LCP: 2500, // 2.5秒
    FID: 100,  // 100毫秒
    CLS: 0.1,  // 0.1
    FCP: 1800, // 1.8秒
    TTFB: 600  // 600毫秒
  },
  
  // 移动端特定指标
  mobileSpecific: {
    touchDelay: 300, // 触摸延迟阈值
    scrollPerformance: 60, // 滚动性能阈值 (FPS)
    memoryUsage: 50, // 内存使用阈值 (MB)
    batteryImpact: 'low' // 电池影响级别
  }
} as const;

// 移动端用户体验配置
export const MOBILE_UX_CONFIG = {
  // 手势支持
  gestures: {
    swipe: true,
    pinch: true,
    doubleTap: true,
    longPress: true
  },
  
  // 动画配置
  animations: {
    duration: 300, // 动画持续时间 (ms)
    easing: 'ease-out',
    reduceMotion: true // 支持减少动画偏好
  },
  
  // 反馈配置
  feedback: {
    haptic: true,
    visual: true,
    audio: false
  }
} as const;

// 移动端SEO检查清单
export const MOBILE_SEO_CHECKLIST = {
  technical: [
    'Responsive design implemented',
    'Viewport meta tag configured',
    'Touch targets meet minimum size requirements',
    'Page speed optimized for mobile',
    'Images optimized for mobile devices',
    'Fonts optimized for mobile loading',
    'Critical CSS inlined',
    'Non-critical resources deferred'
  ],
  content: [
    'Content readable without horizontal scrolling',
    'Text size appropriate for mobile reading',
    'Images scale properly on mobile',
    'Forms optimized for mobile input',
    'Navigation accessible on mobile',
    'Call-to-action buttons easily tappable'
  ],
  performance: [
    'LCP under 2.5 seconds',
    'FID under 100 milliseconds',
    'CLS under 0.1',
    'Page loads under 3 seconds on 3G',
    'Images lazy loaded',
    'JavaScript minified and compressed',
    'CSS optimized and minified',
    'Caching headers properly set'
  ]
} as const;

// 移动端SEO优化建议
export const MOBILE_SEO_RECOMMENDATIONS = {
  performance: [
    'Implement critical CSS inlining',
    'Use WebP and AVIF image formats',
    'Enable text compression (gzip/brotli)',
    'Minimize JavaScript and CSS',
    'Use a Content Delivery Network (CDN)',
    'Implement service worker for caching'
  ],
  usability: [
    'Ensure touch targets are at least 44px',
    'Use clear, readable fonts (16px minimum)',
    'Provide adequate spacing between elements',
    'Make forms mobile-friendly',
    'Implement thumb-friendly navigation',
    'Test on actual mobile devices'
  ],
  seo: [
    'Optimize for mobile-first indexing',
    'Use mobile-friendly structured data',
    'Ensure fast mobile page speeds',
    'Implement mobile-specific meta tags',
    'Create mobile-optimized content',
    'Test with Google Mobile-Friendly Test'
  ]
} as const;
