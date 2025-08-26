-- 心理测试模块题库数据表
-- 遵循统一开发标准的数据库设计规范

-- 题库分类表
CREATE TABLE IF NOT EXISTS psychology_question_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL, -- 分类名称
  code TEXT NOT NULL UNIQUE, -- 分类代码：'mbti', 'phq9', 'eq', 'happiness'
  description TEXT, -- 分类描述
  question_count INTEGER NOT NULL, -- 题目数量
  dimensions TEXT, -- JSON存储维度信息
  scoring_type TEXT NOT NULL, -- 评分类型：'binary', 'likert', 'scale'
  min_score INTEGER, -- 最低分数
  max_score INTEGER, -- 最高分数
  estimated_time INTEGER, -- 预计用时（分钟）
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 题库题目表
CREATE TABLE IF NOT EXISTS psychology_questions (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL, -- 关联题库分类
  question_text TEXT NOT NULL, -- 题目内容
  question_text_en TEXT, -- 英文题目内容
  question_type TEXT NOT NULL, -- 题目类型：'single_choice', 'likert_scale', 'multiple_choice'
  dimension TEXT, -- 所属维度（如MBTI的E/I, S/N, T/F, J/P）
  domain TEXT, -- 所属领域（如幸福指数的work, relationships等）
  weight INTEGER DEFAULT 1, -- 题目权重
  order_index INTEGER NOT NULL, -- 题目顺序
  is_required BOOLEAN DEFAULT 1, -- 是否必答
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES psychology_question_categories(id)
);

-- 题目选项表
CREATE TABLE IF NOT EXISTS psychology_question_options (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL, -- 关联题目
  option_text TEXT NOT NULL, -- 选项内容
  option_text_en TEXT, -- 英文选项内容
  option_value TEXT NOT NULL, -- 选项值
  option_score INTEGER, -- 选项分数
  option_description TEXT, -- 选项描述
  order_index INTEGER NOT NULL, -- 选项顺序
  is_correct BOOLEAN DEFAULT 0, -- 是否为正确答案（用于某些测试）
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES psychology_questions(id)
);

-- 题库配置表
CREATE TABLE IF NOT EXISTS psychology_question_configs (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL, -- 关联题库分类
  config_key TEXT NOT NULL, -- 配置键
  config_value TEXT NOT NULL, -- 配置值
  config_type TEXT NOT NULL, -- 配置类型：'string', 'number', 'boolean', 'json'
  description TEXT, -- 配置描述
  is_public BOOLEAN DEFAULT 0, -- 是否可公开访问
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES psychology_question_categories(id),
  UNIQUE(category_id, config_key)
);

