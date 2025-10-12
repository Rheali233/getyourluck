-- Insert 40-question EQ test questions
-- Self-Awareness (1-10)
INSERT INTO psychology_questions (id, category_id, question_text, question_text_en, question_type, dimension, order_index, weight, is_required, is_active, created_at, updated_at) VALUES
('eq-q-1', 'eq-category', 'I can accurately perceive my emotions in different situations', 'I can accurately perceive my emotions in different situations', 'likert_scale', 'self_awareness', 1, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-2', 'eq-category', 'I can clearly express my strengths and weaknesses', 'I can clearly express my strengths and weaknesses', 'likert_scale', 'self_awareness', 2, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-3', 'eq-category', 'I consider my values before making decisions', 'I consider my values before making decisions', 'likert_scale', 'self_awareness', 3, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-4', 'eq-category', 'I can distinguish between feelings of stress and anxiety', 'I can distinguish between feelings of stress and anxiety', 'likert_scale', 'self_awareness', 4, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-5', 'eq-category', 'I can detect when I am becoming emotional', 'I can detect when I am becoming emotional', 'likert_scale', 'self_awareness', 5, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-6', 'eq-category', 'I sometimes feel confused about what I truly want', 'I sometimes feel confused about what I truly want', 'likert_scale', 'self_awareness', 6, -1, 1, 1, datetime('now'), datetime('now')),
('eq-q-7', 'eq-category', 'I can identify the specific emotions I am experiencing', 'I can identify the specific emotions I am experiencing', 'likert_scale', 'self_awareness', 7, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-8', 'eq-category', 'I understand how my emotions affect my behavior', 'I understand how my emotions affect my behavior', 'likert_scale', 'self_awareness', 8, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-9', 'eq-category', 'I can recognize my emotional triggers', 'I can recognize my emotional triggers', 'likert_scale', 'self_awareness', 9, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-10', 'eq-category', 'I am aware of my emotional patterns over time', 'I am aware of my emotional patterns over time', 'likert_scale', 'self_awareness', 10, 1, 1, 1, datetime('now'), datetime('now'));
