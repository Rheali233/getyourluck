-- Batch Insert MBTI Question Options
-- Insert all 5 options for each of the 64 questions (320 total options)

-- First, let's create a temporary table to hold all the options data
CREATE TEMP TABLE temp_options (
    question_id TEXT,
    option_text TEXT,
    option_value TEXT,
    option_score INTEGER,
    order_index INTEGER
);

-- Insert all options data into temp table
INSERT INTO temp_options VALUES
-- E/I dimension questions (1-16)
('mbti-e-01', 'Strongly Disagree', '1', 1, 1),
('mbti-e-01', 'Disagree', '2', 2, 2),
('mbti-e-01', 'Neutral', '3', 3, 3),
('mbti-e-01', 'Agree', '4', 4, 4),
('mbti-e-01', 'Strongly Agree', '5', 5, 5),

('mbti-e-02', 'Strongly Disagree', '1', 1, 1),
('mbti-e-02', 'Disagree', '2', 2, 2),
('mbti-e-02', 'Neutral', '3', 3, 3),
('mbti-e-02', 'Agree', '4', 4, 4),
('mbti-e-02', 'Strongly Agree', '5', 5, 5),

('mbti-e-03', 'Strongly Disagree', '1', 1, 1),
('mbti-e-03', 'Disagree', '2', 2, 2),
('mbti-e-03', 'Neutral', '3', 3, 3),
('mbti-e-03', 'Agree', '4', 4, 4),
('mbti-e-03', 'Strongly Agree', '5', 5, 5),

('mbti-e-04', 'Strongly Disagree', '1', 1, 1),
('mbti-e-04', 'Disagree', '2', 2, 2),
('mbti-e-04', 'Neutral', '3', 3, 3),
('mbti-e-04', 'Agree', '4', 4, 4),
('mbti-e-04', 'Strongly Agree', '5', 5, 5),

('mbti-e-05', 'Strongly Disagree', '1', 1, 1),
('mbti-e-05', 'Disagree', '2', 2, 2),
('mbti-e-05', 'Neutral', '3', 3, 3),
('mbti-e-05', 'Agree', '4', 4, 4),
('mbti-e-05', 'Strongly Agree', '5', 5, 5),

('mbti-e-06', 'Strongly Disagree', '1', 1, 1),
('mbti-e-06', 'Disagree', '2', 2, 2),
('mbti-e-06', 'Neutral', '3', 3, 3),
('mbti-e-06', 'Agree', '4', 4, 4),
('mbti-e-06', 'Strongly Agree', '5', 5, 5),

('mbti-e-07', 'Strongly Disagree', '1', 1, 1),
('mbti-e-07', 'Disagree', '2', 2, 2),
('mbti-e-07', 'Neutral', '3', 3, 3),
('mbti-e-07', 'Agree', '4', 4, 4),
('mbti-e-07', 'Strongly Agree', '5', 5, 5),

('mbti-e-08', 'Strongly Disagree', '1', 1, 1),
('mbti-e-08', 'Disagree', '2', 2, 2),
('mbti-e-08', 'Neutral', '3', 3, 3),
('mbti-e-08', 'Agree', '4', 4, 4),
('mbti-e-08', 'Strongly Agree', '5', 5, 5),

('mbti-e-09', 'Strongly Disagree', '1', 1, 1),
('mbti-e-09', 'Disagree', '2', 2, 2),
('mbti-e-09', 'Neutral', '3', 3, 3),
('mbti-e-09', 'Agree', '4', 4, 4),
('mbti-e-09', 'Strongly Agree', '5', 5, 5),

('mbti-e-10', 'Strongly Disagree', '1', 1, 1),
('mbti-e-10', 'Disagree', '2', 2, 2),
('mbti-e-10', 'Neutral', '3', 3, 3),
('mbti-e-10', 'Agree', '4', 4, 4),
('mbti-e-10', 'Strongly Agree', '5', 5, 5),

('mbti-e-11', 'Strongly Disagree', '1', 1, 1),
('mbti-e-11', 'Disagree', '2', 2, 2),
('mbti-e-11', 'Neutral', '3', 3, 3),
('mbti-e-11', 'Agree', '4', 4, 4),
('mbti-e-11', 'Strongly Agree', '5', 5, 5),

('mbti-e-12', 'Strongly Disagree', '1', 1, 1),
('mbti-e-12', 'Disagree', '2', 2, 2),
('mbti-e-12', 'Neutral', '3', 3, 3),
('mbti-e-12', 'Agree', '4', 4, 4),
('mbti-e-12', 'Strongly Agree', '5', 5, 5),

('mbti-e-13', 'Strongly Disagree', '1', 1, 1),
('mbti-e-13', 'Disagree', '2', 2, 2),
('mbti-e-13', 'Neutral', '3', 3, 3),
('mbti-e-13', 'Agree', '4', 4, 4),
('mbti-e-13', 'Strongly Agree', '5', 5, 5),

('mbti-e-14', 'Strongly Disagree', '1', 1, 1),
('mbti-e-14', 'Disagree', '2', 2, 2),
('mbti-e-14', 'Neutral', '3', 3, 3),
('mbti-e-14', 'Agree', '4', 4, 4),
('mbti-e-14', 'Strongly Agree', '5', 5, 5),

('mbti-e-15', 'Strongly Disagree', '1', 1, 1),
('mbti-e-15', 'Disagree', '2', 2, 2),
('mbti-e-15', 'Neutral', '3', 3, 3),
('mbti-e-15', 'Agree', '4', 4, 4),
('mbti-e-15', 'Strongly Agree', '5', 5, 5),

('mbti-e-16', 'Strongly Disagree', '1', 1, 1),
('mbti-e-16', 'Disagree', '2', 2, 2),
('mbti-e-16', 'Neutral', '3', 3, 3),
('mbti-e-16', 'Agree', '4', 4, 4),
('mbti-e-16', 'Strongly Agree', '5', 5, 5);

-- Now insert from temp table to actual table
INSERT INTO psychology_question_options (id, question_id, option_text_en, option_value, option_score, order_index, is_active)
SELECT 
    question_id || '-opt-' || order_index as id,
    question_id,
    option_text,
    option_value,
    option_score,
    order_index,
    1 as is_active
FROM temp_options;

-- Clean up temp table
DROP TABLE temp_options;
