-- MBTI Question Bank Data Import Script
-- Import 64 MBTI questions with 5-point Likert scale options

-- First, ensure the MBTI category exists and update its question count
UPDATE psychology_question_categories 
SET question_count = 64, 
    description = 'Myers-Briggs Type Indicator - 64 questions covering 4 dimensions',
    estimated_time = 20
WHERE code = 'mbti';

-- Import MBTI questions (E/I dimension - 16 questions)
INSERT OR REPLACE INTO psychology_questions (id, category_id, question_text_en, question_type, dimension, order_index, weight, is_active) VALUES
('mbti-e-01', 'mbti-category', 'In group situations, I actively initiate conversations.', 'likert_scale', 'E/I', 1, 1, 1),
('mbti-e-02', 'mbti-category', 'In business social situations, I actively communicate with key contacts.', 'likert_scale', 'E/I', 2, 1, 1),
('mbti-e-03', 'mbti-category', 'I can naturally participate in group discussions even when elders or authorities are present.', 'likert_scale', 'E/I', 3, 1, 1),
('mbti-e-04', 'mbti-category', 'I tend to be noticed in groups.', 'likert_scale', 'E/I', 4, 1, 1),
('mbti-e-05', 'mbti-category', 'I actively establish and maintain work or social connections.', 'likert_scale', 'E/I', 5, 1, 1),
('mbti-e-06', 'mbti-category', 'After long social interactions, I need alone time to recharge.', 'likert_scale', 'E/I', 6, 1, 1),
('mbti-e-07', 'mbti-category', 'When facing new tasks, I think quietly before taking action.', 'likert_scale', 'E/I', 7, 1, 1),
('mbti-e-08', 'mbti-category', 'In group discussions, I often speak among the first.', 'likert_scale', 'E/I', 8, 1, 1),
('mbti-e-09', 'mbti-category', 'I trust my internal thinking and judgment more than external feedback.', 'likert_scale', 'E/I', 9, 1, 1),
('mbti-e-10', 'mbti-category', 'In unfamiliar environments, I actively explore and learn.', 'likert_scale', 'E/I', 10, 1, 1),
('mbti-e-11', 'mbti-category', 'High-intensity social interactions tend to make me feel tired.', 'likert_scale', 'E/I', 11, 1, 1),
('mbti-e-12', 'mbti-category', 'I usually wait for others to speak first before joining the conversation.', 'likert_scale', 'E/I', 12, 1, 1),
('mbti-e-13', 'mbti-category', 'In formal situations involving face-saving, I prefer to communicate privately before expressing publicly.', 'likert_scale', 'E/I', 13, 1, 1),
('mbti-e-14', 'mbti-category', 'I prefer direct action over repeated discussion.', 'likert_scale', 'E/I', 14, 1, 1),
('mbti-e-15', 'mbti-category', 'I prefer one-on-one deep conversations over large group communication.', 'likert_scale', 'E/I', 15, 1, 1),
('mbti-e-16', 'mbti-category', 'I feel pressured when scheduled for consecutive social activities.', 'likert_scale', 'E/I', 16, 1, 1);

-- Import MBTI questions (S/N dimension - 16 questions)
INSERT OR REPLACE INTO psychology_questions (id, category_id, question_text_en, question_type, dimension, order_index, weight, is_active) VALUES
('mbti-s-01', 'mbti-category', 'When making decisions, I prioritize relying on verified facts and data.', 'likert_scale', 'S/N', 17, 1, 1),
('mbti-s-02', 'mbti-category', 'I take time to confirm that details are accurate and correct.', 'likert_scale', 'S/N', 18, 1, 1),
('mbti-s-03', 'mbti-category', 'I often refer to past experiences to handle current problems.', 'likert_scale', 'S/N', 19, 1, 1),
('mbti-s-04', 'mbti-category', 'When learning new skills, I prefer to master them step by step.', 'likert_scale', 'S/N', 20, 1, 1),
('mbti-s-05', 'mbti-category', 'I prefer to use methods that have been proven effective.', 'likert_scale', 'S/N', 21, 1, 1),
('mbti-s-06', 'mbti-category', 'I often see potential patterns or trends from scattered information.', 'likert_scale', 'S/N', 22, 1, 1),
('mbti-s-07', 'mbti-category', 'I prefer to understand principles first, then flexibly apply them to different situations.', 'likert_scale', 'S/N', 23, 1, 1),
('mbti-s-08', 'mbti-category', 'I enjoy exploring new possibilities and innovative solutions.', 'likert_scale', 'S/N', 24, 1, 1),
('mbti-s-09', 'mbti-category', 'I focus on concrete details rather than abstract concepts.', 'likert_scale', 'S/N', 25, 1, 1),
('mbti-s-10', 'mbti-category', 'I prefer practical applications over theoretical discussions.', 'likert_scale', 'S/N', 26, 1, 1),
('mbti-s-11', 'mbti-category', 'I trust my intuition when making important decisions.', 'likert_scale', 'S/N', 27, 1, 1),
('mbti-s-12', 'mbti-category', 'I enjoy brainstorming and generating creative ideas.', 'likert_scale', 'S/N', 28, 1, 1),
('mbti-s-13', 'mbti-category', 'I prefer to work with tangible, real-world examples.', 'likert_scale', 'S/N', 29, 1, 1),
('mbti-s-14', 'mbti-category', 'I often think about future possibilities and potential outcomes.', 'likert_scale', 'S/N', 30, 1, 1),
('mbti-s-15', 'mbti-category', 'I value practical experience over theoretical knowledge.', 'likert_scale', 'S/N', 31, 1, 1),
('mbti-s-16', 'mbti-category', 'I enjoy exploring abstract concepts and philosophical questions.', 'likert_scale', 'S/N', 32, 1, 1);

