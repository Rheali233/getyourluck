/**
 * Psychology test question bank seed data
 * Follows unified development standard data import specifications
 */

import type { 
  CreateQuestionCategoryData,
  CreateQuestionData,
  CreateQuestionOptionData 
} from '../src/models';

// Import other question bank data
import { eqQuestionsOptimized, eqOptionsOptimized } from './eq-questions-optimized';
import { happinessQuestions as happinessQuestionsData, happinessQuestionOptions } from './happiness-questions';

// MBTI question bank seed data - Extended version (20 core questions)
export const mbtiQuestions: CreateQuestionData[] = [
  // E/I dimension questions
  {
    categoryId: 'mbti-category',
    questionText: 'In social situations, you usually:',
    questionType: 'single_choice',
    dimension: 'E/I',
    orderIndex: 1,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'When you need to recharge, you prefer:',
    questionType: 'single_choice',
    dimension: 'E/I',
    orderIndex: 2,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'In a team, you usually:',
    questionType: 'single_choice',
    dimension: 'E/I',
    orderIndex: 3,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'Facing new environments, you tend to:',
    questionType: 'single_choice',
    dimension: 'E/I',
    orderIndex: 4,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'You prefer to work:',
    questionType: 'single_choice',
    dimension: 'E/I',
    orderIndex: 5,
    weight: 1
  },
  // S/N dimension questions
  {
    categoryId: 'mbti-category',
    questionText: 'You focus more on:',
    questionType: 'single_choice',
    dimension: 'S/N',
    orderIndex: 6,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'When solving problems, you tend to:',
    questionType: 'single_choice',
    dimension: 'S/N',
    orderIndex: 7,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'You prefer to learn:',
    questionType: 'single_choice',
    dimension: 'S/N',
    orderIndex: 8,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'You believe more in:',
    questionType: 'single_choice',
    dimension: 'S/N',
    orderIndex: 9,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'You prefer information that is:',
    questionType: 'single_choice',
    dimension: 'S/N',
    orderIndex: 10,
    weight: 1
  },
  // T/F dimension questions
  {
    categoryId: 'mbti-category',
    questionText: 'When making decisions, you rely more on:',
    questionType: 'single_choice',
    dimension: 'T/F',
    orderIndex: 11,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'You value more:',
    questionType: 'single_choice',
    dimension: 'T/F',
    orderIndex: 12,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'When handling conflicts, you tend to:',
    questionType: 'single_choice',
    dimension: 'T/F',
    orderIndex: 13,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'You appreciate more:',
    questionType: 'single_choice',
    dimension: 'T/F',
    orderIndex: 14,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'You prefer leadership that is:',
    questionType: 'single_choice',
    dimension: 'T/F',
    orderIndex: 15,
    weight: 1
  },
  // J/P dimension questions
  {
    categoryId: 'mbti-category',
    questionText: 'You prefer a lifestyle that is:',
    questionType: 'single_choice',
    dimension: 'J/P',
    orderIndex: 16,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'Facing deadlines, you usually:',
    questionType: 'single_choice',
    dimension: 'J/P',
    orderIndex: 17,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'You prefer work environments that are:',
    questionType: 'single_choice',
    dimension: 'J/P',
    orderIndex: 18,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'You prefer to travel:',
    questionType: 'single_choice',
    dimension: 'J/P',
    orderIndex: 19,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'You prefer to plan:',
    questionType: 'single_choice',
    dimension: 'J/P',
    orderIndex: 20,
    weight: 1
  }
];

