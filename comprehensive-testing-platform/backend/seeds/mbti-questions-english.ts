/**
 * MBTI question bank seed data - English version
 * 64 questions in 5-point Likert scale format
 * All content in English only
 */

import type { 
  CreatePsychologyQuestionData,
  CreatePsychologyQuestionOptionData 
} from '../src/models';

// MBTI question bank seed data - English version (64 questions, 5-point Likert scale)
export const mbtiQuestionsEnglish: CreatePsychologyQuestionData[] = [
  // E/I dimension questions (16 questions)
  {
    categoryId: 'mbti-category',
    questionText: 'In group situations, I actively initiate conversations.',
    questionType: 'likert_scale',
    dimension: 'E/I',
    orderIndex: 1,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'In business social situations, I actively communicate with key contacts.',
    questionType: 'likert_scale',
    dimension: 'E/I',
    orderIndex: 2,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I can naturally participate in group discussions even when elders or authorities are present.',
    questionType: 'likert_scale',
    dimension: 'E/I',
    orderIndex: 3,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I tend to be noticed in groups.',
    questionType: 'likert_scale',
    dimension: 'E/I',
    orderIndex: 4,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I actively establish and maintain work or social connections.',
    questionType: 'likert_scale',
    dimension: 'E/I',
    orderIndex: 5,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'After long social interactions, I need alone time to recharge.',
    questionType: 'likert_scale',
    dimension: 'E/I',
    orderIndex: 6,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'When facing new tasks, I think quietly before taking action.',
    questionType: 'likert_scale',
    dimension: 'E/I',
    orderIndex: 7,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'In group discussions, I often speak among the first.',
    questionType: 'likert_scale',
    dimension: 'E/I',
    orderIndex: 8,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I trust my internal thinking and judgment more than external feedback.',
    questionType: 'likert_scale',
    dimension: 'E/I',
    orderIndex: 9,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'In unfamiliar environments, I actively explore and learn.',
    questionType: 'likert_scale',
    dimension: 'E/I',
    orderIndex: 10,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'High-intensity social interactions tend to make me feel tired.',
    questionType: 'likert_scale',
    dimension: 'E/I',
    orderIndex: 11,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I usually wait for others to speak first before joining the conversation.',
    questionType: 'likert_scale',
    dimension: 'E/I',
    orderIndex: 12,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'In formal situations involving face-saving, I prefer to communicate privately before expressing publicly.',
    questionType: 'likert_scale',
    dimension: 'E/I',
    orderIndex: 13,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I prefer direct action over repeated discussion.',
    questionType: 'likert_scale',
    dimension: 'E/I',
    orderIndex: 14,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I prefer one-on-one deep conversations over large group communication.',
    questionType: 'likert_scale',
    dimension: 'E/I',
    orderIndex: 15,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I feel pressured when scheduled for consecutive social activities.',
    questionType: 'likert_scale',
    dimension: 'E/I',
    orderIndex: 16,
    weight: 1
  },

  // S/N dimension questions (16 questions)
  {
    categoryId: 'mbti-category',
    questionText: 'When making decisions, I prioritize relying on verified facts and data.',
    questionType: 'likert_scale',
    dimension: 'S/N',
    orderIndex: 17,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I take time to confirm that details are accurate and correct.',
    questionType: 'likert_scale',
    dimension: 'S/N',
    orderIndex: 18,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I often refer to past experiences to handle current problems.',
    questionType: 'likert_scale',
    dimension: 'S/N',
    orderIndex: 19,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'When learning new skills, I prefer to master them step by step.',
    questionType: 'likert_scale',
    dimension: 'S/N',
    orderIndex: 20,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I prefer to use methods that have been proven effective.',
    questionType: 'likert_scale',
    dimension: 'S/N',
    orderIndex: 21,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I often see potential patterns or trends from scattered information.',
    questionType: 'likert_scale',
    dimension: 'S/N',
    orderIndex: 22,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I prefer to understand principles first, then flexibly apply them to different situations.',
    questionType: 'likert_scale',
    dimension: 'S/N',
    orderIndex: 23,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I often think about the long-term future impact of current choices.',
    questionType: 'likert_scale',
    dimension: 'S/N',
    orderIndex: 24,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'When facing problems, I enjoy trying unusual new methods.',
    questionType: 'likert_scale',
    dimension: 'S/N',
    orderIndex: 25,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I rarely think about connecting different things together.',
    questionType: 'likert_scale',
    dimension: 'S/N',
    orderIndex: 26,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'When organizational systems or processes change, I trust clear written regulations and existing practices.',
    questionType: 'likert_scale',
    dimension: 'S/N',
    orderIndex: 27,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I focus more on overall thinking rather than specific details.',
    questionType: 'likert_scale',
    dimension: 'S/N',
    orderIndex: 28,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'Compared to radical innovation, I prefer to choose lower-risk approaches.',
    questionType: 'likert_scale',
    dimension: 'S/N',
    orderIndex: 29,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'When facing organizational change, I tend to envision improvement paths and propose new solutions.',
    questionType: 'likert_scale',
    dimension: 'S/N',
    orderIndex: 30,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I focus more on current reality than future vision.',
    questionType: 'likert_scale',
    dimension: 'S/N',
    orderIndex: 31,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I prefer to make incremental improvements based on existing processes rather than completely redesigning them.',
    questionType: 'likert_scale',
    dimension: 'S/N',
    orderIndex: 32,
    weight: 1
  },

  // T/F dimension questions (16 questions)
  {
    categoryId: 'mbti-category',
    questionText: 'When evaluating solutions, I value logical consistency and verifiability more.',
    questionType: 'likert_scale',
    dimension: 'T/F',
    orderIndex: 33,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'When facing disagreements, I tend to judge based on universal principles and facts.',
    questionType: 'likert_scale',
    dimension: 'T/F',
    orderIndex: 34,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'When providing feedback, I directly point out problems and give improvement suggestions.',
    questionType: 'likert_scale',
    dimension: 'T/F',
    orderIndex: 35,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'When handling affairs, I prioritize considering fair and consistent standards.',
    questionType: 'likert_scale',
    dimension: 'T/F',
    orderIndex: 36,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I focus more on the logic of decisions than others\' feelings.',
    questionType: 'likert_scale',
    dimension: 'T/F',
    orderIndex: 37,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'When handling disagreements, I try to consider everyone\'s feelings.',
    questionType: 'likert_scale',
    dimension: 'T/F',
    orderIndex: 38,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'When publicly expressing different opinions, I consider the other person\'s face-saving feelings.',
    questionType: 'likert_scale',
    dimension: 'T/F',
    orderIndex: 39,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'Before making decisions, I think about their impact and feelings on relevant people.',
    questionType: 'likert_scale',
    dimension: 'T/F',
    orderIndex: 40,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'Compared to efficiency, I value team harmony more.',
    questionType: 'likert_scale',
    dimension: 'T/F',
    orderIndex: 41,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'In important family decisions, I usually consider elders\' opinions.',
    questionType: 'likert_scale',
    dimension: 'T/F',
    orderIndex: 42,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I think "affirm first, then suggest improvements" is more effective than "directly point out problems".',
    questionType: 'likert_scale',
    dimension: 'T/F',
    orderIndex: 43,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'When making moral judgments, I value factual evidence more than individual positions.',
    questionType: 'likert_scale',
    dimension: 'T/F',
    orderIndex: 44,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I actively maintain relationships with colleagues to reduce potential conflicts.',
    questionType: 'likert_scale',
    dimension: 'T/F',
    orderIndex: 45,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'When facing dilemmas, I prioritize making rational choices for organizational goals.',
    questionType: 'likert_scale',
    dimension: 'T/F',
    orderIndex: 46,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I rarely consider social expectations, valuing personal positions more.',
    questionType: 'likert_scale',
    dimension: 'T/F',
    orderIndex: 47,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'In team decisions, I value reaching consensus more than pursuing optimal solutions.',
    questionType: 'likert_scale',
    dimension: 'T/F',
    orderIndex: 48,
    weight: 1
  },

  // J/P dimension questions (16 questions)
  {
    categoryId: 'mbti-category',
    questionText: 'Before starting execution, I prefer to arrange the steps clearly first.',
    questionType: 'likert_scale',
    dimension: 'J/P',
    orderIndex: 49,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'When facing deadlines, I reserve time in advance for checking and correcting.',
    questionType: 'likert_scale',
    dimension: 'J/P',
    orderIndex: 50,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I adapt better to work styles with clear processes and clear divisions of labor.',
    questionType: 'likert_scale',
    dimension: 'J/P',
    orderIndex: 51,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I like clean and orderly environments and maintain relatively stable rhythms.',
    questionType: 'likert_scale',
    dimension: 'J/P',
    orderIndex: 52,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'When I have sufficient information, I make decisions quickly without delay.',
    questionType: 'likert_scale',
    dimension: 'J/P',
    orderIndex: 53,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'When plans change temporarily, I can adapt quickly and maintain efficiency.',
    questionType: 'likert_scale',
    dimension: 'J/P',
    orderIndex: 54,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'After having basic ideas, I prefer to improve while doing.',
    questionType: 'likert_scale',
    dimension: 'J/P',
    orderIndex: 55,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I enjoy capturing unexpected good opportunities outside of existing plans.',
    questionType: 'likert_scale',
    dimension: 'J/P',
    orderIndex: 56,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I usually feel excited rather than anxious about frequently changing environments.',
    questionType: 'likert_scale',
    dimension: 'J/P',
    orderIndex: 57,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I can accept a certain degree of chaos, as long as things can ultimately progress.',
    questionType: 'likert_scale',
    dimension: 'J/P',
    orderIndex: 58,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I stick to the original plan, even when better solutions appear, I don\'t easily change.',
    questionType: 'likert_scale',
    dimension: 'J/P',
    orderIndex: 59,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'When plans are interrupted, I usually need a long time to readjust.',
    questionType: 'likert_scale',
    dimension: 'J/P',
    orderIndex: 60,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I tend to establish clear classification systems to manage information and files.',
    questionType: 'likert_scale',
    dimension: 'J/P',
    orderIndex: 61,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I prefer to keep options open rather than finalize too early.',
    questionType: 'likert_scale',
    dimension: 'J/P',
    orderIndex: 62,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I do systematic review and wrap-up at completion stages.',
    questionType: 'likert_scale',
    dimension: 'J/P',
    orderIndex: 63,
    weight: 1
  },
  {
    categoryId: 'mbti-category',
    questionText: 'I reserve checking time for important tasks to ensure quality.',
    questionType: 'likert_scale',
    dimension: 'J/P',
    orderIndex: 64,
    weight: 1
  }
];

// Likert scale options for all MBTI questions (English only)
export const mbtiLikertOptionsEnglish: CreatePsychologyQuestionOptionData[] = [
  {
    questionId: 'all-mbti-questions',
    optionText: 'Strongly Disagree',
    optionValue: '1',
    optionScore: 1,
    optionDescription: 'Completely does not match my situation',
    orderIndex: 1
  },
  {
    questionId: 'all-mbti-questions',
    optionText: 'Disagree',
    optionValue: '2',
    optionScore: 2,
    optionDescription: 'Mostly does not match my situation',
    orderIndex: 2
  },
  {
    questionId: 'all-mbti-questions',
    optionText: 'Neutral',
    optionValue: '3',
    optionScore: 3,
    optionDescription: 'Partially matches my situation',
    orderIndex: 3
  },
  {
    questionId: 'all-mbti-questions',
    optionText: 'Agree',
    optionValue: '4',
    optionScore: 4,
    optionDescription: 'Mostly matches my situation',
    orderIndex: 4
  },
  {
    questionId: 'all-mbti-questions',
    optionText: 'Strongly Agree',
    optionValue: '5',
    optionScore: 5,
    optionDescription: 'Completely matches my situation',
    orderIndex: 5
  }
];
