-- D1数据库生产环境设置脚本
-- 执行前请确保已创建生产环境数据库

-- 1. 创建生产环境数据库表结构
-- 首页模块相关表
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
  features_data TEXT NOT NULL,
  estimated_time TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS homepage_config (
  config_key TEXT PRIMARY KEY,
  config_value TEXT NOT NULL,
  config_type TEXT NOT NULL CHECK (config_type IN ('string', 'number', 'boolean', 'json')),
  is_public BOOLEAN DEFAULT 1,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS homepage_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stat_type TEXT NOT NULL,
  stat_value REAL NOT NULL,
  stat_date DATE NOT NULL,
  module_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES homepage_modules(id)
);

-- 搜索相关表
CREATE TABLE IF NOT EXISTS search_index (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT,
  tags TEXT,
  language TEXT DEFAULT 'zh-CN',
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS search_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  query TEXT NOT NULL,
  results_count INTEGER DEFAULT 0,
  user_agent TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS popular_search_keywords (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyword TEXT NOT NULL UNIQUE,
  search_count INTEGER DEFAULT 1,
  last_searched DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 用户偏好和隐私相关表
CREATE TABLE IF NOT EXISTS user_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,
  language TEXT DEFAULT 'zh-CN',
  theme TEXT DEFAULT 'light',
  notification_settings TEXT DEFAULT '{}',
  custom_preferences TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_consents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  consent_type TEXT NOT NULL,
  granted BOOLEAN NOT NULL,
  timestamp DATETIME NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 推荐系统相关表
CREATE TABLE IF NOT EXISTS recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  session_id TEXT,
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  score REAL NOT NULL,
  reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  session_id TEXT,
  user_agent TEXT,
  ip_address TEXT,
  view_duration INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 匿名分析表
CREATE TABLE IF NOT EXISTS anonymous_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  data_type TEXT NOT NULL,
  count_value INTEGER DEFAULT 0,
  unique_count INTEGER DEFAULT 0,
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 数据删除日志表
CREATE TABLE IF NOT EXISTS data_deletion_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  deletion_type TEXT NOT NULL,
  deleted_at DATETIME NOT NULL,
  reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_homepage_modules_theme ON homepage_modules(theme);
CREATE INDEX IF NOT EXISTS idx_homepage_modules_active ON homepage_modules(is_active);
CREATE INDEX IF NOT EXISTS idx_homepage_modules_sort ON homepage_modules(sort_order);

CREATE INDEX IF NOT EXISTS idx_search_index_content_type ON search_index(content_type);
CREATE INDEX IF NOT EXISTS idx_search_index_language ON search_index(language);
CREATE INDEX IF NOT EXISTS idx_search_index_active ON search_index(is_active);

CREATE INDEX IF NOT EXISTS idx_search_history_session ON search_history(session_id);
CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(query);
CREATE INDEX IF NOT EXISTS idx_search_history_date ON search_history(created_at);

CREATE INDEX IF NOT EXISTS idx_user_consents_session ON user_consents(session_id);
CREATE INDEX IF NOT EXISTS idx_user_consents_type ON user_consents(consent_type);
CREATE INDEX IF NOT EXISTS idx_user_consents_expires ON user_consents(expires_at);

CREATE INDEX IF NOT EXISTS idx_recommendations_session ON recommendations(session_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_content ON recommendations(content_type, content_id);

CREATE INDEX IF NOT EXISTS idx_content_views_content ON content_views(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_content_views_date ON content_views(created_at);

-- 3. 插入生产环境初始数据
INSERT OR REPLACE INTO homepage_modules (id, name, description, icon, theme, test_count, rating, is_active, route, features_data, estimated_time, sort_order) VALUES
('psychology-001', '心理测试', '专业的心理测评工具，帮助了解自我', '🧠', 'psychology', 1250, 4.8, 1, '/psychology', '["专业量表", "即时分析", "详细报告"]', '15-20分钟', 1),
('astrology-001', '占星分析', '基于星座的个性化分析和预测', '⭐', 'astrology', 890, 4.6, 1, '/astrology', '["星座解读", "运势预测", "性格分析"]', '10-15分钟', 2),
('tarot-001', '塔罗占卜', '神秘的塔罗牌解读和指引', '🔮', 'tarot', 756, 4.7, 1, '/tarot', '["塔罗解读", "问题解答", "未来指引"]', '5-10分钟', 3),
('career-001', '职业测试', '职业倾向和能力评估', '💼', 'career', 634, 4.5, 1, '/career', '["职业匹配", "能力评估", "发展建议"]', '20-25分钟', 4),
('numerology-001', '数字命理', '数字背后的生命密码解读', '🔢', 'numerology', 445, 4.4, 1, '/numerology', '["数字分析", "生命密码", "运势解读"]', '8-12分钟', 5),
('learning-001', '学习能力', '学习风格和效率评估', '📚', 'learning', 567, 4.6, 1, '/learning', '["学习风格", "效率评估", "优化建议"]', '12-18分钟', 6),
('relationship-001', '关系测试', '人际关系和沟通能力测评', '💕', 'relationship', 678, 4.7, 1, '/relationship', '["沟通能力", "关系模式", "改善建议"]', '15-20分钟', 7);

INSERT OR REPLACE INTO homepage_config (config_key, config_value, config_type, is_public, description) VALUES
('site_title', 'GetYourLuck - 综合测试平台', 'string', 1, '网站标题'),
('site_description', '专业的心理测试、占星分析、塔罗占卜等综合测试平台', 'string', 1, '网站描述'),
('site_keywords', '心理测试,占星分析,塔罗占卜,职业测试,数字命理,学习能力,关系测试', 'string', 1, '网站关键词'),
('enable_analytics', 'true', 'boolean', 1, '是否启用分析功能'),
('enable_cache', 'true', 'boolean', 1, '是否启用缓存'),
('cache_ttl', '3600', 'number', 1, '缓存生存时间（秒）'),
('max_search_results', '50', 'number', 1, '最大搜索结果数量'),
('enable_recommendations', 'true', 'boolean', 1, '是否启用推荐系统'),
('gdpr_compliance', 'true', 'boolean', 1, '是否启用GDPR合规'),
('data_retention_days', '730', 'number', 1, '数据保留天数');

-- 4. 设置生产环境特定的配置
UPDATE homepage_config SET config_value = 'production' WHERE config_key = 'environment';
UPDATE homepage_config SET config_value = 'https://api.getyourluck.com' WHERE config_key = 'api_base_url';
UPDATE homepage_config SET config_value = 'https://cdn.getyourluck.com' WHERE config_key = 'cdn_base_url';

-- 5. 创建生产环境统计视图
CREATE VIEW IF NOT EXISTS production_stats AS
SELECT 
  'total_modules' as stat_name,
  COUNT(*) as stat_value,
  DATE('now') as stat_date
FROM homepage_modules 
WHERE is_active = 1
UNION ALL
SELECT 
  'total_tests' as stat_name,
  SUM(test_count) as stat_value,
  DATE('now') as stat_date
FROM homepage_modules 
WHERE is_active = 1
UNION ALL
SELECT 
  'avg_rating' as stat_name,
  AVG(rating) as stat_value,
  DATE('now') as stat_date
FROM homepage_modules 
WHERE is_active = 1;

-- 6. 设置生产环境权限
-- 注意：D1数据库的权限管理通过Cloudflare控制台进行

PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = 10000;
PRAGMA temp_store = memory;
PRAGMA mmap_size = 268435456;
