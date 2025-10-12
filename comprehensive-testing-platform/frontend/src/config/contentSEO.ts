/**
 * 内容SEO优化配置
 * 集中管理关键词、内部链接、内容结构等SEO策略
 */

// 核心关键词配置
export const KEYWORDS_CONFIG = {
  // 品牌关键词
  BRAND: {
    primary: ['SelfAtlas', 'Comprehensive Testing Platform'],
    secondary: ['online tests', 'professional assessment', 'personality analysis']
  },
  
  // 心理测试关键词
  PSYCHOLOGY: {
    primary: ['psychological tests', 'personality test', 'mental health assessment'],
    secondary: ['MBTI test', 'emotional intelligence', 'depression screening', 'happiness test'],
    longTail: [
      'free psychological tests online',
      'professional personality assessment',
      'mental health self evaluation',
      'what is my personality type test'
    ]
  },
  
  // 职业测试关键词
  CAREER: {
    primary: ['career test', 'career assessment', 'job compatibility test'],
    secondary: ['Holland career test', 'DISC assessment', 'leadership test', 'work style test'],
    longTail: [
      'what career is right for me test',
      'free career assessment online',
      'job compatibility analysis',
      'career path guidance test'
    ]
  },
  
  // 占星关键词
  ASTROLOGY: {
    primary: ['astrology reading', 'horoscope reading', 'zodiac compatibility'],
    secondary: ['birth chart analysis', 'astrological guidance', 'zodiac sign test'],
    longTail: [
      'free astrology reading online',
      'personalized horoscope analysis',
      'zodiac compatibility test',
      'birth chart interpretation'
    ]
  },
  
  // 塔罗关键词
  TAROT: {
    primary: ['tarot reading', 'tarot card reading', 'tarot spread'],
    secondary: ['tarot guidance', 'card interpretation', 'divination'],
    longTail: [
      'free tarot reading online',
      'tarot card spread reading',
      'personalized tarot guidance',
      'tarot divination test'
    ]
  },
  
  // 命理关键词
  NUMEROLOGY: {
    primary: ['numerology analysis', 'bazi analysis', 'chinese zodiac'],
    secondary: ['name analysis', 'birth chart numerology', 'destiny analysis'],
    longTail: [
      'free numerology analysis online',
      'bazi birth chart analysis',
      'chinese zodiac fortune reading',
      'name numerology analysis'
    ]
  },
  
  // 学习能力关键词
  LEARNING: {
    primary: ['learning style test', 'cognitive ability test', 'intelligence test'],
    secondary: ['VARK test', 'Raven matrices', 'learning assessment'],
    longTail: [
      'what is my learning style test',
      'free cognitive ability assessment',
      'learning style analysis online',
      'intelligence quotient test'
    ]
  },
  
  // 情感关系关键词
  RELATIONSHIP: {
    primary: ['relationship test', 'love language test', 'compatibility test'],
    secondary: ['love style test', 'interpersonal skills', 'relationship assessment'],
    longTail: [
      'what is my love language test',
      'relationship compatibility analysis',
      'free love language assessment',
      'interpersonal skills evaluation'
    ]
  }
} as const;

// 内部链接策略配置
export const INTERNAL_LINKING_CONFIG = {
  // 首页内部链接
  HOMEPAGE_LINKS: {
    // 主要模块链接
    primaryModules: [
      { path: '/psychology', text: 'Psychological Tests', keywords: ['personality test', 'mental health'] },
      { path: '/career', text: 'Career Assessment', keywords: ['career test', 'job compatibility'] },
      { path: '/astrology', text: 'Astrology Reading', keywords: ['horoscope', 'zodiac reading'] },
      { path: '/tarot', text: 'Tarot Reading', keywords: ['tarot card', 'divination'] },
      { path: '/numerology', text: 'Numerology Analysis', keywords: ['bazi analysis', 'chinese zodiac'] }
    ],
    
    // 热门测试链接
    popularTests: [
      { path: '/psychology/mbti', text: 'MBTI Personality Test', keywords: ['16 personalities', 'Myers-Briggs'] },
      { path: '/psychology/eq', text: 'Emotional Intelligence Test', keywords: ['EQ test', 'emotional quotient'] },
      { path: '/career/holland', text: 'Holland Career Test', keywords: ['career interest', 'job match'] },
      { path: '/astrology/fortune', text: 'Daily Horoscope', keywords: ['daily horoscope', 'zodiac fortune'] }
    ],
    
    // 相关文章链接
    relatedArticles: [
      { path: '/blog/personality-types', text: 'Understanding Personality Types', keywords: ['personality analysis', 'self discovery'] },
      { path: '/blog/career-guidance', text: 'Career Development Guide', keywords: ['career planning', 'professional growth'] },
      { path: '/blog/astrology-basics', text: 'Astrology for Beginners', keywords: ['astrology guide', 'zodiac signs'] }
    ]
  },
  
  // 模块页面内部链接
  MODULE_PAGE_LINKS: {
    psychology: [
      { path: '/psychology/mbti', text: 'MBTI Test', keywords: ['personality type'] },
      { path: '/psychology/eq', text: 'EQ Test', keywords: ['emotional intelligence'] },
      { path: '/psychology/phq9', text: 'Depression Screening', keywords: ['mental health'] },
      { path: '/psychology/happiness', text: 'Happiness Test', keywords: ['life satisfaction'] }
    ],
    career: [
      { path: '/career/holland', text: 'Holland Career Test', keywords: ['career interest'] },
      { path: '/career/disc', text: 'DISC Assessment', keywords: ['behavioral style'] },
      { path: '/career/leadership', text: 'Leadership Test', keywords: ['leadership skills'] }
    ],
    astrology: [
      { path: '/astrology/fortune', text: 'Horoscope Reading', keywords: ['daily horoscope'] },
      { path: '/astrology/compatibility', text: 'Zodiac Compatibility', keywords: ['zodiac match'] },
      { path: '/astrology/birth-chart', text: 'Birth Chart Analysis', keywords: ['natal chart'] }
    ]
  }
} as const;