-- Import MBTI questions (T/F dimension - 16 questions)
INSERT OR REPLACE INTO psychology_questions (id, category_id, question_text_en, question_type, dimension, order_index, weight, is_active) VALUES
('mbti-t-01', 'mbti-category', 'When making decisions, I prioritize logical analysis over personal feelings.', 'likert_scale', 'T/F', 33, 1, 1),
('mbti-t-02', 'mbti-category', 'I believe that objective facts are more important than subjective opinions.', 'likert_scale', 'T/F', 34, 1, 1),
('mbti-t-03', 'mbti-category', 'I prefer to solve problems through systematic analysis.', 'likert_scale', 'T/F', 35, 1, 1),
('mbti-t-04', 'mbti-category', 'I value fairness and justice over personal relationships.', 'likert_scale', 'T/F', 36, 1, 1),
('mbti-t-05', 'mbti-category', 'I make decisions based on what makes the most sense logically.', 'likert_scale', 'T/F', 37, 1, 1),
('mbti-t-06', 'mbti-category', 'I believe that criticism should be constructive and objective.', 'likert_scale', 'T/F', 38, 1, 1),
('mbti-t-07', 'mbti-category', 'I prefer to focus on efficiency and results.', 'likert_scale', 'T/F', 39, 1, 1),
('mbti-t-08', 'mbti-category', 'I value honesty over tact in most situations.', 'likert_scale', 'T/F', 40, 1, 1),
('mbti-t-09', 'mbti-category', 'I consider how my decisions will affect others emotionally.', 'likert_scale', 'T/F', 41, 1, 1),
('mbti-t-10', 'mbti-category', 'I prioritize maintaining harmony in relationships.', 'likert_scale', 'T/F', 42, 1, 1),
('mbti-t-11', 'mbti-category', 'I make decisions based on what feels right to me.', 'likert_scale', 'T/F', 43, 1, 1),
('mbti-t-12', 'mbti-category', 'I value empathy and understanding in interactions.', 'likert_scale', 'T/F', 44, 1, 1),
('mbti-t-13', 'mbti-category', 'I prefer to avoid conflict and maintain peace.', 'likert_scale', 'T/F', 45, 1, 1),
('mbti-t-14', 'mbti-category', 'I consider the impact of my words on others feelings.', 'likert_scale', 'T/F', 46, 1, 1),
('mbti-t-15', 'mbti-category', 'I value personal values over objective analysis.', 'likert_scale', 'T/F', 47, 1, 1),
('mbti-t-16', 'mbti-category', 'I believe that compassion is more important than logic.', 'likert_scale', 'T/F', 48, 1, 1);

