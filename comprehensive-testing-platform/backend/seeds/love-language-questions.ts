/**
 * Love Language Test question bank seed data
 * 30 questions based on Gary Chapman's 5 Love Languages theory
 */

import type { 
  CreatePsychologyQuestionData,
  CreatePsychologyQuestionOptionData 
} from '../src/models';

// Love Language Test question bank seed data (30 questions, 5-point Likert scale)
export const loveLanguageQuestions: CreatePsychologyQuestionData[] = [
  // Words of Affirmation dimension questions (6 questions)
  {
    categoryId: 'love-language-category',
    questionText: 'I feel most loved when someone tells me they appreciate me.',
    questionType: 'likert_scale',
    dimension: 'Words_of_Affirmation',
    orderIndex: 1,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'Verbal compliments and encouragement mean a lot to me.',
    questionType: 'likert_scale',
    dimension: 'Words_of_Affirmation',
    orderIndex: 2,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I appreciate when someone acknowledges my efforts and achievements.',
    questionType: 'likert_scale',
    dimension: 'Words_of_Affirmation',
    orderIndex: 3,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'Hearing "I love you" and other positive words is important to me.',
    questionType: 'likert_scale',
    dimension: 'Words_of_Affirmation',
    orderIndex: 4,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I value kind and supportive words from my partner.',
    questionType: 'likert_scale',
    dimension: 'Words_of_Affirmation',
    orderIndex: 5,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I feel hurt when someone criticizes or speaks harshly to me.',
    questionType: 'likert_scale',
    dimension: 'Words_of_Affirmation',
    orderIndex: 6,
    weight: 1
  },

  // Quality Time dimension questions (6 questions)
  {
    categoryId: 'love-language-category',
    questionText: 'I feel most loved when someone spends focused time with me.',
    questionType: 'likert_scale',
    dimension: 'Quality_Time',
    orderIndex: 7,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'Undivided attention and meaningful conversations are important to me.',
    questionType: 'likert_scale',
    dimension: 'Quality_Time',
    orderIndex: 8,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I enjoy doing activities together with my partner.',
    questionType: 'likert_scale',
    dimension: 'Quality_Time',
    orderIndex: 9,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I feel valued when someone makes time for me in their schedule.',
    questionType: 'likert_scale',
    dimension: 'Quality_Time',
    orderIndex: 10,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I prefer meaningful one-on-one time over group activities.',
    questionType: 'likert_scale',
    dimension: 'Quality_Time',
    orderIndex: 11,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I feel hurt when someone is distracted or not fully present with me.',
    questionType: 'likert_scale',
    dimension: 'Quality_Time',
    orderIndex: 12,
    weight: 1
  },

  // Receiving Gifts dimension questions (6 questions)
  {
    categoryId: 'love-language-category',
    questionText: 'I feel most loved when someone gives me thoughtful gifts.',
    questionType: 'likert_scale',
    dimension: 'Receiving_Gifts',
    orderIndex: 13,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I appreciate when someone remembers special occasions with gifts.',
    questionType: 'likert_scale',
    dimension: 'Receiving_Gifts',
    orderIndex: 14,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'Small tokens of affection make me feel special.',
    questionType: 'likert_scale',
    dimension: 'Receiving_Gifts',
    orderIndex: 15,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I value the thought and effort behind gift-giving.',
    questionType: 'likert_scale',
    dimension: 'Receiving_Gifts',
    orderIndex: 16,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I feel hurt when someone forgets to give me a gift on special days.',
    questionType: 'likert_scale',
    dimension: 'Receiving_Gifts',
    orderIndex: 17,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I enjoy receiving both big and small presents from my partner.',
    questionType: 'likert_scale',
    dimension: 'Receiving_Gifts',
    orderIndex: 18,
    weight: 1
  },

  // Acts of Service dimension questions (6 questions)
  {
    categoryId: 'love-language-category',
    questionText: 'I feel most loved when someone helps me with tasks or chores.',
    questionType: 'likert_scale',
    dimension: 'Acts_of_Service',
    orderIndex: 19,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I appreciate when someone goes out of their way to help me.',
    questionType: 'likert_scale',
    dimension: 'Acts_of_Service',
    orderIndex: 20,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I feel valued when someone takes care of things for me.',
    questionType: 'likert_scale',
    dimension: 'Acts_of_Service',
    orderIndex: 21,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I notice and appreciate small acts of kindness and help.',
    questionType: 'likert_scale',
    dimension: 'Acts_of_Service',
    orderIndex: 22,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I feel hurt when someone refuses to help me when I need it.',
    questionType: 'likert_scale',
    dimension: 'Acts_of_Service',
    orderIndex: 23,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I value practical support and assistance from my partner.',
    questionType: 'likert_scale',
    dimension: 'Acts_of_Service',
    orderIndex: 24,
    weight: 1
  },

  // Physical Touch dimension questions (6 questions)
  {
    categoryId: 'love-language-category',
    questionText: 'I feel most loved when someone shows me physical affection.',
    questionType: 'likert_scale',
    dimension: 'Physical_Touch',
    orderIndex: 25,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'Hugs, kisses, and holding hands are important to me.',
    questionType: 'likert_scale',
    dimension: 'Physical_Touch',
    orderIndex: 26,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I feel connected to my partner through physical closeness.',
    questionType: 'likert_scale',
    dimension: 'Physical_Touch',
    orderIndex: 27,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I appreciate non-sexual physical contact and touch.',
    questionType: 'likert_scale',
    dimension: 'Physical_Touch',
    orderIndex: 28,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I feel hurt when someone avoids physical contact with me.',
    questionType: 'likert_scale',
    dimension: 'Physical_Touch',
    orderIndex: 29,
    weight: 1
  },
  {
    categoryId: 'love-language-category',
    questionText: 'I value the warmth and comfort of physical touch in relationships.',
    questionType: 'likert_scale',
    dimension: 'Physical_Touch',
    orderIndex: 30,
    weight: 1
  }
];

