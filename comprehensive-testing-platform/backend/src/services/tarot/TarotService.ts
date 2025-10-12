/**
 * Tarot Service
 * 塔罗牌服务类
 * 遵循统一开发标准的服务架构
 */

import { CacheService } from '../CacheService';
import { AIService } from '../AIService';
import { TarotSessionModel } from '../../models/TarotSessionModel';

// Cloudflare Workers types - using any to avoid import issues
type D1Database = any;
type KVNamespace = any;
type Env = any;

// 塔罗牌类型定义
interface TarotCard {
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

interface QuestionCategory {
  id: string;
  name_zh: string;
  name_en: string;
  description_zh: string;
  description_en: string;
  icon: string;
  color_theme: string;
  sort_order: number;
}

interface TarotSpread {
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

interface TarotRecommendation {
  spread: TarotSpread;
  reason: string;
  expectedDuration: string;
  difficultyLevel: number;
  description: string;
}

interface DrawnCard {
  card: TarotCard;
  position: number;
  isReversed: boolean;
  positionMeaning: string;
}

interface BasicReading {
  summary: string;
  key_themes: string[];
  general_advice: string;
}

interface AIReading {
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

export interface TarotRecommendationRequest {
  categoryId: string;
  questionText?: string;
  language?: string;
}

export interface RequestContext {
  requestId: string;
  userAgent: string;
  ip: string;
}

export class TarotService {
  private db: D1Database;
  // @ts-ignore - 保留用于未来扩展
  private _kv: KVNamespace;
  private tarotSessionModel: TarotSessionModel;
  private aiService: AIService;
  private cacheService: CacheService;

  constructor(db: D1Database, kv: KVNamespace, apiKey: string) {
    this.db = db;
    this._kv = kv;
    this.tarotSessionModel = new TarotSessionModel({ DB: db, KV: kv, DEEPSEEK_API_KEY: apiKey } as Env);
    this.aiService = new AIService(apiKey);
    this.cacheService = new CacheService(kv);
  }

  private createError(message: string, code: string): Error {
    const error = new Error(message);
    (error as any).code = code;
    return error;
  }

  private async getCache(key: string): Promise<any> {
    return this.cacheService.get(key);
  }

  private async setCache(key: string, value: any, ttl: number): Promise<void> {
    this.cacheService.set(key, value, { ttl });
  }

  private get safeDB() {
    return this.db;
  }

  /**
   * 获取塔罗牌列表
   */
  async getTarotCards(): Promise<TarotCard[]> {
    try {
      // 从缓存获取
      const cacheKey = 'tarot_cards';
      const cached = await this.getCache(cacheKey);
      if (cached) {
        return cached;
      }

      // 从数据库获取
      const result = await this.safeDB
        .prepare('SELECT * FROM tarot_cards ORDER BY suit, number')
        .all();

      const cards: TarotCard[] = result.results.map((row: any) => ({
        id: row.id,
        name_zh: row.name_zh,
        name_en: row.name_en,
        suit: row.suit,
        number: row.number,
        image_url: row.image_url,
        keywords_zh: JSON.parse(row.keywords_zh || '[]'),
        keywords_en: JSON.parse(row.keywords_en || '[]'),
        meaning_upright_zh: row.meaning_upright_zh,
        meaning_upright_en: row.meaning_upright_en,
        meaning_reversed_zh: row.meaning_reversed_zh,
        meaning_reversed_en: row.meaning_reversed_en,
        element: row.element,
        astrological_sign: row.astrological_sign,
        planet: row.planet,
        description_zh: row.description_zh,
        description_en: row.description_en
      }));

      // 缓存结果
      await this.setCache(cacheKey, cards, 24 * 60 * 60 * 1000); // 24小时

      return cards;
    } catch (error) {
      throw this.createError('Failed to get tarot cards', 'DATABASE_ERROR');
    }
  }

  /**
   * 清除塔罗牌缓存
   */
  async clearTarotCardsCache(): Promise<void> {
    try {
      const cacheKey = 'tarot_cards';
      await this.cacheService.delete(cacheKey);
    } catch (error) {
      // 忽略缓存清除错误
    }
  }

