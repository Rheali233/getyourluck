/**
 * Interpersonal Skills Test Questions
 * Four dimensions: social initiative, emotional support, conflict resolution, boundary setting
 * Sample questions for demonstration
 */

import type { InterpersonalQuestion } from '../types';

export const interpersonalQuestions: InterpersonalQuestion[] = [
  {
    id: 'ip_1',
    text: 'I find it easy to start conversations with new people',
    type: 'likert_scale',
    required: true,
    order: 1,
    dimension: 'social_initiative',
    options: [
      { id: 'ip_1_1', text: 'Strongly Disagree', value: 1, description: 'I find it very difficult' },
      { id: 'ip_1_2', text: 'Disagree', value: 2, description: 'I find it somewhat difficult' },
      { id: 'ip_1_3', text: 'Neutral', value: 3, description: 'I find it moderately easy' },
      { id: 'ip_1_4', text: 'Agree', value: 4, description: 'I find it quite easy' },
      { id: 'ip_1_5', text: 'Strongly Agree', value: 5, description: 'I find it very easy' }
    ]
  },
  {
    id: 'ip_2',
    text: 'I actively listen when others share their problems',
    type: 'likert_scale',
    required: true,
    order: 2,
    dimension: 'emotional_support',
    options: [
      { id: 'ip_2_1', text: 'Strongly Disagree', value: 1, description: 'I rarely listen actively' },
      { id: 'ip_2_2', text: 'Disagree', value: 2, description: 'I sometimes listen actively' },
      { id: 'ip_2_3', text: 'Neutral', value: 3, description: 'I occasionally listen actively' },
      { id: 'ip_2_4', text: 'Agree', value: 4, description: 'I often listen actively' },
      { id: 'ip_2_5', text: 'Strongly Agree', value: 5, description: 'I always listen actively' }
    ]
  },
  {
    id: 'ip_3',
    text: 'I can resolve conflicts without getting angry or defensive',
    type: 'likert_scale',
    required: true,
    order: 3,
    dimension: 'conflict_resolution',
    options: [
      { id: 'ip_3_1', text: 'Strongly Disagree', value: 1, description: 'I always get angry in conflicts' },
      { id: 'ip_3_2', text: 'Disagree', value: 2, description: 'I often get angry in conflicts' },
      { id: 'ip_3_3', text: 'Neutral', value: 3, description: 'I sometimes stay calm in conflicts' },
      { id: 'ip_3_4', text: 'Agree', value: 4, description: 'I usually stay calm in conflicts' },
      { id: 'ip_3_5', text: 'Strongly Agree', value: 5, description: 'I always stay calm in conflicts' }
    ]
  },
  {
    id: 'ip_4',
    text: 'I can say "no" to requests that don\'t align with my values',
    type: 'likert_scale',
    required: true,
    order: 4,
    dimension: 'boundary_setting',
    options: [
      { id: 'ip_4_1', text: 'Strongly Disagree', value: 1, description: 'I can never say no' },
      { id: 'ip_4_2', text: 'Disagree', value: 2, description: 'I rarely can say no' },
      { id: 'ip_4_3', text: 'Neutral', value: 3, description: 'I sometimes can say no' },
      { id: 'ip_4_4', text: 'Agree', value: 4, description: 'I usually can say no' },
      { id: 'ip_4_5', text: 'Strongly Agree', value: 5, description: 'I always can say no when needed' }
    ]
  },
  {
    id: 'ip_5',
    text: 'I enjoy attending social events and meeting new people',
    type: 'likert_scale',
    required: true,
    order: 5,
    dimension: 'social_initiative',
    options: [
      { id: 'ip_5_1', text: 'Strongly Disagree', value: 1, description: 'I hate social events' },
      { id: 'ip_5_2', text: 'Disagree', value: 2, description: 'I dislike social events' },
      { id: 'ip_5_3', text: 'Neutral', value: 3, description: 'I\'m neutral about social events' },
      { id: 'ip_5_4', text: 'Agree', value: 4, description: 'I enjoy social events' },
      { id: 'ip_5_5', text: 'Strongly Agree', value: 5, description: 'I love social events' }
    ]
  },
  {
    id: 'ip_6',
    text: 'I offer emotional support to friends when they\'re going through difficult times',
    type: 'likert_scale',
    required: true,
    order: 6,
    dimension: 'emotional_support',
    options: [
      { id: 'ip_6_1', text: 'Strongly Disagree', value: 1, description: 'I never offer support' },
      { id: 'ip_6_2', text: 'Disagree', value: 2, description: 'I rarely offer support' },
      { id: 'ip_6_3', text: 'Neutral', value: 3, description: 'I sometimes offer support' },
      { id: 'ip_6_4', text: 'Agree', value: 4, description: 'I often offer support' },
      { id: 'ip_6_5', text: 'Strongly Agree', value: 5, description: 'I always offer support' }
    ]
  }
];
