/**
 * SEO配置中心
 * 统一管理所有页面的SEO元数据
 */

import { getLocationOrigin, getLocationPathname } from '@/utils/browserEnv';

const DEFAULT_SITE_ORIGIN = 'https://selfatlas.net';

const isLocalOrPreviewOrigin = (origin: string): boolean => {
  return origin.includes('localhost') || origin.includes('pages.dev');
};

export const getSiteOrigin = (): string => {
  const origin = getLocationOrigin(DEFAULT_SITE_ORIGIN);

  if (isLocalOrPreviewOrigin(origin)) {
    return origin;
  }

  return DEFAULT_SITE_ORIGIN;
};

export const buildAbsoluteUrl = (path: string): string => {
  if (!path) {
    return getSiteOrigin();
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${getSiteOrigin()}${normalizedPath}`;
};

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[] | string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  structuredData?: any;
}

// 基础SEO配置
export const BASE_SEO: SEOConfig = {
  title: 'Comprehensive Testing Platform',
  description: 'Professional psychological tests, astrological analysis, tarot reading and other online testing services. Discover your personality, career path, and life insights.',
  keywords: [
    'psychological tests',
    'astrological analysis', 
    'tarot reading',
    'career tests',
    'learning ability',
    'emotional relationships',
    'personality assessment',
    'online testing'
  ],
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image'
};

// 测试模块SEO配置
export const TEST_MODULE_SEO: Record<string, SEOConfig> = {
  psychology: {
    title: 'Professional Psychological Tests | Comprehensive Testing Platform',
    description: 'Take professional psychological tests including MBTI, EQ, PHQ-9, and more. Get detailed personality analysis and insights.',
    keywords: [
      'psychological tests',
      'MBTI test',
      'emotional intelligence test',
      'personality assessment',
      'mental health test',
      'psychological evaluation'
    ],
    ogTitle: 'Professional Psychological Tests',
    ogDescription: 'Comprehensive psychological testing platform with professional analysis'
  },
  
  astrology: {
    title: 'Free Astrological Analysis & Birth Chart Reading | Comprehensive Testing Platform',
    description: 'Get free astrological analysis, birth chart reading, horoscope predictions, and compatibility tests. Professional astrological insights.',
    keywords: [
      'astrological analysis',
      'birth chart reading',
      'horoscope',
      'astrology compatibility',
      'zodiac signs',
      'astrological predictions'
    ],
    ogTitle: 'Free Astrological Analysis',
    ogDescription: 'Professional astrological analysis and birth chart reading'
  },
  
  tarot: {
    title: 'Online Tarot Card Reading & Fortune Telling | Comprehensive Testing Platform',
    description: 'Get free online tarot card reading, fortune telling, and spiritual guidance. Professional tarot interpretations and insights.',
    keywords: [
      'tarot reading',
      'fortune telling',
      'tarot cards',
      'spiritual guidance',
      'tarot interpretation',
      'divination'
    ],
    ogTitle: 'Online Tarot Card Reading',
    ogDescription: 'Professional tarot card reading and spiritual guidance'
  },
  
  career: {
    title: 'Career Assessment & Job Matching Tests | Comprehensive Testing Platform',
    description: 'Take professional career assessment tests including DISC, Holland Code, and leadership tests. Find your ideal career path.',
    keywords: [
      'career assessment',
      'job matching',
      'DISC test',
      'Holland Code',
      'leadership test',
      'career guidance'
    ],
    ogTitle: 'Career Assessment Tests',
    ogDescription: 'Professional career assessment and job matching tests'
  },
  
  relationship: {
    title: 'Relationship & Love Compatibility Tests | Comprehensive Testing Platform',
    description: 'Take relationship compatibility tests, love language assessment, and interpersonal skills tests. Improve your relationships.',
    keywords: [
      'relationship test',
      'love compatibility',
      'love language test',
      'interpersonal skills',
      'relationship advice',
      'couple compatibility'
    ],
    ogTitle: 'Relationship Compatibility Tests',
    ogDescription: 'Professional relationship and love compatibility testing'
  }
};

// 具体测试SEO配置
export const SPECIFIC_TEST_SEO: Record<string, SEOConfig> = {
  'mbti': {
    title: 'Free MBTI Personality Test | 16 Personalities Assessment',
    description: 'Take the free MBTI personality test to discover your 16 personality type. Get detailed analysis of your strengths, weaknesses, and career preferences.',
    keywords: ['MBTI test', '16 personalities', 'personality type', 'Myers-Briggs', 'personality assessment'],
    ogTitle: 'Free MBTI Personality Test',
    ogDescription: 'Discover your personality type with our free MBTI test'
  },
  
  'eq': {
    title: 'Free Emotional Intelligence Test | EQ Assessment',
    description: 'Take our free emotional intelligence test to measure your EQ. Get insights into self-awareness, self-management, and social skills.',
    keywords: ['emotional intelligence test', 'EQ test', 'emotional quotient', 'EI assessment', 'emotional skills'],
    ogTitle: 'Free Emotional Intelligence Test',
    ogDescription: 'Measure your emotional intelligence with our free EQ test'
  },
  
  'phq9': {
    title: 'Free PHQ-9 Depression Screening Test | Mental Health Assessment',
    description: 'Take the free PHQ-9 depression screening test to assess your mental health. Get professional insights and recommendations.',
    keywords: ['PHQ-9 test', 'depression screening', 'mental health test', 'depression assessment', 'mood evaluation'],
    ogTitle: 'Free PHQ-9 Depression Screening',
    ogDescription: 'Professional depression screening with PHQ-9 test'
  },
  
  'birth-chart': {
    title: 'Free Birth Chart Reading | Astrological Analysis',
    description: 'Get your free birth chart reading and astrological analysis. Discover your sun, moon, and rising signs with detailed interpretations.',
    keywords: ['birth chart', 'astrological analysis', 'natal chart', 'zodiac signs', 'astrology reading'],
    ogTitle: 'Free Birth Chart Reading',
    ogDescription: 'Professional birth chart analysis and astrological insights'
  },
  
  'tarot-reading': {
    title: 'Free Tarot Card Reading | Online Fortune Telling',
    description: 'Get your free tarot card reading online. Professional tarot interpretations and spiritual guidance for your life questions.',
    keywords: ['tarot reading', 'fortune telling', 'tarot cards', 'spiritual guidance', 'divination'],
    ogTitle: 'Free Tarot Card Reading',
    ogDescription: 'Professional tarot card reading and spiritual guidance'
  }
};

// 结果页面SEO配置
export const RESULT_PAGE_SEO: Record<string, SEOConfig> = {
  psychology: {
    title: 'Your Psychological Test Results | Comprehensive Analysis',
    description: 'View your detailed psychological test results with professional analysis and personalized recommendations.',
    keywords: ['test results', 'psychological analysis', 'personality results', 'test interpretation'],
    ogTitle: 'Your Psychological Test Results',
    ogDescription: 'Detailed psychological test results and analysis'
  },
  
  astrology: {
    title: 'Your Astrological Analysis Results | Birth Chart Reading',
    description: 'View your detailed astrological analysis and birth chart reading results with professional interpretations.',
    keywords: ['astrology results', 'birth chart analysis', 'astrological reading', 'zodiac interpretation'],
    ogTitle: 'Your Astrological Analysis Results',
    ogDescription: 'Detailed astrological analysis and birth chart reading'
  },
  
  tarot: {
    title: 'Your Tarot Reading Results | Card Interpretation',
    description: 'View your tarot card reading results with detailed interpretations and spiritual guidance.',
    keywords: ['tarot results', 'card interpretation', 'tarot reading', 'spiritual guidance'],
    ogTitle: 'Your Tarot Reading Results',
    ogDescription: 'Detailed tarot card reading and interpretation'
  }
};

// 生成结构化数据
export function generateStructuredData(type: string, data: any): any {
  const fallbackUrl = data.url || buildAbsoluteUrl(getLocationPathname('/'));
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.title || BASE_SEO.title,
    description: data.description || BASE_SEO.description,
    url: fallbackUrl,
    publisher: {
      '@type': 'Organization',
      name: 'Comprehensive Testing Platform',
      url: DEFAULT_SITE_ORIGIN
    }
  };

  switch (type) {
    case 'test':
      return {
        ...baseStructuredData,
        '@type': 'Test',
        about: data.testType,
        category: 'Psychological Test'
      };
      
    case 'test-result':
      return {
        ...baseStructuredData,
        '@type': 'TestResult',
        result: data.result,
        testType: data.testType
      };
      
    case 'article':
      return {
        ...baseStructuredData,
        '@type': 'Article',
        author: {
          '@type': 'Person',
          name: 'Comprehensive Testing Platform'
        },
        datePublished: data.datePublished,
        dateModified: data.dateModified
      };
      
    default:
      return baseStructuredData;
  }
}

// 获取SEO配置的工具函数
export function getSEOConfig(path: string, testType?: string, testId?: string): SEOConfig {
  // 结果页面
  if (path.includes('/result')) {
    const module = path.split('/')[1];
    return RESULT_PAGE_SEO[module as keyof typeof RESULT_PAGE_SEO] || BASE_SEO;
  }
  
  // 具体测试页面
  if (testId && SPECIFIC_TEST_SEO[testId]) {
    return SPECIFIC_TEST_SEO[testId];
  }
  
  // 测试模块页面
  if (testType && TEST_MODULE_SEO[testType]) {
    return TEST_MODULE_SEO[testType];
  }
  
  // 默认配置
  return BASE_SEO;
}
