-- Migration: Create Learning Ability Module Tables
-- Description: Creates tables for VARK learning style tests
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

-- Raven and Cognitive tests removed - no longer needed

-- Test Sessions Table
CREATE TABLE IF NOT EXISTS learning_test_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT, -- Optional, for authenticated users
    test_type TEXT NOT NULL CHECK (test_type IN ('vark')),
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

-- Raven and Cognitive answers tables removed - no longer needed

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

-- Raven and Cognitive results tables removed - no longer needed

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
-- Raven and Cognitive indexes removed - no longer needed
CREATE INDEX IF NOT EXISTS idx_learning_test_sessions_user_id ON learning_test_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_test_sessions_test_type ON learning_test_sessions(test_type);
CREATE INDEX IF NOT EXISTS idx_learning_test_sessions_status ON learning_test_sessions(status);
CREATE INDEX IF NOT EXISTS idx_vark_answers_session_id ON vark_answers(session_id);
-- Raven and Cognitive answer indexes removed - no longer needed
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

-- Raven and Cognitive sample data removed - no longer needed
