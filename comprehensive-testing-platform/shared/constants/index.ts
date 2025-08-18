/**
 * 统一常量定义
 * 遵循统一开发标准的常量命名规范
 */

// API端点常量
export const API_ENDPOINTS = {
  TESTS: "/api/tests",
  BLOG: "/api/blog",
  FEEDBACK: "/api/feedback",
  ANALYTICS: "/api/analytics",
} as const;

// 测试类型常量
export const TEST_TYPES = {
  PSYCHOLOGY: "psychology",
  ASTROLOGY: "astrology", 
  TAROT: "tarot",
  CAREER: "career",
  LEARNING: "learning",
  RELATIONSHIP: "relationship",
  NUMEROLOGY: "numerology",
} as const;

// 模块主题常量
export const MODULE_THEMES = {
  PSYCHOLOGY: "psychology",
  ASTROLOGY: "constellation", 
  TAROT: "tarot",
  CAREER: "career",
  LEARNING: "primary",
  RELATIONSHIP: "primary",
  NUMEROLOGY: "primary",
} as const;

// 响应式断点常量
export const RESPONSIVE_BREAKPOINTS = {
  MOBILE: "320px",
  TABLET: "768px", 
  DESKTOP: "1024px",
  LARGE: "1280px",
} as const;

// 缓存键前缀
export const CACHE_KEYS = {
  TEST_CONFIG: "test_config:",
  TEST_RESULT: "test_result:",
  BLOG_ARTICLE: "blog_article:",
  USER_SESSION: "user_session:",
} as const;

// 数据库表名
export const DB_TABLES = {
  TEST_TYPES: "test_types",
  TEST_SESSIONS: "test_sessions", 
  BLOG_ARTICLES: "blog_articles",
  USER_FEEDBACK: "user_feedback",
  ANALYTICS_EVENTS: "analytics_events",
  SYS_CONFIGS: "sys_configs",
} as const;