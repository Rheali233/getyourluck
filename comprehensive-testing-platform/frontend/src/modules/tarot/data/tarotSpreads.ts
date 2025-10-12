/**
 * Tarot Spreads Data
 * 塔罗牌阵配置数据
 */

import type { TarotSpread } from '../types';

export const tarotSpreads: TarotSpread[] = [
  {
    id: 'single_card',
    name_zh: '单张牌',
    name_en: 'Single Card',
    description_zh: '简单直接的指导，适合日常问题',
    description_en: 'Simple and direct guidance, suitable for daily questions',
    card_count: 1,
    layout_config: {
      positions: [
        { x: 0, y: 0, rotation: 0 }
      ]
    },
    positions: [
      {
        name: 'guidance',
        meaning: 'Guidance for your current situation'
      }
    ],
    difficulty_level: 1,
    usage_count: 0,
    is_active: true
  },
  {
    id: 'three_card',
    name_zh: '三张牌',
    name_en: 'Three Card Spread',
    description_zh: '过去、现在、未来的时间线解读',
    description_en: 'Past, present, future timeline reading',
    card_count: 3,
    layout_config: {
      positions: [
        { x: -100, y: 0, rotation: 0 },
        { x: 0, y: 0, rotation: 0 },
        { x: 100, y: 0, rotation: 0 }
      ]
    },
    positions: [
      {
        name: 'past',
        meaning: 'Past influences and experiences'
      },
      {
        name: 'present',
        meaning: 'Current situation and challenges'
      },
      {
        name: 'future',
        meaning: 'Future possibilities and outcomes'
      }
    ],
    difficulty_level: 2,
    usage_count: 0,
    is_active: true
  },
  {
    id: 'celtic_cross',
    name_zh: '凯尔特十字',
    name_en: 'Celtic Cross',
    description_zh: '最经典的牌阵，提供全面的深度解读',
    description_en: 'The most classic spread, providing comprehensive deep reading',
    card_count: 10,
    layout_config: {
      positions: [
        { x: 0, y: 0, rotation: 0 },
        { x: 0, y: -50, rotation: 90 },
        { x: -50, y: 0, rotation: 0 },
        { x: 50, y: 0, rotation: 0 },
        { x: 0, y: 50, rotation: 0 },
        { x: 0, y: -100, rotation: 0 },
        { x: 100, y: -100, rotation: 0 },
        { x: 100, y: -50, rotation: 0 },
        { x: 100, y: 0, rotation: 0 },
        { x: 100, y: 50, rotation: 0 }
      ]
    },
    positions: [
      {
        name: 'situation',
        meaning: 'Core of the current situation'
      },
      {
        name: 'challenge',
        meaning: 'Main challenge or obstacle'
      },
      {
        name: 'past',
        meaning: 'Past influences'
      },
      {
        name: 'future',
        meaning: 'Future possibilities'
      },
      {
        name: 'above',
        meaning: 'Possible outcomes'
      },
      {
        name: 'below',
        meaning: 'Underlying influences'
      },
      {
        name: 'advice',
        meaning: 'Advice and guidance'
      },
      {
        name: 'external',
        meaning: 'External influences'
      },
      {
        name: 'hopes_fears',
        meaning: 'Hopes and fears'
      },
      {
        name: 'outcome',
        meaning: 'Final outcome'
      }
    ],
    difficulty_level: 5,
    usage_count: 0,
    is_active: true
  },
  {
    id: 'relationship',
    name_zh: '关系牌阵',
    name_en: 'Relationship Spread',
    description_zh: '专门用于分析感情关系的牌阵',
    description_en: 'Spread specifically for analyzing emotional relationships',
    card_count: 7,
    layout_config: {
      positions: [
        { x: -80, y: 0, rotation: 0 },
        { x: 80, y: 0, rotation: 0 },
        { x: 0, y: -60, rotation: 0 },
        { x: 0, y: 60, rotation: 0 },
        { x: -40, y: -30, rotation: 0 },
        { x: 40, y: -30, rotation: 0 },
        { x: 0, y: 0, rotation: 0 }
      ]
    },
    positions: [
      {
        name: 'you',
        meaning: 'Your state in the relationship'
      },
      {
        name: 'partner',
        meaning: 'Partner\'s state in the relationship'
      },
      {
        name: 'connection',
        meaning: 'The connection between you'
      },
      {
        name: 'challenges',
        meaning: 'Challenges in the relationship'
      },
      {
        name: 'your_needs',
        meaning: 'Your needs'
      },
      {
        name: 'their_needs',
        meaning: 'Their needs'
      },
      {
        name: 'future',
        meaning: 'Future of the relationship'
      }
    ],
    difficulty_level: 3,
    usage_count: 0,
    is_active: true
  },
  {
    id: 'career',
    name_zh: '事业牌阵',
    name_en: 'Career Spread',
    description_zh: '专门用于职业发展和工作选择的牌阵',
    description_en: 'Spread specifically for career development and work choices',
    card_count: 5,
    layout_config: {
      positions: [
        { x: 0, y: -60, rotation: 0 },
        { x: -60, y: 0, rotation: 0 },
        { x: 60, y: 0, rotation: 0 },
        { x: -30, y: 60, rotation: 0 },
        { x: 30, y: 60, rotation: 0 }
      ]
    },
    positions: [
      {
        name: 'current_situation',
        meaning: 'Current work situation'
      },
      {
        name: 'strengths',
        meaning: 'Your strengths and skills'
      },
      {
        name: 'challenges',
        meaning: 'Challenges you face'
      },
      {
        name: 'opportunities',
        meaning: 'Future opportunities'
      },
      {
        name: 'advice',
        meaning: 'Career development advice'
      }
    ],
    difficulty_level: 3,
    usage_count: 0,
    is_active: true
  }
];
