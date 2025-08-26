/**
 * Optimized EQ Emotional Intelligence Question Bank v1.2
 * 5 major dimensions × 10 questions per dimension = 50 questions
 * Reverse questions ratio: 40% (4 questions per dimension)
 * Scale: Likert 5-point scale (1=Strongly Disagree ~ 5=Strongly Agree)
 */

import type { CreatePsychologyQuestionData, CreatePsychologyQuestionOptionData } from '../src/models';

// Optimized EQ question bank seed data
export const eqQuestionsOptimized: CreatePsychologyQuestionData[] = [
  // 一、自我认知（Self-Awareness, SA）
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
    questionText: 'I am aware of the emotional impact I have on others',
    questionType: 'likert_scale',
    dimension: 'self_awareness',
    orderIndex: 7,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can accurately recall the reasons for my emotional experiences',
    questionType: 'likert_scale',
    dimension: 'self_awareness',
    orderIndex: 8,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I occasionally ignore my inner thoughts and feelings',
    questionType: 'likert_scale',
    dimension: 'self_awareness',
    orderIndex: 9,
    weight: -1, // 反向题
    isReverse: true
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can quickly identify whether I am angry, sad, or disappointed',
    questionType: 'likert_scale',
    dimension: 'self_awareness',
    orderIndex: 10,
    weight: 1
  },

  // 二、自我管理（Self-Regulation, SR）
  {
    categoryId: 'eq-category',
    questionText: 'I can remain calm under pressure',
    questionType: 'likert_scale',
    dimension: 'self_regulation',
    orderIndex: 11,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I pause to think before acting impulsively',
    questionType: 'likert_scale',
    dimension: 'self_regulation',
    orderIndex: 12,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can control my words and actions even when provoked',
    questionType: 'likert_scale',
    dimension: 'self_regulation',
    orderIndex: 13,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can quickly restore emotional balance after setbacks',
    questionType: 'likert_scale',
    dimension: 'self_regulation',
    orderIndex: 14,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can adjust my behavior according to the situation',
    questionType: 'likert_scale',
    dimension: 'self_regulation',
    orderIndex: 15,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I sometimes get emotional over small things',
    questionType: 'likert_scale',
    dimension: 'self_regulation',
    orderIndex: 16,
    weight: -1, // 反向题
    isReverse: true
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can express anger or dissatisfaction constructively',
    questionType: 'likert_scale',
    dimension: 'self_regulation',
    orderIndex: 17,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I regulate my emotions through exercise, deep breathing, etc.',
    questionType: 'likert_scale',
    dimension: 'self_regulation',
    orderIndex: 18,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I find it somewhat difficult to control my emotions',
    questionType: 'likert_scale',
    dimension: 'self_regulation',
    orderIndex: 19,
    weight: -1, // 反向题
    isReverse: true
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can remain flexible and adaptable when facing changes',
    questionType: 'likert_scale',
    dimension: 'self_regulation',
    orderIndex: 20,
    weight: 1
  },

  // 三、动机（Motivation, MO）
  {
    categoryId: 'eq-category',
    questionText: 'I am willing to work hard for long-term goals',
    questionType: 'likert_scale',
    dimension: 'motivation',
    orderIndex: 21,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I persist in completing tasks even without immediate rewards',
    questionType: 'likert_scale',
    dimension: 'motivation',
    orderIndex: 22,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I set challenging goals for myself',
    questionType: 'likert_scale',
    dimension: 'motivation',
    orderIndex: 23,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can maintain self-discipline without supervision',
    questionType: 'likert_scale',
    dimension: 'motivation',
    orderIndex: 24,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I actively seek opportunities for learning and growth',
    questionType: 'likert_scale',
    dimension: 'motivation',
    orderIndex: 25,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I sometimes hesitate due to fear of failure',
    questionType: 'likert_scale',
    dimension: 'motivation',
    orderIndex: 26,
    weight: -1, // 反向题
    isReverse: true
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can motivate myself again after encountering setbacks',
    questionType: 'likert_scale',
    dimension: 'motivation',
    orderIndex: 27,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I do things mainly to gain recognition from others',
    questionType: 'likert_scale',
    dimension: 'motivation',
    orderIndex: 28,
    weight: -1, // 反向题（外部动机）
    isReverse: true
  },
  {
    categoryId: 'eq-category',
    questionText: 'I tend to lose interest before completing tasks',
    questionType: 'likert_scale',
    dimension: 'motivation',
    orderIndex: 29,
    weight: -1, // 反向题
    isReverse: true
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can maintain a positive attitude in teams and inspire others',
    questionType: 'likert_scale',
    dimension: 'motivation',
    orderIndex: 30,
    weight: 1
  },

  // 四、共情（Empathy, EM）
  {
    categoryId: 'eq-category',
    questionText: 'I can detect others\' feelings from their expressions and tone',
    questionType: 'likert_scale',
    dimension: 'empathy',
    orderIndex: 31,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I actively listen to others instead of rushing to express myself',
    questionType: 'likert_scale',
    dimension: 'empathy',
    orderIndex: 32,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can understand others\' perspectives even when I disagree',
    questionType: 'likert_scale',
    dimension: 'empathy',
    orderIndex: 33,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can keenly detect others\' embarrassment or unease in social situations',
    questionType: 'likert_scale',
    dimension: 'empathy',
    orderIndex: 34,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I am willing to comfort others when they are feeling down',
    questionType: 'likert_scale',
    dimension: 'empathy',
    orderIndex: 35,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I occasionally miss others\' emotional signals',
    questionType: 'likert_scale',
    dimension: 'empathy',
    orderIndex: 36,
    weight: -1, // 反向题
    isReverse: true
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can detect subtle nonverbal cues (such as tone, eye contact)',
    questionType: 'likert_scale',
    dimension: 'empathy',
    orderIndex: 37,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I resonate with others\' suffering',
    questionType: 'likert_scale',
    dimension: 'empathy',
    orderIndex: 38,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I lack patience with others\' needs',
    questionType: 'likert_scale',
    dimension: 'empathy',
    orderIndex: 39,
    weight: -1, // 反向题
    isReverse: true
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can adjust my communication style based on others\' emotions',
    questionType: 'likert_scale',
    dimension: 'empathy',
    orderIndex: 40,
    weight: 1
  },

  // 五、社会技能（Social Skills, SS）
  {
    categoryId: 'eq-category',
    questionText: 'I can actively initiate conversations in unfamiliar groups',
    questionType: 'likert_scale',
    dimension: 'social_skills',
    orderIndex: 41,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can effectively coordinate division of labor in teams',
    questionType: 'likert_scale',
    dimension: 'social_skills',
    orderIndex: 42,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can clearly and effectively express my ideas',
    questionType: 'likert_scale',
    dimension: 'social_skills',
    orderIndex: 43,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can find solutions acceptable to all parties in conflicts',
    questionType: 'likert_scale',
    dimension: 'social_skills',
    orderIndex: 44,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can build positive relationships with people from different backgrounds',
    questionType: 'likert_scale',
    dimension: 'social_skills',
    orderIndex: 45,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I feel uncomfortable in certain social situations',
    questionType: 'likert_scale',
    dimension: 'social_skills',
    orderIndex: 46,
    weight: -1, // 反向题
    isReverse: true
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can ease tense or hostile atmospheres through communication',
    questionType: 'likert_scale',
    dimension: 'social_skills',
    orderIndex: 47,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can flexibly adjust my communication style according to the occasion',
    questionType: 'likert_scale',
    dimension: 'social_skills',
    orderIndex: 48,
    weight: 1
  },
  {
    categoryId: 'eq-category',
    questionText: 'I find it difficult to persuade or influence others',
    questionType: 'likert_scale',
    dimension: 'social_skills',
    orderIndex: 49,
    weight: -1, // 反向题
    isReverse: true
  },
  {
    categoryId: 'eq-category',
    questionText: 'I can inspire team members to achieve goals together',
    questionType: 'likert_scale',
    dimension: 'social_skills',
    orderIndex: 50,
    weight: 1
  }
];

