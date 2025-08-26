-- Relationship Module Database Tables
-- Following unified database design standards

-- Relationship test sessions table
CREATE TABLE IF NOT EXISTS relationship_sessions (
  id TEXT PRIMARY KEY,
  session_type TEXT NOT NULL DEFAULT 'relationship_test',
  test_type TEXT NOT NULL, -- 'love_language' | 'love_style' | 'interpersonal'
  input_data TEXT NOT NULL, -- JSON存储用户答题数据
  ai_response_data TEXT NOT NULL, -- JSON存储AI完整分析
  user_feedback TEXT, -- 'like' | 'dislike' | null
  language TEXT DEFAULT 'en',
  user_agent TEXT,
  ip_address_hash TEXT, -- 哈希后的IP地址
  session_duration INTEGER, -- 测试用时（秒）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Relationship questions table
CREATE TABLE IF NOT EXISTS relationship_questions (
  id INTEGER PRIMARY KEY,
  test_type TEXT NOT NULL, -- 'love_language' | 'love_style' | 'interpersonal'
  question_number INTEGER NOT NULL,
  question TEXT NOT NULL,
  options TEXT, -- JSON存储选项
  scale_type TEXT NOT NULL, -- 'likert_5' | 'likert_7' | 'binary' | 'multiple_choice'
  dimension TEXT, -- 维度分类
  category TEXT, -- 子分类
  reverse_scored BOOLEAN DEFAULT 0, -- 是否反向计分
  weight REAL DEFAULT 1.0, -- 题目权重
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_relationship_sessions_type_date ON relationship_sessions(test_type, created_at);
CREATE INDEX idx_relationship_sessions_feedback ON relationship_sessions(user_feedback, created_at);
CREATE INDEX idx_relationship_sessions_created ON relationship_sessions(created_at DESC);
CREATE INDEX idx_relationship_questions_test_type ON relationship_questions(test_type, question_number);
CREATE INDEX idx_relationship_questions_active ON relationship_questions(is_active, test_type);
CREATE INDEX idx_relationship_questions_dimension ON relationship_questions(dimension, test_type);
