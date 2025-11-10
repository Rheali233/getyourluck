-- Insert test types into test_types table
-- This ensures all test types are registered for the unified test API

BEGIN TRANSACTION;

-- Psychology test types
INSERT OR REPLACE INTO test_types (id, name, category, description, config_data, is_active, sort_order, created_at, updated_at) VALUES
('mbti', 'MBTI Personality Test', 'psychology', 'Myers-Briggs Type Indicator personality assessment', '{"subtype": "mbti", "questionCount": 60, "estimatedTime": 600}', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('phq9', 'PHQ-9 Depression Screening', 'psychology', 'Patient Health Questionnaire-9 depression screening', '{"subtype": "phq9", "questionCount": 9, "estimatedTime": 300}', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('eq', 'Emotional Intelligence Test', 'psychology', 'Emotional quotient assessment', '{"subtype": "eq", "questionCount": 50, "estimatedTime": 900}', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('happiness', 'Happiness Assessment', 'psychology', 'Life satisfaction and happiness evaluation', '{"subtype": "happiness", "questionCount": 20, "estimatedTime": 600}', 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Career test types
INSERT OR REPLACE INTO test_types (id, name, category, description, config_data, is_active, sort_order, created_at, updated_at) VALUES
('holland', 'Holland Career Test', 'career', 'RIASEC career interest assessment', '{"subtype": "holland", "questionCount": 60, "estimatedTime": 900}', 1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('disc', 'DISC Assessment', 'career', 'Behavioral style and work preferences', '{"subtype": "disc", "questionCount": 28, "estimatedTime": 600}', 1, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('leadership', 'Leadership Assessment', 'career', 'Leadership skills and style evaluation', '{"subtype": "leadership", "questionCount": 40, "estimatedTime": 900}', 1, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Relationship test types
INSERT OR REPLACE INTO test_types (id, name, category, description, config_data, is_active, sort_order, created_at, updated_at) VALUES
('love_language', 'Love Language Test', 'relationship', 'Identify your love expression and reception style', '{"subtype": "love_language", "questionCount": 30, "estimatedTime": 450}', 1, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('love_style', 'Love Style Test', 'relationship', 'Assess relationship behavior patterns', '{"subtype": "love_style", "questionCount": 35, "estimatedTime": 600}', 1, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('interpersonal', 'Interpersonal Skills Test', 'relationship', 'Evaluate communication and social skills', '{"subtype": "interpersonal", "questionCount": 40, "estimatedTime": 750}', 1, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Learning test types
INSERT OR REPLACE INTO test_types (id, name, category, description, config_data, is_active, sort_order, created_at, updated_at) VALUES
('vark', 'VARK Learning Style Test', 'learning', 'Identify learning preferences and styles', '{"subtype": "vark", "questionCount": 16, "estimatedTime": 450}', 1, 11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Other test types
INSERT OR REPLACE INTO test_types (id, name, category, description, config_data, is_active, sort_order, created_at, updated_at) VALUES
('tarot', 'Tarot Reading', 'tarot', 'Card spreads for self-reflection', '{"subtype": "tarot", "spreadTypes": ["single", "three_card", "celtic_cross"], "estimatedTime": 600}', 1, 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('numerology', 'Numerology Analysis', 'numerology', 'Number symbolism for personal reflection', '{"subtype": "numerology", "analysisTypes": ["bazi", "zodiac", "name", "ziwei"], "estimatedTime": 600}', 1, 13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

COMMIT;

