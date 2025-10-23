/**
 * Tarot Cards Lite Data
 * 塔罗牌轻量级数据 - 仅包含必要信息用于初始渲染
 * 完整数据通过懒加载获取
 */

// import type { TarotCard } from '../types'; // 暂时注释，轻量级数据不需要完整类型

// 轻量级塔罗牌数据接口
export interface TarotCardLite {
  id: string;
  name_en: string;
  name_zh: string;
  suit: string;
  number: number;
  image_url: string;
  keywords_en: string[];
  keywords_zh: string[];
}

// 大阿卡纳轻量级数据 (22张)
export const majorArcanaCardsLite: TarotCardLite[] = [
  {
    id: 'fool',
    name_zh: '愚者',
    name_en: 'The Fool',
    suit: 'major',
    number: 0,
    image_url: '/images/tarot/major/fool.jpg',
    keywords_zh: ['新开始', '冒险', '纯真', '自由'],
    keywords_en: ['New Beginnings', 'Adventure', 'Innocence', 'Freedom']
  },
  {
    id: 'magician',
    name_zh: '魔术师',
    name_en: 'The Magician',
    suit: 'major',
    number: 1,
    image_url: '/images/tarot/major/magician.jpg',
    keywords_zh: ['意志力', '技能', '专注', '行动'],
    keywords_en: ['Willpower', 'Skill', 'Focus', 'Action']
  },
  {
    id: 'high_priestess',
    name_zh: '女祭司',
    name_en: 'The High Priestess',
    suit: 'major',
    number: 2,
    image_url: '/images/tarot/major/high_priestess.jpg',
    keywords_zh: ['直觉', '神秘', '智慧', '潜意识'],
    keywords_en: ['Intuition', 'Mystery', 'Wisdom', 'Subconscious']
  },
  {
    id: 'empress',
    name_zh: '皇后',
    name_en: 'The Empress',
    suit: 'major',
    number: 3,
    image_url: '/images/tarot/major/empress.jpg',
    keywords_zh: ['母性', '丰饶', '创造力', '自然'],
    keywords_en: ['Motherhood', 'Fertility', 'Creativity', 'Nature']
  },
  {
    id: 'emperor',
    name_zh: '皇帝',
    name_en: 'The Emperor',
    suit: 'major',
    number: 4,
    image_url: '/images/tarot/major/emperor.jpg',
    keywords_zh: ['权威', '秩序', '领导', '稳定'],
    keywords_en: ['Authority', 'Order', 'Leadership', 'Stability']
  },
  {
    id: 'hierophant',
    name_zh: '教皇',
    name_en: 'The Hierophant',
    suit: 'major',
    number: 5,
    image_url: '/images/tarot/major/hierophant.jpg',
    keywords_zh: ['传统', '宗教', '教学', '精神指导'],
    keywords_en: ['Tradition', 'Religion', 'Teaching', 'Spiritual Guidance']
  },
  {
    id: 'lovers',
    name_zh: '恋人',
    name_en: 'The Lovers',
    suit: 'major',
    number: 6,
    image_url: '/images/tarot/major/lovers.jpg',
    keywords_zh: ['爱情', '选择', '和谐', '关系'],
    keywords_en: ['Love', 'Choice', 'Harmony', 'Relationships']
  },
  {
    id: 'chariot',
    name_zh: '战车',
    name_en: 'The Chariot',
    suit: 'major',
    number: 7,
    image_url: '/images/tarot/major/chariot.jpg',
    keywords_zh: ['意志力', '胜利', '决心', '控制'],
    keywords_en: ['Willpower', 'Victory', 'Determination', 'Control']
  },
  {
    id: 'strength',
    name_zh: '力量',
    name_en: 'Strength',
    suit: 'major',
    number: 8,
    image_url: '/images/tarot/major/strength.jpg',
    keywords_zh: ['内在力量', '勇气', '耐心', '控制'],
    keywords_en: ['Inner Strength', 'Courage', 'Patience', 'Control']
  },
  {
    id: 'hermit',
    name_zh: '隐者',
    name_en: 'The Hermit',
    suit: 'major',
    number: 9,
    image_url: '/images/tarot/major/hermit.jpg',
    keywords_zh: ['内省', '智慧', '指导', '孤独'],
    keywords_en: ['Introspection', 'Wisdom', 'Guidance', 'Solitude']
  },
  {
    id: 'wheel_of_fortune',
    name_zh: '命运之轮',
    name_en: 'Wheel of Fortune',
    suit: 'major',
    number: 10,
    image_url: '/images/tarot/major/wheel_of_fortune.jpg',
    keywords_zh: ['命运', '变化', '周期', '机遇'],
    keywords_en: ['Destiny', 'Change', 'Cycles', 'Opportunity']
  },
  {
    id: 'justice',
    name_zh: '正义',
    name_en: 'Justice',
    suit: 'major',
    number: 11,
    image_url: '/images/tarot/major/justice.jpg',
    keywords_zh: ['正义', '平衡', '真理', '法律'],
    keywords_en: ['Justice', 'Balance', 'Truth', 'Law']
  },
  {
    id: 'hanged_man',
    name_zh: '倒吊人',
    name_en: 'The Hanged Man',
    suit: 'major',
    number: 12,
    image_url: '/images/tarot/major/hanged_man.jpg',
    keywords_zh: ['牺牲', '等待', '新视角', '暂停'],
    keywords_en: ['Sacrifice', 'Waiting', 'New Perspective', 'Pause']
  },
  {
    id: 'death',
    name_zh: '死神',
    name_en: 'Death',
    suit: 'major',
    number: 13,
    image_url: '/images/tarot/major/death.jpg',
    keywords_zh: ['结束', '转变', '重生', '释放'],
    keywords_en: ['Endings', 'Transformation', 'Rebirth', 'Release']
  },
  {
    id: 'temperance',
    name_zh: '节制',
    name_en: 'Temperance',
    suit: 'major',
    number: 14,
    image_url: '/images/tarot/major/temperance.jpg',
    keywords_zh: ['平衡', '调和', '耐心', '节制'],
    keywords_en: ['Balance', 'Harmony', 'Patience', 'Moderation']
  },
  {
    id: 'devil',
    name_zh: '恶魔',
    name_en: 'The Devil',
    suit: 'major',
    number: 15,
    image_url: '/images/tarot/major/devil.jpg',
    keywords_zh: ['束缚', '诱惑', '物质主义', '恐惧'],
    keywords_en: ['Bondage', 'Temptation', 'Materialism', 'Fear']
  },
  {
    id: 'tower',
    name_zh: '塔',
    name_en: 'The Tower',
    suit: 'major',
    number: 16,
    image_url: '/images/tarot/major/tower.jpg',
    keywords_zh: ['突然变化', '启示', '解放', '重建'],
    keywords_en: ['Sudden Change', 'Revelation', 'Liberation', 'Rebuilding']
  },
  {
    id: 'star',
    name_zh: '星星',
    name_en: 'The Star',
    suit: 'major',
    number: 17,
    image_url: '/images/tarot/major/star.jpg',
    keywords_zh: ['希望', '灵感', '精神指导', '乐观'],
    keywords_en: ['Hope', 'Inspiration', 'Spiritual Guidance', 'Optimism']
  },
  {
    id: 'moon',
    name_zh: '月亮',
    name_en: 'The Moon',
    suit: 'major',
    number: 18,
    image_url: '/images/tarot/major/moon.jpg',
    keywords_zh: ['幻觉', '恐惧', '潜意识', '直觉'],
    keywords_en: ['Illusion', 'Fear', 'Subconscious', 'Intuition']
  },
  {
    id: 'sun',
    name_zh: '太阳',
    name_en: 'The Sun',
    suit: 'major',
    number: 19,
    image_url: '/images/tarot/major/sun.jpg',
    keywords_zh: ['快乐', '成功', '活力', '乐观'],
    keywords_en: ['Joy', 'Success', 'Vitality', 'Optimism']
  },
  {
    id: 'judgement',
    name_zh: '审判',
    name_en: 'Judgement',
    suit: 'major',
    number: 20,
    image_url: '/images/tarot/major/judgement.jpg',
    keywords_zh: ['重生', '觉醒', '宽恕', '救赎'],
    keywords_en: ['Rebirth', 'Awakening', 'Forgiveness', 'Redemption']
  },
  {
    id: 'world',
    name_zh: '世界',
    name_en: 'The World',
    suit: 'major',
    number: 21,
    image_url: '/images/tarot/major/world.jpg',
    keywords_zh: ['完成', '成就', '旅行', '成功'],
    keywords_en: ['Completion', 'Achievement', 'Travel', 'Success']
  }
];

