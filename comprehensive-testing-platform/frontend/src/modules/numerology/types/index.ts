/**
 * Numerology Module Types
 * 命理分析模块类型定义
 */

/* eslint-disable no-unused-vars */

// 基础命理信息
export interface NumerologyBasicInfo {
  fullName: string;
  birthDate: string; // YYYY-MM-DD format
  birthTime?: string; // HH:MM format
  gender: 'male' | 'female';
  calendarType: 'solar' | 'lunar'; // 公历或农历
  timeframe?: 'yearly'; // 运势时间段，默认为年运
  // 中文名字推荐的特殊字段
  chineseNameRecommendation?: ChineseNameRecommendationInput;
}

// 生辰八字信息
export interface BaZiInfo {
  yearPillar: {
    heavenlyStem: string; // 天干
    earthlyBranch: string; // 地支
    element: string; // 五行
    animal: string; // 生肖
  };
  monthPillar: {
    heavenlyStem: string;
    earthlyBranch: string;
    element: string;
  };
  dayPillar: {
    heavenlyStem: string;
    earthlyBranch: string;
    element: string;
  };
  hourPillar: {
    heavenlyStem: string;
    earthlyBranch: string;
    element: string;
  };
  // 十神分析
  tenGods: {
    [key: string]: {
      name: string; // 十神名称
      element: string; // 五行属性
      strength: 'strong' | 'weak' | 'balanced'; // 强弱状态
      meaning: string; // 含义解释
    };
  };
  // 日主强弱分析
  dayMasterStrength: {
    strength: 'very_strong' | 'strong' | 'balanced' | 'weak' | 'very_weak';
    description: string;
    recommendations: string[];
  };
  // 用神忌神分析
  favorableElements: {
    useful: string[]; // 用神
    harmful: string[]; // 忌神
    neutral: string[]; // 闲神
    explanation: string;
  };
}

// 五行分析
export interface FiveElementsAnalysis {
  elements: {
    metal: number; // 金
    wood: number;  // 木
    water: number; // 水
    fire: number;  // 火
    earth: number; // 土
  };
  dominantElement: string; // 主导五行
  weakElement: string; // 弱势五行
  balance: 'balanced' | 'imbalanced'; // 五行平衡状态
}

// 生肖信息
export interface ZodiacInfo {
  animal: string; // 生肖动物
  element: string; // 五行属性
  year: number; // 出生年份
  isCurrentYear: boolean; // 是否本命年
  isConflictYear: boolean; // 是否犯太岁
}

// 生肖运势
export interface ZodiacFortune {
  period: 'year' | 'month' | 'week'; // 运势周期
  overall: number; // 综合运势 (1-10)
  career: number; // 事业运势
  wealth: number; // 财运
  love: number; // 感情运势
  health: number; // 健康运势
  luckyNumbers: number[]; // 幸运数字
  luckyColors: string[]; // 幸运颜色
  luckyDirection: string; // 幸运方位
  guardianAnimals: string[]; // 贵人生肖
  warnings: string[]; // 注意事项
  suggestions: string[]; // 改运建议
}

// 中文名字推荐输入
export interface ChineseNameRecommendationInput {
  originalName: string;
  gender: 'male' | 'female';
  age: number;
  personality: string;
  profession: string;
  interests: string;
  desiredMeaning: string;
  culturalPreference: 'traditional' | 'modern' | 'balanced';
  usageContext: 'personal' | 'business' | 'academic' | 'social';
}

// 中文名字推荐结果
export interface ChineseNameRecommendationResult {
  primaryRecommendation: {
    name: string;
    pronunciation: string;
    meaning: string;
    whyRecommended: string;
    culturalSignificance: string;
    usageAdvice: string;
  };
  alternativeRecommendations: Array<{
    name: string;
    pronunciation: string;
    meaning: string;
    whyRecommended: string;
    culturalSignificance: string;
  }>;
  overallExplanation: string;
}