// Likert scale options for all Love Language questions
export const loveLanguageOptions: CreatePsychologyQuestionOptionData[] = [
  {
    questionId: 'all-love-language-questions',
    optionText: 'Strongly Disagree',
    optionValue: '1',
    optionScore: 1,
    optionDescription: 'Completely does not match my situation',
    orderIndex: 1,
    isCorrect: false
  },
  {
    questionId: 'all-love-language-questions',
    optionText: 'Disagree',
    optionValue: '2',
    optionScore: 2,
    optionDescription: 'Mostly does not match my situation',
    orderIndex: 2,
    isCorrect: false
  },
  {
    questionId: 'all-love-language-questions',
    optionText: 'Neutral',
    optionValue: '3',
    optionScore: 3,
    optionDescription: 'Partially matches my situation',
    orderIndex: 3,
    isCorrect: false
  },
  {
    questionId: 'all-love-language-questions',
    optionText: 'Agree',
    optionValue: '4',
    optionScore: 4,
    optionDescription: 'Mostly matches my situation',
    orderIndex: 4,
    isCorrect: false
  },
  {
    questionId: 'all-love-language-questions',
    optionText: 'Strongly Agree',
    optionValue: '5',
    optionScore: 5,
    optionDescription: 'Completely matches my situation',
    orderIndex: 5,
    isCorrect: false
  }
];

// Love Language category configuration
export const loveLanguageCategory = {
  id: 'love-language-category',
  name: 'Love Language Test',
  code: 'love_language',
  description: 'Assessment of how you prefer to give and receive love based on Gary Chapman\'s 5 Love Languages',
  questionCount: 30,
  dimensions: ['Words_of_Affirmation', 'Quality_Time', 'Receiving_Gifts', 'Acts_of_Service', 'Physical_Touch'],
  scoringType: 'likert' as const,
  minScore: 30,
  maxScore: 150,
  estimatedTime: 15
};

// Love Language configuration data
export const loveLanguageConfigs = [
  {
    id: 'love-language-config-1',
    categoryId: 'love-language-category',
    configKey: 'dimension_weights',
    configValue: '{"Words_of_Affirmation": 1, "Quality_Time": 1, "Receiving_Gifts": 1, "Acts_of_Service": 1, "Physical_Touch": 1}',
    configType: 'json' as const,
    description: 'Love Language Test dimension weights configuration'
  },
  {
    id: 'love-language-config-2',
    categoryId: 'love-language-category',
    configKey: 'scoring_algorithm',
    configValue: 'dimension_average',
    configType: 'string' as const,
    description: 'Love Language Test scoring algorithm: dimension average'
  },
  {
    id: 'love-language-config-3',
    categoryId: 'love-language-category',
    configKey: 'interpretation_rules',
    configValue: '{"primary_threshold": 0.6, "secondary_threshold": 0.4, "weak_threshold": 0.2}',
    configType: 'json' as const,
    description: 'Love Language Test interpretation threshold rules'
  }
];
