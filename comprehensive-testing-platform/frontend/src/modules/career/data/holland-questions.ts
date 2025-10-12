/**
 * Holland Career Interest Test Questions
 * Based on Holland's RIASEC theory
 */

import type { HollandQuestion } from '../types';
import { CareerQuestionTypeEnum } from '../types';

export const HOLLAND_QUESTIONS: HollandQuestion[] = [
  {
    id: 'holland_001',
    text: 'I enjoy working with tools and machines',
    type: CareerQuestionTypeEnum.LIKERT_SCALE,
    dimension: 'realistic',
    category: 'realistic',
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
    id: 'holland_002',
    text: 'I like to solve complex problems',
    type: CareerQuestionTypeEnum.LIKERT_SCALE,
    dimension: 'investigative',
    category: 'investigative',
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
    id: 'holland_003',
    text: 'I enjoy creating art or music',
    type: CareerQuestionTypeEnum.LIKERT_SCALE,
    dimension: 'artistic',
    category: 'artistic',
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
    id: 'holland_004',
    text: 'I like helping people with their problems',
    type: CareerQuestionTypeEnum.LIKERT_SCALE,
    dimension: 'social',
    category: 'social',
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
    id: 'holland_005',
    text: 'I enjoy persuading others to see my point of view',
    type: CareerQuestionTypeEnum.LIKERT_SCALE,
    dimension: 'enterprising',
    category: 'enterprising',
    required: true,
    order: 5,
    options: [
      { id: '1', text: 'Strongly Disagree', value: 1 },
      { id: '2', text: 'Disagree', value: 2 },
      { id: '3', text: 'Neutral', value: 3 },
      { id: '4', text: 'Agree', value: 4 },
      { id: '5', text: 'Strongly Agree', value: 5 }
    ]
  },
  {
    id: 'holland_006',
    text: 'I prefer to follow a set routine',
    type: CareerQuestionTypeEnum.LIKERT_SCALE,
    dimension: 'conventional',
    category: 'conventional',
    required: true,
    order: 6,
    options: [
      { id: '1', text: 'Strongly Disagree', value: 1 },
      { id: '2', text: 'Disagree', value: 2 },
      { id: '3', text: 'Neutral', value: 3 },
      { id: '4', text: 'Agree', value: 4 },
      { id: '5', text: 'Strongly Agree', value: 5 }
    ]
  }
  // Note: This is a sample of 6 questions. The full test should have 60 questions
  // covering all RIASEC dimensions with balanced representation
];
