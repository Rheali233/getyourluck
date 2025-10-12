-- Update EQ test to 40 questions (4 dimensions × 10 questions each)
-- Using correct database column names (snake_case)

-- 1. Delete existing EQ questions and options
DELETE FROM psychology_question_options WHERE question_id LIKE 'eq-q-%';
DELETE FROM psychology_questions WHERE category_id = 'eq-category';

-- 2. Update test type configuration
UPDATE test_types 
SET config_data = json_set(config_data, '$.questionCount', 40)
WHERE id = 'eq';

-- 3. Insert new 40-question EQ questions
INSERT INTO psychology_questions (id, category_id, question_text, question_text_en, question_type, dimension, order_index, weight, is_required, is_active, created_at, updated_at) VALUES
-- Self-Awareness (1-10)
('eq-q-1', 'eq-category', 'I can accurately perceive my emotions in different situations', 'I can accurately perceive my emotions in different situations', 'likert_scale', 'self_awareness', 1, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-2', 'eq-category', 'I can clearly express my strengths and weaknesses', 'I can clearly express my strengths and weaknesses', 'likert_scale', 'self_awareness', 2, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-3', 'eq-category', 'I consider my values before making decisions', 'I consider my values before making decisions', 'likert_scale', 'self_awareness', 3, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-4', 'eq-category', 'I can distinguish between feelings of stress and anxiety', 'I can distinguish between feelings of stress and anxiety', 'likert_scale', 'self_awareness', 4, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-5', 'eq-category', 'I can detect when I am becoming emotional', 'I can detect when I am becoming emotional', 'likert_scale', 'self_awareness', 5, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-6', 'eq-category', 'I sometimes feel confused about what I truly want', 'I sometimes feel confused about what I truly want', 'likert_scale', 'self_awareness', 6, -1, 1, 1, datetime('now'), datetime('now')),
('eq-q-7', 'eq-category', 'I can identify the specific emotions I am experiencing', 'I can identify the specific emotions I am experiencing', 'likert_scale', 'self_awareness', 7, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-8', 'eq-category', 'I understand how my emotions affect my behavior', 'I understand how my emotions affect my behavior', 'likert_scale', 'self_awareness', 8, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-9', 'eq-category', 'I can recognize my emotional triggers', 'I can recognize my emotional triggers', 'likert_scale', 'self_awareness', 9, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-10', 'eq-category', 'I am aware of my emotional patterns over time', 'I am aware of my emotional patterns over time', 'likert_scale', 'self_awareness', 10, 1, 1, 1, datetime('now'), datetime('now')),

-- Self-Management (11-20)
('eq-q-11', 'eq-category', 'I can control my emotions even in stressful situations', 'I can control my emotions even in stressful situations', 'likert_scale', 'self_management', 11, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-12', 'eq-category', 'I can stay calm when facing criticism or conflict', 'I can stay calm when facing criticism or conflict', 'likert_scale', 'self_management', 12, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-13', 'eq-category', 'I can delay gratification to achieve long-term goals', 'I can delay gratification to achieve long-term goals', 'likert_scale', 'self_management', 13, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-14', 'eq-category', 'I can adapt my behavior to different situations', 'I can adapt my behavior to different situations', 'likert_scale', 'self_management', 14, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-15', 'eq-category', 'I maintain a positive attitude even when things go wrong', 'I maintain a positive attitude even when things go wrong', 'likert_scale', 'self_management', 15, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-16', 'eq-category', 'I often lose control of my emotions', 'I often lose control of my emotions', 'likert_scale', 'self_management', 16, -1, 1, 1, datetime('now'), datetime('now')),
('eq-q-17', 'eq-category', 'I can motivate myself to complete difficult tasks', 'I can motivate myself to complete difficult tasks', 'likert_scale', 'self_management', 17, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-18', 'eq-category', 'I can bounce back quickly from setbacks', 'I can bounce back quickly from setbacks', 'likert_scale', 'self_management', 18, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-19', 'eq-category', 'I can manage my time effectively to achieve goals', 'I can manage my time effectively to achieve goals', 'likert_scale', 'self_management', 19, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-20', 'eq-category', 'I can stay focused on important tasks despite distractions', 'I can stay focused on important tasks despite distractions', 'likert_scale', 'self_management', 20, 1, 1, 1, datetime('now'), datetime('now')),

-- Social Awareness (21-30)
('eq-q-21', 'eq-category', 'I can sense how others are feeling by observing their body language', 'I can sense how others are feeling by observing their body language', 'likert_scale', 'social_awareness', 21, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-22', 'eq-category', 'I can understand different perspectives in a conflict', 'I can understand different perspectives in a conflict', 'likert_scale', 'social_awareness', 22, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-23', 'eq-category', 'I can recognize when someone needs emotional support', 'I can recognize when someone needs emotional support', 'likert_scale', 'social_awareness', 23, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-24', 'eq-category', 'I can sense the mood of a group or team', 'I can sense the mood of a group or team', 'likert_scale', 'social_awareness', 24, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-25', 'eq-category', 'I can understand cultural differences in emotional expression', 'I can understand cultural differences in emotional expression', 'likert_scale', 'social_awareness', 25, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-26', 'eq-category', 'I often miss social cues from others', 'I often miss social cues from others', 'likert_scale', 'social_awareness', 26, -1, 1, 1, datetime('now'), datetime('now')),
('eq-q-27', 'eq-category', 'I can identify the emotions behind someone''s words', 'I can identify the emotions behind someone''s words', 'likert_scale', 'social_awareness', 27, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-28', 'eq-category', 'I can sense when someone is uncomfortable or upset', 'I can sense when someone is uncomfortable or upset', 'likert_scale', 'social_awareness', 28, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-29', 'eq-category', 'I can understand the impact of my words on others', 'I can understand the impact of my words on others', 'likert_scale', 'social_awareness', 29, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-30', 'eq-category', 'I can recognize power dynamics in social situations', 'I can recognize power dynamics in social situations', 'likert_scale', 'social_awareness', 30, 1, 1, 1, datetime('now'), datetime('now')),

-- Relationship Management (31-40)
('eq-q-31', 'eq-category', 'I can build rapport with people from different backgrounds', 'I can build rapport with people from different backgrounds', 'likert_scale', 'relationship_management', 31, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-32', 'eq-category', 'I can resolve conflicts between team members', 'I can resolve conflicts between team members', 'likert_scale', 'relationship_management', 32, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-33', 'eq-category', 'I can give constructive feedback without causing offense', 'I can give constructive feedback without causing offense', 'likert_scale', 'relationship_management', 33, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-34', 'eq-category', 'I can inspire and motivate others to achieve common goals', 'I can inspire and motivate others to achieve common goals', 'likert_scale', 'relationship_management', 34, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-35', 'eq-category', 'I can work effectively in diverse teams', 'I can work effectively in diverse teams', 'likert_scale', 'relationship_management', 35, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-36', 'eq-category', 'I find it difficult to influence or persuade others', 'I find it difficult to influence or persuade others', 'likert_scale', 'relationship_management', 36, -1, 1, 1, datetime('now'), datetime('now')),
('eq-q-37', 'eq-category', 'I can adapt my communication style to different audiences', 'I can adapt my communication style to different audiences', 'likert_scale', 'relationship_management', 37, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-38', 'eq-category', 'I can build and maintain professional networks', 'I can build and maintain professional networks', 'likert_scale', 'relationship_management', 38, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-39', 'eq-category', 'I can facilitate group discussions and decision-making', 'I can facilitate group discussions and decision-making', 'likert_scale', 'relationship_management', 39, 1, 1, 1, datetime('now'), datetime('now')),
('eq-q-40', 'eq-category', 'I can create a positive and inclusive team environment', 'I can create a positive and inclusive team environment', 'likert_scale', 'relationship_management', 40, 1, 1, 1, datetime('now'), datetime('now'));
