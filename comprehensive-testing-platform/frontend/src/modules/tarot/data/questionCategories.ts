/**
 * Question Categories Data
 * 问题分类数据
 */

import type { QuestionCategory } from '../types';

export const questionCategories: QuestionCategory[] = [
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
