
-- Migration: Optimize Leadership Assessment Test Questions
-- This migration enhances the Leadership Assessment Test by:
-- 1. Adding 5 new professional questions (total: 30 questions)
-- 2. Improving question quality with real leadership scenarios
-- 3. Adding crisis and change management questions
-- 4. Implementing question weighting system

-- Add new Leadership questions for enhanced professional assessment
INSERT OR REPLACE INTO psychology_questions (
  id, category_id, question_text, question_text_en, question_type, dimension, 
  domain, weight, order_index, is_required, is_active
) VALUES
-- New Vision (V) questions - Strategic thinking and future planning
('leadership_026', 'leadership-category', '我能够预见行业趋势并制定相应的战略', 'I can foresee industry trends and develop corresponding strategies', 'likert_scale', 'vision', 'strategic', 2, 26, 1, 1),
('leadership_027', 'leadership-category', '我善于将复杂的概念转化为清晰的行动计划', 'I am good at transforming complex concepts into clear action plans', 'likert_scale', 'vision', 'strategic', 2, 27, 1, 1),

-- New Influence (I) questions - Crisis communication and motivation
('leadership_028', 'leadership-category', '在危机时刻，我能够保持冷静并激励团队', 'During crises, I can remain calm and motivate the team', 'likert_scale', 'influence', 'interpersonal', 2, 28, 1, 1),

-- New Execution (E) questions - Complex project management
('leadership_029', 'leadership-category', '我能够管理多个复杂项目并确保按时交付', 'I can manage multiple complex projects and ensure timely delivery', 'likert_scale', 'execution', 'operational', 2, 29, 1, 1),

-- New Adaptability (A) questions - Change leadership
('leadership_030', 'leadership-category', '我能够引导团队适应重大组织变革', 'I can guide teams through major organizational changes', 'likert_scale', 'adaptability', 'strategic', 2, 30, 1, 1);

-- Add options for new questions
INSERT OR REPLACE INTO psychology_question_options (
  id, question_id, option_text, option_text_en, option_value, option_score, 
  option_description, order_index, is_correct, is_active
) VALUES
-- Options for leadership_026
('leadership_026_1', 'leadership_026', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('leadership_026_2', 'leadership_026', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('leadership_026_3', 'leadership_026', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('leadership_026_4', 'leadership_026', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('leadership_026_5', 'leadership_026', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- Options for leadership_027
('leadership_027_1', 'leadership_027', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('leadership_027_2', 'leadership_027', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('leadership_027_3', 'leadership_027', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('leadership_027_4', 'leadership_027', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('leadership_027_5', 'leadership_027', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- Options for leadership_028
('leadership_028_1', 'leadership_028', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('leadership_028_2', 'leadership_028', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('leadership_028_3', 'leadership_028', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('leadership_028_4', 'leadership_028', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('leadership_028_5', 'leadership_028', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- Options for leadership_029
('leadership_029_1', 'leadership_029', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('leadership_029_2', 'leadership_029', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('leadership_029_3', 'leadership_029', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('leadership_029_4', 'leadership_029', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('leadership_029_5', 'leadership_029', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- Options for leadership_030
('leadership_030_1', 'leadership_030', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('leadership_030_2', 'leadership_030', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('leadership_030_3', 'leadership_030', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('leadership_030_4', 'leadership_030', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('leadership_030_5', 'leadership_030', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1);

-- Update question count for Leadership category
UPDATE psychology_question_categories 
SET question_count = 30
WHERE id = 'leadership-category';

-- Improve existing questions for better quality
UPDATE psychology_questions 
SET question_text = '我能够清晰地表达一个引人注目的未来愿景，并让团队为之兴奋'
WHERE id = 'leadership_001';

UPDATE psychology_questions 
SET question_text = '我善于制定长期战略，并能够将其分解为可执行的短期目标'
WHERE id = 'leadership_002';

UPDATE psychology_questions 
SET question_text = '我能够预见行业趋势和机会，并据此调整团队方向'
WHERE id = 'leadership_003';

-- Add comments for future reference
-- This migration significantly improves Leadership test quality by:
-- 1. Adding 5 new professional questions (total: 30)
-- 2. Implementing question weighting (new questions have weight=2)
-- 3. Adding crisis management and change leadership scenarios
-- 4. Improving question specificity and leadership relevance
