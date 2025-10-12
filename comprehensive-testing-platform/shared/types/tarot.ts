/**
 * Tarot Module Type Definitions
 * 塔罗牌模块共享类型定义
 */

// 塔罗牌基础信息
export interface TarotCard {
  id: string;
  name_zh: string;
  name_en: string;
  suit: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
  number: number;
  image_url: string;
  keywords_zh: string[];
  keywords_en: string[];
  meaning_upright_zh: string;
  meaning_upright_en: string;
  meaning_reversed_zh: string;
  meaning_reversed_en: string;
  element?: string;
  astrological_sign?: string;
  planet?: string;
  description_zh: string;
  description_en: string;
}

// 抽取的塔罗牌
export interface DrawnCard {
  card: TarotCard;
  position: number;
  isReversed: boolean;
  positionMeaning: string;
}

// 问题分类
export interface QuestionCategory {
  id: string;
  name_zh: string;
  name_en: string;
  description_zh: string;
  description_en: string;
  icon: string;
  color_theme: string;
  sort_order: number;
}

// 牌阵配置
export interface TarotSpread {
  id: string;
  name_zh: string;
  name_en: string;
  description_zh: string;
  description_en: string;
  card_count: number;
  layout_config: {
    positions: Array<{
      x: number;
      y: number;
      rotation?: number;
    }>;
  };
  positions: Array<{
    name: string;
    meaning: string;
  }>;
  difficulty_level: number;
  usage_count: number;
  is_active: boolean;
}

// AI解读结果
export interface AIReading {
  sessionId: string;
  overall_interpretation: string;
  card_interpretations: Array<{
    position: number;
    card_name: string;
    interpretation: string;
    advice: string;
  }>;
  synthesis: string;
  action_guidance: string[];
  timing_advice?: string;
  generated_at: string;
}

// 基础解读
export interface BasicReading {
  summary: string;
  key_themes: string[];
  general_advice: string;
}

// 塔罗牌占卜会话
export interface TarotSession {
  id: string;
  questionText: string;
  questionCategory: string;
  selectedSpread: TarotSpread;
  drawnCards: DrawnCard[];
  basicReading: BasicReading;
  aiReading: AIReading | null;
  createdAt: string;
}

// 推荐结果
export interface TarotRecommendation {
  spread: TarotSpread;
  reason: string;
  expectedDuration: string;
  difficultyLevel: number;
  description: string;
}

// API请求类型
export interface TarotDrawRequest {
  spreadId: string;
  questionText?: string;
  categoryId?: string;
  language?: string;
}

export interface TarotDrawResponse {
  sessionId: string;
  drawnCards: DrawnCard[];
  spread: TarotSpread;
  basicReading: BasicReading;
}

export interface TarotFeedbackRequest {
  sessionId: string;
  feedback: 'like' | 'dislike';
  comment?: string;
}

// 塔罗牌测试类型枚举
export enum TarotTestType {
  SINGLE_CARD = 'single_card',
  THREE_CARD = 'three_card',
  CELTIC_CROSS = 'celtic_cross',
  RELATIONSHIP = 'relationship',
  CAREER = 'career',
  DAILY_GUIDANCE = 'daily_guidance'
}

// 塔罗牌花色和元素
export const TAROT_SUITS = {
  major: 'Major Arcana',
  wands: 'Wands (Fire)',
  cups: 'Cups (Water)',
  swords: 'Swords (Air)',
  pentacles: 'Pentacles (Earth)'
} as const;

export const TAROT_ELEMENTS = {
  fire: ['wands'],
  water: ['cups'],
  air: ['swords'],
  earth: ['pentacles'],
  spirit: ['major']
} as const;

// 塔罗牌位置含义
export const POSITION_MEANINGS = {
  past: 'Past influences and experiences',
  present: 'Current situation and challenges',
  future: 'Future possibilities and outcomes',
  situation: 'Current situation',
  action: 'Recommended action',
  outcome: 'Likely outcome',
  challenge: 'Main challenge or obstacle',
  advice: 'Guidance and advice',
  environment: 'External influences',
  hopes_fears: 'Hopes and fears',
  result: 'Final outcome'
} as const;