  /**
   * 获取问题分类
   */
  async getQuestionCategories(): Promise<QuestionCategory[]> {
    try {
      const cacheKey = 'tarot_categories';
      const cached = await this.getCache(cacheKey);
      if (cached) {
        return cached;
      }

      const result = await this.safeDB
        .prepare('SELECT * FROM tarot_categories ORDER BY sort_order')
        .all();

      const categories: QuestionCategory[] = result.results.map((row: any) => ({
        id: row.id,
        name_zh: row.name_zh,
        name_en: row.name_en,
        description_zh: row.description_zh,
        description_en: row.description_en,
        icon: row.icon,
        color_theme: row.color_theme,
        sort_order: row.sort_order
      }));

      await this.setCache(cacheKey, categories, 24 * 60 * 60 * 1000);
      return categories;
    } catch (error) {
      throw this.createError('Failed to get question categories', 'DATABASE_ERROR');
    }
  }

  /**
   * 获取牌阵配置
   */
  async getTarotSpreads(): Promise<TarotSpread[]> {
    try {
      const cacheKey = 'tarot_spreads';
      const cached = await this.getCache(cacheKey);
      if (cached) {
        return cached;
      }

      const result = await this.safeDB
        .prepare('SELECT * FROM tarot_spreads WHERE is_active = 1 ORDER BY difficulty_level, usage_count DESC')
        .all();

      const spreads: TarotSpread[] = result.results.map((row: any) => ({
        id: row.id,
        name_zh: row.name_zh,
        name_en: row.name_en,
        description_zh: row.description_zh,
        description_en: row.description_en,
        card_count: row.card_count,
        layout_config: JSON.parse(row.layout_config || '{}'),
        positions: JSON.parse(row.positions || '[]'),
        difficulty_level: row.difficulty_level,
        usage_count: row.usage_count,
        is_active: Boolean(row.is_active)
      }));

      await this.setCache(cacheKey, spreads, 24 * 60 * 60 * 1000);
      return spreads;
    } catch (error) {
      throw this.createError('Failed to get tarot spreads', 'DATABASE_ERROR');
    }
  }

  /**
   * 获取推荐
   */
  async getRecommendation(request: TarotRecommendationRequest): Promise<TarotRecommendation> {
    try {
      const { categoryId } = request;

      // 获取所有牌阵
      const spreads = await this.getTarotSpreads();
      
      // 根据分类和问题推荐合适的牌阵
      let recommendedSpread: TarotSpread;
      
      if (categoryId === 'love') {
        recommendedSpread = spreads.find(s => s.id === 'relationship') || spreads[0]!;
      } else if (categoryId === 'career') {
        recommendedSpread = spreads.find(s => s.id === 'career') || spreads[0]!;
      } else if (request.questionText && request.questionText.length > 50) {
        recommendedSpread = spreads.find(s => s.id === 'celtic_cross') || spreads[0]!;
      } else {
        recommendedSpread = spreads.find(s => s.id === 'three_card') || spreads[0]!;
      }

      const recommendation: TarotRecommendation = {
        spread: recommendedSpread,
        reason: this.getRecommendationReason(categoryId),
        expectedDuration: this.getExpectedDuration(recommendedSpread.card_count),
        difficultyLevel: recommendedSpread.difficulty_level,
        description: recommendedSpread.description_en
      };

      return recommendation;
    } catch (error) {
      throw this.createError('Failed to get recommendation', 'SERVICE_ERROR');
    }
  }

  /**
   * 抽牌
   */
  async drawCards(request: TarotDrawRequest, _context: RequestContext): Promise<TarotDrawResponse> {
    try {
      const { spreadId, categoryId } = request;

      // 获取牌阵配置
      const spreads = await this.getTarotSpreads();
      const spread = spreads.find(s => s.id === spreadId);
      if (!spread) {
        throw this.createError('Invalid spread ID', 'VALIDATION_ERROR');
      }

      // 获取所有塔罗牌
      const allCards = await this.getTarotCards();

      // 随机抽取指定数量的牌
      const drawnCards: DrawnCard[] = [];
      const usedCardIds = new Set<string>();

      for (let i = 0; i < spread.card_count; i++) {
        let card: TarotCard;
        let attempts = 0;
        
        // 确保不重复抽到同一张牌
        do {
          const randomIndex = Math.floor(Math.random() * allCards.length);
          card = allCards[randomIndex]!;
          attempts++;
        } while (usedCardIds.has(card.id) && attempts < 100);

        if (attempts >= 100) {
          // 如果尝试次数过多，重新洗牌
          usedCardIds.clear();
          const randomIndex = Math.floor(Math.random() * allCards.length);
          card = allCards[randomIndex]!;
        }

        usedCardIds.add(card.id);

        // 随机决定是否反转
        const isReversed = Math.random() < 0.3; // 30%概率反转

        drawnCards.push({
          card,
          position: i + 1,
          isReversed,
          positionMeaning: spread.positions[i]?.meaning || 'General guidance'
        });
      }

      // 生成基础解读
      const basicReading = this.generateBasicReading(drawnCards);

      // 创建会话记录
      const sessionId = await this.createTarotSession({
        testSessionId: `tarot_${Date.now()}`,
        spreadType: spreadId as any,
        cardsDrawn: drawnCards.map(dc => ({
          id: dc.card.id,
          name: dc.card.name_en,
          suit: dc.card.suit,
          number: dc.card.number,
          isReversed: dc.isReversed,
          meaning: dc.isReversed ? dc.card.meaning_reversed_en : dc.card.meaning_upright_en,
          reversedMeaning: dc.card.meaning_reversed_en
        })),
        cardPositions: drawnCards.reduce((acc, dc, index) => {
          acc[`position_${index + 1}`] = {
            cardId: dc.card.id,
            isReversed: dc.isReversed,
            position: dc.position,
            meaning: dc.positionMeaning
          };
          return acc;
        }, {} as Record<string, any>),
        interpretationTheme: categoryId || 'general',
        questionCategory: categoryId as any || 'general'
      });

      return {
        sessionId,
        drawnCards,
        spread,
        basicReading
      };
    } catch (error) {
      throw this.createError('Failed to draw cards', 'SERVICE_ERROR');
    }
  }

