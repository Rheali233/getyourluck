-- Fix Career Questions for Production Database
-- 修复生产环境中的career题目数据，使用正确的category_id

-- 插入Holland测试题目 (使用cat_holland作为category_id)
INSERT OR REPLACE INTO psychology_questions (
  id, category_id, question_text, question_text_en, question_type, dimension, 
  domain, weight, order_index, is_required, is_active
) VALUES
-- Realistic (R) 现实型
('holland_001', 'cat_holland', 'I enjoy working with tools and machines', 'I enjoy working with tools and machines', 'likert_scale', 'realistic', 'realistic', 1, 1, 1, 1),
('holland_002', 'cat_holland', 'I like to repair and assemble things', 'I like to repair and assemble things', 'likert_scale', 'realistic', 'realistic', 1, 2, 1, 1),
('holland_003', 'cat_holland', 'I am good at solving technical problems', 'I am good at solving technical problems', 'likert_scale', 'realistic', 'realistic', 1, 3, 1, 1),
('holland_004', 'cat_holland', 'I enjoy outdoor activities', 'I enjoy outdoor activities', 'likert_scale', 'realistic', 'realistic', 1, 4, 1, 1),
('holland_005', 'cat_holland', 'I am skilled at operating mechanical equipment', 'I am skilled at operating mechanical equipment', 'likert_scale', 'realistic', 'realistic', 1, 5, 1, 1),

-- Investigative (I) 研究型
('holland_006', 'cat_holland', 'I like to solve complex mathematical problems', 'I like to solve complex mathematical problems', 'likert_scale', 'investigative', 'investigative', 1, 6, 1, 1),
('holland_007', 'cat_holland', 'I enjoy scientific research', 'I enjoy scientific research', 'likert_scale', 'investigative', 'investigative', 1, 7, 1, 1),
('holland_008', 'cat_holland', 'I like to analyze data', 'I like to analyze data', 'likert_scale', 'investigative', 'investigative', 1, 8, 1, 1),
('holland_009', 'cat_holland', 'I am good at logical reasoning', 'I am good at logical reasoning', 'likert_scale', 'investigative', 'investigative', 1, 9, 1, 1),
('holland_010', 'cat_holland', 'I like to explore new knowledge', 'I like to explore new knowledge', 'likert_scale', 'investigative', 'investigative', 1, 10, 1, 1),

-- Artistic (A) 艺术型
('holland_011', 'cat_holland', 'I enjoy creating art or music', 'I enjoy creating art or music', 'likert_scale', 'artistic', 'artistic', 1, 11, 1, 1),
('holland_012', 'cat_holland', 'I like to design creative works', 'I like to design creative works', 'likert_scale', 'artistic', 'artistic', 1, 12, 1, 1),
('holland_013', 'cat_holland', 'I am good at expressing emotions', 'I am good at expressing emotions', 'likert_scale', 'artistic', 'artistic', 1, 13, 1, 1),
('holland_014', 'cat_holland', 'I like to innovate and experiment', 'I like to innovate and experiment', 'likert_scale', 'artistic', 'artistic', 1, 14, 1, 1),
('holland_015', 'cat_holland', 'I enjoy performing and presenting', 'I enjoy performing and presenting', 'likert_scale', 'artistic', 'artistic', 1, 15, 1, 1),

-- Social (S) 社会型
('holland_016', 'cat_holland', 'I like helping people with their problems', 'I like helping people with their problems', 'likert_scale', 'social', 'social', 1, 16, 1, 1),
('holland_017', 'cat_holland', 'I am good at teaching others', 'I am good at teaching others', 'likert_scale', 'social', 'social', 1, 17, 1, 1),
('holland_018', 'cat_holland', 'I enjoy working in teams', 'I enjoy working in teams', 'likert_scale', 'social', 'social', 1, 18, 1, 1),
('holland_019', 'cat_holland', 'I am good at listening to others', 'I am good at listening to others', 'likert_scale', 'social', 'social', 1, 19, 1, 1),
('holland_020', 'cat_holland', 'I like taking care of others', 'I like taking care of others', 'likert_scale', 'social', 'social', 1, 20, 1, 1),

