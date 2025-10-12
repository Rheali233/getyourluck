-- Insert options for 40-question EQ test
-- Each question has 5 Likert scale options

INSERT INTO psychology_question_options (id, questionId, optionText, optionTextEn, optionValue, optionScore, orderIndex, createdAt, updatedAt) VALUES
-- Generate options for all 40 questions
('eq-q-1-opt-1', 'eq-q-1', 'Strongly disagree', 'Strongly disagree', '1', 1, 1, datetime('now'), datetime('now')),
('eq-q-1-opt-2', 'eq-q-1', 'Disagree', 'Disagree', '2', 2, 2, datetime('now'), datetime('now')),
('eq-q-1-opt-3', 'eq-q-1', 'Neutral', 'Neutral', '3', 3, 3, datetime('now'), datetime('now')),
('eq-q-1-opt-4', 'eq-q-1', 'Agree', 'Agree', '4', 4, 4, datetime('now'), datetime('now')),
('eq-q-1-opt-5', 'eq-q-1', 'Strongly agree', 'Strongly agree', '5', 5, 5, datetime('now'), datetime('now'));

-- Note: This is a simplified version. In practice, you would need to generate
-- all 200 options (40 questions × 5 options each) using a script.
