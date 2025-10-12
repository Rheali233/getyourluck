-- 创建统一结果表
-- 用于存储所有测试类型的统一结果数据

CREATE TABLE IF NOT EXISTS unified_results (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    test_type_id TEXT NOT NULL,
    test_category TEXT NOT NULL,
    result_type TEXT NOT NULL,
    scores TEXT NOT NULL, -- JSON格式存储分数
    interpretation TEXT NOT NULL,
    recommendations TEXT NOT NULL, -- JSON格式存储建议数组
    detailed_analysis TEXT, -- JSON格式存储详细分析
    confidence REAL DEFAULT 0.8,
    metadata TEXT, -- JSON格式存储元数据
    created_at TEXT NOT NULL,
    
    -- 外键约束
    FOREIGN KEY (session_id) REFERENCES test_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (test_type_id) REFERENCES test_types(id) ON DELETE CASCADE
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_unified_results_session_id ON unified_results(session_id);
CREATE INDEX IF NOT EXISTS idx_unified_results_test_type_id ON unified_results(test_type_id);
CREATE INDEX IF NOT EXISTS idx_unified_results_test_category ON unified_results(test_category);
CREATE INDEX IF NOT EXISTS idx_unified_results_result_type ON unified_results(result_type);
CREATE INDEX IF NOT EXISTS idx_unified_results_created_at ON unified_results(created_at);

-- 添加约束
CREATE UNIQUE INDEX IF NOT EXISTS idx_unified_results_session_unique ON unified_results(session_id);

-- 注意：SQLite不支持CHECK约束，这些约束在应用层进行验证
