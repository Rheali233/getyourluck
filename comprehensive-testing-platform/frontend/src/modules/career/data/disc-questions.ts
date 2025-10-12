/**
 * DISC Behavioral Style Test Questions
 * Based on Marston's DISC theory
 */

import type { DISCQuestion } from '../types';
import { CareerQuestionTypeEnum } from '../types';

export const DISC_QUESTIONS: DISCQuestion[] = [
  {
    id: 'disc_001',
    text: 'I prefer to take charge of situations',
    type: CareerQuestionTypeEnum.LIKERT_SCALE,
    dimension: 'dominance',
    category: 'behavioral',
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
    id: 'disc_002',
    text: 'I enjoy being the center of attention',
    type: CareerQuestionTypeEnum.LIKERT_SCALE,
    dimension: 'influence',
    category: 'communication',
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
    id: 'disc_003',
    text: 'I prefer to work at a steady pace',
    type: CareerQuestionTypeEnum.LIKERT_SCALE,
    dimension: 'steadiness',
    category: 'work_style',
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
    id: 'disc_004',
    text: 'I pay attention to details and accuracy',
    type: CareerQuestionTypeEnum.LIKERT_SCALE,
    dimension: 'conscientiousness',
    category: 'work_style',
    required: true,
    order: 4,
    options: [
      { id: '1', text: 'Strongly Disagree', value: 1 },
      { id: '2', text: 'Disagree', value: 2 },
      { id: '3', text: 'Neutral', value: 3 },
      { id: '4', text: 'Agree', value: 4 },
      { id: '5', text: 'Strongly Agree', value: 5 }
    ]
  }
  // Note: This is a sample of 4 questions. The full test should have 28 questions
  // covering all DISC dimensions with balanced representation
];
