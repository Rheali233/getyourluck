-- Insert Love Style Assessment questions
INSERT OR IGNORE INTO psychology_questions (id, category_id, question_text, question_type, dimension, weight, order_index, is_required) VALUES
('love-style-category-q1', 'love-style-category', 'I believe in love at first sight and intense emotional connections.', 'likert_scale', 'Eros', 1, 1, 1),
('love-style-category-q2', 'love-style-category', 'Physical attraction and chemistry are essential for me to fall in love.', 'likert_scale', 'Eros', 1, 2, 1),
('love-style-category-q3', 'love-style-category', 'I often experience overwhelming feelings of passion and desire in relationships.', 'likert_scale', 'Eros', 1, 3, 1),
('love-style-category-q4', 'love-style-category', 'I believe true love should be intense, dramatic, and all-consuming.', 'likert_scale', 'Eros', 1, 4, 1),
('love-style-category-q5', 'love-style-category', 'I am drawn to relationships that feel like they are meant to be.', 'likert_scale', 'Eros', 1, 5, 1);

-- Insert Likert scale options
INSERT OR IGNORE INTO psychology_question_options (id, question_id, option_text, option_value, option_score, option_description, order_index, is_correct) VALUES
('likert-option-1', 'all-questions', 'Strongly Disagree', '1', 1, 'Completely does not match my situation', 1, 0),
('likert-option-2', 'all-questions', 'Disagree', '2', 2, 'Mostly does not match my situation', 2, 0),
('likert-option-3', 'all-questions', 'Neutral', '3', 3, 'Partially matches my situation', 3, 0),
('likert-option-4', 'all-questions', 'Agree', '4', 4, 'Mostly matches my situation', 4, 0),
('likert-option-5', 'all-questions', 'Strongly Agree', '5', 5, 'Completely matches my situation', 5, 0);
