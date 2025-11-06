/**
 * Numerology Store
 * 命理分析模块状态管理
 */

import { useCallback } from 'react';
import { create, type StateCreator } from 'zustand';
import { getApiBaseUrl } from '@/config/environment';
import type {
  NumerologyStore,
  NumerologyAnalysis,
  NumerologyBasicInfo,
  NumerologyAnalysisType
} from '../types';
import { withDevtools } from '@/stores/utils/devtools';

const createNumerologyState: StateCreator<NumerologyStore> = (set) => ({
  // 状态
  currentSession: null,
  isLoading: false,
  error: null,
  analysisResult: null,
  showResults: false,

  // 操作
  clearNumerologySession: () => {
    set({
      currentSession: null,
      analysisResult: null,
      showResults: false,
      error: null,
      isLoading: false
    });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setAnalysisResult: (analysis: NumerologyAnalysis | null) => {
    set({ analysisResult: analysis });
  },

  setShowResults: (show: boolean) => {
    set({ showResults: show });
  }
});

// 命理模块状态管理
const useNumerologyStoreStore = create<NumerologyStore>()(
  withDevtools(createNumerologyState, {
    name: 'numerology-store',
    selectState: (state) => ({
      currentSession: state.currentSession,
      analysisResult: state.analysisResult,
      showResults: state.showResults
    })
  })
);

// 命理模块状态管理 Hook
export const useNumerologyStore = (): {
  isLoading: boolean;
  error: string | null;
  analysisResult: NumerologyAnalysis | null;
  showResults: boolean;
  // eslint-disable-next-line no-unused-vars
  processNumerologyData: (analysisType: NumerologyAnalysisType, inputData: NumerologyBasicInfo) => Promise<void>;
  clearNumerologySession: () => void;
  // eslint-disable-next-line no-unused-vars
  setError: (error: string | null) => void;
  // eslint-disable-next-line no-unused-vars
  setLoading: (loading: boolean) => void;
} => {
  const numerologyStore = useNumerologyStoreStore();

  // 获取生肖动物
  const getZodiacAnimal = useCallback((birthDate: string) => {
    const year = new Date(birthDate).getFullYear();
    const animals = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
    return animals[(year - 4) % 12];
  }, []);

  // 获取五行元素
  const getElement = useCallback((birthDate: string) => {
    const year = new Date(birthDate).getFullYear();
    const elements = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water'];
    return elements[(year - 4) % 10];
  }, []);

  // 处理命理分析数据提交
  const processNumerologyData = async (
    analysisType: NumerologyAnalysisType,
    inputData: NumerologyBasicInfo
  ) => {
    try {
      numerologyStore.setLoading(true);
      numerologyStore.setError(null);
      
      // 将命理数据转换为统一测试系统的答案格式
      const answers = [
        {
          questionId: 'numerology_analysis_type',
          answer: {
            type: analysisType,
            inputData: inputData
          }
        }
      ];

      // 调用API进行分析
      const response = await fetch(`${getApiBaseUrl()}/api/test-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testType: 'numerology',
          answers: answers,
          sessionId: `numerology_${Date.now()}`
        })
      });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }
      
      const apiResult = await response.json();
      
      if (apiResult?.data) {
        const aiAnalysis = apiResult.data;
        
        // 对于name类型，AI直接返回推荐数据，不需要从analysis字段提取
        if (analysisType === 'name') {
          const numerologyAnalysis: NumerologyAnalysis = {
            basicInfo: inputData,
            chineseNameRecommendation: aiAnalysis
          } as NumerologyAnalysis;
          
          numerologyStore.setAnalysisResult(numerologyAnalysis);
          numerologyStore.setShowResults(true);
          numerologyStore.setLoading(false);
          return;
        }
        
        // 其他类型从analysis字段提取
        const analysis = aiAnalysis.analysis || {};
        
        // 从AI分析结果中提取关键信息
        const numerologyAnalysis: NumerologyAnalysis = {
          basicInfo: inputData,
          baZi: extractBaZiData(analysis),
          fiveElements: extractFiveElementsData(analysis),
          zodiac: analysis.zodiacInfo || {
            animal: getZodiacAnimal(inputData.birthDate) || 'dragon',
            element: getElement(inputData.birthDate) || 'wood',
            year: new Date(inputData.birthDate).getFullYear(),
            isCurrentYear: false,
            isConflictYear: false
          },
          zodiacFortune: analysis.zodiacFortune || {
            period: 'year',
            overall: 7,
            career: 6,
            wealth: 5,
            love: 8,
            health: 6,
            luckyNumbers: [1, 2, 3, 4, 5],
            luckyColors: ['yellow', 'red', 'orange'],
            luckyDirection: 'south',
            guardianAnimals: [],
            warnings: [],
            suggestions: []
          },
          nameAnalysis: {
            fiveGrids: {
              heavenGrid: 0,
              personGrid: 0,
              earthGrid: 0,
              outerGrid: 0,
              totalGrid: 0
            },
            threeTalents: {
              heaven: '',
              person: '',
              earth: '',
              configuration: ''
            },
            personality: '',
            career: '',
            marriage: '',
            health: '',
            overallScore: 0
          },
          ziWeiChart: analysis.ziWeiChart || {
            palaces: analysis.ziWeiChart?.palaces || {},
            lifePalace: analysis.ziWeiChart?.lifePalace || '',
            wealthPalace: analysis.ziWeiChart?.wealthPalace || '',
            careerPalace: analysis.ziWeiChart?.careerPalace || '',
            marriagePalace: analysis.ziWeiChart?.marriagePalace || ''
          },
          // 新增专业分析维度
          wealthAnalysis: extractWealthAnalysis(analysis),
          relationshipAnalysis: extractRelationshipAnalysis(analysis),
          healthAnalysis: extractHealthAnalysis(analysis),
          fortuneAnalysis: extractFortuneAnalysis(analysis, analysisType),
          // 优先使用AI返回的overview；没有则不展示（由界面层依据空值隐藏模块）
          overallInterpretation: analysis.overallInterpretation || analysis.overview || null,
          personalityTraits: analysis.personalityTraits || analysis.strengths || [],
          careerGuidance: analysis.careerGuidance || analysis.careerSuggestions || [],
          relationshipAdvice: analysis.relationshipAdvice || analysis.relationshipInsights || [],
          healthTips: analysis.personalGrowthRecommendations || [],
          luckyElements: analysis.luckyElements || {
            colors: analysis.luckyElements?.colors || ['yellow', 'red', 'orange'],
            numbers: analysis.luckyElements?.numbers || [1, 2, 3, 4, 5],
            directions: analysis.luckyElements?.directions || ['south', 'center'],
            seasons: analysis.luckyElements?.seasons || ['late summer']
          },
          improvementSuggestions: analysis.improvementSuggestions || analysis.personalGrowthRecommendations || [],
          // 紫微斗数专业分析字段
          starAnalysis: analysis.starAnalysis || null,
          fourTransformations: analysis.fourTransformations || null,
          patterns: analysis.patterns || null
        };

        numerologyStore.setAnalysisResult(numerologyAnalysis);
        numerologyStore.setShowResults(true);
        numerologyStore.setLoading(false);
      } else {
        throw new Error('No analysis data received from server');
      }
    } catch (error) {
      numerologyStore.setError(error instanceof Error ? error.message : 'Unknown error occurred');
      numerologyStore.setLoading(false);
    }
  };

  // 从AI分析中提取八字数据
  const extractBaZiData = (analysis: any) => {
    // 从AI的keyInsights中提取八字信息，如果没有则使用默认值
    const insights = analysis.keyInsights || [];
    
    const pillars = {
      year: insights.find((i: any) => i.pillar?.includes('Year') || i.pillar?.includes('年柱')) || { element: 'Earth over Fire' },
      month: insights.find((i: any) => i.pillar?.includes('Month') || i.pillar?.includes('月柱')) || { element: 'Wood over Water' },
      day: insights.find((i: any) => i.pillar?.includes('Day') || i.pillar?.includes('日柱')) || { element: 'Fire over Fire' },
      hour: insights.find((i: any) => i.pillar?.includes('Hour') || i.pillar?.includes('时柱')) || { element: 'Metal over Earth' }
    };

    // 从AI的baZiAnalysis中提取数据，如果没有则使用默认值
    const baZiAnalysis = analysis.baZiAnalysis || {};


    // 辅助函数：安全获取天干地支信息（只显示英文）
    const getPillarInfo = (element: string, defaultHeavenly: string, defaultEarthly: string) => {
      if (!element) {
        // 如果没有element数据，使用默认值
        return {
          heavenlyStem: defaultHeavenly,
          earthlyBranch: defaultEarthly,
          element: defaultHeavenly,
          animal: defaultEarthly
        };
      }
      
      // 尝试解析 "Heavenly Stem over Earthly Branch" 格式
      const parts = element.split(' over ');
      if (parts.length >= 2) {
        const heavenlyElement = parts[0]?.trim() || '';
        const earthlyElement = parts[1]?.trim() || '';
        
        return {
          heavenlyStem: heavenlyElement,
          earthlyBranch: earthlyElement,
          element: heavenlyElement,
          animal: earthlyElement
        };
      }
      
      // 如果解析失败，使用默认值
      return {
        heavenlyStem: defaultHeavenly,
        earthlyBranch: defaultEarthly,
        element: defaultHeavenly,
        animal: defaultEarthly
      };
    };

    return {
      yearPillar: getPillarInfo(pillars.year.element, 'Earth', 'Snake'),
      monthPillar: getPillarInfo(pillars.month.element, 'Wood', 'Pig'),
      dayPillar: getPillarInfo(pillars.day.element, 'Fire', 'Horse'),
      hourPillar: getPillarInfo(pillars.hour.element, 'Metal', 'Goat'),
      // 十神分析 - 从AI数据中提取，如果没有则使用默认值
      tenGods: baZiAnalysis.tenGods || {
        biJian: { name: 'Bi Jian (Equal)', element: 'Wood', strength: 'balanced' as const, meaning: 'Self-reliance and independence' },
        jieCai: { name: 'Jie Cai (Rob Wealth)', element: 'Wood', strength: 'weak' as const, meaning: 'Competition and challenges' },
        shiShen: { name: 'Shi Shen (Food God)', element: 'Fire', strength: 'strong' as const, meaning: 'Creativity and expression' },
        shangGuan: { name: 'Shang Guan (Hurt Officer)', element: 'Fire', strength: 'balanced' as const, meaning: 'Intelligence and innovation' },
        pianCai: { name: 'Pian Cai (Partial Wealth)', element: 'Metal', strength: 'weak' as const, meaning: 'Unexpected wealth' },
        zhengCai: { name: 'Zheng Cai (Direct Wealth)', element: 'Metal', strength: 'strong' as const, meaning: 'Stable income' },
        qiSha: { name: 'Qi Sha (Seven Killings)', element: 'Water', strength: 'balanced' as const, meaning: 'Authority and pressure' },
        zhengGuan: { name: 'Zheng Guan (Direct Officer)', element: 'Water', strength: 'strong' as const, meaning: 'Official position' },
        pianYin: { name: 'Pian Yin (Partial Seal)', element: 'Earth', strength: 'weak' as const, meaning: 'Unconventional wisdom' },
        zhengYin: { name: 'Zheng Yin (Direct Seal)', element: 'Earth', strength: 'strong' as const, meaning: 'Traditional wisdom' }
      },
      // 日主强弱分析 - 从AI数据中提取，如果没有则使用默认值
      dayMasterStrength: baZiAnalysis.dayMasterStrength || {
        strength: 'balanced' as const,
        description: 'Your day master shows balanced strength, indicating good adaptability and resilience.',
        recommendations: ['Focus on balanced development', 'Avoid extremes in decision making']
      },
      // 用神忌神分析 - 从AI数据中提取，如果没有则使用默认值
      favorableElements: baZiAnalysis.favorableElements || {
        useful: ['Wood', 'Water'],
        harmful: ['Metal', 'Fire'],
        neutral: ['Earth'],
        explanation: 'Wood and Water elements are beneficial for your chart, while Metal and Fire should be used cautiously.'
      }
    };
  };

  // 从AI分析中提取五行数据
  const extractFiveElementsData = (analysis: any) => {
    // 优先从baZiAnalysis.fiveElements中提取，如果没有则从luckyAspects中提取
    const baZiAnalysis = analysis.baZiAnalysis || {};
    const fiveElementsData = baZiAnalysis.fiveElements;
    
    if (fiveElementsData) {
      return fiveElementsData;
    }
    
    // 备用方案：从luckyAspects中提取五行信息
    const elements = analysis.luckyAspects?.elements || ['earth', 'fire', 'wood', 'metal'];
    const elementCounts = elements.reduce((acc: any, element: string) => {
      acc[element] = (acc[element] || 0) + 1;
      return acc;
    }, {});

    return {
      elements: {
        metal: elementCounts.metal || 2,
        wood: elementCounts.wood || 2,
        water: elementCounts.water || 1,
        fire: elementCounts.fire || 2,
        earth: elementCounts.earth || 2
      },
      dominantElement: Object.keys(elementCounts).reduce((a, b) => elementCounts[a] > elementCounts[b] ? a : b) || 'earth',
      weakElement: Object.keys(elementCounts).reduce((a, b) => elementCounts[a] < elementCounts[b] ? a : b) || 'water',
      balance: 'balanced' as const
    };
  };

  // 从AI分析中提取财运分析
  const extractWealthAnalysis = (analysis: any) => {
    const wealthAnalysis = analysis.wealthAnalysis || {};
    return {
      wealthLevel: wealthAnalysis.wealthLevel || 'medium' as const,
      wealthSource: wealthAnalysis.wealthSource || ['Career development', 'Investment opportunities'],
      investmentAdvice: wealthAnalysis.investmentAdvice || ['Focus on stable investments', 'Consider real estate'],
      riskFactors: wealthAnalysis.wealthRisks || ['Avoid high-risk investments', 'Be cautious with loans'],
      luckyPeriods: wealthAnalysis.wealthLuckyPeriods || ['Spring and Autumn seasons'],
      precautions: wealthAnalysis.wealthPrecautions || ['Avoid impulsive spending', 'Maintain emergency fund']
    };
  };

  // 从AI分析中提取感情婚姻分析
  const extractRelationshipAnalysis = (analysis: any) => {
    const relationshipAnalysis = analysis.relationshipAnalysis || {};
    return {
      marriageTiming: relationshipAnalysis.marriageTiming || 'Late 20s to early 30s',
      partnerCharacteristics: relationshipAnalysis.partnerCharacteristics || ['Compatible element', 'Supportive nature'],
      relationshipChallenges: relationshipAnalysis.relationshipChallenges || ['Communication differences', 'Different priorities'],
      compatibilityElements: relationshipAnalysis.compatibilityElements || ['Wood and Water', 'Earth and Metal'],
      marriageAdvice: relationshipAnalysis.marriageAdvice || ['Focus on communication', 'Respect differences'],
      luckyPeriods: relationshipAnalysis.relationshipLuckyPeriods || ['Spring and Summer']
    };
  };

  // 从AI分析中提取健康运势分析
  const extractHealthAnalysis = (analysis: any) => {
    const healthAnalysis = analysis.healthAnalysis || {};
    return {
      overallHealth: healthAnalysis.overallHealth || 'good' as const,
      weakAreas: healthAnalysis.healthWeakAreas || ['Digestive system', 'Respiratory system'],
      healthAdvice: healthAnalysis.healthAdvice || ['Regular exercise', 'Balanced diet'],
      preventiveMeasures: healthAnalysis.preventiveMeasures || ['Annual check-ups', 'Stress management'],
      beneficialActivities: healthAnalysis.beneficialActivities || ['Yoga', 'Meditation', 'Nature walks'],
      warningSigns: healthAnalysis.healthWarningSigns || ['Persistent fatigue', 'Sleep disturbances']
    };
  };

  // 从AI分析中提取运势分析
  const extractFortuneAnalysis = (analysis: any, analysisType?: NumerologyAnalysisType) => {
    const currentYear = new Date().getFullYear();
    const fortuneAnalysis = analysis.fortuneAnalysis || {};
    
    // 如果是Chinese Zodiac Fortune分析，使用currentPeriod
    if (analysisType === 'zodiac' || fortuneAnalysis.currentPeriod) {
      return {
        currentPeriod: {
          year: currentYear,
          overall: fortuneAnalysis.currentPeriod?.overall || 7,
          career: fortuneAnalysis.currentPeriod?.career || 6,
          wealth: fortuneAnalysis.currentPeriod?.wealth || 5,
          health: fortuneAnalysis.currentPeriod?.health || 6,
          love: fortuneAnalysis.currentPeriod?.love || 7,
          overallDescription: fortuneAnalysis.currentPeriod?.overallDescription || 'This period brings a balanced mix of opportunities and challenges, requiring careful navigation and strategic planning. The cosmic influences favor steady progress with occasional breakthroughs.',
          careerDescription: fortuneAnalysis.currentPeriod?.careerDescription || 'Your career path shows steady progress with potential for advancement through focused effort and strategic networking. Leadership opportunities may arise.',
          wealthDescription: fortuneAnalysis.currentPeriod?.wealthDescription || 'Financial opportunities may arise, but require careful evaluation and prudent decision-making to maximize benefits. Avoid impulsive investments.',
          healthDescription: fortuneAnalysis.currentPeriod?.healthDescription || 'Maintaining good health requires attention to both physical and mental well-being, with particular focus on stress management and regular exercise.',
          loveDescription: fortuneAnalysis.currentPeriod?.loveDescription || 'Your relationships may deepen this period, with opportunities for meaningful connections and personal growth through social interactions.',
          keyEvents: fortuneAnalysis.currentPeriod?.keyEvents || ['Career opportunities', 'Relationship developments'],
          advice: fortuneAnalysis.currentPeriod?.advice || ['Focus on career growth', 'Nurture relationships']
        }
      };
    } else {
      // BaZi 使用 currentYear
      return {
        currentYear: {
          year: currentYear,
          overall: fortuneAnalysis.currentYear?.overall || 7,
          career: fortuneAnalysis.currentYear?.career || 6,
          wealth: fortuneAnalysis.currentYear?.wealth || 5,
          health: fortuneAnalysis.currentYear?.health || 6,
          relationships: fortuneAnalysis.currentYear?.relationships || 7,
          overallDescription: fortuneAnalysis.currentYear?.overallDescription || 'This year brings a balanced mix of opportunities and challenges, requiring careful navigation and strategic planning. The cosmic influences favor steady progress with occasional breakthroughs.',
          careerDescription: fortuneAnalysis.currentYear?.careerDescription || 'Your career path shows steady progress with potential for advancement through focused effort and strategic networking. Leadership opportunities may arise.',
          wealthDescription: fortuneAnalysis.currentYear?.wealthDescription || 'Financial opportunities may arise, but require careful evaluation and prudent decision-making to maximize benefits. Avoid impulsive investments.',
          healthDescription: fortuneAnalysis.currentYear?.healthDescription || 'Maintaining good health requires attention to both physical and mental well-being, with particular focus on stress management and regular exercise.',
          relationshipsDescription: fortuneAnalysis.currentYear?.relationshipsDescription || 'Your relationships may deepen this year, with opportunities for meaningful connections and personal growth through social interactions.',
          keyEvents: fortuneAnalysis.currentYear?.keyEvents || ['Career opportunities', 'Relationship developments'],
          advice: fortuneAnalysis.currentYear?.advice || ['Focus on career growth', 'Nurture relationships']
        },
        nextYear: {
          year: currentYear + 1,
          overall: fortuneAnalysis.nextYear?.overall || 8,
          overallDescription: fortuneAnalysis.nextYear?.overallDescription || 'The coming year promises significant developments across multiple life areas, with particular emphasis on personal growth and new opportunities.',
          keyTrends: fortuneAnalysis.nextYear?.keyTrends || ['Positive changes', 'New opportunities'],
          opportunities: fortuneAnalysis.nextYear?.opportunities || ['Career advancement', 'Financial growth'],
          challenges: fortuneAnalysis.nextYear?.challenges || ['Work-life balance', 'Health maintenance']
        },
        lifeStages: {
          youth: {
            ageRange: '20-30',
            characteristics: ['Learning phase', 'Career building'],
            advice: ['Focus on education', 'Build strong foundations']
          },
          middle: {
            ageRange: '30-50',
            characteristics: ['Peak performance', 'Family building'],
            advice: ['Balance work and family', 'Invest wisely']
          },
          senior: {
            ageRange: '50+',
            characteristics: ['Wisdom sharing', 'Legacy building'],
            advice: ['Share knowledge', 'Enjoy life']
          }
        }
      };
    }
  };


  return {
    isLoading: numerologyStore.isLoading,
    error: numerologyStore.error,
    analysisResult: numerologyStore.analysisResult,
    showResults: numerologyStore.showResults,
    
    // 操作
    processNumerologyData,
    clearNumerologySession: numerologyStore.clearNumerologySession,
    setError: numerologyStore.setError,
    setLoading: numerologyStore.setLoading
  };
};