// 姓名学分析
export interface NameAnalysis {
  fiveGrids: {
    heavenGrid: number; // 天格
    personGrid: number; // 人格
    earthGrid: number; // 地格
    outerGrid: number; // 外格
    totalGrid: number; // 总格
  };
  threeTalents: {
    heaven: string; // 天格五行
    person: string; // 人格五行
    earth: string; // 地格五行
    configuration: string; // 三才配置
  };
  personality: string; // 性格特征
  career: string; // 事业运势
  marriage: string; // 婚姻感情
  health: string; // 健康状况
  overallScore: number; // 综合评分 (1-100)
}

// 紫微斗数命盘
export interface ZiWeiChart {
  palaces: {
    [key: string]: {
      mainStars: string[]; // 主星
      minorStars: string[]; // 辅星
      element: string; // 五行属性
      meaning: string; // 宫位含义
    };
  };
  lifePalace: string; // 命宫
  parentsPalace: string; // 父母宫
  fortunePalace: string; // 福德宫
  propertyPalace: string; // 田宅宫
  careerPalace: string; // 事业宫
  friendsPalace: string; // 交友宫
  marriagePalace: string; // 夫妻宫
  childrenPalace: string; // 子女宫
  wealthPalace: string; // 财帛宫
  healthPalace: string; // 疾厄宫
  travelPalace: string; // 迁移宫
  siblingsPalace: string; // 兄弟宫
}

// 财运分析
export interface WealthAnalysis {
  wealthLevel: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
  wealthSource: string[]; // 财源方向
  investmentAdvice: string[]; // 投资建议
  riskFactors: string[]; // 风险因素
  luckyPeriods: string[]; // 财运旺盛期
  precautions: string[]; // 注意事项
}

// 感情婚姻分析
export interface RelationshipAnalysis {
  marriageTiming: string; // 婚姻时机
  partnerCharacteristics: string[]; // 配偶特征
  relationshipChallenges: string[]; // 感情挑战
  compatibilityElements: string[]; // 相合元素
  marriageAdvice: string[]; // 婚姻建议
  luckyPeriods: string[]; // 感情旺盛期
}

// 健康运势分析
export interface HealthAnalysis {
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  weakAreas: string[]; // 薄弱部位
  healthAdvice: string[]; // 健康建议
  preventiveMeasures: string[]; // 预防措施
  beneficialActivities: string[]; // 有益活动
  warningSigns: string[]; // 警示信号
}

// 大运流年分析
export interface FortuneAnalysis {
  // BaZi 使用 currentYear
  currentYear?: {
    year: number;
    overall: number; // 综合运势 (1-10)
    career: number; // 事业运势
    wealth: number; // 财运
    health: number; // 健康运势
    relationships: number; // 感情运势
    overallDescription: string; // 综合运势描述
    careerDescription: string; // 事业运势描述
    wealthDescription: string; // 财运描述
    healthDescription: string; // 健康运势描述
    relationshipsDescription: string; // 感情运势描述
    keyEvents: string[]; // 重要事件
    advice: string[]; // 建议
  };
  // Chinese Zodiac Fortune 使用 currentPeriod
  currentPeriod?: {
    year: number;
    overall: number; // 综合运势 (1-10)
    career: number; // 事业运势
    wealth: number; // 财运
    health: number; // 健康运势
    love: number; // 感情运势
    overallDescription: string; // 综合运势描述
    careerDescription: string; // 事业运势描述
    wealthDescription: string; // 财运描述
    healthDescription: string; // 健康运势描述
    loveDescription: string; // 感情运势描述
    keyEvents: string[]; // 重要事件
    advice: string[]; // 建议
  };
  nextYear?: {
    year: number;
    overall: number;
    overallDescription: string; // 来年综合运势描述
    keyTrends: string[]; // 主要趋势
    opportunities: string[]; // 机遇
    challenges: string[]; // 挑战
  };
  lifeStages?: {
    [key: string]: {
      ageRange: string;
      characteristics: string[];
      advice: string[];
    };
  };
}