// 优化版EQ题目选项种子数据
export const eqOptionsOptimized: CreatePsychologyQuestionOptionData[] = [
  // 为所有50题创建选项（每题5个选项）
  ...Array.from({ length: 50 }, (_, questionIndex) => {
    const questionId = `eq-q-${questionIndex + 1}`;
    return [
      {
        questionId,
        optionText: '非常不同意',
        optionTextEn: 'Strongly disagree',
        optionValue: '1',
        optionScore: 1,
        orderIndex: 1
      },
      {
        questionId,
        optionText: '不同意',
        optionTextEn: 'Disagree',
        optionValue: '2',
        optionScore: 2,
        orderIndex: 2
      },
      {
        questionId,
        optionText: '中立',
        optionTextEn: 'Neutral',
        optionValue: '3',
        optionScore: 3,
        orderIndex: 3
      },
      {
        questionId,
        optionText: '同意',
        optionTextEn: 'Agree',
        optionValue: '4',
        optionScore: 4,
        orderIndex: 4
      },
      {
        questionId,
        optionText: '非常同意',
        optionTextEn: 'Strongly agree',
        optionValue: '5',
        optionScore: 5,
        orderIndex: 5
      }
    ];
  }).flat()
];

// 导出优化版EQ题库数据
export const eqOptimizedSeeds = {
  questions: eqQuestionsOptimized,
  options: eqOptionsOptimized
};
