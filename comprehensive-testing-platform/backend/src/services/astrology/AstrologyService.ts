/**
 * Astrology Service
 * 星座模块后端服务，复用统一架构
 */

import { CacheService } from '../CacheService';
import { AIService } from '../AIService';

// Cloudflare Workers types - using any to avoid import issues
type D1Database = any;
type KVNamespace = any;

// Simple logging utility
const logger = {
  error: (message: string, error?: any) => {
    // In production, this would use proper logging service
    if (typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error(message, error);
    }
  },
  info: (message: string) => {
    // In production, this would use proper logging service
    if (typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log(message);
    }
  }
};

// 星座基础数据
const ZODIAC_SIGNS = [
  {
    id: 'aries',
    name_zh: '白羊座',
    name_en: 'Aries',
    symbol: '♈',
    element: 'fire',
    quality: 'cardinal',
    ruling_planet: 'Mars',
    date_range: { start: '03-21', end: '04-19' },
    traits: ['energetic', 'confident', 'pioneering', 'impulsive', 'competitive']
  },
  {
    id: 'taurus',
    name_zh: '金牛座',
    name_en: 'Taurus',
    symbol: '♉',
    element: 'earth',
    quality: 'fixed',
    ruling_planet: 'Venus',
    date_range: { start: '04-20', end: '05-20' },
    traits: ['reliable', 'patient', 'practical', 'stubborn', 'sensual']
  },
  {
    id: 'gemini',
    name_zh: '双子座',
    name_en: 'Gemini',
    symbol: '♊',
    element: 'air',
    quality: 'mutable',
    ruling_planet: 'Mercury',
    date_range: { start: '05-21', end: '06-20' },
    traits: ['adaptable', 'curious', 'communicative', 'inconsistent', 'witty']
  },
  {
    id: 'cancer',
    name_zh: '巨蟹座',
    name_en: 'Cancer',
    symbol: '♋',
    element: 'water',
    quality: 'cardinal',
    ruling_planet: 'Moon',
    date_range: { start: '06-21', end: '07-22' },
    traits: ['nurturing', 'emotional', 'intuitive', 'moody', 'protective']
  },
  {
    id: 'leo',
    name_zh: '狮子座',
    name_en: 'Leo',
    symbol: '♌',
    element: 'fire',
    quality: 'fixed',
    ruling_planet: 'Sun',
    date_range: { start: '07-23', end: '08-22' },
    traits: ['confident', 'generous', 'dramatic', 'proud', 'creative']
  },
  {
    id: 'virgo',
    name_zh: '处女座',
    name_en: 'Virgo',
    symbol: '♍',
    element: 'earth',
    quality: 'mutable',
    ruling_planet: 'Mercury',
    date_range: { start: '08-23', end: '09-22' },
    traits: ['analytical', 'practical', 'perfectionist', 'critical', 'helpful']
  },
  {
    id: 'libra',
    name_zh: '天秤座',
    name_en: 'Libra',
    symbol: '♎',
    element: 'air',
    quality: 'cardinal',
    ruling_planet: 'Venus',
    date_range: { start: '09-23', end: '10-22' },
    traits: ['diplomatic', 'charming', 'balanced', 'indecisive', 'social']
  },
  {
    id: 'scorpio',
    name_zh: '天蝎座',
    name_en: 'Scorpio',
    symbol: '♏',
    element: 'water',
    quality: 'fixed',
    ruling_planet: 'Pluto',
    date_range: { start: '10-23', end: '11-21' },
    traits: ['intense', 'passionate', 'mysterious', 'jealous', 'transformative']
  },
  {
    id: 'sagittarius',
    name_zh: '射手座',
    name_en: 'Sagittarius',
    symbol: '♐',
    element: 'fire',
    quality: 'mutable',
    ruling_planet: 'Jupiter',
    date_range: { start: '11-22', end: '12-21' },
    traits: ['adventurous', 'optimistic', 'philosophical', 'restless', 'honest']
  },
  {
    id: 'capricorn',
    name_zh: '摩羯座',
    name_en: 'Capricorn',
    symbol: '♑',
    element: 'earth',
    quality: 'cardinal',
    ruling_planet: 'Saturn',
    date_range: { start: '12-22', end: '01-19' },
    traits: ['ambitious', 'disciplined', 'practical', 'pessimistic', 'responsible']
  },
  {
    id: 'aquarius',
    name_zh: '水瓶座',
    name_en: 'Aquarius',
    symbol: '♒',
    element: 'air',
    quality: 'fixed',
    ruling_planet: 'Uranus',
    date_range: { start: '01-20', end: '02-18' },
    traits: ['independent', 'innovative', 'humanitarian', 'detached', 'eccentric']
  },
  {
    id: 'pisces',
    name_zh: '双鱼座',
    name_en: 'Pisces',
    symbol: '♓',
    element: 'water',
    quality: 'mutable',
    ruling_planet: 'Neptune',
    date_range: { start: '02-19', end: '03-20' },
    traits: ['compassionate', 'intuitive', 'artistic', 'escapist', 'sensitive']
  }
];

