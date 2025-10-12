-- Career Module Questions Data Migration
-- 遵循统一开发标准的数据库设计规范

-- 插入Career测试的题目分类
INSERT OR REPLACE INTO psychology_question_categories (
  id, name, code, description, question_count, dimensions, scoring_type, 
  min_score, max_score, estimated_time, is_active, sort_order
) VALUES
-- Holland Career Interest Test
('holland-category', 'Holland Career Interest Test', 'holland', 
 '基于霍兰德RIASEC理论的职业兴趣测试，帮助用户发现最适合的职业方向', 60,
 '["realistic", "investigative", "artistic", "social", "enterprising", "conventional"]',
 'likert', 60, 300, 20, 1, 10),

-- DISC Behavioral Style Test  
('disc-category', 'DISC Behavioral Style Test', 'disc',
 'DISC行为风格测试，帮助用户了解自己在工作环境中的行为偏好和沟通风格', 28,
 '["dominance", "influence", "steadiness", "conscientiousness"]',
 'likert', 28, 140, 15, 1, 11),

-- Leadership Assessment Test
('leadership-category', 'Leadership Assessment Test', 'leadership',
 '领导力评估测试，帮助用户评估自己的领导潜力和发展领域', 40,
 '["vision", "influence", "execution", "team_dynamics", "adaptability"]',
 'likert', 40, 200, 25, 1, 12);

-- 插入Holland测试题目
INSERT OR REPLACE INTO psychology_questions (
  id, category_id, question_text, question_text_en, question_type, dimension, 
  domain, weight, order_index, is_required, is_active
) VALUES
-- Realistic (R) 现实型
('holland_001', 'holland-category', '我享受使用工具和机器工作', 'I enjoy working with tools and machines', 'likert_scale', 'realistic', 'realistic', 1, 1, 1, 1),
('holland_002', 'holland-category', '我喜欢修理和组装物品', 'I like to repair and assemble things', 'likert_scale', 'realistic', 'realistic', 1, 2, 1, 1),
('holland_003', 'holland-category', '我擅长解决技术问题', 'I am good at solving technical problems', 'likert_scale', 'realistic', 'realistic', 1, 3, 1, 1),
('holland_004', 'holland-category', '我喜欢户外活动', 'I enjoy outdoor activities', 'likert_scale', 'realistic', 'realistic', 1, 4, 1, 1),
('holland_005', 'holland-category', '我善于操作机械设备', 'I am skilled at operating mechanical equipment', 'likert_scale', 'realistic', 'realistic', 1, 5, 1, 1),

-- Investigative (I) 研究型
('holland_006', 'holland-category', '我喜欢解决复杂的数学问题', 'I like to solve complex mathematical problems', 'likert_scale', 'investigative', 'investigative', 1, 6, 1, 1),
('holland_007', 'holland-category', '我享受科学研究', 'I enjoy scientific research', 'likert_scale', 'investigative', 'investigative', 1, 7, 1, 1),
('holland_008', 'holland-category', '我喜欢分析数据', 'I like to analyze data', 'likert_scale', 'investigative', 'investigative', 1, 8, 1, 1),
('holland_009', 'holland-category', '我善于逻辑推理', 'I am good at logical reasoning', 'likert_scale', 'investigative', 'investigative', 1, 9, 1, 1),
('holland_010', 'holland-category', '我喜欢探索新知识', 'I like to explore new knowledge', 'likert_scale', 'investigative', 'investigative', 1, 10, 1, 1),

-- Artistic (A) 艺术型
('holland_011', 'holland-category', '我享受创作艺术或音乐', 'I enjoy creating art or music', 'likert_scale', 'artistic', 'artistic', 1, 11, 1, 1),
('holland_012', 'holland-category', '我喜欢设计创意作品', 'I like to design creative works', 'likert_scale', 'artistic', 'artistic', 1, 12, 1, 1),
('holland_013', 'holland-category', '我善于表达情感', 'I am good at expressing emotions', 'likert_scale', 'artistic', 'artistic', 1, 13, 1, 1),
('holland_014', 'holland-category', '我喜欢创新和实验', 'I like to innovate and experiment', 'likert_scale', 'artistic', 'artistic', 1, 14, 1, 1),
('holland_015', 'holland-category', '我享受表演和展示', 'I enjoy performing and presenting', 'likert_scale', 'artistic', 'artistic', 1, 15, 1, 1),

