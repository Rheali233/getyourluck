-- Add missing Holland question options
-- 为所有Holland题目添加缺失的选项数据

-- 为holland_004到holland_030添加选项
INSERT OR REPLACE INTO psychology_question_options (
  id, question_id, option_text, option_text_en, option_value, option_score, 
  option_description, order_index, is_correct, is_active
) VALUES
-- holland_004 options
('holland_004_1', 'holland_004', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_004_2', 'holland_004', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_004_3', 'holland_004', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_004_4', 'holland_004', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_004_5', 'holland_004', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_005 options
('holland_005_1', 'holland_005', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_005_2', 'holland_005', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_005_3', 'holland_005', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_005_4', 'holland_005', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_005_5', 'holland_005', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_006 options
('holland_006_1', 'holland_006', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_006_2', 'holland_006', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_006_3', 'holland_006', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_006_4', 'holland_006', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_006_5', 'holland_006', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_007 options
('holland_007_1', 'holland_007', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_007_2', 'holland_007', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_007_3', 'holland_007', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_007_4', 'holland_007', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_007_5', 'holland_007', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_008 options
('holland_008_1', 'holland_008', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_008_2', 'holland_008', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_008_3', 'holland_008', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_008_4', 'holland_008', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_008_5', 'holland_008', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_009 options
('holland_009_1', 'holland_009', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_009_2', 'holland_009', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_009_3', 'holland_009', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_009_4', 'holland_009', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_009_5', 'holland_009', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_010 options
('holland_010_1', 'holland_010', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_010_2', 'holland_010', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_010_3', 'holland_010', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_010_4', 'holland_010', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_010_5', 'holland_010', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_011 options
('holland_011_1', 'holland_011', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_011_2', 'holland_011', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_011_3', 'holland_011', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_011_4', 'holland_011', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_011_5', 'holland_011', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_012 options
('holland_012_1', 'holland_012', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_012_2', 'holland_012', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_012_3', 'holland_012', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_012_4', 'holland_012', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_012_5', 'holland_012', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_013 options
('holland_013_1', 'holland_013', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_013_2', 'holland_013', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_013_3', 'holland_013', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_013_4', 'holland_013', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_013_5', 'holland_013', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_014 options
('holland_014_1', 'holland_014', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_014_2', 'holland_014', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_014_3', 'holland_014', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_014_4', 'holland_014', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_014_5', 'holland_014', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_015 options
('holland_015_1', 'holland_015', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_015_2', 'holland_015', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_015_3', 'holland_015', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_015_4', 'holland_015', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_015_5', 'holland_015', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_016 options
('holland_016_1', 'holland_016', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_016_2', 'holland_016', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_016_3', 'holland_016', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_016_4', 'holland_016', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_016_5', 'holland_016', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_017 options
('holland_017_1', 'holland_017', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_017_2', 'holland_017', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_017_3', 'holland_017', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_017_4', 'holland_017', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_017_5', 'holland_017', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_018 options
('holland_018_1', 'holland_018', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_018_2', 'holland_018', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_018_3', 'holland_018', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_018_4', 'holland_018', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_018_5', 'holland_018', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_019 options
('holland_019_1', 'holland_019', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_019_2', 'holland_019', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_019_3', 'holland_019', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_019_4', 'holland_019', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_019_5', 'holland_019', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_020 options
('holland_020_1', 'holland_020', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_020_2', 'holland_020', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_020_3', 'holland_020', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_020_4', 'holland_020', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_020_5', 'holland_020', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_021 options
('holland_021_1', 'holland_021', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_021_2', 'holland_021', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_021_3', 'holland_021', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_021_4', 'holland_021', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_021_5', 'holland_021', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_022 options
('holland_022_1', 'holland_022', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_022_2', 'holland_022', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_022_3', 'holland_022', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_022_4', 'holland_022', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_022_5', 'holland_022', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_023 options
('holland_023_1', 'holland_023', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_023_2', 'holland_023', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_023_3', 'holland_023', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_023_4', 'holland_023', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_023_5', 'holland_023', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_024 options
('holland_024_1', 'holland_024', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_024_2', 'holland_024', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_024_3', 'holland_024', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_024_4', 'holland_024', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_024_5', 'holland_024', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_025 options
('holland_025_1', 'holland_025', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_025_2', 'holland_025', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_025_3', 'holland_025', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_025_4', 'holland_025', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_025_5', 'holland_025', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_026 options
('holland_026_1', 'holland_026', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_026_2', 'holland_026', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_026_3', 'holland_026', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_026_4', 'holland_026', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_026_5', 'holland_026', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_027 options
('holland_027_1', 'holland_027', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_027_2', 'holland_027', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_027_3', 'holland_027', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_027_4', 'holland_027', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_027_5', 'holland_027', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_028 options
('holland_028_1', 'holland_028', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_028_2', 'holland_028', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_028_3', 'holland_028', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_028_4', 'holland_028', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_028_5', 'holland_028', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_029 options
('holland_029_1', 'holland_029', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_029_2', 'holland_029', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_029_3', 'holland_029', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_029_4', 'holland_029', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_029_5', 'holland_029', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1),

-- holland_030 options
('holland_030_1', 'holland_030', 'Strongly Disagree', 'Strongly Disagree', '1', 1, 'Strongly disagree with the statement', 1, 0, 1),
('holland_030_2', 'holland_030', 'Disagree', 'Disagree', '2', 2, 'Disagree with the statement', 2, 0, 1),
('holland_030_3', 'holland_030', 'Neutral', 'Neutral', '3', 3, 'Neither agree nor disagree', 3, 0, 1),
('holland_030_4', 'holland_030', 'Agree', 'Agree', '4', 4, 'Agree with the statement', 4, 0, 1),
('holland_030_5', 'holland_030', 'Strongly Agree', 'Strongly Agree', '5', 5, 'Strongly agree with the statement', 5, 0, 1);