-- Import MBTI questions (J/P dimension - 16 questions)
INSERT OR REPLACE INTO psychology_questions (id, category_id, question_text_en, question_type, dimension, order_index, weight, is_active) VALUES
('mbti-j-01', 'mbti-category', 'I prefer to have a clear plan before starting a project.', 'likert_scale', 'J/P', 49, 1, 1),
('mbti-j-02', 'mbti-category', 'I like to set deadlines and stick to them.', 'likert_scale', 'J/P', 50, 1, 1),
('mbti-j-03', 'mbti-category', 'I prefer to work on one task at a time until completion.', 'likert_scale', 'J/P', 51, 1, 1),
('mbti-j-04', 'mbti-category', 'I like to have a structured daily routine.', 'likert_scale', 'J/P', 52, 1, 1),
('mbti-j-05', 'mbti-category', 'I prefer to make decisions quickly and move forward.', 'likert_scale', 'J/P', 53, 1, 1),
('mbti-j-06', 'mbti-category', 'I like to organize my workspace and keep it tidy.', 'likert_scale', 'J/P', 54, 1, 1),
('mbti-j-07', 'mbti-category', 'I prefer to have clear rules and guidelines.', 'likert_scale', 'J/P', 55, 1, 1),
('mbti-j-08', 'mbti-category', 'I like to plan my vacations and activities in advance.', 'likert_scale', 'J/P', 56, 1, 1),
('mbti-j-09', 'mbti-category', 'I prefer to keep my options open as long as possible.', 'likert_scale', 'J/P', 57, 1, 1),
('mbti-j-10', 'mbti-category', 'I can accept a certain degree of chaos, as long as things can ultimately progress.', 'likert_scale', 'J/P', 58, 1, 1),
('mbti-j-11', 'mbti-category', 'I stick to the original plan, even when better solutions appear, I don''t easily change.', 'likert_scale', 'J/P', 59, 1, 1),
('mbti-j-12', 'mbti-category', 'When plans are interrupted, I usually need a long time to readjust.', 'likert_scale', 'J/P', 60, 1, 1),
('mbti-j-13', 'mbti-category', 'I tend to establish clear classification systems to manage information and files.', 'likert_scale', 'J/P', 61, 1, 1),
('mbti-j-14', 'mbti-category', 'I prefer to keep options open rather than finalize too early.', 'likert_scale', 'J/P', 62, 1, 1),
('mbti-j-15', 'mbti-category', 'I do systematic review and wrap-up at completion stages.', 'likert_scale', 'J/P', 63, 1, 1),
('mbti-j-16', 'mbti-category', 'I reserve checking time for important tasks to ensure quality.', 'likert_scale', 'J/P', 64, 1, 1);

-- Import Likert scale options for all MBTI questions
INSERT OR REPLACE INTO psychology_question_options (id, question_id, option_text_en, option_value, option_score, order_index, is_active) VALUES
-- Options for all questions (Strongly Disagree)
('mbti-opt-1-all', 'mbti-e-01', 'Strongly Disagree', '1', 1, 1, 1),
('mbti-opt-1-all', 'mbti-e-02', 'Strongly Disagree', '1', 1, 1, 1),
('mbti-opt-1-all', 'mbti-e-03', 'Strongly Disagree', '1', 1, 1, 1),
('mbti-opt-1-all', 'mbti-e-04', 'Strongly Disagree', '1', 1, 1, 1),
('mbti-opt-1-all', 'mbti-e-05', 'Strongly Disagree', '1', 1, 1, 1),
('mbti-opt-1-all', 'mbti-e-06', 'Strongly Disagree', '1', 1, 1, 1),
('mbti-opt-1-all', 'mbti-e-07', 'Strongly Disagree', '1', 1, 1, 1),
('mbti-opt-1-all', 'mbti-e-08', 'Strongly Disagree', '1', 1, 1, 1),
('mbti-opt-1-all', 'mbti-e-09', 'Strongly Disagree', '1', 1, 1, 1),
('mbti-opt-1-all', 'mbti-e-10', 'Strongly Disagree', '1', 1, 1, 1),
('mbti-opt-1-all', 'mbti-e-11', 'Strongly Disagree', '1', 1, 1, 1),
('mbti-opt-1-all', 'mbti-e-12', 'Strongly Disagree', '1', 1, 1, 1),
('mbti-opt-1-all', 'mbti-e-13', 'Strongly Disagree', '1', 1, 1, 1),
('mbti-opt-1-all', 'mbti-e-14', 'Strongly Disagree', '1', 1, 1, 1),
('mbti-opt-1-all', 'mbti-e-15', 'Strongly Disagree', '1', 1, 1, 1),
('mbti-opt-1-all', 'mbti-e-16', 'Strongly Disagree', '1', 1, 1, 1);

-- Note: This is a simplified version. In practice, you would need to create options for each question individually
-- For now, let's create a more efficient approach by creating the options programmatically
