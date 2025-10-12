/**
 * Happiness index assessment question bank seed data
 * Professional 50-question scale based on PERMA model
 * Follows psychological scale design standards
 */

import type { 
  CreateQuestionCategoryData,
  CreateQuestionData,
  CreateQuestionOptionData 
} from '../src/models';

// Happiness index question bank category
export const happinessCategory: CreateQuestionCategoryData = {
  name: 'Happiness Index Assessment',
  code: 'happiness-category',
  description: 'Happiness index assessment scale based on PERMA model, measuring five dimensions: positive emotions, engagement, relationships, meaning, and achievement',
  questionCount: 50,
  dimensions: ['P', 'E', 'R', 'M', 'A'],
  scoringType: 'likert',
  minScore: 50,
  maxScore: 500, // Updated for 1-10 scale: 50 questions × 10 points
  estimatedTime: 15,
  sortOrder: 4
};

// Happiness index question data
export const happinessQuestions: CreateQuestionData[] = [
  // P - Positive Emotion (10 questions)
  {
    categoryId: 'happiness-category',
    questionText: 'I usually feel optimistic about the future.',
    questionType: 'likert_scale',
    dimension: 'P',
    domain: 'optimism',
    weight: 1,
    orderIndex: 1
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I take time to appreciate the good things in life.',
    questionType: 'likert_scale',
    dimension: 'P',
    domain: 'gratitude',
    weight: 1,
    orderIndex: 2
  },
  {
    categoryId: 'happiness-category',
    questionText: 'In the past week, I had more happy days than unhappy days.',
    questionType: 'likert_scale',
    dimension: 'P',
    domain: 'happiness_frequency',
    weight: 1,
    orderIndex: 3
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I can find joy in everyday small things.',
    questionType: 'likert_scale',
    dimension: 'P',
    domain: 'enjoyment',
    weight: 1,
    orderIndex: 4
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I rarely feel satisfied or joyful.',
    questionType: 'likert_scale',
    dimension: 'P',
    domain: 'positive_mindset',
    weight: 1,
    orderIndex: 5,
    isReverse: true
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I tend to see the good side of things rather than the bad side.',
    questionType: 'likert_scale',
    dimension: 'P',
    domain: 'optimism_pessimism',
    weight: 1,
    orderIndex: 6
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I actively share my happiness with others.',
    questionType: 'likert_scale',
    dimension: 'P',
    domain: 'emotion_expression',
    weight: 1,
    orderIndex: 7
  },
  {
    categoryId: 'happiness-category',
    questionText: 'After experiencing setbacks, I can quickly recover to a positive mindset.',
    questionType: 'likert_scale',
    dimension: 'P',
    domain: 'resilience',
    weight: 1,
    orderIndex: 8
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I feel peaceful and calm inside.',
    questionType: 'likert_scale',
    dimension: 'P',
    domain: 'inner_peace',
    weight: 1,
    orderIndex: 9
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I am often troubled by negative emotions such as anxiety and worry.',
    questionType: 'likert_scale',
    dimension: 'P',
    domain: 'negative_emotions',
    weight: 1,
    orderIndex: 10,
    isReverse: true
  },

  // E - Engagement (10 questions)
  {
    categoryId: 'happiness-category',
    questionText: 'When I do things I like, I lose track of time.',
    questionType: 'likert_scale',
    dimension: 'E',
    domain: 'flow_experience',
    weight: 1,
    orderIndex: 11
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I can completely focus on what I am doing.',
    questionType: 'likert_scale',
    dimension: 'E',
    domain: 'concentration',
    weight: 1,
    orderIndex: 12
  },
  {
    categoryId: 'happiness-category',
    questionText: 'My work or hobbies make me feel both challenged and able to use my skills.',
    questionType: 'likert_scale',
    dimension: 'E',
    domain: 'challenge_skill',
    weight: 1,
    orderIndex: 13
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I rarely can fully immerse myself in one thing.',
    questionType: 'likert_scale',
    dimension: 'E',
    domain: 'immersion',
    weight: 1,
    orderIndex: 14,
    isReverse: true
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I feel excited about learning new skills or knowledge.',
    questionType: 'likert_scale',
    dimension: 'E',
    domain: 'learning_interest',
    weight: 1,
    orderIndex: 15
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I often use my strengths and talents.',
    questionType: 'likert_scale',
    dimension: 'E',
    domain: 'personal_strengths',
    weight: 1,
    orderIndex: 16
  },
  {
    categoryId: 'happiness-category',
    questionText: 'My daily activities are closely connected to my personal goals.',
    questionType: 'likert_scale',
    dimension: 'E',
    domain: 'goal_alignment',
    weight: 1,
    orderIndex: 17
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I often feel bored or have nothing to do.',
    questionType: 'likert_scale',
    dimension: 'E',
    domain: 'boredom',
    weight: 1,
    orderIndex: 18,
    isReverse: true
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I can focus my energy on the current task.',
    questionType: 'likert_scale',
    dimension: 'E',
    domain: 'energy_focus',
    weight: 1,
    orderIndex: 19
  },
  {
    categoryId: 'happiness-category',
    questionText: 'My motivation to do things mainly comes from interest rather than external pressure.',
    questionType: 'likert_scale',
    dimension: 'E',
    domain: 'interest_driven',
    weight: 1,
    orderIndex: 20
  },

  // R - Relationships (10 questions)
  {
    categoryId: 'happiness-category',
    questionText: 'When I encounter difficulties, there is someone I can rely on.',
    questionType: 'likert_scale',
    dimension: 'R',
    domain: 'social_support',
    weight: 1,
    orderIndex: 21
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I feel I am a member of some group or community.',
    questionType: 'likert_scale',
    dimension: 'R',
    domain: 'belonging',
    weight: 1,
    orderIndex: 22
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I have very close relationships with my family and friends.',
    questionType: 'likert_scale',
    dimension: 'R',
    domain: 'intimate_relationships',
    weight: 1,
    orderIndex: 23
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I often feel lonely.',
    questionType: 'likert_scale',
    dimension: 'R',
    domain: 'loneliness',
    weight: 1,
    orderIndex: 24,
    isReverse: true
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I enjoy communicating with people and social activities.',
    questionType: 'likert_scale',
    dimension: 'R',
    domain: 'social_interaction',
    weight: 1,
    orderIndex: 25
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I can establish deep emotional connections.',
    questionType: 'likert_scale',
    dimension: 'R',
    domain: 'emotional_connection',
    weight: 1,
    orderIndex: 26
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I believe the people around me genuinely care about me.',
    questionType: 'likert_scale',
    dimension: 'R',
    domain: 'trust_others',
    weight: 1,
    orderIndex: 27
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I actively help others and am willing to accept help from others.',
    questionType: 'likert_scale',
    dimension: 'R',
    domain: 'mutual_help',
    weight: 1,
    orderIndex: 28
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I often feel that interpersonal relationships bring me pressure.',
    questionType: 'likert_scale',
    dimension: 'R',
    domain: 'interpersonal_pressure',
    weight: 1,
    orderIndex: 29,
    isReverse: true
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I have several close friends I can talk to about anything.',
    questionType: 'likert_scale',
    dimension: 'R',
    domain: 'close_friends',
    weight: 1,
    orderIndex: 30
  },

  // M - Meaning (10 questions)
  {
    categoryId: 'happiness-category',
    questionText: 'I have a clear goal for my life.',
    questionType: 'likert_scale',
    dimension: 'M',
    domain: 'goal_sense',
    weight: 1,
    orderIndex: 31
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I feel my life is meaningful.',
    questionType: 'likert_scale',
    dimension: 'M',
    domain: 'existence_value',
    weight: 1,
    orderIndex: 32
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I believe my work or actions can have a positive impact on others.',
    questionType: 'likert_scale',
    dimension: 'M',
    domain: 'serving_others',
    weight: 1,
    orderIndex: 33
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I feel my life has no direction or purpose.',
    questionType: 'likert_scale',
    dimension: 'M',
    domain: 'purpose_sense',
    weight: 1,
    orderIndex: 34,
    isReverse: true
  },
  {
    categoryId: 'happiness-category',
    questionText: 'My actions align with my personal values.',
    questionType: 'likert_scale',
    dimension: 'M',
    domain: 'values',
    weight: 1,
    orderIndex: 35
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I will work hard for goals that are greater than myself.',
    questionType: 'likert_scale',
    dimension: 'M',
    domain: 'altruism',
    weight: 1,
    orderIndex: 36
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I feel proud of what I do.',
    questionType: 'likert_scale',
    dimension: 'M',
    domain: 'achievement_sense',
    weight: 1,
    orderIndex: 37
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I feel I can contribute to the collective or society.',
    questionType: 'likert_scale',
    dimension: 'M',
    domain: 'contribution',
    weight: 1,
    orderIndex: 38
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I often feel lost and don\'t know my life direction.',
    questionType: 'likert_scale',
    dimension: 'M',
    domain: 'lost_sense',
    weight: 1,
    orderIndex: 39,
    isReverse: true
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I feel my life has an important mission.',
    questionType: 'likert_scale',
    dimension: 'M',
    domain: 'mission_sense',
    weight: 1,
    orderIndex: 40
  },

  // A - Accomplishment (10 questions)
  {
    categoryId: 'happiness-category',
    questionText: 'I can often successfully complete the goals I set.',
    questionType: 'likert_scale',
    dimension: 'A',
    domain: 'goal_achievement',
    weight: 1,
    orderIndex: 41
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I feel proud of my achievements.',
    questionType: 'likert_scale',
    dimension: 'A',
    domain: 'pride',
    weight: 1,
    orderIndex: 42
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I believe hard work will be rewarded.',
    questionType: 'likert_scale',
    dimension: 'A',
    domain: 'effort_reward',
    weight: 1,
    orderIndex: 43
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I feel in control of my life.',
    questionType: 'likert_scale',
    dimension: 'A',
    domain: 'mastery_sense',
    weight: 1,
    orderIndex: 44
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I easily procrastinate and cannot complete plans.',
    questionType: 'likert_scale',
    dimension: 'A',
    domain: 'procrastination',
    weight: 1,
    orderIndex: 45,
    isReverse: true
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I enjoy the feeling of winning in competition.',
    questionType: 'likert_scale',
    dimension: 'A',
    domain: 'competitiveness',
    weight: 1,
    orderIndex: 46
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I can feel that I am continuously improving.',
    questionType: 'likert_scale',
    dimension: 'A',
    domain: 'progress',
    weight: 1,
    orderIndex: 47
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I am confident I can handle various challenges in life.',
    questionType: 'likert_scale',
    dimension: 'A',
    domain: 'self_efficacy',
    weight: 1,
    orderIndex: 48
  },
  {
    categoryId: 'happiness-category',
    questionText: 'I am dissatisfied with my performance even when I have done well.',
    questionType: 'likert_scale',
    dimension: 'A',
    domain: 'perfectionism',
    weight: 1,
    orderIndex: 49,
    isReverse: true
  },
  {
    categoryId: 'happiness-category',
    questionText: 'Even when I encounter failure, I can persist.',
    questionType: 'likert_scale',
    dimension: 'A',
    domain: 'resilience',
    weight: 1,
    orderIndex: 50
  }
];