// 小阿卡纳轻量级数据 (56张) - 只包含前几张作为示例
export const minorArcanaCardsLite: TarotCardLite[] = [
  // 权杖牌组 (Wands)
  {
    id: 'ace_of_wands',
    name_zh: '权杖王牌',
    name_en: 'Ace of Wands',
    suit: 'wands',
    number: 1,
    image_url: '/images/tarot/wands/ace_of_wands.jpg',
    keywords_zh: ['新开始', '创造力', '灵感', '激情'],
    keywords_en: ['New Beginnings', 'Creativity', 'Inspiration', 'Passion']
  },
  {
    id: 'two_of_wands',
    name_zh: '权杖二',
    name_en: 'Two of Wands',
    suit: 'wands',
    number: 2,
    image_url: '/images/tarot/wands/two_of_wands.jpg',
    keywords_zh: ['计划', '个人力量', '决定', '未来规划'],
    keywords_en: ['Planning', 'Personal Power', 'Decision', 'Future Planning']
  },
  {
    id: 'three_of_wands',
    name_zh: '权杖三',
    name_en: 'Three of Wands',
    suit: 'wands',
    number: 3,
    image_url: '/images/tarot/wands/three_of_wands.jpg',
    keywords_zh: ['扩张', '远见', '领导', '探索'],
    keywords_en: ['Expansion', 'Vision', 'Leadership', 'Exploration']
  },
  // 圣杯牌组 (Cups)
  {
    id: 'ace_of_cups',
    name_zh: '圣杯王牌',
    name_en: 'Ace of Cups',
    suit: 'cups',
    number: 1,
    image_url: '/images/tarot/cups/ace_of_cups.jpg',
    keywords_zh: ['新感情', '精神觉醒', '直觉', '爱'],
    keywords_en: ['New Love', 'Spiritual Awakening', 'Intuition', 'Love']
  },
  {
    id: 'two_of_cups',
    name_zh: '圣杯二',
    name_en: 'Two of Cups',
    suit: 'cups',
    number: 2,
    image_url: '/images/tarot/cups/two_of_cups.jpg',
    keywords_zh: ['伙伴关系', '结合', '和谐', '相互吸引'],
    keywords_en: ['Partnership', 'Union', 'Harmony', 'Mutual Attraction']
  },
  // 宝剑牌组 (Swords)
  {
    id: 'ace_of_swords',
    name_zh: '宝剑王牌',
    name_en: 'Ace of Swords',
    suit: 'swords',
    number: 1,
    image_url: '/images/tarot/swords/ace_of_swords.jpg',
    keywords_zh: ['新想法', '清晰', '真理', '突破'],
    keywords_en: ['New Ideas', 'Clarity', 'Truth', 'Breakthrough']
  },
  {
    id: 'two_of_swords',
    name_zh: '宝剑二',
    name_en: 'Two of Swords',
    suit: 'swords',
    number: 2,
    image_url: '/images/tarot/swords/two_of_swords.jpg',
    keywords_zh: ['困难选择', '平衡', '僵局', '逃避'],
    keywords_en: ['Difficult Choice', 'Balance', 'Stalemate', 'Avoidance']
  },
  // 星币牌组 (Pentacles)
  {
    id: 'ace_of_pentacles',
    name_zh: '星币王牌',
    name_en: 'Ace of Pentacles',
    suit: 'pentacles',
    number: 1,
    image_url: '/images/tarot/pentacles/ace_of_pentacles.jpg',
    keywords_zh: ['新机会', '物质成功', '实用', '潜力'],
    keywords_en: ['New Opportunity', 'Material Success', 'Practical', 'Potential']
  },
  {
    id: 'two_of_pentacles',
    name_zh: '星币二',
    name_en: 'Two of Pentacles',
    suit: 'pentacles',
    number: 2,
    image_url: '/images/tarot/pentacles/two_of_pentacles.jpg',
    keywords_zh: ['平衡', '优先事项', '时间管理', '适应'],
    keywords_en: ['Balance', 'Priorities', 'Time Management', 'Adaptation']
  }
];

// 合并所有轻量级数据
export const allTarotCardsLite: TarotCardLite[] = [
  ...majorArcanaCardsLite,
  ...minorArcanaCardsLite
];

// 按牌组分类的轻量级数据
export const tarotCardsLiteBySuit = {
  major: majorArcanaCardsLite,
  wands: minorArcanaCardsLite.filter(card => card.suit === 'wands'),
  cups: minorArcanaCardsLite.filter(card => card.suit === 'cups'),
  swords: minorArcanaCardsLite.filter(card => card.suit === 'swords'),
  pentacles: minorArcanaCardsLite.filter(card => card.suit === 'pentacles')
};