-- Social (S) 社会型
('holland_016', 'holland-category', '我喜欢帮助他人解决问题', 'I like helping people with their problems', 'likert_scale', 'social', 'social', 1, 16, 1, 1),
('holland_017', 'holland-category', '我善于教导他人', 'I am good at teaching others', 'likert_scale', 'social', 'social', 1, 17, 1, 1),
('holland_018', 'holland-category', '我喜欢团队合作', 'I enjoy working in teams', 'likert_scale', 'social', 'social', 1, 18, 1, 1),
('holland_019', 'holland-category', '我善于倾听他人', 'I am good at listening to others', 'likert_scale', 'social', 'social', 1, 19, 1, 1),
('holland_020', 'holland-category', '我喜欢照顾他人', 'I like taking care of others', 'likert_scale', 'social', 'social', 1, 20, 1, 1),

-- Enterprising (E) 企业型
('holland_021', 'holland-category', '我喜欢说服他人接受我的观点', 'I enjoy persuading others to see my point of view', 'likert_scale', 'enterprising', 'enterprising', 1, 21, 1, 1),
('holland_022', 'holland-category', '我喜欢领导团队', 'I like leading teams', 'likert_scale', 'enterprising', 'enterprising', 1, 22, 1, 1),
('holland_023', 'holland-category', '我善于销售和推广', 'I am good at selling and promoting', 'likert_scale', 'enterprising', 'enterprising', 1, 23, 1, 1),
('holland_024', 'holland-category', '我喜欢冒险和挑战', 'I like taking risks and challenges', 'likert_scale', 'enterprising', 'enterprising', 1, 24, 1, 1),
('holland_025', 'holland-category', '我善于制定计划', 'I am good at making plans', 'likert_scale', 'enterprising', 'enterprising', 1, 25, 1, 1),

-- Conventional (C) 常规型
('holland_026', 'holland-category', '我喜欢遵循固定的程序', 'I prefer to follow set procedures', 'likert_scale', 'conventional', 'conventional', 1, 26, 1, 1),
('holland_027', 'holland-category', '我善于整理和分类', 'I am good at organizing and categorizing', 'likert_scale', 'conventional', 'conventional', 1, 27, 1, 1),
('holland_028', 'holland-category', '我喜欢处理数字和文件', 'I like working with numbers and documents', 'likert_scale', 'conventional', 'conventional', 1, 28, 1, 1),
('holland_029', 'holland-category', '我注重细节和准确性', 'I pay attention to details and accuracy', 'likert_scale', 'conventional', 'conventional', 1, 29, 1, 1),
('holland_030', 'holland-category', '我喜欢有序的工作环境', 'I prefer an orderly work environment', 'likert_scale', 'conventional', 'conventional', 1, 30, 1, 1);

