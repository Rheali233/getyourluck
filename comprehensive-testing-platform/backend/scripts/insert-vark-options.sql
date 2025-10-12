-- Insert complete VARK options for all 16 questions
-- Each question has 4 options (V, A, R, K dimensions)

-- Question 3: When trying to remember something, I:
INSERT INTO vark_options (id, question_id, text, dimension, weight) VALUES
('opt_003_v', 'vark_v_003', 'Visualize it in my mind', 'V', 2),
('opt_003_a', 'vark_v_003', 'Say it out loud or repeat it', 'A', 1),
('opt_003_r', 'vark_v_003', 'Write it down or create a list', 'R', 1),
('opt_003_k', 'vark_v_003', 'Act it out or use gestures', 'K', 1);

-- Question 4: I prefer to organize my thoughts by:
INSERT INTO vark_options (id, question_id, text, dimension, weight) VALUES
('opt_004_v', 'vark_v_004', 'Drawing diagrams and mind maps', 'V', 2),
('opt_004_a', 'vark_v_004', 'Talking through ideas with someone', 'A', 1),
('opt_004_r', 'vark_v_004', 'Writing detailed outlines', 'R', 1),
('opt_004_k', 'vark_v_004', 'Using physical objects to model', 'K', 1);

-- Question 5: When learning a new concept, I prefer to:
INSERT INTO vark_options (id, question_id, text, dimension, weight) VALUES
('opt_005_v', 'vark_a_001', 'See demonstrations and examples', 'V', 1),
('opt_005_a', 'vark_a_001', 'Have someone explain it to me', 'A', 2),
('opt_005_r', 'vark_a_001', 'Read about it in detail', 'R', 1),
('opt_005_k', 'vark_a_001', 'Try it out myself', 'K', 1);

-- Question 6: I remember things best when I:
INSERT INTO vark_options (id, question_id, text, dimension, weight) VALUES
('opt_006_v', 'vark_a_002', 'See visual patterns', 'V', 1),
('opt_006_a', 'vark_a_002', 'Hear them spoken', 'A', 2),
('opt_006_r', 'vark_a_002', 'Read them written down', 'R', 1),
('opt_006_k', 'vark_a_002', 'Do them physically', 'K', 1);

-- Question 7: When solving problems, I like to:
INSERT INTO vark_options (id, question_id, text, dimension, weight) VALUES
('opt_007_v', 'vark_a_003', 'Draw or sketch the situation', 'V', 1),
('opt_007_a', 'vark_a_003', 'Talk through it with someone', 'A', 2),
('opt_007_r', 'vark_a_003', 'Write down the steps', 'R', 1),
('opt_007_k', 'vark_a_003', 'Use physical objects', 'K', 1);

-- Question 8: I prefer to receive feedback in the form of:
INSERT INTO vark_options (id, question_id, text, dimension, weight) VALUES
('opt_008_v', 'vark_a_004', 'Visual charts and graphs', 'V', 1),
('opt_008_a', 'vark_a_004', 'Verbal explanations', 'A', 2),
('opt_008_r', 'vark_a_004', 'Written reports', 'R', 1),
('opt_008_k', 'vark_a_004', 'Physical demonstrations', 'K', 1);

-- Question 9: I prefer to learn new information by:
INSERT INTO vark_options (id, question_id, text, dimension, weight) VALUES
('opt_009_v', 'vark_r_001', 'Looking at diagrams', 'V', 1),
('opt_009_a', 'vark_r_001', 'Listening to explanations', 'A', 1),
('opt_009_r', 'vark_r_001', 'Reading books and articles', 'R', 2),
('opt_009_k', 'vark_r_001', 'Hands-on practice', 'K', 1);

-- Question 10: When taking notes, I prefer to:
INSERT INTO vark_options (id, question_id, text, dimension, weight) VALUES
('opt_010_v', 'vark_r_002', 'Draw diagrams and symbols', 'V', 1),
('opt_010_a', 'vark_r_002', 'Record audio and listen later', 'A', 1),
('opt_010_r', 'vark_r_002', 'Write detailed text', 'R', 2),
('opt_010_k', 'vark_r_002', 'Create physical models', 'K', 1);

-- Question 11: I organize information best by:
INSERT INTO vark_options (id, question_id, text, dimension, weight) VALUES
('opt_011_v', 'vark_r_003', 'Creating visual systems', 'V', 1),
('opt_011_a', 'vark_r_003', 'Discussing with others', 'A', 1),
('opt_011_r', 'vark_r_003', 'Writing lists and outlines', 'R', 2),
('opt_011_k', 'vark_r_003', 'Physical arrangement', 'K', 1);

-- Question 12: I prefer to express my ideas through:
INSERT INTO vark_options (id, question_id, text, dimension, weight) VALUES
('opt_012_v', 'vark_r_004', 'Drawing and diagrams', 'V', 1),
('opt_012_a', 'vark_r_004', 'Speaking and presentations', 'A', 1),
('opt_012_r', 'vark_r_004', 'Writing and documentation', 'R', 2),
('opt_012_k', 'vark_r_004', 'Physical demonstrations', 'K', 1);

-- Question 13: When learning a new skill, I prefer to:
INSERT INTO vark_options (id, question_id, text, dimension, weight) VALUES
('opt_013_v', 'vark_k_001', 'Watch someone demonstrate it', 'V', 1),
('opt_013_a', 'vark_k_001', 'Have someone explain it', 'A', 1),
('opt_013_r', 'vark_k_001', 'Read instructions', 'R', 1),
('opt_013_k', 'vark_k_001', 'Try it out myself', 'K', 2);

-- Question 14: I remember things best when I:
INSERT INTO vark_options (id, question_id, text, dimension, weight) VALUES
('opt_014_v', 'vark_k_002', 'See them visually', 'V', 1),
('opt_014_a', 'vark_k_002', 'Hear them spoken', 'A', 1),
('opt_014_r', 'vark_k_002', 'Read them written', 'R', 1),
('opt_014_k', 'vark_k_002', 'Do them physically', 'K', 2);

-- Question 15: When solving problems, I like to:
INSERT INTO vark_options (id, question_id, text, dimension, weight) VALUES
('opt_015_v', 'vark_k_003', 'Draw diagrams', 'V', 1),
('opt_015_a', 'vark_k_003', 'Talk through them', 'A', 1),
('opt_015_r', 'vark_k_003', 'Write down steps', 'R', 1),
('opt_015_k', 'vark_k_003', 'Use physical objects', 'K', 2);

-- Question 16: I prefer to learn in environments where I can:
INSERT INTO vark_options (id, question_id, text, dimension, weight) VALUES
('opt_016_v', 'vark_k_004', 'See visual aids clearly', 'V', 1),
('opt_016_a', 'vark_k_004', 'Hear instructions clearly', 'A', 1),
('opt_016_r', 'vark_k_004', 'Read materials easily', 'R', 1),
('opt_016_k', 'vark_k_004', 'Move around and be active', 'K', 2);
