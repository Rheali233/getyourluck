/**
 * Love Language Test Questions v4.0
 * Based on Gary Chapman's Five Love Languages theory
 * Professional 30-question assessment with authentic English
 */

import type { LoveLanguageQuestion } from '../types';

export const loveLanguageQuestions: LoveLanguageQuestion[] = [
  // ===== WORDS OF AFFIRMATION (6 questions) =====
  // Positive questions (4)
  {
    id: 'll_1',
    text: 'I feel appreciated when my partner frequently says "thank you" to me',
    type: 'likert_scale',
    required: true,
    order: 1,
    dimension: 'words_of_affirmation',
    category: 'words',
    isReverseScored: false,
    options: [
      { id: 'll_1_1', text: 'Strongly Disagree', value: 1, description: 'This rarely makes me feel appreciated' },
      { id: 'll_1_2', text: 'Disagree', value: 2, description: 'This sometimes makes me feel appreciated' },
      { id: 'll_1_3', text: 'Neutral', value: 3, description: 'This occasionally makes me feel appreciated' },
      { id: 'll_1_4', text: 'Agree', value: 4, description: 'This often makes me feel appreciated' },
      { id: 'll_1_5', text: 'Strongly Agree', value: 5, description: 'This always makes me feel appreciated' }
    ]
  },
  {
    id: 'll_2',
    text: 'Receiving encouraging text messages from my partner improves my mood',
    type: 'likert_scale',
    required: true,
    order: 2,
    dimension: 'words_of_affirmation',
    category: 'words',
    isReverseScored: false,
    options: [
      { id: 'll_2_1', text: 'Strongly Disagree', value: 1, description: 'This rarely improves my mood' },
      { id: 'll_2_2', text: 'Disagree', value: 2, description: 'This sometimes improves my mood' },
      { id: 'll_2_3', text: 'Neutral', value: 3, description: 'This occasionally improves my mood' },
      { id: 'll_2_4', text: 'Agree', value: 4, description: 'This often improves my mood' },
      { id: 'll_2_5', text: 'Strongly Agree', value: 5, description: 'This always improves my mood' }
    ]
  },
  {
    id: 'll_3',
    text: 'I feel valued when my partner compliments me in front of others',
    type: 'likert_scale',
    required: true,
    order: 3,
    dimension: 'words_of_affirmation',
    category: 'words',
    isReverseScored: false,
    options: [
      { id: 'll_3_1', text: 'Strongly Disagree', value: 1, description: 'This rarely makes me feel valued' },
      { id: 'll_3_2', text: 'Disagree', value: 2, description: 'This sometimes makes me feel valued' },
      { id: 'll_3_3', text: 'Neutral', value: 3, description: 'This occasionally makes me feel valued' },
      { id: 'll_3_4', text: 'Agree', value: 4, description: 'This often makes me feel valued' },
      { id: 'll_3_5', text: 'Strongly Agree', value: 5, description: 'This always makes me feel valued' }
    ]
  },
  {
    id: 'll_4',
    text: 'I am deeply moved when my partner tells me "I love you"',
    type: 'likert_scale',
    required: true,
    order: 4,
    dimension: 'words_of_affirmation',
    category: 'words',
    isReverseScored: false,
    options: [
      { id: 'll_4_1', text: 'Strongly Disagree', value: 1, description: 'This rarely moves me' },
      { id: 'll_4_2', text: 'Disagree', value: 2, description: 'This sometimes moves me' },
      { id: 'll_4_3', text: 'Neutral', value: 3, description: 'This occasionally moves me' },
      { id: 'll_4_4', text: 'Agree', value: 4, description: 'This often moves me' },
      { id: 'll_4_5', text: 'Strongly Agree', value: 5, description: 'This always deeply moves me' }
    ]
  },
  // Neutral question (1) - not scored in dimension average
  {
    id: 'll_5',
    text: 'My reaction to my partner\'s verbal expressions is not particularly strong',
    type: 'likert_scale',
    required: true,
    order: 5,
    dimension: 'words_of_affirmation',
    category: 'words',
    isReverseScored: false,
    isNeutral: true,
    options: [
      { id: 'll_5_1', text: 'Strongly Disagree', value: 1, description: 'I strongly react to verbal expressions' },
      { id: 'll_5_2', text: 'Disagree', value: 2, description: 'I often react to verbal expressions' },
      { id: 'll_5_3', text: 'Neutral', value: 3, description: 'My reaction is moderate' },
      { id: 'll_5_4', text: 'Agree', value: 4, description: 'I rarely react strongly to verbal expressions' },
      { id: 'll_5_5', text: 'Strongly Agree', value: 5, description: 'I have minimal reaction to verbal expressions' }
    ]
  },
  // Reverse question (1)
  {
    id: 'll_6',
    text: 'I don\'t feel particularly touched even when my partner compliments me',
    type: 'likert_scale',
    required: true,
    order: 6,
    dimension: 'words_of_affirmation',
    category: 'words',
    isReverseScored: true,
    options: [
      { id: 'll_6_1', text: 'Strongly Disagree', value: 1, description: 'I am very touched by compliments' },
      { id: 'll_6_2', text: 'Disagree', value: 2, description: 'I am often touched by compliments' },
      { id: 'll_6_3', text: 'Neutral', value: 3, description: 'I am sometimes touched by compliments' },
      { id: 'll_6_4', text: 'Agree', value: 4, description: 'I am rarely touched by compliments' },
      { id: 'll_6_5', text: 'Strongly Agree', value: 5, description: 'I am never touched by compliments' }
    ]
  },

  // ===== QUALITY TIME (6 questions) =====
  // Positive questions (4)
  {
    id: 'll_7',
    text: 'I enjoy sharing everyday activities with my partner, like cooking or watching movies together',
    type: 'likert_scale',
    required: true,
    order: 7,
    dimension: 'quality_time',
    category: 'time',
    isReverseScored: false,
    options: [
      { id: 'll_7_1', text: 'Strongly Disagree', value: 1, description: 'I rarely enjoy these activities' },
      { id: 'll_7_2', text: 'Disagree', value: 2, description: 'I sometimes enjoy these activities' },
      { id: 'll_7_3', text: 'Neutral', value: 3, description: 'I occasionally enjoy these activities' },
      { id: 'll_7_4', text: 'Agree', value: 4, description: 'I often enjoy these activities' },
      { id: 'll_7_5', text: 'Strongly Agree', value: 5, description: 'I always enjoy these activities' }
    ]
  },
  {
    id: 'll_8',
    text: 'I feel very happy when my partner and I travel or take walks together',
    type: 'likert_scale',
    required: true,
    order: 8,
    dimension: 'quality_time',
    category: 'time',
    isReverseScored: false,
    options: [
      { id: 'll_8_1', text: 'Strongly Disagree', value: 1, description: 'This rarely makes me happy' },
      { id: 'll_8_2', text: 'Disagree', value: 2, description: 'This sometimes makes me happy' },
      { id: 'll_8_3', text: 'Neutral', value: 3, description: 'This occasionally makes me happy' },
      { id: 'll_8_4', text: 'Agree', value: 4, description: 'This often makes me happy' },
      { id: 'll_8_5', text: 'Strongly Agree', value: 5, description: 'This always makes me very happy' }
    ]
  },
  {
    id: 'll_9',
    text: 'I feel valued when my partner takes the initiative to plan dates',
    type: 'likert_scale',
    required: true,
    order: 9,
    dimension: 'quality_time',
    category: 'time',
    isReverseScored: false,
    options: [
      { id: 'll_9_1', text: 'Strongly Disagree', value: 1, description: 'This rarely makes me feel valued' },
      { id: 'll_9_2', text: 'Disagree', value: 2, description: 'This sometimes makes me feel valued' },
      { id: 'll_9_3', text: 'Neutral', value: 3, description: 'This occasionally makes me feel valued' },
      { id: 'll_9_4', text: 'Agree', value: 4, description: 'This often makes me feel valued' },
      { id: 'll_9_5', text: 'Strongly Agree', value: 5, description: 'This always makes me feel valued' }
    ]
  },
  {
    id: 'll_10',
    text: 'I feel very happy when my partner puts down their phone to focus on spending time with me',
    type: 'likert_scale',
    required: true,
    order: 10,
    dimension: 'quality_time',
    category: 'time',
    isReverseScored: false,
    options: [
      { id: 'll_10_1', text: 'Strongly Disagree', value: 1, description: 'This rarely makes me happy' },
      { id: 'll_10_2', text: 'Disagree', value: 2, description: 'This sometimes makes me happy' },
      { id: 'll_10_3', text: 'Neutral', value: 3, description: 'This occasionally makes me happy' },
      { id: 'll_10_4', text: 'Agree', value: 4, description: 'This often makes me happy' },
      { id: 'll_10_5', text: 'Strongly Agree', value: 5, description: 'This always makes me very happy' }
    ]
  },
  // Neutral question (1) - not scored in dimension average
  {
    id: 'll_11',
    text: 'My partner\'s time spent with me is not essential to me',
    type: 'likert_scale',
    required: true,
    order: 11,
    dimension: 'quality_time',
    category: 'time',
    isReverseScored: false,
    isNeutral: true,
    options: [
      { id: 'll_11_1', text: 'Strongly Disagree', value: 1, description: 'Their time is very essential' },
      { id: 'll_11_2', text: 'Disagree', value: 2, description: 'Their time is often essential' },
      { id: 'll_11_3', text: 'Neutral', value: 3, description: 'Their time is somewhat essential' },
      { id: 'll_11_4', text: 'Agree', value: 4, description: 'Their time is rarely essential' },
      { id: 'll_11_5', text: 'Strongly Agree', value: 5, description: 'Their time is never essential' }
    ]
  },
  // Reverse question (1)
  {
    id: 'll_12',
    text: 'Just being together is enough; I don\'t need special time spent together',
    type: 'likert_scale',
    required: true,
    order: 12,
    dimension: 'quality_time',
    category: 'time',
    isReverseScored: true,
    options: [
      { id: 'll_12_1', text: 'Strongly Disagree', value: 1, description: 'I need special time together' },
      { id: 'll_12_2', text: 'Disagree', value: 2, description: 'I often need special time together' },
      { id: 'll_12_3', text: 'Neutral', value: 3, description: 'I sometimes need special time together' },
      { id: 'll_12_4', text: 'Agree', value: 4, description: 'I rarely need special time together' },
      { id: 'll_12_5', text: 'Strongly Agree', value: 5, description: 'I never need special time together' }
    ]
  },

  // ===== RECEIVING GIFTS (6 questions) =====
  // Positive questions (4)
  {
    id: 'll_13',
    text: 'I feel warm when my partner brings back small souvenirs for me',
    type: 'likert_scale',
    required: true,
    order: 13,
    dimension: 'receiving_gifts',
    category: 'gifts',
    isReverseScored: false,
    options: [
      { id: 'll_13_1', text: 'Strongly Disagree', value: 1, description: 'This rarely makes me feel warm' },
      { id: 'll_13_2', text: 'Disagree', value: 2, description: 'This sometimes makes me feel warm' },
      { id: 'll_13_3', text: 'Neutral', value: 3, description: 'This occasionally makes me feel warm' },
      { id: 'll_13_4', text: 'Agree', value: 4, description: 'This often makes me feel warm' },
      { id: 'll_13_5', text: 'Strongly Agree', value: 5, description: 'This always makes me feel warm' }
    ]
  },
  {
    id: 'll_14',
    text: 'I find custom gifts or digital gifts from my partner particularly meaningful',
    type: 'likert_scale',
    required: true,
    order: 14,
    dimension: 'receiving_gifts',
    category: 'gifts',
    isReverseScored: false,
    options: [
      { id: 'll_14_1', text: 'Strongly Disagree', value: 1, description: 'These gifts rarely mean much to me' },
      { id: 'll_14_2', text: 'Disagree', value: 2, description: 'These gifts sometimes mean something to me' },
      { id: 'll_14_3', text: 'Neutral', value: 3, description: 'These gifts occasionally mean something to me' },
      { id: 'll_14_4', text: 'Agree', value: 4, description: 'These gifts often mean something to me' },
      { id: 'll_14_5', text: 'Strongly Agree', value: 5, description: 'These gifts always mean a lot to me' }
    ]
  },
  {
    id: 'll_15',
    text: 'I am touched when my partner remembers my birthday and gives me a gift',
    type: 'likert_scale',
    required: true,
    order: 15,
    dimension: 'receiving_gifts',
    category: 'gifts',
    isReverseScored: false,
    options: [
      { id: 'll_15_1', text: 'Strongly Disagree', value: 1, description: 'This rarely touches me' },
      { id: 'll_15_2', text: 'Disagree', value: 2, description: 'This sometimes touches me' },
      { id: 'll_15_3', text: 'Neutral', value: 3, description: 'This occasionally touches me' },
      { id: 'll_15_4', text: 'Agree', value: 4, description: 'This often touches me' },
      { id: 'll_15_5', text: 'Strongly Agree', value: 5, description: 'This always touches me' }
    ]
  },
  {
    id: 'll_16',
    text: 'I feel cared for when my partner gives me thoughtfully chosen gifts',
    type: 'likert_scale',
    required: true,
    order: 16,
    dimension: 'receiving_gifts',
    category: 'gifts',
    isReverseScored: false,
    options: [
      { id: 'll_16_1', text: 'Strongly Disagree', value: 1, description: 'This rarely makes me feel cared for' },
      { id: 'll_16_2', text: 'Disagree', value: 2, description: 'This sometimes makes me feel cared for' },
      { id: 'll_16_3', text: 'Neutral', value: 3, description: 'This occasionally makes me feel cared for' },
      { id: 'll_16_4', text: 'Agree', value: 4, description: 'This often makes me feel cared for' },
      { id: 'll_16_5', text: 'Strongly Agree', value: 5, description: 'This always makes me feel cared for' }
    ]
  },
  // Neutral question (1) - not scored in dimension average
  {
    id: 'll_17',
    text: 'I value other forms of expression more than receiving gifts',
    type: 'likert_scale',
    required: true,
    order: 17,
    dimension: 'receiving_gifts',
    category: 'gifts',
    isReverseScored: false,
    isNeutral: true,
    options: [
      { id: 'll_17_1', text: 'Strongly Disagree', value: 1, description: 'I value gifts more than other forms' },
      { id: 'll_17_2', text: 'Disagree', value: 2, description: 'I often value gifts more than other forms' },
      { id: 'll_17_3', text: 'Neutral', value: 3, description: 'I sometimes value gifts more than other forms' },
      { id: 'll_17_4', text: 'Agree', value: 4, description: 'I rarely value gifts more than other forms' },
      { id: 'll_17_5', text: 'Strongly Agree', value: 5, description: 'I never value gifts more than other forms' }
    ]
  },
  // Reverse question (1)
  {
    id: 'll_18',
    text: 'Gifts are not important to me; I don\'t mind if my partner never gives me anything',
    type: 'likert_scale',
    required: true,
    order: 18,
    dimension: 'receiving_gifts',
    category: 'gifts',
    isReverseScored: true,
    options: [
      { id: 'll_18_1', text: 'Strongly Disagree', value: 1, description: 'Gifts are very important to me' },
      { id: 'll_18_2', text: 'Disagree', value: 2, description: 'Gifts are often important to me' },
      { id: 'll_18_3', text: 'Neutral', value: 3, description: 'Gifts are sometimes important to me' },
      { id: 'll_18_4', text: 'Agree', value: 4, description: 'Gifts are rarely important to me' },
      { id: 'll_18_5', text: 'Strongly Agree', value: 5, description: 'Gifts are never important to me' }
    ]
  },

  // ===== ACTS OF SERVICE (6 questions) =====
  // Positive questions (4)
  {
    id: 'll_19',
    text: 'I feel warm when my partner prepares a meal for me',
    type: 'likert_scale',
    required: true,
    order: 19,
    dimension: 'acts_of_service',
    category: 'service',
    isReverseScored: false,
    options: [
      { id: 'll_19_1', text: 'Strongly Disagree', value: 1, description: 'This rarely makes me feel warm' },
      { id: 'll_19_2', text: 'Disagree', value: 2, description: 'This sometimes makes me feel warm' },
      { id: 'll_19_3', text: 'Neutral', value: 3, description: 'This occasionally makes me feel warm' },
      { id: 'll_19_4', text: 'Agree', value: 4, description: 'This often makes me feel warm' },
      { id: 'll_19_5', text: 'Strongly Agree', value: 5, description: 'This always makes me feel warm' }
    ]
  },
  {
    id: 'll_20',
    text: 'I feel touched when my partner takes the initiative to help with household chores',
    type: 'likert_scale',
    required: true,
    order: 20,
    dimension: 'acts_of_service',
    category: 'service',
    isReverseScored: false,
    options: [
      { id: 'll_20_1', text: 'Strongly Disagree', value: 1, description: 'This rarely touches me' },
      { id: 'll_20_2', text: 'Disagree', value: 2, description: 'This sometimes touches me' },
      { id: 'll_20_3', text: 'Neutral', value: 3, description: 'This occasionally touches me' },
      { id: 'll_20_4', text: 'Agree', value: 4, description: 'This often touches me' },
      { id: 'll_20_5', text: 'Strongly Agree', value: 5, description: 'This always touches me' }
    ]
  },
  {
    id: 'll_21',
    text: 'I feel loved when my partner helps me solve problems when I need it',
    type: 'likert_scale',
    required: true,
    order: 21,
    dimension: 'acts_of_service',
    category: 'service',
    isReverseScored: false,
    options: [
      { id: 'll_21_1', text: 'Strongly Disagree', value: 1, description: 'This rarely makes me feel loved' },
      { id: 'll_21_2', text: 'Disagree', value: 2, description: 'This sometimes makes me feel loved' },
      { id: 'll_21_3', text: 'Neutral', value: 3, description: 'This occasionally makes me feel loved' },
      { id: 'll_21_4', text: 'Agree', value: 4, description: 'This often makes me feel loved' },
      { id: 'll_21_5', text: 'Strongly Agree', value: 5, description: 'This always makes me feel loved' }
    ]
  },
  {
    id: 'll_22',
    text: 'I feel more secure when my partner takes care of me when I\'m sick',
    type: 'likert_scale',
    required: true,
    order: 22,
    dimension: 'acts_of_service',
    category: 'service',
    isReverseScored: false,
    options: [
      { id: 'll_22_1', text: 'Strongly Disagree', value: 1, description: 'This rarely makes me feel secure' },
      { id: 'll_22_2', text: 'Disagree', value: 2, description: 'This sometimes makes me feel secure' },
      { id: 'll_22_3', text: 'Neutral', value: 3, description: 'This occasionally makes me feel secure' },
      { id: 'll_22_4', text: 'Agree', value: 4, description: 'This often makes me feel secure' },
      { id: 'll_22_5', text: 'Strongly Agree', value: 5, description: 'This always makes me feel more secure' }
    ]
  },
  // Neutral question (1) - not scored in dimension average
  {
    id: 'll_23',
    text: 'Whether my partner helps me with things doesn\'t significantly affect how loved I feel',
    type: 'likert_scale',
    required: true,
    order: 23,
    dimension: 'acts_of_service',
    category: 'service',
    isReverseScored: false,
    isNeutral: true,
    options: [
      { id: 'll_23_1', text: 'Strongly Disagree', value: 1, description: 'It significantly affects how loved I feel' },
      { id: 'll_23_2', text: 'Disagree', value: 2, description: 'It often affects how loved I feel' },
      { id: 'll_23_3', text: 'Neutral', value: 3, description: 'It sometimes affects how loved I feel' },
      { id: 'll_23_4', text: 'Agree', value: 4, description: 'It rarely affects how loved I feel' },
      { id: 'll_23_5', text: 'Strongly Agree', value: 5, description: 'It never affects how loved I feel' }
    ]
  },
  // Reverse question (1)
  {
    id: 'll_24',
    text: 'I don\'t mind if my partner never does extra things for me',
    type: 'likert_scale',
    required: true,
    order: 24,
    dimension: 'acts_of_service',
    category: 'service',
    isReverseScored: true,
    options: [
      { id: 'll_24_1', text: 'Strongly Disagree', value: 1, description: 'I really mind if they never do extra things' },
      { id: 'll_24_2', text: 'Disagree', value: 2, description: 'I often mind if they never do extra things' },
      { id: 'll_24_3', text: 'Neutral', value: 3, description: 'I sometimes mind if they never do extra things' },
      { id: 'll_24_4', text: 'Agree', value: 4, description: 'I rarely mind if they never do extra things' },
      { id: 'll_24_5', text: 'Strongly Agree', value: 5, description: 'I never mind if they never do extra things' }
    ]
  },

  // ===== PHYSICAL TOUCH (6 questions) =====
  // Positive questions (4)
  {
    id: 'll_25',
    text: 'I feel sweet when my partner holds my hand',
    type: 'likert_scale',
    required: true,
    order: 25,
    dimension: 'physical_touch',
    category: 'touch',
    isReverseScored: false,
    options: [
      { id: 'll_25_1', text: 'Strongly Disagree', value: 1, description: 'This rarely makes me feel sweet' },
      { id: 'll_25_2', text: 'Disagree', value: 2, description: 'This sometimes makes me feel sweet' },
      { id: 'll_25_3', text: 'Neutral', value: 3, description: 'This occasionally makes me feel sweet' },
      { id: 'll_25_4', text: 'Agree', value: 4, description: 'This often makes me feel sweet' },
      { id: 'll_25_5', text: 'Strongly Agree', value: 5, description: 'This always makes me feel sweet' }
    ]
  },
  {
    id: 'll_26',
    text: 'I feel cozy when my partner and I snuggle together',
    type: 'likert_scale',
    required: true,
    order: 26,
    dimension: 'physical_touch',
    category: 'touch',
    isReverseScored: false,
    options: [
      { id: 'll_26_1', text: 'Strongly Disagree', value: 1, description: 'This rarely makes me feel cozy' },
      { id: 'll_26_2', text: 'Disagree', value: 2, description: 'This sometimes makes me feel cozy' },
      { id: 'll_26_3', text: 'Neutral', value: 3, description: 'This occasionally makes me feel cozy' },
      { id: 'll_26_4', text: 'Agree', value: 4, description: 'This often makes me feel cozy' },
      { id: 'll_26_5', text: 'Strongly Agree', value: 5, description: 'This always makes me feel cozy' }
    ]
  },
  {
    id: 'll_27',
    text: 'I feel pleasure when my partner kisses me',
    type: 'likert_scale',
    required: true,
    order: 27,
    dimension: 'physical_touch',
    category: 'touch',
    isReverseScored: false,
    options: [
      { id: 'll_27_1', text: 'Strongly Disagree', value: 1, description: 'This rarely gives me pleasure' },
      { id: 'll_27_2', text: 'Disagree', value: 2, description: 'This sometimes gives me pleasure' },
      { id: 'll_27_3', text: 'Neutral', value: 3, description: 'This occasionally gives me pleasure' },
      { id: 'll_27_4', text: 'Agree', value: 4, description: 'This often gives me pleasure' },
      { id: 'll_27_5', text: 'Strongly Agree', value: 5, description: 'This always gives me pleasure' }
    ]
  },
  {
    id: 'll_28',
    text: 'I feel warm and secure when my partner hugs me',
    type: 'likert_scale',
    required: true,
    order: 28,
    dimension: 'physical_touch',
    category: 'touch',
    isReverseScored: false,
    options: [
      { id: 'll_28_1', text: 'Strongly Disagree', value: 1, description: 'This rarely makes me feel warm and secure' },
      { id: 'll_28_2', text: 'Disagree', value: 2, description: 'This sometimes makes me feel warm and secure' },
      { id: 'll_28_3', text: 'Neutral', value: 3, description: 'This occasionally makes me feel warm and secure' },
      { id: 'll_28_4', text: 'Agree', value: 4, description: 'This often makes me feel warm and secure' },
      { id: 'll_28_5', text: 'Strongly Agree', value: 5, description: 'This always makes me feel warm and secure' }
    ]
  },
  // Neutral question (1) - not scored in dimension average
  {
    id: 'll_29',
    text: 'Physical touch is not the most important way for me to express love',
    type: 'likert_scale',
    required: true,
    order: 29,
    dimension: 'physical_touch',
    category: 'touch',
    isReverseScored: false,
    isNeutral: true,
    options: [
      { id: 'll_29_1', text: 'Strongly Disagree', value: 1, description: 'Physical touch is the most important' },
      { id: 'll_29_2', text: 'Disagree', value: 2, description: 'Physical touch is often the most important' },
      { id: 'll_29_3', text: 'Neutral', value: 3, description: 'Physical touch is sometimes the most important' },
      { id: 'll_29_4', text: 'Agree', value: 4, description: 'Physical touch is rarely the most important' },
      { id: 'll_29_5', text: 'Strongly Agree', value: 5, description: 'Physical touch is never the most important' }
    ]
  },
  // Reverse question (1)
  {
    id: 'll_30',
    text: 'I don\'t feel a lack of love even if my partner rarely has physical contact with me',
    type: 'likert_scale',
    required: true,
    order: 30,
    dimension: 'physical_touch',
    category: 'touch',
    isReverseScored: true,
    options: [
      { id: 'll_30_1', text: 'Strongly Disagree', value: 1, description: 'I feel a lack of love without physical contact' },
      { id: 'll_30_2', text: 'Disagree', value: 2, description: 'I often feel a lack of love without physical contact' },
      { id: 'll_30_3', text: 'Neutral', value: 3, description: 'I sometimes feel a lack of love without physical contact' },
      { id: 'll_30_4', text: 'Agree', value: 4, description: 'I rarely feel a lack of love without physical contact' },
      { id: 'll_30_5', text: 'Strongly Agree', value: 5, description: 'I never feel a lack of love without physical contact' }
    ]
  }
];
