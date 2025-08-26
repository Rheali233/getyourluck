-- Insert Love Style Assessment questions (first 5 questions as test)
INSERT OR IGNORE INTO psychology_questions (id, category_id, question_text, question_type, dimension, weight, order_index, is_required) VALUES
('love-style-category-q1', 'love-style-category', 'I believe in love at first sight and intense emotional connections.', 'likert_scale', 'Eros', 1, 1, 1),
('love-style-category-q2', 'love-style-category', 'Physical attraction and chemistry are essential for me to fall in love.', 'likert_scale', 'Eros', 1, 2, 1),
('love-style-category-q3', 'love-style-category', 'I often experience overwhelming feelings of passion and desire in relationships.', 'likert_scale', 'Eros', 1, 3, 1),
('love-style-category-q4', 'love-style-category', 'I believe true love should be intense, dramatic, and all-consuming.', 'likert_scale', 'Eros', 1, 4, 1),
('love-style-category-q5', 'love-style-category', 'I am drawn to relationships that feel like they are meant to be.', 'likert_scale', 'Eros', 1, 5, 1);
