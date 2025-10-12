-- Migration: Add Missing Options for Career Questions
-- This migration adds the missing 5-point Likert scale options for all career test questions

-- Add options for Holland questions 004-030
INSERT OR REPLACE INTO psychology_question_options (id, question_id, option_text, option_text_en, option_value, option_score, option_description, order_index, is_correct, is_active, created_at) VALUES
('holland_004_1', 'holland_004', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('holland_004_2', 'holland_004', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('holland_004_3', 'holland_004', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('holland_004_4', 'holland_004', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('holland_004_5', 'holland_004', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('holland_005_1', 'holland_005', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('holland_005_2', 'holland_005', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('holland_005_3', 'holland_005', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('holland_005_4', 'holland_005', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('holland_005_5', 'holland_005', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('holland_006_1', 'holland_006', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('holland_006_2', 'holland_006', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('holland_006_3', 'holland_006', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('holland_006_4', 'holland_006', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('holland_006_5', 'holland_006', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('holland_007_1', 'holland_007', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('holland_007_2', 'holland_007', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('holland_007_3', 'holland_007', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('holland_007_4', 'holland_007', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('holland_007_5', 'holland_007', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('holland_008_1', 'holland_008', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('holland_008_2', 'holland_008', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('holland_008_3', 'holland_008', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('holland_008_4', 'holland_008', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('holland_008_5', 'holland_008', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('holland_009_1', 'holland_009', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('holland_009_2', 'holland_009', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('holland_009_3', 'holland_009', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('holland_009_4', 'holland_009', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('holland_009_5', 'holland_009', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('holland_010_1', 'holland_010', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('holland_010_2', 'holland_010', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('holland_010_3', 'holland_010', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('holland_010_4', 'holland_010', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('holland_010_5', 'holland_010', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now'));
