/**
 * 数据库迁移定义
 * 包含所有数据库迁移的SQL语句
 */

import type { Migration } from './migrationRunner';

// 迁移文件内容
const migration001 = `-- 综合测试平台初始数据库架构
-- 遵循统一开发标准的数据库设计规范

-- 测试类型表
CREATE TABLE IF NOT EXISTS test_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  config_data TEXT NOT NULL, -- JSON配置
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 测试会话表
CREATE TABLE IF NOT EXISTS test_sessions (
  id TEXT PRIMARY KEY,
  test_type_id TEXT NOT NULL,
  answers_data TEXT NOT NULL, -- JSON数组
  result_data TEXT NOT NULL, -- JSON对象
  user_agent TEXT,
  ip_address_hash TEXT, -- 哈希后的IP地址
  session_duration INTEGER, -- 测试用时（秒）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_type_id) REFERENCES test_types(id)
);

-- 用户反馈表
CREATE TABLE IF NOT EXISTS user_feedback (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  feedback_type TEXT NOT NULL, -- 'like', 'dislike', 'comment'
  content TEXT,
  rating INTEGER, -- 1-5星评分
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES test_sessions(id)
);

-- 博客文章表
CREATE TABLE IF NOT EXISTS blog_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT,
  tags_data TEXT, -- JSON数组
  slug TEXT UNIQUE, -- 供前端按 slug 访问
  cover_image TEXT, -- 封面图（可选）
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT 0,
  is_featured BOOLEAN DEFAULT 0,
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 分析事件表
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data TEXT, -- JSON对象
  session_id TEXT,
  ip_address_hash TEXT,
  user_agent TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES test_sessions(id)
);

-- 系统配置表
CREATE TABLE IF NOT EXISTS sys_configs (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT 0, -- 是否可公开访问
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 统一索引规范
CREATE INDEX IF NOT EXISTS idx_test_sessions_test_type ON test_sessions(test_type_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_created_at ON test_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_feedback_session_id ON user_feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_blog_articles_published ON blog_articles(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_blog_articles_category ON blog_articles(category);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);`;

const migration002 = `-- 模块专用数据表
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
CREATE INDEX IF NOT EXISTS idx_numerology_sessions_birth_date ON numerology_sessions(birth_date);`;

const migration003 = `-- 问题银行数据表
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
('cat_raven', '瑞文推理测试', 'raven', '评估抽象推理和逻辑思维能力', '["推理能力"]', 'binary', 0, 60, 1800),
('cat_cognitive', '认知能力测试', 'cognitive', '综合评估认知功能', '["记忆力", "注意力", "处理速度", "执行功能"]', 'likert', 0, 100, 1200);

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
('opt_phq9_9_3', 'q_phq9_9', '几乎每天', 'Nearly every day', '3', 3, 4);`;

// 创建详细反馈表与索引
const migration004 = `
CREATE TABLE IF NOT EXISTS user_feedback_details (
  id TEXT PRIMARY KEY,
  test_type TEXT NOT NULL,
  test_id TEXT,
  result_id TEXT,
  session_id TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  email TEXT,
  can_contact INTEGER NOT NULL DEFAULT 0,
  screenshot_url TEXT,
  client_ua TEXT,
  client_platform TEXT,
  client_locale TEXT,
  ip_hash TEXT,
  created_at TEXT NOT NULL,
  images_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_feedback_details_created_at ON user_feedback_details (created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_details_test_type ON user_feedback_details (test_type, created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_details_session ON user_feedback_details (session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_details_category ON user_feedback_details (category, created_at);
`;

/**
 * 所有数据库迁移的定义
 */
export const migrations: Migration[] = [
  {
    id: '001_initial_schema',
    name: 'Initial database schema',
    sql: migration001
  },
  {
    id: '002_module_specific_tables',
    name: 'Module specific tables',
    sql: migration002
  },
  {
    id: '003_question_bank_tables',
    name: 'Question bank tables',
    sql: migration003
  },
  {
    id: '004_feedback_details',
    name: 'Create user_feedback_details table',
    sql: migration004
  }
];

/**
 * 获取所有迁移
 */
export function getAllMigrations(): Migration[] {
  return migrations;
}

/**
 * 根据ID获取迁移
 */
export function getMigrationById(id: string): Migration | undefined {
  return migrations.find(migration => migration.id === id);
}