// MBTI question options seed data - Extended version
export const mbtiOptions: CreateQuestionOptionData[] = [
  // E/I dimension options - Questions 1-5
  {
    questionId: 'mbti-q-1',
    optionText: 'Initiate conversations and enjoy socializing',
    optionValue: 'E',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-1',
    optionText: 'Wait for others to approach, prefer solitude',
    optionValue: 'I',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-2',
    optionText: 'Relax with friends',
    optionValue: 'E',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-2',
    optionText: 'Rest quietly alone',
    optionValue: 'I',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-3',
    optionText: 'Actively participate in discussions',
    optionValue: 'E',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-3',
    optionText: 'Listen to others\' views',
    optionValue: 'I',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-4',
    optionText: 'Actively meet new people',
    optionValue: 'E',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-4',
    optionText: 'Wait for the right moment',
    optionValue: 'I',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-5',
    optionText: 'Collaborate in teams',
    optionValue: 'E',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-5',
    optionText: 'Complete tasks independently',
    optionValue: 'I',
    orderIndex: 2
  },
  // S/N dimension options - Questions 6-10
  {
    questionId: 'mbti-q-6',
    optionText: 'Concrete facts and data',
    optionValue: 'S',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-6',
    optionText: 'Abstract concepts and theories',
    optionValue: 'N',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-7',
    optionText: 'Use known methods',
    optionValue: 'S',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-7',
    optionText: 'Try new approaches',
    optionValue: 'N',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-8',
    optionText: 'Learn through practice',
    optionValue: 'S',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-8',
    optionText: 'Learn through theory',
    optionValue: 'N',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-9',
    optionText: 'Trust proven experience',
    optionValue: 'S',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-9',
    optionText: 'Trust intuition',
    optionValue: 'N',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-10',
    optionText: 'Focus on details',
    optionValue: 'S',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-10',
    optionText: 'Focus on big picture',
    optionValue: 'N',
    orderIndex: 2
  },
  // T/F dimension options - Questions 11-15
  {
    questionId: 'mbti-q-11',
    optionText: 'Logic and analysis',
    optionValue: 'T',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-11',
    optionText: 'Relationships and emotions',
    optionValue: 'F',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-12',
    optionText: 'Fairness and justice',
    optionValue: 'T',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-12',
    optionText: 'Harmony and compassion',
    optionValue: 'F',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-13',
    optionText: 'Address the issue directly',
    optionValue: 'T',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-13',
    optionText: 'Consider people\'s feelings',
    optionValue: 'F',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-14',
    optionText: 'Competence and efficiency',
    optionValue: 'T',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-14',
    optionText: 'Warmth and empathy',
    optionValue: 'F',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-15',
    optionText: 'Objective evaluation',
    optionValue: 'T',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-15',
    optionText: 'Subjective feelings',
    optionValue: 'F',
    orderIndex: 2
  },
  // J/P dimension options - Questions 16-20
  {
    questionId: 'mbti-q-16',
    optionText: 'Plan and organize, prefer certainty',
    optionValue: 'J',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-16',
    optionText: 'Stay open, prefer flexibility',
    optionValue: 'P',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-17',
    optionText: 'Complete tasks early',
    optionValue: 'J',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-17',
    optionText: 'Complete near deadline',
    optionValue: 'P',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-18',
    optionText: 'Structured and organized',
    optionValue: 'J',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-18',
    optionText: 'Flexible and spontaneous',
    optionValue: 'P',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-19',
    optionText: 'Make detailed plans',
    optionValue: 'J',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-19',
    optionText: 'Go with the flow',
    optionValue: 'P',
    orderIndex: 2
  },
  {
    questionId: 'mbti-q-20',
    optionText: 'Follow the plan',
    optionValue: 'J',
    orderIndex: 1
  },
  {
    questionId: 'mbti-q-20',
    optionText: 'Adjust based on circumstances',
    optionValue: 'P',
    orderIndex: 2
  }
];

// PHQ-9题库种子数据 - 完整9道题目
export const phq9Questions: CreateQuestionData[] = [
  {
    categoryId: 'phq9-category',
    questionText: 'Little interest or pleasure in doing things',
    questionType: 'likert_scale',
    dimension: 'anhedonia',
    orderIndex: 1,
    weight: 1
  },
  {
    categoryId: 'phq9-category',
    questionText: 'Feeling down, depressed, or hopeless',
    questionType: 'likert_scale',
    dimension: 'depressed_mood',
    orderIndex: 2,
    weight: 1
  },
  {
    categoryId: 'phq9-category',
    questionText: 'Trouble falling or staying asleep, or sleeping too much',
    questionType: 'likert_scale',
    dimension: 'sleep_problems',
    orderIndex: 3,
    weight: 1
  },
  {
    categoryId: 'phq9-category',
    questionText: 'Feeling tired or having little energy',
    questionType: 'likert_scale',
    dimension: 'fatigue',
    orderIndex: 4,
    weight: 1
  },
  {
    categoryId: 'phq9-category',
    questionText: 'Poor appetite or overeating',
    questionType: 'likert_scale',
    dimension: 'appetite_changes',
    orderIndex: 5,
    weight: 1
  },
  {
    categoryId: 'phq9-category',
    questionText: 'Feeling bad about yourself, or feeling like a failure',
    questionType: 'likert_scale',
    dimension: 'guilt_feelings',
    orderIndex: 6,
    weight: 1
  },
  {
    categoryId: 'phq9-category',
    questionText: 'Trouble concentrating on things, such as reading the newspaper or watching television',
    questionType: 'likert_scale',
    dimension: 'poor_concentration',
    orderIndex: 7,
    weight: 1
  },
  {
    categoryId: 'phq9-category',
    questionText: 'Moving or speaking slowly enough that other people could have noticed, or the opposite, being so fidgety or restless that you have been moving around a lot more than usual',
    questionType: 'likert_scale',
    dimension: 'psychomotor_changes',
    orderIndex: 8,
    weight: 1
  },
  {
    categoryId: 'phq9-category',
    questionText: 'Thoughts that you would be better off dead or of hurting yourself in some way',
    questionType: 'likert_scale',
    dimension: 'suicidal_thoughts',
    orderIndex: 9,
    weight: 1
  }
];

