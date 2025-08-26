-- Generate options for all questions using a more efficient approach
-- This script will create options for all questions in all categories

-- Love Style Assessment (30 questions)
INSERT OR IGNORE INTO psychology_question_options (id, question_id, option_text, option_value, option_score, option_description, order_index, is_correct)
SELECT 
    'love-style-' || substr(q.id, 25) || '-opt-' || o.option_number as id,
    q.id as question_id,
    o.option_text,
    o.option_value,
    o.option_score,
    o.option_description,
    o.option_number as order_index,
    0 as is_correct
FROM psychology_questions q
CROSS JOIN (
    SELECT 1 as option_number, 'Strongly Disagree' as option_text, '1' as option_value, 1 as option_score, 'Completely does not match my situation' as option_description
    UNION ALL SELECT 2, 'Disagree', '2', 2, 'Mostly does not match my situation'
    UNION ALL SELECT 3, 'Neutral', '3', 3, 'Partially matches my situation'
    UNION ALL SELECT 4, 'Agree', '4', 4, 'Mostly matches my situation'
    UNION ALL SELECT 5, 'Strongly Agree', '5', 5, 'Completely matches my situation'
) o
WHERE q.category_id = 'love-style-category';

-- Love Language Test (30 questions)
INSERT OR IGNORE INTO psychology_question_options (id, question_id, option_text, option_value, option_score, option_description, order_index, is_correct)
SELECT 
    'love-language-' || substr(q.id, 28) || '-opt-' || o.option_number as id,
    q.id as question_id,
    o.option_text,
    o.option_value,
    o.option_score,
    o.option_description,
    o.option_number as order_index,
    0 as is_correct
FROM psychology_questions q
CROSS JOIN (
    SELECT 1 as option_number, 'Strongly Disagree' as option_text, '1' as option_value, 1 as option_score, 'Completely does not match my situation' as option_description
    UNION ALL SELECT 2, 'Disagree', '2', 2, 'Mostly does not match my situation'
    UNION ALL SELECT 3, 'Neutral', '3', 3, 'Partially matches my situation'
    UNION ALL SELECT 4, 'Agree', '4', 4, 'Mostly matches my situation'
    UNION ALL SELECT 5, 'Strongly Agree', '5', 5, 'Completely matches my situation'
) o
WHERE q.category_id = 'love-language-category';

-- Interpersonal Skills Assessment (30 questions)
INSERT OR IGNORE INTO psychology_question_options (id, question_id, option_text, option_value, option_score, option_description, order_index, is_correct)
SELECT 
    'interpersonal-' || substr(q.id, 25) || '-opt-' || o.option_number as id,
    q.id as question_id,
    o.option_text,
    o.option_value,
    o.option_score,
    o.option_description,
    o.option_number as order_index,
    0 as is_correct
FROM psychology_questions q
CROSS JOIN (
    SELECT 1 as option_number, 'Strongly Disagree' as option_text, '1' as option_value, 1 as option_score, 'Completely does not match my situation' as option_description
    UNION ALL SELECT 2, 'Disagree', '2', 2, 'Mostly does not match my situation'
    UNION ALL SELECT 3, 'Neutral', '3', 3, 'Partially matches my situation'
    UNION ALL SELECT 4, 'Agree', '4', 4, 'Mostly matches my situation'
    UNION ALL SELECT 5, 'Strongly Agree', '5', 5, 'Completely matches my situation'
) o
WHERE q.category_id = 'interpersonal-category';
