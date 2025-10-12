/**
 * Leadership Assessment Test Questions
 * Based on modern leadership development theory
 */

import type { LeadershipQuestion } from '../types';
import { CareerQuestionTypeEnum } from '../types';

export const LEADERSHIP_QUESTIONS: LeadershipQuestion[] = [
  {
    id: 'leadership_001',
    text: 'I can clearly articulate a vision for the future',
    type: CareerQuestionTypeEnum.LIKERT_SCALE,
    dimension: 'vision',
    category: 'strategic',
    required: true,
    order: 1,
    options: [
      { id: '1', text: 'Strongly Disagree', value: 1 },
      { id: '2', text: 'Disagree', value: 2 },
      { id: '3', text: 'Neutral', value: 3 },
      { id: '4', text: 'Agree', value: 4 },
      { id: '5', text: 'Strongly Agree', value: 5 }
    ]
  },
  {
    id: 'leadership_002',
    text: 'I can motivate others to achieve goals',
    type: CareerQuestionTypeEnum.LIKERT_SCALE,
    dimension: 'influence',
    category: 'interpersonal',
    required: true,
    order: 2,
    options: [
      { id: '1', text: 'Strongly Disagree', value: 1 },
      { id: '2', text: 'Disagree', value: 2 },
      { id: '3', text: 'Neutral', value: 3 },
      { id: '4', text: 'Agree', value: 4 },
      { id: '5', text: 'Strongly Agree', value: 5 }
    ]
  },
  {
    id: 'leadership_003',
    text: 'I can effectively execute plans and strategies',
    type: CareerQuestionTypeEnum.LIKERT_SCALE,
    dimension: 'execution',
    category: 'operational',
    required: true,
    order: 3,
    options: [
      { id: '1', text: 'Strongly Disagree', value: 1 },
      { id: '2', text: 'Disagree', value: 2 },
      { id: '3', text: 'Neutral', value: 3 },
      { id: '4', text: 'Agree', value: 4 },
      { id: '5', text: 'Strongly Agree', value: 5 }
    ]
  },
  {
    id: 'leadership_004',
    text: 'I build strong relationships with team members',
    type: CareerQuestionTypeEnum.LIKERT_SCALE,
    dimension: 'relationships',
    category: 'interpersonal',
    required: true,
    order: 4,
    options: [
      { id: '1', text: 'Strongly Disagree', value: 1 },
      { id: '2', text: 'Disagree', value: 2 },
      { id: '3', text: 'Neutral', value: 3 },
      { id: '4', text: 'Agree', value: 4 },
      { id: '5', text: 'Strongly Agree', value: 5 }
    ]
  },
  {
    id: 'leadership_005',
    text: 'I can adapt to changing circumstances',
    type: CareerQuestionTypeEnum.LIKERT_SCALE,
    dimension: 'adaptability',
    category: 'strategic',
    required: true,
    order: 5,
    options: [
      { id: '1', text: 'Strongly Disagree', value: 1 },
      { id: '2', text: 'Disagree', value: 2 },
      { id: '3', text: 'Neutral', value: 3 },
      { id: '4', text: 'Agree', value: 4 },
      { id: '5', text: 'Strongly Agree', value: 5 }
    ]
  }
  // Note: This is a sample of 5 questions. The full test should have 40 questions
  // covering all leadership dimensions with balanced representation
];
