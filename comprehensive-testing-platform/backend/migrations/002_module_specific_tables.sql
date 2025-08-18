-- 模块专用数据表
-- 遵循统一开发标准的数据库设计规范

-- 心理测试模块专用表
CREATE TABLE IF NOT EXISTS psychology_sessions (
  id TEXT PRIMARY KEY,
  test_session_id TEXT NOT NULL,
  test_subtype TEXT NOT NULL, -- 'mbti', 'big_five', 'phq9', 'happiness'
  personality_type TEXT, -- MBTI类型如'INTJ'
  dimension_scores TEXT, -- JSON存储维度得分
  risk_level TEXT, -- PHQ-9风险等级
  happiness_domains TEXT, -- JSON存储幸福指数各领域得分
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_session_id) REFERENCES test_sessions(id)
);

-- 占星分析模块专用表
CREATE TABLE IF NOT EXISTS astrology_sessions (
  id TEXT PRIMARY KEY,
  test_session_id TEXT NOT NULL,
  birth_date DATE NOT NULL,
  birth_time TIME,
  birth_location TEXT,
  sun_sign TEXT NOT NULL,
  moon_sign TEXT,
  rising_sign TEXT,
  planetary_positions TEXT, -- JSON存储行星位置
  house_positions TEXT, -- JSON存储宫位信息
  aspects TEXT, -- JSON存储相位信息
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_session_id) REFERENCES test_sessions(id)
);

-- 塔罗牌模块专用表
CREATE TABLE IF NOT EXISTS tarot_sessions (
  id TEXT PRIMARY KEY,
  test_session_id TEXT NOT NULL,
  spread_type TEXT NOT NULL, -- 'single', 'three_card', 'celtic_cross'
  cards_drawn TEXT NOT NULL, -- JSON数组存储抽取的牌
  card_positions TEXT, -- JSON存储牌的位置信息
  interpretation_theme TEXT, -- 解读主题
  question_category TEXT, -- 问题类别
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_session_id) REFERENCES test_sessions(id)
);

-- 职业发展模块专用表
CREATE TABLE IF NOT EXISTS career_sessions (
  id TEXT PRIMARY KEY,
  test_session_id TEXT NOT NULL,
  test_subtype TEXT NOT NULL, -- 'holland', 'career_values', 'skills_assessment'
  holland_code TEXT, -- 霍兰德代码如'RIA'
  interest_scores TEXT, -- JSON存储兴趣得分
  values_ranking TEXT, -- JSON存储价值观排序
  skills_profile TEXT, -- JSON存储技能档案
  career_matches TEXT, -- JSON存储职业匹配结果
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_session_id) REFERENCES test_sessions(id)
);

-- 学习能力模块专用表
CREATE TABLE IF NOT EXISTS learning_sessions (
  id TEXT PRIMARY KEY,
  test_session_id TEXT NOT NULL,
  test_subtype TEXT NOT NULL, -- 'vark', 'raven', 'learning_strategies'
  learning_style TEXT, -- VARK学习风格
  cognitive_score INTEGER, -- 瑞文测试得分
  percentile_rank INTEGER, -- 百分位排名
  learning_preferences TEXT, -- JSON存储学习偏好
  strategy_recommendations TEXT, -- JSON存储策略建议
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_session_id) REFERENCES test_sessions(id)
);

-- 情感关系模块专用表
CREATE TABLE IF NOT EXISTS relationship_sessions (
  id TEXT PRIMARY KEY,
  test_session_id TEXT NOT NULL,
  test_subtype TEXT NOT NULL, -- 'love_languages', 'attachment_style', 'relationship_skills'
  primary_love_language TEXT,
  secondary_love_language TEXT,
  attachment_style TEXT, -- 'secure', 'anxious', 'avoidant', 'disorganized'
  relationship_skills TEXT, -- JSON存储关系技能得分
  communication_style TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_session_id) REFERENCES test_sessions(id)
);

-- 命理分析模块专用表
CREATE TABLE IF NOT EXISTS numerology_sessions (
  id TEXT PRIMARY KEY,
  test_session_id TEXT NOT NULL,
  birth_date DATE NOT NULL,
  full_name TEXT NOT NULL,
  life_path_number INTEGER,
  destiny_number INTEGER,
  soul_urge_number INTEGER,
  personality_number INTEGER,
  birth_day_number INTEGER,
  numerology_chart TEXT, -- JSON存储完整命理图表
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_session_id) REFERENCES test_sessions(id)
);

-- 扩展系统配置表
INSERT OR IGNORE INTO sys_configs (key, value, description, is_public) VALUES
('platform_name', '综合测试平台', '平台名称', 1),
('platform_version', '1.0.0', '平台版本', 1),
('max_test_duration', '3600', '测试最大时长（秒）', 0),
('cache_ttl', '86400', '缓存生存时间（秒）', 0),
('rate_limit_requests', '100', '速率限制请求数', 0),
('rate_limit_window', '3600', '速率限制时间窗口（秒）', 0),
('enable_analytics', 'true', '是否启用分析统计', 0),
('enable_feedback', 'true', '是否启用用户反馈', 0);

-- 创建模块专用索引
CREATE INDEX IF NOT EXISTS idx_psychology_sessions_test_session ON psychology_sessions(test_session_id);
CREATE INDEX IF NOT EXISTS idx_psychology_sessions_subtype ON psychology_sessions(test_subtype);
CREATE INDEX IF NOT EXISTS idx_astrology_sessions_test_session ON astrology_sessions(test_session_id);
CREATE INDEX IF NOT EXISTS idx_astrology_sessions_sun_sign ON astrology_sessions(sun_sign);
CREATE INDEX IF NOT EXISTS idx_tarot_sessions_test_session ON tarot_sessions(test_session_id);
CREATE INDEX IF NOT EXISTS idx_tarot_sessions_spread_type ON tarot_sessions(spread_type);
CREATE INDEX IF NOT EXISTS idx_career_sessions_test_session ON career_sessions(test_session_id);
CREATE INDEX IF NOT EXISTS idx_career_sessions_subtype ON career_sessions(test_subtype);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_test_session ON learning_sessions(test_session_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_subtype ON learning_sessions(test_subtype);
CREATE INDEX IF NOT EXISTS idx_relationship_sessions_test_session ON relationship_sessions(test_session_id);
CREATE INDEX IF NOT EXISTS idx_relationship_sessions_subtype ON relationship_sessions(test_subtype);
CREATE INDEX IF NOT EXISTS idx_numerology_sessions_test_session ON numerology_sessions(test_session_id);
CREATE INDEX IF NOT EXISTS idx_numerology_sessions_birth_date ON numerology_sessions(birth_date);