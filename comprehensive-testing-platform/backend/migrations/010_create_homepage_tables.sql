-- 首页模块数据库表结构
-- 遵循统一开发标准的数据库设计规范

-- 首页测试模块配置表
CREATE TABLE IF NOT EXISTS homepage_modules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  theme TEXT NOT NULL CHECK (theme IN ('psychology', 'astrology', 'tarot', 'career', 'numerology', 'learning', 'relationship')),
  test_count INTEGER DEFAULT 0,
  rating REAL DEFAULT 0.0,
  is_active BOOLEAN DEFAULT 1,
  route TEXT NOT NULL,
  features_data TEXT NOT NULL, -- JSON数组存储功能特性
  estimated_time TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 首页用户行为分析表
CREATE TABLE IF NOT EXISTS homepage_analytics (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'module_click', 'search_query', 'cta_click', 'scroll_depth')),
  event_data TEXT, -- JSON对象存储事件详细数据
  user_agent TEXT,
  ip_address_hash TEXT, -- 哈希后的IP地址
  referrer TEXT,
  page_url TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES test_sessions(id) ON DELETE SET NULL
);

-- 搜索索引表
CREATE TABLE IF NOT EXISTS search_index (
  id TEXT PRIMARY KEY,
  content_type TEXT NOT NULL CHECK (content_type IN ('test', 'blog', 'category', 'tag')),
  content_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  keywords TEXT, -- 逗号分隔的关键词
  language TEXT NOT NULL DEFAULT 'zh-CN',
  relevance_score REAL DEFAULT 1.0,
  search_count INTEGER DEFAULT 0,
  last_searched DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 用户偏好设置表
CREATE TABLE IF NOT EXISTS user_preferences (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  language TEXT NOT NULL DEFAULT 'zh-CN' CHECK (language IN ('zh-CN', 'en-US')),
  theme TEXT NOT NULL DEFAULT 'auto' CHECK (theme IN ('light', 'dark', 'auto')),
  cookies_consent BOOLEAN DEFAULT 0,
  analytics_consent BOOLEAN DEFAULT 0,
  marketing_consent BOOLEAN DEFAULT 0,
  notification_enabled BOOLEAN DEFAULT 1,
  search_history_enabled BOOLEAN DEFAULT 1,
  personalized_content BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES test_sessions(id) ON DELETE CASCADE
);

-- 搜索历史表
CREATE TABLE IF NOT EXISTS search_history (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  query TEXT NOT NULL,
  result_count INTEGER DEFAULT 0,
  clicked_result_id TEXT,
  search_time_ms INTEGER, -- 搜索耗时（毫秒）
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES test_sessions(id) ON DELETE CASCADE
);

-- 热门搜索关键词表
CREATE TABLE IF NOT EXISTS popular_search_keywords (
  id TEXT PRIMARY KEY,
  keyword TEXT NOT NULL UNIQUE,
  search_count INTEGER DEFAULT 1,
  last_searched DATETIME DEFAULT CURRENT_TIMESTAMP,
  language TEXT NOT NULL DEFAULT 'zh-CN',
  category TEXT, -- 关键词分类
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 首页配置表
CREATE TABLE IF NOT EXISTS homepage_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL, -- JSON格式的配置值
  description TEXT,
  is_public BOOLEAN DEFAULT 1,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_homepage_modules_theme ON homepage_modules(theme, is_active);
CREATE INDEX IF NOT EXISTS idx_homepage_modules_sort ON homepage_modules(sort_order, is_active);
CREATE INDEX IF NOT EXISTS idx_homepage_analytics_event ON homepage_analytics(event_type, timestamp);
CREATE INDEX IF NOT EXISTS idx_homepage_analytics_session ON homepage_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_search_index_type ON search_index(content_type, language);
CREATE INDEX IF NOT EXISTS idx_search_index_keywords ON search_index(keywords);
CREATE INDEX IF NOT EXISTS idx_search_index_relevance ON search_index(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_user_preferences_session ON user_preferences(session_id);
CREATE INDEX IF NOT EXISTS idx_search_history_session ON search_history(session_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(query);
CREATE INDEX IF NOT EXISTS idx_popular_keywords_lang ON popular_search_keywords(language, search_count DESC);

-- 插入默认首页配置数据
INSERT OR REPLACE INTO homepage_config (key, value, description) VALUES
('hero_section', '{"title": "发现真实的自己，遇见更好的未来", "subtitle": "🌟 通过趣味心理测试和AI智能分析，3分钟get你的性格密码！", "description": "还在为"我是谁？"而困惑吗？想知道什么职业最适合你？无需注册，测完就走，专业报告即刻到手 ✨", "features": ["🔬 科学靠谱", "🎯 准到心坎", "🔒 绝对保密", "⚡ 秒出结果", "📱 随时随地"], "ctaText": "开始测试", "ctaRoute": "/tests"}', '首页英雄区域配置'),
('test_modules', '[]', '测试模块配置列表'),
('platform_features', '[]', '平台特色功能配置'),
('seo_meta', '{"title": "综合测试平台 - 心理测试、占星分析、塔罗占卜", "description": "专业的在线测试平台，提供MBTI性格测试、星座运势、塔罗占卜等多种测试服务，帮助你更好地了解自己。", "keywords": "心理测试,MBTI测试,星座运势,塔罗占卜,职业测试,性格测试"}', 'SEO元数据配置');

-- 插入默认测试模块数据
INSERT OR REPLACE INTO homepage_modules (id, name, description, icon, theme, test_count, rating, is_active, route, features_data, estimated_time, sort_order) VALUES
('psychology', '心理健康测试', '揭秘你的性格密码', '🧠', 'psychology', 1200, 4.8, 1, '/psychology', '["MBTI", "抑郁", "情商"]', '3-5分钟', 1),
('astrology', '星座运势分析', '今日运势早知道', '⭐', 'astrology', 2100, 4.7, 1, '/astrology', '["星座配对", "运势"]', '1-2分钟', 2),
('tarot', '塔罗牌占卜', '神秘塔罗解心事', '🔮', 'tarot', 890, 4.6, 1, '/tarot', '["在线抽牌", "解读"]', '2-3分钟', 3),
('career', '职业规划测试', '找到最适合的工作', '📊', 'career', 1500, 4.9, 1, '/career', '["霍兰德", "DISC测试"]', '5-8分钟', 4),
('numerology', '传统命理分析', '算出你的好运气', '🧮', 'numerology', 756, 4.5, 0, '/numerology', '["八字", "生肖", "姓名"]', '3-5分钟', 5),
('learning', '学习能力评估', '发现学习超能力', '📚', 'learning', 980, 4.7, 1, '/learning', '["学习风格", "认知能力"]', '4-6分钟', 6),
('relationship', '情感关系测试', '了解你的爱情密码', '💕', 'relationship', 1340, 4.8, 1, '/relationship', '["恋爱类型", "沟通方式"]', '3-5分钟', 7);
