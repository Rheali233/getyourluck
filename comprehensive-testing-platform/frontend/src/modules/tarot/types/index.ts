/**
 * Tarot Module Type Definitions
 * 塔罗牌模块类型定义
 * 遵循统一开发标准的类型定义规范
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
  emotional_insights?: string;
  spiritual_guidance?: string;
  warning_signs?: string;
  opportunities?: string;
  generated_at: string;
}

// 增强的基础解读
export interface BasicReading {
  summary: string;
  key_themes: string[];
  general_advice: string;
  question_focus?: string;
  reading_style?: string;
}

// 卡牌关联分析
export interface CardConnections {
  connections: any[];
  overall_flow: string;
  dominant_elements: Array<{ element: string; count: number }>;
  element_balance: string;
  number_patterns: string;
  reversal_pattern: string;
}

// 主题分析
export interface ThematicAnalysis {
  themes: {
    major_arcana_count: number;
    minor_arcana_count: number;
    reversed_count: number;
    upright_count: number;
  };
  reading_complexity: string;
  focus_areas: string[];
  energy_level: string;
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

export interface TarotFeedbackRequest {
  sessionId: string;
  feedback: 'like' | 'dislike';
  comment?: string;
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
