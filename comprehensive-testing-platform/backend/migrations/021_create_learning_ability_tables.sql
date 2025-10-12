-- Migration: Create Learning Ability Module Tables
-- Description: Creates tables for VARK, Raven, and Cognitive tests
-- Date: 2024-01-XX

-- VARK Learning Style Test Tables
CREATE TABLE IF NOT EXISTS vark_questions (
    id TEXT PRIMARY KEY,
    question_text TEXT NOT NULL,
    category TEXT NOT NULL,
    dimension TEXT NOT NULL CHECK (dimension IN ('V', 'A', 'R', 'K')),
    weight INTEGER NOT NULL DEFAULT 1,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS vark_options (
    id TEXT PRIMARY KEY,
    question_id TEXT NOT NULL,
    text TEXT NOT NULL,
    dimension TEXT NOT NULL CHECK (dimension IN ('V', 'A', 'R', 'K')),
    weight INTEGER NOT NULL DEFAULT 1,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (question_id) REFERENCES vark_questions(id) ON DELETE CASCADE
);

-- Raven Progressive Matrices Test Tables
CREATE TABLE IF NOT EXISTS raven_questions (
    id TEXT PRIMARY KEY,
    difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
    pattern TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    options TEXT NOT NULL, -- JSON array of options
    correct_answer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Cognitive Ability Assessment Tables
CREATE TABLE IF NOT EXISTS cognitive_tasks (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('working_memory', 'attention', 'processing_speed', 'executive_function')),
    subtype TEXT NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT NOT NULL,
    duration INTEGER NOT NULL, -- Duration in milliseconds
    scoring TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Test Sessions Table
CREATE TABLE IF NOT EXISTS learning_test_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT, -- Optional, for authenticated users
    test_type TEXT NOT NULL CHECK (test_type IN ('vark', 'raven', 'cognitive')),
    start_time TEXT NOT NULL,
    end_time TEXT,
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    language TEXT NOT NULL DEFAULT 'en',
    user_agent TEXT,
    ip_address TEXT,
    total_questions INTEGER NOT NULL,
    answered_questions INTEGER NOT NULL DEFAULT 0,
    time_spent INTEGER NOT NULL DEFAULT 0, -- Time spent in milliseconds
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- VARK Answers Table
CREATE TABLE IF NOT EXISTS vark_answers (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    question_id TEXT NOT NULL,
    selected_options TEXT NOT NULL, -- JSON array of selected option IDs
    time_spent INTEGER NOT NULL, -- Time spent in milliseconds
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (session_id) REFERENCES learning_test_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES vark_questions(id) ON DELETE CASCADE
);

-- Raven Answers Table
CREATE TABLE IF NOT EXISTS raven_answers (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    question_id TEXT NOT NULL,
    selected_answer TEXT NOT NULL,
    is_correct INTEGER NOT NULL DEFAULT 0,
    time_spent INTEGER NOT NULL, -- Time spent in milliseconds
    attempts INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (session_id) REFERENCES learning_test_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES raven_questions(id) ON DELETE CASCADE
);

-- Cognitive Answers Table
CREATE TABLE IF NOT EXISTS cognitive_answers (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    task_id TEXT NOT NULL,
    task_type TEXT NOT NULL,
    results TEXT NOT NULL, -- JSON object with task-specific results
    time_spent INTEGER NOT NULL, -- Time spent in milliseconds
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (session_id) REFERENCES learning_test_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES cognitive_tasks(id) ON DELETE CASCADE
);

-- VARK Results Table
CREATE TABLE IF NOT EXISTS vark_results (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,
    scores TEXT NOT NULL, -- JSON object with V, A, R, K scores
    primary_style TEXT NOT NULL CHECK (primary_style IN ('V', 'A', 'R', 'K')),
    secondary_styles TEXT NOT NULL, -- JSON array of secondary styles
    is_mixed INTEGER NOT NULL DEFAULT 0,
    balance_score INTEGER NOT NULL,
    style_analysis TEXT NOT NULL,
    learning_advice TEXT NOT NULL,
    environment_suggestions TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (session_id) REFERENCES learning_test_sessions(id) ON DELETE CASCADE
);

-- Raven Results Table
CREATE TABLE IF NOT EXISTS raven_results (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,
    raw_score INTEGER NOT NULL,
    adjusted_score INTEGER NOT NULL,
    percentile INTEGER NOT NULL CHECK (percentile BETWEEN 0 AND 100),
    iq_estimate TEXT NOT NULL, -- JSON object with min, max, confidence
    ability_level TEXT NOT NULL,
    difficulty_analysis TEXT NOT NULL, -- JSON object with difficulty level breakdown
    pattern_recognition TEXT NOT NULL,
    logical_reasoning TEXT NOT NULL,
    training_recommendations TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (session_id) REFERENCES learning_test_sessions(id) ON DELETE CASCADE
);

-- Cognitive Results Table
CREATE TABLE IF NOT EXISTS cognitive_results (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,
    working_memory TEXT NOT NULL, -- JSON object with score, percentile, level, description
    attention TEXT NOT NULL, -- JSON object with score, percentile, level, description
    processing_speed TEXT NOT NULL, -- JSON object with score, percentile, level, description
    executive_function TEXT NOT NULL, -- JSON object with score, percentile, level, description
    overall_score INTEGER NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
    cognitive_profile TEXT NOT NULL,
    strength_areas TEXT NOT NULL, -- JSON array of strength areas
    development_areas TEXT NOT NULL, -- JSON array of development areas
    training_recommendations TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (session_id) REFERENCES learning_test_sessions(id) ON DELETE CASCADE
);

-- Test Feedback Table
CREATE TABLE IF NOT EXISTS test_feedback (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    feedback TEXT NOT NULL CHECK (feedback IN ('like', 'dislike')),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (session_id) REFERENCES learning_test_sessions(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vark_questions_dimension ON vark_questions(dimension);
CREATE INDEX IF NOT EXISTS idx_vark_questions_category ON vark_questions(category);
CREATE INDEX IF NOT EXISTS idx_vark_options_question_id ON vark_options(question_id);
CREATE INDEX IF NOT EXISTS idx_raven_questions_difficulty ON raven_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_cognitive_tasks_type ON cognitive_tasks(type);
CREATE INDEX IF NOT EXISTS idx_learning_test_sessions_user_id ON learning_test_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_test_sessions_test_type ON learning_test_sessions(test_type);
CREATE INDEX IF NOT EXISTS idx_learning_test_sessions_status ON learning_test_sessions(status);
CREATE INDEX IF NOT EXISTS idx_vark_answers_session_id ON vark_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_raven_answers_session_id ON raven_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_cognitive_answers_session_id ON cognitive_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_test_feedback_session_id ON test_feedback(session_id);

-- Insert sample VARK questions
INSERT INTO vark_questions (id, question_text, category, dimension, weight) VALUES
('vark_v_001', 'When studying for an exam, I prefer to:', 'study_methods', 'V', 2),
('vark_v_002', 'I learn best when information is presented as:', 'information_presentation', 'V', 2),
('vark_v_003', 'When trying to remember something, I:', 'memory_strategies', 'V', 2),
('vark_v_004', 'I prefer to organize my thoughts by:', 'thought_organization', 'V', 2),
('vark_a_001', 'When learning a new concept, I prefer to:', 'concept_learning', 'A', 2),
('vark_a_002', 'I remember things best when I:', 'memory_preferences', 'A', 2),
('vark_a_003', 'When solving problems, I like to:', 'problem_solving', 'A', 2),
('vark_a_004', 'I prefer to receive feedback in the form of:', 'feedback_preferences', 'A', 2),
('vark_r_001', 'I prefer to learn new information by:', 'information_learning', 'R', 2),
('vark_r_002', 'When taking notes, I prefer to:', 'note_taking', 'R', 2),
('vark_r_003', 'I organize information best by:', 'information_organization', 'R', 2),
('vark_r_004', 'I prefer to express my ideas through:', 'idea_expression', 'R', 2),
('vark_k_001', 'When learning a new skill, I prefer to:', 'skill_learning', 'K', 2),
('vark_k_002', 'I remember things best when I:', 'memory_methods', 'K', 2),
('vark_k_003', 'When solving problems, I like to:', 'problem_solving_methods', 'K', 2),
('vark_k_004', 'I prefer to learn in environments where I can:', 'learning_environment', 'K', 2);

-- Insert sample VARK options
INSERT INTO vark_options (id, question_id, text, dimension, weight) VALUES
-- VARK V_001 options
('opt_001_v', 'vark_v_001', 'Create mind maps and diagrams', 'V', 2),
('opt_001_a', 'vark_v_001', 'Listen to recorded lectures', 'A', 1),
('opt_001_r', 'vark_v_001', 'Read and take detailed notes', 'R', 1),
('opt_001_k', 'vark_v_001', 'Practice with hands-on exercises', 'K', 1),
-- VARK V_002 options
('opt_002_v', 'vark_v_002', 'Charts, graphs, and visual aids', 'V', 2),
('opt_002_a', 'vark_v_002', 'Spoken explanations and discussions', 'A', 1),
('opt_002_r', 'vark_v_002', 'Written text and bullet points', 'R', 1),
('opt_002_k', 'vark_v_002', 'Physical demonstrations and activities', 'K', 1);

-- Insert sample Raven questions
INSERT INTO raven_questions (id, difficulty, pattern, description, image_url, options, correct_answer, explanation) VALUES
('raven_001', 1, 'linear_progression', 'Simple linear progression pattern', '/images/raven/level1/001.png', '["A", "B", "C", "D", "E", "F", "G", "H"]', 'E', 'Each row follows a simple counting pattern'),
('raven_002', 1, 'rotation', 'Element rotation pattern', '/images/raven/level1/002.png', '["A", "B", "C", "D", "E", "F", "G", "H"]', 'C', 'Elements rotate 90 degrees clockwise in each row'),
('raven_003', 2, 'transformation', 'Shape transformation pattern', '/images/raven/level2/003.png', '["A", "B", "C", "D", "E", "F", "G", "H"]', 'F', 'Shapes transform systematically across rows and columns');

-- Insert sample cognitive tasks
INSERT INTO cognitive_tasks (id, type, subtype, description, instructions, duration, scoring) VALUES
('cog_wm_001', 'working_memory', 'digit_span', 'Remember the sequence of numbers', 'Listen to the numbers and repeat them back in the same order', 30000, 'Correct sequence length + accuracy'),
('cog_wm_002', 'working_memory', 'letter_number_sequencing', 'Remember and reorder mixed letters and numbers', 'Listen to the sequence and repeat back with numbers first, then letters', 45000, 'Correct reordering length + accuracy + time'),
('cog_att_001', 'attention', 'sustained_attention', 'Maintain focus on a continuous task', 'Press the button when you see the target letter combination', 300000, 'Correct identification rate + reaction time consistency'),
('cog_att_002', 'attention', 'selective_attention', 'Focus on relevant information while ignoring distractions', 'Name the color of the text, not the word itself', 120000, 'Accuracy + interference effect size + reaction time'),
('cog_ps_001', 'processing_speed', 'symbol_coding', 'Quickly match symbols to numbers', 'Match each symbol to its corresponding number as quickly as possible', 120000, 'Correct matches + average reaction time + accuracy'),
('cog_ps_002', 'processing_speed', 'pattern_matching', 'Quickly identify matching patterns', 'Find the pattern that matches the target as quickly as possible', 90000, 'Correct matches + reaction speed + accuracy'),
('cog_ef_001', 'executive_function', 'cognitive_flexibility', 'Switch between different task rules', 'Switch between sorting by color and shape based on the cue', 180000, 'Switch cost + accuracy + reaction time'),
('cog_ef_002', 'executive_function', 'inhibitory_control', 'Control automatic responses', 'Press button for green circles, withhold response for red circles', 120000, 'Inhibition error rate + reaction time + accuracy');
