/**
 * 语言上下文
 * 提供全局语言状态管理和切换功能
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'zh-CN' | 'en-US';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language pack
const translations: Record<Language, Record<string, string>> = {
  'zh-CN': {
    // Navigation
    'nav.home': '首页',
    'nav.testCenter': '测试中心',
    'nav.blog': '博客',
    'nav.about': '关于我们',
    'nav.language': 'EN', // 显示切换后的语言
    
    // Hero Section
    'hero.title': '🌟 发现你的内心世界',
    'hero.subtitle': '专业的心理测试与占星分析平台',
    'hero.description': '通过科学的心理测试、神秘的占星术和塔罗牌，帮助你更好地了解自己，找到人生的方向。我们的平台提供多种测试类型，从心理学到占星学，从职业规划到人际关系，全方位助力你的成长。',
    'hero.feature.psychology': '🔬 科学心理学测试',
    'hero.feature.astrology': '⭐ 专业占星分析',
    'hero.feature.tarot': '🎴 神秘塔罗占卜',
    'hero.feature.career': '💼 职业规划指导',
    'hero.feature.relationship': '❤️ 人际关系分析',
    'hero.feature.cognitive': '🧠 认知能力评估',
    'hero.cta.start': '开始测试',
    'hero.cta.learnMore': '了解更多',
    
    // 测试模块
    'testSection.title': '发现你的测试世界',
    'testSection.subtitle': '选择你感兴趣的测试类型，开始探索真实的自己',
    'testSection.footer': '所有测试均免费，无需注册，即测即得',
    
    // 博客区域
    'blog.title': '📚 精选文章',
    'blog.subtitle': '发现有趣的心理知识，提升自我认知',
    
    // 热门推荐区
    'popularSection.title': '今日最火爆测试',
    'popularSection.subtitle': '选择最受欢迎的测试，开始你的好运之旅',
    'popularSection.cta': '立即测试',
    'popularSection.viewMore': '查看更多测试',
    
    // 平台特色区
    'featuresSection.title': '为什么选择我们的心理测试平台',
    'featuresSection.subtitle': '专业的测试服务，值得您的信赖',
    'featuresSection.bottomTitle': '专业可信的心理测试服务',
    'featuresSection.bottomDescription': '我们致力于为用户提供最专业、最安全、最便捷的心理测试体验，让每个人都能更好地了解自己，发现好运。',
    'featuresSection.security': '隐私安全',
    'featuresSection.fast': '快速便捷',
    'featuresSection.accurate': '专业准确',
    
    // 搜索功能区
    'searchSection.title': '找到最适合你的测试',
    'searchSection.subtitle': '通过智能搜索，快速找到你需要的测试类型和内容',
    'searchSection.placeholder': '搜索心理测试、性格分析、星座运势...',
    'searchSection.search': '搜索',
    'searchSection.searching': '搜索中...',
    'searchSection.popularSearches': '热门搜索',
    'searchSection.categories': '搜索分类',
    'searchSection.psychology': '心理学测试',
    'searchSection.psychologyDesc': 'MBTI、抑郁筛查、情商评估等专业心理测试',
    'searchSection.astrology': '占星运势',
    'searchSection.astrologyDesc': '星座运势、星盘解读、运势预测等占星服务',
    'searchSection.career': '职业规划',
    'searchSection.careerDesc': '职业兴趣、能力评估、职业规划等专业指导',
    
    // 信任标识
    'trust.users': '已服务 10,000+ 用户',
    'trust.team': '专业心理学团队',
    'trust.ai': 'AI 智能分析',
    
    // 通用
    'common.loading': '加载中...',
    'common.error': '出错了',
    'common.retry': '重试',
  },
  'en-US': {
    // Navigation
    'nav.home': 'Home',
    'nav.testCenter': 'Test Center',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.language': '中文', // 显示切换后的语言
    
    // Hero Section
    'hero.title': '🌟 Discover Your Inner World',
    'hero.subtitle': 'Professional Psychological Testing & Astrology Analysis Platform',
    'hero.description': 'Through scientific psychological tests, mysterious astrology, and tarot cards, we help you better understand yourself and find direction in life. Our platform offers various test types, from psychology to astrology, from career planning to interpersonal relationships, fully assisting your growth.',
    'hero.feature.psychology': '🔬 Scientific Psychology Tests',
    'hero.feature.astrology': '⭐ Professional Astrology Analysis',
    'hero.feature.tarot': '🎴 Mysterious Tarot Divination',
    'hero.feature.career': '💼 Career Planning Guidance',
    'hero.feature.relationship': '❤️ Interpersonal Relationship Analysis',
    'hero.feature.cognitive': '🧠 Cognitive Ability Assessment',
    'hero.cta.start': 'Start Test',
    'hero.cta.learnMore': 'Learn More',
    
    // Test Section
    'testSection.title': 'Discover Your Test World',
    'testSection.subtitle': 'Choose the test type that interests you and start exploring your true self',
    'testSection.footer': 'All tests are free, no registration required, test and get results immediately',
    
    // Blog Section
    'blog.title': '📚 Featured Articles',
    'blog.subtitle': 'Discover interesting psychological knowledge and improve self-awareness',
    
    // Popular Section
    'popularSection.title': 'Today\'s Most Popular Tests',
    'popularSection.subtitle': 'Choose the most popular tests and start your lucky journey',
    'popularSection.cta': 'Take Test Now',
    'popularSection.viewMore': 'View More Tests',

    // Features Section
    'featuresSection.title': 'Why Choose Our Psychological Testing Platform',
    'featuresSection.subtitle': 'Professional Testing Service, Worth Your Trust',
    'featuresSection.bottomTitle': 'Professional Psychological Testing Service',
    'featuresSection.bottomDescription': 'We are committed to providing the most professional, safest, and most convenient psychological testing experience for users, allowing everyone to better understand themselves and discover good fortune.',
    'featuresSection.security': 'Privacy & Security',
    'featuresSection.fast': 'Fast & Convenient',
    'featuresSection.accurate': 'Accurate & Professional',

    // Search Section
    'searchSection.title': 'Find the Perfect Test for You',
    'searchSection.subtitle': 'Quickly find the test type and content you need through intelligent search',
    'searchSection.placeholder': 'Search psychological tests, personality analysis, horoscope...',
    'searchSection.search': 'Search',
    'searchSection.searching': 'Searching...',
    'searchSection.popularSearches': 'Popular Searches',
    'searchSection.categories': 'Search Categories',
    'searchSection.psychology': 'Psychological Tests',
    'searchSection.psychologyDesc': 'Professional psychological tests such as MBTI, depression screening, EQ assessment',
    'searchSection.astrology': 'Horoscope',
    'searchSection.astrologyDesc': 'Horoscope, horoscope interpretation, fortune prediction, etc.',
    'searchSection.career': 'Career Planning',
    'searchSection.careerDesc': 'Professional guidance such as career interest, ability assessment, career planning',
    
    // Trust Indicators
    'trust.users': 'Served 10,000+ Users',
    'trust.team': 'Professional Psychology Team',
    'trust.ai': 'AI Intelligent Analysis',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error occurred',
    'common.retry': 'Retry',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh-CN');

  // 从localStorage读取语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'zh-CN' || savedLanguage === 'en-US')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // 切换语言
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    // 更新HTML lang属性
    document.documentElement.lang = lang;
  };

  // 翻译函数
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
