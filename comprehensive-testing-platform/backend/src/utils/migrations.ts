/**
 * 数据库迁移定义
 * 遵循统一开发标准的数据库迁移规范
 */

import type { Migration } from './migrationRunner'

export const migrations: Migration[] = [
  {
    id: '001_initial_schema',
    name: 'Create initial database schema',
    sql: `
      -- 测试类型表
      CREATE TABLE IF NOT EXISTS test_types (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        config_data TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- 测试会话表
      CREATE TABLE IF NOT EXISTS test_sessions (
        id TEXT PRIMARY KEY,
        test_type_id TEXT NOT NULL,
        answers_data TEXT NOT NULL,
        result_data TEXT NOT NULL,
        user_agent TEXT,
        ip_address_hash TEXT,
        session_duration INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (test_type_id) REFERENCES test_types(id)
      );

      -- 用户反馈表
      CREATE TABLE IF NOT EXISTS user_feedback (
        id TEXT PRIMARY KEY,
        session_id TEXT,
        feedback_type TEXT NOT NULL,
        content TEXT,
        rating INTEGER,
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
        tags_data TEXT,
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
        event_data TEXT,
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
        is_public BOOLEAN DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    id: '002_create_indexes',
    name: 'Create database indexes for performance',
    sql: `
      -- 测试会话索引
      CREATE INDEX IF NOT EXISTS idx_test_sessions_test_type ON test_sessions(test_type_id);
      CREATE INDEX IF NOT EXISTS idx_test_sessions_created_at ON test_sessions(created_at);
      
      -- 用户反馈索引
      CREATE INDEX IF NOT EXISTS idx_user_feedback_session_id ON user_feedback(session_id);
      CREATE INDEX IF NOT EXISTS idx_user_feedback_type ON user_feedback(feedback_type);
      
      -- 博客文章索引
      CREATE INDEX IF NOT EXISTS idx_blog_articles_published ON blog_articles(is_published, published_at);
      CREATE INDEX IF NOT EXISTS idx_blog_articles_category ON blog_articles(category);
      CREATE INDEX IF NOT EXISTS idx_blog_articles_featured ON blog_articles(is_featured);
      
      -- 分析事件索引
      CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);
      
      -- 系统配置索引
      CREATE INDEX IF NOT EXISTS idx_sys_configs_public ON sys_configs(is_public);
    `,
  },
  {
    id: '003_insert_default_data',
    name: 'Insert default system data',
    sql: `
      -- 插入默认系统配置
      INSERT OR IGNORE INTO sys_configs (key, value, description, is_public) VALUES
      ('site_name', '综合测试平台', '网站名称', 1),
      ('site_description', '专业的心理测试、占星分析、塔罗占卜等在线测试服务', '网站描述', 1),
      ('max_test_duration', '3600', '测试最大时长（秒）', 0),
      ('cache_ttl', '3600', '缓存过期时间（秒）', 0),
      ('analytics_enabled', 'true', '是否启用分析统计', 0);

      -- 插入默认测试类型（示例数据）
      INSERT OR IGNORE INTO test_types (id, name, category, description, config_data, is_active, sort_order) VALUES
      ('psychology-mbti', 'MBTI性格测试', 'psychology', '基于荣格心理类型理论的性格测试', '{"questionCount": 20, "scoringType": "mbti", "timeLimit": 1800}', 1, 1),
      ('astrology-basic', '基础星座分析', 'astrology', '根据出生信息进行基础星座分析', '{"questionCount": 10, "scoringType": "astrology", "timeLimit": 900}', 1, 2),
      ('tarot-love', '爱情塔罗占卜', 'tarot', '关于爱情和感情的塔罗牌占卜', '{"questionCount": 5, "scoringType": "tarot", "timeLimit": 600}', 1, 3);
    `,
  },
  {
    id: '004_module_specific_tables',
    name: 'Create module-specific session tables',
    sql: `
      -- 心理测试模块专用表
      CREATE TABLE IF NOT EXISTS psychology_sessions (
        id TEXT PRIMARY KEY,
        test_session_id TEXT NOT NULL,
        test_subtype TEXT NOT NULL,
        personality_type TEXT,
        dimension_scores TEXT,
        risk_level TEXT,
        happiness_domains TEXT,
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
        planetary_positions TEXT,
        house_positions TEXT,
        aspects TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (test_session_id) REFERENCES test_sessions(id)
      );

      -- 塔罗牌模块专用表
      CREATE TABLE IF NOT EXISTS tarot_sessions (
        id TEXT PRIMARY KEY,
        test_session_id TEXT NOT NULL,
        spread_type TEXT NOT NULL,
        cards_drawn TEXT NOT NULL,
        card_positions TEXT,
        interpretation_theme TEXT,
        question_category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (test_session_id) REFERENCES test_sessions(id)
      );

      -- 职业发展模块专用表
      CREATE TABLE IF NOT EXISTS career_sessions (
        id TEXT PRIMARY KEY,
        test_session_id TEXT NOT NULL,
        test_subtype TEXT NOT NULL,
        holland_code TEXT,
        interest_scores TEXT,
        values_ranking TEXT,
        skills_profile TEXT,
        career_matches TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (test_session_id) REFERENCES test_sessions(id)
      );

      -- 学习能力模块专用表
      CREATE TABLE IF NOT EXISTS learning_sessions (
        id TEXT PRIMARY KEY,
        test_session_id TEXT NOT NULL,
        test_subtype TEXT NOT NULL,
        learning_style TEXT,
        cognitive_score INTEGER,
        percentile_rank INTEGER,
        learning_preferences TEXT,
        strategy_recommendations TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (test_session_id) REFERENCES test_sessions(id)
      );

      -- 情感关系模块专用表
      CREATE TABLE IF NOT EXISTS relationship_sessions (
        id TEXT PRIMARY KEY,
        test_session_id TEXT NOT NULL,
        test_subtype TEXT NOT NULL,
        primary_love_language TEXT,
        secondary_love_language TEXT,
        attachment_style TEXT,
        relationship_skills TEXT,
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
        numerology_chart TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (test_session_id) REFERENCES test_sessions(id)
      );
    `,
  },
  {
    id: '005_module_indexes',
    name: 'Create indexes for module-specific tables',
    sql: `
      -- 心理测试模块索引
      CREATE INDEX IF NOT EXISTS idx_psychology_sessions_test_session ON psychology_sessions(test_session_id);
      CREATE INDEX IF NOT EXISTS idx_psychology_sessions_subtype ON psychology_sessions(test_subtype);
      CREATE INDEX IF NOT EXISTS idx_psychology_sessions_personality_type ON psychology_sessions(personality_type);

      -- 占星分析模块索引
      CREATE INDEX IF NOT EXISTS idx_astrology_sessions_test_session ON astrology_sessions(test_session_id);
      CREATE INDEX IF NOT EXISTS idx_astrology_sessions_sun_sign ON astrology_sessions(sun_sign);
      CREATE INDEX IF NOT EXISTS idx_astrology_sessions_birth_date ON astrology_sessions(birth_date);

      -- 塔罗牌模块索引
      CREATE INDEX IF NOT EXISTS idx_tarot_sessions_test_session ON tarot_sessions(test_session_id);
      CREATE INDEX IF NOT EXISTS idx_tarot_sessions_spread_type ON tarot_sessions(spread_type);
      CREATE INDEX IF NOT EXISTS idx_tarot_sessions_question_category ON tarot_sessions(question_category);

      -- 职业发展模块索引
      CREATE INDEX IF NOT EXISTS idx_career_sessions_test_session ON career_sessions(test_session_id);
      CREATE INDEX IF NOT EXISTS idx_career_sessions_subtype ON career_sessions(test_subtype);
      CREATE INDEX IF NOT EXISTS idx_career_sessions_holland_code ON career_sessions(holland_code);

      -- 学习能力模块索引
      CREATE INDEX IF NOT EXISTS idx_learning_sessions_test_session ON learning_sessions(test_session_id);
      CREATE INDEX IF NOT EXISTS idx_learning_sessions_subtype ON learning_sessions(test_subtype);
      CREATE INDEX IF NOT EXISTS idx_learning_sessions_learning_style ON learning_sessions(learning_style);

      -- 情感关系模块索引
      CREATE INDEX IF NOT EXISTS idx_relationship_sessions_test_session ON relationship_sessions(test_session_id);
      CREATE INDEX IF NOT EXISTS idx_relationship_sessions_subtype ON relationship_sessions(test_subtype);
      CREATE INDEX IF NOT EXISTS idx_relationship_sessions_attachment_style ON relationship_sessions(attachment_style);

      -- 命理分析模块索引
      CREATE INDEX IF NOT EXISTS idx_numerology_sessions_test_session ON numerology_sessions(test_session_id);
      CREATE INDEX IF NOT EXISTS idx_numerology_sessions_birth_date ON numerology_sessions(birth_date);
      CREATE INDEX IF NOT EXISTS idx_numerology_sessions_life_path ON numerology_sessions(life_path_number);
    `,
  },
]