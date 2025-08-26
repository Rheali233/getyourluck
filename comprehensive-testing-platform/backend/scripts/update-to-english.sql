-- Update Psychology Questions to English Only
-- This script updates the database to use English questions as the primary questions

-- First, update all questions to use English text as the primary text
UPDATE psychology_questions 
SET question_text = question_text_en 
WHERE question_text_en IS NOT NULL AND question_text_en != '';

-- Remove the question_text_en column since we no longer need it
-- Note: SQLite doesn't support DROP COLUMN directly, so we'll need to recreate the table
-- For now, we'll just clear the question_text_en column
UPDATE psychology_questions 
SET question_text_en = NULL;

-- Update question options to use English text as the primary text
UPDATE psychology_question_options 
SET option_text = option_text_en 
WHERE option_text_en IS NOT NULL AND option_text_en != '';

-- Clear the option_text_en column
UPDATE psychology_question_options 
SET option_text_en = NULL;

-- Update category names to English
UPDATE psychology_question_categories 
SET name = CASE 
  WHEN code = 'mbti' THEN 'MBTI Personality Test'
  WHEN code = 'phq9' THEN 'PHQ-9 Depression Screening'
  WHEN code = 'eq' THEN 'Emotional Intelligence Test'
  WHEN code = 'happiness' THEN 'Happiness Index Assessment'
  ELSE name
END;

-- Update category descriptions to English
UPDATE psychology_question_categories 
SET description = CASE 
  WHEN code = 'mbti' THEN '16 personality types test based on Jungian typology'
  WHEN code = 'phq9' THEN '9-item depression symptoms screening scale'
  WHEN code = 'eq' THEN 'Assess five dimensions of emotional intelligence: self-awareness, self-regulation, motivation, empathy, social skills'
  WHEN code = 'happiness' THEN 'Happiness index assessment scale based on PERMA model'
  ELSE description
END;

-- Verify the updates
SELECT 'Questions updated to English' as status, COUNT(*) as count 
FROM psychology_questions 
WHERE question_text NOT LIKE '%[\u4e00-\u9fff]%';

SELECT 'Options updated to English' as status, COUNT(*) as count 
FROM psychology_question_options 
WHERE option_text NOT LIKE '%[\u4e00-\u9fff]%';