// Happiness index question options data
export const happinessQuestionOptions: CreateQuestionOptionData[] = [
  // Create 10-point scale options for each question (1-10 scale)
  ...happinessQuestions.map((question, index) => [
    {
      questionId: `happiness-q-${index + 1}`,
      optionText: '1 - Strongly Disagree',
      optionTextEn: '1 - Strongly Disagree',
      optionValue: '1',
      optionScore: 1,
      orderIndex: 1
    },
    {
      questionId: `happiness-q-${index + 1}`,
      optionText: '2',
      optionTextEn: '2',
      optionValue: '2',
      optionScore: 2,
      orderIndex: 2
    },
    {
      questionId: `happiness-q-${index + 1}`,
      optionText: '3',
      optionTextEn: '3',
      optionValue: '3',
      optionScore: 3,
      orderIndex: 3
    },
    {
      questionId: `happiness-q-${index + 1}`,
      optionText: '4',
      optionTextEn: '4',
      optionValue: '4',
      optionScore: 4,
      orderIndex: 4
    },
    {
      questionId: `happiness-q-${index + 1}`,
      optionText: '5 - Neutral',
      optionTextEn: '5 - Neutral',
      optionValue: '5',
      optionScore: 5,
      orderIndex: 5
    },
    {
      questionId: `happiness-q-${index + 1}`,
      optionText: '6',
      optionTextEn: '6',
      optionValue: '6',
      optionScore: 6,
      orderIndex: 6
    },
    {
      questionId: `happiness-q-${index + 1}`,
      optionText: '7',
      optionTextEn: '7',
      optionValue: '7',
      optionScore: 7,
      orderIndex: 7
    },
    {
      questionId: `happiness-q-${index + 1}`,
      optionText: '8',
      optionTextEn: '8',
      optionValue: '8',
      optionScore: 8,
      orderIndex: 8
    },
    {
      questionId: `happiness-q-${index + 1}`,
      optionText: '9',
      optionTextEn: '9',
      optionValue: '9',
      optionScore: 9,
      orderIndex: 9
    },
    {
      questionId: `happiness-q-${index + 1}`,
      optionText: '10 - Strongly Agree',
      optionTextEn: '10 - Strongly Agree',
      optionValue: '10',
      optionScore: 10,
      orderIndex: 10
    }
  ]).flat()
];