-- 插入Holland测试题目选项
INSERT OR REPLACE INTO psychology_question_options (
  id, question_id, option_text, option_text_en, option_value, option_score, 
  option_description, order_index, is_correct, is_active
) VALUES
-- Holland题目选项 (每个题目5个选项)
('holland_001_1', 'holland_001', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_001_2', 'holland_001', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_001_3', 'holland_001', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_001_4', 'holland_001', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_001_5', 'holland_001', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

('holland_002_1', 'holland_002', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_002_2', 'holland_002', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_002_3', 'holland_002', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_002_4', 'holland_002', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_002_5', 'holland_002', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

('holland_003_1', 'holland_003', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_003_2', 'holland_003', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_003_3', 'holland_003', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_003_4', 'holland_003', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_003_5', 'holland_003', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1);

-- 插入DISC测试题目
INSERT OR REPLACE INTO psychology_questions (
  id, category_id, question_text, question_text_en, question_type, dimension, 
  domain, weight, order_index, is_required, is_active
) VALUES
-- Dominance (D) 支配型
('disc_001', 'disc-category', '我直接且直率地沟通', 'I am direct and to the point when communicating', 'likert_scale', 'dominance', 'behavioral', 1, 1, 1, 1),
('disc_002', 'disc-category', '我喜欢快速做出决定', 'I like to make quick decisions', 'likert_scale', 'dominance', 'behavioral', 1, 2, 1, 1),
('disc_003', 'disc-category', '我追求结果和成就', 'I focus on results and achievements', 'likert_scale', 'dominance', 'behavioral', 1, 3, 1, 1),
('disc_004', 'disc-category', '我喜欢挑战和竞争', 'I enjoy challenges and competition', 'likert_scale', 'dominance', 'behavioral', 1, 4, 1, 1),
('disc_005', 'disc-category', '我善于解决问题', 'I am good at solving problems', 'likert_scale', 'dominance', 'behavioral', 1, 5, 1, 1),

-- Influence (I) 影响型
('disc_006', 'disc-category', '我乐观且充满热情', 'I am optimistic and enthusiastic', 'likert_scale', 'influence', 'behavioral', 1, 6, 1, 1),
('disc_007', 'disc-category', '我喜欢与他人互动', 'I enjoy interacting with others', 'likert_scale', 'influence', 'behavioral', 1, 7, 1, 1),
('disc_008', 'disc-category', '我善于激励他人', 'I am good at motivating others', 'likert_scale', 'influence', 'behavioral', 1, 8, 1, 1),
('disc_009', 'disc-category', '我表达能力强', 'I have strong communication skills', 'likert_scale', 'influence', 'behavioral', 1, 9, 1, 1),
('disc_010', 'disc-category', '我喜欢团队合作', 'I enjoy teamwork', 'likert_scale', 'influence', 'behavioral', 1, 10, 1, 1),

-- Steadiness (S) 稳健型
('disc_011', 'disc-category', '我耐心且忠诚', 'I am patient and loyal', 'likert_scale', 'steadiness', 'behavioral', 1, 11, 1, 1),
('disc_012', 'disc-category', '我喜欢稳定的环境', 'I prefer a stable environment', 'likert_scale', 'steadiness', 'behavioral', 1, 12, 1, 1),
('disc_013', 'disc-category', '我善于倾听', 'I am a good listener', 'likert_scale', 'steadiness', 'behavioral', 1, 13, 1, 1),
('disc_014', 'disc-category', '我重视和谐关系', 'I value harmonious relationships', 'likert_scale', 'steadiness', 'behavioral', 1, 14, 1, 1),
('disc_015', 'disc-category', '我善于调解冲突', 'I am good at mediating conflicts', 'likert_scale', 'steadiness', 'behavioral', 1, 15, 1, 1),

-- Conscientiousness (C) 谨慎型
('disc_016', 'disc-category', '我注重质量和准确性', 'I focus on quality and accuracy', 'likert_scale', 'conscientiousness', 'behavioral', 1, 16, 1, 1),
('disc_017', 'disc-category', '我遵循规则和程序', 'I follow rules and procedures', 'likert_scale', 'conscientiousness', 'behavioral', 1, 17, 1, 1),
('disc_018', 'disc-category', '我善于分析细节', 'I am good at analyzing details', 'likert_scale', 'conscientiousness', 'behavioral', 1, 18, 1, 1),
('disc_019', 'disc-category', '我计划性强', 'I am well-organized', 'likert_scale', 'conscientiousness', 'behavioral', 1, 19, 1, 1),
('disc_020', 'disc-category', '我追求完美', 'I strive for perfection', 'likert_scale', 'conscientiousness', 'behavioral', 1, 20, 1, 1);

-- 插入DISC测试题目选项
INSERT OR REPLACE INTO psychology_question_options (
  id, question_id, option_text, option_text_en, option_value, option_score, 
  option_description, order_index, is_correct, is_active
) VALUES
-- DISC题目选项 (每个题目5个选项)
('disc_001_1', 'disc_001', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('disc_001_2', 'disc_001', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('disc_001_3', 'disc_001', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('disc_001_4', 'disc_001', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('disc_001_5', 'disc_001', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1);

-- 插入Leadership测试题目
INSERT OR REPLACE INTO psychology_questions (
  id, category_id, question_text, question_text_en, question_type, dimension, 
  domain, weight, order_index, is_required, is_active
) VALUES
-- Vision (V) 愿景
('leadership_001', 'leadership-category', '我能清晰地表达一个引人注目的未来愿景', 'I can clearly articulate a compelling vision for the future', 'likert_scale', 'vision', 'strategic', 1, 1, 1, 1),
('leadership_002', 'leadership-category', '我善于制定长期战略', 'I am good at developing long-term strategies', 'likert_scale', 'vision', 'strategic', 1, 2, 1, 1),
('leadership_003', 'leadership-category', '我能够预见趋势和机会', 'I can foresee trends and opportunities', 'likert_scale', 'vision', 'strategic', 1, 3, 1, 1),
('leadership_004', 'leadership-category', '我善于设定目标', 'I am good at setting goals', 'likert_scale', 'vision', 'strategic', 1, 4, 1, 1),
('leadership_005', 'leadership-category', '我能够激励他人追求共同目标', 'I can inspire others to pursue common goals', 'likert_scale', 'vision', 'strategic', 1, 5, 1, 1),

-- Influence (I) 影响力
('leadership_006', 'leadership-category', '我善于说服他人', 'I am good at persuading others', 'likert_scale', 'influence', 'interpersonal', 1, 6, 1, 1),
('leadership_007', 'leadership-category', '我能够建立信任关系', 'I can build trust relationships', 'likert_scale', 'influence', 'interpersonal', 1, 7, 1, 1),
('leadership_008', 'leadership-category', '我善于沟通', 'I am good at communication', 'likert_scale', 'influence', 'interpersonal', 1, 8, 1, 1),
('leadership_009', 'leadership-category', '我能够影响决策', 'I can influence decisions', 'likert_scale', 'influence', 'interpersonal', 1, 9, 1, 1),
('leadership_010', 'leadership-category', '我善于谈判', 'I am good at negotiation', 'likert_scale', 'influence', 'interpersonal', 1, 10, 1, 1),

-- Execution (E) 执行力
('leadership_011', 'leadership-category', '我善于实施计划', 'I am good at implementing plans', 'likert_scale', 'execution', 'operational', 1, 11, 1, 1),
('leadership_012', 'leadership-category', '我能够管理项目', 'I can manage projects', 'likert_scale', 'execution', 'operational', 1, 12, 1, 1),
('leadership_013', 'leadership-category', '我善于解决问题', 'I am good at solving problems', 'likert_scale', 'execution', 'operational', 1, 13, 1, 1),
('leadership_014', 'leadership-category', '我能够管理资源', 'I can manage resources', 'likert_scale', 'execution', 'operational', 1, 14, 1, 1),
('leadership_015', 'leadership-category', '我善于风险管理', 'I am good at risk management', 'likert_scale', 'execution', 'operational', 1, 15, 1, 1),

-- Team Dynamics (T) 团队动态
('leadership_016', 'leadership-category', '我善于建立团队', 'I am good at building teams', 'likert_scale', 'team_dynamics', 'interpersonal', 1, 16, 1, 1),
('leadership_017', 'leadership-category', '我能够管理冲突', 'I can manage conflicts', 'likert_scale', 'team_dynamics', 'interpersonal', 1, 17, 1, 1),
('leadership_018', 'leadership-category', '我善于培养人才', 'I am good at developing talent', 'likert_scale', 'team_dynamics', 'interpersonal', 1, 18, 1, 1),
('leadership_019', 'leadership-category', '我能够促进合作', 'I can promote collaboration', 'likert_scale', 'team_dynamics', 'interpersonal', 1, 19, 1, 1),
('leadership_020', 'leadership-category', '我善于团队建设', 'I am good at team building', 'likert_scale', 'team_dynamics', 'interpersonal', 1, 20, 1, 1),

-- Adaptability (A) 适应性
('leadership_021', 'leadership-category', '我能够适应变化', 'I can adapt to changes', 'likert_scale', 'adaptability', 'strategic', 1, 21, 1, 1),
('leadership_022', 'leadership-category', '我善于学习新技能', 'I am good at learning new skills', 'likert_scale', 'adaptability', 'strategic', 1, 22, 1, 1),
('leadership_023', 'leadership-category', '我能够处理不确定性', 'I can handle uncertainty', 'likert_scale', 'adaptability', 'strategic', 1, 23, 1, 1),
('leadership_024', 'leadership-category', '我善于创新', 'I am good at innovation', 'likert_scale', 'adaptability', 'strategic', 1, 24, 1, 1),
('leadership_025', 'leadership-category', '我能够快速调整策略', 'I can quickly adjust strategies', 'likert_scale', 'adaptability', 'strategic', 1, 25, 1, 1);

-- 插入Leadership测试题目选项
INSERT OR REPLACE INTO psychology_question_options (
  id, question_id, option_text, option_text_en, option_value, option_score, 
  option_description, order_index, is_correct, is_active
) VALUES
-- Leadership题目选项 (每个题目5个选项)
('leadership_001_1', 'leadership_001', '强烈不同意', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('leadership_001_2', 'leadership_001', '不同意', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('leadership_001_3', 'leadership_001', '中立', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('leadership_001_4', 'leadership_001', '同意', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('leadership_001_5', 'leadership_001', '强烈同意', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1);

-- 更新题目数量统计
UPDATE psychology_question_categories 
SET question_count = (
  SELECT COUNT(*) FROM psychology_questions 
  WHERE category_id = 'holland-category'
) WHERE id = 'holland-category';

UPDATE psychology_question_categories 
SET question_count = (
  SELECT COUNT(*) FROM psychology_questions 
  WHERE category_id = 'disc-category'
) WHERE id = 'disc-category';

UPDATE psychology_question_categories 
SET question_count = (
  SELECT COUNT(*) FROM psychology_questions 
  WHERE category_id = 'leadership-category'
) WHERE id = 'leadership-category';
