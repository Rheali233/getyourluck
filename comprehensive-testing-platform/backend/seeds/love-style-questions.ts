/**
 * Love Style Assessment question bank seed data
 * 30 questions based on John Alan Lee's Love Styles Theory
 */

import type { 
  CreatePsychologyQuestionData,
  CreatePsychologyQuestionOptionData 
} from '../src/models';

// Love Style Assessment question bank seed data (30 questions, 5-point Likert scale)
export const loveStyleQuestions: CreatePsychologyQuestionData[] = [
  // Eros (Romantic Love) dimension questions (5 questions)
  {
    categoryId: 'love-style-category',
    questionText: 'I believe in love at first sight and intense emotional connections.',
    questionType: 'likert_scale',
    dimension: 'Eros',
    orderIndex: 1,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'Physical attraction and chemistry are essential for me to fall in love.',
    questionType: 'likert_scale',
    dimension: 'Eros',
    orderIndex: 2,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I often experience overwhelming feelings of passion and desire in relationships.',
    questionType: 'likert_scale',
    dimension: 'Eros',
    orderIndex: 3,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I believe true love should be intense, dramatic, and all-consuming.',
    questionType: 'likert_scale',
    dimension: 'Eros',
    orderIndex: 4,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I am drawn to relationships that feel like they are meant to be.',
    questionType: 'likert_scale',
    dimension: 'Eros',
    orderIndex: 5,
    weight: 1
  },

  // Ludus (Playful Love) dimension questions (5 questions)
  {
    categoryId: 'love-style-category',
    questionText: 'I enjoy the thrill of flirting and the early stages of dating.',
    questionType: 'likert_scale',
    dimension: 'Ludus',
    orderIndex: 6,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I see relationships as fun games to be played and enjoyed.',
    questionType: 'likert_scale',
    dimension: 'Ludus',
    orderIndex: 7,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I prefer to keep relationships light and avoid getting too serious too quickly.',
    questionType: 'likert_scale',
    dimension: 'Ludus',
    orderIndex: 8,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I enjoy dating multiple people and keeping my options open.',
    questionType: 'likert_scale',
    dimension: 'Ludus',
    orderIndex: 9,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I believe love should be fun and not taken too seriously.',
    questionType: 'likert_scale',
    dimension: 'Ludus',
    orderIndex: 10,
    weight: 1
  },

  // Storge (Companionate Love) dimension questions (5 questions)
  {
    categoryId: 'love-style-category',
    questionText: 'I prefer relationships that develop gradually from friendship.',
    questionType: 'likert_scale',
    dimension: 'Storge',
    orderIndex: 11,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I value deep friendship and companionship in romantic relationships.',
    questionType: 'likert_scale',
    dimension: 'Storge',
    orderIndex: 12,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I believe the best relationships are built on trust and mutual understanding.',
    questionType: 'likert_scale',
    dimension: 'Storge',
    orderIndex: 13,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I prefer stable, long-term relationships over passionate short-term ones.',
    questionType: 'likert_scale',
    dimension: 'Storge',
    orderIndex: 14,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I value emotional security and reliability in my partner.',
    questionType: 'likert_scale',
    dimension: 'Storge',
    orderIndex: 15,
    weight: 1
  },

  // Pragma (Practical Love) dimension questions (5 questions)
  {
    categoryId: 'love-style-category',
    questionText: 'I carefully consider compatibility factors before committing to a relationship.',
    questionType: 'likert_scale',
    dimension: 'Pragma',
    orderIndex: 16,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I look for partners who share my values, goals, and lifestyle.',
    questionType: 'likert_scale',
    dimension: 'Pragma',
    orderIndex: 17,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I believe in making practical decisions about relationships based on logic.',
    questionType: 'likert_scale',
    dimension: 'Pragma',
    orderIndex: 18,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I consider factors like education, career, and family background when choosing a partner.',
    questionType: 'likert_scale',
    dimension: 'Pragma',
    orderIndex: 19,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I prefer relationships that make practical sense and fit my life plans.',
    questionType: 'likert_scale',
    dimension: 'Pragma',
    orderIndex: 20,
    weight: 1
  },

  // Mania (Obsessive Love) dimension questions (5 questions)
  {
    categoryId: 'love-style-category',
    questionText: 'I tend to become emotionally dependent on my romantic partners.',
    questionType: 'likert_scale',
    dimension: 'Mania',
    orderIndex: 21,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I often worry about losing my partner and need constant reassurance.',
    questionType: 'likert_scale',
    dimension: 'Mania',
    orderIndex: 22,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I experience intense jealousy and possessiveness in relationships.',
    questionType: 'likert_scale',
    dimension: 'Mania',
    orderIndex: 23,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I tend to idealize my partners and ignore their flaws.',
    questionType: 'likert_scale',
    dimension: 'Mania',
    orderIndex: 24,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I often feel anxious and insecure about the status of my relationships.',
    questionType: 'likert_scale',
    dimension: 'Mania',
    orderIndex: 25,
    weight: 1
  },

  // Agape (Selfless Love) dimension questions (5 questions)
  {
    categoryId: 'love-style-category',
    questionText: 'I believe in putting my partner\'s needs and happiness before my own.',
    questionType: 'likert_scale',
    dimension: 'Agape',
    orderIndex: 26,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I find fulfillment in caring for and supporting my partner unconditionally.',
    questionType: 'likert_scale',
    dimension: 'Agape',
    orderIndex: 27,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I believe love means accepting and loving someone exactly as they are.',
    questionType: 'likert_scale',
    dimension: 'Agape',
    orderIndex: 28,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I am willing to make significant sacrifices for the person I love.',
    questionType: 'likert_scale',
    dimension: 'Agape',
    orderIndex: 29,
    weight: 1
  },
  {
    categoryId: 'love-style-category',
    questionText: 'I believe true love is selfless and unconditional.',
    questionType: 'likert_scale',
    dimension: 'Agape',
    orderIndex: 30,
    weight: 1
  }
];

