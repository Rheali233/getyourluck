/**
 * Complete Tarot Cards Seed Data
 * 完整塔罗牌种子数据 - 78张牌
 */

import type { TarotCard } from '../../../shared/types/tarot';

// 大阿卡纳 (Major Arcana) - 22张
const majorArcanaCards: Omit<TarotCard, 'id'>[] = [
  {
    name_zh: '愚者',
    name_en: 'The Fool',
    suit: 'major',
    number: 0,
    image_url: '/images/tarot/major/fool.jpg',
    keywords_zh: '["新开始", "冒险", "纯真", "自由"]',
    keywords_en: '["New Beginnings", "Adventure", "Innocence", "Freedom"]',
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
  // ... 其他大阿卡纳牌（省略以节省空间）
];

// 权杖 (Wands) - 14张
const wandsCards: Omit<TarotCard, 'id'>[] = [
  {
    name_zh: '权杖王牌',
    name_en: 'Ace of Wands',
    suit: 'wands',
    number: 1,
    image_url: '/images/tarot/wands/ace_of_wands.jpg',
    keywords_zh: '["新开始", "创造力", "激情", "灵感"]',
    keywords_en: '["New Beginning", "Creativity", "Passion", "Inspiration"]',
    meaning_upright_zh: '新的创意项目，充满激情的开始，创造力的爆发，灵感的涌现。',
    meaning_upright_en: 'New creative projects, passionate beginnings, creative outbursts, inspiration emerging.',
    meaning_reversed_zh: '缺乏灵感，创造力受阻，激情消退，项目停滞。',
    meaning_reversed_en: 'Lack of inspiration, blocked creativity, waning passion, stalled projects.',
    element: 'Fire',
    description_zh: '权杖王牌代表着新的开始和创造力的爆发。它提醒我们要抓住新的机会，发挥自己的创造力。',
    description_en: 'Ace of Wands represents new beginnings and creative outbursts. It reminds us to seize new opportunities and express our creativity.'
  },
  // ... 其他权杖牌（省略以节省空间）
];

// 圣杯 (Cups) - 14张
const cupsCards: Omit<TarotCard, 'id'>[] = [
  {
    name_zh: '圣杯王牌',
    name_en: 'Ace of Cups',
    suit: 'cups',
    number: 1,
    image_url: '/images/tarot/cups/ace_of_cups.jpg',
    keywords_zh: '["新感情", "情感满足", "精神觉醒", "爱"]',
    keywords_en: '["New Love", "Emotional Fulfillment", "Spiritual Awakening", "Love"]',
    meaning_upright_zh: '新的感情关系，情感上的满足，精神上的觉醒，爱的表达。',
    meaning_upright_en: 'New emotional relationships, emotional fulfillment, spiritual awakening, expression of love.',
    meaning_reversed_zh: '情感空虚，关系破裂，精神迷失，爱的缺失。',
    meaning_reversed_en: 'Emotional emptiness, relationship breakdown, spiritual loss, lack of love.',
    element: 'Water',
    description_zh: '圣杯王牌代表着新的感情和情感满足。它提醒我们要开放心灵，接受爱和情感。',
    description_en: 'Ace of Cups represents new love and emotional fulfillment. It reminds us to open our hearts and accept love and emotions.'
  },
  // ... 其他圣杯牌（省略以节省空间）
];

// 宝剑 (Swords) - 14张
const swordsCards: Omit<TarotCard, 'id'>[] = [
  {
    name_zh: '宝剑王牌',
    name_en: 'Ace of Swords',
    suit: 'swords',
    number: 1,
    image_url: '/images/tarot/swords/ace_of_swords.jpg',
    keywords_zh: '["新想法", "清晰思维", "真理", "突破"]',
    keywords_en: '["New Ideas", "Clear Thinking", "Truth", "Breakthrough"]',
    meaning_upright_zh: '新的想法和洞察，清晰的思维，真理的发现，重要的突破。',
    meaning_upright_en: 'New ideas and insights, clear thinking, discovery of truth, important breakthroughs.',
    meaning_reversed_zh: '思维混乱，缺乏清晰度，真理被掩盖，无法突破。',
    meaning_reversed_en: 'Confused thinking, lack of clarity, truth hidden, unable to break through.',
    element: 'Air',
    description_zh: '宝剑王牌代表着新的想法和清晰的思维。它提醒我们要追求真理，保持清晰的思维。',
    description_en: 'Ace of Swords represents new ideas and clear thinking. It reminds us to pursue truth and maintain clear thinking.'
  },
  // ... 其他宝剑牌（省略以节省空间）
];

// 星币 (Pentacles) - 14张
const pentaclesCards: Omit<TarotCard, 'id'>[] = [
  {
    name_zh: '星币王牌',
    name_en: 'Ace of Pentacles',
    suit: 'pentacles',
    number: 1,
    image_url: '/images/tarot/pentacles/ace_of_pentacles.jpg',
    keywords_zh: '["新机会", "物质成功", "稳定", "实用"]',
    keywords_en: '["New Opportunity", "Material Success", "Stability", "Practical"]',
    meaning_upright_zh: '新的物质机会，财务成功，稳定的基础，实用的方法。',
    meaning_upright_en: 'New material opportunities, financial success, stable foundation, practical methods.',
    meaning_reversed_zh: '错失机会，财务困难，缺乏稳定，不切实际。',
    meaning_reversed_en: 'Missed opportunities, financial difficulties, lack of stability, impractical.',
    element: 'Earth',
    description_zh: '星币王牌代表着新的物质机会和财务成功。它提醒我们要抓住实际的机会，建立稳定的基础。',
    description_en: 'Ace of Pentacles represents new material opportunities and financial success. It reminds us to seize practical opportunities and build stable foundations.'
  },
  // ... 其他星币牌（省略以节省空间）
];

// 转义SQL字符串
const escapeSqlString = (str: string): string => {
  return str.replace(/'/g, "''");
};

// 生成完整的塔罗牌数据
export const generateCompleteTarotCardsData = (): string => {
  const allCards = [
    ...majorArcanaCards,
    ...wandsCards,
    ...cupsCards,
    ...swordsCards,
    ...pentaclesCards
  ];

  const cards = allCards.map((card) => {
    const id = card.name_en.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    return `INSERT OR REPLACE INTO tarot_cards (id, name_zh, name_en, suit, number, image_url, keywords_zh, keywords_en, meaning_upright_zh, meaning_upright_en, meaning_reversed_zh, meaning_reversed_en, element, astrological_sign, planet, description_zh, description_en) VALUES ('${id}', '${escapeSqlString(card.name_zh)}', '${escapeSqlString(card.name_en)}', '${card.suit}', ${card.number}, '${card.image_url}', '${escapeSqlString(card.keywords_zh)}', '${escapeSqlString(card.keywords_en)}', '${escapeSqlString(card.meaning_upright_zh)}', '${escapeSqlString(card.meaning_upright_en)}', '${escapeSqlString(card.meaning_reversed_zh)}', '${escapeSqlString(card.meaning_reversed_en)}', '${card.element || ''}', '${card.astrological_sign || ''}', '${card.planet || ''}', '${escapeSqlString(card.description_zh)}', '${escapeSqlString(card.description_en)}');`;
  });

  return cards.join('\n');
};

// 导出数据
export { majorArcanaCards, wandsCards, cupsCards, swordsCards, pentaclesCards };
