/**
 * 性能优化配置
 * 集中管理性能相关的配置参数
 */

// 懒加载配置
export const LAZY_LOAD_CONFIG = {
  // 图片懒加载阈值
  IMAGE_THRESHOLD: 0.1,
  // 组件懒加载阈值
  COMPONENT_THRESHOLD: 0.1,
  // 预加载延迟时间（毫秒）
  PRELOAD_DELAY: 2000,
  // 关键资源预加载时间（毫秒）
  CRITICAL_PRELOAD_DELAY: 1000,
} as const;

// 代码分割配置
export const CODE_SPLITTING_CONFIG = {
  // 最大chunk大小（KB）
  MAX_CHUNK_SIZE: 200,
  // 最小chunk大小（KB）
  MIN_CHUNK_SIZE: 20,
  // 关键模块优先级
  CRITICAL_MODULES: [
    'vendor',
    'router',
    'ui',
    'shared',
  ],
  // 非关键模块
  NON_CRITICAL_MODULES: [
    'psychology',
    'career',
    'astrology',
    'tarot',
    'numerology',
    'learning',
    'relationship',
  ],
} as const;

// 缓存配置
export const CACHE_CONFIG = {
  // 静态资源缓存时间（秒）
  STATIC_CACHE_TIME: 60 * 60 * 24 * 30, // 30天
  // API缓存时间（秒）
  API_CACHE_TIME: 60 * 60 * 24, // 1天
  // 图片缓存时间（秒）
  IMAGE_CACHE_TIME: 60 * 60 * 24 * 7, // 7天
  // 字体缓存时间（秒）
  FONT_CACHE_TIME: 60 * 60 * 24 * 365, // 1年
} as const;

// 性能监控配置
export const PERFORMANCE_CONFIG = {
  // Core Web Vitals阈值
  LCP_THRESHOLD: 2500, // 毫秒
  FID_THRESHOLD: 100, // 毫秒
  CLS_THRESHOLD: 0.1, // 无单位
  FCP_THRESHOLD: 1800, // 毫秒
  TTFB_THRESHOLD: 600, // 毫秒
  
  // 性能评分权重
  SCORE_WEIGHTS: {
    LCP: 0.3,
    FID: 0.25,
    CLS: 0.25,
    FCP: 0.2,
  },
} as const;

// 预加载配置
export const PRELOAD_CONFIG = {
  // 关键路由
  CRITICAL_ROUTES: [
    '/',
    '/tests',
    '/psychology',
    '/career',
  ],
  // 关键API
  CRITICAL_APIS: [
    '/psychology/questions',
    '/career/questions',
    '/astrology/services',
  ],
  // 关键图片
  CRITICAL_IMAGES: [
    '/images/hero-bg.jpg',
    '/assets/logo.png',
  ],
  // 关键字体
  CRITICAL_FONTS: [
    '/fonts/inter-var.woff2',
  ],
} as const;

// 压缩配置
export const COMPRESSION_CONFIG = {
  // 图片压缩质量
  IMAGE_QUALITY: 85,
  // 支持的图片格式
  SUPPORTED_FORMATS: ['webp', 'avif', 'jpg', 'png'],
  // 图片尺寸断点
  IMAGE_BREAKPOINTS: [320, 640, 768, 1024, 1280, 1920],
  // 响应式图片配置
  RESPONSIVE_IMAGES: {
    mobile: { width: 640, quality: 80 },
    tablet: { width: 1024, quality: 85 },
    desktop: { width: 1920, quality: 90 },
  },
} as const;

// 性能优化建议
export const PERFORMANCE_TIPS = {
  LCP: [
    '优化图片大小和格式',
    '使用CDN加速',
    '预加载关键资源',
    '优化服务器响应时间',
  ],
  FID: [
    '减少JavaScript执行时间',
    '使用代码分割',
    '优化第三方脚本',
    '使用Web Workers',
  ],
  CLS: [
    '为图片设置尺寸属性',
    '避免动态内容插入',
    '使用骨架屏',
    '预加载字体',
  ],
  FCP: [
    '减少阻塞渲染的资源',
    '优化CSS加载',
    '内联关键CSS',
    '使用HTTP/2推送',
  ],
} as const;