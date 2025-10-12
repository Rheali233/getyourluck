/**
 * 关键词优化Hook
 * 用于动态生成和优化页面关键词
 */

import { useMemo } from 'react';
import { KEYWORDS_CONFIG, CONTENT_STRUCTURE_CONFIG } from '@/config/contentSEO';

interface KeywordOptimizationOptions {
  pageType: 'homepage' | 'module' | 'test' | 'blog';
  moduleType?: string;
  testType?: string;
  customKeywords?: string[];
  content?: string;
}

export const useKeywordOptimization = (options: KeywordOptimizationOptions) => {
  const {
    pageType,
    moduleType,
    testType,
    customKeywords = [],
    content = ''
  } = options;

  // 生成基础关键词
  const baseKeywords = useMemo(() => {
    const keywords: string[] = [];
    
    // 添加品牌关键词
    keywords.push(...KEYWORDS_CONFIG.BRAND.primary);
    
    // 根据页面类型添加关键词
    switch (pageType) {
      case 'homepage':
        keywords.push(...KEYWORDS_CONFIG.BRAND.secondary);
        break;
      case 'module':
        if (moduleType && KEYWORDS_CONFIG[moduleType.toUpperCase() as keyof typeof KEYWORDS_CONFIG]) {
          const moduleKeywords = KEYWORDS_CONFIG[moduleType.toUpperCase() as keyof typeof KEYWORDS_CONFIG] as any;
          keywords.push(...moduleKeywords.primary);
          keywords.push(...moduleKeywords.secondary);
        }
        break;
      case 'test':
        if (testType && moduleType) {
          const moduleKeywords = KEYWORDS_CONFIG[moduleType.toUpperCase() as keyof typeof KEYWORDS_CONFIG] as any;
          keywords.push(...moduleKeywords.secondary);
          // 添加测试特定关键词
          keywords.push(`${testType} test`, `free ${testType} test`, `online ${testType} test`);
        }
        break;
      case 'blog':
        keywords.push('blog', 'articles', 'guides', 'tips');
        break;
    }
    
    // 添加自定义关键词
    keywords.push(...customKeywords);
    
    return [...new Set(keywords)]; // 去重
  }, [pageType, moduleType, testType, customKeywords]);

  // 生成长尾关键词
  const longTailKeywords = useMemo(() => {
    const longTail: string[] = [];
    
    if (moduleType && KEYWORDS_CONFIG[moduleType.toUpperCase() as keyof typeof KEYWORDS_CONFIG]) {
      const moduleKeywords = KEYWORDS_CONFIG[moduleType.toUpperCase() as keyof typeof KEYWORDS_CONFIG] as any;
      longTail.push(...moduleKeywords.longTail);
    }
    
    // 根据内容生成长尾关键词
    if (content) {
      const contentWords = content.toLowerCase().split(/\s+/);
      const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
      const meaningfulWords = contentWords.filter(word => 
        word.length > 3 && !commonWords.includes(word)
      );
      
      // 生成2-3词组合
      for (let i = 0; i < meaningfulWords.length - 1; i++) {
        const phrase = `${meaningfulWords[i]} ${meaningfulWords[i + 1]}`;
        if (phrase.length > 5 && phrase.length < 30) {
          longTail.push(phrase);
        }
      }
    }
    
    return [...new Set(longTail)].slice(0, 10); // 限制数量
  }, [moduleType, content]);

  // 生成页面标题
  const optimizedTitle = useMemo(() => {
    const brand = KEYWORDS_CONFIG.BRAND.primary[0];
    
    switch (pageType) {
      case 'homepage':
        return `${brand} - Professional Online Tests & Analysis`;
      case 'module':
        if (moduleType) {
          const moduleKeywords = KEYWORDS_CONFIG[moduleType.toUpperCase() as keyof typeof KEYWORDS_CONFIG] as any;
          return `${moduleKeywords.primary[0]} - ${brand}`;
        }
        return `${brand} - Professional Analysis`;
      case 'test':
        if (testType) {
          return `Free ${testType.toUpperCase()} Test - ${brand}`;
        }
        return `Professional Test - ${brand}`;
      case 'blog':
        return `Blog - ${brand}`;
      default:
        return brand;
    }
  }, [pageType, moduleType, testType]);

  // 生成页面描述
  const optimizedDescription = useMemo(() => {
    const brand = KEYWORDS_CONFIG.BRAND.primary[0];
    
    switch (pageType) {
      case 'homepage':
        return `Take professional psychological tests, career assessments, astrology readings, and more at ${brand}. Get detailed analysis and personalized insights for self-discovery and growth.`;
      case 'module':
        if (moduleType) {
          const moduleKeywords = KEYWORDS_CONFIG[moduleType.toUpperCase() as keyof typeof KEYWORDS_CONFIG] as any;
          return `Professional ${moduleKeywords.primary[0]} services at ${brand}. Get detailed analysis and personalized guidance for ${moduleKeywords.secondary[0]}.`;
        }
        return `Professional analysis services at ${brand}. Get detailed insights and personalized guidance.`;
      case 'test':
        if (testType) {
          return `Take our free ${testType.toUpperCase()} test at ${brand}. Get detailed results and personalized recommendations for ${testType} analysis.`;
        }
        return `Take our professional test at ${brand}. Get detailed results and personalized recommendations.`;
      case 'blog':
        return `Read our blog at ${brand} for insights on personality analysis, career guidance, and personal development. Expert tips and comprehensive guides.`;
      default:
        return `Professional testing and analysis services at ${brand}.`;
    }
  }, [pageType, moduleType, testType]);

  // 关键词密度分析
  const keywordDensity = useMemo(() => {
    if (!content) return {};
    
    const contentLower = content.toLowerCase();
    const wordCount = contentLower.split(/\s+/).length;
    
    const density: Record<string, number> = {};
    
    // 分析主要关键词密度
    baseKeywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      const matches = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length;
      density[keyword] = (matches / wordCount) * 100;
    });
    
    return density;
  }, [content, baseKeywords]);

  // 关键词优化建议
  const optimizationSuggestions = useMemo(() => {
    const suggestions: string[] = [];
    
    // 检查关键词密度
    Object.entries(keywordDensity).forEach(([keyword, density]) => {
      const config = CONTENT_STRUCTURE_CONFIG.KEYWORD_DENSITY.primary;
      if (density < config.min) {
        suggestions.push(`Increase usage of "${keyword}" (current: ${density.toFixed(1)}%, recommended: ${config.optimal}%)`);
      } else if (density > config.max) {
        suggestions.push(`Reduce usage of "${keyword}" (current: ${density.toFixed(1)}%, recommended: ${config.optimal}%)`);
      }
    });
    
    // 检查内容长度
    const wordCount = content.split(/\s+/).length;
    const lengthConfig = CONTENT_STRUCTURE_CONFIG.CONTENT_LENGTH[pageType as keyof typeof CONTENT_STRUCTURE_CONFIG.CONTENT_LENGTH];
    if (lengthConfig) {
      if (wordCount < lengthConfig.min) {
        suggestions.push(`Increase content length (current: ${wordCount} words, recommended: ${lengthConfig.optimal} words)`);
      } else if (wordCount > lengthConfig.max) {
        suggestions.push(`Consider reducing content length (current: ${wordCount} words, recommended: ${lengthConfig.optimal} words)`);
      }
    }
    
    // 检查标题结构
    const headingCount = (content.match(/^#{1,6}\s+/gm) || []).length;
    if (headingCount < 2) {
      suggestions.push('Add more headings to improve content structure');
    }
    
    return suggestions;
  }, [keywordDensity, content, pageType]);

  // 生成语义化关键词
  const semanticKeywords = useMemo(() => {
    const semantic: string[] = [];
    
    // 添加同义词
    const synonyms: Record<string, string[]> = {
      'test': ['assessment', 'evaluation', 'quiz', 'examination'],
      'analysis': ['evaluation', 'assessment', 'study', 'examination'],
      'personality': ['character', 'temperament', 'nature', 'disposition'],
      'career': ['profession', 'occupation', 'job', 'work'],
      'astrology': ['horoscope', 'zodiac', 'astrological', 'celestial'],
      'tarot': ['divination', 'fortune telling', 'card reading', 'prediction']
    };
    
    baseKeywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      Object.entries(synonyms).forEach(([key, values]) => {
        if (keywordLower.includes(key)) {
          semantic.push(...values);
        }
      });
    });
    
    return [...new Set(semantic)].slice(0, 5);
  }, [baseKeywords]);

  return {
    baseKeywords,
    longTailKeywords,
    semanticKeywords,
    optimizedTitle,
    optimizedDescription,
    keywordDensity,
    optimizationSuggestions,
    // 工具函数
    generateKeywordVariations: (keyword: string) => {
      return [
        keyword,
        `free ${keyword}`,
        `online ${keyword}`,
        `${keyword} test`,
        `${keyword} analysis`
      ];
    },
    checkKeywordInContent: (keyword: string) => {
      return content.toLowerCase().includes(keyword.toLowerCase());
    }
  };
};
