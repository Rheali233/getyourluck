-- 清理EQ测试中重复的选项记录
-- 基于选项文本和值进行去重，保留第一个出现的选项

-- 1. 首先查看重复的选项
SELECT 
  question_id,
  option_text,
  option_value,
  COUNT(*) as duplicate_count
FROM psychology_question_options 
WHERE question_id LIKE 'eq-q-%'
GROUP BY question_id, option_text, option_value
HAVING COUNT(*) > 1
ORDER BY question_id, option_text, option_value;

-- 2. 删除重复的选项记录，保留ID最小的那个
DELETE FROM psychology_question_options 
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY question_id, option_text, option_value 
             ORDER BY id
           ) as rn
    FROM psychology_question_options 
    WHERE question_id LIKE 'eq-q-%'
  ) ranked
  WHERE rn > 1
);

-- 3. 验证清理结果
SELECT 
  question_id,
  COUNT(*) as option_count
FROM psychology_question_options 
WHERE question_id LIKE 'eq-q-%'
GROUP BY question_id
ORDER BY question_id;

-- 4. 检查是否还有重复
SELECT 
  question_id,
  option_text,
  option_value,
  COUNT(*) as duplicate_count
FROM psychology_question_options 
WHERE question_id LIKE 'eq-q-%'
GROUP BY question_id, option_text, option_value
HAVING COUNT(*) > 1;