// PHQ-9题目选项种子数据 - 为所有9道题目创建选项
export const phq9Options: CreateQuestionOptionData[] = [
  // 题目1的选项
  {
    questionId: 'phq9-q-1',
    optionText: 'Not at all',
    optionValue: '0',
    optionScore: 0,
    orderIndex: 1
  },
  {
    questionId: 'phq9-q-1',
    optionText: 'Several days',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 2
  },
  {
    questionId: 'phq9-q-1',
    optionText: 'More than half the days',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 3
  },
  {
    questionId: 'phq9-q-1',
    optionText: 'Nearly every day',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 4
  },
  // 题目2的选项
  {
    questionId: 'phq9-q-2',
    optionText: 'Not at all',
    optionValue: '0',
    optionScore: 0,
    orderIndex: 1
  },
  {
    questionId: 'phq9-q-2',
    optionText: 'Several days',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 2
  },
  {
    questionId: 'phq9-q-2',
    optionText: 'More than half the days',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 3
  },
  {
    questionId: 'phq9-q-2',
    optionText: 'Nearly every day',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 4
  },
  // 题目3的选项
  {
    questionId: 'phq9-q-3',
    optionText: 'Not at all',
    optionValue: '0',
    optionScore: 0,
    orderIndex: 1
  },
  {
    questionId: 'phq9-q-3',
    optionText: 'Several days',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 2
  },
  {
    questionId: 'phq9-q-3',
    optionText: 'More than half the days',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 3
  },
  {
    questionId: 'phq9-q-3',
    optionText: 'Nearly every day',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 4
  },
  // 题目4的选项
  {
    questionId: 'phq9-q-4',
    optionText: 'Not at all',
    optionValue: '0',
    optionScore: 0,
    orderIndex: 1
  },
  {
    questionId: 'phq9-q-4',
    optionText: 'Several days',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 2
  },
  {
    questionId: 'phq9-q-4',
    optionText: 'More than half the days',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 3
  },
  {
    questionId: 'phq9-q-4',
    optionText: 'Nearly every day',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 4
  },
  // 题目5的选项
  {
    questionId: 'phq9-q-5',
    optionText: 'Not at all',
    optionValue: '0',
    optionScore: 0,
    orderIndex: 1
  },
  {
    questionId: 'phq9-q-5',
    optionText: 'Several days',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 2
  },
  {
    questionId: 'phq9-q-5',
    optionText: 'More than half the days',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 3
  },
  {
    questionId: 'phq9-q-5',
    optionText: 'Nearly every day',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 4
  },
  // 题目6的选项
  {
    questionId: 'phq9-q-6',
    optionText: 'Not at all',
    optionValue: '0',
    optionScore: 0,
    orderIndex: 1
  },
  {
    questionId: 'phq9-q-6',
    optionText: 'Several days',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 2
  },
  {
    questionId: 'phq9-q-6',
    optionText: 'More than half the days',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 3
  },
  {
    questionId: 'phq9-q-6',
    optionText: 'Nearly every day',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 4
  },
  // 题目7的选项
  {
    questionId: 'phq9-q-7',
    optionText: 'Not at all',
    optionValue: '0',
    optionScore: 0,
    orderIndex: 1
  },
  {
    questionId: 'phq9-q-7',
    optionText: 'Several days',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 2
  },
  {
    questionId: 'phq9-q-7',
    optionText: 'More than half the days',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 3
  },
  {
    questionId: 'phq9-q-7',
    optionText: 'Nearly every day',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 4
  },
  // 题目8的选项
  {
    questionId: 'phq9-q-8',
    optionText: 'Not at all',
    optionValue: '0',
    optionScore: 0,
    orderIndex: 1
  },
  {
    questionId: 'phq9-q-8',
    optionText: 'Several days',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 2
  },
  {
    questionId: 'phq9-q-8',
    optionText: 'More than half the days',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 3
  },
  {
    questionId: 'phq9-q-8',
    optionText: 'Nearly every day',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 4
  },
  // 题目9的选项
  {
    questionId: 'phq9-q-9',
    optionText: 'Not at all',
    optionValue: '0',
    optionScore: 0,
    orderIndex: 1
  },
  {
    questionId: 'phq9-q-9',
    optionText: 'Several days',
    optionValue: '1',
    optionScore: 1,
    orderIndex: 2
  },
  {
    questionId: 'phq9-q-9',
    optionText: 'More than half the days',
    optionValue: '2',
    optionScore: 2,
    orderIndex: 3
  },
  {
    questionId: 'phq9-q-9',
    optionText: 'Nearly every day',
    optionValue: '3',
    optionScore: 3,
    orderIndex: 4
  }
];

// 情商题库种子数据 - 使用优化版50题题库
export const eqQuestions = eqQuestionsOptimized;

// 情商题目选项种子数据 - 使用优化版选项数据
export const eqOptions = eqOptionsOptimized;

// 幸福指数题库种子数据 - 使用完整的50题PERMA模型题库
export const happinessQuestions = happinessQuestionsData;
export const happinessOptions = happinessQuestionOptions;



// 导出所有种子数据
export const psychologyQuestionSeeds = {
  mbti: {
    questions: mbtiQuestions,
    options: mbtiOptions
  },
  phq9: {
    questions: phq9Questions,
    options: phq9Options
  },
  eq: {
    questions: eqQuestions,
    options: eqOptions
  },
  happiness: {
    questions: happinessQuestions,
    options: happinessOptions
  }
}; 