// 内容结构优化配置
export const CONTENT_STRUCTURE_CONFIG = {
  // 标题层次结构
  HEADING_HIERARCHY: {
    h1: '页面主标题 - 包含主要关键词',
    h2: '主要章节标题 - 包含次要关键词',
    h3: '子章节标题 - 包含长尾关键词',
    h4: '详细内容标题 - 支持语义化'
  },
  
  // 内容长度建议
  CONTENT_LENGTH: {
    homepage: { min: 800, optimal: 1200, max: 2000 },
    modulePage: { min: 600, optimal: 1000, max: 1500 },
    testPage: { min: 400, optimal: 800, max: 1200 },
    blogPost: { min: 1000, optimal: 2000, max: 3000 }
  },
  
  // 关键词密度建议
  KEYWORD_DENSITY: {
    primary: { min: 1, optimal: 2, max: 3 }, // 主要关键词密度（%）
    secondary: { min: 0.5, optimal: 1, max: 2 }, // 次要关键词密度（%）
    longTail: { min: 0.2, optimal: 0.5, max: 1 } // 长尾关键词密度（%）
  }
} as const;

// 相关推荐配置
export const RELATED_CONTENT_CONFIG = {
  // 测试结果页面推荐
  TEST_RESULT_RECOMMENDATIONS: {
    mbti: [
      { type: 'test', path: '/psychology/eq', title: 'Emotional Intelligence Test', reason: 'Complete your personality profile' },
      { type: 'test', path: '/career/holland', title: 'Career Interest Test', reason: 'Find your ideal career path' },
      { type: 'article', path: '/blog/mbti-careers', title: 'MBTI Career Guide', reason: 'Explore career options for your type' }
    ],
    eq: [
      { type: 'test', path: '/psychology/mbti', title: 'MBTI Personality Test', reason: 'Understand your personality type' },
      { type: 'test', path: '/relationship/love-language', title: 'Love Language Test', reason: 'Improve your relationships' },
      { type: 'article', path: '/blog/emotional-intelligence', title: 'EQ Development Guide', reason: 'Learn to enhance your EQ' }
    ],
    holland: [
      { type: 'test', path: '/career/disc', title: 'DISC Assessment', reason: 'Understand your work style' },
      { type: 'test', path: '/psychology/mbti', title: 'MBTI Test', reason: 'Discover your personality type' },
      { type: 'article', path: '/blog/career-planning', title: 'Career Planning Guide', reason: 'Plan your professional future' }
    ]
  },
  
  // 模块页面推荐
  MODULE_RECOMMENDATIONS: {
    psychology: [
      { type: 'test', path: '/psychology/mbti', title: 'MBTI Personality Test', description: 'Discover your 16 personality type' },
      { type: 'test', path: '/psychology/eq', title: 'Emotional Intelligence Test', description: 'Measure your emotional quotient' },
      { type: 'article', path: '/blog/personality-analysis', title: 'Personality Analysis Guide', description: 'Learn about personality assessment' }
    ],
    career: [
      { type: 'test', path: '/career/holland', title: 'Holland Career Test', description: 'Find your career interests' },
      { type: 'test', path: '/career/disc', title: 'DISC Assessment', description: 'Understand your work style' },
      { type: 'article', path: '/blog/career-development', title: 'Career Development Tips', description: 'Advance your professional life' }
    ]
  }
} as const;

// SEO内容模板
export const SEO_CONTENT_TEMPLATES = {
  // 页面描述模板
  PAGE_DESCRIPTIONS: {
    homepage: 'Take professional {testType} tests including {testList}. Get detailed analysis and personalized insights for {benefit}.',
    modulePage: 'Comprehensive {moduleName} services including {serviceList}. Professional {moduleName} analysis and guidance.',
    testPage: 'Take our free {testName} to {testPurpose}. Get detailed {testName} results and personalized recommendations.',
    blogPost: 'Learn about {topic} with our comprehensive guide. Discover {benefits} and improve your {outcome}.'
  },
  
  // 标题模板
  TITLE_TEMPLATES: {
    homepage: '{Brand} - {PrimaryKeywords} | {SecondaryKeywords}',
    modulePage: '{ModuleName} - {PrimaryKeywords} | {Brand}',
    testPage: '{TestName} - {PrimaryKeywords} | {Brand}',
    blogPost: '{PostTitle} - {PrimaryKeywords} | {Brand}'
  },
  
  // 内容段落模板
  CONTENT_PARAGRAPHS: {
    introduction: 'Welcome to our {moduleName} section, where you can explore {serviceDescription}. Our professional {moduleName} services help you {benefit}.',
    features: 'Our {moduleName} platform offers {featureList}. Each {serviceType} is designed to {purpose} and provide {outcome}.',
    benefits: 'By taking our {testName}, you will {benefitList}. This comprehensive analysis helps you {outcome} and {improvement}.',
    callToAction: 'Ready to discover your {resultType}? Take our free {testName} now and get instant results with detailed analysis.'
  }
} as const;