// Likert scale options for all Love Style questions
export const loveStyleOptions: CreatePsychologyQuestionOptionData[] = [
  {
    questionId: 'all-love-style-questions',
    optionText: 'Strongly Disagree',
    optionValue: '1',
    optionScore: 1,
    optionDescription: 'Completely does not match my situation',
    orderIndex: 1,
    isCorrect: false
  },
  {
    questionId: 'all-love-style-questions',
    optionText: 'Disagree',
    optionValue: '2',
    optionScore: 2,
    optionDescription: 'Mostly does not match my situation',
    orderIndex: 2,
    isCorrect: false
  },
  {
    questionId: 'all-love-style-questions',
    optionText: 'Neutral',
    optionValue: '3',
    optionScore: 3,
    optionDescription: 'Partially matches my situation',
    orderIndex: 3,
    isCorrect: false
  },
  {
    questionId: 'all-love-style-questions',
    optionText: 'Agree',
    optionValue: '4',
    optionScore: 4,
    optionDescription: 'Mostly matches my situation',
    orderIndex: 4,
    isCorrect: false
  },
  {
    questionId: 'all-love-style-questions',
    optionText: 'Strongly Agree',
    optionValue: '5',
    optionScore: 5,
    optionDescription: 'Completely matches my situation',
    orderIndex: 5,
    isCorrect: false
  }
];

// Love Style category configuration
export const loveStyleCategory = {
  id: 'love-style-category',
  name: 'Love Style Assessment',
  code: 'love_style',
  description: 'Comprehensive assessment of romantic relationship styles based on John Alan Lee\'s Love Styles Theory',
  questionCount: 30,
  dimensions: ['Eros', 'Ludus', 'Storge', 'Pragma', 'Mania', 'Agape'],
  scoringType: 'likert' as const,
  minScore: 30,
  maxScore: 150,
  estimatedTime: 15
};

// Love Style configuration data
export const loveStyleConfigs = [
  {
    id: 'love-style-config-1',
    categoryId: 'love-style-category',
    configKey: 'dimension_weights',
    configValue: '{"Eros": 1, "Ludus": 1, "Storge": 1, "Pragma": 1, "Mania": 1, "Agape": 1}',
    configType: 'json' as const,
    description: 'Love Style Assessment dimension weights configuration'
  },
  {
    id: 'love-style-config-2',
    categoryId: 'love-style-category',
    configKey: 'scoring_algorithm',
    configValue: 'dimension_average',
    configType: 'string' as const,
    description: 'Love Style Assessment scoring algorithm: dimension average'
  },
  {
    id: 'love-style-config-3',
    categoryId: 'love-style-category',
    configKey: 'interpretation_rules',
    configValue: '{"primary_threshold": 0.6, "secondary_threshold": 0.4, "weak_threshold": 0.2}',
    configType: 'json' as const,
    description: 'Love Style Assessment interpretation threshold rules'
  }
];
