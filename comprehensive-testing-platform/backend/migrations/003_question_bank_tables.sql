-- 问题银行数据表
-- 统一的问题管理系统，支持所有测试类型

-- 问题分类表
CREATE TABLE IF NOT EXISTS psychology_question_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  question_count INTEGER DEFAULT 0,
  dimensions TEXT, -- JSON数组存储维度
  scoring_type TEXT NOT NULL DEFAULT 'likert', -- 'binary', 'likert', 'scale'
  min_score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 100,
  estimated_time INTEGER DEFAULT 300, -- 预估完成时间（秒）
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 问题表
CREATE TABLE IF NOT EXISTS psychology_questions (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  question_text TEXT NOT NULL, -- 中文问题文本
  question_text_en TEXT, -- 英文问题文本
  question_type TEXT NOT NULL DEFAULT 'single_choice', -- 'single_choice', 'likert_scale', 'multiple_choice'
  dimension TEXT, -- 维度/因子
  domain TEXT, -- 领域
  weight REAL DEFAULT 1.0, -- 权重
  order_index INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT 1,
  is_active BOOLEAN DEFAULT 1,
  is_reverse BOOLEAN DEFAULT 0, -- 是否反向计分
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES psychology_question_categories(id)
);

-- 问题选项表
CREATE TABLE IF NOT EXISTS psychology_question_options (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL,
  option_text TEXT NOT NULL, -- 中文选项文本
  option_text_en TEXT, -- 英文选项文本
  option_value TEXT NOT NULL, -- 选项值
  option_score INTEGER DEFAULT 0, -- 选项得分
  option_description TEXT, -- 选项描述
  order_index INTEGER NOT NULL,
  is_correct BOOLEAN DEFAULT 0, -- 是否为正确答案（用于能力测试）
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES psychology_questions(id)
);

-- 问题配置表
CREATE TABLE IF NOT EXISTS psychology_question_configs (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  config_key TEXT NOT NULL,
  config_value TEXT NOT NULL,
  config_type TEXT DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
  description TEXT,
  is_public BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES psychology_question_categories(id)
);

