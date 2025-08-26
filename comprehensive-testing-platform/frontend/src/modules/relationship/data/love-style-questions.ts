/**
 * Love Style Test Questions
 * Based on Lee's Love Styles theory
 * Sample questions for demonstration
 */

import type { LoveStyleQuestion } from '../types';

export const loveStyleQuestions: LoveStyleQuestion[] = [
  {
    id: 'ls_1',
    text: 'I believe in love at first sight and intense physical attraction',
    type: 'likert_scale',
    required: true,
    order: 1,
    dimension: 'eros',
    category: 'passionate',
    options: [
      { id: 'ls_1_1', text: 'Strongly Disagree', value: 1, description: 'I don\'t believe in instant attraction' },
      { id: 'ls_1_2', text: 'Disagree', value: 2, description: 'I rarely experience instant attraction' },
      { id: 'ls_1_3', text: 'Neutral', value: 3, description: 'I sometimes feel instant attraction' },
      { id: 'ls_1_4', text: 'Agree', value: 4, description: 'I often experience instant attraction' },
      { id: 'ls_1_5', text: 'Strongly Agree', value: 5, description: 'I always believe in love at first sight' }
    ]
  },
  {
    id: 'ls_2',
    text: 'I enjoy the playful and fun aspects of dating and relationships',
    type: 'likert_scale',
    required: true,
    order: 2,
    dimension: 'ludus',
    category: 'playful',
    options: [
      { id: 'ls_2_1', text: 'Strongly Disagree', value: 1, description: 'I don\'t find dating fun' },
      { id: 'ls_2_2', text: 'Disagree', value: 2, description: 'I rarely enjoy dating games' },
      { id: 'ls_2_3', text: 'Neutral', value: 3, description: 'I sometimes enjoy playful dating' },
      { id: 'ls_2_4', text: 'Agree', value: 4, description: 'I often enjoy dating games' },
      { id: 'ls_2_5', text: 'Strongly Agree', value: 5, description: 'I always find dating fun and playful' }
    ]
  },
  {
    id: 'ls_3',
    text: 'I prefer relationships that develop slowly from friendship',
    type: 'likert_scale',
    required: true,
    order: 3,
    dimension: 'storge',
    category: 'friendship',
    options: [
      { id: 'ls_3_1', text: 'Strongly Disagree', value: 1, description: 'I don\'t like slow development' },
      { id: 'ls_3_2', text: 'Disagree', value: 2, description: 'I prefer faster relationships' },
      { id: 'ls_3_3', text: 'Neutral', value: 3, description: 'I\'m neutral about pace' },
      { id: 'ls_3_4', text: 'Agree', value: 4, description: 'I prefer gradual development' },
      { id: 'ls_3_5', text: 'Strongly Agree', value: 5, description: 'I always prefer friendship first' }
    ]
  },
  {
    id: 'ls_4',
    text: 'I become very possessive and jealous in relationships',
    type: 'likert_scale',
    required: true,
    order: 4,
    dimension: 'mania',
    category: 'possessive',
    options: [
      { id: 'ls_4_1', text: 'Strongly Disagree', value: 1, description: 'I\'m never possessive' },
      { id: 'ls_4_2', text: 'Disagree', value: 2, description: 'I\'m rarely possessive' },
      { id: 'ls_4_3', text: 'Neutral', value: 3, description: 'I\'m sometimes possessive' },
      { id: 'ls_4_4', text: 'Agree', value: 4, description: 'I\'m often possessive' },
      { id: 'ls_4_5', text: 'Strongly Agree', value: 5, description: 'I\'m always very possessive' }
    ]
  },
  {
    id: 'ls_5',
    text: 'I look for practical compatibility in relationships',
    type: 'likert_scale',
    required: true,
    order: 5,
    dimension: 'pragma',
    category: 'practical',
    options: [
      { id: 'ls_5_1', text: 'Strongly Disagree', value: 1, description: 'I don\'t consider practicality' },
      { id: 'ls_5_2', text: 'Disagree', value: 2, description: 'I rarely consider practicality' },
      { id: 'ls_5_3', text: 'Neutral', value: 3, description: 'I sometimes consider practicality' },
      { id: 'ls_5_4', text: 'Agree', value: 4, description: 'I often consider practicality' },
      { id: 'ls_5_5', text: 'Strongly Agree', value: 5, description: 'I always consider practical compatibility' }
    ]
  },
  {
    id: 'ls_6',
    text: 'I believe in unconditional love and selfless giving',
    type: 'likert_scale',
    required: true,
    order: 6,
    dimension: 'agape',
    category: 'altruistic',
    options: [
      { id: 'ls_6_1', text: 'Strongly Disagree', value: 1, description: 'I don\'t believe in unconditional love' },
      { id: 'ls_6_2', text: 'Disagree', value: 2, description: 'I rarely practice unconditional love' },
      { id: 'ls_6_3', text: 'Neutral', value: 3, description: 'I sometimes practice unconditional love' },
      { id: 'ls_6_4', text: 'Agree', value: 4, description: 'I often practice unconditional love' },
      { id: 'ls_6_5', text: 'Strongly Agree', value: 5, description: 'I always believe in unconditional love' }
    ]
  }
];
