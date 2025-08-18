-- 综合测试平台初始数据库架构
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
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);