// 元素兼容性
const ELEMENT_COMPATIBILITY = {
  fire: { fire: 0.9, air: 0.8, earth: 0.4, water: 0.3 },
  earth: { earth: 0.9, water: 0.8, fire: 0.4, air: 0.3 },
  air: { air: 0.9, fire: 0.8, water: 0.4, earth: 0.3 },
  water: { water: 0.9, earth: 0.8, air: 0.4, fire: 0.3 }
};

export class AstrologyService {
  private cacheService: CacheService;
  private aiService: AIService | null = null;

  constructor(_db: D1Database, kv: KVNamespace | null, apiKey?: string) {
    this.cacheService = new CacheService(kv, 3600); // 1小时缓存
    if (apiKey) {
      this.aiService = new AIService(apiKey);
    }
  }

  /**
   * 获取星座列表
   */
  async getZodiacSigns() {
    return ZODIAC_SIGNS;
  }

  /**
   * 获取运势
   */
  async getFortune(sign: string, timeframe: string, date?: string) {
    try {
      // 验证星座
      const zodiacSign = ZODIAC_SIGNS.find(s => s.id === sign.toLowerCase());
      if (!zodiacSign) {
        throw new Error(`Invalid zodiac sign: ${sign}`);
      }

      // 验证时间范围
      const validTimeframes = ['daily', 'weekly', 'monthly', 'yearly'];
      if (!validTimeframes.includes(timeframe)) {
        throw new Error(`Invalid timeframe: ${timeframe}`);
      }

      // 设置默认日期
      const targetDate = date || new Date().toISOString().split('T')[0] || '';

      // 检查缓存
      const cacheKey = `fortune:${sign}:${timeframe}:${targetDate}`;
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      // 尝试使用AI生成运势，如果失败则使用模拟生成
      let fortune;
      if (this.aiService) {
        try {
          fortune = await this.aiService.analyzeFortune(sign, timeframe, {
            date: targetDate,
            zodiacSign: zodiacSign
          });
          logger.info(`AI-generated fortune for ${sign} ${timeframe}`);
        } catch (aiError) {
          logger.error('AI fortune generation failed, falling back to simulation:', aiError);
          fortune = await this.generateFortune(zodiacSign, timeframe, targetDate);
        }
      } else {
        // 没有AI服务时使用模拟生成
        fortune = await this.generateFortune(zodiacSign, timeframe, targetDate);
      }

      // 缓存结果
      const cacheTTL = this.getCacheTTL(timeframe);
      await this.cacheService.set(cacheKey, fortune, { ttl: cacheTTL });

      // 保存到数据库
      await this.saveFortune(fortune);

      return fortune;
    } catch (error) {
      logger.error('Failed to get fortune:', error);
      throw error;
    }
  }

