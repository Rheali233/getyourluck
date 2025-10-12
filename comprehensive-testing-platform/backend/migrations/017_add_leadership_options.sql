-- Migration: Add Missing Options for Leadership Test Questions
-- This migration adds the missing 5-point Likert scale options for Leadership test questions

-- Add options for Leadership questions 002-025
INSERT OR REPLACE INTO psychology_question_options (id, question_id, option_text, option_text_en, option_value, option_score, option_description, order_index, is_correct, is_active, created_at) VALUES
('leadership_002_1', 'leadership_002', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_002_2', 'leadership_002', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_002_3', 'leadership_002', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_002_4', 'leadership_002', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_002_5', 'leadership_002', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_003_1', 'leadership_003', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_003_2', 'leadership_003', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_003_3', 'leadership_003', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_003_4', 'leadership_003', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_003_5', 'leadership_003', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_004_1', 'leadership_004', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_004_2', 'leadership_004', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_004_3', 'leadership_004', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_004_4', 'leadership_004', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_004_5', 'leadership_004', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_005_1', 'leadership_005', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_005_2', 'leadership_005', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_005_3', 'leadership_005', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_005_4', 'leadership_005', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_005_5', 'leadership_005', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_006_1', 'leadership_006', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_006_2', 'leadership_006', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_006_3', 'leadership_006', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_006_4', 'leadership_006', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_006_5', 'leadership_006', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_007_1', 'leadership_007', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_007_2', 'leadership_007', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_007_3', 'leadership_007', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_007_4', 'leadership_007', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_007_5', 'leadership_007', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_008_1', 'leadership_008', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_008_2', 'leadership_008', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_008_3', 'leadership_008', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_008_4', 'leadership_008', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_008_5', 'leadership_008', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_009_1', 'leadership_009', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_009_2', 'leadership_009', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_009_3', 'leadership_009', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_009_4', 'leadership_009', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_009_5', 'leadership_009', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_010_1', 'leadership_010', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_010_2', 'leadership_010', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_010_3', 'leadership_010', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_010_4', 'leadership_010', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_010_5', 'leadership_010', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_011_1', 'leadership_011', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_011_2', 'leadership_011', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_011_3', 'leadership_011', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_011_4', 'leadership_011', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_011_5', 'leadership_011', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_012_1', 'leadership_012', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_012_2', 'leadership_012', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_012_3', 'leadership_012', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_012_4', 'leadership_012', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_012_5', 'leadership_012', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_013_1', 'leadership_013', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_013_2', 'leadership_013', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_013_3', 'leadership_013', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_013_4', 'leadership_013', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_013_5', 'leadership_013', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_014_1', 'leadership_014', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_014_2', 'leadership_014', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_014_3', 'leadership_014', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_014_4', 'leadership_014', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_014_5', 'leadership_014', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_015_1', 'leadership_015', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_015_2', 'leadership_015', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_015_3', 'leadership_015', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_015_4', 'leadership_015', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_015_5', 'leadership_015', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_016_1', 'leadership_016', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_016_2', 'leadership_016', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_016_3', 'leadership_016', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_016_4', 'leadership_016', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_016_5', 'leadership_016', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_017_1', 'leadership_017', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_017_2', 'leadership_017', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_017_3', 'leadership_017', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_017_4', 'leadership_017', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_017_5', 'leadership_017', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_018_1', 'leadership_018', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_018_2', 'leadership_018', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_018_3', 'leadership_018', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_018_4', 'leadership_018', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_018_5', 'leadership_018', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_019_1', 'leadership_019', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_019_2', 'leadership_019', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_019_3', 'leadership_019', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_019_4', 'leadership_019', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_019_5', 'leadership_019', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_020_1', 'leadership_020', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_020_2', 'leadership_020', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_020_3', 'leadership_020', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_020_4', 'leadership_020', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_020_5', 'leadership_020', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_021_1', 'leadership_021', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_021_2', 'leadership_021', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_021_3', 'leadership_021', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_021_4', 'leadership_021', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_021_5', 'leadership_021', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_022_1', 'leadership_022', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_022_2', 'leadership_022', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_022_3', 'leadership_022', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_022_4', 'leadership_022', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_022_5', 'leadership_022', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_023_1', 'leadership_023', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_023_2', 'leadership_023', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_023_3', 'leadership_023', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_023_4', 'leadership_023', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_023_5', 'leadership_023', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_024_1', 'leadership_024', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_024_2', 'leadership_024', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_024_3', 'leadership_024', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_024_4', 'leadership_024', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_024_5', 'leadership_024', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now')),

('leadership_025_1', 'leadership_025', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1, datetime('now')),
('leadership_025_2', 'leadership_025', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1, datetime('now')),
('leadership_025_3', 'leadership_025', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1, datetime('now')),
('leadership_025_4', 'leadership_025', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1, datetime('now')),
('leadership_025_5', 'leadership_025', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1, datetime('now'));
