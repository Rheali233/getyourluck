-- Ensure all career questions/options use English-only text
-- This migration standardizes any non-English content to English fields

-- Update category descriptions to English (idempotent)
UPDATE psychology_question_categories
SET description = 'Holland RIASEC career interest assessment (English)'
WHERE id = 'holland-category';

UPDATE psychology_question_categories
SET description = 'DISC behavioral style assessment (English)'
WHERE id = 'disc-category';

UPDATE psychology_question_categories
SET description = 'Leadership multi-dimensional assessment (English)'
WHERE id = 'leadership-category';

-- Copy English fields into primary fields if needed for questions
UPDATE psychology_questions
SET question_text = COALESCE(question_text_en, question_text)
WHERE category_id IN ('holland-category', 'disc-category', 'leadership-category');

-- Copy English fields into primary fields for options
UPDATE psychology_question_options
SET option_text = COALESCE(option_text_en, option_text)
WHERE question_id IN (
  SELECT id FROM psychology_questions
  WHERE category_id IN ('holland-category', 'disc-category', 'leadership-category')
);

-- Normalize option descriptions to English keywords
UPDATE psychology_question_options
SET option_description = CASE option_value
  WHEN '1' THEN 'Strongly disagree'
  WHEN '2' THEN 'Disagree'
  WHEN '3' THEN 'Neutral'
  WHEN '4' THEN 'Agree'
  WHEN '5' THEN 'Strongly agree'
  ELSE option_description
END
WHERE question_id IN (
  SELECT id FROM psychology_questions
  WHERE category_id IN ('holland-category', 'disc-category', 'leadership-category')
);

-- Ensure categories remain active
UPDATE psychology_question_categories
SET is_active = 1
WHERE id IN ('holland-category', 'disc-category', 'leadership-category');


