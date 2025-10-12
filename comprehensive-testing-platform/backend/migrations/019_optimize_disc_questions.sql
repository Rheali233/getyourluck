-- Migration: Optimize DISC Behavioral Style Test Questions

-- This migration optimizes the DISC Behavioral Style Test by:
-- 1. Adding 10 new professional questions (total: 30 questions)
-- 2. Improving question quality with situational scenarios
-- 3. Adding pressure and conflict handling questions
-- 4. Implementing question weighting system

-- Add new DISC questions for enhanced professional assessment
INSERT OR REPLACE INTO psychology_questions (
  id, category_id, question_text, question_text_en, question_type, dimension, 
  domain, weight, order_index, is_required, is_active
) VALUES
-- New Dominance (D) questions - Situational and Pressure scenarios
('disc_021', 'disc-category', '在项目截止日期临近时，我会立即采取行动解决问题', 'When project deadlines are approaching, I immediately take action to resolve issues', 'likert_scale', 'dominance', 'behavioral', 2, 21, 1, 1),
('disc_022', 'disc-category', '在团队会议中，我会主动引导讨论方向', 'In team meetings, I actively guide the direction of discussions', 'likert_scale', 'dominance', 'behavioral', 2, 22, 1, 1),
('disc_023', 'disc-category', '面对障碍时，我倾向于直接面对而非回避', 'When facing obstacles, I prefer direct confrontation over avoidance', 'likert_scale', 'dominance', 'behavioral', 2, 23, 1, 1),

-- New Influence (I) questions - Team conflict and motivation scenarios
('disc_024', 'disc-category', '当团队士气低落时，我会寻找积极方面来激励大家', 'When team morale is low, I find positive aspects to motivate everyone', 'likert_scale', 'influence', 'behavioral', 2, 24, 1, 1),
('disc_025', 'disc-category', '在冲突情况下，我会尝试找到各方共同点', 'In conflict situations, I try to find common ground between parties', 'likert_scale', 'influence', 'behavioral', 2, 25, 1, 1),
('disc_026', 'disc-category', '在演示时，我会根据听众调整我的风格', 'During presentations, I adapt my style to engage the audience', 'likert_scale', 'influence', 'behavioral', 2, 26, 1, 1),

-- New Steadiness (S) questions - Stability and support scenarios
('disc_027', 'disc-category', '在变化时期，我会为团队提供稳定性', 'During periods of change, I provide stability for the team', 'likert_scale', 'steadiness', 'behavioral', 2, 27, 1, 1),
('disc_028', 'disc-category', '当同事遇到困难时，我会耐心倾听并提供支持', 'When colleagues face difficulties, I patiently listen and provide support', 'likert_scale', 'steadiness', 'behavioral', 2, 28, 1, 1),

-- New Conscientiousness (C) questions - Quality and analysis scenarios
('disc_029', 'disc-category', '在做出重要决定前，我会仔细分析所有选项', 'Before making important decisions, I carefully analyze all options', 'likert_scale', 'conscientiousness', 'behavioral', 2, 29, 1, 1),
('disc_030', 'disc-category', '我会建立系统化的流程来确保工作质量', 'I establish systematic processes to ensure work quality', 'likert_scale', 'conscientiousness', 'behavioral', 2, 30, 1, 1);

-- Add options for new questions
INSERT OR REPLACE INTO psychology_question_options (
  id, question_id, option_text, option_text_en, option_value, option_score, 
  option_description, order_index, is_correct, is_active
) VALUES
-- Options for disc_021
('disc_021_1', 'disc_021', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('disc_021_2', 'disc_021', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('disc_021_3', 'disc_021', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('disc_021_4', 'disc_021', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('disc_021_5', 'disc_021', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- Options for disc_022
('disc_022_1', 'disc_022', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('disc_022_2', 'disc_022', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('disc_022_3', 'disc_022', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('disc_022_4', 'disc_022', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('disc_022_5', 'disc_022', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- Options for disc_023
('disc_023_1', 'disc_023', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('disc_023_2', 'disc_023', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('disc_023_3', 'disc_023', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('disc_023_4', 'disc_023', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('disc_023_5', 'disc_023', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- Options for disc_024
('disc_024_1', 'disc_024', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('disc_024_2', 'disc_024', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('disc_024_3', 'disc_024', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('disc_024_4', 'disc_024', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('disc_024_5', 'disc_024', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- Options for disc_025
('disc_025_1', 'disc_025', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('disc_025_2', 'disc_025', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('disc_025_3', 'disc_025', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('disc_025_4', 'disc_025', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('disc_025_5', 'disc_025', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- Options for disc_026
('disc_026_1', 'disc_026', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('disc_026_2', 'disc_026', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('disc_026_3', 'disc_026', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('disc_026_4', 'disc_026', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('disc_026_5', 'disc_026', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- Options for disc_027
('disc_027_1', 'disc_027', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('disc_027_2', 'disc_027', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('disc_027_3', 'disc_027', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('disc_027_4', 'disc_027', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('disc_027_5', 'disc_027', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- Options for disc_028
('disc_028_1', 'disc_028', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('disc_028_2', 'disc_028', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('disc_028_3', 'disc_028', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('disc_028_4', 'disc_028', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('disc_028_5', 'disc_028', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- Options for disc_029
('disc_029_1', 'disc_029', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('disc_029_2', 'disc_029', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('disc_029_3', 'disc_029', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('disc_029_4', 'disc_029', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('disc_029_5', 'disc_029', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- Options for disc_030
('disc_030_1', 'disc_030', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('disc_030_2', 'disc_030', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('disc_030_3', 'disc_030', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('disc_030_4', 'disc_030', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('disc_030_5', 'disc_030', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1);

-- Update question count for DISC category
UPDATE psychology_question_categories 
SET question_count = 30
WHERE id = 'disc-category';

-- Update existing questions to improve quality (optional improvements)
UPDATE psychology_questions 
SET question_text = '我倾向于直接且直率地沟通，特别是在重要事项上'
WHERE id = 'disc_001';

UPDATE psychology_questions 
SET question_text = '我善于快速做出决定，特别是在时间紧迫的情况下'
WHERE id = 'disc_002';

UPDATE psychology_questions 
SET question_text = '我专注于结果和成就，会设定明确的目标并努力实现'
WHERE id = 'disc_003';

-- Add comments for future reference
-- This migration significantly improves DISC test quality by:
-- 1. Adding 10 new professional questions (total: 30)
-- 2. Implementing question weighting (new questions have weight=2)
-- 3. Adding situational and pressure scenarios
-- 4. Improving question specificity and workplace relevance
