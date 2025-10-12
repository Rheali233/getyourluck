/**
 * Update Tarot Cards Script
 * 更新塔罗牌数据脚本 - 使用前端完整数据
 */

import { allTarotCards } from '../../frontend/src/modules/tarot/data/tarotCards';

// 转义SQL字符串
const escapeSqlString = (str: string): string => {
  return str.replace(/'/g, "''");
};

// 生成完整的塔罗牌数据SQL
export const generateCompleteTarotCardsSQL = (): string => {
  const cards = allTarotCards.map((card) => {
    const id = card.name_en.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    return `INSERT OR REPLACE INTO tarot_cards (id, name_zh, name_en, suit, number, image_url, keywords_zh, keywords_en, meaning_upright_zh, meaning_upright_en, meaning_reversed_zh, meaning_reversed_en, element, astrological_sign, planet, description_zh, description_en) VALUES ('${id}', '${escapeSqlString(card.name_zh)}', '${escapeSqlString(card.name_en)}', '${card.suit}', ${card.number}, '${card.image_url}', '${escapeSqlString(JSON.stringify(card.keywords_zh))}', '${escapeSqlString(JSON.stringify(card.keywords_en))}', '${escapeSqlString(card.meaning_upright_zh)}', '${escapeSqlString(card.meaning_upright_en)}', '${escapeSqlString(card.meaning_reversed_zh)}', '${escapeSqlString(card.meaning_reversed_en)}', '${card.element || ''}', '${card.astrological_sign || ''}', '${card.planet || ''}', '${escapeSqlString(card.description_zh)}', '${escapeSqlString(card.description_en)}');`;
  });

  return cards.join('\n');
};

// 生成SQL文件
const sqlContent = generateCompleteTarotCardsSQL();
console.log(sqlContent);