// Dimension mapping and scoring rules
export const happinessDimensionMapping = {
  P: {
    name: 'Positive Emotion',
    questions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    reverseScored: [5, 10], // Reverse scored questions
    maxScore: 100 // 10 questions × 10 points each
  },
  E: {
    name: 'Engagement',
    questions: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    reverseScored: [14, 18],
    maxScore: 100
  },
  R: {
    name: 'Relationships',
    questions: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    reverseScored: [24, 29],
    maxScore: 100
  },
  M: {
    name: 'Meaning',
    questions: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    reverseScored: [34, 39],
    maxScore: 100
  },
  A: {
    name: 'Accomplishment',
    questions: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
    reverseScored: [45, 49],
    maxScore: 100
  }
};

// Happiness level assessment criteria (updated for 1-10 scale: 50 questions × 10 points = 500 max)
export const happinessLevelCriteria = {
  very_low: { min: 50, max: 200, name: '很低', nameEn: 'Very Low' },
  low: { min: 201, max: 300, name: '低', nameEn: 'Low' },
  moderate: { min: 301, max: 400, name: '中等', nameEn: 'Moderate' },
  high: { min: 401, max: 450, name: '高', nameEn: 'High' },
  very_high: { min: 451, max: 500, name: '很高', nameEn: 'Very High' }
};
