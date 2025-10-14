/**
 * 内容质量检查工具
 * 用于分析和优化页面内容质量
 */

import { CONTENT_STRUCTURE_CONFIG } from '@/config/contentSEO';

export interface ContentQualityMetrics {
  wordCount: number;
  headingCount: number;
  keywordDensity: Record<string, number>;
  readabilityScore: number;
  suggestions: string[];
  qualityScore: number;
}

/**
 * 分析内容质量
 */
export const analyzeContentQuality = (
  content: string,
  keywords: string[],
  pageType: keyof typeof CONTENT_STRUCTURE_CONFIG.CONTENT_LENGTH
): ContentQualityMetrics => {
  const wordCount = content.split(/\s+/).length;
  const headingCount = (content.match(/^#{1,6}\s+/gm) || []).length;
  
  // 计算关键词密度
  const keywordDensity: Record<string, number> = {};
  const contentLower = content.toLowerCase();
  
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    const matches = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length;
    keywordDensity[keyword] = (matches / wordCount) * 100;
  });
  
  // 计算可读性分数（简化版Flesch Reading Ease）
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = content.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((total, word) => total + countSyllables(word), 0);
  
  const readabilityScore = 206.835 - (1.015 * (words.length / sentences.length)) - (84.6 * (syllables / words.length));
  
  // 生成优化建议
  const suggestions: string[] = [];
  const lengthConfig = CONTENT_STRUCTURE_CONFIG.CONTENT_LENGTH[pageType];
  
  if (lengthConfig) {
    if (wordCount < lengthConfig.min) {
      suggestions.push(`Increase content length (current: ${wordCount} words, recommended: ${lengthConfig.optimal} words)`);
    } else if (wordCount > lengthConfig.max) {
      suggestions.push(`Consider reducing content length (current: ${wordCount} words, recommended: ${lengthConfig.optimal} words)`);
    }
  }
  
  if (headingCount < 2) {
    suggestions.push('Add more headings to improve content structure');
  }
  
  if (readabilityScore < 60) {
    suggestions.push('Improve readability by using shorter sentences and simpler words');
  }
  
  // 检查关键词密度
  Object.entries(keywordDensity).forEach(([keyword, density]) => {
    const config = CONTENT_STRUCTURE_CONFIG.KEYWORD_DENSITY.primary;
    if (density < config.min) {
      suggestions.push(`Increase usage of "${keyword}" (current: ${density.toFixed(1)}%, recommended: ${config.optimal}%)`);
    } else if (density > config.max) {
      suggestions.push(`Reduce usage of "${keyword}" (current: ${density.toFixed(1)}%, recommended: ${config.optimal}%)`);
    }
  });
  
  // 计算质量分数
  let qualityScore = 100;
  
  // 长度分数
  if (lengthConfig) {
    const lengthRatio = wordCount / lengthConfig.optimal;
    if (lengthRatio < 0.8 || lengthRatio > 1.2) {
      qualityScore -= 20;
    }
  }
  
  // 结构分数
  if (headingCount < 2) {
    qualityScore -= 15;
  }
  
  // 可读性分数
  if (readabilityScore < 60) {
    qualityScore -= 25;
  }
  
  // 关键词密度分数
  const keywordScore = Object.values(keywordDensity).reduce((score, density) => {
    const config = CONTENT_STRUCTURE_CONFIG.KEYWORD_DENSITY.primary;
    if (density >= config.min && density <= config.max) {
      return score + 10;
    }
    return score - 5;
  }, 0);
  
  qualityScore = Math.max(0, qualityScore + keywordScore);
  
  return {
    wordCount,
    headingCount,
    keywordDensity,
    readabilityScore: Math.round(readabilityScore),
    suggestions,
    qualityScore: Math.round(qualityScore)
  };
};

/**
 * 计算单词音节数（简化版）
 */
const countSyllables = (word: string): number => {
  const vowels = 'aeiouy';
  let count = 0;
  let previousWasVowel = false;
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]?.toLowerCase() || '');
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }
  
  // 处理以'e'结尾的单词
  if (word.endsWith('e') && count > 1) {
    count--;
  }
  
  return Math.max(1, count);
};

/**
 * 生成内容优化建议
 */
export const generateContentSuggestions = (
  content: string,
  keywords: string[],
  pageType: keyof typeof CONTENT_STRUCTURE_CONFIG.CONTENT_LENGTH
): string[] => {
  const metrics = analyzeContentQuality(content, keywords, pageType);
  const suggestions: string[] = [];
  
  // 基于质量指标生成建议
  if (metrics.qualityScore < 70) {
    suggestions.push('Content quality needs improvement. Focus on the suggestions below.');
  }
  
  // 添加具体建议
  suggestions.push(...metrics.suggestions);
  
  // 添加通用建议
  if (content.length < 500) {
    suggestions.push('Consider adding more detailed information to provide value to users');
  }
  
  if (!content.includes('?')) {
    suggestions.push('Add questions to engage readers and improve user interaction');
  }
  
  if (!content.includes('!')) {
    suggestions.push('Use exclamation points to create excitement and engagement');
  }
  
  return suggestions;
};

/**
 * 检查内容是否包含必要的SEO元素
 */
export const checkSEOElements = (content: string, title: string, description: string): {
  hasTitle: boolean;
  hasDescription: boolean;
  hasHeadings: boolean;
  hasKeywords: boolean;
  hasInternalLinks: boolean;
  hasImages: boolean;
  score: number;
} => {
  const hasTitle = title.length > 10 && title.length < 60;
  const hasDescription = description.length > 120 && description.length < 160;
  const hasHeadings = /^#{1,6}\s+/gm.test(content);
  const hasKeywords = content.length > 0;
  const hasInternalLinks = /\[.*?\]\(.*?\)/g.test(content) || /<a\s+href/g.test(content);
  const hasImages = /!\[.*?\]\(.*?\)/g.test(content) || /<img\s+src/g.test(content);
  
  let score = 0;
  if (hasTitle) score += 20;
  if (hasDescription) score += 20;
  if (hasHeadings) score += 20;
  if (hasKeywords) score += 20;
  if (hasInternalLinks) score += 10;
  if (hasImages) score += 10;
  
  return {
    hasTitle,
    hasDescription,
    hasHeadings,
    hasKeywords,
    hasInternalLinks,
    hasImages,
    score
  };
};
