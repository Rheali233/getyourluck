-- 塔罗牌模块数据表
-- 遵循统一开发标准的数据库设计规范

-- 塔罗牌基础信息表
CREATE TABLE IF NOT EXISTS tarot_cards (
  id TEXT PRIMARY KEY,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  suit TEXT NOT NULL CHECK (suit IN ('major', 'wands', 'cups', 'swords', 'pentacles')),
  number INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  keywords_zh TEXT NOT NULL, -- JSON数组
  keywords_en TEXT NOT NULL, -- JSON数组
  meaning_upright_zh TEXT NOT NULL,
  meaning_upright_en TEXT NOT NULL,
  meaning_reversed_zh TEXT NOT NULL,
  meaning_reversed_en TEXT NOT NULL,
  element TEXT,
  astrological_sign TEXT,
  planet TEXT,
  description_zh TEXT NOT NULL,
  description_en TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 问题分类表
CREATE TABLE IF NOT EXISTS tarot_categories (
  id TEXT PRIMARY KEY,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_zh TEXT NOT NULL,
  description_en TEXT NOT NULL,
  icon TEXT NOT NULL,
  color_theme TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 牌阵配置表
CREATE TABLE IF NOT EXISTS tarot_spreads (
  id TEXT PRIMARY KEY,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_zh TEXT NOT NULL,
  description_en TEXT NOT NULL,
  card_count INTEGER NOT NULL,
  layout_config TEXT NOT NULL, -- JSON配置
  positions TEXT NOT NULL, -- JSON数组
  difficulty_level INTEGER NOT NULL DEFAULT 1,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_tarot_cards_suit ON tarot_cards(suit);
CREATE INDEX IF NOT EXISTS idx_tarot_cards_number ON tarot_cards(number);
CREATE INDEX IF NOT EXISTS idx_tarot_categories_sort_order ON tarot_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_tarot_spreads_active ON tarot_spreads(is_active);
CREATE INDEX IF NOT EXISTS idx_tarot_spreads_difficulty ON tarot_spreads(difficulty_level);

-- 插入问题分类数据
INSERT OR REPLACE INTO tarot_categories (id, name_zh, name_en, description_zh, description_en, icon, color_theme, sort_order) VALUES
('love', '爱情关系', 'Love & Relationships', '关于爱情、感情关系和人际交往的问题', 'Questions about love, emotional relationships, and interpersonal communication', '💕', 'pink', 1),
('career', '事业工作', 'Career & Work', '关于职业发展、工作选择和事业规划的问题', 'Questions about career development, work choices, and career planning', '💼', 'blue', 2),
('finance', '财务金钱', 'Finance & Money', '关于财务规划、投资决策和金钱管理的问题', 'Questions about financial planning, investment decisions, and money management', '💰', 'green', 3),
('health', '健康生活', 'Health & Wellness', '关于身体健康、心理健康和生活方式的问题', 'Questions about physical health, mental health, and lifestyle', '🏥', 'red', 4),
('spiritual', '精神成长', 'Spiritual Growth', '关于精神发展、内在成长和人生意义的问题', 'Questions about spiritual development, inner growth, and life meaning', '🕊️', 'purple', 5),
('general', '一般指导', 'General Guidance', '关于日常生活、决策选择和未来规划的一般性问题', 'General questions about daily life, decision-making, and future planning', '🌟', 'yellow', 6);

-- 插入牌阵配置数据
INSERT OR REPLACE INTO tarot_spreads (id, name_zh, name_en, description_zh, description_en, card_count, layout_config, positions, difficulty_level, usage_count, is_active) VALUES
('single_card', '单张牌', 'Single Card', '简单直接的指导，适合日常问题', 'Simple and direct guidance, suitable for daily questions', 1, '{"positions": [{"x": 0, "y": 0, "rotation": 0}]}', '[{"name": "guidance", "meaning": "当前情况的指导和启示"}]', 1, 0, 1),
('three_card', '三张牌', 'Three Card Spread', '过去、现在、未来的时间线解读', 'Past, present, future timeline reading', 3, '{"positions": [{"x": -100, "y": 0, "rotation": 0}, {"x": 0, "y": 0, "rotation": 0}, {"x": 100, "y": 0, "rotation": 0}]}', '[{"name": "past", "meaning": "过去的影响和经验"}, {"name": "present", "meaning": "当前的情况和挑战"}, {"name": "future", "meaning": "未来的可能性和结果"}]', 2, 0, 1),
('celtic_cross', '凯尔特十字', 'Celtic Cross', '最经典的牌阵，提供全面的深度解读', 'The most classic spread, providing comprehensive deep reading', 10, '{"positions": [{"x": 0, "y": 0, "rotation": 0}, {"x": 0, "y": -50, "rotation": 90}, {"x": -50, "y": 0, "rotation": 0}, {"x": 50, "y": 0, "rotation": 0}, {"x": 0, "y": 50, "rotation": 0}, {"x": 0, "y": -100, "rotation": 0}, {"x": 100, "y": -100, "rotation": 0}, {"x": 100, "y": -50, "rotation": 0}, {"x": 100, "y": 0, "rotation": 0}, {"x": 100, "y": 50, "rotation": 0}]}', '[{"name": "situation", "meaning": "当前情况的核心"}, {"name": "challenge", "meaning": "主要挑战或障碍"}, {"name": "past", "meaning": "过去的影响"}, {"name": "future", "meaning": "未来的可能性"}, {"name": "above", "meaning": "可能的结果"}, {"name": "below", "meaning": "潜在的影响"}, {"name": "advice", "meaning": "建议和指导"}, {"name": "external", "meaning": "外部影响"}, {"name": "hopes_fears", "meaning": "希望和恐惧"}, {"name": "outcome", "meaning": "最终结果"}]', 5, 0, 1),
('relationship', '关系牌阵', 'Relationship Spread', '专门用于分析感情关系的牌阵', 'Spread specifically for analyzing emotional relationships', 7, '{"positions": [{"x": -80, "y": 0, "rotation": 0}, {"x": 80, "y": 0, "rotation": 0}, {"x": 0, "y": -60, "rotation": 0}, {"x": 0, "y": 60, "rotation": 0}, {"x": -40, "y": -30, "rotation": 0}, {"x": 40, "y": -30, "rotation": 0}, {"x": 0, "y": 0, "rotation": 0}]}', '[{"name": "you", "meaning": "你在关系中的状态"}, {"name": "partner", "meaning": "对方在关系中的状态"}, {"name": "connection", "meaning": "你们之间的连接"}, {"name": "challenges", "meaning": "关系中的挑战"}, {"name": "your_needs", "meaning": "你的需求"}, {"name": "their_needs", "meaning": "对方的需求"}, {"name": "future", "meaning": "关系的未来"}]', 3, 0, 1),
('career', '事业牌阵', 'Career Spread', '专门用于职业发展和工作选择的牌阵', 'Spread specifically for career development and work choices', 5, '{"positions": [{"x": 0, "y": -60, "rotation": 0}, {"x": -60, "y": 0, "rotation": 0}, {"x": 60, "y": 0, "rotation": 0}, {"x": -30, "y": 60, "rotation": 0}, {"x": 30, "y": 60, "rotation": 0}]}', '[{"name": "current_situation", "meaning": "当前的工作状况"}, {"name": "strengths", "meaning": "你的优势和技能"}, {"name": "challenges", "meaning": "面临的挑战"}, {"name": "opportunities", "meaning": "未来的机会"}, {"name": "advice", "meaning": "职业发展建议"}]', 3, 0, 1);
