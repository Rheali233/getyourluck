-- Insert options for first few questions of each category as a test

-- Love Style Assessment - first 5 questions
INSERT OR IGNORE INTO psychology_question_options (id, question_id, option_text, option_value, option_score, option_description, order_index, is_correct) VALUES
('ls-q1-opt-1', 'love-style-category-q1', 'Strongly Disagree', '1', 1, 'Completely does not match my situation', 1, 0),
('ls-q1-opt-2', 'love-style-category-q1', 'Disagree', '2', 2, 'Mostly does not match my situation', 2, 0),
('ls-q1-opt-3', 'love-style-category-q1', 'Neutral', '3', 3, 'Partially matches my situation', 3, 0),
('ls-q1-opt-4', 'love-style-category-q1', 'Agree', '4', 4, 'Mostly matches my situation', 4, 0),
('ls-q1-opt-5', 'love-style-category-q1', 'Strongly Agree', '5', 5, 'Completely matches my situation', 5, 0),

('ls-q2-opt-1', 'love-style-category-q2', 'Strongly Disagree', '1', 1, 'Completely does not match my situation', 1, 0),
('ls-q2-opt-2', 'love-style-category-q2', 'Disagree', '2', 2, 'Mostly does not match my situation', 2, 0),
('ls-q2-opt-3', 'love-style-category-q2', 'Neutral', '3', 3, 'Partially matches my situation', 3, 0),
('ls-q2-opt-4', 'love-style-category-q2', 'Agree', '4', 4, 'Mostly matches my situation', 4, 0),
('ls-q2-opt-5', 'love-style-category-q2', 'Strongly Agree', '5', 5, 'Completely matches my situation', 5, 0),

('ls-q3-opt-1', 'love-style-category-q3', 'Strongly Disagree', '1', 1, 'Completely does not match my situation', 1, 0),
('ls-q3-opt-2', 'love-style-category-q3', 'Disagree', '2', 2, 'Mostly does not match my situation', 2, 0),
('ls-q3-opt-3', 'love-style-category-q3', 'Neutral', '3', 3, 'Partially matches my situation', 3, 0),
('ls-q3-opt-4', 'love-style-category-q3', 'Agree', '4', 4, 'Mostly matches my situation', 4, 0),
('ls-q3-opt-5', 'love-style-category-q3', 'Strongly Agree', '5', 5, 'Completely matches my situation', 5, 0);

-- Love Language Test - first 3 questions
INSERT OR IGNORE INTO psychology_question_options (id, question_id, option_text, option_value, option_score, option_description, order_index, is_correct) VALUES
('ll-q1-opt-1', 'love-language-category-q1', 'Strongly Disagree', '1', 1, 'Completely does not match my situation', 1, 0),
('ll-q1-opt-2', 'love-language-category-q1', 'Disagree', '2', 2, 'Mostly does not match my situation', 2, 0),
('ll-q1-opt-3', 'love-language-category-q1', 'Neutral', '3', 3, 'Partially matches my situation', 3, 0),
('ll-q1-opt-4', 'love-language-category-q1', 'Agree', '4', 4, 'Mostly matches my situation', 4, 0),
('ll-q1-opt-5', 'love-language-category-q1', 'Strongly Agree', '5', 5, 'Completely matches my situation', 5, 0),

('ll-q2-opt-1', 'love-language-category-q2', 'Strongly Disagree', '1', 1, 'Completely does not match my situation', 1, 0),
('ll-q2-opt-2', 'love-language-category-q2', 'Disagree', '2', 2, 'Mostly does not match my situation', 2, 0),
('ll-q2-opt-3', 'love-language-category-q2', 'Neutral', '3', 3, 'Partially matches my situation', 3, 0),
('ll-q2-opt-4', 'love-language-category-q2', 'Agree', '4', 4, 'Mostly matches my situation', 4, 0),
('ll-q2-opt-5', 'love-language-category-q2', 'Strongly Agree', '5', 5, 'Completely matches my situation', 5, 0),

('ll-q3-opt-1', 'love-language-category-q3', 'Strongly Disagree', '1', 1, 'Completely does not match my situation', 1, 0),
('ll-q3-opt-2', 'love-language-category-q3', 'Disagree', '2', 2, 'Mostly does not match my situation', 2, 0),
('ll-q3-opt-3', 'love-language-category-q3', 'Neutral', '3', 3, 'Partially matches my situation', 3, 0),
('ll-q3-opt-4', 'love-language-category-q3', 'Agree', '4', 4, 'Mostly matches my situation', 4, 0),
('ll-q3-opt-5', 'love-language-category-q3', 'Strongly Agree', '5', 5, 'Completely matches my situation', 5, 0);