  /**
   * 获取星座配对分析
   */
  async getCompatibility(sign1: string, sign2: string, relationType: string) {
    try {
      // 验证星座
      const zodiac1 = ZODIAC_SIGNS.find(s => s.id === sign1.toLowerCase());
      const zodiac2 = ZODIAC_SIGNS.find(s => s.id === sign2.toLowerCase());
      
      if (!zodiac1 || !zodiac2) {
        throw new Error('Invalid zodiac signs');
      }

      // 验证关系类型
      const validTypes = ['love', 'friendship', 'work'];
      if (!validTypes.includes(relationType)) {
        throw new Error(`Invalid relation type: ${relationType}`);
      }

      // 检查缓存
      const cacheKey = `compatibility:${sign1}:${sign2}:${relationType}`;
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      // 尝试使用AI生成配对分析，如果失败则使用模拟生成
      let compatibility;
      if (this.aiService) {
        try {
          compatibility = await this.aiService.analyzeCompatibility(sign1, sign2, relationType, {
            zodiac1: zodiac1,
            zodiac2: zodiac2
          });
          logger.info(`AI-generated compatibility for ${sign1} & ${sign2} ${relationType}`);
        } catch (aiError) {
          logger.error('AI compatibility generation failed, falling back to simulation:', aiError);
          compatibility = await this.generateCompatibility(zodiac1, zodiac2, relationType);
        }
      } else {
        // 没有AI服务时使用模拟生成
        compatibility = await this.generateCompatibility(zodiac1, zodiac2, relationType);
      }

      // 缓存结果（配对分析缓存更长时间）
      await this.cacheService.set(cacheKey, compatibility, { ttl: 86400 * 7 }); // 7天

      // 保存到数据库
      await this.saveCompatibility(compatibility);

      return compatibility;
    } catch (error) {
      logger.error('Failed to get compatibility:', error);
      throw error;
    }
  }

  /**
   * 分析出生星盘
   */
  async analyzeBirthChart(birthData: any, userContext: any) {
    try {
      // 验证必填字段
      if (!birthData.birthDate || !birthData.birthLocation) {
        throw new Error('Birth date and location are required');
      }

      // 检查缓存
      const cacheKey = `birth_chart:${birthData.birthDate}:${birthData.birthLocation}:${birthData.birthTime || 'unknown'}`;
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      // 尝试使用AI生成星盘分析，如果失败则使用模拟生成
      let birthChart;
      if (this.aiService) {
        try {
          birthChart = await this.aiService.analyzeBirthChart(birthData, userContext);
          logger.info(`AI-generated birth chart for ${birthData.birthDate}`);
        } catch (aiError) {
          logger.error('AI birth chart generation failed, falling back to simulation:', aiError);
          birthChart = await this.generateBirthChart(birthData);
        }
      } else {
        // 没有AI服务时使用模拟生成
        birthChart = await this.generateBirthChart(birthData);
      }

      // 缓存结果（星盘分析缓存更长时间）
      await this.cacheService.set(cacheKey, birthChart, { ttl: 86400 * 30 }); // 30天

      // 保存到数据库
      await this.saveBirthChart(birthChart);

      return birthChart;
    } catch (error) {
      logger.error('Failed to analyze birth chart:', error);
      throw error;
    }
  }