-- 问题版本表
CREATE TABLE IF NOT EXISTS psychology_question_versions (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  version_number TEXT NOT NULL,
  version_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES psychology_question_categories(id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_psychology_questions_category ON psychology_questions(category_id);
CREATE INDEX IF NOT EXISTS idx_psychology_questions_order ON psychology_questions(order_index);
CREATE INDEX IF NOT EXISTS idx_psychology_questions_dimension ON psychology_questions(dimension);
CREATE INDEX IF NOT EXISTS idx_psychology_question_options_question ON psychology_question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_psychology_question_options_order ON psychology_question_options(order_index);
CREATE INDEX IF NOT EXISTS idx_psychology_question_configs_category ON psychology_question_configs(category_id);
CREATE INDEX IF NOT EXISTS idx_psychology_question_versions_category ON psychology_question_versions(category_id);

-- 插入基础测试分类数据
INSERT OR IGNORE INTO psychology_question_categories (id, name, code, description, dimensions, scoring_type, min_score, max_score, estimated_time) VALUES
('cat_mbti', 'MBTI人格类型测试', 'mbti', '基于荣格心理类型理论的人格测试', '["E/I", "S/N", "T/F", "J/P"]', 'binary', 0, 16, 600),
('cat_phq9', 'PHQ-9抑郁症筛查量表', 'phq9', '用于筛查抑郁症状的标准化量表', '["抑郁症状"]', 'scale', 0, 27, 300),
('cat_eq', '情商测试', 'eq', '评估情绪智力的综合测试', '["自我意识", "自我管理", "社会意识", "关系管理"]', 'likert', 0, 100, 900),
('cat_happiness', '幸福指数测试', 'happiness', '评估生活满意度和幸福感', '["生活满意度", "积极情感", "消极情感"]', 'likert', 0, 100, 600),
('cat_holland', '霍兰德职业兴趣测试', 'holland', '评估职业兴趣类型的经典测试', '["现实型", "研究型", "艺术型", "社会型", "企业型", "常规型"]', 'likert', 0, 100, 900),
('cat_disc', 'DISC行为风格测试', 'disc', '评估行为风格和工作偏好', '["支配型", "影响型", "稳健型", "谨慎型"]', 'likert', 0, 100, 600),
('cat_leadership', '领导力评估', 'leadership', '评估领导能力和风格', '["战略思维", "团队管理", "沟通能力", "决策能力"]', 'likert', 0, 100, 900),
('cat_love_language', '爱的语言测试', 'love_language', '识别个人的爱的表达和接受方式', '["肯定言语", "服务行动", "接受礼物", "优质时间", "身体接触"]', 'likert', 0, 100, 450),
('cat_love_style', '恋爱风格测试', 'love_style', '评估恋爱关系中的行为模式', '["浪漫型", "游戏型", "友谊型", "现实型", "依恋型", "利他型"]', 'likert', 0, 100, 600),
('cat_interpersonal', '人际关系测试', 'interpersonal', '评估人际交往能力和风格', '["沟通技巧", "冲突处理", "合作能力", "社交技能"]', 'likert', 0, 100, 750),
('cat_vark', 'VARK学习风格测试', 'vark', '识别个人的学习偏好和风格', '["视觉型", "听觉型", "读写型", "动觉型"]', 'likert', 0, 100, 450),
-- Raven and Cognitive categories removed - no longer needed

-- 插入PHQ-9测试题目示例
INSERT OR IGNORE INTO psychology_questions (id, category_id, question_text, question_text_en, question_type, dimension, order_index) VALUES
('q_phq9_1', 'cat_phq9', '做事时提不起劲或没有兴趣', 'Little interest or pleasure in doing things', 'likert_scale', '抑郁症状', 1),
('q_phq9_2', 'cat_phq9', '感到心情低落、沮丧或绝望', 'Feeling down, depressed, or hopeless', 'likert_scale', '抑郁症状', 2),
('q_phq9_3', 'cat_phq9', '入睡困难、睡不安稳或睡眠过多', 'Trouble falling or staying asleep, or sleeping too much', 'likert_scale', '抑郁症状', 3),
('q_phq9_4', 'cat_phq9', '感觉疲倦或没有活力', 'Feeling tired or having little energy', 'likert_scale', '抑郁症状', 4),
('q_phq9_5', 'cat_phq9', '食欲不振或吃太多', 'Poor appetite or overeating', 'likert_scale', '抑郁症状', 5),
('q_phq9_6', 'cat_phq9', '觉得自己很糟糕或觉得自己很失败，或让自己或家人失望', 'Feeling bad about yourself or that you are a failure or have let yourself or your family down', 'likert_scale', '抑郁症状', 6),
('q_phq9_7', 'cat_phq9', '对事物专注有困难，例如阅读报纸或看电视时', 'Trouble concentrating on things, such as reading the newspaper or watching television', 'likert_scale', '抑郁症状', 7),
('q_phq9_8', 'cat_phq9', '动作或说话速度缓慢到别人已经察觉？或正好相反——烦躁或坐立不安、动来动去的情况超过平常', 'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual', 'likert_scale', '抑郁症状', 8),
('q_phq9_9', 'cat_phq9', '有不如死掉或用某种方式伤害自己的念头', 'Thoughts that you would be better off dead, or of hurting yourself in some way', 'likert_scale', '抑郁症状', 9);

-- 插入PHQ-9选项
INSERT OR IGNORE INTO psychology_question_options (id, question_id, option_text, option_text_en, option_value, option_score, order_index) VALUES
-- 问题1选项
('opt_phq9_1_0', 'q_phq9_1', '完全没有', 'Not at all', '0', 0, 1),
('opt_phq9_1_1', 'q_phq9_1', '几天', 'Several days', '1', 1, 2),
('opt_phq9_1_2', 'q_phq9_1', '一半以上的天数', 'More than half the days', '2', 2, 3),
('opt_phq9_1_3', 'q_phq9_1', '几乎每天', 'Nearly every day', '3', 3, 4),
-- 问题2选项
('opt_phq9_2_0', 'q_phq9_2', '完全没有', 'Not at all', '0', 0, 1),
('opt_phq9_2_1', 'q_phq9_2', '几天', 'Several days', '1', 1, 2),
('opt_phq9_2_2', 'q_phq9_2', '一半以上的天数', 'More than half the days', '2', 2, 3),
('opt_phq9_2_3', 'q_phq9_2', '几乎每天', 'Nearly every day', '3', 3, 4),
-- 问题3选项
('opt_phq9_3_0', 'q_phq9_3', '完全没有', 'Not at all', '0', 0, 1),
('opt_phq9_3_1', 'q_phq9_3', '几天', 'Several days', '1', 1, 2),
('opt_phq9_3_2', 'q_phq9_3', '一半以上的天数', 'More than half the days', '2', 2, 3),
('opt_phq9_3_3', 'q_phq9_3', '几乎每天', 'Nearly every day', '3', 3, 4),
-- 问题4选项
('opt_phq9_4_0', 'q_phq9_4', '完全没有', 'Not at all', '0', 0, 1),
('opt_phq9_4_1', 'q_phq9_4', '几天', 'Several days', '1', 1, 2),
('opt_phq9_4_2', 'q_phq9_4', '一半以上的天数', 'More than half the days', '2', 2, 3),
('opt_phq9_4_3', 'q_phq9_4', '几乎每天', 'Nearly every day', '3', 3, 4),
-- 问题5选项
('opt_phq9_5_0', 'q_phq9_5', '完全没有', 'Not at all', '0', 0, 1),
('opt_phq9_5_1', 'q_phq9_5', '几天', 'Several days', '1', 1, 2),
('opt_phq9_5_2', 'q_phq9_5', '一半以上的天数', 'More than half the days', '2', 2, 3),
('opt_phq9_5_3', 'q_phq9_5', '几乎每天', 'Nearly every day', '3', 3, 4),
-- 问题6选项
('opt_phq9_6_0', 'q_phq9_6', '完全没有', 'Not at all', '0', 0, 1),
('opt_phq9_6_1', 'q_phq9_6', '几天', 'Several days', '1', 1, 2),
('opt_phq9_6_2', 'q_phq9_6', '一半以上的天数', 'More than half the days', '2', 2, 3),
('opt_phq9_6_3', 'q_phq9_6', '几乎每天', 'Nearly every day', '3', 3, 4),
-- 问题7选项
('opt_phq9_7_0', 'q_phq9_7', '完全没有', 'Not at all', '0', 0, 1),
('opt_phq9_7_1', 'q_phq9_7', '几天', 'Several days', '1', 1, 2),
('opt_phq9_7_2', 'q_phq9_7', '一半以上的天数', 'More than half the days', '2', 2, 3),
('opt_phq9_7_3', 'q_phq9_7', '几乎每天', 'Nearly every day', '3', 3, 4),
-- 问题8选项
('opt_phq9_8_0', 'q_phq9_8', '完全没有', 'Not at all', '0', 0, 1),
('opt_phq9_8_1', 'q_phq9_8', '几天', 'Several days', '1', 1, 2),
('opt_phq9_8_2', 'q_phq9_8', '一半以上的天数', 'More than half the days', '2', 2, 3),
('opt_phq9_8_3', 'q_phq9_8', '几乎每天', 'Nearly every day', '3', 3, 4),
-- 问题9选项
('opt_phq9_9_0', 'q_phq9_9', '完全没有', 'Not at all', '0', 0, 1),
('opt_phq9_9_1', 'q_phq9_9', '几天', 'Several days', '1', 1, 2),
('opt_phq9_9_2', 'q_phq9_9', '一半以上的天数', 'More than half the days', '2', 2, 3),
('opt_phq9_9_3', 'q_phq9_9', '几乎每天', 'Nearly every day', '3', 3, 4);