// 命理分析结果
export interface NumerologyAnalysis {
  basicInfo: NumerologyBasicInfo;
  baZi?: BaZiInfo;
  fiveElements?: FiveElementsAnalysis;
  zodiac?: ZodiacInfo;
  zodiacFortune?: ZodiacFortune;
  nameAnalysis?: NameAnalysis;
  ziWeiChart?: ZiWeiChart;
  wealthAnalysis?: WealthAnalysis; // 财运分析
  relationshipAnalysis?: RelationshipAnalysis; // 感情婚姻分析
  healthAnalysis?: HealthAnalysis; // 健康运势分析
  fortuneAnalysis?: FortuneAnalysis; // 大运流年分析
  overallInterpretation?: string; // 整体解读
  personalityTraits?: string[]; // 性格特征
  careerGuidance?: string[]; // 事业指导
  relationshipAdvice?: string[]; // 感情建议
  healthTips?: string[]; // 健康建议
  luckyElements?: {
    colors: string[];
    numbers: number[];
    directions: string[];
    seasons: string[];
  };
  improvementSuggestions?: string[]; // 改运建议
  // 中文名字推荐结果
  chineseNameRecommendation?: ChineseNameRecommendationResult;
  // 紫微斗数专业分析
  starAnalysis?: {
    mainStars: { [key: string]: string[] };
    starMeanings: string;
  };
  fourTransformations?: {
    huaLu: {
      strength: string;
      analysis: string;
    };
    huaQuan: {
      strength: string;
      analysis: string;
    };
    huaKe: {
      strength: string;
      analysis: string;
    };
    huaJi: {
      strength: string;
      analysis: string;
    };
  };
      patterns?: {
        mainPattern: string;
        specialPatterns: string[];
      };
}

// 命理会话
export interface NumerologySession {
  id: string;
  testSessionId: string;
  analysisType: 'bazi' | 'zodiac' | 'name' | 'ziwei';
  inputData: NumerologyBasicInfo;
  analysisResult: NumerologyAnalysis;
  createdAt: string;
  updatedAt: string;
}

// 命理测试状态
export interface NumerologyTestState {
  currentSession: NumerologySession | null;
  isLoading: boolean;
  error: string | null;
  analysisResult: NumerologyAnalysis | null;
  showResults: boolean;
}

// 命理测试操作
export interface NumerologyTestActions {
  clearNumerologySession: () => void;
  setError: (_error: string | null) => void;
  setLoading: (_loading: boolean) => void;
  setAnalysisResult: (_analysis: NumerologyAnalysis | null) => void;
  setShowResults: (_show: boolean) => void;
}

// 命理模块状态
export type NumerologyStore = NumerologyTestState & NumerologyTestActions;

// 命理分析类型
export type NumerologyAnalysisType = 'bazi' | 'zodiac' | 'name' | 'ziwei';

// 命理分析步骤
export interface NumerologyAnalysisStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  current: boolean;
}

// 命理分析配置
export interface NumerologyAnalysisConfig {
  analysisType: NumerologyAnalysisType;
  steps: NumerologyAnalysisStep[];
  estimatedTime: number; // 预计分析时间（分钟）
  requiredFields: string[];
}

// 命理分析请求
export interface NumerologyAnalysisRequest {
  analysisType: NumerologyAnalysisType;
  inputData: NumerologyBasicInfo;
  questionText?: string;
  questionCategory?: string;
}

// 命理分析响应
export interface NumerologyAnalysisResponse {
  success: boolean;
  data?: NumerologyAnalysis;
  error?: string;
  message?: string;
  sessionId?: string;
}

// 命理模块常量
export const NUMEROLOGY_ANALYSIS_TYPES = {
  BAZI: 'bazi' as const,
  ZODIAC: 'zodiac' as const,
  NAME: 'name' as const,
  ZIWEI: 'ziwei' as const,
} as const;

export const NUMEROLOGY_ANALYSIS_STEPS = {
  INPUT_DATA: 'input_data',
  ANALYSIS: 'analysis',
  RESULTS: 'results',
  RECOMMENDATIONS: 'recommendations',
} as const;

export const ZODIAC_ANIMALS = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'
] as const;

export const FIVE_ELEMENTS = ['metal', 'wood', 'water', 'fire', 'earth'] as const;

export const HEAVENLY_STEMS = [
  'jia', 'yi', 'bing', 'ding', 'wu', 'ji', 'geng', 'xin', 'ren', 'gui'
] as const;

export const EARTHLY_BRANCHES = [
  'zi', 'chou', 'yin', 'mao', 'chen', 'si', 'wu', 'wei', 'shen', 'you', 'xu', 'hai'
] as const;