-- 题库版本表
CREATE TABLE IF NOT EXISTS psychology_question_versions (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL, -- 关联题库分类
  version_number TEXT NOT NULL, -- 版本号
  version_name TEXT, -- 版本名称
  description TEXT, -- 版本描述
  is_active BOOLEAN DEFAULT 0, -- 是否为当前版本
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES psychology_question_categories(id),
  UNIQUE(category_id, version_number)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_psychology_questions_category ON psychology_questions(category_id);
CREATE INDEX IF NOT EXISTS idx_psychology_questions_dimension ON psychology_questions(dimension);
CREATE INDEX IF NOT EXISTS idx_psychology_questions_domain ON psychology_questions(domain);
CREATE INDEX IF NOT EXISTS idx_psychology_questions_order ON psychology_questions(category_id, order_index);
CREATE INDEX IF NOT EXISTS idx_psychology_questions_active ON psychology_questions(is_active);

CREATE INDEX IF NOT EXISTS idx_psychology_question_options_question ON psychology_question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_psychology_question_options_order ON psychology_question_options(question_id, order_index);
CREATE INDEX IF NOT EXISTS idx_psychology_question_options_active ON psychology_question_options(is_active);

CREATE INDEX IF NOT EXISTS idx_psychology_question_categories_code ON psychology_question_categories(code);
CREATE INDEX IF NOT EXISTS idx_psychology_question_categories_active ON psychology_question_categories(is_active);

CREATE INDEX IF NOT EXISTS idx_psychology_question_configs_category ON psychology_question_configs(category_id);
CREATE INDEX IF NOT EXISTS idx_psychology_question_configs_key ON psychology_question_configs(config_key);

CREATE INDEX IF NOT EXISTS idx_psychology_question_versions_category ON psychology_question_versions(category_id);
CREATE INDEX IF NOT EXISTS idx_psychology_question_versions_active ON psychology_question_versions(is_active);

-- 插入题库分类种子数据
INSERT OR IGNORE INTO psychology_question_categories (id, name, code, description, question_count, dimensions, scoring_type, min_score, max_score, estimated_time) VALUES
(love-style-category, Love Style Assessment, love_style, Assessment of romantic relationship styles based on John Alan Lees Love Styles Theory, 30, ["Eros", "Ludus", "Storge", "Pragma", "Mania", "Agape"], likert, 30, 150, 15),
(love-language-category, Love Language Test, love_language, Assessment of how you prefer to give and receive love based on Gary Chapmans 5 Love Languages, 30, ["Words_of_Affirmation", "Quality_Time", "Receiving_Gifts", "Acts_of_Service", "Physical_Touch"], likert, 30, 150, 15),
(interpersonal-category, Interpersonal Skills Assessment, interpersonal, Comprehensive assessment of interpersonal communication and relationship skills, 30, ["Communication_Skills", "Empathy", "Conflict_Resolution", "Trust_Building", "Social_Skills"], likert, 30, 150, 15),('mbti-category', 'MBTI性格测试', 'mbti', '迈尔斯-布里格斯类型指标，16种人格类型测试', 60, '["E/I", "S/N", "T/F", "J/P"]', 'binary', 0, 1, 20),
('phq9-category', 'PHQ-9抑郁筛查', 'phq9', '患者健康问卷-9项，专业抑郁风险评估', 9, '["anhedonia", "depressed_mood", "sleep_problems", "fatigue", "appetite_changes", "poor_concentration", "psychomotor_changes", "suicidal_thoughts", "guilt_feelings"]', 'likert', 0, 27, 5),
('eq-category', '情商测试', 'eq', '情绪智力评估，四维度全面分析', 40, '["self_awareness", "self_management", "social_awareness", "relationship_management"]', 'likert', 40, 200, 20),
('happiness-category', '幸福指数评估', 'happiness', '生活满意度综合评估，五领域全面分析', 30, '["work", "relationships", "health", "personal_growth", "life_balance"]', 'likert', 30, 210, 15);

-- 插入题库配置种子数据
INSERT OR IGNORE INTO psychology_question_configs (id, category_id, config_key, config_value, config_type, description) VALUES
('love-style-config-1', 'love-style-category', 'dimension_weights', '{"Eros": 1, "Ludus": 1, "Storge": 1, "Pragma": 1, "Mania": 1, "Agape": 1}', 'json', 'Love Style Assessment dimension weights configuration'),
('love-style-config-2', 'love-style-category', 'scoring_algorithm', 'dimension_average', 'string', 'Love Style Assessment scoring algorithm: dimension average'),
('love-language-config-1', 'love-language-category', 'dimension_weights', '{"Words_of_Affirmation": 1, "Quality_Time": 1, "Receiving_Gifts": 1, "Acts_of_Service": 1, "Physical_Touch": 1}', 'json', 'Love Language Test dimension weights configuration'),
('love-language-config-2', 'love-language-category', 'scoring_algorithm', 'dimension_average', 'string', 'Love Language Test scoring algorithm: dimension average'),
('interpersonal-config-1', 'interpersonal-category', 'dimension_weights', '{"Communication_Skills": 1, "Empathy": 1, "Conflict_Resolution": 1, "Trust_Building": 1, "Social_Skills": 1}', 'json', 'Interpersonal Skills Assessment dimension weights configuration'),
('interpersonal-config-2', 'interpersonal-category', 'scoring_algorithm', 'dimension_average', 'string', 'Interpersonal Skills Assessment scoring algorithm: dimension average'),('mbti-config-1', 'mbti-category', 'dimension_weights', '{"E/I": 1, "S/N": 1, "T/F": 1, "J/P": 1}', 'json', 'MBTI各维度权重配置'),
('mbti-config-2', 'mbti-category', 'scoring_algorithm', 'binary_preference', 'string', 'MBTI评分算法：二元偏好'),
('phq9-config-1', 'phq9-category', 'risk_thresholds', '{"minimal": 0, "mild": 5, "moderate": 10, "moderately_severe": 15, "severe": 20}', 'json', 'PHQ-9风险等级阈值'),
('phq9-config-2', 'phq9-category', 'safety_warning', 'true', 'boolean', 'PHQ-9启用安全警告'),
('eq-config-1', 'eq-category', 'dimension_weights', '{"self_awareness": 1, "self_management": 1, "social_awareness": 1, "relationship_management": 1}', 'json', '情商各维度权重配置'),
('eq-config-2', 'eq-category', 'score_ranges', '{"low": [40, 120], "medium": [121, 160], "high": [161, 200]}', 'json', '情商分数范围配置'),
('happiness-config-1', 'happiness-category', 'domain_weights', '{"work": 1, "relationships": 1, "health": 1, "personal_growth": 1, "life_balance": 1}', 'json', '幸福指数各领域权重配置'),
('happiness-config-2', 'happiness-category', 'score_ranges', '{"low": [30, 120], "medium": [121, 180], "high": [181, 210]}', 'json', '幸福指数分数范围配置');

-- 插入题库版本种子数据
INSERT OR IGNORE INTO psychology_question_versions (id, category_id, version_number, version_name, description, is_active) VALUES
('mbti-v1', 'mbti-category', '1.0.0', 'MBTI标准版', '基于Myers-Briggs理论的60题标准版本', 1),
('phq9-v1', 'phq9-category', '1.0.0', 'PHQ-9标准版', '基于DSM-IV标准的9题抑郁筛查版本', 1),
('eq-v1', 'eq-category', '1.0.0', '情商测试标准版', '基于Goleman理论的40题四维度版本', 1),
('happiness-v1', 'happiness-category', '1.0.0', '幸福指数标准版', '基于生活满意度理论的30题五领域版本', 1); 