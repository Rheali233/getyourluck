-- Insert Likert scale options for all relationship test questions
-- These options will be shared across all questions in all categories

INSERT OR IGNORE INTO psychology_question_options (id, question_id, option_text, option_value, option_score, option_description, order_index, is_correct) VALUES
-- Love Style Assessment options
('love-style-opt-1', 'all-love-style-questions', 'Strongly Disagree', '1', 1, 'Completely does not match my situation', 1, 0),
('love-style-opt-2', 'all-love-style-questions', 'Disagree', '2', 2, 'Mostly does not match my situation', 2, 0),
('love-style-opt-3', 'all-love-style-questions', 'Neutral', '3', 3, 'Partially matches my situation', 3, 0),
('love-style-opt-4', 'all-love-style-questions', 'Agree', '4', 4, 'Mostly matches my situation', 4, 0),
('love-style-opt-5', 'all-love-style-questions', 'Strongly Agree', '5', 5, 'Completely matches my situation', 5, 0),

-- Love Language Test options
('love-language-opt-1', 'all-love-language-questions', 'Strongly Disagree', '1', 1, 'Completely does not match my situation', 1, 0),
('love-language-opt-2', 'all-love-language-questions', 'Disagree', '2', 2, 'Mostly does not match my situation', 2, 0),
('love-language-opt-3', 'all-love-language-questions', 'Neutral', '3', 3, 'Partially matches my situation', 3, 0),
('love-language-opt-4', 'all-love-language-questions', 'Agree', '4', 4, 'Mostly matches my situation', 4, 0),
('love-language-opt-5', 'all-love-language-questions', 'Strongly Agree', '5', 5, 'Completely matches my situation', 5, 0),

-- Interpersonal Skills Assessment options
('interpersonal-opt-1', 'all-interpersonal-questions', 'Strongly Disagree', '1', 1, 'Completely does not match my situation', 1, 0),
('interpersonal-opt-2', 'all-interpersonal-questions', 'Disagree', '2', 2, 'Mostly does not match my situation', 2, 0),
('interpersonal-opt-3', 'all-interpersonal-questions', 'Neutral', '3', 3, 'Partially matches my situation', 3, 0),
('interpersonal-opt-4', 'all-interpersonal-questions', 'Agree', '4', 4, 'Mostly matches my situation', 4, 0),
('interpersonal-opt-5', 'all-interpersonal-questions', 'Strongly Agree', '5', 5, 'Completely matches my situation', 5, 0);
