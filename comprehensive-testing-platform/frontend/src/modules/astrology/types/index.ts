/**
 * Astrology Module Type Definitions
 * 星座模块类型定义
 */

// 星座基础信息
export interface ZodiacSign {
  id: string;
  name_zh: string;
  name_en: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  quality: 'cardinal' | 'fixed' | 'mutable';
  ruling_planet: string;
  date_range: {
    start: string; // MM-DD
    end: string;   // MM-DD
  };
  traits: string[];
  compatibility: Record<string, number>; // 与其他星座的兼容度
}

// 运势查询
export interface FortuneReading {
  sessionId: string;
  zodiacSign: string;
  date: string;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly';
  overall: { score: number; description: string };
  love: { score: number; description: string };
  career: { score: number; description: string };
  wealth: { score: number; description: string };
  health: { score: number; description: string };
  luckyElements: {
    colors: string[];
    numbers: number[];
    directions: string[];
  };
  advice: string;
  createdAt: string;
}

// 星座配对分析
export interface CompatibilityAnalysis {
  sessionId: string;
  sign1: string;
  sign2: string;
  relationType: 'friendship' | 'love' | 'work';
  overallScore: number;
  specificScore: number;
  strengths: string[];
  challenges: string[];
  advice: string;
  elementCompatibility: string;
  qualityCompatibility: string;
  zodiacSignComparison?: {
    sign1: {
      name: string;
      symbol: string;
      element: string;
      quality: string;
      rulingPlanet: string;
      dateRange: string;
      keyTraits: string[];
      elementalNature: string;
      qualityTraits: string;
    };
    sign2: {
      name: string;
      symbol: string;
      element: string;
      quality: string;
      rulingPlanet: string;
      dateRange: string;
      keyTraits: string[];
      elementalNature: string;
      qualityTraits: string;
    };
  };
  createdAt: string;
}

// 星盘分析
export interface BirthChart {
  sessionId: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  sunSign: string;
  moonSign: string;
  risingSign: string;
  planetaryPositions: Record<string, string>;
  housePositions: Record<string, string>;
  aspects: Record<string, string>;
  personalityProfile: {
    coreTraits: string[];
    strengths: string[];
    challenges: string[];
    lifePurpose: string;
  };
  corePlanetaryPositions?: {
    sunInterpretation: string;
    moonInterpretation: string;
    risingInterpretation: string;
  };
  planetaryInterpretations?: {
    mercury: string;
    venus: string;
    mars: string;
    jupiter: string;
    saturn: string;
    uranus: string;
    neptune: string;
    pluto: string;
  };
  lifeGuidance: {
    career: string;
    relationships: string;
    personalGrowth: string;
    challenges: string;
  };
  personalityAnalysis: string;
  houseAnalysis: string;
  guidance: string;
  createdAt: string;
}

// API请求类型
export interface FortuneRequest {
  zodiacSign: string;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date?: string;
  language?: string;
}

export interface CompatibilityRequest {
  sign1: string;
  sign2: string;
  relationType: 'friendship' | 'love' | 'work';
  language?: string;
}

export interface BirthChartRequest {
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  language?: string;
}

export interface AstrologyFeedbackRequest {
  sessionId: string;
  feedback: 'like' | 'dislike';
  comment?: string;
}

// 星座测试类型枚举
export enum AstrologyTestType {
  // 保留枚举定义以备将来使用
}

// 星座元素和性质
export const ZODIAC_ELEMENTS = {
  fire: ['aries', 'leo', 'sagittarius'],
  earth: ['taurus', 'virgo', 'capricorn'],
  air: ['gemini', 'libra', 'aquarius'],
  water: ['cancer', 'scorpio', 'pisces']
} as const;

export const ZODIAC_QUALITIES = {
  cardinal: ['aries', 'cancer', 'libra', 'capricorn'],
  fixed: ['taurus', 'leo', 'scorpio', 'aquarius'],
  mutable: ['gemini', 'virgo', 'sagittarius', 'pisces']
} as const;