-- Enterprising (E) 企业型
('holland_021', 'cat_holland', 'I enjoy persuading others to see my point of view', 'I enjoy persuading others to see my point of view', 'likert_scale', 'enterprising', 'enterprising', 1, 21, 1, 1),
('holland_022', 'cat_holland', 'I like leading teams', 'I like leading teams', 'likert_scale', 'enterprising', 'enterprising', 1, 22, 1, 1),
('holland_023', 'cat_holland', 'I am good at selling and promoting', 'I am good at selling and promoting', 'likert_scale', 'enterprising', 'enterprising', 1, 23, 1, 1),
('holland_024', 'cat_holland', 'I like taking risks and challenges', 'I like taking risks and challenges', 'likert_scale', 'enterprising', 'enterprising', 1, 24, 1, 1),
('holland_025', 'cat_holland', 'I am good at making plans', 'I am good at making plans', 'likert_scale', 'enterprising', 'enterprising', 1, 25, 1, 1),

-- Conventional (C) 常规型
('holland_026', 'cat_holland', 'I prefer to follow set procedures', 'I prefer to follow set procedures', 'likert_scale', 'conventional', 'conventional', 1, 26, 1, 1),
('holland_027', 'cat_holland', 'I am good at organizing and categorizing', 'I am good at organizing and categorizing', 'likert_scale', 'conventional', 'conventional', 1, 27, 1, 1),
('holland_028', 'cat_holland', 'I like working with numbers and documents', 'I like working with numbers and documents', 'likert_scale', 'conventional', 'conventional', 1, 28, 1, 1),
('holland_029', 'cat_holland', 'I pay attention to details and accuracy', 'I pay attention to details and accuracy', 'likert_scale', 'conventional', 'conventional', 1, 29, 1, 1),
('holland_030', 'cat_holland', 'I prefer an orderly work environment', 'I prefer an orderly work environment', 'likert_scale', 'conventional', 'conventional', 1, 30, 1, 1);

