/**
 * 统一常量定义
 * 遵循统一开发标准的常量命名规范
 */
export declare const API_ENDPOINTS: {
    readonly TESTS: "/api/tests";
    readonly BLOG: "/api/blog";
    readonly FEEDBACK: "/api/feedback";
    readonly ANALYTICS: "/api/analytics";
};
export declare const TEST_TYPES: {
    readonly PSYCHOLOGY: "psychology";
    readonly ASTROLOGY: "astrology";
    readonly TAROT: "tarot";
    readonly CAREER: "career";
    readonly LEARNING: "learning";
    readonly RELATIONSHIP: "relationship";
    readonly NUMEROLOGY: "numerology";
};
export declare const MODULE_THEMES: {
    readonly PSYCHOLOGY: "psychology";
    readonly ASTROLOGY: "constellation";
    readonly TAROT: "tarot";
    readonly CAREER: "career";
    readonly LEARNING: "primary";
    readonly RELATIONSHIP: "primary";
    readonly NUMEROLOGY: "primary";
};
export declare const RESPONSIVE_BREAKPOINTS: {
    readonly MOBILE: "320px";
    readonly TABLET: "768px";
    readonly DESKTOP: "1024px";
    readonly LARGE: "1280px";
};
export declare const CACHE_KEYS: {
    readonly TEST_CONFIG: "test_config:";
    readonly TEST_RESULT: "test_result:";
    readonly BLOG_ARTICLE: "blog_article:";
    readonly USER_SESSION: "user_session:";
};
export declare const DB_TABLES: {
    readonly TEST_TYPES: "test_types";
    readonly TEST_SESSIONS: "test_sessions";
    readonly BLOG_ARTICLES: "blog_articles";
    readonly USER_FEEDBACK: "user_feedback";
    readonly ANALYTICS_EVENTS: "analytics_events";
    readonly SYS_CONFIGS: "sys_configs";
};
