-- 修复 migration 003 的状态
-- 如果表已存在但迁移未记录，则手动标记迁移为已执行

-- 1. 检查表是否存在
SELECT 
  name 
FROM sqlite_master 
WHERE type='table' 
  AND name IN (
    'psychology_question_categories',
    'psychology_questions',
    'psychology_question_options',
    'psychology_question_configs',
    'psychology_question_versions'
  )
ORDER BY name;

-- 2. 检查迁移是否已记录
SELECT 
  id, 
  name, 
  applied_at 
FROM migrations 
WHERE id = '003_question_bank_tables';

-- 3. 如果表存在但迁移未记录，执行以下命令标记迁移为已执行：
-- INSERT OR IGNORE INTO migrations (id, name, applied_at) 
-- VALUES ('003_question_bank_tables', 'Question bank tables', datetime('now'));

