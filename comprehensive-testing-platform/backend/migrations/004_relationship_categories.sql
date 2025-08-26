-- Relationship Module Categories and Configurations
-- Add relationship test categories to psychology_question_categories table

-- Insert relationship test categories
INSERT OR IGNORE INTO psychology_question_categories (id, name, code, description, question_count, dimensions, scoring_type, min_score, max_score, estimated_time) VALUES
('love-style-category', 'Love Style Assessment', 'love_style', 'Assessment of romantic relationship styles based on John Alan Lees Love Styles Theory', 30, '["Eros", "Ludus", "Storge", "Pragma", "Mania", "Agape"]', 'likert', 30, 150, 15),
('love-language-category', 'Love Language Test', 'love_language', 'Assessment of how you prefer to give and receive love based on Gary Chapmans 5 Love Languages', 30, '["Words_of_Affirmation", "Quality_Time", "Receiving_Gifts", "Acts_of_Service", "Physical_Touch"]', 'likert', 30, 150, 15),
('interpersonal-category', 'Interpersonal Skills Assessment', 'interpersonal', 'Comprehensive assessment of interpersonal communication and relationship skills', 30, '["Communication_Skills", "Empathy", "Conflict_Resolution", "Trust_Building", "Social_Skills"]', 'likert', 30, 150, 15);

-- Insert relationship test configurations
INSERT OR IGNORE INTO psychology_question_configs (id, category_id, config_key, config_value, config_type, description) VALUES
('love-style-config-1', 'love-style-category', 'dimension_weights', '{"Eros": 1, "Ludus": 1, "Storge": 1, "Pragma": 1, "Mania": 1, "Agape": 1}', 'json', 'Love Style Assessment dimension weights configuration'),
('love-style-config-2', 'love-style-category', 'scoring_algorithm', 'dimension_average', 'string', 'Love Style Assessment scoring algorithm: dimension average'),
('love-style-config-3', 'love-style-category', 'interpretation_rules', '{"primary_threshold": 0.6, "secondary_threshold": 0.4, "weak_threshold": 0.2}', 'json', 'Love Style Assessment interpretation threshold rules'),
('love-language-config-1', 'love-language-category', 'dimension_weights', '{"Words_of_Affirmation": 1, "Quality_Time": 1, "Receiving_Gifts": 1, "Acts_of_Service": 1, "Physical_Touch": 1}', 'json', 'Love Language Test dimension weights configuration'),
('love-language-config-2', 'love-language-category', 'scoring_algorithm', 'dimension_average', 'string', 'Love Language Test scoring algorithm: dimension average'),
('love-language-config-3', 'love-language-category', 'interpretation_rules', '{"primary_threshold": 0.6, "secondary_threshold": 0.4, "weak_threshold": 0.2}', 'json', 'Love Language Test interpretation threshold rules'),
('interpersonal-config-1', 'interpersonal-category', 'dimension_weights', '{"Communication_Skills": 1, "Empathy": 1, "Conflict_Resolution": 1, "Trust_Building": 1, "Social_Skills": 1}', 'json', 'Interpersonal Skills Assessment dimension weights configuration'),
('interpersonal-config-2', 'interpersonal-category', 'scoring_algorithm', 'dimension_average', 'string', 'Interpersonal Skills Assessment scoring algorithm: dimension average'),
('interpersonal-config-3', 'interpersonal-category', 'interpretation_rules', '{"primary_threshold": 0.6, "secondary_threshold": 0.4, "weak_threshold": 0.2}', 'json', 'Interpersonal Skills Assessment interpretation threshold rules');