  /**
   * 获取AI解读
   */
  async getAIReading(sessionId: string, context: RequestContext): Promise<AIReading> {
    try {
      // 获取会话数据
      const session = await this.tarotSessionModel.findById(sessionId);
      if (!session) {
        throw this.createError('Session not found', 'NOT_FOUND');
      }

      // 调用AI服务生成解读
      const aiReading = await this.aiService.analyzeTarotReading(sessionId, context);

      return aiReading;
    } catch (error) {
      throw this.createError('Failed to get AI reading', 'SERVICE_ERROR');
    }
  }

  /**
   * 提交反馈
   */
  async submitFeedback(_sessionId: string, _feedback: 'like' | 'dislike'): Promise<void> {
    try {
      // 这里可以记录反馈到数据库
    } catch (error) {
      throw this.createError('Failed to submit feedback', 'SERVICE_ERROR');
    }
  }

  /**
   * 创建塔罗牌会话
   */
  private async createTarotSession(data: any): Promise<string> {
    // 先创建 test_sessions 记录
    const testSessionId = data.testSessionId;
    await this.createTestSession(testSessionId);
    
    // 然后创建 tarot_sessions 记录
    return await this.tarotSessionModel.create(data);
  }

  /**
   * 创建测试会话记录
   */
  private async createTestSession(sessionId: string): Promise<void> {
    try {
      await this.safeDB
        .prepare(`
          INSERT INTO test_sessions (
            id, test_type_id, answers_data, result_data, 
            user_agent, ip_address_hash, session_duration, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          sessionId,
          'tarot_reading',
          JSON.stringify([]),
          JSON.stringify({}),
          '',
          '',
          0,
          new Date().toISOString()
        )
        .run();
    } catch (error) {
      throw this.createError('Failed to create test session', 'DATABASE_ERROR');
    }
  }

  /**
   * 生成推荐理由
   */
  private getRecommendationReason(categoryId: string): string {
    if (categoryId === 'love') {
      return 'Perfect for relationship questions and emotional guidance';
    } else if (categoryId === 'career') {
      return 'Ideal for career decisions and professional development';
    } else {
      return 'Great for general guidance and quick insights';
    }
  }

  /**
   * 获取预期时长
   */
  private getExpectedDuration(cardCount: number): string {
    if (cardCount === 1) {
      return '1-2 minutes';
    }
    if (cardCount <= 3) {
      return '2-3 minutes';
    }
    if (cardCount <= 5) {
      return '3-5 minutes';
    }
    if (cardCount <= 7) {
      return '5-8 minutes';
    }
    return '8-12 minutes';
  }

  /**
   * 生成基础解读
   */
  private generateBasicReading(drawnCards: DrawnCard[]): BasicReading {
    const keyThemes = drawnCards.map(dc => 
      dc.isReversed ? dc.card.keywords_en[0] : dc.card.keywords_en[0]
    ).filter(theme => theme !== undefined) as string[];

    const summary = `Your reading reveals ${keyThemes.join(', ')}. The cards suggest focusing on these key areas for guidance.`;

    const generalAdvice = `Trust your intuition and consider the messages from each card position. The reversed cards indicate areas that may need special attention or a different approach.`;

    return {
      summary,
      key_themes: keyThemes,
      general_advice: generalAdvice
    };
  }
}
