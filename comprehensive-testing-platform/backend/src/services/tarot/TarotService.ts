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

      let cards: TarotCard[] = [];

      try {
        // 尝试从数据库获取
        const result = await this.safeDB
          .prepare('SELECT * FROM tarot_cards ORDER BY suit, number')
          .all();

        cards = result.results.map((row: any) => ({
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
      } catch (dbError) {
        // console.error('Database query failed, using fallback data:', dbError);
        cards = [];
      }

      // 如果数据库中没有数据，使用默认数据作为fallback
      if (cards.length === 0) {
        cards = this.getFallbackTarotCards();
      }

      // 缓存结果
      await this.setCache(cacheKey, cards, 24 * 60 * 60 * 1000); // 24小时

      return cards;
    } catch (error) {
      throw this.createError('Failed to get tarot cards', 'DATABASE_ERROR');
    }
  }

  /**
   * 获取fallback塔罗牌数据
   * 包含完整的78张塔罗牌（22张大阿卡纳 + 56张小阿卡纳），确保完整的专业占卜体验
   */
  private getFallbackTarotCards(): TarotCard[] {
    // 大阿卡纳 (22张)
    const majorArcana: TarotCard[] = [
      // 0 - 愚者
      {
        id: 'fool',
        name_zh: '愚者',
        name_en: 'The Fool',
        suit: 'major' as const,
        number: 0,
        image_url: '/images/tarot/major/fool.jpg',
        keywords_zh: ['新开始', '冒险', '纯真', '自由'],
        keywords_en: ['New Beginnings', 'Adventure', 'Innocence', 'Freedom'],
        meaning_upright_zh: '新的开始，充满可能性的旅程，纯真的心灵，勇敢的冒险精神。',
        meaning_upright_en: 'New beginnings, a journey full of possibilities, innocent heart, brave adventurous spirit.',
        meaning_reversed_zh: '鲁莽行事，缺乏计划，过度天真，逃避责任。',
        meaning_reversed_en: 'Reckless behavior, lack of planning, excessive naivety, avoiding responsibility.',
        element: 'Air',
        astrological_sign: 'Uranus',
        planet: 'Uranus',
        description_zh: '愚者代表着新的开始和无限的可能性。他象征着纯真的心灵和勇敢的冒险精神，提醒我们要保持开放的心态去迎接生活中的新挑战。',
        description_en: 'The Fool represents new beginnings and infinite possibilities. He symbolizes an innocent heart and brave adventurous spirit, reminding us to keep an open mind to embrace new challenges in life.'
      },
      // 1 - 魔术师
      {
        id: 'magician',
        name_zh: '魔术师',
        name_en: 'The Magician',
        suit: 'major' as const,
        number: 1,
        image_url: '/images/tarot/major/magician.jpg',
        keywords_zh: ['意志力', '技能', '专注', '行动'],
        keywords_en: ['Willpower', 'Skill', 'Focus', 'Action'],
        meaning_upright_zh: '拥有实现目标的能力，专注的意志力，技能和资源的运用，主动的行动。',
        meaning_upright_en: 'Ability to achieve goals, focused willpower, use of skills and resources, proactive action.',
        meaning_reversed_zh: '缺乏意志力，技能不足，滥用权力，欺骗他人。',
        meaning_reversed_en: 'Lack of willpower, insufficient skills, abuse of power, deceiving others.',
        element: 'Air',
        astrological_sign: 'Mercury',
        planet: 'Mercury',
        description_zh: '魔术师象征着意志力和实现目标的能力。他提醒我们拥有实现梦想所需的所有工具和技能，关键在于如何运用它们。',
        description_en: 'The Magician symbolizes willpower and the ability to achieve goals. He reminds us that we have all the tools and skills needed to realize our dreams, the key is how to use them.'
      },
      // 2 - 女祭司
      {
        id: 'high_priestess',
        name_zh: '女祭司',
        name_en: 'The High Priestess',
        suit: 'major' as const,
        number: 2,
        image_url: '/images/tarot/major/high_priestess.jpg',
        keywords_zh: ['直觉', '神秘', '潜意识', '智慧'],
        keywords_en: ['Intuition', 'Mystery', 'Subconscious', 'Wisdom'],
        meaning_upright_zh: '强大的直觉力，内在的智慧，神秘的知识，潜意识的洞察。',
        meaning_upright_en: 'Strong intuitive power, inner wisdom, mysterious knowledge, subconscious insight.',
        meaning_reversed_zh: '缺乏直觉，忽视内在声音，过度理性，隐藏真相。',
        meaning_reversed_en: 'Lack of intuition, ignoring inner voice, excessive rationality, hiding truth.',
        element: 'Water',
        astrological_sign: 'Moon',
        planet: 'Moon',
        description_zh: '女祭司代表直觉和内在智慧。她象征着潜意识的力量和神秘的知识，提醒我们要相信自己的直觉和内在声音。',
        description_en: 'The High Priestess represents intuition and inner wisdom. She symbolizes the power of the subconscious and mysterious knowledge, reminding us to trust our intuition and inner voice.'
      },
      // 3 - 皇后
      {
        id: 'empress',
        name_zh: '皇后',
        name_en: 'The Empress',
        suit: 'major' as const,
        number: 3,
        image_url: '/images/tarot/major/empress.jpg',
        keywords_zh: ['丰饶', '创造', '母性', '自然'],
        keywords_en: ['Fertility', 'Creation', 'Motherhood', 'Nature'],
        meaning_upright_zh: '丰饶与创造力，母性的关怀，与自然的连接，感性的表达。',
        meaning_upright_en: 'Fertility and creativity, maternal care, connection with nature, sensual expression.',
        meaning_reversed_zh: '创造力受阻，过度依赖他人，缺乏自我关怀，与自然疏远。',
        meaning_reversed_en: 'Blocked creativity, over-dependence on others, lack of self-care, alienation from nature.',
        element: 'Earth',
        astrological_sign: 'Venus',
        planet: 'Venus',
        description_zh: '皇后象征着丰饶和创造力。她代表母性的力量和与自然的深度连接，提醒我们要关爱自己和他人。',
        description_en: 'The Empress symbolizes fertility and creativity. She represents maternal power and deep connection with nature, reminding us to care for ourselves and others.'
      },
      // 4 - 皇帝
      {
        id: 'emperor',
        name_zh: '皇帝',
        name_en: 'The Emperor',
        suit: 'major' as const,
        number: 4,
        image_url: '/images/tarot/major/emperor.jpg',
        keywords_zh: ['权威', '结构', '父性', '控制'],
        keywords_en: ['Authority', 'Structure', 'Fatherhood', 'Control'],
        meaning_upright_zh: '权威与领导力，建立秩序和结构，父性的保护，理性的控制。',
        meaning_upright_en: 'Authority and leadership, establishing order and structure, paternal protection, rational control.',
        meaning_reversed_zh: '滥用权力，过度控制，缺乏灵活性，专制统治。',
        meaning_reversed_en: 'Abuse of power, excessive control, lack of flexibility, tyrannical rule.',
        element: 'Fire',
        astrological_sign: 'Aries',
        planet: 'Mars',
        description_zh: '皇帝代表权威和领导力。他象征着建立秩序和结构的能力，提醒我们要负责任地运用权力。',
        description_en: 'The Emperor represents authority and leadership. He symbolizes the ability to establish order and structure, reminding us to use power responsibly.'
      },
      // 5 - 教皇
      {
        id: 'hierophant',
        name_zh: '教皇',
        name_en: 'The Hierophant',
        suit: 'major' as const,
        number: 5,
        image_url: '/images/tarot/major/hierophant.jpg',
        keywords_zh: ['传统', '教导', '精神指导', '信仰'],
        keywords_en: ['Tradition', 'Teaching', 'Spiritual Guidance', 'Faith'],
        meaning_upright_zh: '传统的智慧，精神的指导，信仰的力量，学习和教导。',
        meaning_upright_en: 'Traditional wisdom, spiritual guidance, power of faith, learning and teaching.',
        meaning_reversed_zh: '反叛传统，独立思考，拒绝指导，信仰危机。',
        meaning_reversed_en: 'Rebellion against tradition, independent thinking, refusing guidance, crisis of faith.',
        element: 'Earth',
        astrological_sign: 'Taurus',
        planet: 'Venus',
        description_zh: '教皇象征着传统智慧和精神指导。他代表着学习和教导的重要性，提醒我们要尊重传统但也要独立思考。',
        description_en: 'The Hierophant symbolizes traditional wisdom and spiritual guidance. He represents the importance of learning and teaching, reminding us to respect tradition while thinking independently.'
      },
      // 6 - 恋人
      {
        id: 'lovers',
        name_zh: '恋人',
        name_en: 'The Lovers',
        suit: 'major' as const,
        number: 6,
        image_url: '/images/tarot/major/lovers.jpg',
        keywords_zh: ['爱情', '选择', '结合', '和谐'],
        keywords_en: ['Love', 'Choice', 'Union', 'Harmony'],
        meaning_upright_zh: '深刻的爱情，重要的选择，灵魂的结合，内心的和谐。',
        meaning_upright_en: 'Deep love, important choices, union of souls, inner harmony.',
        meaning_reversed_zh: '关系问题，错误的选择，缺乏和谐，内心冲突。',
        meaning_reversed_en: 'Relationship issues, wrong choices, lack of harmony, inner conflict.',
        element: 'Air',
        astrological_sign: 'Gemini',
        planet: 'Mercury',
        description_zh: '恋人代表爱情和重要的选择。这张牌象征着深层的连接和需要做出的重要决定，提醒我们要遵循内心的指引。',
        description_en: 'The Lovers represent love and important choices. This card symbolizes deep connections and significant decisions to be made, reminding us to follow our heart\'s guidance.'
      },
      // 7 - 战车
      {
        id: 'chariot',
        name_zh: '战车',
        name_en: 'The Chariot',
        suit: 'major' as const,
        number: 7,
        image_url: '/images/tarot/major/chariot.jpg',
        keywords_zh: ['意志', '控制', '前进', '胜利'],
        keywords_en: ['Will', 'Control', 'Progress', 'Victory'],
        meaning_upright_zh: '强大的意志力，自我控制，向前推进，最终的胜利。',
        meaning_upright_en: 'Strong willpower, self-control, moving forward, ultimate victory.',
        meaning_reversed_zh: '缺乏控制，方向混乱，内心冲突，失败挫折。',
        meaning_reversed_en: 'Lack of control, confused direction, inner conflict, failure and setbacks.',
        element: 'Water',
        astrological_sign: 'Cancer',
        planet: 'Moon',
        description_zh: '战车象征着意志力和控制。它代表着通过自我控制和坚定的意志来克服困难，最终取得胜利。',
        description_en: 'The Chariot symbolizes willpower and control. It represents overcoming difficulties through self-control and firm will, ultimately achieving victory.'
      },
      // 8 - 力量
      {
        id: 'strength',
        name_zh: '力量',
        name_en: 'Strength',
        suit: 'major' as const,
        number: 8,
        image_url: '/images/tarot/major/strength.jpg',
        keywords_zh: ['内在力量', '勇气', '耐心', '慈悲'],
        keywords_en: ['Inner Strength', 'Courage', 'Patience', 'Compassion'],
        meaning_upright_zh: '内在的力量，勇敢面对挑战，耐心和毅力，慈悲的心。',
        meaning_upright_en: 'Inner strength, courageously facing challenges, patience and perseverance, compassionate heart.',
        meaning_reversed_zh: '内心软弱，缺乏勇气，失去耐心，自我怀疑。',
        meaning_reversed_en: 'Inner weakness, lack of courage, losing patience, self-doubt.',
        element: 'Fire',
        astrological_sign: 'Leo',
        planet: 'Sun',
        description_zh: '力量代表真正的内在力量。它不是通过暴力，而是通过慈悲、耐心和理解来征服困难。',
        description_en: 'Strength represents true inner power. It conquers difficulties not through violence, but through compassion, patience, and understanding.'
      },
      // 9 - 隐士
      {
        id: 'hermit',
        name_zh: '隐士',
        name_en: 'The Hermit',
        suit: 'major' as const,
        number: 9,
        image_url: '/images/tarot/major/hermit.jpg',
        keywords_zh: ['内省', '指导', '智慧', '孤独'],
        keywords_en: ['Introspection', 'Guidance', 'Wisdom', 'Solitude'],
        meaning_upright_zh: '内心的反省，寻求指导，智慧的获得，必要的孤独。',
        meaning_upright_en: 'Inner reflection, seeking guidance, gaining wisdom, necessary solitude.',
        meaning_reversed_zh: '逃避现实，拒绝指导，过度孤立，缺乏自省。',
        meaning_reversed_en: 'Avoiding reality, refusing guidance, excessive isolation, lack of introspection.',
        element: 'Earth',
        astrological_sign: 'Virgo',
        planet: 'Mercury',
        description_zh: '隐士象征着内在的寻求和智慧。他代表着通过内省和孤独来寻找真理和指导的过程。',
        description_en: 'The Hermit symbolizes inner seeking and wisdom. He represents the process of finding truth and guidance through introspection and solitude.'
      },
      // 10 - 命运之轮
      {
        id: 'wheel_of_fortune',
        name_zh: '命运之轮',
        name_en: 'Wheel of Fortune',
        suit: 'major' as const,
        number: 10,
        image_url: '/images/tarot/major/wheel_of_fortune.jpg',
        keywords_zh: ['命运', '循环', '机会', '变化'],
        keywords_en: ['Destiny', 'Cycles', 'Opportunity', 'Change'],
        meaning_upright_zh: '命运的转折，生命的循环，新的机会，积极的变化。',
        meaning_upright_en: 'Turning point of destiny, cycles of life, new opportunities, positive changes.',
        meaning_reversed_zh: '坏运气，抵抗变化，错过机会，消极循环。',
        meaning_reversed_en: 'Bad luck, resisting change, missing opportunities, negative cycles.',
        element: 'Fire',
        astrological_sign: 'Jupiter',
        planet: 'Jupiter',
        description_zh: '命运之轮代表生命的循环和变化。它提醒我们命运在不断转动，要准备好迎接新的机会和挑战。',
        description_en: 'The Wheel of Fortune represents the cycles and changes of life. It reminds us that fate is constantly turning, and we should be ready to embrace new opportunities and challenges.'
      },
      // 11 - 正义
      {
        id: 'justice',
        name_zh: '正义',
        name_en: 'Justice',
        suit: 'major' as const,
        number: 11,
        image_url: '/images/tarot/major/justice.jpg',
        keywords_zh: ['公正', '平衡', '真理', '因果'],
        keywords_en: ['Fairness', 'Balance', 'Truth', 'Karma'],
        meaning_upright_zh: '公正的裁决，道德的平衡，真理的追求，因果的法则。',
        meaning_upright_en: 'Fair judgment, moral balance, pursuit of truth, law of karma.',
        meaning_reversed_zh: '不公正，偏见，逃避责任，道德失衡。',
        meaning_reversed_en: 'Injustice, prejudice, avoiding responsibility, moral imbalance.',
        element: 'Air',
        astrological_sign: 'Libra',
        planet: 'Venus',
        description_zh: '正义象征着平衡和公正。她提醒我们要以公正的态度对待他人，承担自己行为的后果。',
        description_en: 'Justice symbolizes balance and fairness. She reminds us to treat others with fairness and take responsibility for our actions.'
      },
      // 12 - 倒吊人
      {
        id: 'hanged_man',
        name_zh: '倒吊人',
        name_en: 'The Hanged Man',
        suit: 'major' as const,
        number: 12,
        image_url: '/images/tarot/major/hanged_man.jpg',
        keywords_zh: ['牺牲', '等待', '放下', '新视角'],
        keywords_en: ['Sacrifice', 'Waiting', 'Letting Go', 'New Perspective'],
        meaning_upright_zh: '必要的牺牲，耐心的等待，放下执着，获得新的视角。',
        meaning_upright_en: 'Necessary sacrifice, patient waiting, letting go of attachments, gaining new perspective.',
        meaning_reversed_zh: '无意义的牺牲，抗拒变化，固执己见，缺乏耐心。',
        meaning_reversed_en: 'Meaningless sacrifice, resisting change, stubbornness, lack of patience.',
        element: 'Water',
        astrological_sign: 'Neptune',
        planet: 'Neptune',
        description_zh: '倒吊人代表通过牺牲和等待来获得智慧。他教导我们有时需要放下控制，以新的角度看待问题。',
        description_en: 'The Hanged Man represents gaining wisdom through sacrifice and waiting. He teaches us that sometimes we need to let go of control and see problems from a new angle.'
      },
      // 13 - 死神
      {
        id: 'death',
        name_zh: '死神',
        name_en: 'Death',
        suit: 'major' as const,
        number: 13,
        image_url: '/images/tarot/major/death.jpg',
        keywords_zh: ['转变', '结束', '重生', '释放'],
        keywords_en: ['Transformation', 'Endings', 'Rebirth', 'Release'],
        meaning_upright_zh: '重大的转变，旧事物的结束，新生命的开始，释放过去。',
        meaning_upright_en: 'Major transformation, ending of old things, beginning of new life, releasing the past.',
        meaning_reversed_zh: '抗拒变化，停滞不前，害怕改变，错过机会。',
        meaning_reversed_en: 'Resisting change, stagnation, fear of change, missing opportunities.',
        element: 'Water',
        astrological_sign: 'Scorpio',
        planet: 'Mars',
        description_zh: '死神代表转变和重生。它不是字面意义的死亡，而是旧阶段的结束和新开始的象征。',
        description_en: 'Death represents transformation and rebirth. It is not literal death, but a symbol of the end of old phases and new beginnings.'
      },
      // 14 - 节制
      {
        id: 'temperance',
        name_zh: '节制',
        name_en: 'Temperance',
        suit: 'major' as const,
        number: 14,
        image_url: '/images/tarot/major/temperance.jpg',
        keywords_zh: ['平衡', '调和', '中庸', '治愈'],
        keywords_en: ['Balance', 'Harmony', 'Moderation', 'Healing'],
        meaning_upright_zh: '生活的平衡，情绪的调和，中庸之道，内心的治愈。',
        meaning_upright_en: 'Balance in life, emotional harmony, the middle way, inner healing.',
        meaning_reversed_zh: '失去平衡，过度放纵，冲突对立，缺乏自制。',
        meaning_reversed_en: 'Loss of balance, excessive indulgence, conflict and opposition, lack of self-control.',
        element: 'Fire',
        astrological_sign: 'Sagittarius',
        planet: 'Jupiter',
        description_zh: '节制象征着平衡和调和。它教导我们要在各种极端之间找到中间的道路，实现内心的和谐。',
        description_en: 'Temperance symbolizes balance and harmony. It teaches us to find the middle path between extremes and achieve inner harmony.'
      },
      // 15 - 恶魔
      {
        id: 'devil',
        name_zh: '恶魔',
        name_en: 'The Devil',
        suit: 'major' as const,
        number: 15,
        image_url: '/images/tarot/major/devil.jpg',
        keywords_zh: ['束缚', '诱惑', '物欲', '幻象'],
        keywords_en: ['Bondage', 'Temptation', 'Materialism', 'Illusion'],
        meaning_upright_zh: '被欲望束缚，面临诱惑，沉迷物质，被幻象迷惑。',
        meaning_upright_en: 'Bound by desires, facing temptation, addicted to material things, deceived by illusions.',
        meaning_reversed_zh: '摆脱束缚，克服诱惑，精神觉醒，看清真相。',
        meaning_reversed_en: 'Breaking free from bondage, overcoming temptation, spiritual awakening, seeing the truth.',
        element: 'Earth',
        astrological_sign: 'Capricorn',
        planet: 'Saturn',
        description_zh: '恶魔代表束缚和诱惑。它提醒我们要警惕物质欲望的陷阱，寻求精神的自由。',
        description_en: 'The Devil represents bondage and temptation. It reminds us to beware of the traps of material desires and seek spiritual freedom.'
      },
      // 16 - 塔
      {
        id: 'tower',
        name_zh: '塔',
        name_en: 'The Tower',
        suit: 'major' as const,
        number: 16,
        image_url: '/images/tarot/major/tower.jpg',
        keywords_zh: ['突变', '毁灭', '启示', '觉醒'],
        keywords_en: ['Sudden Change', 'Destruction', 'Revelation', 'Awakening'],
        meaning_upright_zh: '突然的变化，旧结构的崩塌，真相的启示，意识的觉醒。',
        meaning_upright_en: 'Sudden changes, collapse of old structures, revelation of truth, awakening of consciousness.',
        meaning_reversed_zh: '避免灾难，渐进改变，内在转变，恢复稳定。',
        meaning_reversed_en: 'Avoiding disaster, gradual change, internal transformation, restoring stability.',
        element: 'Fire',
        astrological_sign: 'Mars',
        planet: 'Mars',
        description_zh: '塔象征着突然的改变和启示。虽然可能带来震撼，但这种变化往往是必要的成长过程。',
        description_en: 'The Tower symbolizes sudden change and revelation. Although it may be shocking, this change is often a necessary process of growth.'
      },
      // 17 - 星星
      {
        id: 'star',
        name_zh: '星星',
        name_en: 'The Star',
        suit: 'major' as const,
        number: 17,
        image_url: '/images/tarot/major/star.jpg',
        keywords_zh: ['希望', '指引', '灵感', '治愈'],
        keywords_en: ['Hope', 'Guidance', 'Inspiration', 'Healing'],
        meaning_upright_zh: '希望的光芒，精神的指引，创意的灵感，心灵的治愈。',
        meaning_upright_en: 'Light of hope, spiritual guidance, creative inspiration, healing of the soul.',
        meaning_reversed_zh: '失去希望，缺乏方向，创意枯竭，精神低落。',
        meaning_reversed_en: 'Loss of hope, lack of direction, creative exhaustion, spiritual depression.',
        element: 'Air',
        astrological_sign: 'Aquarius',
        planet: 'Uranus',
        description_zh: '星星象征着希望和指引。在黑暗中，它为我们带来光明和方向，激发内在的创造力。',
        description_en: 'The Star symbolizes hope and guidance. In darkness, it brings us light and direction, inspiring inner creativity.'
      },
      // 18 - 月亮
      {
        id: 'moon',
        name_zh: '月亮',
        name_en: 'The Moon',
        suit: 'major' as const,
        number: 18,
        image_url: '/images/tarot/major/moon.jpg',
        keywords_zh: ['幻觉', '直觉', '恐惧', '潜意识'],
        keywords_en: ['Illusion', 'Intuition', 'Fear', 'Subconscious'],
        meaning_upright_zh: '幻觉与现实，直觉的指引，内心的恐惧，潜意识的力量。',
        meaning_upright_en: 'Illusion and reality, guidance of intuition, inner fears, power of the subconscious.',
        meaning_reversed_zh: '摆脱幻觉，克服恐惧，理性思考，真相显现。',
        meaning_reversed_en: 'Breaking free from illusions, overcoming fears, rational thinking, truth revealed.',
        element: 'Water',
        astrological_sign: 'Pisces',
        planet: 'Neptune',
        description_zh: '月亮代表幻觉和直觉。它提醒我们要区分真实与虚幻，相信内在的智慧。',
        description_en: 'The Moon represents illusion and intuition. It reminds us to distinguish between reality and fantasy, and trust our inner wisdom.'
      },
      // 19 - 太阳
      {
        id: 'sun',
        name_zh: '太阳',
        name_en: 'The Sun',
        suit: 'major' as const,
        number: 19,
        image_url: '/images/tarot/major/sun.jpg',
        keywords_zh: ['成功', '快乐', '活力', '光明'],
        keywords_en: ['Success', 'Joy', 'Vitality', 'Enlightenment'],
        meaning_upright_zh: '成功的喜悦，生命的活力，内心的快乐，光明的未来。',
        meaning_upright_en: 'Joy of success, vitality of life, inner happiness, bright future.',
        meaning_reversed_zh: '缺乏自信，能量不足，延迟的成功，过度乐观。',
        meaning_reversed_en: 'Lack of confidence, insufficient energy, delayed success, excessive optimism.',
        element: 'Fire',
        astrological_sign: 'Sun',
        planet: 'Sun',
        description_zh: '太阳象征着成功和快乐。它代表着生命的活力和积极的能量，带来光明和希望。',
        description_en: 'The Sun symbolizes success and happiness. It represents the vitality of life and positive energy, bringing light and hope.'
      },
      // 20 - 审判
      {
        id: 'judgement',
        name_zh: '审判',
        name_en: 'Judgement',
        suit: 'major' as const,
        number: 20,
        image_url: '/images/tarot/major/judgement.jpg',
        keywords_zh: ['重生', '觉醒', '宽恕', '召唤'],
        keywords_en: ['Rebirth', 'Awakening', 'Forgiveness', 'Calling'],
        meaning_upright_zh: '精神的重生，意识的觉醒，宽恕与和解，内在的召唤。',
        meaning_upright_en: 'Spiritual rebirth, awakening of consciousness, forgiveness and reconciliation, inner calling.',
        meaning_reversed_zh: '自我怀疑，错过机会，拒绝改变，内疚自责。',
        meaning_reversed_en: 'Self-doubt, missing opportunities, refusing to change, guilt and self-blame.',
        element: 'Fire',
        astrological_sign: 'Pluto',
        planet: 'Pluto',
        description_zh: '审判代表重生和觉醒。它呼唤我们放下过去，拥抱新的自己，实现精神的升华。',
        description_en: 'Judgement represents rebirth and awakening. It calls us to let go of the past, embrace our new selves, and achieve spiritual transcendence.'
      },
      // 21 - 世界
      {
        id: 'world',
        name_zh: '世界',
        name_en: 'The World',
        suit: 'major' as const,
        number: 21,
        image_url: '/images/tarot/major/world.jpg',
        keywords_zh: ['完成', '成就', '整合', '圆满'],
        keywords_en: ['Completion', 'Achievement', 'Integration', 'Fulfillment'],
        meaning_upright_zh: '目标的完成，成就的获得，经验的整合，人生的圆满。',
        meaning_upright_en: 'Completion of goals, achievement of success, integration of experiences, fulfillment of life.',
        meaning_reversed_zh: '缺乏成就感，目标未完成，经验分散，寻求完整。',
        meaning_reversed_en: 'Lack of accomplishment, incomplete goals, scattered experiences, seeking wholeness.',
        element: 'Earth',
        astrological_sign: 'Saturn',
        planet: 'Saturn',
        description_zh: '世界代表完成和圆满。它象征着一个周期的结束和新旅程的开始，是最高的成就。',
        description_en: 'The World represents completion and fulfillment. It symbolizes the end of one cycle and the beginning of a new journey, representing the highest achievement.'
      }
    ];

    // 小阿卡纳 - 权杖花色 (14张)
    const wands = this.generateMinorArcana('wands', 'Fire', [
      { zh: '权杖王牌', en: 'Ace of Wands', keywords_zh: ['新开始', '创造力', '激情'], keywords_en: ['New Beginning', 'Creativity', 'Passion'] },
      { zh: '权杖二', en: 'Two of Wands', keywords_zh: ['规划', '未来', '决策'], keywords_en: ['Planning', 'Future', 'Decision'] },
      { zh: '权杖三', en: 'Three of Wands', keywords_zh: ['扩展', '远见', '领导'], keywords_en: ['Expansion', 'Foresight', 'Leadership'] },
      { zh: '权杖四', en: 'Four of Wands', keywords_zh: ['庆祝', '和谐', '稳定'], keywords_en: ['Celebration', 'Harmony', 'Stability'] },
      { zh: '权杖五', en: 'Five of Wands', keywords_zh: ['竞争', '冲突', '挑战'], keywords_en: ['Competition', 'Conflict', 'Challenge'] },
      { zh: '权杖六', en: 'Six of Wands', keywords_zh: ['胜利', '成功', '认可'], keywords_en: ['Victory', 'Success', 'Recognition'] },
      { zh: '权杖七', en: 'Seven of Wands', keywords_zh: ['防御', '坚持', '勇气'], keywords_en: ['Defense', 'Perseverance', 'Courage'] },
      { zh: '权杖八', en: 'Eight of Wands', keywords_zh: ['速度', '行动', '进展'], keywords_en: ['Speed', 'Action', 'Progress'] },
      { zh: '权杖九', en: 'Nine of Wands', keywords_zh: ['坚韧', '毅力', '警戒'], keywords_en: ['Resilience', 'Persistence', 'Vigilance'] },
      { zh: '权杖十', en: 'Ten of Wands', keywords_zh: ['负担', '责任', '压力'], keywords_en: ['Burden', 'Responsibility', 'Pressure'] },
      { zh: '权杖侍者', en: 'Page of Wands', keywords_zh: ['探索', '热情', '消息'], keywords_en: ['Exploration', 'Enthusiasm', 'Messages'] },
      { zh: '权杖骑士', en: 'Knight of Wands', keywords_zh: ['冒险', '冲动', '行动'], keywords_en: ['Adventure', 'Impulsiveness', 'Action'] },
      { zh: '权杖王后', en: 'Queen of Wands', keywords_zh: ['自信', '温暖', '魅力'], keywords_en: ['Confidence', 'Warmth', 'Charisma'] },
      { zh: '权杖国王', en: 'King of Wands', keywords_zh: ['领导', '远见', '企业家'], keywords_en: ['Leadership', 'Vision', 'Entrepreneur'] }
    ]);

    // 小阿卡纳 - 圣杯花色 (14张)
    const cups = this.generateMinorArcana('cups', 'Water', [
      { zh: '圣杯王牌', en: 'Ace of Cups', keywords_zh: ['新感情', '爱', '情感'], keywords_en: ['New Love', 'Love', 'Emotions'] },
      { zh: '圣杯二', en: 'Two of Cups', keywords_zh: ['关系', '联结', '伙伴'], keywords_en: ['Relationships', 'Connection', 'Partnership'] },
      { zh: '圣杯三', en: 'Three of Cups', keywords_zh: ['友谊', '庆祝', '社交'], keywords_en: ['Friendship', 'Celebration', 'Social'] },
      { zh: '圣杯四', en: 'Four of Cups', keywords_zh: ['冷漠', '沉思', '机会'], keywords_en: ['Apathy', 'Contemplation', 'Opportunity'] },
      { zh: '圣杯五', en: 'Five of Cups', keywords_zh: ['失望', '悲伤', '遗憾'], keywords_en: ['Disappointment', 'Grief', 'Regret'] },
      { zh: '圣杯六', en: 'Six of Cups', keywords_zh: ['怀旧', '天真', '回忆'], keywords_en: ['Nostalgia', 'Innocence', 'Memories'] },
      { zh: '圣杯七', en: 'Seven of Cups', keywords_zh: ['幻想', '选择', '迷惑'], keywords_en: ['Fantasy', 'Choices', 'Illusion'] },
      { zh: '圣杯八', en: 'Eight of Cups', keywords_zh: ['放弃', '寻求', '转变'], keywords_en: ['Abandonment', 'Seeking', 'Transformation'] },
      { zh: '圣杯九', en: 'Nine of Cups', keywords_zh: ['满足', '愿望', '快乐'], keywords_en: ['Satisfaction', 'Wishes', 'Happiness'] },
      { zh: '圣杯十', en: 'Ten of Cups', keywords_zh: ['家庭', '和谐', '成就'], keywords_en: ['Family', 'Harmony', 'Achievement'] },
      { zh: '圣杯侍者', en: 'Page of Cups', keywords_zh: ['直觉', '创意', '消息'], keywords_en: ['Intuition', 'Creativity', 'Messages'] },
      { zh: '圣杯骑士', en: 'Knight of Cups', keywords_zh: ['浪漫', '魅力', '理想主义'], keywords_en: ['Romance', 'Charm', 'Idealism'] },
      { zh: '圣杯王后', en: 'Queen of Cups', keywords_zh: ['同情', '直觉', '关怀'], keywords_en: ['Compassion', 'Intuition', 'Caring'] },
      { zh: '圣杯国王', en: 'King of Cups', keywords_zh: ['情感平衡', '外交', '宽容'], keywords_en: ['Emotional Balance', 'Diplomacy', 'Tolerance'] }
    ]);

    // 小阿卡纳 - 宝剑花色 (14张)
    const swords = this.generateMinorArcana('swords', 'Air', [
      { zh: '宝剑王牌', en: 'Ace of Swords', keywords_zh: ['真理', '清晰', '洞察'], keywords_en: ['Truth', 'Clarity', 'Insight'] },
      { zh: '宝剑二', en: 'Two of Swords', keywords_zh: ['选择', '平衡', '僵局'], keywords_en: ['Choices', 'Balance', 'Stalemate'] },
      { zh: '宝剑三', en: 'Three of Swords', keywords_zh: ['心碎', '悲伤', '分离'], keywords_en: ['Heartbreak', 'Sorrow', 'Separation'] },
      { zh: '宝剑四', en: 'Four of Swords', keywords_zh: ['休息', '冥想', '恢复'], keywords_en: ['Rest', 'Meditation', 'Recovery'] },
      { zh: '宝剑五', en: 'Five of Swords', keywords_zh: ['冲突', '失败', '自私'], keywords_en: ['Conflict', 'Defeat', 'Selfishness'] },
      { zh: '宝剑六', en: 'Six of Swords', keywords_zh: ['过渡', '旅行', '平静'], keywords_en: ['Transition', 'Travel', 'Calm'] },
      { zh: '宝剑七', en: 'Seven of Swords', keywords_zh: ['欺骗', '策略', '逃避'], keywords_en: ['Deception', 'Strategy', 'Escape'] },
      { zh: '宝剑八', en: 'Eight of Swords', keywords_zh: ['束缚', '限制', '困惑'], keywords_en: ['Bondage', 'Restriction', 'Confusion'] },
      { zh: '宝剑九', en: 'Nine of Swords', keywords_zh: ['焦虑', '噩梦', '绝望'], keywords_en: ['Anxiety', 'Nightmares', 'Despair'] },
      { zh: '宝剑十', en: 'Ten of Swords', keywords_zh: ['背叛', '结束', '痛苦'], keywords_en: ['Betrayal', 'Endings', 'Pain'] },
      { zh: '宝剑侍者', en: 'Page of Swords', keywords_zh: ['好奇', '警觉', '沟通'], keywords_en: ['Curiosity', 'Vigilance', 'Communication'] },
      { zh: '宝剑骑士', en: 'Knight of Swords', keywords_zh: ['行动', '冲动', '雄心'], keywords_en: ['Action', 'Impulsiveness', 'Ambition'] },
      { zh: '宝剑王后', en: 'Queen of Swords', keywords_zh: ['独立', '洞察力', '诚实'], keywords_en: ['Independence', 'Perceptiveness', 'Honesty'] },
      { zh: '宝剑国王', en: 'King of Swords', keywords_zh: ['权威', '智慧', '判断'], keywords_en: ['Authority', 'Wisdom', 'Judgment'] }
    ]);

    // 小阿卡纳 - 钱币花色 (14张)
    const pentacles = this.generateMinorArcana('pentacles', 'Earth', [
      { zh: '钱币王牌', en: 'Ace of Pentacles', keywords_zh: ['机会', '繁荣', '新开始'], keywords_en: ['Opportunity', 'Prosperity', 'New Beginning'] },
      { zh: '钱币二', en: 'Two of Pentacles', keywords_zh: ['平衡', '适应', '灵活'], keywords_en: ['Balance', 'Adaptation', 'Flexibility'] },
      { zh: '钱币三', en: 'Three of Pentacles', keywords_zh: ['合作', '技能', '团队'], keywords_en: ['Collaboration', 'Skills', 'Teamwork'] },
      { zh: '钱币四', en: 'Four of Pentacles', keywords_zh: ['安全', '控制', '保守'], keywords_en: ['Security', 'Control', 'Conservation'] },
      { zh: '钱币五', en: 'Five of Pentacles', keywords_zh: ['贫困', '困难', '排斥'], keywords_en: ['Poverty', 'Hardship', 'Exclusion'] },
      { zh: '钱币六', en: 'Six of Pentacles', keywords_zh: ['慷慨', '分享', '平衡'], keywords_en: ['Generosity', 'Sharing', 'Balance'] },
      { zh: '钱币七', en: 'Seven of Pentacles', keywords_zh: ['耐心', '投资', '回报'], keywords_en: ['Patience', 'Investment', 'Reward'] },
      { zh: '钱币八', en: 'Eight of Pentacles', keywords_zh: ['技艺', '专注', '学习'], keywords_en: ['Craftsmanship', 'Focus', 'Learning'] },
      { zh: '钱币九', en: 'Nine of Pentacles', keywords_zh: ['独立', '奢华', '成就'], keywords_en: ['Independence', 'Luxury', 'Achievement'] },
      { zh: '钱币十', en: 'Ten of Pentacles', keywords_zh: ['财富', '传承', '家庭'], keywords_en: ['Wealth', 'Legacy', 'Family'] },
      { zh: '钱币侍者', en: 'Page of Pentacles', keywords_zh: ['学习', '机会', '消息'], keywords_en: ['Learning', 'Opportunity', 'Messages'] },
      { zh: '钱币骑士', en: 'Knight of Pentacles', keywords_zh: ['勤奋', '负责', '可靠'], keywords_en: ['Diligence', 'Responsibility', 'Reliability'] },
      { zh: '钱币王后', en: 'Queen of Pentacles', keywords_zh: ['滋养', '慷慨', '实用'], keywords_en: ['Nurturing', 'Generosity', 'Practical'] },
      { zh: '钱币国王', en: 'King of Pentacles', keywords_zh: ['成功', '丰富', '安全'], keywords_en: ['Success', 'Abundance', 'Security'] }
    ]);

    return [...majorArcana, ...wands, ...cups, ...swords, ...pentacles];
  }

  /**
   * 生成小阿卡纳牌组的辅助方法
   */
  private generateMinorArcana(suit: 'wands' | 'cups' | 'swords' | 'pentacles', element: string, cardData: Array<{zh: string, en: string, keywords_zh: string[], keywords_en: string[]}>): TarotCard[] {
    return cardData.map((card, index) => ({
      id: card.en.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
      name_zh: card.zh,
      name_en: card.en,
      suit: suit,
      number: index + 1,
      image_url: `/images/tarot/${suit}/${card.en.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}.jpg`,
      keywords_zh: card.keywords_zh,
      keywords_en: card.keywords_en,
      meaning_upright_zh: `${card.zh}正位代表${card.keywords_zh.join('、')}的能量和表现。`,
      meaning_upright_en: `${card.en} upright represents the energy and manifestation of ${card.keywords_en.join(', ')}.`,
      meaning_reversed_zh: `${card.zh}逆位可能表示${card.keywords_zh.join('、')}的阻碍或过度。`,
      meaning_reversed_en: `${card.en} reversed may indicate obstacles or excess in ${card.keywords_en.join(', ')}.`,
      element: element,
      astrological_sign: '',
      planet: '',
      description_zh: `${card.zh}属于${suit === 'wands' ? '权杖' : suit === 'cups' ? '圣杯' : suit === 'swords' ? '宝剑' : '钱币'}花色，代表${element === 'Fire' ? '火元素' : element === 'Water' ? '水元素' : element === 'Air' ? '风元素' : '土元素'}的力量。`,
      description_en: `${card.en} belongs to the suit of ${suit}, representing the power of the ${element} element.`
    }));
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

      let categories: QuestionCategory[] = [];

      try {
        // 尝试从数据库获取
        const result = await this.safeDB
          .prepare('SELECT * FROM tarot_categories ORDER BY sort_order')
          .all();

        categories = result.results.map((row: any) => ({
          id: row.id,
          name_zh: row.name_zh,
          name_en: row.name_en,
          description_zh: row.description_zh,
          description_en: row.description_en,
          icon: row.icon,
          color_theme: row.color_theme,
          sort_order: row.sort_order
        }));
      } catch (dbError) {
        // console.error('Database query failed, using fallback data:', dbError);
        // 如果数据库查询失败，使用默认数据
        categories = [];
      }

      // 如果数据库中没有数据，使用默认数据作为fallback
      if (categories.length === 0) {
        categories = [
          {
            id: 'love',
            name_zh: '爱情关系',
            name_en: 'Love & Relationships',
            description_zh: '关于爱情、感情关系和人际交往的问题',
            description_en: 'Questions about love, emotional relationships, and interpersonal communication',
            icon: '💕',
            color_theme: 'pink',
            sort_order: 1
          },
          {
            id: 'career',
            name_zh: '事业工作',
            name_en: 'Career & Work',
            description_zh: '关于职业发展、工作选择和事业规划的问题',
            description_en: 'Questions about career development, work choices, and career planning',
            icon: '💼',
            color_theme: 'blue',
            sort_order: 2
          },
          {
            id: 'finance',
            name_zh: '财务金钱',
            name_en: 'Finance & Money',
            description_zh: '关于财务规划、投资决策和金钱管理的问题',
            description_en: 'Questions about financial planning, investment decisions, and money management',
            icon: '💰',
            color_theme: 'green',
            sort_order: 3
          },
          {
            id: 'health',
            name_zh: '健康生活',
            name_en: 'Health & Wellness',
            description_zh: '关于身体健康、心理健康和生活方式的问题',
            description_en: 'Questions about physical health, mental health, and lifestyle',
            icon: '🏥',
            color_theme: 'red',
            sort_order: 4
          },
          {
            id: 'spiritual',
            name_zh: '精神成长',
            name_en: 'Spiritual Growth',
            description_zh: '关于精神发展、内在成长和人生意义的问题',
            description_en: 'Questions about spiritual development, inner growth, and life meaning',
            icon: '🕊️',
            color_theme: 'purple',
            sort_order: 5
          },
          {
            id: 'general',
            name_zh: '一般指导',
            name_en: 'General Guidance',
            description_zh: '关于日常生活、决策选择和未来规划的一般性问题',
            description_en: 'General questions about daily life, decision-making, and future planning',
            icon: '🌟',
            color_theme: 'yellow',
            sort_order: 6
          }
        ];
      }

      // 前端需要更长的英文功能介绍，这里进行统一覆盖（不改变数据库结构）
      const descriptionOverrides: Record<string, string> = {
        love: 'Questions about love, emotional relationships, communication, trust, commitment, and resolving conflicts to build deeper, healthier, more fulfilling connections.',
        career: 'Questions about career development, work choices, growth, skills, leadership, and planning to navigate opportunities and achieve sustainable professional success.',
        finance: 'Questions about financial planning, budgeting, saving, investing, risk management, and smart decisions to build stability, prosperity, and long-term security.',
        health: 'Questions about physical health, mental wellness, habits, sleep, nutrition, exercise, and lifestyle adjustments to improve balance, energy, and resilience.',
        spiritual: 'Questions about spiritual development, inner growth, mindfulness, purpose, intuition, and healing to deepen awareness and find meaning on your path.',
        general: 'General questions about daily life, choices, timing, goals, relationships, and next steps to gain clarity, confidence, and practical guidance forward.'
      };

      categories = categories.map(cat => ({
        ...cat,
        description_en: descriptionOverrides[cat.id] || cat.description_en
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
