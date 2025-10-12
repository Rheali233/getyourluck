import { Question, QuestionFormat } from '@/modules/testing/types/TestTypes';
import { HollandQuestion, DISCQuestion, LeadershipQuestion } from '../types';

/**
 * Convert career module questions to unified Question type
 */

export const convertHollandQuestion = (question: HollandQuestion): Question => ({
  id: question.id,
  text: question.text,
  format: QuestionFormat.SINGLE_CHOICE,
  options: question.options.map(option => ({
    id: option.id,
    text: option.text,
    value: option.value
  })),
  category: 'career'
});

export const convertDISCQuestion = (question: DISCQuestion): Question => ({
  id: question.id,
  text: question.text,
  format: QuestionFormat.SINGLE_CHOICE,
  options: question.options.map(option => ({
    id: option.id,
    text: option.text,
    value: option.value
  })),
  category: 'career'
});

export const convertLeadershipQuestion = (question: LeadershipQuestion): Question => ({
  id: question.id,
  text: question.text,
  format: QuestionFormat.SINGLE_CHOICE,
  options: question.options.map(option => ({
    id: option.id,
    text: option.text,
    value: option.value
  })),
  category: 'career'
});

export const convertCareerQuestions = (
  questions: HollandQuestion[] | DISCQuestion[] | LeadershipQuestion[],
  testType: string
): Question[] => {
  if (testType === 'holland') {
    return (questions as HollandQuestion[]).map(convertHollandQuestion);
  } else if (testType === 'disc') {
    return (questions as DISCQuestion[]).map(convertDISCQuestion);
  } else if (testType === 'leadership') {
    return (questions as LeadershipQuestion[]).map(convertLeadershipQuestion);
  }
  return [];
};
