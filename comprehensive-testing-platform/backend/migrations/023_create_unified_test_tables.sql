-- 创建通用测试表的数据库迁移
-- 支持所有测试模块的统一数据管理

-- 通用测试会话表
CREATE TABLE IF NOT EXISTS unified_test_sessions (
    id TEXT PRIMARY KEY,
    test_type_id TEXT NOT NULL,           -- 测试类型标识 (mbti, holland, loveLanguage等)
    module_type TEXT NOT NULL,            -- 模块类型 (psychology, career, relationship等)
    status TEXT NOT NULL DEFAULT 'created', -- 会话状态: created, in_progress, completed, abandoned, expired
    answers_data TEXT,                    -- JSON格式存储答案数据
    result_data TEXT,                     -- JSON格式存储结果数据
    metadata TEXT,                        -- JSON格式存储扩展元数据
    user_agent TEXT,                      -- 用户代理
    ip_address_hash TEXT,                 -- IP地址哈希
    session_duration INTEGER DEFAULT 0,   -- 会话持续时间(秒)
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 通用测试进度表
CREATE TABLE IF NOT EXISTS unified_test_progress (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,             -- 关联的会话ID
    test_type_id TEXT NOT NULL,           -- 测试类型标识
    module_type TEXT NOT NULL,            -- 模块类型
    current_question INTEGER DEFAULT 0,   -- 当前题目索引
    answers TEXT,                         -- JSON格式存储答案
    time_spent INTEGER DEFAULT 0,         -- 已用时间(秒)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES unified_test_sessions(id) ON DELETE CASCADE
);

-- 通用测试结果表
CREATE TABLE IF NOT EXISTS unified_test_results (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,             -- 关联的会话ID
    test_type_id TEXT NOT NULL,           -- 测试类型标识
    module_type TEXT NOT NULL,            -- 模块类型
    result_type TEXT NOT NULL,            -- 结果类型
    scores TEXT,                          -- JSON格式存储分数
    interpretation TEXT,                  -- 结果解释
    recommendations TEXT,                 -- JSON格式存储建议
    detailed_analysis TEXT,               -- JSON格式存储详细分析
    confidence REAL DEFAULT 0.0,          -- 置信度 (0.0-1.0)
    metadata TEXT,                        -- JSON格式存储扩展元数据
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES unified_test_sessions(id) ON DELETE CASCADE
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_unified_sessions_test_type ON unified_test_sessions(test_type_id);
CREATE INDEX IF NOT EXISTS idx_unified_sessions_module_type ON unified_test_sessions(module_type);
CREATE INDEX IF NOT EXISTS idx_unified_sessions_status ON unified_test_sessions(status);
CREATE INDEX IF NOT EXISTS idx_unified_sessions_created_at ON unified_test_sessions(created_at);

CREATE INDEX IF NOT EXISTS idx_unified_progress_session_id ON unified_test_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_unified_progress_test_type ON unified_test_progress(test_type_id);
CREATE INDEX IF NOT EXISTS idx_unified_progress_module_type ON unified_test_progress(module_type);

CREATE INDEX IF NOT EXISTS idx_unified_results_session_id ON unified_test_results(session_id);
CREATE INDEX IF NOT EXISTS idx_unified_results_test_type ON unified_test_results(test_type_id);
CREATE INDEX IF NOT EXISTS idx_unified_results_module_type ON unified_test_results(module_type);

-- 插入一些示例数据用于测试
INSERT OR IGNORE INTO unified_test_sessions (id, test_type_id, module_type, status, metadata) VALUES
('session_001', 'mbti', 'psychology', 'completed', '{"source": "web", "version": "1.0"}'),
('session_002', 'holland', 'career', 'in_progress', '{"source": "mobile", "version": "1.0"}'),
('session_003', 'loveLanguage', 'relationship', 'created', '{"source": "web", "version": "1.0"}');

-- 创建视图：测试统计信息
CREATE VIEW IF NOT EXISTS v_test_statistics AS
SELECT 
    module_type,
    test_type_id,
    COUNT(*) as total_sessions,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_sessions,
    COUNT(CASE WHEN status = 'abandoned' THEN 1 END) as abandoned_sessions,
    AVG(session_duration) as avg_session_duration,
    ROUND(CAST(COUNT(CASE WHEN status = 'completed' THEN 1 END) AS REAL) / COUNT(*) * 100, 2) as completion_rate
FROM unified_test_sessions
GROUP BY module_type, test_type_id;

-- 创建视图：用户测试历史
CREATE VIEW IF NOT EXISTS v_user_test_history AS
SELECT 
    s.id as session_id,
    s.test_type_id,
    s.module_type,
    s.status,
    s.started_at,
    s.completed_at,
    s.session_duration,
    r.scores,
    r.interpretation
FROM unified_test_sessions s
LEFT JOIN unified_test_results r ON s.id = r.session_id
ORDER BY s.created_at DESC;
