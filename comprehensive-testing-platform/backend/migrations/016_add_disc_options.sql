-- Migration: Add Missing Options for DISC Test Questions
-- This migration adds the missing 5-point Likert scale options for DISC test questions

-- Add options for DISC questions 002-020
INSERT OR REPLACE INTO psychology_question_options (id, question_id, option_text, option_text_en, option_value, option_score, option_description, order_index, is_correct, is_active, created_at) VALUES
('disc_002_1', 'disc_002', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('disc_002_2', 'disc_002', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('disc_002_3', 'disc_002', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('disc_002_4', 'disc_002', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('disc_002_5', 'disc_002', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('disc_003_1', 'disc_003', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('disc_003_2', 'disc_003', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('disc_003_3', 'disc_003', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('disc_003_4', 'disc_003', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('disc_003_5', 'disc_003', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('disc_004_1', 'disc_004', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('disc_004_2', 'disc_004', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('disc_004_3', 'disc_004', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('disc_004_4', 'disc_004', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('disc_004_5', 'disc_004', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('disc_005_1', 'disc_005', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('disc_005_2', 'disc_005', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('disc_005_3', 'disc_005', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('disc_005_4', 'disc_005', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('disc_005_5', 'disc_005', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('disc_006_1', 'disc_006', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('disc_006_2', 'disc_006', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('disc_006_3', 'disc_006', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('disc_006_4', 'disc_006', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('disc_006_5', 'disc_006', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('disc_007_1', 'disc_007', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('disc_007_2', 'disc_007', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('disc_007_3', 'disc_007', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('disc_007_4', 'disc_007', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('disc_007_5', 'disc_007', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('disc_008_1', 'disc_008', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('disc_008_2', 'disc_008', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('disc_008_3', 'disc_008', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('disc_008_4', 'disc_008', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('disc_008_5', 'disc_008', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('disc_009_1', 'disc_009', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('disc_009_2', 'disc_009', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('disc_009_3', 'disc_009', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('disc_009_4', 'disc_009', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('disc_009_5', 'disc_009', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('disc_010_1', 'disc_010', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('disc_010_2', 'disc_010', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('disc_010_3', 'disc_010', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('disc_010_4', 'disc_010', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('disc_010_5', 'disc_010', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('disc_011_1', 'disc_011', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('disc_011_2', 'disc_011', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('disc_011_3', 'disc_011', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('disc_011_4', 'disc_011', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('disc_011_5', 'disc_011', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('disc_012_1', 'disc_012', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('disc_012_2', 'disc_012', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('disc_012_3', 'disc_012', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('disc_012_4', 'disc_012', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('disc_012_5', 'disc_012', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('disc_013_1', 'disc_013', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('disc_013_2', 'disc_013', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('disc_013_3', 'disc_013', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('disc_013_4', 'disc_013', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('disc_013_5', 'disc_013', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('disc_014_1', 'disc_014', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('disc_014_2', 'disc_014', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('disc_014_3', 'disc_014', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('disc_014_4', 'disc_014', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('disc_014_5', 'disc_014', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('disc_015_1', 'disc_015', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('disc_015_2', 'disc_015', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('disc_015_3', 'disc_015', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('disc_015_4', 'disc_015', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('disc_015_5', 'disc_015', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('disc_016_1', 'disc_016', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('disc_016_2', 'disc_016', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('disc_016_3', 'disc_016', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('disc_016_4', 'disc_016', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('disc_016_5', 'disc_016', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('disc_017_1', 'disc_017', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('disc_017_2', 'disc_017', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('disc_017_3', 'disc_017', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('disc_017_4', 'disc_017', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('disc_017_5', 'disc_017', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('disc_018_1', 'disc_018', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('disc_018_2', 'disc_018', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('disc_018_3', 'disc_018', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('disc_018_4', 'disc_018', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('disc_018_5', 'disc_018', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('disc_019_1', 'disc_019', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('disc_019_2', 'disc_019', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('disc_019_3', 'disc_019', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('disc_019_4', 'disc_019', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('disc_019_5', 'disc_019', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('disc_020_1', 'disc_020', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('disc_020_2', 'disc_020', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('disc_020_3', 'disc_020', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('disc_020_4', 'disc_020', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('disc_020_5', 'disc_020', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now'));