-- 插入Holland测试题目选项
INSERT OR REPLACE INTO psychology_question_options (
  id, question_id, option_text, option_text_en, option_value, option_score, 
  option_description, order_index, is_correct, is_active
) VALUES
-- Holland题目选项 (每个题目5个选项)
('holland_001_1', 'holland_001', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_001_2', 'holland_001', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_001_3', 'holland_001', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_001_4', 'holland_001', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_001_5', 'holland_001', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

('holland_002_1', 'holland_002', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_002_2', 'holland_002', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_002_3', 'holland_002', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_002_4', 'holland_002', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_002_5', 'holland_002', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

('holland_003_1', 'holland_003', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_003_2', 'holland_003', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_003_3', 'holland_003', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_003_4', 'holland_003', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_003_5', 'holland_003', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1);

-- 插入DISC测试题目
INSERT OR REPLACE INTO psychology_questions (
  id, category_id, question_text, question_text_en, question_type, dimension, 
  domain, weight, order_index, is_required, is_active
) VALUES
-- Dominance (D) 支配型
('disc_001', 'cat_disc', 'I am direct and to the point when communicating', 'I am direct and to the point when communicating', 'likert_scale', 'dominance', 'behavioral', 1, 1, 1, 1),
('disc_002', 'cat_disc', 'I like to make quick decisions', 'I like to make quick decisions', 'likert_scale', 'dominance', 'behavioral', 1, 2, 1, 1),
('disc_003', 'cat_disc', 'I focus on results and achievements', 'I focus on results and achievements', 'likert_scale', 'dominance', 'behavioral', 1, 3, 1, 1),
('disc_004', 'cat_disc', 'I enjoy challenges and competition', 'I enjoy challenges and competition', 'likert_scale', 'dominance', 'behavioral', 1, 4, 1, 1),
('disc_005', 'cat_disc', 'I am good at solving problems', 'I am good at solving problems', 'likert_scale', 'dominance', 'behavioral', 1, 5, 1, 1),

-- Influence (I) 影响型
('disc_006', 'cat_disc', 'I am optimistic and enthusiastic', 'I am optimistic and enthusiastic', 'likert_scale', 'influence', 'behavioral', 1, 6, 1, 1),
('disc_007', 'cat_disc', 'I enjoy interacting with others', 'I enjoy interacting with others', 'likert_scale', 'influence', 'behavioral', 1, 7, 1, 1),
('disc_008', 'cat_disc', 'I am good at motivating others', 'I am good at motivating others', 'likert_scale', 'influence', 'behavioral', 1, 8, 1, 1),
('disc_009', 'cat_disc', 'I have strong communication skills', 'I have strong communication skills', 'likert_scale', 'influence', 'behavioral', 1, 9, 1, 1),
('disc_010', 'cat_disc', 'I enjoy teamwork', 'I enjoy teamwork', 'likert_scale', 'influence', 'behavioral', 1, 10, 1, 1),

-- Steadiness (S) 稳健型
('disc_011', 'cat_disc', 'I am patient and loyal', 'I am patient and loyal', 'likert_scale', 'steadiness', 'behavioral', 1, 11, 1, 1),
('disc_012', 'cat_disc', 'I prefer a stable environment', 'I prefer a stable environment', 'likert_scale', 'steadiness', 'behavioral', 1, 12, 1, 1),
('disc_013', 'cat_disc', 'I am a good listener', 'I am a good listener', 'likert_scale', 'steadiness', 'behavioral', 1, 13, 1, 1),
('disc_014', 'cat_disc', 'I value harmonious relationships', 'I value harmonious relationships', 'likert_scale', 'steadiness', 'behavioral', 1, 14, 1, 1),
('disc_015', 'cat_disc', 'I am good at mediating conflicts', 'I am good at mediating conflicts', 'likert_scale', 'steadiness', 'behavioral', 1, 15, 1, 1),

-- Conscientiousness (C) 谨慎型
('disc_016', 'cat_disc', 'I focus on quality and accuracy', 'I focus on quality and accuracy', 'likert_scale', 'conscientiousness', 'behavioral', 1, 16, 1, 1),
('disc_017', 'cat_disc', 'I follow rules and procedures', 'I follow rules and procedures', 'likert_scale', 'conscientiousness', 'behavioral', 1, 17, 1, 1),
('disc_018', 'cat_disc', 'I am good at analyzing details', 'I am good at analyzing details', 'likert_scale', 'conscientiousness', 'behavioral', 1, 18, 1, 1),
('disc_019', 'cat_disc', 'I am well-organized', 'I am well-organized', 'likert_scale', 'conscientiousness', 'behavioral', 1, 19, 1, 1),
('disc_020', 'cat_disc', 'I strive for perfection', 'I strive for perfection', 'likert_scale', 'conscientiousness', 'behavioral', 1, 20, 1, 1);

-- 插入DISC测试题目选项
INSERT OR REPLACE INTO psychology_question_options (
  id, question_id, option_text, option_text_en, option_value, option_score, 
  option_description, order_index, is_correct, is_active
) VALUES
-- DISC题目选项 (每个题目5个选项)
('disc_001_1', 'disc_001', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('disc_001_2', 'disc_001', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('disc_001_3', 'disc_001', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('disc_001_4', 'disc_001', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('disc_001_5', 'disc_001', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1);

-- 插入Leadership测试题目
INSERT OR REPLACE INTO psychology_questions (
  id, category_id, question_text, question_text_en, question_type, dimension, 
  domain, weight, order_index, is_required, is_active
) VALUES
-- Vision (V) 愿景
('leadership_001', 'cat_leadership', 'I can clearly articulate a compelling vision for the future', 'I can clearly articulate a compelling vision for the future', 'likert_scale', 'vision', 'strategic', 1, 1, 1, 1),
('leadership_002', 'cat_leadership', 'I am good at developing long-term strategies', 'I am good at developing long-term strategies', 'likert_scale', 'vision', 'strategic', 1, 2, 1, 1),
('leadership_003', 'cat_leadership', 'I can foresee trends and opportunities', 'I can foresee trends and opportunities', 'likert_scale', 'vision', 'strategic', 1, 3, 1, 1),
('leadership_004', 'cat_leadership', 'I am good at setting goals', 'I am good at setting goals', 'likert_scale', 'vision', 'strategic', 1, 4, 1, 1),
('leadership_005', 'cat_leadership', 'I can inspire others to pursue common goals', 'I can inspire others to pursue common goals', 'likert_scale', 'vision', 'strategic', 1, 5, 1, 1),

-- Influence (I) 影响力
('leadership_006', 'cat_leadership', 'I am good at persuading others', 'I am good at persuading others', 'likert_scale', 'influence', 'interpersonal', 1, 6, 1, 1),
('leadership_007', 'cat_leadership', 'I can build trust relationships', 'I can build trust relationships', 'likert_scale', 'influence', 'interpersonal', 1, 7, 1, 1),
('leadership_008', 'cat_leadership', 'I am good at communication', 'I am good at communication', 'likert_scale', 'influence', 'interpersonal', 1, 8, 1, 1),
('leadership_009', 'cat_leadership', 'I can influence decisions', 'I can influence decisions', 'likert_scale', 'influence', 'interpersonal', 1, 9, 1, 1),
('leadership_010', 'cat_leadership', 'I am good at negotiation', 'I am good at negotiation', 'likert_scale', 'influence', 'interpersonal', 1, 10, 1, 1),

-- Execution (E) 执行力
('leadership_011', 'cat_leadership', 'I am good at implementing plans', 'I am good at implementing plans', 'likert_scale', 'execution', 'operational', 1, 11, 1, 1),
('leadership_012', 'cat_leadership', 'I can manage projects', 'I can manage projects', 'likert_scale', 'execution', 'operational', 1, 12, 1, 1),
('leadership_013', 'cat_leadership', 'I am good at solving problems', 'I am good at solving problems', 'likert_scale', 'execution', 'operational', 1, 13, 1, 1),
('leadership_014', 'cat_leadership', 'I can manage resources', 'I can manage resources', 'likert_scale', 'execution', 'operational', 1, 14, 1, 1),
('leadership_015', 'cat_leadership', 'I am good at risk management', 'I am good at risk management', 'likert_scale', 'execution', 'operational', 1, 15, 1, 1),

-- Team Dynamics (T) 团队动态
('leadership_016', 'cat_leadership', 'I am good at building teams', 'I am good at building teams', 'likert_scale', 'team_dynamics', 'interpersonal', 1, 16, 1, 1),
('leadership_017', 'cat_leadership', 'I can manage conflicts', 'I can manage conflicts', 'likert_scale', 'team_dynamics', 'interpersonal', 1, 17, 1, 1),
('leadership_018', 'cat_leadership', 'I am good at developing talent', 'I am good at developing talent', 'likert_scale', 'team_dynamics', 'interpersonal', 1, 18, 1, 1),
('leadership_019', 'cat_leadership', 'I can promote collaboration', 'I can promote collaboration', 'likert_scale', 'team_dynamics', 'interpersonal', 1, 19, 1, 1),
('leadership_020', 'cat_leadership', 'I am good at team building', 'I am good at team building', 'likert_scale', 'team_dynamics', 'interpersonal', 1, 20, 1, 1),

-- Adaptability (A) 适应性
('leadership_021', 'cat_leadership', 'I can adapt to changes', 'I can adapt to changes', 'likert_scale', 'adaptability', 'strategic', 1, 21, 1, 1),
('leadership_022', 'cat_leadership', 'I am good at learning new skills', 'I am good at learning new skills', 'likert_scale', 'adaptability', 'strategic', 1, 22, 1, 1),
('leadership_023', 'cat_leadership', 'I can handle uncertainty', 'I can handle uncertainty', 'likert_scale', 'adaptability', 'strategic', 1, 23, 1, 1),
('leadership_024', 'cat_leadership', 'I am good at innovation', 'I am good at innovation', 'likert_scale', 'adaptability', 'strategic', 1, 24, 1, 1),
('leadership_025', 'cat_leadership', 'I can quickly adjust strategies', 'I can quickly adjust strategies', 'likert_scale', 'adaptability', 'strategic', 1, 25, 1, 1);

-- 插入Leadership测试题目选项
INSERT OR REPLACE INTO psychology_question_options (
  id, question_id, option_text, option_text_en, option_value, option_score, 
  option_description, order_index, is_correct, is_active
) VALUES
-- Leadership题目选项 (每个题目5个选项)
('leadership_001_1', 'leadership_001', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('leadership_001_2', 'leadership_001', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('leadership_001_3', 'leadership_001', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('leadership_001_4', 'leadership_001', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('leadership_001_5', 'leadership_001', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1);

-- 更新题目数量统计
UPDATE psychology_question_categories 
SET question_count = (
  SELECT COUNT(*) FROM psychology_questions 
  WHERE category_id = 'cat_holland'
) WHERE id = 'cat_holland';

UPDATE psychology_question_categories 
SET question_count = (
  SELECT COUNT(*) FROM psychology_questions 
  WHERE category_id = 'cat_disc'
) WHERE id = 'cat_disc';

UPDATE psychology_question_categories 
SET question_count = (
  SELECT COUNT(*) FROM psychology_questions 
  WHERE category_id = 'cat_leadership'
) WHERE id = 'cat_leadership';
