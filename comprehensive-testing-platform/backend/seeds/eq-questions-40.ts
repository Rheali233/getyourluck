/**
 * EQ Emotional Intelligence Question Bank v2.0 - 40 Questions
 * 4 core dimensions × 10 questions per dimension = 40 questions
 * Based on Goleman's 4 core dimensions of emotional intelligence
 * Scale: Likert 5-point scale (1=Strongly Disagree ~ 5=Strongly Agree)
 */

import type { CreatePsychologyQuestionData, CreatePsychologyQuestionOptionData } from '../src/models';

// 40-question EQ question bank seed data
export const eqQuestions40: CreatePsychologyQuestionData[] = [
  // 一、自我意识（Self-Awareness）- 10题
  {
    categoryId: 'eq-category',
    questionText: 'I can accurately perceive my emotions in different situations',
    questionType: 'likert_scale',
    dimension: 'self_awareness',
    orderIndex: 1,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can clearly express my strengths and weaknesses',
    questionType: 'likert_scale',
    dimension: 'self_awareness',
    orderIndex: 2,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I consider my values before making decisions',
    questionType: 'likert_scale',
    dimension: 'self_awareness',
    orderIndex: 3,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can distinguish between feelings of stress and anxiety',
    questionType: 'likert_scale',
    dimension: 'self_awareness',
    orderIndex: 4,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can detect when I am becoming emotional',
    questionType: 'likert_scale',
    dimension: 'self_awareness',
    orderIndex: 5,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I sometimes feel confused about what I truly want',
    questionType: 'likert_scale',
    dimension: 'self_awareness',
    orderIndex: 6,
    weight: -1, // 反向题
    isReverse: true
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can identify the specific emotions I am experiencing',
    questionType: 'likert_scale',
    dimension: 'self_awareness',
    orderIndex: 7,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I understand how my emotions affect my behavior',
    questionType: 'likert_scale',
    dimension: 'self_awareness',
    orderIndex: 8,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can recognize my emotional triggers',
    questionType: 'likert_scale',
    dimension: 'self_awareness',
    orderIndex: 9,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I am aware of my emotional patterns over time',
    questionType: 'likert_scale',
    dimension: 'self_awareness',
    orderIndex: 10,
    weight: 1
  },

  // 二、自我管理（Self-Management）- 10题 (合并了self_regulation和motivation)
  {
    categoryId: 'eq-category',
    questionText: 'I can control my emotions even in stressful situations',
    questionType: 'likert_scale',
    dimension: 'self_management',
    orderIndex: 11,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can stay calm when facing criticism or conflict',
    questionType: 'likert_scale',
    dimension: 'self_management',
    orderIndex: 12,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can delay gratification to achieve long-term goals',
    questionType: 'likert_scale',
    dimension: 'self_management',
    orderIndex: 13,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can adapt my behavior to different situations',
    questionType: 'likert_scale',
    dimension: 'self_management',
    orderIndex: 14,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I maintain a positive attitude even when things go wrong',
    questionType: 'likert_scale',
    dimension: 'self_management',
    orderIndex: 15,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I often lose control of my emotions',
    questionType: 'likert_scale',
    dimension: 'self_management',
    orderIndex: 16,
    weight: -1, // 反向题
    isReverse: true
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can motivate myself to complete difficult tasks',
    questionType: 'likert_scale',
    dimension: 'self_management',
    orderIndex: 17,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can bounce back quickly from setbacks',
    questionType: 'likert_scale',
    dimension: 'self_management',
    orderIndex: 18,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can manage my time effectively to achieve goals',
    questionType: 'likert_scale',
    dimension: 'self_management',
    orderIndex: 19,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can stay focused on important tasks despite distractions',
    questionType: 'likert_scale',
    dimension: 'self_management',
    orderIndex: 20,
    weight: 1
  },

  // 三、社会意识（Social Awareness）- 10题 (基于empathy维度)
  {
    categoryId: 'eq-category',
    questionText: 'I can sense how others are feeling by observing their body language',
    questionType: 'likert_scale',
    dimension: 'social_awareness',
    orderIndex: 21,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can understand different perspectives in a conflict',
    questionType: 'likert_scale',
    dimension: 'social_awareness',
    orderIndex: 22,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can recognize when someone needs emotional support',
    questionType: 'likert_scale',
    dimension: 'social_awareness',
    orderIndex: 23,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can sense the mood of a group or team',
    questionType: 'likert_scale',
    dimension: 'social_awareness',
    orderIndex: 24,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can understand cultural differences in emotional expression',
    questionType: 'likert_scale',
    dimension: 'social_awareness',
    orderIndex: 25,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I often miss social cues from others',
    questionType: 'likert_scale',
    dimension: 'social_awareness',
    orderIndex: 26,
    weight: -1, // 反向题
    isReverse: true
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can identify the emotions behind someone\'s words',
    questionType: 'likert_scale',
    dimension: 'social_awareness',
    orderIndex: 27,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can sense when someone is uncomfortable or upset',
    questionType: 'likert_scale',
    dimension: 'social_awareness',
    orderIndex: 28,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can understand the impact of my words on others',
    questionType: 'likert_scale',
    dimension: 'social_awareness',
    orderIndex: 29,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can recognize power dynamics in social situations',
    questionType: 'likert_scale',
    dimension: 'social_awareness',
    orderIndex: 30,
    weight: 1
  },

  // 四、关系管理（Relationship Management）- 10题 (基于social_skills维度)
  {
    categoryId: 'eq-category',
    questionText: 'I can build rapport with people from different backgrounds',
    questionType: 'likert_scale',
    dimension: 'relationship_management',
    orderIndex: 31,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can resolve conflicts between team members',
    questionType: 'likert_scale',
    dimension: 'relationship_management',
    orderIndex: 32,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can give constructive feedback without causing offense',
    questionType: 'likert_scale',
    dimension: 'relationship_management',
    orderIndex: 33,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can inspire and motivate others to achieve common goals',
    questionType: 'likert_scale',
    dimension: 'relationship_management',
    orderIndex: 34,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can work effectively in diverse teams',
    questionType: 'likert_scale',
    dimension: 'relationship_management',
    orderIndex: 35,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I find it difficult to influence or persuade others',
    questionType: 'likert_scale',
    dimension: 'relationship_management',
    orderIndex: 36,
    weight: -1, // 反向题
    isReverse: true
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can adapt my communication style to different audiences',
    questionType: 'likert_scale',
    dimension: 'relationship_management',
    orderIndex: 37,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can build and maintain professional networks',
    questionType: 'likert_scale',
    dimension: 'relationship_management',
    orderIndex: 38,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can facilitate group discussions and decision-making',
    questionType: 'likert_scale',
    dimension: 'relationship_management',
    orderIndex: 39,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can create a positive and inclusive team environment',
    questionType: 'likert_scale',
    dimension: 'relationship_management',
    orderIndex: 40,
    weight: 1
  }
];

// 40题EQ题目选项种子数据
export const eqOptions40: CreatePsychologyQuestionOptionData[] = [
  // 为所有40题创建选项（每题5个选项）
  ...Array.from({ length: 40 }, (_, questionIndex) => {
    const questionId = `eq-q-${questionIndex + 1}`;
    return [
      {
        questionId,
        optionText: 'Strongly disagree',
        optionTextEn: 'Strongly disagree',
        optionValue: '1',
        optionScore: 1,
        orderIndex: 1
      },
      {
        questionId,
        optionText: 'Disagree',
        optionTextEn: 'Disagree',
        optionValue: '2',
        optionScore: 2,
        orderIndex: 2
      },
      {
        questionId,
        optionText: 'Neutral',
        optionTextEn: 'Neutral',
        optionValue: '3',
        optionScore: 3,
        orderIndex: 3
      },
      {
        questionId,
        optionText: 'Agree',
        optionTextEn: 'Agree',
        optionValue: '4',
        optionScore: 4,
        orderIndex: 4
      },
      {
        questionId,
        optionText: 'Strongly agree',
        optionTextEn: 'Strongly agree',
        optionValue: '5',
        optionScore: 5,
        orderIndex: 5
      }
    ];
  }).flat()
];