  /**
   * 获取行星解读
   */
  async getPlanetInterpretation(planet: string, sign: string) {
    try {
      // 检查缓存
      const cacheKey = `planet_interpretation:${planet}:${sign}`;
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        return cached;
      }

      // 使用AI生成行星解读
      let interpretation;
      if (this.aiService) {
        try {
          interpretation = await this.aiService.analyzePlanetInterpretation(planet, sign);
          logger.info(`AI-generated planet interpretation for ${planet} in ${sign}`);
        } catch (aiError) {
          logger.info('AI service failed, using fallback');
          interpretation = this.generatePlanetInterpretation(planet, sign);
        }
      } else {
        interpretation = this.generatePlanetInterpretation(planet, sign);
      }

      // 缓存结果
      await this.cacheService.set(cacheKey, interpretation, { ttl: 86400 * 7 }); // 7天

      return interpretation;
    } catch (error) {
      logger.error('Failed to get planet interpretation:', error);
      throw error;
    }
  }

  /**
   * 提交反馈
   */
  async submitFeedback(sessionId: string, feedback: string) {
    try {
      // 这里应该更新数据库中的反馈信息
      // 暂时只记录日志
      logger.info(`Feedback received for session ${sessionId}: ${feedback}`);
      return true;
    } catch (error) {
      logger.error('Failed to submit feedback:', error);
      throw error;
    }
  }

  /**
   * 生成行星解读（模拟AI生成）
   */
  private generatePlanetInterpretation(planet: string, sign: string) {
    const planetMeanings: Record<string, string> = {
      sun: "Core identity, ego, and life purpose",
      moon: "Emotions, instincts, and inner self",
      mercury: "Communication, thinking, and learning",
      venus: "Love, beauty, and values",
      mars: "Action, energy, and drive",
      jupiter: "Growth, wisdom, and expansion",
      saturn: "Structure, discipline, and lessons",
      uranus: "Innovation, freedom, and change",
      neptune: "Intuition, spirituality, and dreams",
      pluto: "Transformation, power, and rebirth"
    };

    const signTraits: Record<string, string> = {
      aries: "bold, pioneering, and assertive",
      taurus: "stable, sensual, and determined",
      gemini: "curious, communicative, and adaptable",
      cancer: "nurturing, intuitive, and protective",
      leo: "dramatic, creative, and confident",
      virgo: "analytical, practical, and detail-oriented",
      libra: "diplomatic, harmonious, and relationship-focused",
      scorpio: "intense, transformative, and deeply emotional",
      sagittarius: "adventurous, philosophical, and freedom-loving",
      capricorn: "ambitious, disciplined, and goal-oriented",
      aquarius: "innovative, independent, and humanitarian",
      pisces: "compassionate, intuitive, and spiritually inclined"
    };

    const meaning = planetMeanings[planet.toLowerCase()] || "Planetary influence";
    const traits = signTraits[sign.toLowerCase()] || "unique characteristics";
    
    return {
      meaning: `${planet} in ${sign} - ${meaning}`,
      influence: `In ${sign}, your ${planet} energy is expressed through ${traits} qualities. This placement influences how you approach ${this.getPlanetLifeAreas(planet)}, shaping your personality and life experiences in meaningful ways.`
    };
  }

  /**
   * 获取行星相关的生活领域
   */
  private getPlanetLifeAreas(planet: string): string {
    const areas: Record<string, string> = {
      sun: "leadership, self-expression, and life purpose",
      moon: "emotional security, nurturing, and intuition",
      mercury: "communication, learning, and mental processes",
      venus: "relationships, beauty, and values",
      mars: "action, passion, and assertiveness",
      jupiter: "growth, wisdom, and expansion",
      saturn: "responsibility, structure, and discipline",
      uranus: "innovation, freedom, and change",
      neptune: "spirituality, creativity, and intuition",
      pluto: "transformation, power, and regeneration"
    };
    return areas[planet.toLowerCase()] || "various life areas";
  }

  /**
   * 生成出生星盘（模拟AI生成）
   */
  private async generateBirthChart(birthData: any) {
    const sessionId = crypto.randomUUID();
    const birthDate = new Date(birthData.birthDate);
    
    // 根据出生日期确定太阳星座
    const sunSign = this.getSunSignFromDate(birthDate);
    const zodiacSign = ZODIAC_SIGNS.find(s => s.id === sunSign);
    
    if (!zodiacSign) {
      throw new Error('Unable to determine zodiac sign from birth date');
    }

    // 生成模拟的月亮和上升星座
    const moonSign = this.getRandomZodiacSign();
    const risingSign = this.getRandomZodiacSign();
    
    if (!moonSign || !risingSign) {
      throw new Error('Unable to generate moon and rising signs');
    }
    
    return {
      sessionId,
      birthDate: birthData.birthDate,
      birthTime: birthData.birthTime || 'unknown',
      birthLocation: birthData.birthLocation,
      sunSign: zodiacSign.name_en,
      moonSign: moonSign.name_en,
      risingSign: risingSign.name_en,
      planetaryPositions: {
        sun: zodiacSign.name_en,
        moon: moonSign.name_en,
        mercury: this.getRandomZodiacSign()?.name_en || 'Unknown',
        venus: this.getRandomZodiacSign()?.name_en || 'Unknown',
        mars: this.getRandomZodiacSign()?.name_en || 'Unknown',
        jupiter: this.getRandomZodiacSign()?.name_en || 'Unknown',
        saturn: this.getRandomZodiacSign()?.name_en || 'Unknown',
        uranus: this.getRandomZodiacSign()?.name_en || 'Unknown',
        neptune: this.getRandomZodiacSign()?.name_en || 'Unknown',
        pluto: this.getRandomZodiacSign()?.name_en || 'Unknown'
      },
      housePositions: {
        first: risingSign.name_en,
        second: this.getRandomZodiacSign()?.name_en || 'Unknown',
        third: this.getRandomZodiacSign()?.name_en || 'Unknown',
        fourth: this.getRandomZodiacSign()?.name_en || 'Unknown',
        fifth: this.getRandomZodiacSign()?.name_en || 'Unknown',
        sixth: this.getRandomZodiacSign()?.name_en || 'Unknown',
        seventh: this.getRandomZodiacSign()?.name_en || 'Unknown',
        eighth: this.getRandomZodiacSign()?.name_en || 'Unknown',
        ninth: this.getRandomZodiacSign()?.name_en || 'Unknown',
        tenth: this.getRandomZodiacSign()?.name_en || 'Unknown',
        eleventh: this.getRandomZodiacSign()?.name_en || 'Unknown',
        twelfth: this.getRandomZodiacSign()?.name_en || 'Unknown'
      },
      aspects: {
        sun_moon: this.getRandomAspect(),
        sun_mercury: this.getRandomAspect(),
        sun_venus: this.getRandomAspect(),
        moon_venus: this.getRandomAspect(),
        mercury_venus: this.getRandomAspect()
      },
      personalityProfile: {
        coreTraits: zodiacSign.traits.slice(0, 3),
        strengths: this.generatePersonalityStrengths(zodiacSign),
        challenges: this.generatePersonalityChallenges(zodiacSign),
        lifePurpose: this.generateLifePurpose(zodiacSign)
      },
      lifeGuidance: {
        career: this.generateCareerGuidance(zodiacSign),
        relationships: this.generateRelationshipGuidance(zodiacSign),
        personalGrowth: this.generatePersonalGrowthGuidance(zodiacSign),
        challenges: this.generateLifeChallenges(zodiacSign)
      },
      personalityAnalysis: this.generatePersonalityAnalysis(zodiacSign, moonSign, risingSign),
      houseAnalysis: this.generateHouseAnalysis(),
      guidance: this.generateBirthChartGuidance(zodiacSign),
      createdAt: new Date().toISOString()
    };
  }

  /**
   * 生成运势（模拟AI生成）
   */
  private async generateFortune(zodiacSign: any, timeframe: string, date: string) {
    const sessionId = crypto.randomUUID();
    
    // 基于星座特征生成模拟运势
    const baseScore = Math.floor(Math.random() * 3) + 7; // 7-9分基础分
    const variation = () => Math.floor(Math.random() * 3) - 1; // -1到1的变化
    
    return {
      sessionId,
      zodiacSign: zodiacSign.id,
      date,
      timeframe,
      overall: {
        score: Math.max(1, Math.min(10, baseScore + variation())),
        description: this.generateFortuneDescription(zodiacSign, 'overall', timeframe)
      },
      love: {
        score: Math.max(1, Math.min(10, baseScore + variation())),
        description: this.generateFortuneDescription(zodiacSign, 'love', timeframe)
      },
      career: {
        score: Math.max(1, Math.min(10, baseScore + variation())),
        description: this.generateFortuneDescription(zodiacSign, 'career', timeframe)
      },
      wealth: {
        score: Math.max(1, Math.min(10, baseScore + variation())),
        description: this.generateFortuneDescription(zodiacSign, 'wealth', timeframe)
      },
      health: {
        score: Math.max(1, Math.min(10, baseScore + variation())),
        description: this.generateFortuneDescription(zodiacSign, 'health', timeframe)
      },
      luckyElements: {
        colors: this.getLuckyColors(zodiacSign),
        numbers: this.getLuckyNumbers(),
        directions: this.getLuckyDirections(zodiacSign)
      },
      advice: this.generateAdvice(zodiacSign, timeframe),
      createdAt: new Date().toISOString()
    };
  }


  /**
   * 生成配对分析（模拟AI生成）
   */
  private async generateCompatibility(zodiac1: any, zodiac2: any, relationType: string) {
    const sessionId = crypto.randomUUID();
    
    // 计算基础兼容性
    const element1 = zodiac1.element as keyof typeof ELEMENT_COMPATIBILITY;
    const element2 = zodiac2.element as keyof typeof ELEMENT_COMPATIBILITY[typeof element1];
    const elementScore = ELEMENT_COMPATIBILITY[element1][element2];
    const baseScore = Math.floor(elementScore * 100);
    const variation = Math.floor(Math.random() * 20) - 10; // -10到10的变化
    const finalScore = Math.max(10, Math.min(100, baseScore + variation));
    
    return {
      sessionId,
      sign1: zodiac1.id,
      sign2: zodiac2.id,
      relationType,
      overallScore: finalScore,
      specificScore: finalScore,
      strengths: this.generateStrengths(zodiac1, zodiac2, relationType),
      challenges: this.generateChallenges(zodiac1, zodiac2, relationType),
      advice: this.generateCompatibilityAdvice(zodiac1, zodiac2, relationType),
      elementCompatibility: `${zodiac1.element} + ${zodiac2.element}`,
      qualityCompatibility: `${zodiac1.quality} + ${zodiac2.quality}`,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * 生成运势描述
   */
  private generateFortuneDescription(zodiacSign: any, aspect: string, _timeframe: string): string {
    const templates = {
      overall: [
        `Your ${zodiacSign.element} energy is particularly strong today, bringing opportunities for growth and positive change.`,
        `The planetary alignments favor your ${zodiacSign.quality} nature, encouraging you to take initiative in important matters.`,
        `Your ruling planet ${zodiacSign.ruling_planet} brings favorable influences to your daily activities.`
      ],
      love: [
        `Your natural ${zodiacSign.traits[0]} personality attracts positive romantic energy.`,
        `Communication flows easily in relationships, thanks to your ${zodiacSign.traits[2]} nature.`,
        `Your ${zodiacSign.element} element brings passion and warmth to romantic connections.`
      ],
      career: [
        `Your ${zodiacSign.traits[0]} approach to work opens new professional opportunities.`,
        `Colleagues appreciate your ${zodiacSign.traits[1]} and ${zodiacSign.traits[2]} qualities.`,
        `Your ${zodiacSign.quality} nature helps you adapt to workplace challenges effectively.`
      ],
      wealth: [
        `Financial opportunities align with your ${zodiacSign.traits[0]} approach to money management.`,
        `Your practical ${zodiacSign.element} nature guides wise investment decisions.`,
        `Unexpected financial gains may come through your ${zodiacSign.traits[2]} abilities.`
      ],
      health: [
        `Your ${zodiacSign.element} constitution benefits from balanced activities and proper rest.`,
        `Pay attention to your ${zodiacSign.traits[1]} nature and avoid overexertion.`,
        `Your natural ${zodiacSign.traits[0]} energy supports overall wellness and vitality.`
      ]
    };

    const aspectTemplates = templates[aspect as keyof typeof templates] || templates.overall;
    return aspectTemplates[Math.floor(Math.random() * aspectTemplates.length)] || 'Your stellar energy brings positive influences today.';
  }

  /**
   * 获取幸运颜色
   */
  private getLuckyColors(zodiacSign: any): string[] {
    const colorMap = {
      fire: ['Red', 'Orange', 'Gold'],
      earth: ['Green', 'Brown', 'Beige'],
      air: ['Yellow', 'Light Blue', 'Silver'],
      water: ['Blue', 'Purple', 'Turquoise']
    };
    return colorMap[zodiacSign.element as keyof typeof colorMap] || ['White', 'Silver'];
  }

  /**
   * 获取幸运数字
   */
  private getLuckyNumbers(): number[] {
    const numbers = [];
    for (let i = 0; i < 3; i++) {
      numbers.push(Math.floor(Math.random() * 9) + 1);
    }
    return Array.from(new Set(numbers)); // 去重
  }

  /**
   * 获取幸运方位
   */
  private getLuckyDirections(zodiacSign: any): string[] {
    const directionMap = {
      fire: ['South', 'Southeast'],
      earth: ['Southwest', 'Northeast'],
      air: ['East', 'Northwest'],
      water: ['North', 'West']
    };
    return directionMap[zodiacSign.element as keyof typeof directionMap] || ['Center'];
  }

  /**
   * 生成建议
   */
  private generateAdvice(zodiacSign: any, _timeframe: string): string {
    const adviceTemplates = [
      `Embrace your natural ${zodiacSign.traits[0]} energy and trust your instincts in important decisions.`,
      `Your ${zodiacSign.element} nature suggests focusing on balance and harmony in all aspects of life.`,
      `Channel your ${zodiacSign.quality} qualities to overcome any challenges that may arise.`,
      `Remember that your ${zodiacSign.traits[1]} personality is one of your greatest strengths.`
    ];
    
    return adviceTemplates[Math.floor(Math.random() * adviceTemplates.length)] || 'Trust your instincts and embrace positive change.';
  }

  /**
   * 生成配对优势
   */
  private generateStrengths(zodiac1: any, zodiac2: any, _relationType: string): string[] {
    return [
      `Both signs share a natural understanding of ${zodiac1.element === zodiac2.element ? 'the same element' : 'complementary energies'}.`,
      `${zodiac1.name_en}'s ${zodiac1.traits[0]} nature complements ${zodiac2.name_en}'s ${zodiac2.traits[1]} personality.`,
      `The combination of ${zodiac1.quality} and ${zodiac2.quality} qualities creates a balanced dynamic.`,
      `Both signs value growth and positive change in their relationship.`
    ];
  }

  /**
   * 生成配对挑战
   */
  private generateChallenges(zodiac1: any, zodiac2: any, _relationType: string): string[] {
    return [
      `${zodiac1.name_en}'s ${zodiac1.traits[3]} tendency may clash with ${zodiac2.name_en}'s ${zodiac2.traits[3]} nature.`,
      `Different approaches to ${zodiac1.element === zodiac2.element ? 'similar goals' : 'life priorities'} may cause misunderstandings.`,
      `Communication styles influenced by ${zodiac1.ruling_planet} and ${zodiac2.ruling_planet} may differ significantly.`,
      `Balancing individual needs with relationship harmony requires conscious effort.`
    ];
  }

  /**
   * 生成配对建议
   */
  private generateCompatibilityAdvice(zodiac1: any, zodiac2: any, relationType: string): string {
    return `Focus on appreciating each other's unique qualities. ${zodiac1.name_en}'s ${zodiac1.traits[0]} nature can inspire ${zodiac2.name_en}, while ${zodiac2.name_en}'s ${zodiac2.traits[1]} approach can provide stability. Open communication and mutual respect will strengthen your ${relationType} bond.`;
  }

  /**
   * 保存出生星盘到数据库
   */
  private async saveBirthChart(birthChart: any) {
    try {
      // 这里应该保存到数据库
      // 暂时只记录日志
      logger.info(`Birth chart saved for ${birthChart.birthDate} in ${birthChart.birthLocation}`);
    } catch (error) {
      logger.error('Failed to save birth chart:', error);
    }
  }

  /**
   * 生成出生星盘指导
   */
  private generateBirthChartGuidance(zodiacSign: any): string {
    return `Your birth chart reveals a complex personality shaped by multiple planetary influences. Embrace your ${zodiacSign.traits[0]} nature while working on your ${zodiacSign.traits[3]} tendencies. Your ${zodiacSign.element} energy can be channeled positively through creative expression and meaningful relationships. Trust your instincts and use your ${zodiacSign.traits[1]} qualities to navigate life's challenges.`;
  }

  /**
   * 获取缓存TTL
   */
  private getCacheTTL(timeframe: string): number {
    const ttlMap = {
      'daily': 86400,    // 24小时
      'weekly': 604800,  // 7天
      'monthly': 2592000, // 30天
      'yearly': 31536000  // 365天
    };
    return ttlMap[timeframe as keyof typeof ttlMap] || 86400;
  }

  /**
   * 保存运势到数据库
   */
  private async saveFortune(fortune: any) {
    try {
      // 这里应该保存到数据库
      // 暂时只记录日志
      logger.info(`Fortune saved for ${fortune.zodiacSign} on ${fortune.date}`);
    } catch (error) {
      logger.error('Failed to save fortune:', error);
    }
  }

  /**
   * 保存配对分析到数据库
   */
  private async saveCompatibility(compatibility: any) {
    try {
      // 这里应该保存到数据库
      // 暂时只记录日志
      logger.info(`Compatibility saved for ${compatibility.sign1} & ${compatibility.sign2}`);
    } catch (error) {
      logger.error('Failed to save compatibility:', error);
    }
  }


  /**
   * 根据日期获取太阳星座
   */
  private getSunSignFromDate(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      return 'aries';
    }
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
      return 'taurus';
    }
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
      return 'gemini';
    }
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
      return 'cancer';
    }
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
      return 'leo';
    }
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
      return 'virgo';
    }
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
      return 'libra';
    }
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
      return 'scorpio';
    }
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
      return 'sagittarius';
    }
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      return 'capricorn';
    }
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
      return 'aquarius';
    }
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
      return 'pisces';
    }
    
    return 'aries'; // 默认值
  }

  /**
   * 获取随机星座
   */
  private getRandomZodiacSign() {
    return ZODIAC_SIGNS[Math.floor(Math.random() * ZODIAC_SIGNS.length)] || ZODIAC_SIGNS[0];
  }

  /**
   * 获取随机相位
   */
  private getRandomAspect(): string {
    const aspects = ['conjunction', 'sextile', 'square', 'trine', 'opposition'];
    return aspects[Math.floor(Math.random() * aspects.length)] || 'conjunction';
  }

  /**
   * 生成性格优势
   */
  private generatePersonalityStrengths(zodiacSign: any): string[] {
    return [
      `Your natural ${zodiacSign.traits[0]} energy makes you a natural leader`,
      `Your ${zodiacSign.traits[1]} approach to life brings stability and reliability`,
      `Your ${zodiacSign.traits[2]} abilities help you connect with others effectively`
    ];
  }

  /**
   * 生成性格挑战
   */
  private generatePersonalityChallenges(zodiacSign: any): string[] {
    return [
      `Your ${zodiacSign.traits[3]} tendency may sometimes create obstacles`,
      `Learning to balance your ${zodiacSign.element} nature with flexibility`,
      `Managing your ${zodiacSign.traits[4]} traits for better relationships`
    ];
  }

  /**
   * 生成人生目标
   */
  private generateLifePurpose(zodiacSign: any): string {
    return `Your life purpose involves embracing your ${zodiacSign.traits[0]} nature while developing your ${zodiacSign.traits[1]} qualities to create positive impact in the world.`;
  }

  /**
   * 生成职业指导
   */
  private generateCareerGuidance(zodiacSign: any): string {
    return `Your ${zodiacSign.element} nature suggests careers that allow you to express your ${zodiacSign.traits[0]} energy. Consider fields that value your ${zodiacSign.traits[1]} approach and ${zodiacSign.traits[2]} abilities.`;
  }

  /**
   * 生成关系指导
   */
  private generateRelationshipGuidance(zodiacSign: any): string {
    return `In relationships, your ${zodiacSign.traits[0]} personality attracts partners who appreciate your ${zodiacSign.traits[1]} nature. Focus on open communication and mutual understanding.`;
  }

  /**
   * 生成个人成长指导
   */
  private generatePersonalGrowthGuidance(zodiacSign: any): string {
    return `Personal growth for you involves balancing your ${zodiacSign.quality} nature with flexibility, and developing your ${zodiacSign.traits[2]} abilities while managing your ${zodiacSign.traits[3]} tendencies.`;
  }

  /**
   * 生成人生挑战
   */
  private generateLifeChallenges(zodiacSign: any): string {
    return `Your main life challenges involve learning to work with your ${zodiacSign.traits[3]} nature and finding balance between your ${zodiacSign.element} energy and the needs of others.`;
  }

  /**
   * 生成性格分析
   */
  private generatePersonalityAnalysis(sunSign: any, moonSign: any, risingSign: any): string {
    return `Your Sun in ${sunSign.name_en} gives you a ${sunSign.traits[0]} and ${sunSign.traits[1]} personality. Your Moon in ${moonSign.name_en} adds ${moonSign.traits[0]} emotional depth, while your Rising sign ${risingSign.name_en} makes you appear ${risingSign.traits[0]} and ${risingSign.traits[1]} to others. This combination creates a unique blend of ${sunSign.element}, ${moonSign.element}, and ${risingSign.element} energies.`;
  }

  /**
   * 生成宫位分析
   */
  private generateHouseAnalysis(): string {
    return `Your birth chart reveals important themes in different areas of life. The first house represents your identity and how others see you. The fourth house relates to your home and family life. The seventh house governs partnerships and relationships. The tenth house indicates your career and public reputation. Each house placement influences how you approach different life areas.`;
  }

  /**
   * 生成出生星盘指导
   */
}